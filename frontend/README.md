# 实验室官网前端

基于 Vue 3 + TypeScript + Vite 的实验室官网前端项目，采用现代化技术栈实现多语言支持和响应式设计。

## 🚀 技术栈

### 核心框架
- **Vue 3** - Composition API + `<script setup>` 语法
- **TypeScript** - 类型安全和开发体验
- **Vite** - 快速构建工具

### 主要依赖
- **vue-router@4** - 路由管理
- **vue-i18n@9** - 国际化支持（中文/英文）
- **axios** - HTTP 客户端
- **element-plus** - UI 组件库

### 开发工具
- **Vue DevTools** - Vue 调试工具
- **TypeScript** - 静态类型检查
- **ESLint** - 代码规范检查

## 📁 项目结构

```
frontend/
├── src/
│   ├── types/              # TypeScript 类型定义
│   ├── services/           # HTTP 服务和 API 封装
│   ├── router/             # 路由配置
│   ├── i18n/               # 国际化语言包
│   ├── layouts/            # 布局组件
│   ├── components/         # 通用组件
│   ├── views/              # 页面组件
│   ├── App.vue             # 根组件
│   └── main.ts             # 入口文件
├── components/             # 已废弃的默认组件目录
├── public/                 # 静态资源
├── dist/                   # 构建输出目录
├── .env                    # 环境变量
├── .env.example            # 环境变量示例
├── package.json            # 项目依赖
├── tsconfig.json           # TypeScript 配置
├── vite.config.ts          # Vite 配置
└── README.md               # 项目文档
```

## 🌐 页面路由

采用多语言前缀路由结构：

| 路径 | 组件 | 说明 |
|------|------|------|
| `/:locale(zh|en)?` | BaseLayout | 全局布局 |
| `/` | Home | 中文首页（默认重定向） |
| `/zh/*` | 404 | 重定向到首页 |
| `/zh` | Home | 中文首页 |
| `/zh/about` | About | 实验室简介 |
| `/zh/team` | Team | 研究团队 |
| `/zh/news` | NewsList | 新闻列表 |
| `/zh/news/:id` | NewsDetail | 新闻详情 |
| `/zh/research` | Research | 科研项目与成果 |
| `/zh/contact` | Contact | 联系我们 |

对应的英文路由使用 `/en/` 前缀。

## 🔧 开发指南

### 环境准备

1. **Node.js** 版本 >= 16
2. **npm** 或 **yarn** 包管理器

### 快速开始

```bash
# 1. 进入项目目录
cd frontend

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，设置 VITE_API_BASE_URL

# 4. 启动开发服务器
npm run dev

# 5. 构建生产版本
npm run build

# 6. 预览生产版本
npm run preview
```

### 开发服务器

默认运行在 **http://localhost:3000**

## 🎨 功能特性

### 多语言支持
- 中文（zh）/ 英文（en）切换
- 路由语言前缀
- 动态语言切换
- 保持当前页面位置

### 响应式设计
- 桌面优先设计（1200px 居中）
- 适配平板（768px+）
- 移动端友好（< 768px）

### 页面功能

#### 🏠 首页 (Home)
- 大图 Banner
- 综合新闻列表
- 通知公告
- 学术交流信息

#### 📝 实验室简介 (About)
- 基本情况介绍
- 研究方向
- 代表性成果
- 实验环境照片展示

#### 👥 研究团队 (Team)
- 按角色分组展示
- 教授、博士后、研究生等
- 成员信息卡片
- 邮箱和个人主页链接

#### 📰 新闻中心 (News)
- 分类筛选 + 关键词搜索
- 分页浏览
- 富文本详情展示
- 附件下载

#### 🔬 科学研究 (Research)
- 科研项目（在研/已结题）
- 科研成果（论文/专利/奖励等）
- 类型和年份筛选

#### 📞 联系我们 (Contact)
- 联系信息展示
- 地图集成
- 常用服务链接
- 友情链接

## 🔌 API 集成

### Strapi v5 接口

项目基于 Strapi v5 CMS 系统提供后端数据：

```typescript
// 环境变量
VITE_API_BASE_URL=http://localhost:1337

// 示例 API 端点
GET /api/site-config?locale=zh&populate=*
GET /api/news?locale=zh&populate=cover,category&sort=published_at:desc
GET /api/team-members?locale=zh&populate=avatar
```

### API 封装

统一的 HTTP 请求封装：
- 自动错误处理
- 请求/响应拦截
- 环境变量配置
- TypeScript 类型支持

## 🎯 组件体系

### 布局组件
- `BaseLayout.vue` - 全局布局容器
- `HeaderBar.vue` - 顶部导航栏
- `FooterBar.vue` - 底部信息

### 通用组件
- `SectionTitle.vue` - 页面分区标题
- `NewsCard.vue` - 新闻卡片
- `TeamMemberCard.vue` - 团队成员卡片
- `ProjectCard.vue` - 科研项目卡片
- `OutputCard.vue` - 科研成果卡片

### 页面组件
- `Home.vue` - 首页
- `About.vue` - 实验室简介
- `Team.vue` - 研究团队
- `NewsList.vue` - 新闻列表
- `NewsDetail.vue` - 新闻详情
- `Research.vue` - 科研项目与成果
- `Contact.vue` - 联系我们

## 🎨 设计风格

- **主色调**: 深蓝色 (#0052a3)
- **辅色**: 浅灰背景、白色卡片
- **布局**: 1200px 居中，模块化设计
- **气质**: 正式、简洁、科研实验室风格
- **参考**: sklois.cn 布局理念

## 📱 响应式断点

| 断点 | 宽度 | 说明 |
|------|------|------|
| 大屏 | > 1280px | 完整布局显示 |
| 中屏 | 1024px - 1280px | 适当调整间距 |
| 小屏 | 768px - 1024px | 单列布局 |
| 移动 | < 768px | 移动端优化 |

## 🚨 注意事项

1. **环境配置**: 确保 `.env` 文件正确配置 API 地址
2. **分支管理**: 建议使用 `feat/`、`fix/`、`docs/` 等前缀
3. **代码规范**: 遵循 Vue 3 + TypeScript 最佳实践
4. **构建优化**: Vite 启用代码分割和懒加载
5. **类型安全**: 所有 API 调用都有完整的 TypeScript 类型

## 📦 部署说明

### 构建命令
```bash
npm run build
```

### 输出文件
构建后的文件输出到 `dist/` 目录，可直接部署到静态文件服务器。

### 环境变量
生产环境需要配置正确的 API 地址。

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目为内部使用，请遵循公司相关规定。

---

## 📞 技术支持

如需技术支持或有任何问题，请联系开发团队。