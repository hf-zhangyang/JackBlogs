# Git 常用命令指南

## 基础命令

### 初始化和克隆

```bash
# 初始化新仓库
git init

# 克隆远程仓库
git clone <repository-url>
git clone <repository-url> <directory-name>  # 克隆到指定目录

# 查看仓库状态
git status
```

### 添加和提交

```bash
# 添加文件到暂存区
git add <file>
git add .           # 添加所有文件
git add *.js        # 添加所有 js 文件
git add -A          # 添加所有变化（包括删除）

# 提交更改
git commit -m "commit message"
git commit -am "commit message"  # 添加并提交（已跟踪文件）
git commit --amend              # 修改最后一次提交
```

### 分支操作

```bash
# 查看分支
git branch              # 查看本地分支
git branch -r           # 查看远程分支
git branch -a           # 查看所有分支

# 创建分支
git branch <branch-name>
git checkout -b <branch-name>  # 创建并切换分支

# 切换分支
git checkout <branch-name>
git switch <branch-name>        # Git 2.23+

# 删除分支
git branch -d <branch-name>     # 删除本地分支
git branch -D <branch-name>     # 强制删除
git push origin --delete <branch-name>  # 删除远程分支

# 重命名分支
git branch -m <old-name> <new-name>
```

## 远程操作

### 远程仓库管理

```bash
# 查看远程仓库
git remote -v

# 添加远程仓库
git remote add origin <repository-url>

# 删除远程仓库
git remote remove origin

# 更改远程仓库 URL
git remote set-url origin <new-url>

# 获取远程更新
git fetch origin
git fetch --all
```

### 推送和拉取

```bash
# 推送到远程
git push origin <branch-name>
git push -u origin <branch-name>   # 首次推送并设置跟踪
git push                            # 推送到当前分支的跟踪远程
git push --all origin               # 推送所有分支
git push --tags                     # 推送所有标签

# 拉取远程更新
git pull origin <branch-name>
git pull                           # 拉取当前分支的跟踪远程

# 拉取与合并的区别
git fetch origin                    # 只获取不合并
git merge origin/main              # 合并远程分支
```

## 历史和查看

### 查看历史

```bash
# 查看提交历史
git log
git log --oneline                  # 简洁显示
git log --graph --oneline --all    # 图形化显示
git log -n 5                       # 显示最近 5 次

# 查看文件历史
git log --follow <file>
git log -p <file>                  # 显示文件变化

# 查看分支图
git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
```

### 查看差异

```bash
# 查看工作区差异
git diff
git diff <file>
git diff <branch1> <branch2>

# 查看暂存区差异
git diff --staged
git diff --cached

# 查看暂存区与工作区差异
git diff HEAD
```

### 查看文件内容

```bash
# 查看指定提交的文件
git show <commit>:<file>

# 查看某次提交的变化
git show <commit>

# 查看文件的所有版本
git log -p <file>
```

## 撤销操作

### 撤销工作区修改

```bash
# 撤销文件修改
git restore <file>        # Git 2.23+
git checkout -- <file>    # 传统方法

# 撤销所有修改
git restore .
git checkout -- .
```

### 撤销暂存区

```bash
# 取消暂存
git restore --staged <file>
git reset HEAD <file>     # 传统方法

# 取消所有暂存
git restore --staged .
git reset HEAD .
```

### 撤销提交

```bash
# 撤销最后一次提交（保留更改）
git reset --soft HEAD~1

# 撤销最后一次提交（不保留更改）
git reset --hard HEAD~1

# 撤销指定提交（保留更改）
git revert <commit>
```

## 标签管理

```bash
# 创建标签
git tag v1.0.0
git tag -a v1.0.0 -m "Version 1.0.0"  # 带注释的标签

# 查看标签
git tag
git show v1.0.0

# 推送标签
git push origin v1.0.0
git push --tags                   # 推送所有标签

# 删除标签
git tag -d v1.0.0                 # 删除本地标签
git push origin --delete v1.0.0   # 删除远程标签
```

## 储藏功能

```bash
# 储藏当前工作
git stash
git stash save "message"

# 查看储藏列表
git stash list

# 应用储藏
git stash apply                  # 应用但不删除
git stash pop                    # 应用并删除

# 删除储藏
git stash drop <stash-id>
git stash clear                  # 删除所有储藏
```

## 实用技巧

### 1. 查找特定提交

```bash
# 查找添加或删除特定字符串的提交
git log -S "function_name"

# 查找修改特定文件的提交
git log -- <file>
```

### 2. 统计代码

```bash
# 统计提交次数
git shortlog -sn

# 统计代码行数
git log --author="Your Name" --pretty=tformat: --numstat | awk '{add += $1; subs += $2} END {printf "added: %s, removed: %s\n", add, subs}'
```

### 3. 清理

```bash
# 清理未跟踪的文件
git clean -f

# 清理未跟踪的文件和目录
git clean -fd

# 预览将要清理的文件
git clean -n
```

### 4. 别名设置

```bash
# 常用别名
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual 'log --graph --oneline --all'
```

## 常见问题

### 1. 合并冲突

```bash
# 放弃合并
git merge --abort

# 手动解决冲突后
git add <resolved-files>
git commit
```

### 2. 推送被拒绝

```bash
# 先拉取远程更新
git pull --rebase

# 或者强制推送（谨慎使用）
git push --force
```

### 3. 恢复删除的提交

```bash
# 查找丢失的提交
git reflog

# 恢复提交
git checkout <commit-hash>
git branch <new-branch-name>
```

## 工作流建议

### 功能分支工作流

```bash
# 1. 创建功能分支
git checkout -b feature/new-feature

# 2. 开发并提交
git add .
git commit -m "Add new feature"

# 3. 推送到远程
git push -u origin feature/new-feature

# 4. 合并到主分支
git checkout main
git merge feature/new-feature
git push origin main

# 5. 删除功能分支
git branch -d feature/new-feature
git push origin --delete feature/new-feature
```

## 总结

掌握这些 Git 命令可以应对大部分日常开发场景：

- ✅ **基础操作**：init, clone, add, commit
- ✅ **分支管理**：branch, checkout, merge
- ✅ **远程操作**：push, pull, fetch
- ✅ **历史查看**：log, diff, show
- ✅ **撤销操作**：reset, restore, revert

建议结合图形化工具（如 GitKraken、Sourcetree）提高效率。