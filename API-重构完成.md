# API 重构完成 ✅

## 🎯 重构目标达成

已成功将 `src/lib/api.ts` 重构为模块化的 API 层，支持 Mock 数据和真实后端 API 的无缝切换。

## 📁 新增文件结构

```
src/
├── config/
│   └── api.ts              # API 配置和端点定义
├── lib/
│   ├── http-client.ts      # 统一的 HTTP 客户端
│   ├── auth-api.ts         # 认证相关 API (login/register)
│   ├── api.ts              # 主 API 文件（重构后）
│   ├── api-examples.ts     # API 使用示例和开发调试工具
│   └── api-test.ts         # API 测试脚本
├── docs/
│   └── API-重构说明.md     # 详细文档
├── .env                    # 开发环境配置
└── .env.production         # 生产环境配置
```

## 🔧 核心功能

### 1. ✅ 开关变量控制
- 通过 `VITE_USE_MOCK` 环境变量控制
- `true`: 使用 Mock 数据（开发测试）
- `false`: 使用真实后端 API（生产环境）

### 2. ✅ 认证 API 已对接真实后端
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册  
- `GET /api/user/profile` - 获取用户信息
- `GET /api/health` - 健康检查

### 3. ✅ 完整的错误处理
- 统一的 `ApiError` 错误类型
- 请求超时控制
- 网络错误处理
- HTTP 状态码处理

### 4. ✅ 开发工具和调试
- 浏览器控制台调试工具
- API 测试脚本
- 详细的使用示例

## 🚀 使用方法

### 快速开始

```typescript
import { authApi, api } from '@/lib/api';

// 登录
const loginResponse = await authApi.login({ 
  username: 'student', 
  password: 'student123' 
});

// 获取数据
const exams = await api.getExams();
const courses = await api.getCourses();
```

### 切换 API 模式

编辑 `.env` 文件：
```bash
# 使用 Mock 数据
VITE_USE_MOCK=true

# 使用真实 API
VITE_USE_MOCK=false
VITE_API_BASE_URL=http://127.0.0.1:8080/api
```

### 开发调试

在浏览器控制台：
```javascript
// 测试登录
await window.apiExamples.auth.login()

// 测试数据获取
await window.apiExamples.data.getExams()

// 运行完整测试
await window.testAPI()
```

## 📋 后端 API 端点

### 已实现对接
- ✅ `POST http://127.0.0.1:8080/api/auth/login`
- ✅ `POST http://127.0.0.1:8080/api/auth/register`
- ✅ `GET http://127.0.0.1:8080/api/health`
- ✅ `GET http://127.0.0.1:8080/api/user/profile`

### 待扩展（当前使用 Mock）
- 📝 `GET /api/exams` - 考试列表
- 📚 `GET /api/courses` - 课程列表
- 🔔 `GET /api/notifications` - 通知列表
- 📄 其他业务 API...

## 🔄 迁移指南

### 对于现有代码
原来的 API 调用方式保持不变：
```typescript
// 这些调用方式仍然有效
const exams = await api.getExams();
const courses = await api.getCourses();
```

### 新增认证功能
```typescript
import { authApi, saveAuthData, clearAuthData } from '@/lib/api';

// 新的认证 API
const response = await authApi.login(credentials);
if (response.success) {
  saveAuthData(response.data.token, response.data.user);
}
```

## 🛠️ 开发环境设置

1. **安装依赖**（无需额外安装）
2. **配置环境变量**：复制 `.env` 文件并根据需要修改
3. **启动开发服务器**：`yarn dev`
4. **测试 API**：在浏览器控制台运行 `await window.testAPI()`

## 📖 详细文档

查看 `docs/API-重构说明.md` 了解：
- 详细的使用方法
- 错误处理最佳实践
- 如何添加新的 API
- 生产环境部署配置

## 🎉 重构完成

API 层重构已完成，现在您可以：

1. **无缝切换** Mock 数据和真实 API
2. **使用真实后端** 进行登录和注册
3. **方便调试** 通过浏览器控制台工具
4. **类型安全** 完整的 TypeScript 支持
5. **易于扩展** 模块化的代码结构

开始使用新的 API 层，享受更好的开发体验！ 🚀

对course-detail进行改造, 参考figma中CourseStudy.tsx的设计.
需要保留课程概览, 章节内容, 学习概览, 作业测验, 课程讨论.
章节内容用树型菜单的方式展示, 有两种类型, 章节和知识点, 章节下面可能有多个章节或者子知识点.
参考 figma的设计, 美化当前的页面布局. 保留目前页面上已经有的一些跳转逻辑
在课程章节树有两种内容, enum('chapter','knowledge'). 点击章节后, 页面组件显示出章节详情, 展示出视频, 课件, 考试等.
展开/收起内容的按钮, 移动到章节上, 不要显式的占一行, 经凑的布局.节点有两种类型: enum('chapter','knowledge'). 点击节点, 在右侧章节内容中展示详情