import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  Bell, 
  Plus, 
  Search, 
  Send,
  Calendar,
  Users,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  content: string;
  targetClass: string;
  course: string;
  status: 'draft' | 'scheduled' | 'sent';
  createdAt: string;
  scheduledAt?: string;
  sentAt?: string;
  readCount: number;
  totalRecipients: number;
}

export function TANotificationManagement() {
  const [selectedTab, setSelectedTab] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Form state for creating/editing notifications
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetClass, setTargetClass] = useState('');
  const [course, setCourse] = useState('');
  const [isImportant, setIsImportant] = useState(false);

  // Mock data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: '下周实验课安排通知',
      content: '各位同学好，下周三的实验课时间调整为下午3-5点，地点在实验楼B201。请准时参加。',
      targetClass: '2025春-线性代数-01班',
      course: '线性代数',
      status: 'sent',
      createdAt: '2025-07-22T10:00:00Z',
      sentAt: '2025-07-22T10:30:00Z',
      readCount: 38,
      totalRecipients: 45
    },
    {
      id: '2',
      title: '期中考试复习资料',
      content: '期中考试将于下周进行，复习资料已上传到课程平台，请同学们认真复习。',
      targetClass: '2025春-微积分基础-02班',
      course: '微积分基础',
      status: 'scheduled',
      createdAt: '2025-07-23T09:00:00Z',
      scheduledAt: '2025-07-24T08:00:00Z',
      readCount: 0,
      totalRecipients: 38
    },
    {
      id: '3',
      title: '作业截止时间提醒',
      content: '第三章作业将于本周五晚上23:59截止，请还没提交的同学抓紧时间。',
      targetClass: '2025春-高等数学-03班',
      course: '高等数学',
      status: 'draft',
      createdAt: '2025-07-23T11:30:00Z',
      readCount: 0,
      totalRecipients: 52
    }
  ]);

  const classes = [
    '2025春-线性代数-01班',
    '2025春-微积分基础-02班',
    '2025春-高等数学-03班'
  ];

  const courses = [
    '线性代数',
    '微积分基础',
    '高等数学'
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sent':
        return '已发送';
      case 'scheduled':
        return '已安排';
      case 'draft':
        return '草稿';
      default:
        return '未知';
    }
  };

  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return '刚刚';
    } else if (diffInHours < 24) {
      return `${diffInHours}小时前`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}天前`;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || notification.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleSendNotification = () => {
    if (title.trim() && content.trim() && targetClass && course) {
      const newNotification: Notification = {
        id: Date.now().toString(),
        title,
        content,
        targetClass,
        course,
        status: 'sent',
        createdAt: new Date().toISOString(),
        sentAt: new Date().toISOString(),
        readCount: 0,
        totalRecipients: 45 // Mock value
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      
      // Reset form
      setTitle('');
      setContent('');
      setTargetClass('');
      setCourse('');
      setIsImportant(false);
      
      // Switch back to list view
      setSelectedTab('list');
    }
  };

  const handleSaveDraft = () => {
    if (title.trim() && content.trim()) {
      const newNotification: Notification = {
        id: Date.now().toString(),
        title,
        content,
        targetClass: targetClass || '未指定',
        course: course || '未指定',
        status: 'draft',
        createdAt: new Date().toISOString(),
        readCount: 0,
        totalRecipients: 0
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      
      // Reset form
      setTitle('');
      setContent('');
      setTargetClass('');
      setCourse('');
      setIsImportant(false);
      
      setSelectedTab('list');
    }
  };

  const stats = {
    total: notifications.length,
    sent: notifications.filter(n => n.status === 'sent').length,
    scheduled: notifications.filter(n => n.status === 'scheduled').length,
    drafts: notifications.filter(n => n.status === 'draft').length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-2">通知管理</h1>
          <p className="text-muted-foreground">
            向学生发布课程公告和重要通知
          </p>
        </div>
        <Button onClick={() => setSelectedTab('create')}>
          <Plus className="h-4 w-4 mr-2" />
          发布通知
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">总通知数</p>
                <p className="text-2xl font-semibold">{stats.total}</p>
              </div>
              <Bell className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">已发送</p>
                <p className="text-2xl font-semibold text-green-600">{stats.sent}</p>
              </div>
              <Send className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">已安排</p>
                <p className="text-2xl font-semibold text-blue-600">{stats.scheduled}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">草稿</p>
                <p className="text-2xl font-semibold text-gray-600">{stats.drafts}</p>
              </div>
              <Edit className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="list">通知列表</TabsTrigger>
          <TabsTrigger value="create">发布通知</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6">
          {/* Search and Filter */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="搜索通知标题或内容..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="sent">已发送</SelectItem>
                    <SelectItem value="scheduled">已安排</SelectItem>
                    <SelectItem value="draft">草稿</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">没有找到匹配的通知</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => (
                <Card key={notification.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{notification.title}</h3>
                          <Badge className={getStatusColor(notification.status)}>
                            {getStatusText(notification.status)}
                          </Badge>
                        </div>
                        
                        <p className="text-muted-foreground mb-3 line-clamp-2">
                          {notification.content}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{notification.targetClass}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {notification.status === 'sent' && notification.sentAt && 
                                `发送于 ${getRelativeTime(notification.sentAt)}`}
                              {notification.status === 'scheduled' && notification.scheduledAt && 
                                `安排于 ${getRelativeTime(notification.scheduledAt)}`}
                              {notification.status === 'draft' && 
                                `创建于 ${getRelativeTime(notification.createdAt)}`}
                            </span>
                          </div>
                          
                          {notification.status === 'sent' && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Eye className="h-4 w-4" />
                              <span>
                                {notification.readCount}/{notification.totalRecipients} 已读
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {notification.status === 'draft' && (
                          <>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4 mr-1" />
                              编辑
                            </Button>
                            <Button size="sm">
                              <Send className="h-4 w-4 mr-1" />
                              发送
                            </Button>
                          </>
                        )}
                        {notification.status === 'sent' && (
                          <Button size="sm" variant="outline">
                            查看详情
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>发布新通知</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">通知标题 *</label>
                  <Input
                    placeholder="输入通知标题"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">课程 *</label>
                  <Select value={course} onValueChange={setCourse}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择课程" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">目标班级 *</label>
                <Select value={targetClass} onValueChange={setTargetClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择班级" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map(cls => (
                      <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">通知内容 *</label>
                <Textarea
                  placeholder="输入通知内容..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleSaveDraft}>
                  保存草稿
                </Button>
                <Button onClick={handleSendNotification}>
                  <Send className="h-4 w-4 mr-2" />
                  立即发送
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}