import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
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
  Calendar,
  Clock,
  Users,
  Play,
  CheckCircle,
  AlertCircle,
  MoreVertical,
  Download,
  Eye,
  Timer,
  Award,
  TrendingUp
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useIsMobile } from '../../ui/use-mobile';

interface Exam {
  id: string;
  title: string;
  course: string;
  type: 'quiz' | 'midterm' | 'final' | 'assignment';
  status: 'upcoming' | 'in-progress' | 'completed' | 'overdue';
  dueDate: string;
  duration: number; // minutes
  totalQuestions: number;
  totalPoints: number;
  score?: number;
  submittedAt?: string;
  attempts: number;
  maxAttempts: number;
  description: string;
  teacher: string;
}

const mockExams: Exam[] = [
  {
    id: 'e1',
    title: '第三章测验 - 极限与连续',
    course: '高等数学A',
    type: 'quiz',
    status: 'upcoming',
    dueDate: '2025-01-25 23:59',
    duration: 90,
    totalQuestions: 15,
    totalPoints: 100,
    attempts: 0,
    maxAttempts: 2,
    description: '测验内容包括极限计算、连续性判断等',
    teacher: '张教授'
  },
  {
    id: 'e2',
    title: '线性代数期中考试',
    course: '线性代数',
    type: 'midterm',
    status: 'in-progress',
    dueDate: '2025-01-22 16:00',
    duration: 120,
    totalQuestions: 20,
    totalPoints: 150,
    attempts: 1,
    maxAttempts: 1,
    description: '涵盖前6章内容，包括矩阵运算、线性方程组等',
    teacher: '李教授'
  },
  {
    id: 'e3',
    title: '概率论第二次作业',
    course: '概率论与数理统计',
    type: 'assignment',
    status: 'completed',
    dueDate: '2025-01-15 23:59',
    duration: 60,
    totalQuestions: 8,
    totalPoints: 80,
    score: 76,
    submittedAt: '2025-01-14 20:30',
    attempts: 1,
    maxAttempts: 3,
    description: '随机变量与概率分布相关题目',
    teacher: '王教授'
  },
  {
    id: 'e4',
    title: '离散数学期末考试',
    course: '离散数学',
    type: 'final',
    status: 'completed',
    dueDate: '2025-01-10 14:00',
    duration: 180,
    totalQuestions: 25,
    totalPoints: 200,
    score: 168,
    submittedAt: '2025-01-10 16:45',
    attempts: 1,
    maxAttempts: 1,
    description: '综合性考试，涵盖所有章节内容',
    teacher: '赵教授'
  },
  {
    id: 'e5',
    title: '微积分应用练习',
    course: '高等数学A',
    type: 'assignment',
    status: 'overdue',
    dueDate: '2025-01-18 23:59',
    duration: 45,
    totalQuestions: 6,
    totalPoints: 60,
    attempts: 0,
    maxAttempts: 2,
    description: '积分在几何和物理中的应用',
    teacher: '张教授'
  }
];

