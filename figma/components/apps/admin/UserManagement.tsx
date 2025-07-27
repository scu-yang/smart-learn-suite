import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { 
  Users,
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Shield,
  Mail,
  Phone,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'student' | 'teacher' | 'ta' | 'admin' | 'school_admin';
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  school: string;
  department?: string;
  createdAt: string;
  lastLogin?: string;
  avatar?: string;
  courses?: number;
  students?: number;
}

const mockUsers: User[] = [
  {
    id: 'u1',
    name: '张教授',
    email: 'teacher@university.edu',
    phone: '138****1234',
    role: 'teacher',
    status: 'active',
    school: '北京大学',
    department: '数学系',
    createdAt: '2024-09-01',
    lastLogin: '2025-01-20 09:30',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=32&h=32&fit=crop&crop=face',
    courses: 3,
    students: 125
  },
  {
    id: 'u2',
    name: '李同学',
    email: 'student@university.edu',
    phone: '139****5678',
    role: 'student',
    status: 'active',
    school: '北京大学',
    department: '计算机系',
    createdAt: '2024-09-01',
    lastLogin: '2025-01-20 14:15',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5b5?w=32&h=32&fit=crop&crop=face'
  },
  {
    id: 'u3',
    name: '王助教',
    email: 'ta@university.edu',
    role: 'ta',
    status: 'active',
    school: '北京大学',
    department: '数学系',
    createdAt: '2024-09-15',
    lastLogin: '2025-01-19 16:45',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    courses: 2,
    students: 87
  },
  {
    id: 'u4',
    name: '赵管理员',
    email: 'admin@university.edu',
    role: 'admin',
    status: 'active',
    school: '北京大学',
    createdAt: '2024-08-01',
    lastLogin: '2025-01-20 10:00',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
  },
  {
    id: 'u5',
    name: '孙同学',
    email: 'sun@university.edu',
    role: 'student',
    status: 'pending',
    school: '北京大学',
    department: '物理系',
    createdAt: '2025-01-18',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face'
  },
  {
    id: 'u6',
    name: '刘老师',
    email: 'liu@university.edu',
    role: 'teacher',
    status: 'suspended',
    school: '北京大学',
    department: '化学系',
    createdAt: '2024-10-01',
    lastLogin: '2025-01-15 11:20',
    courses: 2,
    students: 68
  }
];

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | User['role']>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | User['status']>('all');

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.school.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleIcon = (role: User['role']) => {
    switch (role) {
      case 'teacher': return '👨‍🏫';
      case 'student': return '👨‍🎓';
      case 'ta': return '👥';
      case 'admin': return '⚙️';
      case 'school_admin': return '🏫';
    }
  };

  const getRoleText = (role: User['role']) => {
    switch (role) {
      case 'teacher': return '教师';
      case 'student': return '学生';
      case 'ta': return '助教';
      case 'admin': return '系统管理员';
      case 'school_admin': return '学校管理员';
    }
  };

  const getStatusIcon = (status: User['status']) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-chart-1" />;
      case 'inactive': return <Clock className="w-4 h-4 text-muted-foreground" />;
      case 'pending': return <AlertCircle className="w-4 h-4 text-chart-3" />;
      case 'suspended': return <AlertCircle className="w-4 h-4 text-destructive" />;
    }
  };

  const getStatusText = (status: User['status']) => {
    switch (status) {
      case 'active': return '正常';
      case 'inactive': return '未激活';
      case 'pending': return '待审核';
      case 'suspended': return '已停用';
    }
  };

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'pending': return 'outline';
      case 'suspended': return 'destructive';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1>用户管理</h1>
          <p className="text-muted-foreground">管理系统用户和权限</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="w-4 h-4" />
            批量导入
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            导出用户
          </Button>
          <Button className="gap-2">
            <UserPlus className="w-4 h-4" />
            添加用户
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-1">
              {mockUsers.filter(u => u.role === 'teacher').length}
            </div>
            <p className="text-sm text-muted-foreground">教师</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-2">
              {mockUsers.filter(u => u.role === 'student').length}
            </div>
            <p className="text-sm text-muted-foreground">学生</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-3">
              {mockUsers.filter(u => u.role === 'ta').length}
            </div>
            <p className="text-sm text-muted-foreground">助教</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-4">
              {mockUsers.filter(u => u.status === 'pending').length}
            </div>
            <p className="text-sm text-muted-foreground">待审核</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive">
              {mockUsers.filter(u => u.status === 'suspended').length}
            </div>
            <p className="text-sm text-muted-foreground">已停用</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="users">用户列表</TabsTrigger>
            <TabsTrigger value="roles">角色权限</TabsTrigger>
            <TabsTrigger value="audit">操作日志</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="搜索用户..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  筛选
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>按角色筛选</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilterRole('all')}>
                  全部角色
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterRole('teacher')}>
                  教师
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterRole('student')}>
                  学生
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterRole('ta')}>
                  助教
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterRole('admin')}>
                  管理员
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>按状态筛选</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                  全部状态
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('active')}>
                  正常
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('pending')}>
                  待审核
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('suspended')}>
                  已停用
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="icon">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>用户列表</CardTitle>
              <CardDescription>共 {filteredUsers.length} 个用户</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <Card key={user.id} className="hover:shadow-sm transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{user.name}</h4>
                            <span className="text-lg">{getRoleIcon(user.role)}</span>
                            <Badge variant="outline" className="text-xs">
                              {getRoleText(user.role)}
                            </Badge>
                            {getStatusIcon(user.status)}
                            <Badge variant={getStatusColor(user.status)} className="text-xs">
                              {getStatusText(user.status)}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground text-xs">联系信息</p>
                              <div className="space-y-1">
                                <div className="flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  <span>{user.email}</span>
                                </div>
                                {user.phone && (
                                  <div className="flex items-center gap-1">
                                    <Phone className="w-3 h-3" />
                                    <span>{user.phone}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div>
                              <p className="text-muted-foreground text-xs">所属机构</p>
                              <div>
                                <p className="font-medium">{user.school}</p>
                                {user.department && (
                                  <p className="text-xs text-muted-foreground">{user.department}</p>
                                )}
                              </div>
                            </div>

                            <div>
                              <p className="text-muted-foreground text-xs">创建时间</p>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{new Date(user.createdAt).toLocaleDateString('zh-CN')}</span>
                              </div>
                              {user.lastLogin && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="w-3 h-3" />
                                  <span>最后登录：{new Date(user.lastLogin).toLocaleDateString('zh-CN')}</span>
                                </div>
                              )}
                            </div>

                            {(user.role === 'teacher' || user.role === 'ta') && (
                              <div>
                                <p className="text-muted-foreground text-xs">教学数据</p>
                                <div className="space-y-1">
                                  {user.courses && (
                                    <p className="text-xs">课程：{user.courses}门</p>
                                  )}
                                  {user.students && (
                                    <p className="text-xs">学生：{user.students}人</p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="w-8 h-8">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="w-8 h-8">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                编辑用户
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Shield className="w-4 h-4 mr-2" />
                                权限设置
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="w-4 h-4 mr-2" />
                                发送邮件
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {user.status === 'active' ? (
                                <DropdownMenuItem className="text-destructive">
                                  <AlertCircle className="w-4 h-4 mr-2" />
                                  停用账号
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  启用账号
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" />
                                删除用户
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                角色权限管理
              </CardTitle>
              <CardDescription>配置不同角色的系统权限</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>角色权限管理功能开发中...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>操作日志</CardTitle>
              <CardDescription>查看系统操作记录</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Eye className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>操作日志功能开发中...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}