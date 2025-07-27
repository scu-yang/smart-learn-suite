import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { 
  CheckSquare, 
  Users, 
  MessageSquare, 
  Clock, 
  AlertCircle,
  FileText,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PendingTask {
  id: string;
  type: 'grading' | 'question' | 'announcement';
  title: string;
  course: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  count?: number;
}

export function TADashboard() {
  const navigate = useNavigate();

  // Mock data
  const stats = {
    pendingGrading: 23,
    unreadQuestions: 8,
    managedStudents: 156,
    pendingAnnouncements: 2
  };

  const pendingTasks: PendingTask[] = [
    {
      id: '1',
      type: 'grading',
      title: '线性代数第3章作业批改',
      course: '线性代数 - 2025春季',
      deadline: '2025-07-25 23:59',
      priority: 'high',
      count: 15
    },
    {
      id: '2',
      type: 'grading',
      title: '微积分期中考试批改',
      course: '微积分基础 - 2025春季',
      deadline: '2025-07-26 18:00',
      priority: 'high',
      count: 8
    },
    {
      id: '3',
      type: 'question',
      title: '学生提问待回复',
      course: '高等数学 - 2025春季',
      deadline: '2025-07-24 12:00',
      priority: 'medium',
      count: 5
    },
    {
      id: '4',
      type: 'announcement',
      title: '期中考试安排公告',
      course: '线性代数 - 2025春季',
      deadline: '2025-07-24 09:00',
      priority: 'medium'
    }
  ];

  const recentActivities = [
    {
      id: '1',
      action: '完成批改',
      target: '高等数学第2章练习 (25份)',
      time: '2小时前',
      status: 'completed'
    },
    {
      id: '2',
      action: '回复提问',
      target: '关于矩阵特征值的问题',
      time: '4小时前',
      status: 'completed'
    },
    {
      id: '3',
      action: '发布公告',
      target: '下周实验课安排',
      time: '1天前',
      status: 'completed'
    },
    {
      id: '4',
      action: '批改作业',
      target: '线性代数作业3 (进行中)',
      time: '1天前',
      status: 'in-progress'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return '高优先级';
      case 'medium':
        return '中优先级';
      case 'low':
        return '低优先级';
      default:
        return '普通';
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'grading':
        return <CheckSquare className="h-4 w-4" />;
      case 'question':
        return <MessageSquare className="h-4 w-4" />;
      case 'announcement':
        return <FileText className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getTimeUntilDeadline = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffInHours = Math.floor((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 0) {
      return '已过期';
    } else if (diffInHours < 24) {
      return `${diffInHours}小时后`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}天后`;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-semibold mb-2">助教工作台</h1>
        <p className="text-muted-foreground">
          欢迎回来！这里是您的工作概览和待办任务
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/grading')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">待批改作业</p>
                <p className="text-2xl font-semibold text-red-600">{stats.pendingGrading}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <CheckSquare className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              点击进入批改中心
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/qa')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">待回复提问</p>
                <p className="text-2xl font-semibold text-orange-600">{stats.unreadQuestions}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              点击进入答疑区
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/classes')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">负责学生数</p>
                <p className="text-2xl font-semibold text-blue-600">{stats.managedStudents}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              跨 3 个班级
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/notifications')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">待发布公告</p>
                <p className="text-2xl font-semibold text-green-600">{stats.pendingAnnouncements}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              点击进入通知管理
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 待办任务 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>待办任务</span>
              <Badge variant="destructive" className="text-xs">
                {pendingTasks.length} 项待处理
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <div key={task.id} className="flex items-start justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getTaskIcon(task.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-sm truncate">{task.title}</h3>
                        <Badge className={getPriorityColor(task.priority)} size="sm">
                          {getPriorityText(task.priority)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{task.course}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{getTimeUntilDeadline(task.deadline)}</span>
                        {task.count && (
                          <>
                            <span>•</span>
                            <span>{task.count} 项</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              查看全部任务
            </Button>
          </CardContent>
        </Card>

        {/* 最近活动 */}
        <Card>
          <CardHeader>
            <CardTitle>最近活动</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.action}</span>
                      <span className="text-muted-foreground"> - {activity.target}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              查看活动历史
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 快捷操作 */}
      <Card>
        <CardHeader>
          <CardTitle>快捷操作</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => navigate('/grading')}
            >
              <CheckSquare className="h-6 w-6" />
              <span>开始批改</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => navigate('/qa')}
            >
              <MessageSquare className="h-6 w-6" />
              <span>回复提问</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => navigate('/notifications')}
            >
              <FileText className="h-6 w-6" />
              <span>发布公告</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}