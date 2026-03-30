# Linux 常用高效运维命令合集

## 概述

本文整理 Linux 运维中的高频实用命令，涵盖网络、磁盘、进程、日志等日常排查场景。

## 网络排查

### 连接测试

```bash
# 测试网络连通性
ping -c 4 google.com

# 测试端口连通性
telnet 192.168.1.1 80
nc -zv 192.168.1.1 22

# 追踪路由
traceroute google.com
mtr google.com  # 更强大的 traceroute

# DNS 查询
nslookup google.com
dig google.com
```

### 流量监控

```bash
# 实时网络流量
iftop
nethogs  # 按进程显示
iptraf-ng

# 连接状态统计
ss -tuln
netstat -tuln  # 传统命令

# 查看连接数
ss -s
netstat -an | grep ESTABLISHED | wc -l
```

### 防火墙操作

```bash
# firewalld
firewall-cmd --list-all
firewall-cmd --add-port=80/tcp --permanent
firewall-cmd --reload

# iptables
iptables -L -n
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
```

## 磁盘管理

### 空间查看

```bash
# 磁盘使用情况
df -h
df -Th  # 显示文件系统类型

# 目录大小
du -sh /path/to/dir
du -h --max-depth=1 /path  # 一级目录大小

# 查找大文件
find / -type f -size +100M 2>/dev/null
find / -type f -size +1G -exec ls -lh {} \; 2>/dev/null
```

### 磁盘清理

```bash
# 清理包缓存
sudo apt clean
sudo apt autoclean
sudo apt autoremove

# 清理日志
journalctl --vacuum-time=7d
journalctl --vacuum-size=500M

# 查找并清理临时文件
find /tmp -type f -atime +7 -delete

# 清理旧的缩略图
rm -rf ~/.cache/thumbnails/*
```

## 进程管理

### 进程查看

```bash
# 实时进程监控
top
htop  # 更友好的界面

# 查找特定进程
ps aux | grep nginx
pgrep nginx
pidof nginx

# 进程树
pstree
ps auxf
```

### 进程控制

```bash
# 终止进程
kill 1234
kill -9 1234  # 强制终止

pkill nginx  # 按名称终止
killall nginx  # 终止所有同名进程

# 后台运行
nohup command &
screen -S session_name
tmux new -s session_name
```

### 资源占用

```bash
# CPU 使用率
mpstat 1
top -bn1 | grep "Cpu(s)"

# 内存使用
free -h
vmstat 1

# 按内存排序进程
ps aux --sort=-%mem | head -10
ps aux --sort=-%cpu | head -10
```

## 日志分析

### 系统日志

```bash
# journalctl 日志查看
journalctl -u nginx.service  # 特定服务
journalctl -f  # 实时跟踪
journalctl --since today  # 今天日志
journalctl -p err  # 错误级别

# 系统日志
tail -f /var/log/syslog
tail -f /var/log/messages
```

### 应用日志

```bash
# 查看最后 100 行
tail -n 100 app.log

# 实时跟踪
tail -f app.log

# 查看特定内容
grep "ERROR" app.log
grep -C 5 "Exception" app.log  # 显示上下文

# 统计访问
awk '{print $1}' access.log | sort | uniq -c | sort -rn | head -10

# 统计 HTTP 状态码
awk '{print $9}' access.log | sort | uniq -c | sort -rn
```

## 性能分析

### 系统性能

```bash
# 综合性能
sar 1 10  # 每秒采集，共 10 次
sar -u 1 5  # CPU
sar -r 1 5  # 内存
sar -d 1 5  # 磁盘 I/O

# 磁盘 I/O
iostat -x 1
iotop

# 文件描述符
lsof | wc -l  # 总数
lsof -p 1234  # 特定进程
ulimit -n  # 当前限制
```

### 网络性能

```bash
# 网络统计
sar -n DEV 1
nload

# TCP 连接统计
ss -s
netstat -an | awk '{print $6}' | sort | uniq -c | sort -rn
```

## 快捷技巧

### 单行脚本

```bash
# 查找并删除 7 天前的文件
find /path -type f -mtime +7 -delete

# 批量重命名
rename 's/old/new/' *.txt

# 批量修改权限
find /path -type f -exec chmod 644 {} \;
find /path -type d -exec chmod 755 {} \;

# 监控文件变化
watch -n 1 'ls -lh'

# 查找包含内容的文件
grep -r "search_term" /path
```

### 快速别名

```bash
# 添加到 ~/.bashrc 或 ~/.bash_aliases
alias ll='ls -alhF'
alias la='ls -A'
alias l='ls -CF'
alias ..='cd ..'
alias ...='cd ../..'
alias grep='grep --color=auto'
alias df='df -h'
alias du='du -h'

# Git 别名
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git log --oneline'
```

## 紧急故障处理

### 系统负载过高

```bash
# 查看负载
uptime
top

# 查找高 CPU 进程
ps aux --sort=-%cpu | head -10

# 查找高内存进程
ps aux --sort=-%mem | head -10
```

### 磁盘满

```bash
# 快速定位大目录
du -sh /* | sort -rh | head -10

# 清理日志
> /var/log/large.log
journalctl --vacuum-time=7d

# 清理包缓存
apt clean
yum clean all
```

### 网络异常

```bash
# 测试 DNS
nslookup google.com

# 检查路由
route -n
ip route

# 检查网络接口
ip link
ifconfig

# 抓包分析
tcpdump -i eth0 -nn port 80
```

## 监控脚本示例

```bash
#!/bin/bash
# 简单的系统监控脚本

while true; do
    clear
    echo "=== 系统状态 ==="
    echo "时间: $(date)"
    echo "负载: $(uptime | awk -F'load average:' '{print $2}')"
    echo "内存: $(free -h | grep Mem | awk '{print $3 "/" $2}')"
    echo "磁盘: $(df -h / | tail -1 | awk '{print $3 "/" $2 " (" $5 ")"}')"
    echo ""
    echo "=== Top 5 进程 ==="
    ps aux --sort=-%cpu | head -6 | awk '{printf "%-10s %5s %5s %s\n", $1, $3"%", $4"%", $11}'
    sleep 5
done
```

## 总结

掌握这些命令可以应对 90% 的日常运维场景：

- 🔍 **网络排查**：ping, telnet, ss, iftop
- 💾 **磁盘管理**：df, du, find
- ⚙️ **进程控制**：ps, top, kill
- 📋 **日志分析**：journalctl, grep, awk
- 📊 **性能监控**：sar, iostat, htop

建议将这些命令整理成个人工具箱，提高工作效率。

---

**最后更新：** 2026-03-25