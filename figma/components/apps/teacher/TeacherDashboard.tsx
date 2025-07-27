import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Progress } from '../../ui/progress';
import { Badge } from '../../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { 
  ClipboardCheck, 
  BookOpen, 
  Bell, 
  Users, 
  TrendingUp, 
  Calendar,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  FileText,
  BarChart3,
  MessageSquare,
  Shield,
  GraduationCap
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { usePermissions, ModuleGuard } from '../../../contexts/PermissionContext';

interface TeacherDashboardProps {
  userRole?: 'teacher' | 'ta';
}

const kpiData = [
  {
    title: '待批改作业',
    value: '23',
    change: '+5',
    changeType: 'increase',
    description: '需要您处理的作业',
    icon: ClipboardCheck,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    link: '/grading',
    permission: 'gradingCenter'
  },
  {
    title: '进行中课程',
    value: '8',
    change: '±0',
    changeType: 'neutral',
    description: '当前正在进行的课程',
    icon: BookOpen,
    color: 'text-chart-2',
    bgColor: 'bg-chart-2/10',
    link: '/courses',
    permission: 'courseManagement',
    teacherOnly: true
  },
  {
    title: '管理班级',
    value: '5',
    change: '+1',
    changeType: 'increase',
    description: '您负责的班级数量',
    icon: Users,
    color: 'text-chart-3',
    bgColor: 'bg-chart-3/10',
    link: '/classes',
    permission: 'classManagement'
  },
  {
    title: '本周完成率',
    value: '87%',
    change: '+2%',
    changeType: 'increase',
    description: '学生作业完成情况',
    icon: TrendingUp,
    color: 'text-chart-1',
    bgColor: 'bg-chart-1/10',
    link: '/analytics',
    permission: 'analyticsReport'
  }
];

const todoItems = [
  {
    id: 1,
    title: '高等数学A - 第三章作业',
    course: '高等数学A',
    dueDate: '2025-01-22 23:59',
    submitted: 45,
    total: 45,
    status: 'grading',
    priority: 'high',
    timeLeft: '2天',
    link: '/grading?filter=pending&course=高等数学A'
  },
  {
    id: 2,
    title: '线性代数 - 期中测验',
    course: '线性代数',
    dueDate: '2025-01-25 15:00',
    submitted: 38,
    total: 42,
    status: 'active',
    priority: 'medium',
    timeLeft: '5天',
    link: '/exams?status=active&course=线性代数'
  },
  {
    id: 3,
    title: '概率论 - 章节练习',
    course: '概率论与数理统计',
    dueDate: '2025-01-28 23:59',
    submitted: 20,
    total: 40,
    status: 'active',
    priority: 'low',
    timeLeft: '8天',
    link: '/exams?status=pending&course=概率论与数理统计'
  }
];

const courseProgress = [
  { 
    id: 1,
    name: '高等数学A', 
    progress: 75, 
    students: 45, 
    chapter: '第8章',
    nextClass: '明天 09:00',
    completion: 87,
    cover: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=60&h=40&fit=crop'
  },
  { 
    id: 2,
    name: '线性代数', 
    progress: 60, 
    students: 38, 
    chapter: '第6章',
    nextClass: '周三 14:00',
    completion: 92,
    cover: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=60&h=40&fit=crop'
  },
  { 
    id: 3,
    name: '概率论', 
    progress: 90, 
    students: 42, 
    chapter: '第10章',
    nextClass: '周五 10:00',
    completion: 79,
    cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=60&h=40&fit=crop'
  },
  { 
    id: 4,
    name: '离散数学', 
    progress: 45, 
    students: 35, 
    chapter: '第5章',
    nextClass: '下周一 09:00',
    completion: 83,
    cover: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=60&h=40&fit=crop'
  }
];

