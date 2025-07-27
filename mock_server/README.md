# SCU Exam System Mock Server

这是一个基于 TypeScript 和 Express 的 Mock 服务器，用于模拟智慧教学系统的认证 API。

## 功能特性

- ✅ 用户登录 (`POST /api/auth/login`)
- ✅ 用户注册 (`POST /api/auth/register`)
- ✅ 健康检查 (`GET /api/health`)
- ✅ 用户信息获取 (`GET /api/user/profile`)
- ✅ JWT 令牌生成和验证
- ✅ 请求频率限制
- ✅ 输入验证
- ✅ CORS 支持

## 快速开始

### 1. 安装依赖

```bash
cd mock_server
yarn install
```

### 2. 启动开发服务器

```bash
yarn dev
```

服务器将在 `http://127.0.0.1:8080` 启动。

### 3. 构建生产版本

```bash
yarn build
yarn start
```

## API 接口文档

### 登录接口

**POST** `/api/auth/login`

请求体：
```json
{
  "email": "student@scu.edu.cn",
  "password": "student123"
}
```

成功响应 (200)：
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "2",
      "username": "student001",
      "name": "李同学",
      "email": "student@scu.edu.cn",
      "primaryRole": "student",
      "availableRoles": ["student"],
      "currentRole": "student",
      "department": "计算机学院",
      "school": "四川大学",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  },
  "timestamp": "2025-07-28T10:30:00.000Z"
}
```

失败响应 (401)：
```json
{
  "code": 401,
  "message": "用户名或密码错误",
  "timestamp": "2025-07-28T10:30:00.000Z"
}
```

### 注册接口

**POST** `/api/auth/register`

请求体：
```json
{
  "username": "newuser",
  "email": "newuser@scu.edu.cn",
  "password": "password123",
  "confirmPassword": "password123",
  "role": "student",
  "school": "四川大学",
  "department": "计算机学院",
  "name": "新用户"
}
```

成功响应 (201)：
```json
{
  "code": 201,
  "message": "注册成功",
  "data": {
    "user": {
      "id": "generated_id",
      "username": "newuser",
      "name": "新用户",
      "email": "newuser@scu.edu.cn",
      "primaryRole": "student",
      "availableRoles": ["student"],
      "currentRole": "student",
      "department": "计算机学院",
      "school": "四川大学",
      "createdAt": "2025-07-28T10:30:00.000Z"
    }
  },
  "timestamp": "2025-07-28T10:30:00.000Z"
}
```

失败响应 (400)：
```json
{
  "code": 400,
  "message": "输入验证失败",
  "errors": ["密码至少需要6个字符", "两次输入的密码不一致"],
  "timestamp": "2025-07-28T10:30:00.000Z"
}
```

### 健康检查

**GET** `/api/health`

响应：
```json
{
  "code": 200,
  "message": "Mock server is running",
  "timestamp": "2025-07-28T10:30:00.000Z"
}
```

## 预设测试账号

系统预设了以下测试账号：

| 角色 | 邮箱 | 密码 | 姓名 |
|------|------|------|------|
| 教师 | teacher@scu.edu.cn | teacher123 | 张老师 |
| 学生 | student@scu.edu.cn | student123 | 李同学 |
| 助教 | ta@scu.edu.cn | ta123 | 王助教 |
| 系统管理员 | admin@scu.edu.cn | admin123 | 系统管理员 |
| 学校管理员 | school@scu.edu.cn | school123 | 学校管理员 |

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 认证失败 |
| 409 | 资源冲突（如邮箱已存在） |
| 429 | 请求频率过高 |
| 500 | 服务器内部错误 |

## 开发说明

### 项目结构

```
mock_server/
├── src/
│   ├── server.ts      # 主服务器文件
│   ├── types.ts       # TypeScript 类型定义
│   ├── data.ts        # 模拟数据和数据操作
│   └── utils.ts       # 工具函数
├── package.json
├── tsconfig.json
└── README.md
```

### 技术栈

- **Express.js** - Web 框架
- **TypeScript** - 类型安全
- **CORS** - 跨域支持
- **express-rate-limit** - 请求频率限制
- **jsonwebtoken** - JWT 令牌
- **bcryptjs** - 密码哈希 (暂未启用)

### 配置说明

- 服务器端口：8080
- JWT 密钥：仅用于开发环境
- 请求频率限制：15分钟内最多100个请求，认证接口5个请求

## 在前端中使用

在你的前端应用中，可以这样使用这些 API：

```typescript
// 登录
const login = async (email: string, password: string) => {
  const response = await fetch('http://127.0.0.1:8080/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  const result = await response.json();
  
  if (result.code === 200) {
    // 保存 token
    localStorage.setItem('auth_token', result.data.token);
    return result.data.user;
  } else {
    throw new Error(result.message);
  }
};

// 注册
const register = async (userData: RegisterRequest) => {
  const response = await fetch('http://127.0.0.1:8080/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  
  const result = await response.json();
  
  if (result.code === 201) {
    return result.data.user;
  } else {
    throw new Error(result.message);
  }
};
```

## 注意事项

1. 这是一个 Mock 服务器，仅用于开发和测试
2. 密码目前以明文存储，生产环境中应使用 bcrypt 哈希
3. JWT 密钥是硬编码的，生产环境中应使用环境变量
4. 数据存储在内存中，重启服务器后数据会丢失
