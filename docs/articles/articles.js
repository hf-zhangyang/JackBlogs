// 文章列表配置（⚠️ 本文件由 tools/sync-articles.mjs 自动生成，请勿手动编辑）
// 内容来源：docs/articles/<分类目录>/<子分类目录>/*.md
// 添加文章：把 .md 丢进对应目录（分类信息写在目录上），然后运行 npm run sync
// 支持三级目录：分类 → 子分类 → 文章

export const articleList = [
  {
    category: "容器与运维",
    icon: "📘",
    description: "Docker 容器化部署、镜像优化、网络配置与多服务编排。",
    subcategories: [
    {
      name: "Docker",
      items: [
        {
          title: "Docker 容器部署个人服务最佳实践",
          link: "/articles/container/docker/deploy",
          desc: "基础镜像优化、数据持久化与编排",
          date: "2026-03-30"
        }
      ]
    }
    ]
  },
  {
    category: "Linux 运维",
    icon: "📗",
    description: "Linux 系统管理、常用命令、性能优化与故障排查。",
    subcategories: [
    {
      name: "基础命令",
      items: [
        {
          title: "Linux 常用高效运维命令合集",
          link: "/articles/linux/basic-commands/commands",
          desc: "网络、磁盘、进程、日志排查命令",
          date: "2026-03-25"
        }
      ]
    }
    ]
  },
  {
    category: "后端开发",
    icon: "📙",
    description: "后端技术栈、微服务架构、开发工具与服务部署。",
    subcategories: [
    {
      name: "工具搭建",
      items: [
        {
          title: "轻量级代码仓库 Gitea 本地搭建教程",
          link: "/articles/backend/tools/gitea",
          desc: "Docker 部署、HTTPS 配置与数据备份",
          date: "2026-03-28"
        }
      ]
    },
    {
      name: "设计模式",
      items: [
        {
          title: "线程安全单例模式实现指南",
          link: "/articles/backend/design-patterns/thread-safe-singleton",
          desc: "Lazy<T>、lock 双重检查与 Interlocked 三种实现的代码、对比与选型建议",
          date: "2026-10-03"
        }
      ]
    }
    ]
  }
]

// 根据文章列表生成侧边栏配置
export function generateSidebar() {
  const sidebar = {}

  articleList.forEach(category => {
    category.subcategories.forEach(subcategory => {
      subcategory.items.forEach(article => {
        // 提取文章路径的目录部分
        const pathMatch = article.link.match(/\/articles\/([^/]+)\//)
        if (pathMatch) {
          const categoryPath = `/articles/${pathMatch[1]}/`

          if (!sidebar[categoryPath]) {
            sidebar[categoryPath] = []
          }

          // 查找或创建子分类组
          let subcategoryGroup = sidebar[categoryPath].find(
            group => group.text === subcategory.name
          )

          if (!subcategoryGroup) {
            subcategoryGroup = {
              text: subcategory.name,
              items: []
            }
            sidebar[categoryPath].push(subcategoryGroup)
          }

          subcategoryGroup.items.push({
            text: article.title,
            link: article.link
          })
        }
      })
    })
  })

  return sidebar
}
