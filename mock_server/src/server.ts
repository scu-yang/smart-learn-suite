import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  RegisterResponse, 
  ErrorResponse,
  UserRole 
} from './types';
import { 
  findUserByEmailOrUsername, 
  isEmailTaken, 
  isUsernameTaken, 
  addUser 
} from './data';
import { 
  generateToken, 
  validatePassword, 
  isValidEmail, 
  validatePasswordStrength, 
  generateId 
} from './utils';

const app = express();
const PORT = process.env.PORT || 8080;

// 中间件配置
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Vite 开发服务器
  credentials: true
}));

app.use(express.json());

// 限流中间件
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限制每个IP 15分钟内最多100个请求
  message: {
    code: 429,
    message: '请求过于频繁，请稍后再试',
    timestamp: new Date().toISOString()
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 5, // 限制登录/注册请求
  message: {
    code: 429,
    message: '登录尝试过于频繁，请稍后再试',
    timestamp: new Date().toISOString()
  }
});

app.use(limiter);

// 登录接口
app.post('/api/auth/login', authLimiter, (req, res) => {
  try {
    const { email, password }: LoginRequest = req.body;
    
    // 输入验证
    if (!email || !password) {
      const errorResponse: ErrorResponse = {
        code: 400,
        message: '邮箱和密码不能为空',
        timestamp: new Date().toISOString()
      };
      return res.status(400).json(errorResponse);
    }

    // 查找用户
    const user = findUserByEmailOrUsername(email);
    if (!user) {
      const errorResponse: ErrorResponse = {
        code: 401,
        message: '用户名或密码错误',
        timestamp: new Date().toISOString()
      };
      return res.status(401).json(errorResponse);
    }

    // 验证密码
    if (!validatePassword(password, user.password)) {
      const errorResponse: ErrorResponse = {
        code: 401,
        message: '用户名或密码错误',
        timestamp: new Date().toISOString()
      };
      return res.status(401).json(errorResponse);
    }

    // 生成 token
    const { password: _, ...userWithoutPassword } = user;
    const token = generateToken(userWithoutPassword);

    const response: LoginResponse = {
      code: 200,
      message: '登录成功',
      data: {
        token,
        user: userWithoutPassword
      },
      timestamp: new Date().toISOString()
    };

    res.json(response);
  } catch (error) {
    console.error('Login error:', error);
    const errorResponse: ErrorResponse = {
      code: 500,
      message: '服务器内部错误',
      timestamp: new Date().toISOString()
    };
    res.status(500).json(errorResponse);
  }
});

// 注册接口
app.post('/api/auth/register', authLimiter, (req, res) => {
  try {
    const { 
      username, 
      email, 
      password, 
      confirmPassword, 
      role = 'student',
      school = '四川大学',
      department,
      name 
    }: RegisterRequest = req.body;

    // 输入验证
    const errors: string[] = [];

    if (!username || username.length < 3) {
      errors.push('用户名至少需要3个字符');
    }

    if (!email || !isValidEmail(email)) {
      errors.push('请输入有效的邮箱地址');
    }

    if (!password) {
      errors.push('密码不能为空');
    } else {
      const passwordValidation = validatePasswordStrength(password);
      if (!passwordValidation.valid) {
        errors.push(passwordValidation.message!);
      }
    }

    if (password !== confirmPassword) {
      errors.push('两次输入的密码不一致');
    }

    if (errors.length > 0) {
      const errorResponse: ErrorResponse = {
        code: 400,
        message: '输入验证失败',
        errors,
        timestamp: new Date().toISOString()
      };
      return res.status(400).json(errorResponse);
    }

    // 检查邮箱是否已存在
    if (isEmailTaken(email)) {
      const errorResponse: ErrorResponse = {
        code: 409,
        message: '该邮箱已被注册',
        timestamp: new Date().toISOString()
      };
      return res.status(409).json(errorResponse);
    }

    // 检查用户名是否已存在
    if (isUsernameTaken(username)) {
      const errorResponse: ErrorResponse = {
        code: 409,
        message: '该用户名已被使用',
        timestamp: new Date().toISOString()
      };
      return res.status(409).json(errorResponse);
    }

    // 创建新用户
    const newUser = {
      id: generateId(),
      username,
      name: name || username,
      email,
      password, // 在实际应用中应该使用 hashPassword
      primaryRole: role as UserRole,
      availableRoles: [role] as UserRole[],
      currentRole: role as UserRole,
      department: department || '未指定',
      school,
      createdAt: new Date().toISOString()
    };

    addUser(newUser);

    const { password: _, ...userWithoutPassword } = newUser;
    
    const response: RegisterResponse = {
      code: 201,
      message: '注册成功',
      data: {
        user: userWithoutPassword
      },
      timestamp: new Date().toISOString()
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Register error:', error);
    const errorResponse: ErrorResponse = {
      code: 500,
      message: '服务器内部错误',
      timestamp: new Date().toISOString()
    };
    res.status(500).json(errorResponse);
  }
});

// 健康检查接口
app.get('/api/health', (req, res) => {
  res.json({
    code: 200,
    message: 'Mock server is running',
    timestamp: new Date().toISOString()
  });
});

// 获取用户信息接口 (需要 token)
app.get('/api/user/profile', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    const errorResponse: ErrorResponse = {
      code: 401,
      message: '未提供认证令牌',
      timestamp: new Date().toISOString()
    };
    return res.status(401).json(errorResponse);
  }

  try {
    // 这里应该验证 token，但在 mock 环境中简化处理
    res.json({
      code: 200,
      message: '获取用户信息成功',
      data: {
        id: '1',
        username: 'test_user',
        email: 'test@scu.edu.cn',
        role: 'student'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    const errorResponse: ErrorResponse = {
      code: 401,
      message: '无效的认证令牌',
      timestamp: new Date().toISOString()
    };
    res.status(401).json(errorResponse);
  }
});

// 404 处理
app.use('*', (req, res) => {
  const errorResponse: ErrorResponse = {
    code: 404,
    message: '接口不存在',
    timestamp: new Date().toISOString()
  };
  res.status(404).json(errorResponse);
});

// 错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  const errorResponse: ErrorResponse = {
    code: 500,
    message: '服务器内部错误',
    timestamp: new Date().toISOString()
  };
  res.status(500).json(errorResponse);
});

app.listen(PORT, () => {
  console.log(`🚀 Mock server is running on http://127.0.0.1:${PORT}`);
  console.log(`📋 API endpoints:`);
  console.log(`   POST http://127.0.0.1:${PORT}/api/auth/login`);
  console.log(`   POST http://127.0.0.1:${PORT}/api/auth/register`);
  console.log(`   GET  http://127.0.0.1:${PORT}/api/health`);
  console.log(`   GET  http://127.0.0.1:${PORT}/api/user/profile`);
});
