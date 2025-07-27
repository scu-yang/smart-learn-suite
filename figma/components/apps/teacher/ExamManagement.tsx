import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { 
  Calendar,
  Clock,
  FileText,
  Plus,
  Search,
  Filter,
  Edit,
  Copy,
  Trash2,
  Eye,
  Users,
  CheckCircle,
  AlertCircle,
  MoreVertical,
  Send,
  Settings,
  BarChart3,
  Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Exam {
  id: string;
  title: string;
  course: string;
  type: 'quiz' | 'midterm' | 'final' | 'assignment';
  status: 'draft' | 'published' | 'active' | 'completed' | 'grading';
  startTime: string;
  endTime: string;
  duration: number; // minutes
  totalQuestions: number;
  totalPoints: number;
  classes: string[];
  participants: {
    total: number;
    submitted: number;
    graded: number;
  };
  averageScore?: number;
  createdAt: string;
}

const mockExams: Exam[] = [
  {
    id: 'e1',
    title: '高等数学A - 第三章测验',
    course: '高等数学A',
    type: 'quiz',
    status: 'grading',
    startTime: '2025-01-18 09:00',
    endTime: '2025-01-20 23:59',
    duration: 90,
    totalQuestions: 20,
    totalPoints: 100,
    classes: ['高等数学A-01班', '高等数学A-02班'],
    participants: {
      total: 87,
      submitted: 87,
      graded: 45
    },
    averageScore: 82.5,
    createdAt: '2025-01-15'
  },
  {
    id: 'e2',
    title: '线性代数 - 期中考试',
    course: '线性代数',
    type: 'midterm',
    status: 'active',
    startTime: '2025-01-22 14:00',
    endTime: '2025-01-22 16:00',
    duration: 120,
    totalQuestions: 15,
    totalPoints: 150,
    classes: ['线性代数-01班'],
    participants: {
      total: 42,
      submitted: 28,
      graded: 0
    },
    createdAt: '2025-01-10'
  },
  {
    id: 'e3',
    title: '概率论 - 章节练习',
    course: '概率论与数理统计',
    type: 'assignment',
    status: 'published',
    startTime: '2025-01-25 00:00',
    endTime: '2025-01-30 23:59',
    duration: 60,
    totalQuestions: 12,
    totalPoints: 80,
    classes: ['概率论-01班'],
    participants: {
      total: 38,
      submitted: 0,
      graded: 0
    },
    createdAt: '2025-01-20'
  },
  {
    id: 'e4',
    title: '高等数学A - 第四章作业',
    course: '高等数学A',
    type: 'assignment',
    status: 'draft',
    startTime: '2025-01-28 00:00',
    endTime: '2025-02-02 23:59',
    duration: 45,
    totalQuestions: 8,
    totalPoints: 60,
    classes: ['高等数学A-01班'],
    participants: {
      total: 0,
      submitted: 0,
      graded: 0
    },
    createdAt: '2025-01-20'
  }
];

export function ExamManagement() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | Exam['status']>('all');
  const [filterType, setFilterType] = useState<'all' | Exam['type']>('all');

  const filteredExams = mockExams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exam.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || exam.status === filterStatus;
    const matchesType = filterType === 'all' || exam.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getTypeText = (type: Exam['type']) => {
    switch (type) {
      case 'quiz': return '小测验';
      case 'midterm': return '期中考试';
      case 'final': return '期末考试';
      case 'assignment': return '课后作业';
    }
  };

  const getStatusText = (status: Exam['status']) => {
    switch (status) {
      case 'draft': return '草稿';
      case 'published': return '已发布';
      case 'active': return '进行中';
      case 'completed': return '已结束';
      case 'grading': return '批改中';
    }
  };

  const getStatusIcon = (status: Exam['status']) => {
    switch (status) {
      case 'draft': return <Edit className="w-4 h-4 text-muted-foreground" />;
      case 'published': return <Send className="w-4 h-4 text-chart-3" />;
      case 'active': return <Clock className="w-4 h-4 text-chart-2" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-chart-1" />;
      case 'grading': return <AlertCircle className="w-4 h-4 text-chart-4" />;
    }
  };

  const getStatusColor = (status: Exam['status']) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'published': return 'outline';
      case 'active': return 'default';
      case 'completed': return 'secondary';
      case 'grading': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1>考试管理</h1>
          <p className="text-muted-foreground">创建和管理课程考试、测验与作业</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            统计报告
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                创建考试
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate('/assignments/create')}>
                <FileText className="w-4 h-4 mr-2" />
                课后作业
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/exams/create')}>
                <Clock className="w-4 h-4 mr-2" />
                课堂小测
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/exams/create')}>
                <Calendar className="w-4 h-4 mr-2" />
                期中考试
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/exams/create')}>
                <Calendar className="w-4 h-4 mr-2" />
                期末考试
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-1">
              {mockExams.filter(e => e.status === 'active').length}
            </div>
            <p className="text-sm text-muted-foreground">进行中</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-4">
              {mockExams.filter(e => e.status === 'grading').length}
            </div>
            <p className="text-sm text-muted-foreground">待批改</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-3">
              {mockExams.filter(e => e.status === 'published').length}
            </div>
            <p className="text-sm text-muted-foreground">已发布</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-muted-foreground">
              {mockExams.filter(e => e.status === 'draft').length}
            </div>
            <p className="text-sm text-muted-foreground">草稿</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">考试列表</TabsTrigger>
          <TabsTrigger value="templates">试卷模板</TabsTrigger>
          <TabsTrigger value="settings">考试设置</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>考试列表</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="搜索考试..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Filter className="w-4 h-4" />
                        筛选
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>按状态筛选</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                        全部状态
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus('active')}>
                        进行中
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus('grading')}>
                        批改中
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus('published')}>
                        已发布
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus('draft')}>
                        草稿
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>按类型筛选</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setFilterType('all')}>
                        全部类型
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterType('assignment')}>
                        课后作业
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterType('quiz')}>
                        小测验
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterType('midterm')}>
                        期中考试
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterType('final')}>
                        期末考试
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredExams.map((exam) => (
                  <Card key={exam.id} className="hover:shadow-sm transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{exam.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {getTypeText(exam.type)}
                            </Badge>
                            <Badge variant={getStatusColor(exam.status)} className="text-xs">
                              <div className="flex items-center gap-1">
                                {getStatusIcon(exam.status)}
                                {getStatusText(exam.status)}
                              </div>
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{exam.course}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(exam.startTime).toLocaleDateString('zh-CN')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {exam.duration}分钟
                            </span>
                            <span className="flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              {exam.totalQuestions}题
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {exam.classes.join(', ')}
                            </span>
                          </div>
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
                              编辑考试
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="w-4 h-4 mr-2" />
                              复制考试
                            </DropdownMenuItem>
                            {exam.status === 'grading' && (
                              <DropdownMenuItem>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                批改中心
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <BarChart3 className="w-4 h-4 mr-2" />
                              查看统计
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" />
                              导出成绩
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              删除考试
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">参与情况</p>
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={(exam.participants.submitted / exam.participants.total) * 100} 
                              className="h-2 flex-1" 
                            />
                            <span className="text-xs font-medium">
                              {exam.participants.submitted}/{exam.participants.total}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">批改进度</p>
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={exam.participants.submitted > 0 ? (exam.participants.graded / exam.participants.submitted) * 100 : 0} 
                              className="h-2 flex-1" 
                            />
                            <span className="text-xs font-medium">
                              {exam.participants.graded}/{exam.participants.submitted}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">平均分</p>
                          <p className="font-medium">
                            {exam.averageScore ? exam.averageScore.toFixed(1) : '--'}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">总分</p>
                          <p className="font-medium">{exam.totalPoints}分</p>
                        </div>
                      </div>

                      {exam.status === 'grading' && (
                        <div className="mt-3 pt-3 border-t">
                          <Button size="sm" className="gap-2">
                            <CheckCircle className="w-4 h-4" />
                            继续批改 ({exam.participants.submitted - exam.participants.graded}份待批改)
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>试卷模板</CardTitle>
              <CardDescription>管理可重复使用的试卷模板</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>试卷模板功能开发中...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                考试设置
              </CardTitle>
              <CardDescription>配置考试系统的默认参数</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Settings className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>考试设置功能开发中...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}