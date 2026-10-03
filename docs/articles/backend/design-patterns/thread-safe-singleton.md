---
title: 线程安全单例模式实现指南
desc: Lazy<T>、lock 双重检查与 Interlocked 三种实现的代码、对比与选型建议
date: 2026-10-03
---

# 线程安全单例模式实现指南

## 使用 `Lazy<T>` 实现单例模式

### 基本实现

```csharp
public class Singleton<T> where T : class, new()
{
    // 使用 Lazy<T> 延迟初始化单例实例
    private static readonly Lazy<T> _lazy = new Lazy<T>(() => new T(), LazyThreadSafetyMode.ExecutionAndPublication);

    // 私有构造函数防止外部实例化
    private Singleton() { }

    // 提供全局访问点
    public static T Instance => _lazy.Value;
}
```

### 实现细节解释

1. **`Lazy<T>` 初始化**：
   - `new Lazy<T>(...)` 创建一个延迟初始化的包装器
   - 第一个参数是委托，用于创建实例 `() => new T()`
   - 第二个参数指定线程安全模式

2. **线程安全模式**：
   - `LazyThreadSafetyMode.ExecutionAndPublication`：确保只有一个线程能执行初始化委托，所有其他线程等待初始化完成
   - 这是 `Lazy<T>` 的默认线程安全模式，也是单例模式最适合的模式

3. **属性访问**：
   - `Instance` 属性使用 `=>` 简化语法
   - 第一次访问时，`_lazy.Value` 会触发初始化
   - 后续访问直接返回已初始化的实例

### 使用示例

```csharp
public class Logger
{
    // Logger 类的实现
    public void Log(string message)
    {
        Console.WriteLine($"Logging: {message}");
    }
}

// 使用单例
var logger = Singleton<Logger>.Instance;
logger.Log("This is a test message");
```

### 高级用法

#### 复杂初始化逻辑

```csharp
public class Singleton<T> where T : class
{
    private static readonly Lazy<T> _lazy;

    static Singleton()
    {
        _lazy = new Lazy<T>(() => CreateInstance(), LazyThreadSafetyMode.ExecutionAndPublication);
    }

    private static T CreateInstance()
    {
        // 这里可以添加更复杂的初始化逻辑
        // 例如依赖注入、配置读取等
        return Activator.CreateInstance<T>();
    }

    public static T Instance => _lazy.Value;
}
```

#### 序列化支持

```csharp
[Serializable]
public class MySingleton : ISerializable
{
    private static readonly Lazy<MySingleton> _lazy = new Lazy<MySingleton>(() => new MySingleton(), LazyThreadSafetyMode.ExecutionAndPublication);

    private MySingleton() { }

    public static MySingleton Instance => _lazy.Value;

    // 实现序列化接口
    protected MySingleton(SerializationInfo info, StreamingContext context)
    {
        // 反序列化逻辑
    }

    public void GetObjectData(SerializationInfo info, StreamingContext context)
    {
        // 序列化逻辑
    }
}
```

## Lock 双重检查锁定实现

### 基本实现

```csharp
public class Singleton<T> where T : class, new()
{
    private static volatile T _instance;
    private static readonly object _lock = new object();

    private Singleton() { }

    public static T Instance
    {
        get
        {
            if (_instance == null)
            {
                lock (_lock)
                {
                    if (_instance == null)
                    {
                        _instance = new T();
                    }
                }
            }
            return _instance;
        }
    }
}
```

### 实现细节

1. **volatile 关键字**：
   - 使用 `volatile` 修饰 `_instance` 确保多线程环境下的可见性
   - 防止指令重排序，避免其他线程获取到未完全初始化的实例

2. **双重检查**：
   - 第一次检查（`if (_instance == null)`）：避免不必要的同步
   - 第二次检查（在同步块内）：确保只有一个线程能创建实例

3. **私有锁对象**：
   - 使用 `_lock` 对象而不是锁定 `this` 或类型本身，减少锁争用

## Interlocked.CompareExchange 实现

### 基本实现

```csharp
public class Singleton<T> where T : class, new()
{
    private static volatile T _instance;

    public static T Instance
    {
        get
        {
            if (_instance == null)
            {
                Interlocked.CompareExchange(ref _instance, new T(), null);
            }
            return _instance;
        }
    }
}
```

### 改进实现

```csharp
public class Singleton<T> where T : class, new()
{
    private static volatile T _instance;

    public static T Instance
    {
        get
        {
            var temp = _instance;
            if (temp == null)
            {
                temp = new T();
                Interlocked.CompareExchange(ref _instance, temp, null);
                temp = _instance;
            }
            return temp;
        }
    }
}
```

