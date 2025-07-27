import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { 
  CheckSquare, 
  Clock, 
  User, 
  FileText, 
  Search,
  Filter,
  ChevronRight,
  AlertCircle,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GradingTask {
  id: string;
  examName: string;
  course: string;
  totalSubmissions: number;
  gradedSubmissions: number;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  status: 'not-started' | 'in-progress' | 'completed';
  averageScore?: number;
  assignedBy: string;
}

export function TAGradingCenter() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Mock data
  const gradingTasks: GradingTask[] = [
    {
      id: '1',
      examName: '线性代数第3章练习',
      course: '线性代数 - 2025春季',
      totalSubmissions: 25,
      gradedSubmissions: 10,
      deadline: '2025-07-25 23:59',
      priority: 'high',
      status: 'in-progress',
      averageScore: 82.5,
      assignedBy: '张教授'
    },
    {
      id: '2',
      examName: '微积分期中考试',
      course: '微积分基础 - 2025春季',
      totalSubmissions: 30,
      gradedSubmissions: 0,
      deadline: '2025-07-26 18:00',
      priority: 'high',
      status: 'not-started',
      assignedBy: '李教授'
    },
    {
      id: '3',
      examName: '高等数学第2章测验',
      course: '高等数学 - 2025春季',
      totalSubmissions: 28,
      gradedSubmissions: 28,
      deadline: '2025-07-23 12:00',
      priority: 'medium',
      status: 'completed',
      averageScore: 76.3,
      assignedBy: '王老师'
    },
    {
      id: '4',
      examName: '概率论基础练习',
      course: '概率论与数理统计 - 2025春季',
      totalSubmissions: 22,
      gradedSubmissions: 8,
      deadline: '2025-07-28 23:59',
      priority: 'medium',
      status: 'in-progress',
      averageScore: 79.1,
      assignedBy: '陈教授'
    },
    {
      id: '5',
      examName: '数学分析第1章作业',
      course: '数学分析 - 2025春季',
      totalSubmissions: 18,
      gradedSubmissions: 0,
      deadline: '2025-07-30 23:59',
      priority: 'low',
      status: 'not-started',
      assignedBy: '刘老师'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'not-started':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '已完成';
      case 'in-progress':
        return '批改中';
      case 'not-started':
        return '未开始';
      default:
        return '未知';
    }
  };

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

  const getProgress = (graded: number, total: number) => {
    return total > 0 ? Math.round((graded / total) * 100) : 0;
  };

  const filteredTasks = gradingTasks.filter(task => {
    const matchesSearch = task.examName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleStartGrading = (taskId: string) => {
    // Navigate to the actual grading interface
    navigate(`/grading/${taskId}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-semibold mb-2">批改中心</h1>
        <p className="text-muted-foreground">
          管理和处理分配给您的批改任务
        </p>
      </div>

      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">总任务数</p>
                <p className="text-2xl font-semibold">{gradingTasks.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">进行中</p>
                <p className="text-2xl font-semibold text-blue-600">
                  {gradingTasks.filter(t => t.status === 'in-progress').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">已完成</p>
                <p className="text-2xl font-semibold text-green-600">
                  {gradingTasks.filter(t => t.status === 'completed').length}
                </p>
              </div>
              <CheckSquare className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">高优先级</p>
                <p className="text-2xl font-semibold text-red-600">
                  {gradingTasks.filter(t => t.priority === 'high').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和筛选 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索批改任务..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="not-started">未开始</SelectItem>
                  <SelectItem value="in-progress">批改中</SelectItem>
                  <SelectItem value="completed">已完成</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="优先级" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部优先级</SelectItem>
                  <SelectItem value="high">高优先级</SelectItem>
                  <SelectItem value="medium">中优先级</SelectItem>
                  <SelectItem value="low">低优先级</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 任务列表 */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">没有找到匹配的批改任务</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredTasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-semibold text-lg">{task.examName}</h3>
                      <Badge className={getStatusColor(task.status)}>
                        {getStatusText(task.status)}
                      </Badge>
                      <Badge className={getPriorityColor(task.priority)}>
                        {getPriorityText(task.priority)}
                      </Badge>
                    </div>
                    
                    <p className="text-muted-foreground mb-3">{task.course}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          进度: {task.gradedSubmissions}/{task.totalSubmissions} 
                          ({getProgress(task.gradedSubmissions, task.totalSubmissions)}%)
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          截止: {getTimeUntilDeadline(task.deadline)}
                        </span>
                      </div>
                      
                      {task.averageScore && (
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            平均分: {task.averageScore}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        分配者: {task.assignedBy}
                      </p>
                      
                      <div className="flex gap-2">
                        {task.status === 'not-started' && (
                          <Button onClick={() => handleStartGrading(task.id)}>
                            开始批改
                          </Button>
                        )}
                        {task.status === 'in-progress' && (
                          <Button onClick={() => handleStartGrading(task.id)}>
                            继续批改
                          </Button>
                        )}
                        {task.status === 'completed' && (
                          <Button variant="outline" onClick={() => handleStartGrading(task.id)}>
                            查看详情
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {task.status === 'in-progress' && (
                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${getProgress(task.gradedSubmissions, task.totalSubmissions)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <ChevronRight className="h-5 w-5 text-muted-foreground ml-4" />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}