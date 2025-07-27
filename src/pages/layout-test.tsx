import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard,
  BookOpen,
  Bell,
  User,
  MessageSquare,
  ChevronRight
} from 'lucide-react';

export function LayoutTestPage() {
  const layoutFeatures = [
    {
      title: '统一布局系统',
      description: '所有主要页面都使用统一的布局，包含侧边栏、顶部导航和内容区域',
      icon: LayoutDashboard,
      badge: '已完成',
      color: 'bg-green-100 text-green-800'
    },
    {
      title: '可折叠侧边栏',
      description: '侧边栏支持折叠和展开，根据角色显示不同的菜单项',
      icon: BookOpen,
      badge: '已完成',
      color: 'bg-green-100 text-green-800'
    },
    {
      title: '顶部导航栏',
      description: '包含标题、搜索框、通知和用户信息的完整导航体验',
      icon: Bell,
      badge: '已完成',
      color: 'bg-green-100 text-green-800'
    },
    {
      title: '个人信息区域',
      description: '用户头像、角色标识和下拉菜单的完整用户体验',
      icon: User,
      badge: '已完成',
      color: 'bg-green-100 text-green-800'
    }
  ];

  const testPages = [
    { path: '/dashboard', title: '仪表盘', description: '主要的数据概览页面' },
    { path: '/courses', title: '我的课程', description: '课程列表和管理' },
    { path: '/notifications', title: '通知中心', description: '系统通知和消息' },
    { path: '/profile', title: '个人资料', description: '用户信息管理' },
    { path: '/messages', title: '消息中心', description: '聊天和通讯功能' },
    { path: '/settings', title: '系统设置', description: '应用配置和偏好' }
  ];

  return (
    <div className="space-y-8">
      {/* 页面头部 */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          新布局系统测试页面
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          我们已经成功重构了页面布局系统。现在所有主要页面都使用统一的布局，
          包含可折叠的侧边栏、顶部导航栏和个人信息区域。
        </p>
      </div>

      {/* 布局特性展示 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {layoutFeatures.map((feature, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
                <Badge className={feature.color}>
                  {feature.badge}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 页面测试链接 */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">
          测试新布局的页面
        </h2>
        <p className="text-gray-600">
          点击下面的链接来测试不同页面的新布局效果：
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testPages.map((page, index) => (
            <Link key={index} to={page.path}>
              <Card className="hover:shadow-md transition-all hover:border-blue-300 cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{page.title}</h3>
                      <p className="text-sm text-gray-500">{page.description}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* 使用说明 */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            布局系统说明
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-blue-800">
          <div className="space-y-2">
            <h4 className="font-medium">主要特性：</h4>
            <ul className="space-y-1 text-sm">
              <li>• <strong>统一布局：</strong>所有主要页面都使用相同的布局结构</li>
              <li>• <strong>可折叠侧边栏：</strong>点击侧边栏顶部的折叠按钮来切换侧边栏状态</li>
              <li>• <strong>角色菜单：</strong>侧边栏根据用户角色显示不同的功能菜单</li>
              <li>• <strong>搜索功能：</strong>顶部导航栏包含全局搜索框</li>
              <li>• <strong>通知系统：</strong>右上角的通知图标显示未读通知数量</li>
              <li>• <strong>用户菜单：</strong>点击用户头像查看个人信息和设置选项</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">测试建议：</h4>
            <ul className="space-y-1 text-sm">
              <li>• 尝试折叠和展开侧边栏</li>
              <li>• 点击不同的菜单项来切换页面</li>
              <li>• 测试搜索框的交互效果</li>
              <li>• 查看用户下拉菜单的功能</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
