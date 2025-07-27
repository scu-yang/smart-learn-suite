import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  User, 
  Bell, 
  Shield, 
  Key, 
  Clock, 
  Eye, 
  EyeOff,
  ArrowLeft,
  Save,
  Edit3,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Laptop,
  Smartphone,
  Globe,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  LogOut
} from 'lucide-react';
import { Link, useRouter } from '@tanstack/react-router';
import { useAuth } from '@/hooks/useAuth';

interface LoginHistory {
  id: string;
  device: string;
  ip: string;
  location: string;
  timestamp: string;
  userAgent: string;
  status: 'success' | 'failed';
}

interface NotificationSettings {
  examReminders: boolean;
  gradeUpdates: boolean;
  courseAnnouncements: boolean;
  systemNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

const mockLoginHistory: LoginHistory[] = [
  {
    id: '1',
    device: 'Windows PC',
    ip: '192.168.1.100',
    location: '四川成都',
    timestamp: '2025-07-21T09:30:00Z',
    userAgent: 'Chrome 120.0.0.0 Windows',
    status: 'success'
  },
  {
    id: '2',
    device: 'iPhone 15',
    ip: '192.168.1.105',
    location: '四川成都',
    timestamp: '2025-07-20T19:45:00Z',
    userAgent: 'Safari 17.0 iOS',
    status: 'success'
  },
  {
    id: '3',
    device: 'Android手机',
    ip: '10.0.0.45',
    location: '四川成都',
    timestamp: '2025-07-19T14:20:00Z',
    userAgent: 'Chrome 120.0.0.0 Android',
    status: 'success'
  },
  {
    id: '4',
    device: 'Unknown Device',
    ip: '203.45.67.89',
    location: '未知位置',
    timestamp: '2025-07-18T02:15:00Z',
    userAgent: 'Unknown Browser',
    status: 'failed'
  }
];

export function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'history'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 用户信息状态
  const [userInfo, setUserInfo] = useState({
    username: user?.username || '',
    email: user?.email || 'user@scu.edu.cn',
    phone: '',
    department: user?.department || '计算机学院',
    studentId: '2021001234',
    realName: '张同学',
    avatar: ''
  });

