import React, { useState } from 'react';
import { Bell, MessageSquare, Calendar, Settings, Check, Trash2, Filter, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface Notification {
  id: string;
  type: 'system' | 'course' | 'assignment' | 'grade' | 'forum';
  title: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isImportant: boolean;
  actionUrl?: string;
  sender?: {
    name: string;
    avatar?: string;
    role: string;
  };
}

export function NotificationCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedTab, setSelectedTab] = useState('all');

  // Mock data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'assignment',
      title: '新作业发布：线性代数第三章练习',
      content: '张教授发布了新的作业，截止时间为2025年8月1日23:59',
      timestamp: '2025-07-23T10:30:00Z',
      isRead: false,
      isImportant: true,
      actionUrl: '/exams/123',
      sender: {
        name: '张教授',
        role: '教师'
      }
    },
    {
      id: '2',
      type: 'grade',
      title: '成绩已发布',
      content: '您的"微积分基础"作业已批改完成，点击查看详细成绩',
      timestamp: '2025-07-23T09:15:00Z',
      isRead: false,
      isImportant: false,
      actionUrl: '/report',
      sender: {
        name: '李老师',
        role: '教师'
      }
    },
    {
      id: '3',
      type: 'forum',
      title: '有人回复了您的问题',
      content: '在讨论区"关于矩阵特征值的问题"中，王同学回复了您的问题',
      timestamp: '2025-07-23T08:45:00Z',
      isRead: true,
      isImportant: false,
      actionUrl: '/qa/posts/456',
      sender: {
        name: '王同学',
        role: '学生'
      }
    },
    {
      id: '4',
      type: 'system',
      title: '系统维护通知',
      content: '系统将于今晚23:00-24:00进行例行维护，请及时保存您的工作',
      timestamp: '2025-07-22T16:00:00Z',
      isRead: true,
      isImportant: true,
      sender: {
        name: '系统管理员',
        role: '管理员'
      }
    },
    {
      id: '5',
      type: 'course',
      title: '课程公告：期中考试安排',
      content: '《高等数学》期中考试将于下周三举行，请同学们做好准备',
      timestamp: '2025-07-22T14:20:00Z',
      isRead: true,
      isImportant: true,
      actionUrl: '/courses/789',
      sender: {
        name: '陈教授',
        role: '教师'
      }
    }
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'system':
        return <Settings className="h-4 w-4" />;
      case 'course':
        return <Calendar className="h-4 w-4" />;
      case 'assignment':
        return <Bell className="h-4 w-4" />;
      case 'grade':
        return <Check className="h-4 w-4" />;
      case 'forum':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'system':
        return 'bg-gray-100 text-gray-800';
      case 'course':
        return 'bg-blue-100 text-blue-800';
      case 'assignment':
        return 'bg-orange-100 text-orange-800';
      case 'grade':
        return 'bg-green-100 text-green-800';
      case 'forum':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesSearch = notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notif.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'unread' && !notif.isRead) ||
                         (selectedFilter === 'important' && notif.isImportant) ||
                         notif.type === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold mb-2">通知中心</h1>
            <p className="text-muted-foreground">
              {unreadCount > 0 ? `您有 ${unreadCount} 条未读消息` : '所有消息已读'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              <Check className="h-4 w-4 mr-1" />
              全部标记为已读
            </Button>
          </div>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索通知..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="筛选类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部通知</SelectItem>
                <SelectItem value="unread">未读消息</SelectItem>
                <SelectItem value="important">重要消息</SelectItem>
                <SelectItem value="system">系统通知</SelectItem>
                <SelectItem value="course">课程公告</SelectItem>
                <SelectItem value="assignment">作业通知</SelectItem>
                <SelectItem value="grade">成绩通知</SelectItem>
                <SelectItem value="forum">讨论回复</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 通知列表 */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">没有找到相关通知</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                !notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                      {getTypeIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-medium ${!notification.isRead ? 'text-blue-900' : ''}`}>
                          {notification.title}
                        </h3>
                        {notification.isImportant && (
                          <Badge variant="destructive" className="text-xs">重要</Badge>
                        )}
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.content}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{getRelativeTime(notification.timestamp)}</span>
                        {notification.sender && (
                          <span>来自: {notification.sender.name} ({notification.sender.role})</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {notification.actionUrl && (
                      <Button variant="ghost" size="sm" className="text-xs">
                        查看详情
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 通知设置 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>通知设置</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">邮件通知</p>
                <p className="text-sm text-muted-foreground">重要通知将同时发送邮件</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">作业提醒</p>
                <p className="text-sm text-muted-foreground">作业截止前24小时提醒</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">成绩通知</p>
                <p className="text-sm text-muted-foreground">成绩发布时立即通知</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">讨论回复</p>
                <p className="text-sm text-muted-foreground">有人回复您的问题时通知</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}