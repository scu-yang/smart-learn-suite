import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Switch } from '../../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Checkbox } from '../../ui/checkbox';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { 
  Shield,
  Users,
  Lock,
  Key,
  Settings,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Search,
  Save,
  RefreshCw
} from 'lucide-react';

interface Role {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  userCount: number;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  isDefault: boolean;
}

interface PermissionCategory {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

const mockRoles: Role[] = [
  {
    id: 'role1',
    name: '系统管理员',
    description: '拥有系统最高权限，可以管理所有功能',
    isSystem: true,
    userCount: 2,
    permissions: ['all'],
    createdAt: '2024-08-01',
    updatedAt: '2025-01-15'
  },
  {
    id: 'role2',
    name: '学校管理员',
    description: '管理学校内的用户和课程',
    isSystem: true,
    userCount: 5,
    permissions: ['user_manage', 'course_manage', 'data_view'],
    createdAt: '2024-08-01',
    updatedAt: '2025-01-10'
  },
  {
    id: 'role3',
    name: '教师',
    description: '教师角色，可以管理课程和学生',
    isSystem: true,
    userCount: 45,
    permissions: ['course_create', 'course_edit', 'student_manage', 'grade_manage'],
    createdAt: '2024-08-01',
    updatedAt: '2024-12-20'
  },
  {
    id: 'role4',
    name: '助教',
    description: '协助教师管理课程',
    isSystem: true,
    userCount: 12,
    permissions: ['course_view', 'student_view', 'grade_view', 'qa_manage'],
    createdAt: '2024-08-01',
    updatedAt: '2024-11-15'
  },
  {
    id: 'role5',
    name: '学生',
    description: '学生角色，可以查看课程和提交作业',
    isSystem: true,
    userCount: 1250,
    permissions: ['course_view', 'assignment_submit', 'qa_participate'],
    createdAt: '2024-08-01',
    updatedAt: '2024-10-10'
  }
];

const mockPermissionCategories: PermissionCategory[] = [
  {
    id: 'user',
    name: '用户管理',
    description: '用户账户相关权限',
    permissions: [
      { id: 'user_create', name: '创建用户', description: '可以创建新用户账户', category: 'user', isDefault: false },
      { id: 'user_edit', name: '编辑用户', description: '可以修改用户信息', category: 'user', isDefault: false },
      { id: 'user_delete', name: '删除用户', description: '可以删除用户账户', category: 'user', isDefault: false },
      { id: 'user_view', name: '查看用户', description: '可以查看用户列表和详情', category: 'user', isDefault: true }
    ]
  },
  {
    id: 'course',
    name: '课程管理',
    description: '课程相关权限',
    permissions: [
      { id: 'course_create', name: '创建课程', description: '可以创建新课程', category: 'course', isDefault: false },
      { id: 'course_edit', name: '编辑课程', description: '可以修改课程内容', category: 'course', isDefault: false },
      { id: 'course_delete', name: '删除课程', description: '可以删除课程', category: 'course', isDefault: false },
      { id: 'course_view', name: '查看课程', description: '可以查看课程内容', category: 'course', isDefault: true }
    ]
  },
  {
    id: 'grade',
    name: '成绩管理',
    description: '成绩和评分相关权限',
    permissions: [
      { id: 'grade_manage', name: '管理成绩', description: '可以录入和修改成绩', category: 'grade', isDefault: false },
      { id: 'grade_view', name: '查看成绩', description: '可以查看学生成绩', category: 'grade', isDefault: false },
      { id: 'grade_export', name: '导出成绩', description: '可以导出成绩报表', category: 'grade', isDefault: false }
    ]
  },
  {
    id: 'system',
    name: '系统管理',
    description: '系统配置和管理权限',
    permissions: [
      { id: 'system_config', name: '系统配置', description: '可以修改系统配置', category: 'system', isDefault: false },
      { id: 'system_monitor', name: '系统监控', description: '可以查看系统状态', category: 'system', isDefault: false },
      { id: 'data_manage', name: '数据管理', description: '可以管理数据库和备份', category: 'system', isDefault: false },
      { id: 'log_view', name: '查看日志', description: '可以查看系统日志', category: 'system', isDefault: false }
    ]
  }
];

export function PermissionConfig() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [rolePermissions, setRolePermissions] = useState<string[]>([]);

