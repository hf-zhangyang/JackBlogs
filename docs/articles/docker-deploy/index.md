# Docker 容器部署个人服务最佳实践

## 概述

本文介绍 Docker 容器部署个人服务的最佳实践，包括镜像优化、数据持久化、网络配置和多服务编排。

## 基础镜像优化

### 选择合适的基础镜像

```dockerfile
# 推荐：使用 alpine 版本减小镜像体积
FROM node:20-alpine

# 不推荐：标准版本镜像体积较大
# FROM node:20
```

### 多阶段构建

```dockerfile
# 构建阶段
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# 运行阶段
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

## 数据持久化

### Volume 挂载

```bash
# 创建命名卷
docker volume create app_data

# 挂载到容器
docker run -v app_data:/app/data my-app
```

### Bind Mount

```bash
# 挂载主机目录
docker run -v /host/path:/container/path my-app
```

## 网络配置

### 自定义网络

```bash
# 创建网络
docker network create my-network

# 连接容器
docker run --network my-network --name db postgres
docker run --network my-network --name app my-app
```

### 端口映射

```bash
# 映射端口 -p 主机端口:容器端口
docker run -p 8080:3000 my-app
```

## 多服务编排

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - db
    volumes:
      - app_data:/app/data
    environment:
      - NODE_ENV=production

  db:
    image: postgres:15-alpine
    volumes:
      - db_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=secretpassword

volumes:
  app_data:
  db_data:
```

## 安全建议

1. **不要在镜像中包含敏感信息** - 使用环境变量或 secrets
2. **以非 root 用户运行** - 添加 `USER` 指令
3. **定期更新基础镜像** - 获取安全补丁
4. **扫描镜像漏洞** - 使用 `docker scan`

## 监控和日志

```bash
# 查看容器日志
docker logs -f my-app

# 查看容器资源使用
docker stats my-app

# 容器健康检查
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:3000/health || exit 1
```

## 总结

- 使用 alpine 基础镜像减小体积
- 采用多阶段构建优化镜像
- 合理使用 Volume 持久化数据
- 通过 docker-compose 编排多服务
- 遵循安全最佳实践

---

**最后更新：** 2026-03-30