const recentActivities = [
  {
    id: 1,
    type: 'submission',
    title: '张同学提交了高等数学A第三章作业',
    content: '张同学提交了高等数学A第三章作业',
    time: '5分钟前',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5b5?w=32&h=32&fit=crop&crop=face',
    courseId: '1',
    link: '/grading?student=张同学&course=高等数学A'
  },
  {
    id: 2,
    type: 'question',
    title: '李同学在线性代数讨论区提出了新问题',
    content: '李同学在线性代数讨论区提出了新问题',
    time: '15分钟前',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    courseId: '2',
    link: '/qa?course=线性代数&student=李同学'
  },
  {
    id: 3,
    type: 'grade',
    title: '概率论第二章作业批改完成',
    content: '概率论第二章作业批改完成',
    time: '1小时前',
    avatar: null,
    courseId: '3',
    link: '/grading?status=completed&course=概率论'
  }
];

export function TeacherDashboard({ userRole }: TeacherDashboardProps) {
  const navigate = useNavigate();
  const { isTeacher, isTA, hasModuleAccess } = usePermissions();
  
  const isTeacherRole = userRole === 'teacher' || isTeacher;
  const isTARole = userRole === 'ta' || isTA;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-chart-4';
      case 'low': return 'text-chart-3';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'grading': return <ClipboardCheck className="w-4 h-4 text-chart-4" />;
      case 'active': return <Clock className="w-4 h-4 text-chart-2" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-chart-1" />;
      default: return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const handleTodoClick = (item: any) => {
    navigate(item.link);
  };

  const handleActivityClick = (activity: any) => {
    navigate(activity.link);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'create-exam':
        navigate(isTeacherRole ? '/assignments/create' : '/exams/create');
        break;
      case 'create-course':
        navigate('/courses/create');
        break;
      default:
        break;
    }
  };

  // 根据权限过滤KPI数据
  const getVisibleKPIs = () => {
    return kpiData.filter(item => {
      if (item.teacherOnly && isTARole) return false;
      if (item.permission) return hasModuleAccess(item.permission);
      return true;
    });
  };

  // 获取快速操作按钮
  const getQuickActions = () => {
    const actions = [];
    
    if (hasModuleAccess('gradingCenter')) {
      actions.push({
        link: '/grading',
        icon: ClipboardCheck,
        label: '批改中心',
        permission: 'gradingCenter'
      });
    }
    
    if (hasModuleAccess('questionBank') && isTeacherRole) {
      actions.push({
        link: '/questions',
        icon: FileText,
        label: '题库管理',
        permission: 'questionBank'
      });
    }
    
    if (hasModuleAccess('qaForum')) {
      actions.push({
        link: '/qa',
        icon: MessageSquare,
        label: '学生答疑',
        permission: 'qaForum'
      });
    }
    
    if (hasModuleAccess('analyticsReport')) {
      actions.push({
        link: '/analytics',
        icon: BarChart3,
        label: '学情报告',
        permission: 'analyticsReport'
      });
    }
    
    if (hasModuleAccess('examManagement')) {
      actions.push({
        link: '/exams',
        icon: GraduationCap,
        label: '考试管理',
        permission: 'examManagement'
      });
    }
    
    if (hasModuleAccess('notificationManagement')) {
      actions.push({
        link: '/notifications',
        icon: Bell,
        label: '通知管理',
        permission: 'notificationManagement'
      });
    }
    
    return actions;
  };

  const visibleKPIs = getVisibleKPIs();
  const quickActions = getQuickActions();

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1>
            欢迎回来，{isTARole ? '助教' : '张教授'}！
            {isTARole && <Shield className="w-4 h-4 inline ml-2 text-blue-500" />}
          </h1>
          <p className="text-muted-foreground">
            今天是 2025年1月20日，周一
            {isTARole && <span className="ml-2 text-blue-600">• 权限受限模式</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <ModuleGuard module="examManagement">
            <Button 
              size="sm" 
              className="gap-2"
              onClick={() => handleQuickAction('create-exam')}
            >
              <Plus className="w-4 h-4" />
              {isTARole ? '创建考试' : '发布作业'}
            </Button>
          </ModuleGuard>
          {isTeacherRole && (
            <ModuleGuard module="courseManagement">
              <Button 
                size="sm" 
                variant="outline" 
                className="gap-2"
                onClick={() => handleQuickAction('create-course')}
              >
                <FileText className="w-4 h-4" />
                创建课程
              </Button>
            </ModuleGuard>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {visibleKPIs.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.title} to={item.link}>
              <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <div className="space-y-1">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {item.title}
                    </CardTitle>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold">{item.value}</span>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${
                          item.changeType === 'increase' ? 'text-chart-1' : 'text-muted-foreground'
                        }`}
                      >
                        {item.change}
                      </Badge>
                    </div>
                  </div>
                  <div className={`w-12 h-12 ${item.bgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Todo Items */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                待办事项
              </CardTitle>
              <CardDescription>
                {isTARole ? '需要处理的教学辅助任务' : '需要处理的教学任务'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {todoItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => handleTodoClick(item)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.status)}
                      <span className={`text-xs font-medium ${getPriorityColor(item.priority)}`}>
                        {item.timeLeft}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {item.submitted}/{item.total}
                    </Badge>
                  </div>
                  <h4 className="font-medium text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-muted-foreground mb-2">{item.course}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      截止：{new Date(item.dueDate).toLocaleDateString('zh-CN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {item.status === 'grading' && (
                      <Button size="sm" variant="ghost" className="h-6 text-xs">
                        批改
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <Link to="/exams">
                <Button variant="outline" className="w-full mt-4" size="sm">
                  查看全部
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Course Progress - 仅对有权限的用户显示 */}
        <div className="lg:col-span-2">
          <ModuleGuard 
            module="classManagement" 
            fallback={
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-500" />
                    班级概览
                  </CardTitle>
                  <CardDescription>您负责管理的班级情况</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Shield className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <p className="text-muted-foreground">您有班级管理权限</p>
                    <Link to="/classes">
                      <Button className="mt-4">
                        查看班级管理
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            }
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  {isTeacherRole ? '课程进度概览' : '班级管理概览'}
                </CardTitle>
                <CardDescription>
                  {isTeacherRole ? '当前学期课程教学情况' : '您负责的班级教学情况'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courseProgress.map((course) => (
                    <Link key={course.id} to={isTeacherRole ? `/course/${course.id}` : `/classes`}>
                      <div className="p-4 border rounded-lg hover:shadow-sm transition-all cursor-pointer group">
                        <div className="flex items-start gap-3">
                          <img 
                            src={course.cover} 
                            alt={course.name}
                            className="w-12 h-8 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate group-hover:text-primary">
                              {course.name}
                            </h4>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className="text-xs">
                                {course.students}人
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {course.chapter}
                              </span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>{isTeacherRole ? '教学进度' : '学习进度'}</span>
                                <span>{course.progress}%</span>
                              </div>
                              <Progress value={course.progress} className="h-1.5" />
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>完成率 {course.completion}%</span>
                                <span>{course.nextClass}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link to={isTeacherRole ? "/courses" : "/classes"}>
                  <Button variant="outline" className="w-full mt-4" size="sm">
                    {isTeacherRole ? '管理所有课程' : '管理所有班级'}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </ModuleGuard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              最新动态
            </CardTitle>
            <CardDescription>教学活动实时更新</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivities.map((activity) => (
              <div 
                key={activity.id} 
                className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                onClick={() => handleActivityClick(activity)}
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={activity.avatar} />
                  <AvatarFallback className="text-xs">
                    {activity.type === 'submission' ? '作' : 
                     activity.type === 'question' ? '问' : '批'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{activity.content}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>快速操作</CardTitle>
            <CardDescription>
              {isTARole ? '助教权限范围内的功能入口' : '常用功能快速入口'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.slice(0, 6).map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.link} to={action.link}>
                    <Button variant="outline" className="h-16 flex-col gap-1 w-full">
                      <Icon className="w-5 h-5" />
                      <span className="text-xs">{action.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}