  const filteredRoles = mockRoles.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setRolePermissions(role.permissions);
  };

  const handlePermissionToggle = (permissionId: string, checked: boolean) => {
    if (checked) {
      setRolePermissions(prev => [...prev, permissionId]);
    } else {
      setRolePermissions(prev => prev.filter(id => id !== permissionId));
    }
  };

  const hasPermission = (permissionId: string) => {
    return rolePermissions.includes(permissionId) || rolePermissions.includes('all');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1>权限配置</h1>
          <p className="text-muted-foreground">管理用户角色和权限设置</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            刷新
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            新建角色
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-1">
              {mockRoles.length}
            </div>
            <p className="text-sm text-muted-foreground">角色总数</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-2">
              {mockPermissionCategories.reduce((sum, cat) => sum + cat.permissions.length, 0)}
            </div>
            <p className="text-sm text-muted-foreground">权限总数</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-3">
              {mockRoles.reduce((sum, role) => sum + role.userCount, 0)}
            </div>
            <p className="text-sm text-muted-foreground">用户总数</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-4">
              {mockRoles.filter(role => role.isSystem).length}
            </div>
            <p className="text-sm text-muted-foreground">系统角色</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roles List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                角色列表
              </CardTitle>
              <CardDescription>点击角色配置权限</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="搜索角色..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredRoles.map((role) => (
                  <div
                    key={role.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                      selectedRole?.id === role.id ? 'ring-2 ring-primary bg-accent/50' : ''
                    }`}
                    onClick={() => handleRoleSelect(role)}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{role.name}</h4>
                          {role.isSystem && (
                            <Badge variant="outline" className="text-xs">
                              系统
                            </Badge>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="w-6 h-6">
                              <MoreVertical className="w-3 h-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              编辑角色
                            </DropdownMenuItem>
                            {!role.isSystem && (
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" />
                                删除角色
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {role.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{role.userCount} 个用户</span>
                        <span>{role.permissions.length} 个权限</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Permission Configuration */}
        <div className="lg:col-span-2">
          {selectedRole ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      配置权限 - {selectedRole.name}
                    </CardTitle>
                    <CardDescription>
                      {selectedRole.description}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      重置
                    </Button>
                    <Button size="sm" className="gap-2">
                      <Save className="w-4 h-4" />
                      保存
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="permissions" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="permissions">权限设置</TabsTrigger>
                    <TabsTrigger value="info">角色信息</TabsTrigger>
                  </TabsList>

                  <TabsContent value="permissions" className="space-y-4">
                    {selectedRole.permissions.includes('all') ? (
                      <div className="p-4 bg-chart-1/10 border border-chart-1/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-chart-1" />
                          <h4 className="font-medium text-chart-1">超级管理员</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          此角色拥有系统所有权限，无需单独配置
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {mockPermissionCategories.map((category) => (
                          <Card key={category.id}>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base">{category.name}</CardTitle>
                              <CardDescription className="text-sm">
                                {category.description}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                {category.permissions.map((permission) => (
                                  <div key={permission.id} className="flex items-start space-x-3">
                                    <Checkbox
                                      id={permission.id}
                                      checked={hasPermission(permission.id)}
                                      onCheckedChange={(checked) => 
                                        handlePermissionToggle(permission.id, checked as boolean)
                                      }
                                      disabled={selectedRole.isSystem && permission.isDefault}
                                    />
                                    <div className="space-y-1 leading-none">
                                      <label
                                        htmlFor={permission.id}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                      >
                                        {permission.name}
                                        {permission.isDefault && (
                                          <Badge variant="secondary" className="ml-2 text-xs">
                                            默认
                                          </Badge>
                                        )}
                                      </label>
                                      <p className="text-xs text-muted-foreground">
                                        {permission.description}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="info" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <h4 className="font-medium">基本信息</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">角色名称：</span>
                                <span>{selectedRole.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">用户数量：</span>
                                <span>{selectedRole.userCount}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">创建时间：</span>
                                <span>{new Date(selectedRole.createdAt).toLocaleDateString('zh-CN')}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">更新时间：</span>
                                <span>{new Date(selectedRole.updatedAt).toLocaleDateString('zh-CN')}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <h4 className="font-medium">权限统计</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">已分配权限：</span>
                                <span>{selectedRole.permissions.includes('all') ? '全部' : selectedRole.permissions.length}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">系统角色：</span>
                                <span>{selectedRole.isSystem ? '是' : '否'}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">选择角色配置权限</h3>
                <p className="text-muted-foreground">
                  从左侧列表中选择一个角色来配置其权限设置
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}