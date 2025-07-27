# 川大在线考试系统

一个基于 React + TypeScript + TanStack Router + TanStack Query + Tailwind CSS 构建的现代化在线考试平台。

## 🚀 技术栈

- **前端框架**: React 19
- **类型安全**: TypeScript 
- **构建工具**: Vite 7
- **路由管理**: TanStack Router
- **状态管理**: TanStack Query
- **样式框架**: Tailwind CSS 4.x
- **UI 组件**: 自定义组件库 (参考 shadcn/ui)
- **包管理器**: npm

## 📋 功能特性

### 已实现功能

1. **🏠 宣传页面**
   - 产品介绍和功能展示
   - 响应式设计
   - 导航到登录/注册页面

2. **🔐 用户认证**
   - 用户注册（表单验证、密码强度检测）
   - 用户登录（密码可见性切换）
   - 认证状态管理

3. **📊 个人仪表板**
   - 个人信息展示
   - 考试安排概览
   - 课程进度跟踪
   - 错题统计
   - 学习数据可视化

4. **🎯 核心模块**
   - 考试安排管理
   - 课程详情查看
   - 错题收集与分析

### 待开发功能

- [ ] 在线考试功能
- [ ] 实时评分系统
- [ ] 成绩统计分析
- [ ] 用户设置页面
- [ ] 后端 API 集成

## 🗂️ 项目结构

```
src/
├── components/          # 可复用组件
│   └── ui/             # 基础 UI 组件
├── pages/              # 页面组件
│   ├── home-modern.tsx # 现代化首页
│   ├── login.tsx       # 登录页
│   ├── sign.tsx        # 注册页
│   ├── dashboard.tsx   # 仪表板
│   ├── exam.tsx        # 考试页面
│   ├── exam-prep.tsx   # 考试准备页
│   ├── exam-result.tsx # 考试结果页
│   ├── course-detail.tsx # 课程详情页
│   ├── notifications.tsx # 通知中心
│   └── announcement-detail.tsx # 公告详情页
├── hooks/              # 自定义 Hooks
│   ├── useAuth.tsx     # 认证相关
│   ├── useQueries.ts   # 数据查询
│   └── useMutations.ts # 数据修改
├── lib/                # 工具库
│   ├── utils.ts        # 通用工具函数
│   └── api.ts          # API 接口
├── types/              # TypeScript 类型定义
│   └── index.ts        # 全局类型
├── router.tsx          # 路由配置
├── App.tsx             # 应用入口
└── main.tsx            # 程序入口
```

## 🛠️ 开发指南

### 环境要求

- Node.js >= 18
- npm >= 8

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:5173](http://localhost:5173) 查看应用。

### 构建生产版本

```bash
npm run build
```

### 代码检查

```bash
npm run lint
```

## 🎨 设计系统

项目使用了类似 shadcn/ui 的设计系统：

- **颜色系统**: 基于 HSL 的主题色彩变量
- **组件设计**: 可组合的 UI 组件
- **响应式**: 移动端优先的响应式设计
- **深色模式**: 支持深浅主题切换（配置中）

## 📱 页面路由

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | 宣传页 | 产品介绍和功能展示 |
| `/login` | 登录页 | 用户登录 |
| `/sign` | 注册页 | 用户注册 |
| `/dashboard` | 仪表板 | 用户个人中心 |

## 🔧 配置说明

### Tailwind CSS 配置

项目使用 Tailwind CSS 4.x，配置文件位于 `tailwind.config.js`，包含：
- 自定义颜色变量
- 圆角半径设置
- 响应式断点

### TypeScript 配置

- 路径别名: `@/*` 指向 `src/*`
- 严格模式启用
- 模块解析优化

## 🚧 开发注意事项

1. **组件开发**: 所有 UI 组件都位于 `src/components/ui/`
2. **类型安全**: 使用 TypeScript 确保类型安全
3. **状态管理**: 使用 TanStack Query 管理服务器状态
4. **路由管理**: 使用 TanStack Router 进行类型安全的路由
5. **样式规范**: 使用 Tailwind CSS 工具类

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系方式

如有问题或建议，请提交 Issue 或联系开发团队。
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
