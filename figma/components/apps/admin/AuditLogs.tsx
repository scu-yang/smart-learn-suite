import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { 
  FileText,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Shield,
  Database,
  Settings,
  Calendar,
  MoreVertical,
  ExternalLink,
  Trash2
} from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  category: 'auth' | 'data' | 'system' | 'user' | 'security';
  action: string;
  user: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  resource: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  result: 'success' | 'failed' | 'blocked';
}

const mockAuditLogs: AuditLog[] = [
  {
    id: 'log1',
    timestamp: '2025-01-20 14:30:15',
    level: 'warning',
    category: 'security',
    action: '多次登录失败',
    user: {
      id: 'unknown',
      name: '未知用户',
      role: '访客'
    },
    resource: '登录系统',
    details: '用户尝试使用错误密码登录，连续失败5次',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    result: 'blocked'
  },
  {
    id: 'log2',
    timestamp: '2025-01-20 14:25:33',
    level: 'info',
    category: 'user',
    action: '用户登录',
    user: {
      id: 'u1',
      name: '张教授',
      role: '教师',
      avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=32&h=32&fit=crop&crop=face'
    },
    resource: '智慧教学系统',
    details: '用户成功登录系统',
    ipAddress: '192.168.1.50',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    result: 'success'
  },
  {
    id: 'log3',
    timestamp: '2025-01-20 14:20:02',
    level: 'error',
    category: 'data',
    action: '数据库查询失败',
    user: {
      id: 'system',
      name: '系统',
      role: '系统'
    },
    resource: '用户数据库',
    details: '查询超时：SELECT * FROM users WHERE status = "active"',
    ipAddress: '127.0.0.1',
    userAgent: 'System Internal',
    result: 'failed'
  },
  {
    id: 'log4',
    timestamp: '2025-01-20 14:15:44',
    level: 'info',
    category: 'user',
    action: '修改用户信息',
    user: {
      id: 'admin1',
      name: '系统管理员',
      role: '管理员',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
    },
    resource: '用户管理',
    details: '修改用户ID为u123的邮箱地址',
    ipAddress: '192.168.1.10',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    result: 'success'
  },
  {
    id: 'log5',
    timestamp: '2025-01-20 14:10:12',
    level: 'critical',
    category: 'security',
    action: '权限提升尝试',
    user: {
      id: 'u456',
      name: '李同学',
      role: '学生',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5b5?w=32&h=32&fit=crop&crop=face'
    },
    resource: '系统设置',
    details: '学生用户尝试访问管理员功能',
    ipAddress: '192.168.1.75',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)',
    result: 'blocked'
  },
  {
    id: 'log6',
    timestamp: '2025-01-20 14:05:33',
    level: 'info',
    category: 'data',
    action: '数据备份',
    user: {
      id: 'system',
      name: '系统',
      role: '系统'
    },
    resource: '数据库',
    details: '定时备份任务执行成功',
    ipAddress: '127.0.0.1',
    userAgent: 'Backup Service',
    result: 'success'
  },
  {
    id: 'log7',
    timestamp: '2025-01-20 13:58:21',
    level: 'warning',
    category: 'system',
    action: '磁盘空间不足',
    user: {
      id: 'system',
      name: '系统',
      role: '系统'
    },
    resource: '服务器存储',
    details: '磁盘使用率达到85%，请及时清理',
    ipAddress: '127.0.0.1',
    userAgent: 'System Monitor',
    result: 'failed'
  }
];

