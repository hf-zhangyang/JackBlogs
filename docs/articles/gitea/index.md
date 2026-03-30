# 轻量级代码仓库 Gitea 本地搭建教程

## 概述

Gitea 是一个轻量级的自托管 Git 服务器，类似 GitHub，但资源占用更小。本文介绍如何使用 Docker 快速部署 Gitea。

## 为什么选择 Gitea？

- **轻量级**：相比 GitLab，资源占用极低
- **易部署**：单个二进制文件或 Docker 容器
- **功能完善**：支持 Issues、PR、Wiki、Actions 等
- **兼容性**：与 GitHub API 高度兼容

## Docker 部署

### docker-compose.yml

```yaml
version: "3"

services:
  server:
    image: gitea/gitea:latest
    container_name: gitea
    environment:
      - USER_UID=1000
      - USER_GID=1000
    restart: always
    networks:
      - gitea
    volumes:
      - ./gitea:/data
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro
    ports:
      - "3000:3000"
      - "222:22"
    depends_on:
      - db

  db:
    image: postgres:14-alpine
    restart: always
    environment:
      - POSTGRES_USER=gitea
      - POSTGRES_PASSWORD=gitea_password
      - POSTGRES_DB=gitea
    networks:
      - gitea
    volumes:
      - ./postgres:/var/lib/postgresql/data

networks:
  gitea:
    driver: bridge
```

### 启动服务

```bash
# 创建目录
mkdir -p gitea postgres

# 启动容器
docker-compose up -d

# 查看日志
docker-compose logs -f
```

## 初始化配置

### Web 界面配置

1. 访问 `http://localhost:3000`
2. 选择数据库类型（PostgreSQL）
3. 配置数据库连接：
   - 主机：`db:5432`
   - 用户：`gitea`
   - 密码：`gitea_password`
   - 数据库名：`gitea`
4. 设置管理员账号
5. 完成安装

## 配置 HTTPS

### 使用 Nginx 反向代理

```nginx
server {
    listen 443 ssl http2;
    server_name git.example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 使用 Let's Encrypt

```bash
# 安装 certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d git.example.com

# 自动续期
sudo certbot renew --dry-run
```

## 数据备份

### 手动备份

```bash
# 备份 Gitea 数据
docker exec gitea /app/gitea dump -c /data/gitea/conf/app.ini

# 备份数据库
docker exec postgres pg_dump -U gitea gitea > gitea_db.sql

# 备份文件数据
tar -czf gitea_backup.tar.gz gitea/ postgres/
```

### 自动备份脚本

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backup/gitea"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# 备份数据库
docker exec postgres pg_dump -U gitea gitea > $BACKUP_DIR/gitea_db_$DATE.sql

# 备份文件
tar -czf $BACKUP_DIR/gitea_files_$DATE.tar.gz gitea/ postgres/

# 删除 7 天前的备份
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

添加到 crontab：

```bash
# 每天凌晨 2 点备份
0 2 * * * /path/to/backup.sh
```

## 常用配置

### 禁用用户注册

在 `app.ini` 中添加：

```ini
[service]
DISABLE_REGISTRATION = true
REQUIRE_SIGNIN_VIEW = true
```

### 配置邮件

```ini
[mailer]
ENABLED = true
HOST = smtp.gmail.com:587
FROM = gitea@example.com
USER = your-email@gmail.com
PASSWD = your-password
```

### 配置 LFS 支持

```ini
[server]
LFS_START_SERVER = true
LFS_JWT_SECRET = your-secret-key
```

## 故障排查

### 日志查看

```bash
# 查看 Gitea 日志
docker logs gitea

# 实时跟踪日志
docker logs -f gitea

# 查看数据库日志
docker logs postgres
```

### 常见问题

1. **无法连接数据库**
   - 检查数据库容器是否运行
   - 验证数据库连接配置

2. **Web 界面无法访问**
   - 检查端口映射
   - 查看防火墙设置

3. **SSH 克隆失败**
   - 确认 SSH 端口映射（222:22）
   - 使用 `ssh://git@hostname:222/username/repo.git`

## 性能优化

- 使用 PostgreSQL 而非 SQLite
- 配置 Redis 缓存
- 启用 CDN 加速静态资源
- 定期清理旧日志和临时文件

## 总结

Gitea 是一个轻量、易用的自托管 Git 服务器：

- ✅ 资源占用少，适合个人或小团队
- ✅ Docker 部署简单快速
- ✅ 功能完善，满足日常需求
- ✅ 支持多种数据库和缓存方案

---

**最后更新：** 2026-03-28