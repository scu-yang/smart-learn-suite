import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { 
  BookOpen,
  Search,
  Filter,
  Calendar,
  Clock,
  Users,
  Star,
  Play,
  FileText,
  MessageSquare,
  MoreVertical,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useIsMobile } from '../../ui/use-mobile';

interface Course {
  id: string;
  name: string;
  code: string;
  teacher: string;
  teacherAvatar?: string;
  description: string;
  progress: number;
  currentChapter: string;
  totalChapters: number;
  nextClass: string;
  students: number;
  rating: number;
  cover: string;
  status: 'active' | 'completed' | 'upcoming';
  assignments: number;
  unreadMessages: number;
}

const mockCourses: Course[] = [
  {
    id: 'c1',
    name: '高等数学A',
    code: 'MATH101',
    teacher: '张教授',
    teacherAvatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=32&h=32&fit=crop&crop=face',
    description: '微积分基础理论与应用，包括极限、导数、积分等核心概念',
    progress: 75,
    currentChapter: '第8章 积分应用',
    totalChapters: 12,
    nextClass: '明天 09:00',
    students: 45,
    rating: 4.8,
    cover: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&h=200&fit=crop',
    status: 'active',
    assignments: 3,
    unreadMessages: 2
  },
  {
    id: 'c2',
    name: '线性代数',
    code: 'MATH201',
    teacher: '李教授',
    teacherAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5b5?w=32&h=32&fit=crop&crop=face',
    description: '矩阵理论、向量空间、线性变换等线性代数核心内容',
    progress: 60,
    currentChapter: '第6章 特征值',
    totalChapters: 10,
    nextClass: '周三 14:00',
    students: 38,
    rating: 4.6,
    cover: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=300&h=200&fit=crop',
    status: 'active',
    assignments: 1,
    unreadMessages: 0
  },
  {
    id: 'c3',
    name: '概率论与数理统计',
    code: 'MATH301',
    teacher: '王教授',
    teacherAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    description: '概率理论、随机变量、统计推断等内容',
    progress: 90,
    currentChapter: '第10章 回归分析',
    totalChapters: 10,
    nextClass: '周五 10:00',
    students: 42,
    rating: 4.9,
    cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop',
    status: 'active',
    assignments: 0,
    unreadMessages: 1
  },
  {
    id: 'c4',
    name: '离散数学',
    code: 'MATH401',
    teacher: '赵教授',
    description: '逻辑、集合论、图论等离散数学内容',
    progress: 100,
    currentChapter: '已完成',
    totalChapters: 8,
    nextClass: '已结束',
    students: 35,
    rating: 4.7,
    cover: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=300&h=200&fit=crop',
    status: 'completed',
    assignments: 0,
    unreadMessages: 0
  }
];

