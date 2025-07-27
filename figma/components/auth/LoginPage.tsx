import React, { useState } from 'react';
import { useAuth, TestAccount } from '../../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  GraduationCap, 
  Mail, 
  Lock, 
  User, 
  Building, 
  IdCard,
  Eye,
  EyeOff,
  LogIn,
  TestTube,
  Copy,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function LoginPage() {
  const { login, testAccounts, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      await login(loginData.email, loginData.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败');
    }
  };

  const handleTestLogin = async (account: TestAccount) => {
    setError(null);
    try {
      await login(account.email, account.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败');
    }
  };

  const handleCopyCredentials = (account: TestAccount) => {
    setLoginData({ email: account.email, password: account.password });
    setCopiedAccount(account.email);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic here
    console.log('Registration submitted');
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'teacher': return '👨‍🏫';
      case 'student': return '👨‍🎓';
      case 'ta': return '👥';
      case 'admin': return '⚙️';
      case 'school_admin': return '🏫';
      default: return '👤';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'teacher': return 'border-l-chart-1 bg-chart-1/5';
      case 'student': return 'border-l-chart-2 bg-chart-2/5';
      case 'ta': return 'border-l-chart-3 bg-chart-3/5';
      case 'admin': return 'border-l-chart-4 bg-chart-4/5';
      case 'school_admin': return 'border-l-chart-5 bg-chart-5/5';
      default: return 'border-l-muted bg-muted/5';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-primary-foreground" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-gray-900">智慧教学</h1>
              <p className="text-sm text-gray-600">数学个性化学习与评估系统</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Test Accounts Panel */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="w-5 h-5" />
                  测试账号
                </CardTitle>
                <CardDescription>
                  点击下方账号快速体验不同角色功能
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {testAccounts.map((account) => (
                  <div 
                    key={account.email}
                    className={`p-3 rounded-lg border-l-4 transition-all hover:shadow-sm cursor-pointer ${getRoleColor(account.role)}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getRoleIcon(account.role)}</span>
                        <div>
                          <h4 className="font-medium text-sm">{account.name}</h4>
                          <p className="text-xs text-muted-foreground">{account.description}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-xs text-muted-foreground mb-2">
                      <div>邮箱: {account.email}</div>
                      <div>密码: {account.password}</div>
                    </div>

                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        className="flex-1 h-7 text-xs"
                        onClick={() => handleTestLogin(account)}
                        disabled={loading}
                      >
                        <LogIn className="w-3 h-3 mr-1" />
                        {loading ? '登录中...' : '快速登录'}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-7 w-7 p-0"
                        onClick={() => handleCopyCredentials(account)}
                      >
                        {copiedAccount === account.email ? (
                          <CheckCircle className="w-3 h-3 text-chart-2" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="pt-3 border-t">
                  <Alert>
                    <TestTube className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      这些是演示账号，点击"快速登录"或复制凭据到右侧表单登录
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Login/Register Panel */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">登录</TabsTrigger>
                  <TabsTrigger value="register">注册</TabsTrigger>
                </TabsList>

                {/* Login Tab */}
                <TabsContent value="login">
                  <CardHeader>
                    <CardTitle>欢迎回来</CardTitle>
                    <CardDescription>请输入您的账号信息以登录系统</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {error && (
                      <Alert className="mb-4" variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">邮箱/用户名</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="login-email"
                            type="text"
                            placeholder="输入邮箱或用户名"
                            className="pl-10"
                            value={loginData.email}
                            onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="login-password">密码</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="输入密码"
                            className="pl-10 pr-10"
                            value={loginData.password}
                            onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="remember"
                            checked={rememberMe}
                            onCheckedChange={setRememberMe}
                          />
                          <Label htmlFor="remember" className="text-sm">记住我</Label>
                        </div>
                        <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                          忘记密码？
                        </Link>
                      </div>

                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? '登录中...' : '登录'}
                      </Button>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-card px-2 text-muted-foreground">或使用社交账号</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" type="button">
                          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                            <path fill="#1877f2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                          微信
                        </Button>
                        <Button variant="outline" type="button">
                          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                            <path fill="#12B7F5" d="M21.593 7.203c-.23-.693-.921-1.238-1.657-1.304C18.265 5.656 15.305 5.5 12.004 5.5c-3.302 0-6.261.156-7.931.399-.735.066-1.425.611-1.657 1.304C2.185 8.24 2.185 10.36 2.185 12c0 1.64 0 3.76.231 4.797.232.693.922 1.238 1.657 1.304 1.67.243 4.629.399 7.931.399 3.301 0 6.26-.156 7.931-.399.735-.066 1.425-.611 1.657-1.304.232-1.037.232-3.157.232-4.797 0-1.64 0-3.76-.232-4.797zM10.59 15.391V8.609L15.885 12l-5.294 3.391z"/>
                          </svg>
                          QQ
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </TabsContent>

                {/* Register Tab */}
                <TabsContent value="register">
                  <CardHeader>
                    <CardTitle>创建账号</CardTitle>
                    <CardDescription>填写信息创建您的教学账号</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="username">用户名</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              id="username"
                              type="text"
                              placeholder="用户名"
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="name">真实姓名</Label>
                          <Input
                            id="name"
                            type="text"
                            placeholder="姓名"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-email">邮箱</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="register-email"
                            type="email"
                            placeholder="邮箱地址"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="school">学校</Label>
                          <div className="relative">
                            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              id="school"
                              type="text"
                              placeholder="学校名称"
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="student-id">学号/工号</Label>
                          <div className="relative">
                            <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              id="student-id"
                              type="text"
                              placeholder="学号或工号"
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role">选择您的角色</Label>
                        <Select required>
                          <SelectTrigger>
                            <SelectValue placeholder="请选择角色" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student">学生</SelectItem>
                            <SelectItem value="teacher">教师</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-password">密码</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="register-password"
                            type="password"
                            placeholder="设置密码"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">确认密码</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="confirm-password"
                            type="password"
                            placeholder="再次输入密码"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <Checkbox id="terms" required />
                        <Label htmlFor="terms" className="text-sm leading-relaxed">
                          我已阅读并同意
                          <Link to="/terms" className="text-primary hover:underline mx-1">
                            服务条款
                          </Link>
                          和
                          <Link to="/privacy" className="text-primary hover:underline mx-1">
                            隐私政策
                          </Link>
                        </Label>
                      </div>

                      <Button type="submit" className="w-full">
                        创建账号
                      </Button>
                    </form>
                  </CardContent>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          © 2025 智慧教学系统. 保留所有权利.
        </p>
      </div>
    </div>
  );
}