import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Link } from '@tanstack/react-router';
import { 
  BookOpen, 
  Target, 
  Clock, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle,
  Users,
  FileText,
  BarChart3,
  Award,
  Activity,
  Calendar
} from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  link?: string;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
}

function DashboardCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  color, 
  bgColor, 
  link, 
  change, 
  changeType 
}: DashboardCardProps) {
  const changeColor = changeType === 'increase' ? 'text-green-600' : 
                     changeType === 'decrease' ? 'text-red-600' : 'text-gray-500';

  const content = (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-semibold">{value}</p>
              {change && (
                <span className={`text-xs font-medium ${changeColor}`}>
                  {change}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <div className={`${bgColor} p-3 rounded-lg`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return link ? <Link to={link}>{content}</Link> : content;
}

interface QuickActionProps {
  title: string;
  description: string;
  icon: any;
  onClick: () => void;
  variant?: 'default' | 'outline';
}

function QuickAction({ title, description, icon: Icon, onClick, variant = 'default' }: QuickActionProps) {
  return (
    <Button 
      variant={variant} 
      className="h-auto p-4 flex flex-col gap-2 text-left"
      onClick={onClick}
    >
      <div className="flex items-center gap-2 w-full">
        <Icon className="h-4 w-4" />
        <span className="font-medium">{title}</span>
      </div>
      <span className="text-xs text-muted-foreground">{description}</span>
    </Button>
  );
}

// 学生仪表盘
export function StudentDashboard() {
  const stats = [
    {
      title: '待完成作业',
      value: '3',
      description: '本周截止',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      link: '/exams',
      change: '+1',
      changeType: 'increase' as const
    },
    {
      title: '学习进度',
      value: '75%',
      description: '本学期平均进度',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+5%',
      changeType: 'increase' as const
    },
    {
      title: '错题待复习',
      value: '12',
      description: '需要重点关注',
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      link: '/errors'
    },
    {
      title: '本月练习',
      value: '28',
      description: '完成练习次数',
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      link: '/practice'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">学习概览</h1>
        <p className="text-muted-foreground">欢迎回来，继续你的学习之旅！</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <DashboardCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 我的课程 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              我的课程
            </CardTitle>
            <CardDescription>当前学期课程进度</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: '高等数学A', progress: 75, nextChapter: '第七章 微分方程' },
              { name: '大学英语', progress: 60, nextChapter: 'Unit 8 Technology' },
              { name: '计算机基础', progress: 90, nextChapter: '第九章 数据库' }
            ].map((course, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{course.name}</span>
                  <span className="text-sm text-muted-foreground">{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
                <p className="text-xs text-muted-foreground">下一章：{course.nextChapter}</p>
              </div>
            ))}
            <Link to="/dashboard">
              <Button variant="outline" className="w-full mt-4">查看所有课程</Button>
            </Link>
          </CardContent>
        </Card>

        {/* 最近考试 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              最近考试
            </CardTitle>
            <CardDescription>即将到来的考试安排</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { title: '高等数学期中考试', date: '2025-08-15', status: 'upcoming' },
                { title: '英语四级模拟考试', date: '2025-08-22', status: 'upcoming' },
                { title: '计算机基础测验', date: '2025-08-08', status: 'completed' }
              ].map((exam, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{exam.title}</p>
                    <p className="text-sm text-muted-foreground">{exam.date}</p>
                  </div>
                  <Badge variant={exam.status === 'upcoming' ? 'default' : 'secondary'}>
                    {exam.status === 'upcoming' ? '即将开始' : '已完成'}
                  </Badge>
                </div>
              ))}
            </div>
            <Link to="/dashboard">
              <Button variant="outline" className="w-full mt-4">查看所有考试</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// 教师仪表盘
export function TeacherDashboard() {
  const stats = [
    {
      title: '待批改作业',
      value: '23',
      description: '需要您处理的作业',
      icon: FileText,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      link: '/grading',
      change: '+3',
      changeType: 'increase' as const
    },
    {
      title: '管理班级',
      value: '5',
      description: '您负责的班级数量',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      link: '/classes',
      change: '+1',
      changeType: 'increase' as const
    },
    {
      title: '活跃课程',
      value: '8',
      description: '当前正在进行的课程',
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      link: '/courses'
    },
    {
      title: '学生提问',
      value: '12',
      description: '待回复的问题',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      link: '/qa'
    }
  ];

  const quickActions = [
    {
      title: '发布作业',
      description: '创建新的作业或考试',
      icon: FileText,
      onClick: () => console.log('发布作业')
    },
    {
      title: '批改中心',
      description: '查看待批改的作业',
      icon: CheckCircle,
      onClick: () => console.log('批改中心')
    },
    {
      title: '班级管理',
      description: '管理学生和班级信息',
      icon: Users,
      onClick: () => console.log('班级管理')
    },
    {
      title: '学情报告',
      description: '查看教学数据分析',
      icon: BarChart3,
      onClick: () => console.log('学情报告'),
      variant: 'outline' as const
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">教学工作台</h1>
        <p className="text-muted-foreground">欢迎回来，管理您的教学工作！</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <DashboardCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 快速操作 */}
        <Card>
          <CardHeader>
            <CardTitle>快速操作</CardTitle>
            <CardDescription>常用功能快捷入口</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <QuickAction key={index} {...action} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 待办事项 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              待办事项
            </CardTitle>
            <CardDescription>需要处理的教学任务</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { title: '批改高数作业', status: 'urgent', count: '23份' },
                { title: '准备下周课件', status: 'normal', count: '3个课时' },
                { title: '回复学生提问', status: 'normal', count: '8个问题' }
              ].map((todo, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{todo.title}</p>
                    <p className="text-sm text-muted-foreground">{todo.count}</p>
                  </div>
                  <Badge variant={todo.status === 'urgent' ? 'destructive' : 'secondary'}>
                    {todo.status === 'urgent' ? '紧急' : '普通'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 班级概览 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              班级概览
            </CardTitle>
            <CardDescription>您负责的班级情况</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: '高数A班', students: 45, progress: 78 },
                { name: '高数B班', students: 42, progress: 72 },
                { name: '高数C班', students: 48, progress: 85 }
              ].map((cls, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{cls.name}</span>
                    <span className="text-sm text-muted-foreground">{cls.students}人</span>
                  </div>
                  <Progress value={cls.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground">平均进度：{cls.progress}%</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// 助教仪表盘
export function TADashboard() {
  const stats = [
    {
      title: '待处理批改',
      value: '15',
      description: '分配给您的批改任务',
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      link: '/grading',
      change: '+2',
      changeType: 'increase' as const
    },
    {
      title: '负责班级',
      value: '2',
      description: '您协助管理的班级',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      link: '/classes'
    },
    {
      title: '学生提问',
      value: '8',
      description: '待回复的问题',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      link: '/qa'
    },
    {
      title: '发布公告',
      value: '5',
      description: '本月发布的公告数',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">助教工作台</h1>
        <p className="text-muted-foreground">协助教学，管理学生学习进度</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <DashboardCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 批改任务 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              批改任务
            </CardTitle>
            <CardDescription>需要您处理的作业批改</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { subject: '高等数学', count: 8, deadline: '明天', priority: 'high' },
                { subject: '线性代数', count: 5, deadline: '后天', priority: 'medium' },
                { subject: '概率统计', count: 2, deadline: '本周', priority: 'low' }
              ].map((task, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{task.subject}</p>
                    <p className="text-sm text-muted-foreground">{task.count}份作业，{task.deadline}截止</p>
                  </div>
                  <Badge variant={
                    task.priority === 'high' ? 'destructive' : 
                    task.priority === 'medium' ? 'default' : 'secondary'
                  }>
                    {task.priority === 'high' ? '紧急' : 
                     task.priority === 'medium' ? '一般' : '不急'}
                  </Badge>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4">查看批改中心</Button>
          </CardContent>
        </Card>

        {/* 班级管理 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              班级管理
            </CardTitle>
            <CardDescription>您协助管理的班级</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: '高数A班', students: 45, teacher: '张教授', role: '批改助教' },
                { name: '线代B班', students: 38, teacher: '李教授', role: '答疑助教' }
              ].map((cls, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{cls.name}</p>
                      <p className="text-sm text-muted-foreground">主讲：{cls.teacher}</p>
                    </div>
                    <Badge variant="outline">{cls.role}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{cls.students}名学生</p>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">管理班级</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// 管理员仪表盘
export function AdminDashboard() {
  const stats = [
    {
      title: '注册用户',
      value: '1,234',
      description: '平台总用户数',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+12',
      changeType: 'increase' as const
    },
    {
      title: '活跃课程',
      value: '89',
      description: '本学期开设课程',
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: '系统状态',
      value: '99.9%',
      description: '系统正常运行时间',
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: '今日活跃',
      value: '456',
      description: '今日登录用户数',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">系统管理概览</h1>
        <p className="text-muted-foreground">监控系统运行状态和用户活动</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <DashboardCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 系统监控 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              系统监控
            </CardTitle>
            <CardDescription>实时系统性能指标</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">CPU使用率</span>
                  <span className="text-sm">45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">内存使用率</span>
                  <span className="text-sm">67%</span>
                </div>
                <Progress value={67} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">磁盘使用率</span>
                  <span className="text-sm">23%</span>
                </div>
                <Progress value={23} className="h-2" />
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">查看详细监控</Button>
          </CardContent>
        </Card>

        {/* 最近活动 */}
        <Card>
          <CardHeader>
            <CardTitle>最近活动</CardTitle>
            <CardDescription>系统操作日志</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { action: '用户注册', user: 'student001', time: '5分钟前' },
                { action: '课程创建', user: 'teacher002', time: '15分钟前' },
                { action: '系统备份', user: 'system', time: '1小时前' },
                { action: '权限修改', user: 'admin001', time: '2小时前' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">操作者：{activity.user}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">查看操作日志</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// 学校管理员仪表盘
export function SchoolAdminDashboard() {
  const stats = [
    {
      title: '教师总数',
      value: '156',
      description: '全校教师数量',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+8',
      changeType: 'increase' as const
    },
    {
      title: '学生总数',
      value: '3,245',
      description: '在校学生数量',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+45',
      changeType: 'increase' as const
    },
    {
      title: '活跃课程',
      value: '89',
      description: '本学期开设课程',
      icon: BookOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: '平均成绩',
      value: '82.5',
      description: '全校平均分',
      icon: Award,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: '+1.2',
      changeType: 'increase' as const
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">学校管理概览</h1>
        <p className="text-muted-foreground">全校教学数据统计和管理</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <DashboardCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 院系概览 */}
        <Card>
          <CardHeader>
            <CardTitle>院系概览</CardTitle>
            <CardDescription>各院系教学数据统计</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: '数学学院', teachers: 28, students: 456, courses: 15 },
                { name: '计算机学院', teachers: 35, students: 678, courses: 22 },
                { name: '物理学院', teachers: 22, students: 334, courses: 12 },
                { name: '化学学院', teachers: 18, students: 278, courses: 10 }
              ].map((dept, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{dept.name}</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div>教师: {dept.teachers}</div>
                    <div>学生: {dept.students}</div>
                    <div>课程: {dept.courses}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 系统使用情况 */}
        <Card>
          <CardHeader>
            <CardTitle>系统使用情况</CardTitle>
            <CardDescription>平台使用数据分析</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span>日活跃用户</span>
                  <span className="font-medium">1,234人</span>
                </div>
                <Progress value={78} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">较上月增长 8%</p>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>课程完成率</span>
                  <span className="font-medium">85%</span>
                </div>
                <Progress value={85} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">较上月增长 3%</p>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>考试参与率</span>
                  <span className="font-medium">92%</span>
                </div>
                <Progress value={92} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">较上月增长 1%</p>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">查看详细报表</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