  // 密码修改状态
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // 通知设置状态
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    examReminders: true,
    gradeUpdates: true,
    courseAnnouncements: true,
    systemNotifications: false,
    emailNotifications: true,
    smsNotifications: false
  });

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditing(false);
      // TODO: 实际保存逻辑
    } catch (error) {
      console.error('保存用户信息失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('新密码和确认密码不一致');
      return;
    }
    
    setIsLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('密码修改成功');
      // TODO: 实际密码修改逻辑
    } catch (error) {
      console.error('密码修改失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationToggle = (key: keyof NotificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleLogout = () => {
    logout();
    try {
      router.navigate({ to: '/login' });
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDeviceIcon = (device: string) => {
    if (device.includes('iPhone') || device.includes('iOS')) {
      return <Smartphone className="h-4 w-4" />;
    } else if (device.includes('Android')) {
      return <Smartphone className="h-4 w-4" />;
    } else if (device.includes('Windows') || device.includes('Mac')) {
      return <Laptop className="h-4 w-4" />;
    } else {
      return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse" style={{animationDelay: '0s'}}></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-indigo-200/20 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-3/4 w-72 h-72 bg-purple-200/20 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-lg shadow-xl border-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link 
                to="/dashboard" 
                className="flex items-center text-gray-600 hover:text-blue-600 mr-6 transition-colors duration-200 hover:bg-blue-50 px-3 py-2 rounded-lg"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                返回主页
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900">个人中心</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 侧边导航 */}
          <div className="lg:w-80 space-y-6">
            {/* 用户信息卡片 */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-lg">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{userInfo.realName}</h3>
                  <p className="text-sm text-gray-600 mb-2">{userInfo.username}</p>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {user?.role === 'admin' ? '管理员' : user?.role === 'teacher' ? '教师' : '学生'}
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    {userInfo.department}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 导航菜单 */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">设置菜单</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  {[
                    { id: 'profile', label: '基本信息', icon: User, color: 'from-blue-500 to-blue-600' },
                    { id: 'security', label: '安全设置', icon: Shield, color: 'from-green-500 to-green-600' },
                    { id: 'notifications', label: '通知设置', icon: Bell, color: 'from-purple-500 to-purple-600' },
                    { id: 'history', label: '登录历史', icon: Clock, color: 'from-yellow-500 to-yellow-600' }
                  ].map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id as any)}
                        className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-left transition-all duration-200 group ${
                          activeTab === item.id
                            ? `bg-gradient-to-r ${item.color} text-white shadow-lg transform scale-105`
                            : 'text-gray-700 hover:bg-gray-50 hover:shadow-md hover:scale-105'
                        }`}
                      >
                        <div className={`p-2 rounded-lg transition-all duration-200 ${
                          activeTab === item.id 
                            ? 'bg-white/20' 
                            : 'bg-gray-100 group-hover:bg-gray-200'
                        }`}>
                          <IconComponent className={`h-4 w-4 ${
                            activeTab === item.id ? 'text-white' : 'text-gray-600 group-hover:text-gray-800'
                          }`} />
                        </div>
                        <span className={`font-medium transition-colors ${
                          activeTab === item.id ? 'text-white' : 'text-gray-700 group-hover:text-gray-900'
                        }`}>
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>

            {/* 退出登录 */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-lg">
              <CardContent className="p-4">
                <div className="border-t border-red-100 pt-4">
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-all duration-200"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    退出登录
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 主要内容 */}
          <div className="flex-1">
            {/* 基本信息 */}
            {activeTab === 'profile' && (
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      基本信息
                    </CardTitle>
                    <Button
                      onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {isLoading ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : isEditing ? (
                        <Save className="h-4 w-4 mr-2" />
                      ) : (
                        <Edit3 className="h-4 w-4 mr-2" />
                      )}
                      {isLoading ? '保存中...' : isEditing ? '保存' : '编辑'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">真实姓名</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          value={userInfo.realName}
                          onChange={(e) => setUserInfo(prev => ({ ...prev, realName: e.target.value }))}
                          disabled={!isEditing}
                          className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">用户名</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          value={userInfo.username}
                          onChange={(e) => setUserInfo(prev => ({ ...prev, username: e.target.value }))}
                          disabled={!isEditing}
                          className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">邮箱地址</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          value={userInfo.email}
                          onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                          disabled={!isEditing}
                          type="email"
                          className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">手机号码</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          value={userInfo.phone}
                          onChange={(e) => setUserInfo(prev => ({ ...prev, phone: e.target.value }))}
                          disabled={!isEditing}
                          className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">学号</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          value={userInfo.studentId}
                          disabled
                          className="pl-10 bg-gray-50 border-gray-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">所属学院</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          value={userInfo.department}
                          onChange={(e) => setUserInfo(prev => ({ ...prev, department: e.target.value }))}
                          disabled={!isEditing}
                          className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 安全设置 */}
            {activeTab === 'security' && (
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3">
                      <Shield className="h-4 w-4 text-white" />
                    </div>
                    安全设置
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <div>
                        <h4 className="font-medium text-yellow-800">密码安全提醒</h4>
                        <p className="text-sm text-yellow-700">为了账户安全，建议定期更换密码，使用强密码组合。</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">修改密码</h3>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">当前密码</label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="password"
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                          className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                          placeholder="请输入当前密码"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">新密码</label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="pl-10 pr-10 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                          placeholder="请输入新密码"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">确认新密码</label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                          placeholder="请再次输入新密码"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleChangePassword}
                      disabled={isLoading || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {isLoading ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      {isLoading ? '修改中...' : '修改密码'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 通知设置 */}
            {activeTab === 'notifications' && (
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                      <Bell className="h-4 w-4 text-white" />
                    </div>
                    通知设置
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <Bell className="h-5 w-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium text-blue-800">通知偏好设置</h4>
                        <p className="text-sm text-blue-700">选择您希望接收的通知类型，以获得更好的学习体验。</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">应用内通知</h3>
                      <div className="space-y-4">
                        {[
                          { key: 'examReminders', label: '考试提醒', description: '考试开始前的提醒通知' },
                          { key: 'gradeUpdates', label: '成绩更新', description: '考试成绩发布时的通知' },
                          { key: 'courseAnnouncements', label: '课程公告', description: '教师发布的课程相关公告' },
                          { key: 'systemNotifications', label: '系统通知', description: '系统维护、更新等重要通知' }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{item.label}</h4>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                            <button
                              onClick={() => handleNotificationToggle(item.key as keyof NotificationSettings)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                notificationSettings[item.key as keyof NotificationSettings] ? 'bg-blue-600' : 'bg-gray-200'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  notificationSettings[item.key as keyof NotificationSettings] ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">外部通知</h3>
                      <div className="space-y-4">
                        {[
                          { key: 'emailNotifications', label: '邮箱通知', description: '通过邮箱接收重要通知' },
                          { key: 'smsNotifications', label: '短信通知', description: '通过短信接收紧急通知' }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{item.label}</h4>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                            <button
                              onClick={() => handleNotificationToggle(item.key as keyof NotificationSettings)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                notificationSettings[item.key as keyof NotificationSettings] ? 'bg-blue-600' : 'bg-gray-200'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  notificationSettings[item.key as keyof NotificationSettings] ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 登录历史 */}
            {activeTab === 'history' && (
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center mr-3">
                      <Clock className="h-4 w-4 text-white" />
                    </div>
                    登录历史
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockLoginHistory.map((login) => (
                      <div 
                        key={login.id} 
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-lg ${
                            login.status === 'success' ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {getDeviceIcon(login.device)}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium text-gray-900">{login.device}</h4>
                              {login.status === 'success' ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>IP: {login.ip} • {login.location}</p>
                              <p>{formatDate(login.timestamp)}</p>
                              <p className="text-xs text-gray-500">{login.userAgent}</p>
                            </div>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          login.status === 'success' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {login.status === 'success' ? '成功' : '失败'}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 text-center">
                    <Button variant="outline" className="hover:bg-gray-50 transition-colors">
                      查看更多历史记录
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
