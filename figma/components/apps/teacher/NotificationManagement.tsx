import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Textarea } from '../../ui/textarea';
import { Checkbox } from '../../ui/checkbox';
import { Switch } from '../../ui/switch';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { 
  Bell,
  Send,
  Plus,
  Search,
  Filter,
  Settings,
  MessageSquare,
  Mail,
  Smartphone,
  Calendar,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  Info,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Copy
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  content: string;
  type: 'announcement' | 'assignment' | 'exam' | 'system' | 'reminder';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  recipients: {
    type: 'all' | 'course' | 'class' | 'individual';
    count: number;
    details: string[];
  };
  channels: ('app' | 'email' | 'sms')[];
  createdAt: string;
  scheduledAt?: string;
  sentAt?: string;
  readCount?: number;
}

const mockNotifications: Notification[] = [
  {
    id: 'n1',
    title: '第三章作业提交提醒',
    content: '请各位同学注意，第三章作业截止时间为本周五晚上23:59，请及时提交。如有疑问，请在课程群或答疑区提出。',
    type: 'assignment',
    priority: 'medium',
    status: 'sent',
    recipients: {
      type: 'course',
      count: 125,
      details: ['高等数学A-01班', '高等数学A-02班', '高等数学A-03班']
    },
    channels: ['app', 'email'],
    createdAt: '2025-01-20 09:00',
    sentAt: '2025-01-20 09:05',
    readCount: 98
  },
  {
    id: 'n2',
    title: '期中考试安排通知',
    content: '期中考试将于2025年1月25日举行，考试时间为14:00-16:00，考试地点为教学楼A201-A203。请同学们携带学生证和文具，不允许携带电子设备。',
    type: 'exam',
    priority: 'high',
    status: 'scheduled',
    recipients: {
      type: 'all',
      count: 245,
      details: ['全部学生']
    },
    channels: ['app', 'email', 'sms'],
    createdAt: '2025-01-19 16:30',
    scheduledAt: '2025-01-22 08:00'
  },
  {
    id: 'n3',
    title: '课程调整通知',
    content: '由于教室维修，原定本周三的高等数学A课程调整至周四同一时间，地点改为教学楼B105。',
    type: 'announcement',
    priority: 'urgent',
    status: 'draft',
    recipients: {
      type: 'class',
      count: 45,
      details: ['高等数学A-01班']
    },
    channels: ['app', 'sms'],
    createdAt: '2025-01-20 14:15'
  }
];

