import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Progress } from '../../ui/progress';
import { Badge } from '../../ui/badge';
import { 
  BookOpen, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  Calendar,
  ArrowRight,
  Trophy,
  Target,
  Brain,
  CheckCircle,
  Timer,
  Star,
  MessageSquare,
  Calculator,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { MixedContentRenderer } from '../../common/MathRenderer';
import { useIsMobile } from '../../ui/use-mobile';

const kpiData = [
  {
    title: '待完成作业',
    value: '3',
    description: '即将截止的作业',
    icon: Clock,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    link: '/exams',
    urgent: true
  },
  {
    title: '最近成绩',
    value: '87',
    unit: '分',
    description: '高等数学A第三章',
    icon: TrendingUp,
    color: 'text-chart-1',
    bgColor: 'bg-chart-1/10',
    link: '/report'
  },
  {
    title: '学习进度',
    value: '75',
    unit: '%',
    description: '当前学期总进度',
    icon: Target,
    color: 'text-chart-2',
    bgColor: 'bg-chart-2/10',
    link: '/courses'
  },
  {
    title: '错题待复习',
    value: '12',
    description: '需要重点复习的错题',
    icon: AlertTriangle,
    color: 'text-chart-4',
    bgColor: 'bg-chart-4/10',
    link: '/errors'
  }
];

const upcomingExams = [
  {
    id: 1,
    title: '高等数学A - 第四章练习',
    course: '高等数学A',
    description: '包含积分计算题：$\\int x^2 e^x dx$ 等',
    dueDate: '2025-01-22 23:59',
    duration: '90分钟',
    questions: 15,
    status: 'pending',
    priority: 'high',
    timeLeft: '2天',
    difficulty: 'medium'
  },
  {
    id: 2,
    title: '线性代数 - 矩阵运算测验',
    course: '线性代数',
    description: '矩阵乘法：$\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$ 等运算',
    dueDate: '2025-01-25 15:00',
    duration: '60分钟',
    questions: 20,
    status: 'pending',
    priority: 'medium',
    timeLeft: '5天',
    difficulty: 'hard'
  },
  {
    id: 3,
    title: '概率论 - 章节小测',
    course: '概率论与数理统计',
    description: '正态分布 $X \\sim N(\\mu, \\sigma^2)$ 相关题目',
    dueDate: '2025-01-28 23:59',
    duration: '45分钟',
    questions: 10,
    status: 'pending',
    priority: 'low',
    timeLeft: '8天',
    difficulty: 'easy'
  }
];

const myCourses = [
  {
    id: 1,
    name: '高等数学A',
    progress: 78,
    nextChapter: '第9章 多元函数',
    lastStudied: '昨天',
    currentTopic: '多元函数求偏导：$\\frac{\\partial f}{\\partial x}$',
    score: 87,
    rank: 5,
    totalStudents: 45,
    cover: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=60&h=40&fit=crop'
  },
  {
    id: 2,
    name: '线性代数',
    progress: 65,
    nextChapter: '第7章 特征值',
    lastStudied: '3天前',
    currentTopic: '特征方程：$\\det(A - \\lambda I) = 0$',
    score: 92,
    rank: 2,
    totalStudents: 38,
    cover: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=60&h=40&fit=crop'
  },
  {
    id: 3,
    name: '概率论与数理统计',
    progress: 45,
    nextChapter: '第5章 大数定律',
    lastStudied: '1周前',
    currentTopic: '中心极限定理应用',
    score: 79,
    rank: 12,
    totalStudents: 42,
    cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=60&h=40&fit=crop'
  },
  {
    id: 4,
    name: '离散数学',
    progress: 30,
    nextChapter: '第4章 关系',
    lastStudied: '2周前',
    currentTopic: '等价关系和偏序关系',
    score: 83,
    rank: 8,
    totalStudents: 35,
    cover: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=60&h=40&fit=crop'
  }
];

const achievements = [
  { id: 1, title: '学习达人', description: '连续学习7天', icon: '🔥', earned: true },
  { id: 2, title: '解题高手', description: '单次测验满分', icon: '⭐', earned: true },
  { id: 3, title: '错题克星', description: '错题复习率100%', icon: '🎯', earned: false },
  { id: 4, title: '课程完成者', description: '完成一门课程', icon: '🏆', earned: false }
];

const recentActivities = [
  {
    id: 1,
    type: 'practice',
    title: '完成极限练习',
    description: '练习 $\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$ 相关题目',
    time: '2小时前',
    score: 95
  },
  {
    id: 2,
    type: 'discussion',
    title: '参与课堂讨论',
    description: '在"矩阵乘法"话题下发表了见解',
    time: '5小时前',
    likes: 8
  },
  {
    id: 3,
    type: 'video',
    title: '观看教学视频',
    description: '学习了"定积分的应用"章节',
    time: '昨天',
    duration: '45分钟'
  }
];

export function StudentDashboard() {
  const isMobile = useIsMobile();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-destructive';
      case 'medium': return 'border-l-chart-4';
      case 'low': return 'border-l-chart-3';
      default: return 'border-l-muted-foreground';
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    const variants = {
      easy: { variant: 'secondary' as const, text: '简单' },
      medium: { variant: 'default' as const, text: '中等' },
      hard: { variant: 'destructive' as const, text: '困难' }
    };
    return variants[difficulty as keyof typeof variants] || variants.medium;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'practice': return <Brain className="w-4 h-4 text-chart-1" />;
      case 'discussion': return <MessageSquare className="w-4 h-4 text-chart-2" />;
      case 'video': return <BookOpen className="w-4 h-4 text-chart-3" />;
      default: return <CheckCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl">早上好，李同学！</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            今天是你连续学习的第7天，继续保持！有3个作业即将到期，记得及时完成。
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1 text-chart-1">
            <Trophy className="w-4 h-4" />
            <span className="text-sm font-medium">1250积分</span>
          </div>
          <Badge variant="secondary" className="gap-1">
            <Star className="w-3 h-3" />
            等级 5
          </Badge>
          {!isMobile && (
            <Link to="/math-test">
              <Button variant="outline" size="sm" className="gap-2">
                <Calculator className="w-4 h-4" />
                公式测试
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {kpiData.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.title} to={item.link}>
              <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
                  <div className="space-y-1">
                    <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                      {item.title}
                    </CardTitle>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-lg sm:text-2xl font-bold ${item.urgent ? 'text-destructive' : ''}`}>
                        {item.value}
                      </span>
                      {item.unit && <span className="text-xs sm:text-sm text-muted-foreground">{item.unit}</span>}
                    </div>
                  </div>
                  <div className={`w-8 h-8 sm:w-12 sm:h-12 ${item.bgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-4 h-4 sm:w-6 sm:h-6 ${item.color}`} />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                  {item.urgent && (
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3 text-destructive" />
                      <span className="text-xs text-destructive font-medium">紧急</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className={`grid grid-cols-1 ${isMobile ? 'space-y-6' : 'lg:grid-cols-3 gap-6'}`}>
        {/* Upcoming Exams */}
        <div className={isMobile ? '' : 'lg:col-span-1'}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                我的考试
              </CardTitle>
              <CardDescription className="text-sm">即将到期的作业和测验</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingExams.slice(0, isMobile ? 2 : 3).map((exam) => {
                const difficultyBadge = getDifficultyBadge(exam.difficulty);
                return (
                  <div
                    key={exam.id}
                    className={`p-3 border-l-4 bg-card rounded-r-lg hover:bg-accent/50 transition-colors cursor-pointer ${getPriorityColor(exam.priority)}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Timer className="w-4 h-4 text-muted-foreground" />
                        <span className={`text-xs font-medium ${
                          exam.timeLeft.includes('天') && parseInt(exam.timeLeft) <= 2 
                            ? 'text-destructive' 
                            : 'text-chart-4'
                        }`}>
                          {exam.timeLeft}
                        </span>
                      </div>
                      <Badge {...difficultyBadge} className="text-xs">
                        {difficultyBadge.text}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-sm mb-1">{exam.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{exam.course}</p>
                    
                    {/* 数学公式描述 */}
                    <div className="text-xs text-muted-foreground mb-2">
                      <MixedContentRenderer content={exam.description} />
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{exam.questions}题 · {exam.duration}</span>
                      <Link to="/exams">
                        <Button size="sm" className="h-6 text-xs">
                          开始
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
              <Link to="/exams">
                <Button variant="outline" className="w-full mt-4" size="sm">
                  查看全部考试
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* My Courses */}
        <div className={isMobile ? '' : 'lg:col-span-2'}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                我的课程
              </CardTitle>
              <CardDescription className="text-sm">继续您的学习之旅</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-1 md:grid-cols-2 gap-4'}`}>
                {myCourses.slice(0, isMobile ? 3 : 4).map((course) => (
                  <Link key={course.id} to="/courses">
                    <div className="p-3 sm:p-4 border rounded-lg hover:shadow-sm transition-all cursor-pointer group">
                      <div className="flex items-start gap-3 mb-3">
                        <img 
                          src={course.cover} 
                          alt={course.name}
                          className="w-10 h-7 sm:w-12 sm:h-8 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm sm:text-base truncate group-hover:text-primary">
                            {course.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              第{course.rank}名/{course.totalStudents}人
                            </Badge>
                            <span className="text-xs text-chart-1 font-medium">
                              {course.score}分
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>学习进度</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                        
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>下一章：{course.nextChapter}</div>
                          <div className="flex items-center justify-between">
                            <div className="truncate pr-2">
                              <MixedContentRenderer content={course.currentTopic} />
                            </div>
                            <span className="shrink-0">{course.lastStudied}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button size="sm" variant="ghost" className="w-full mt-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        继续学习
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activities and Quick Actions */}
      <div className={`grid grid-cols-1 ${isMobile ? 'space-y-6' : 'lg:grid-cols-2 gap-6'}`}>
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              最近活动
            </CardTitle>
            <CardDescription className="text-sm">您最近的学习动态</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="mt-0.5">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-sm">{activity.title}</h5>
                    <div className="text-xs text-muted-foreground mb-1">
                      <MixedContentRenderer content={activity.description} />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{activity.time}</span>
                      {activity.score && (
                        <Badge variant="secondary" className="text-xs">
                          {activity.score}分
                        </Badge>
                      )}
                      {activity.likes && (
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {activity.likes}
                        </span>
                      )}
                      {activity.duration && (
                        <span>{activity.duration}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements and Quick Actions */}
        <div className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
                我的成就
              </CardTitle>
              <CardDescription className="text-sm">学习路上的里程碑</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-3 border rounded-lg text-center ${ 
                      achievement.earned 
                        ? 'bg-chart-1/10 border-chart-1/30' 
                        : 'bg-muted/30 border-muted'
                    }`}
                  >
                    <div className={`text-xl sm:text-2xl mb-1 ${achievement.earned ? '' : 'grayscale opacity-50'}`}>
                      {achievement.icon}
                    </div>
                    <h4 className={`font-medium text-xs ${achievement.earned ? 'text-chart-1' : 'text-muted-foreground'}`}>
                      {achievement.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {achievement.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">学习工具</CardTitle>
              <CardDescription className="text-sm">提升学习效率的工具</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Link to="/practice">
                  <Button variant="outline" className="h-14 sm:h-16 flex-col gap-1 w-full">
                    <Brain className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-xs">智能练习</span>
                  </Button>
                </Link>
                <Link to="/errors">
                  <Button variant="outline" className="h-14 sm:h-16 flex-col gap-1 w-full">
                    <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-xs">错题本</span>
                  </Button>
                </Link>
                <Link to="/report">
                  <Button variant="outline" className="h-14 sm:h-16 flex-col gap-1 w-full">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-xs">学习报告</span>
                  </Button>
                </Link>
                <Link to="/forum">
                  <Button variant="outline" className="h-14 sm:h-16 flex-col gap-1 w-full">
                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-xs">问答讨论</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}