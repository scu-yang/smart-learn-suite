import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Bell, 
  BellOff, 
  Clock,
  AlertCircle,
  CheckCircle,
  Eye,
  Trash2,
  ArrowLeft,
  Filter,
  Check,
  X,
  RefreshCw,
  MoreHorizontal,
  ArrowUpRight
} from "lucide-react";
import { Link, useRouter } from "@tanstack/react-router";
import { 
  useNotifications, 
  useNotificationStats, 
  useUnreadNotifications 
} from "@/hooks/useQueries";
import { 
  useMarkNotificationRead, 
  useMarkNotificationsRead,
  useMarkAllNotificationsRead, 
  useDeleteNotification,
  useDeleteNotifications
} from "@/hooks/useMutations";
import type { Notification, NotificationFilter } from "@/types";

export function NotificationsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<NotificationFilter>({});
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  // 数据查询
  const { data: notifications = [], isLoading: notificationsLoading } = useNotifications(filter);
  const { data: stats } = useNotificationStats();
  const { data: unreadNotifications = [] } = useUnreadNotifications();

  // 变更操作
  const markAsRead = useMarkNotificationRead();
  const markNotificationsAsRead = useMarkNotificationsRead();
  const markAllAsRead = useMarkAllNotificationsRead();
  const deleteNotification = useDeleteNotification();
  const deleteNotifications = useDeleteNotifications();

  // 加载状态
  if (notificationsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 flex items-center justify-center relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse" style={{animationDelay: '0s'}}></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-indigo-200/20 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="text-center relative z-10">
          <RefreshCw className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">加载通知中...</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'exam': return 'text-blue-600 bg-blue-100';
      case 'course': return 'text-green-600 bg-green-100';
      case 'assignment': return 'text-yellow-600 bg-yellow-100';
      case 'announcement': return 'text-purple-600 bg-purple-100';
      case 'system': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'exam': return '考试';
      case 'course': return '课程';
      case 'assignment': return '作业';
      case 'announcement': return '公告';
      case 'system': return '系统';
      default: return '其他';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'high': return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case 'medium': return <Bell className="h-4 w-4 text-yellow-600" />;
      case 'low': return <Bell className="h-4 w-4 text-gray-600" />;
      default: return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // 标记为已读
    if (!notification.isRead) {
      markAsRead.mutate(notification.id);
    }

    // 根据通知类型决定跳转逻辑
    if (notification.type === 'announcement' || notification.type === 'system') {
      // 公告和系统通知跳转到公告详情页
      router.navigate({ to: `/announcement/${notification.id}` as any });
    } else if (notification.actionUrl) {
      // 其他类型的通知跳转到指定的关联页面
      router.navigate({ to: notification.actionUrl as any });
    }
  };

  const handleMarkAsRead = (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    markAsRead.mutate(notificationId);
  };

  const handleDelete = (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    deleteNotification.mutate(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  const toggleSelection = (notificationId: string) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId) 
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const selectAll = () => {
    setSelectedNotifications(notifications.map(n => n.id));
  };

  const clearSelection = () => {
    setSelectedNotifications([]);
  };

  const handleBatchMarkAsRead = () => {
    if (selectedNotifications.length > 0) {
      markNotificationsAsRead.mutate(selectedNotifications);
      setSelectedNotifications([]);
    }
  };

  const handleBatchDelete = () => {
    if (selectedNotifications.length > 0) {
      deleteNotifications.mutate(selectedNotifications);
      setSelectedNotifications([]);
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
                  <Bell className="h-4 w-4 text-white" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900">通知中心</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {unreadNotifications.length > 0 && (
                <Button 
                  onClick={handleMarkAllAsRead} 
                  size="sm"
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  全部已读
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 侧边栏 - 统计和筛选 */}
          <div className="lg:w-80 space-y-6">
            {/* 统计信息 */}
            {stats && (
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg font-semibold">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                      <Bell className="h-4 w-4 text-white" />
                    </div>
                    通知统计
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
                      <span className="text-sm font-medium text-gray-700">总计</span>
                      <span className="text-xl font-bold text-blue-600">{stats.total}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors cursor-pointer">
                      <span className="text-sm font-medium text-gray-700">未读</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-red-600">{stats.unread}</span>
                        {stats.unread > 0 && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>}
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <p className="text-sm font-medium text-gray-700 mb-3">按类型分布</p>
                      <div className="space-y-2">
                        {Object.entries(stats.byType).map(([type, count]) => (
                          <div key={type} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(type)}`}>
                                {getTypeText(type)}
                              </span>
                            </div>
                            <span className="font-semibold text-gray-700">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 筛选器 */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg font-semibold">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                    <Filter className="h-4 w-4 text-white" />
                  </div>
                  筛选器
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 按类型筛选 */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">类型</label>
                  <select 
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    value={filter.type || ''}
                    onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value as any || undefined }))}
                  >
                    <option value="">全部</option>
                    <option value="exam">考试</option>
                    <option value="course">课程</option>
                    <option value="assignment">作业</option>
                    <option value="announcement">公告</option>
                    <option value="system">系统</option>
                  </select>
                </div>

                {/* 按优先级筛选 */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">优先级</label>
                  <select 
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    value={filter.priority || ''}
                    onChange={(e) => setFilter(prev => ({ ...prev, priority: e.target.value as any || undefined }))}
                  >
                    <option value="">全部</option>
                    <option value="urgent">紧急</option>
                    <option value="high">高</option>
                    <option value="medium">中</option>
                    <option value="low">低</option>
                  </select>
                </div>

                {/* 按已读状态筛选 */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">状态</label>
                  <select 
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    value={filter.isRead === undefined ? '' : filter.isRead.toString()}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFilter(prev => ({ 
                        ...prev, 
                        isRead: value === '' ? undefined : value === 'true' 
                      }));
                    }}
                  >
                    <option value="">全部</option>
                    <option value="false">未读</option>
                    <option value="true">已读</option>
                  </select>
                </div>

                {/* 按时间筛选 */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">时间范围</label>
                  <select 
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    value={filter.timeRange || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFilter(prev => ({ 
                        ...prev, 
                        timeRange: value === '' ? undefined : value as 'today' | 'week' | 'month' | 'quarter'
                      }));
                    }}
                  >
                    <option value="">全部时间</option>
                    <option value="today">今天</option>
                    <option value="week">本周</option>
                    <option value="month">本月</option>
                    <option value="quarter">本季度</option>
                  </select>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                  onClick={() => setFilter({})}
                >
                  清空筛选
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 主内容 - 通知列表 */}
          <div className="flex-1">
            {/* 操作栏 */}
            {selectedNotifications.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 rounded-xl p-4 mb-6 shadow-lg backdrop-blur-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-blue-700">
                      已选择 {selectedNotifications.length} 个通知
                    </span>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleBatchMarkAsRead}
                      className="hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-all duration-200"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      标记已读
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleBatchDelete}
                      className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      删除
                    </Button>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={clearSelection}
                    className="hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                  >
                    <X className="h-4 w-4 mr-1" />
                    取消选择
                  </Button>
                </div>
              </div>
            )}

            {/* 通知列表 */}
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-lg">
                  <CardContent className="text-center py-16">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BellOff className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">暂无通知</h3>
                    <p className="text-gray-600">当前没有符合条件的通知</p>
                  </CardContent>
                </Card>
              ) : (
                notifications.map((notification) => (
                  <Card 
                    key={notification.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-[1.02] border-0 shadow-lg backdrop-blur-lg group ${
                      !notification.isRead 
                        ? 'bg-gradient-to-r from-blue-50/80 to-indigo-50/80 ring-1 ring-blue-200/60' 
                        : 'bg-white/80 hover:bg-white/90'
                    } ${selectedNotifications.includes(notification.id) ? 'ring-2 ring-blue-500 bg-blue-50/80' : ''}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* 选择框 */}
                        <input
                          type="checkbox"
                          className="mt-2 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          checked={selectedNotifications.includes(notification.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            toggleSelection(notification.id);
                          }}
                        />

                        {/* 优先级图标 */}
                        <div className="flex-shrink-0 mt-1">
                          <div className={`p-2 rounded-lg ${
                            notification.priority === 'urgent' ? 'bg-red-100' :
                            notification.priority === 'high' ? 'bg-orange-100' :
                            notification.priority === 'medium' ? 'bg-yellow-100' :
                            'bg-gray-100'
                          }`}>
                            {getPriorityIcon(notification.priority)}
                          </div>
                        </div>

                        {/* 通知内容 */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className={`font-semibold text-lg ${
                                  notification.isRead ? 'text-gray-700' : 'text-gray-900'
                                }`}>
                                  {notification.title}
                                </h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${getTypeColor(notification.type)}`}>
                                  {getTypeText(notification.type)}
                                </span>
                                {!notification.isRead && (
                                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse shadow-lg"></div>
                                )}
                              </div>
                              <p className={`text-sm leading-relaxed mb-4 ${
                                notification.isRead ? 'text-gray-600' : 'text-gray-800'
                              }`}>
                                {notification.content}
                              </p>
                              <div className="flex items-center space-x-6 text-xs text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{formatDate(notification.createdAt)}</span>
                                </div>
                                {notification.readAt && (
                                  <div className="flex items-center space-x-1">
                                    <Eye className="h-3 w-3" />
                                    <span>已读于 {formatDate(notification.readAt)}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* 操作按钮 */}
                            <div className="flex items-center space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              {!notification.isRead && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => handleMarkAsRead(notification.id, e)}
                                  className="hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-all duration-200"
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => handleDelete(notification.id, e)}
                                className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="hover:bg-gray-50"
                              >
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          {/* 操作按钮 */}
                          {notification.actionText && notification.actionUrl && (
                            <div className="mt-4">
                              <Button 
                                size="sm" 
                                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                              >
                                {notification.actionText}
                                <ArrowUpRight className="h-3 w-3 ml-2" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* 批量操作 */}
            {notifications.length > 0 && (
              <Card className="mt-6 border-0 shadow-xl bg-white/80 backdrop-blur-lg">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <Button 
                      variant="outline" 
                      onClick={selectAll}
                      className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-200"
                    >
                      全选
                    </Button>
                    <div className="text-sm text-gray-600 font-medium">
                      共 <span className="text-blue-600 font-bold">{notifications.length}</span> 条通知
                    </div>
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
