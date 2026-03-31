// 文章列表配置
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
            title: "Docker 部署最佳实践",
            link: "/articles/docker/deploy",
            desc: "基础镜像优化、数据持久化与编排"
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
            title: "常用运维命令",
            link: "/articles/linux/commands",
            desc: "网络、磁盘、进程、日志排查命令"
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
            title: "Gitea 代码仓库搭建",
            link: "/articles/backend/gitea",
            desc: "Docker 部署、HTTPS 配置与数据备份"
          },
          {
            title: "Gitea 代码仓库搭建1",
            link: "/articles/backend/gitea",
            desc: "Docker 部署、HTTPS 配置与数据备份"
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