export function StudentExams() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | Exam['status']>('all');
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const filteredExams = mockExams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exam.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || exam.status === filterStatus;
    const matchesTab = activeTab === 'all' || 
                       (activeTab === 'pending' && ['upcoming', 'in-progress'].includes(exam.status)) ||
                       (activeTab === 'completed' && exam.status === 'completed') ||
                       (activeTab === 'overdue' && exam.status === 'overdue');
    return matchesSearch && matchesFilter && matchesTab;
  });

  const getTypeIcon = (type: Exam['type']) => {
    switch (type) {
      case 'quiz': return <FileText className="w-4 h-4" />;
      case 'midterm': return <CheckCircle className="w-4 h-4" />;
      case 'final': return <Award className="w-4 h-4" />;
      case 'assignment': return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeText = (type: Exam['type']) => {
    switch (type) {
      case 'quiz': return '小测验';
      case 'midterm': return '期中考试';
      case 'final': return '期末考试';
      case 'assignment': return '作业';
    }
  };

  const getStatusIcon = (status: Exam['status']) => {
    switch (status) {
      case 'upcoming': return <Clock className="w-4 h-4 text-chart-3" />;
      case 'in-progress': return <Timer className="w-4 h-4 text-chart-2" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-chart-1" />;
      case 'overdue': return <AlertCircle className="w-4 h-4 text-destructive" />;
    }
  };

  const getStatusText = (status: Exam['status']) => {
    switch (status) {
      case 'upcoming': return '即将开始';
      case 'in-progress': return '进行中';
      case 'completed': return '已完成';
      case 'overdue': return '已逾期';
    }
  };

  const getStatusColor = (status: Exam['status']) => {
    switch (status) {
      case 'upcoming': return 'secondary';
      case 'in-progress': return 'default';
      case 'completed': return 'outline';
      case 'overdue': return 'destructive';
    }
  };

  const getDaysLeft = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleStartExam = (examId: string) => {
    navigate(`/exam/${examId}/taking`);
  };

  const handleContinueExam = (examId: string) => {
    navigate(`/exam/${examId}/taking`);
  };

  const handleViewResult = (examId: string) => {
    navigate(`/exam/${examId}/result`);
  };

  const handleViewDetails = (examId: string) => {
    navigate(`/exam/${examId}`);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl">考试中心</h1>
          <p className="text-muted-foreground text-sm sm:text-base">参加测验、考试和提交作业</p>
        </div>
        {!isMobile && (
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Calendar className="w-4 h-4" />
              考试日历
            </Button>
            <Button variant="outline" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              成绩分析
            </Button>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-chart-3">
              {mockExams.filter(e => e.status === 'upcoming').length}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">即将开始</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-chart-2">
              {mockExams.filter(e => e.status === 'in-progress').length}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">进行中</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-chart-1">
              {mockExams.filter(e => e.status === 'completed').length}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">已完成</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-destructive">
              {mockExams.filter(e => e.status === 'overdue').length}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">已逾期</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="all" className="flex-1 sm:flex-none">全部</TabsTrigger>
            <TabsTrigger value="pending" className="flex-1 sm:flex-none">待完成</TabsTrigger>
            <TabsTrigger value="completed" className="flex-1 sm:flex-none">已完成</TabsTrigger>
            <TabsTrigger value="overdue" className="flex-1 sm:flex-none">已逾期</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="搜索考试..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 ${isMobile ? 'w-full' : 'w-64'}`}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 shrink-0">
                  <Filter className="w-4 h-4" />
                  {!isMobile && '筛选'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                  全部状态
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('upcoming')}>
                  即将开始
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('in-progress')}>
                  进行中
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('completed')}>
                  已完成
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('overdue')}>
                  已逾期
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <TabsContent value={activeTab} className="space-y-4">
          <div className="space-y-3 sm:space-y-4">
            {filteredExams.map((exam) => (
              <Card key={exam.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className={`flex ${isMobile ? 'flex-col' : 'items-start justify-between'} mb-4 gap-3`}>
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {getTypeIcon(exam.type)}
                        <h3 className={`font-semibold ${isMobile ? 'text-sm' : 'text-base'}`}>{exam.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {getTypeText(exam.type)}
                        </Badge>
                        {getStatusIcon(exam.status)}
                        <Badge variant={getStatusColor(exam.status)} className="text-xs">
                          {getStatusText(exam.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{exam.description}</p>
                      <div className={`flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground ${isMobile ? 'flex-wrap' : ''}`}>
                        <span>课程：{exam.course}</span>
                        <span>教师：{exam.teacher}</span>
                        <span>时长：{exam.duration}分钟</span>
                        <span>{exam.totalQuestions}题 · {exam.totalPoints}分</span>
                      </div>
                    </div>
                    
                    {!isMobile && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="w-8 h-8 shrink-0">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(exam.id)}>
                            <Eye className="w-4 h-4 mr-2" />
                            查看详情
                          </DropdownMenuItem>
                          {exam.status === 'completed' && (
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" />
                              下载成绩单
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>

                  <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-1 md:grid-cols-4 gap-4'} mb-4`}>
                    <div>
                      <p className="text-sm text-muted-foreground">截止时间</p>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span className="text-sm font-medium">
                          {new Date(exam.dueDate).toLocaleDateString('zh-CN', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      {exam.status === 'upcoming' && (
                        <span className={`text-xs ${getDaysLeft(exam.dueDate) <= 1 ? 'text-destructive' : 'text-muted-foreground'}`}>
                          {getDaysLeft(exam.dueDate) > 0 ? 
                            `${getDaysLeft(exam.dueDate)}天后到期` : 
                            '今天到期'
                          }
                        </span>
                      )}
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">尝试次数</p>
                      <span className="text-sm font-medium">
                        {exam.attempts}/{exam.maxAttempts}
                      </span>
                    </div>

                    {exam.score !== undefined && (
                      <div>
                        <p className="text-sm text-muted-foreground">得分</p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {exam.score}/{exam.totalPoints}
                          </span>
                          <span className={`text-xs ${
                            exam.score / exam.totalPoints >= 0.9 ? 'text-chart-1' :
                            exam.score / exam.totalPoints >= 0.8 ? 'text-chart-2' :
                            exam.score / exam.totalPoints >= 0.6 ? 'text-chart-3' : 'text-destructive'
                          }`}>
                            ({Math.round((exam.score / exam.totalPoints) * 100)}%)
                          </span>
                        </div>
                      </div>
                    )}

                    {exam.submittedAt && (
                      <div>
                        <p className="text-sm text-muted-foreground">提交时间</p>
                        <span className="text-sm font-medium">
                          {new Date(exam.submittedAt).toLocaleDateString('zh-CN', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className={`flex ${isMobile ? 'flex-col gap-3' : 'justify-between items-center'} pt-4 border-t`}>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {exam.status === 'upcoming' && (
                        <span>准备好了吗？点击开始按钮开始考试</span>
                      )}
                      {exam.status === 'in-progress' && (
                        <span>考试进行中，请及时完成并提交</span>
                      )}
                      {exam.status === 'completed' && (
                        <span>已完成，可查看详细成绩和解析</span>
                      )}
                      {exam.status === 'overdue' && (
                        <span>已逾期，请联系教师了解补考安排</span>
                      )}
                    </div>

                    <div className={`flex gap-2 ${isMobile ? 'w-full' : ''}`}>
                      {exam.status === 'upcoming' && exam.attempts < exam.maxAttempts && (
                        <Button 
                          className={`gap-2 ${isMobile ? 'flex-1' : ''}`}
                          onClick={() => handleStartExam(exam.id)}
                        >
                          <Play className="w-4 h-4" />
                          开始考试
                        </Button>
                      )}
                      {exam.status === 'in-progress' && (
                        <Button 
                          className={`gap-2 ${isMobile ? 'flex-1' : ''}`}
                          onClick={() => handleContinueExam(exam.id)}
                        >
                          <Timer className="w-4 h-4" />
                          继续考试
                        </Button>
                      )}
                      {exam.status === 'completed' && (
                        <Button 
                          variant="outline" 
                          className={`gap-2 ${isMobile ? 'flex-1' : ''}`}
                          onClick={() => handleViewResult(exam.id)}
                        >
                          <Eye className="w-4 h-4" />
                          查看结果
                        </Button>
                      )}
                      {exam.status === 'overdue' && exam.attempts < exam.maxAttempts && (
                        <Button 
                          variant="outline" 
                          disabled 
                          className={isMobile ? 'flex-1' : ''}
                        >
                          已逾期
                        </Button>
                      )}
                      
                      {isMobile && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewDetails(exam.id)}
                        >
                          详情
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredExams.length === 0 && (
            <Card>
              <CardContent className="p-6 sm:p-8 text-center">
                <FileText className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-base sm:text-lg font-medium mb-2">没有找到考试</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  当前条件下暂无考试安排
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}