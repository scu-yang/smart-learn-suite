import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useNavigate } from '@tanstack/react-router';

export function DashboardTestPage() {
  const { user, login, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'student' | 'teacher' | 'admin'>('student');

  const handleLogin = () => {
    if (!username.trim()) {
      alert('请输入用户名');
      return;
    }
    
    login({
      username,
      password: 'demo123' // 模拟密码
    });
  };

  const handleQuickLogin = (quickRole: 'student' | 'teacher' | 'admin') => {
    const credentials = {
      student: { username: 'student_demo', password: 'demo123' },
      teacher: { username: 'teacher_demo', password: 'demo123' },
      admin: { username: 'admin_demo', password: 'demo123' }
    };
    
    login(credentials[quickRole]);
  };

  const handleGoToDashboard = () => {
    try {
      navigate({ to: '/dashboard' });
    } catch (error) {
      console.error('Navigate to dashboard failed:', error);
      alert('跳转失败，请检查路由配置');
    }
  };

  const handleGoToAdmin = () => {
    try {
      navigate({ to: '/admin' });
    } catch (error) {
      console.error('Navigate to admin failed:', error);
      alert('跳转失败，请检查路由配置');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center mb-8">Dashboard 测试页面</h1>
        
        {!user ? (
          <div className="grid md:grid-cols-2 gap-6">
            {/* 手动登录表单 */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">手动登录</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">用户名</label>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="请输入用户名"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">邮箱 (可选)</label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="请输入邮箱"
                    type="email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">角色</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'student' | 'teacher' | 'admin')}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="student">学生</option>
                    <option value="teacher">教师</option>
                    <option value="admin">管理员</option>
                  </select>
                </div>
                <Button onClick={handleLogin} className="w-full">
                  登录
                </Button>
              </div>
            </Card>

            {/* 快速登录 */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">快速登录</h2>
              <div className="space-y-3">
                <Button 
                  onClick={() => handleQuickLogin('student')} 
                  variant="outline" 
                  className="w-full"
                >
                  以学生身份登录
                </Button>
                <Button 
                  onClick={() => handleQuickLogin('teacher')} 
                  variant="outline" 
                  className="w-full"
                >
                  以教师身份登录
                </Button>
                <Button 
                  onClick={() => handleQuickLogin('admin')} 
                  variant="outline" 
                  className="w-full"
                >
                  以管理员身份登录
                </Button>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>快速登录会使用预设的测试账号</p>
              </div>
            </Card>
          </div>
        ) : (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">当前用户信息</h2>
            <div className="space-y-2 mb-6">
              <p><strong>用户名:</strong> {user.username}</p>
              <p><strong>角色:</strong> {user.role}</p>
              <p><strong>邮箱:</strong> {user.email}</p>
              <p><strong>院系:</strong> {user.department || '未设置'}</p>
              <p><strong>ID:</strong> {user.id}</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex gap-3">
                <Button onClick={handleGoToDashboard} className="flex-1">
                  跳转到 Dashboard
                </Button>
                {(user.role === 'admin' || user.role === 'teacher') && (
                  <Button onClick={handleGoToAdmin} variant="outline" className="flex-1">
                    跳转到管理中心
                  </Button>
                )}
              </div>
              <Button onClick={logout} variant="destructive" className="w-full">
                登出
              </Button>
            </div>
          </Card>
        )}

        {/* 说明文档 */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">测试说明</h2>
          <div className="text-sm text-gray-600 space-y-2">
            <p>1. 使用上方的登录表单或快速登录按钮登录不同角色的用户</p>
            <p>2. 登录后可以查看用户信息，并跳转到相应的页面</p>
            <p>3. Dashboard 页面会根据用户角色显示不同的内容和功能入口</p>
            <p>4. 管理员和教师可以访问管理中心，学生只能访问 Dashboard</p>
            <p>5. 用户信息会自动保存到 localStorage，刷新页面后会自动恢复</p>
            <p>6. 快速登录会自动根据用户名分配对应的角色（包含 admin/teacher 的用户名会分配对应角色）</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