export function AuditLogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<'all' | AuditLog['level']>('all');
  const [filterCategory, setFilterCategory] = useState<'all' | AuditLog['category']>('all');
  const [dateRange, setDateRange] = useState('today');

  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = filterLevel === 'all' || log.level === filterLevel;
    const matchesCategory = filterCategory === 'all' || log.category === filterCategory;
    return matchesSearch && matchesLevel && matchesCategory;
  });

  const getLevelIcon = (level: AuditLog['level']) => {
    switch (level) {
      case 'info': return <CheckCircle className="w-4 h-4 text-chart-2" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-chart-4" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'critical': return <AlertTriangle className="w-4 h-4 text-destructive" />;
    }
  };

  const getLevelColor = (level: AuditLog['level']) => {
    switch (level) {
      case 'info': return 'default';
      case 'warning': return 'outline';
      case 'error': return 'destructive';
      case 'critical': return 'destructive';
    }
  };

  const getCategoryIcon = (category: AuditLog['category']) => {
    switch (category) {
      case 'auth': return <User className="w-4 h-4" />;
      case 'data': return <Database className="w-4 h-4" />;
      case 'system': return <Settings className="w-4 h-4" />;
      case 'user': return <User className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
    }
  };

  const getCategoryText = (category: AuditLog['category']) => {
    switch (category) {
      case 'auth': return '认证';
      case 'data': return '数据';
      case 'system': return '系统';
      case 'user': return '用户';
      case 'security': return '安全';
    }
  };

  const getResultColor = (result: AuditLog['result']) => {
    switch (result) {
      case 'success': return 'text-chart-1';
      case 'failed': return 'text-destructive';
      case 'blocked': return 'text-chart-4';
    }
  };

  const getResultText = (result: AuditLog['result']) => {
    switch (result) {
      case 'success': return '成功';
      case 'failed': return '失败';
      case 'blocked': return '已阻止';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1>日志审计</h1>
          <p className="text-muted-foreground">系统操作日志和安全审计</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            刷新
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            导出日志
          </Button>
          <Button className="gap-2">
            <Settings className="w-4 h-4" />
            审计设置
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-2">
              {mockAuditLogs.filter(log => log.level === 'info').length}
            </div>
            <p className="text-sm text-muted-foreground">信息日志</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-4">
              {mockAuditLogs.filter(log => log.level === 'warning').length}
            </div>
            <p className="text-sm text-muted-foreground">警告日志</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive">
              {mockAuditLogs.filter(log => log.level === 'error').length}
            </div>
            <p className="text-sm text-muted-foreground">错误日志</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive">
              {mockAuditLogs.filter(log => log.level === 'critical').length}
            </div>
            <p className="text-sm text-muted-foreground">严重日志</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-1">
              {mockAuditLogs.filter(log => log.result === 'success').length}
            </div>
            <p className="text-sm text-muted-foreground">成功操作</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recent" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="recent">最近日志</TabsTrigger>
            <TabsTrigger value="security">安全事件</TabsTrigger>
            <TabsTrigger value="system">系统日志</TabsTrigger>
            <TabsTrigger value="user">用户操作</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="搜索日志..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            <Select value={filterLevel} onValueChange={(value: any) => setFilterLevel(value)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="级别" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部级别</SelectItem>
                <SelectItem value="info">信息</SelectItem>
                <SelectItem value="warning">警告</SelectItem>
                <SelectItem value="error">错误</SelectItem>
                <SelectItem value="critical">严重</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCategory} onValueChange={(value: any) => setFilterCategory(value)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部分类</SelectItem>
                <SelectItem value="auth">认证</SelectItem>
                <SelectItem value="data">数据</SelectItem>
                <SelectItem value="system">系统</SelectItem>
                <SelectItem value="user">用户</SelectItem>
                <SelectItem value="security">安全</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">今天</SelectItem>
                <SelectItem value="week">本周</SelectItem>
                <SelectItem value="month">本月</SelectItem>
                <SelectItem value="quarter">本季度</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                最近日志
              </CardTitle>
              <CardDescription>显示最新的系统操作日志</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredLogs.map((log) => (
                  <Card key={log.id} className="hover:shadow-sm transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            {getLevelIcon(log.level)}
                            {getCategoryIcon(log.category)}
                          </div>
                          
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{log.action}</h4>
                              <Badge variant={getLevelColor(log.level)} className="text-xs">
                                {log.level.toUpperCase()}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {getCategoryText(log.category)}
                              </Badge>
                              <span className={`text-xs font-medium ${getResultColor(log.result)}`}>
                                {getResultText(log.result)}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{new Date(log.timestamp).toLocaleString('zh-CN')}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Avatar className="w-4 h-4">
                                  <AvatarImage src={log.user.avatar} />
                                  <AvatarFallback className="text-xs">
                                    {log.user.name.slice(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{log.user.name} ({log.user.role})</span>
                              </div>
                              <span>IP: {log.ipAddress}</span>
                            </div>
                            
                            <p className="text-sm">{log.details}</p>
                            <div className="text-xs text-muted-foreground mt-1">
                              资源: {log.resource} | 用户代理: {log.userAgent}
                            </div>
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
                                <Eye className="w-4 h-4 mr-2" />
                                查看详情
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <ExternalLink className="w-4 h-4 mr-2" />
                                追踪来源
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="w-4 h-4 mr-2" />
                                导出记录
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

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                安全事件
              </CardTitle>
              <CardDescription>安全相关的操作和异常事件</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredLogs.filter(log => log.category === 'security').map((log) => (
                  <Card key={log.id} className="hover:shadow-sm transition-shadow border-destructive/20">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                          <Shield className="w-5 h-5 text-destructive" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-destructive">{log.action}</h4>
                            <Badge variant="destructive" className="text-xs">
                              安全事件
                            </Badge>
                          </div>
                          <p className="text-sm mb-2">{log.details}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>时间: {new Date(log.timestamp).toLocaleString('zh-CN')}</span>
                            <span>用户: {log.user.name}</span>
                            <span>IP: {log.ipAddress}</span>
                            <span className="text-destructive font-medium">{getResultText(log.result)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                系统日志
              </CardTitle>
              <CardDescription>系统运行和配置变更日志</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Settings className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>系统日志筛选视图开发中...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                用户操作
              </CardTitle>
              <CardDescription>用户行为和操作记录</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>用户操作日志筛选视图开发中...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}