export function NotificationManagement() {
  const [selectedTab, setSelectedTab] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | Notification['status']>('all');

  const filteredNotifications = mockNotifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || notification.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'announcement': return <MessageSquare className="w-4 h-4" />;
      case 'assignment': return <CheckCircle className="w-4 h-4" />;
      case 'exam': return <Calendar className="w-4 h-4" />;
      case 'system': return <Settings className="w-4 h-4" />;
      case 'reminder': return <Clock className="w-4 h-4" />;
    }
  };

  const getTypeText = (type: Notification['type']) => {
    switch (type) {
      case 'announcement': return '课程公告';
      case 'assignment': return '作业通知';
      case 'exam': return '考试通知';
      case 'system': return '系统消息';
      case 'reminder': return '提醒消息';
    }
  };

  const getStatusIcon = (status: Notification['status']) => {
    switch (status) {
      case 'draft': return <Edit className="w-4 h-4 text-muted-foreground" />;
      case 'scheduled': return <Clock className="w-4 h-4 text-chart-3" />;
      case 'sent': return <CheckCircle className="w-4 h-4 text-chart-1" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-destructive" />;
    }
  };

  const getStatusText = (status: Notification['status']) => {
    switch (status) {
      case 'draft': return '草稿';
      case 'scheduled': return '已排期';
      case 'sent': return '已发送';
      case 'failed': return '发送失败';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1>通知管理</h1>
          <p className="text-muted-foreground">管理课程通知、公告和提醒消息</p>
        </div>
        <Button className="gap-2" onClick={() => setSelectedTab('create')}>
          <Plus className="w-4 h-4" />
          创建通知
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-1">
              {mockNotifications.filter(n => n.status === 'sent').length}
            </div>
            <p className="text-sm text-muted-foreground">已发送</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-3">
              {mockNotifications.filter(n => n.status === 'scheduled').length}
            </div>
            <p className="text-sm text-muted-foreground">已排期</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-muted-foreground">
              {mockNotifications.filter(n => n.status === 'draft').length}
            </div>
            <p className="text-sm text-muted-foreground">草稿</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-2">
              {mockNotifications.filter(n => n.readCount).reduce((sum, n) => sum + (n.readCount || 0), 0)}
            </div>
            <p className="text-sm text-muted-foreground">总阅读数</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">通知列表</TabsTrigger>
          <TabsTrigger value="create">创建通知</TabsTrigger>
          <TabsTrigger value="templates">消息模板</TabsTrigger>
          <TabsTrigger value="settings">通知设置</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>通知列表</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="搜索通知..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Filter className="w-4 h-4" />
                        {filterStatus === 'all' ? '全部状态' : getStatusText(filterStatus)}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                        全部状态
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus('sent')}>
                        已发送
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus('scheduled')}>
                        已排期
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus('draft')}>
                        草稿
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus('failed')}>
                        发送失败
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <Card key={notification.id} className="hover:shadow-sm transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(notification.type)}
                            <h4 className="font-medium">{notification.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {getTypeText(notification.type)}
                            </Badge>
                            {getStatusIcon(notification.status)}
                            <Badge variant={notification.status === 'sent' ? 'default' : 'secondary'} className="text-xs">
                              {getStatusText(notification.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {notification.content}
                          </p>
                        </div>
                        
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
                              <Edit className="w-4 h-4 mr-2" />
                              编辑通知
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="w-4 h-4 mr-2" />
                              复制通知
                            </DropdownMenuItem>
                            {notification.status === 'draft' && (
                              <DropdownMenuItem>
                                <Send className="w-4 h-4 mr-2" />
                                立即发送
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              删除通知
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">接收对象</p>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{notification.recipients.count}人</span>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-muted-foreground">发送渠道</p>
                          <div className="flex items-center gap-1">
                            {notification.channels.includes('app') && <Smartphone className="w-3 h-3" />}
                            {notification.channels.includes('email') && <Mail className="w-3 h-3" />}
                            {notification.channels.includes('sms') && <MessageSquare className="w-3 h-3" />}
                            <span>{notification.channels.length}个渠道</span>
                          </div>
                        </div>

                        <div>
                          <p className="text-muted-foreground">时间</p>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>
                              {notification.status === 'sent' && notification.sentAt && 
                                `已发送 ${new Date(notification.sentAt).toLocaleDateString('zh-CN')}`}
                              {notification.status === 'scheduled' && notification.scheduledAt && 
                                `排期 ${new Date(notification.scheduledAt).toLocaleDateString('zh-CN')}`}
                              {(notification.status === 'draft' || notification.status === 'failed') && 
                                `创建 ${new Date(notification.createdAt).toLocaleDateString('zh-CN')}`}
                            </span>
                          </div>
                        </div>

                        <div>
                          <p className="text-muted-foreground">阅读情况</p>
                          <span>
                            {notification.readCount ? `${notification.readCount}/${notification.recipients.count}` : '--'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>创建通知</CardTitle>
              <CardDescription>发送新的通知给学生</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>创建通知功能开发中...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>消息模板</CardTitle>
              <CardDescription>管理可复用的通知模板</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>消息模板功能开发中...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>通知设置</CardTitle>
              <CardDescription>配置通知发送规则和参数</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Settings className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>通知设置功能开发中...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}