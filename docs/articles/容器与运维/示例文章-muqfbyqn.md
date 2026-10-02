---
title: 示例文章：Docker Compose 多服务编排
category: 容器与运维
subcategory: Docker
desc: 使用 Docker Compose 编排多个容器服务的实战经验
---

# Docker Compose 多服务编排

## 为什么需要 Compose

单容器适合简单服务；多服务（前端 + 后端 + 数据库 + 反向代理）就需要 Compose 统一编排。

## 示例 compose.yaml

```yaml
version: "3.9"
services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"
  api:
    build: ./api
    environment:
      - DB_HOST=db
  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
```

## 常用命令

```bash
docker compose up -d
docker compose logs -f api
docker compose down
```

## 进阶建议

- 使用 `.env` 注入敏感配置
- 拆分多个 compose 文件按环境切换
- 通过 healthcheck 控制启动顺序