## 各种实现方式的比较

| 实现方式 | 线程安全 | 延迟初始化 | 代码简洁性 | 性能 | 适用场景 |
|---------|---------|-----------|-----------|------|---------|
| `Lazy<T>` | 是 | 是 | 最佳 | 优秀 | .NET 4.0+ 推荐方式 |
| lock 双重检查 | 是 | 是 | 一般 | 良好 | 需要精细控制锁的场景 |
| Interlocked | 可能 | 是 | 简单但易出错 | 好 | 性能关键场景 |

### 1. 性能差异

- **`Lazy<T>`**：
  - 由 .NET 运行时优化，性能优秀
  - 只在初始化时同步，后续访问无开销

- **lock 双重检查**：
  - 性能较好，但不如 `Lazy<T>`
  - 需要显式管理锁

- **Interlocked**：
  - 性能最好，但实现复杂
  - 容易出错，特别是处理竞态条件时

### 2. 线程安全保证

- **`Lazy<T>`**：
  - 由 .NET 运行时保证线程安全
  - 内部使用优化的同步机制

- **lock 双重检查**：
  - 通过锁和双重检查保证线程安全
  - 需要正确使用 volatile

- **Interlocked**：
  - 使用原子操作保证部分线程安全
  - 需要额外处理竞态条件

## 最佳实践和注意事项

### 1. 选择合适的实现方式

- **优先使用 `Lazy<T>`**：在 .NET 4.0 及更高版本中，这是最佳选择
- **使用 lock 双重检查**：如果需要更精细的控制或使用旧版 .NET
- **谨慎使用 Interlocked**：仅在性能极端敏感且能确保正确实现的情况下使用

### 2. 通用注意事项

1. **私有构造函数**：确保单例类有私有构造函数防止外部实例化

2. **线程安全**：无论选择哪种实现，都要确保线程安全

3. **延迟初始化**：考虑是否需要延迟初始化，以及初始化的开销

4. **序列化支持**：如果单例需要支持序列化，实现适当的序列化接口

5. **异常处理**：处理初始化过程中可能出现的异常

6. **性能考虑**：不要过早优化，除非有明确的性能瓶颈

### 3. `Lazy<T>` 特定注意事项

1. **指定线程安全模式**：明确指定 `LazyThreadSafetyMode.ExecutionAndPublication`

2. **异常处理**：初始化委托中的异常会被缓存，后续访问会重新抛出

3. **依赖注入**：考虑与依赖注入框架的集成

### 4. Lock 双重检查特定注意事项

1. **volatile 的使用**：确保正确使用 volatile 防止指令重排序

2. **锁对象选择**：使用私有静态对象作为锁，避免锁定 this 或类型

3. **双重检查必要性**：确保两次检查都正确实现

### 5. Interlocked 特定注意事项

1. **竞态条件处理**：仔细处理可能出现的竞态条件

2. **原子操作范围**：理解 Interlocked 操作的范围和限制

3. **性能测试**：在高并发场景下进行充分的性能测试

### 6. 两个容易被忽略的坑

**泛型包装器不是真正的单例约束。** 上面的 `Singleton<T>` 写法中，`private Singleton() { }` 只能禁止外部实例化这个**包装类**，
对 `T` 本身没有任何约束 —— `where T : class, new()` 反而要求 `T` 必须有公开无参构造函数，任何人都可以 `new Logger()`。
如果目标确实是"全进程唯一"，应当封闭具体类型（`public sealed class Logger { private Logger() {} ... }`，静态实例写在 `Logger` 内部）；
泛型包装器只适合"每闭合一个 `T` 一个实例"的场景，两者不要混用。

**序列化会绕过私有构造函数。** `ISerializable` / 反序列化路径不经过构造函数，默认会造出第二个实例。
要真正守住唯一性，需要在反序列化回填时返回已有实例（实现 `IObjectReference.GetRealObject()`），
否则"支持序列化"的单例反而成了破坏单例的入口。

## 结论

在 .NET 开发中，实现线程安全的单例模式有多种选择：

1. **`Lazy<T>`** 是最推荐的方式，特别是在 .NET 4.0 及更高版本中，它提供了简洁、高效且可靠的解决方案。

2. **lock 双重检查** 是一种经典实现方式，适用于需要更精细控制的场景。

3. **Interlocked** 提供了最佳性能，但实现复杂且容易出错。

在选择实现方式时，应考虑项目需求、.NET 版本、性能要求以及团队对各种实现方式的熟悉程度。在大多数情况下，`Lazy<T>` 是最佳选择，因为它平衡了性能、简洁性和可靠性。