export function StudentCourses() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | Course['status']>('all');
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || course.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: Course['status']) => {
    switch (status) {
      case 'active': return <Play className="w-4 h-4 text-chart-2" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-chart-1" />;
      case 'upcoming': return <Clock className="w-4 h-4 text-chart-3" />;
    }
  };

  const getStatusText = (status: Course['status']) => {
    switch (status) {
      case 'active': return '进行中';
      case 'completed': return '已完成';
      case 'upcoming': return '即将开始';
    }
  };

  const getStatusColor = (status: Course['status']) => {
    switch (status) {
      case 'active': return 'default';
      case 'completed': return 'secondary';
      case 'upcoming': return 'outline';
    }
  };

  const handleCourseClick = (courseId: string) => {
    navigate(`/course-study?courseId=${courseId}`);
  };

  const handleEnterStudy = (e: React.MouseEvent, courseId: string) => {
    e.stopPropagation(); // 防止触发卡片点击事件
    navigate(`/course-study?courseId=${courseId}`);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl">我的课程</h1>
          <p className="text-muted-foreground text-sm sm:text-base">查看学习进度和课程资料</p>
        </div>
        {!isMobile && (
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Calendar className="w-4 h-4" />
              课程表
            </Button>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-chart-2">
              {mockCourses.filter(c => c.status === 'active').length}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">进行中</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-chart-1">
              {mockCourses.filter(c => c.status === 'completed').length}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">已完成</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-chart-3">
              {Math.round(mockCourses.reduce((sum, c) => sum + c.progress, 0) / mockCourses.length)}%
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">平均进度</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-chart-4">
              {mockCourses.reduce((sum, c) => sum + c.assignments, 0)}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">待完成作业</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="搜索课程..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className={`gap-2 ${isMobile ? 'w-full sm:w-auto' : ''}`}>
              <Filter className="w-4 h-4" />
              {filterStatus === 'all' ? '全部课程' : getStatusText(filterStatus)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setFilterStatus('all')}>
              全部课程
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus('active')}>
              进行中
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus('completed')}>
              已完成
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus('upcoming')}>
              即将开始
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Course List */}
      <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'lg:grid-cols-2 gap-6'}`}>
        {filteredCourses.map((course) => (
          <Card 
            key={course.id} 
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => handleCourseClick(course.id)}
          >
            <div className="relative">
              <img 
                src={course.cover} 
                alt={course.name}
                className={`w-full ${isMobile ? 'h-32' : 'h-48'} object-cover group-hover:scale-105 transition-transform duration-300`}
              />
              {/* Overlay gradient for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex gap-1 sm:gap-2">
                <Badge variant={getStatusColor(course.status)} className="text-xs">
                  <div className="flex items-center gap-1">
                    {getStatusIcon(course.status)}
                    {!isMobile && getStatusText(course.status)}
                  </div>
                </Badge>
                {course.assignments > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {course.assignments}{isMobile ? '' : '个作业'}
                  </Badge>
                )}
              </div>
              
              <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4">
                <div className="flex items-center gap-2 text-white">
                  <Avatar className="w-5 h-5 sm:w-6 sm:h-6">
                    <AvatarImage src={course.teacherAvatar} />
                    <AvatarFallback className="text-xs">{course.teacher.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs sm:text-sm font-medium">{course.teacher}</span>
                </div>
              </div>

              {/* Mobile-friendly hover overlay */}
              {!isMobile && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex gap-2">
                    <Button size="sm" className="gap-2">
                      <Play className="w-4 h-4" />
                      开始学习
                    </Button>
                    <Button size="sm" variant="secondary" className="gap-2">
                      <BookOpen className="w-4 h-4" />
                      课程详情
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold group-hover:text-primary transition-colors text-sm sm:text-base truncate">
                      {course.name}
                    </h3>
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded shrink-0">{course.code}</code>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                    {course.description}
                  </p>
                </div>
                
                {!isMobile && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="w-8 h-8 shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        handleCourseClick(course.id);
                      }}>
                        <BookOpen className="w-4 h-4 mr-2" />
                        进入课程
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        <FileText className="w-4 h-4 mr-2" />
                        课程资料
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        课程讨论
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              <div className="space-y-3">
                {/* Progress */}
                <div>
                  <div className="flex justify-between text-xs sm:text-sm mb-1">
                    <span>学习进度</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span className="truncate pr-2">{course.currentChapter}</span>
                    <span className="shrink-0">{course.totalChapters}章</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                  <div>
                    <div className="text-xs sm:text-sm font-medium">{course.students}</div>
                    <div className="text-xs text-muted-foreground">同学</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 text-xs sm:text-sm font-medium">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      {course.rating}
                    </div>
                    <div className="text-xs text-muted-foreground">评分</div>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-medium">
                      {course.unreadMessages > 0 ? course.unreadMessages : '--'}
                    </div>
                    <div className="text-xs text-muted-foreground">未读消息</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 sm:p-3 bg-muted/50 rounded-lg gap-2">
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="truncate">下次上课：{course.nextClass}</span>
                  </div>
                  {course.status === 'active' && (
                    <Button 
                      size="sm" 
                      className="gap-2 w-full sm:w-auto"
                      onClick={(e) => handleEnterStudy(e, course.id)}
                    >
                      <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                      进入学习
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  )}
                  {course.status === 'completed' && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="gap-2 w-full sm:w-auto"
                      onClick={(e) => handleEnterStudy(e, course.id)}
                    >
                      <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                      回顾课程
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <Card>
          <CardContent className="p-6 sm:p-8 text-center">
            <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-base sm:text-lg font-medium mb-2">没有找到课程</h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              尝试调整搜索条件或联系管理员
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}