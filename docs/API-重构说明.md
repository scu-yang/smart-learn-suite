# API 重构说明

## 📁 新的 API 结构

```
src/
├── config/
│   └── api.ts           # API 配置文件
├── lib/
│   ├── http-client.ts   # HTTP 客户端
│   ├── auth-api.ts      # 认证相关 API
│   ├── api.ts           # 主 API 文件（重构后）
│   └── api-examples.ts  # API 使用示例
├── .env                 # 开发环境配置
└── .env.production      # 生产环境配置
```

## 🔧 配置说明

### 环境变量

在 `.env` 文件中配置：

```bash
# 设置为 false 使用真实 API，设置为 true 使用 Mock 数据
VITE_USE_MOCK=true

# 后端 API 地址
VITE_API_BASE_URL=http://127.0.0.1:8080/api
```

### API 切换开关

通过 `VITE_USE_MOCK` 环境变量控制：
- `true`: 使用 Mock 数据（开发测试）
- `false`: 使用真实后端 API（生产环境）

## 🚀 使用方法

### 1. 认证相关 API

```typescript
import { authApi, saveAuthData, clearAuthData } from '@/lib/api';

// 登录
const response = await authApi.login({ username, password });
if (response.success) {
  saveAuthData(response.data.token, response.data.user);
}

// 注册
const result = await authApi.register(registerData);

// 获取用户信息
const profile = await authApi.getProfile();

// 登出
clearAuthData();
```

### 2. 数据获取 API

```typescript
import { api } from '@/lib/api';

// 获取考试列表
const exams = await api.getExams();

// 获取课程列表
const courses = await api.getCourses();

// 获取通知
const notifications = await api.getNotifications({ isRead: false });
```

### 3. 错误处理

```typescript
try {
  const response = await authApi.login(credentials);
  // 处理成功响应
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API 错误:', error.message, error.status);
  } else {
    console.error('未知错误:', error);
  }
}
```

## 📋 后端 API 端点

### 认证相关
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册
- `GET /api/user/profile` - 获取用户信息
- `GET /api/health` - 健康检查

### 数据相关 (待实现)
- `GET /api/exams` - 获取考试列表
- `GET /api/courses` - 获取课程列表
- `GET /api/notifications` - 获取通知列表
- 更多端点...

## 🔄 从 Mock 切换到真实 API

### 开发环境切换

1. 编辑 `.env` 文件：
```bash
VITE_USE_MOCK=false
VITE_API_BASE_URL=http://127.0.0.1:8080/api
```

2. 重启开发服务器：
```bash
yarn dev
```

### 生产环境配置

`.env.production` 文件自动使用真实 API：
```bash
VITE_USE_MOCK=false
VITE_API_BASE_URL=https://api.scu-exam.edu.cn/api
```

## 🛠️ 开发调试

在开发环境中，API 示例已自动加载到 `window.apiExamples`：

```javascript
// 在浏览器控制台中测试
await window.apiExamples.auth.login()
await window.apiExamples.data.getExams()
await window.apiExamples.loginFlow()
```

## 📝 添加新的 API

### 1. 在 Mock API 中添加

在 `api.ts` 的 `mockDataApi` 对象中添加新方法：

```typescript
const mockDataApi = {
  // ... 现有方法
  
  // 新的 API 方法
  getNewData: async (): Promise<NewDataType[]> => {
    await delay(300);
    return mockNewData;
  },
};
```

### 2. 在真实 API 中实现

在 `realDataApi` 对象中添加对应的真实 API 调用：

```typescript
const realDataApi = {
  // ... 现有方法
  
  getNewData: async (): Promise<NewDataType[]> => {
    const response = await httpClient.get<NewDataType[]>('/new-data');
    return response.data || [];
  },
};
```

## ⚠️ 注意事项

1. **认证 Token**: 自动从 localStorage 读取并添加到请求头
2. **错误处理**: 统一的 ApiError 错误类型
3. **请求超时**: 默认 10 秒超时
4. **类型安全**: 完整的 TypeScript 类型支持
5. **开发调试**: 开发环境下可在控制台直接测试 API

## 🔗 相关文件

- `src/config/api.ts` - API 配置
- `src/lib/http-client.ts` - HTTP 客户端实现
- `src/lib/auth-api.ts` - 认证 API 实现
- `src/lib/api.ts` - 主 API 文件
- `src/lib/api-examples.ts` - 使用示例
- `.env` - 环境变量配置
