import React, { useState, useEffect } from 'react';
import { Routes, Route, useSearchParams, Navigate, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../ui/collapsible';
import { 
  BookOpen,
  Play,
  FileText,
  MessageSquare,
  Clock,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Award,
  TrendingUp,
  Calendar,
  Users,
  Star,
  Target,
  Video,
  PenTool,
  HelpCircle,
  ArrowLeft,
  Pause,
  BarChart3,
  Timer,
  Trophy
} from 'lucide-react';
import { ChapterStudy } from './ChapterStudy';

interface Course {
  id: string;
  name: string;
  code: string;
  teacher: {
    name: string;
    avatar?: string;
  };
  description: string;
  progress: number;
  totalChapters: number;
  completedChapters: number;
  averageScore: number;
  timeSpent: number;
  nextDeadline: string;
  cover: string;
  students: number;
  rating: number;
  chapters: Chapter[];
  recentActivities: Activity[];
  upcomingTasks: Task[];
}

interface Chapter {
  id: string;
  title: string;
  description: string;
  order: number;
  isCompleted: boolean;
  progress: number;
  estimatedTime: number;
  sections: Section[];
}

interface Section {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'assignment' | 'quiz' | 'discussion';
  duration: number;
  isCompleted: boolean;
  score?: number;
}

interface Activity {
  id: string;
  type: 'video' | 'assignment' | 'quiz' | 'discussion';
  title: string;
  chapter: string;
  timestamp: string;
  score?: number;
}

interface Task {
  id: string;
  title: string;
  type: 'assignment' | 'quiz' | 'exam';
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  progress: number;
}

// Mock course data
const mockCourseData: Record<string, Course> = {
  'c1': {
    id: 'c1',
    name: '高等数学A',
    code: 'MATH101',
    teacher: {
      name: '张教授',
      avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=32&h=32&fit=crop&crop=face'
    },
    description: '微积分基础理论与应用，包括极限、导数、积分等核心概念。本课程注重理论与实践相结合，培养学生的数学思维能力。',
    progress: 75,
    totalChapters: 12,
    completedChapters: 9,
    averageScore: 85.2,
    timeSpent: 48.5,
    nextDeadline: '2025-01-25',
    cover: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=300&fit=crop',
    students: 45,
    rating: 4.8,
    chapters: [
      {
        id: 'ch1',
        title: '第1章 函数与极限',
        description: '函数的概念、极限的定义与性质',
        order: 1,
        isCompleted: true,
        progress: 100,
        estimatedTime: 6,
        sections: [
          { id: 's1-1', title: '函数的概念', type: 'video', duration: 45, isCompleted: true },
          { id: 's1-2', title: '极限的定义', type: 'video', duration: 50, isCompleted: true },
          { id: 's1-3', title: '练习题', type: 'assignment', duration: 30, isCompleted: true, score: 90 },
          { id: 's1-4', title: '讨论：极限的理解', type: 'discussion', duration: 0, isCompleted: true }
        ]
      },
      {
        id: 'ch2',
        title: '第2章 导数与微分',
        description: '导数的概念、计算方法与应用',
        order: 2,
        isCompleted: true,
        progress: 100,
        estimatedTime: 8,
        sections: [
          { id: 's2-1', title: '导数的定义', type: 'video', duration: 40, isCompleted: true },
          { id: 's2-2', title: '求导法则', type: 'video', duration: 55, isCompleted: true },
          { id: 's2-3', title: '复合函数求导', type: 'video', duration: 35, isCompleted: true },
          { id: 's2-4', title: '导数练习', type: 'quiz', duration: 20, isCompleted: true, score: 88 }
        ]
      },
      {
        id: 'ch3',
        title: '第3章 积分学',
        description: '不定积分与定积分的概念与计算',
        order: 3,
        isCompleted: false,
        progress: 60,
        estimatedTime: 10,
        sections: [
          { id: 's3-1', title: '不定积分', type: 'video', duration: 50, isCompleted: true },
          { id: 's3-2', title: '定积分', type: 'video', duration: 45, isCompleted: true },
          { id: 's3-3', title: '积分方法', type: 'video', duration: 40, isCompleted: false },
          { id: 's3-4', title: '积分应用', type: 'assignment', duration: 60, isCompleted: false }
        ]
      },
      {
        id: 'ch4',
        title: '第4章 微分方程',
        description: '常微分方程的解法与应用',
        order: 4,
        isCompleted: false,
        progress: 0,
        estimatedTime: 12,
        sections: [
          { id: 's4-1', title: '微分方程的概念', type: 'video', duration: 45, isCompleted: false },
          { id: 's4-2', title: '一阶微分方程', type: 'video', duration: 60, isCompleted: false },
          { id: 's4-3', title: '二阶微分方程', type: 'video', duration: 55, isCompleted: false },
          { id: 's4-4', title: '应用练习', type: 'assignment', duration: 90, isCompleted: false }
        ]
      }
    ],
    recentActivities: [
      {
        id: 'a1',
        type: 'video',
        title: '定积分',
        chapter: '第3章',
        timestamp: '2小时前',
      },
      {
        id: 'a2',
        type: 'assignment',
        title: '导数练习',
        chapter: '第2章',
        timestamp: '1天前',
        score: 88
      },
      {
        id: 'a3',
        type: 'quiz',
        title: '第2章测验',
        chapter: '第2章',
        timestamp: '3天前',
        score: 92
      }
    ],
    upcomingTasks: [
      {
        id: 't1',
        title: '积分应用作业',
        type: 'assignment',
        dueDate: '2025-01-25',
        priority: 'high',
        progress: 0
      },
      {
        id: 't2',
        title: '第3章测验',
        type: 'quiz',
        dueDate: '2025-01-28',
        priority: 'medium',
        progress: 0
      },
      {
        id: 't3',
        title: '期中考试',
        type: 'exam',
        dueDate: '2025-02-15',
        priority: 'high',
        progress: 30
      }
    ]
  },
  'c2': {
    id: 'c2',
    name: '线性代数',
    code: 'MATH201',
    teacher: {
      name: '李教授',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5b5?w=32&h=32&fit=crop&crop=face'
    },
    description: '矩阵理论、向量空间、线性变换等线性代数核心内容',
    progress: 60,
    totalChapters: 10,
    completedChapters: 6,
    averageScore: 82.5,
    timeSpent: 32.0,
    nextDeadline: '2025-01-30',
    cover: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&h=300&fit=crop',
    students: 38,
    rating: 4.6,
    chapters: [],
    recentActivities: [],
    upcomingTasks: []
  }
};

export function CourseStudy() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const courseId = searchParams.get('courseId');
  
  if (!courseId || !mockCourseData[courseId]) {
    return <Navigate to="/student/courses" replace />;
  }

  return (
    <div className="h-full">
      <Routes>
        <Route path="/" element={<CourseOverview courseId={courseId} />} />
        <Route path="/chapter/:chapterId/*" element={<ChapterStudy courseId={courseId} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function CourseOverview({ courseId }: { courseId: string }) {
  const navigate = useNavigate();
  const course = mockCourseData[courseId];
  const [openChapters, setOpenChapters] = useState<string[]>(['ch3']); // 默认展开当前学习章节
  
  const toggleChapter = (chapterId: string) => {
    setOpenChapters(prev => 
      prev.includes(chapterId) 
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const getSectionIcon = (type: Section['type']) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'reading': return <BookOpen className="w-4 h-4" />;
      case 'assignment': return <PenTool className="w-4 h-4" />;
      case 'quiz': return <FileText className="w-4 h-4" />;
      case 'discussion': return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getSectionTypeText = (type: Section['type']) => {
    switch (type) {
      case 'video': return '视频';
      case 'reading': return '阅读';
      case 'assignment': return '作业';
      case 'quiz': return '测验';
      case 'discussion': return '讨论';
    }
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4 text-chart-1" />;
      case 'assignment': return <PenTool className="w-4 h-4 text-chart-2" />;
      case 'quiz': return <FileText className="w-4 h-4 text-chart-3" />;
      case 'discussion': return <MessageSquare className="w-4 h-4 text-chart-4" />;
    }
  };

  const getTaskPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
    }
  };

  const handleSectionClick = (chapterId: string, sectionId: string) => {
    navigate(`/student/course-study/chapter/${chapterId}?courseId=${courseId}&sectionId=${sectionId}`);
  };

  const handleContinueStudy = () => {
    // 找到第一个未完成的章节
    const nextChapter = course.chapters.find(ch => !ch.isCompleted);
    if (nextChapter) {
      const nextSection = nextChapter.sections.find(s => !s.isCompleted);
      if (nextSection) {
        handleSectionClick(nextChapter.id, nextSection.id);
      } else {
        navigate(`/student/course-study/chapter/${nextChapter.id}?courseId=${courseId}`);
      }
    }
  };

  return (
    <div className="flex h-full bg-background">
      {/* Course Sidebar */}
      <div className="w-80 border-r bg-card overflow-y-auto">
        <div className="p-4 border-b">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 gap-2"
            onClick={() => navigate('/student/courses')}
          >
            <ArrowLeft className="w-4 h-4" />
            返回课程列表
          </Button>
          
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-chart-1/10 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-chart-1" />
            </div>
            <div>
              <h2 className="font-semibold">{course.name}</h2>
              <p className="text-sm text-muted-foreground">{course.code}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <Avatar className="w-6 h-6">
              <AvatarImage src={course.teacher.avatar} />
              <AvatarFallback className="text-xs">{course.teacher.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{course.teacher.name}</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>总体进度</span>
              <span>{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{course.completedChapters}/{course.totalChapters} 章节</span>
              <span>平均分: {course.averageScore}</span>
            </div>
          </div>
        </div>

        {/* Chapter List */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">课程章节</h3>
            <Button 
              size="sm" 
              className="gap-2"
              onClick={handleContinueStudy}
            >
              <Play className="w-3 h-3" />
              继续学习
            </Button>
          </div>
          <div className="space-y-2">
            {course.chapters.map((chapter) => (
              <Collapsible
                key={chapter.id}
                open={openChapters.includes(chapter.id)}
                onOpenChange={() => toggleChapter(chapter.id)}
              >
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center gap-2 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-2 flex-1 text-left">
                      {openChapters.includes(chapter.id) ? 
                        <ChevronDown className="w-4 h-4" /> : 
                        <ChevronRight className="w-4 h-4" />
                      }
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">{chapter.title}</h4>
                          {chapter.isCompleted && (
                            <CheckCircle className="w-4 h-4 text-chart-1" />
                          )}
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-muted-foreground">
                            {chapter.sections.length}节 · 约{chapter.estimatedTime}小时
                          </span>
                          <span className="text-xs font-medium">{chapter.progress}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="pl-6">
                  <div className="space-y-1 mt-2">
                    {chapter.sections.map((section) => (
                      <div 
                        key={section.id}
                        className="flex items-center gap-2 p-2 rounded hover:bg-accent/30 cursor-pointer"
                        onClick={() => handleSectionClick(chapter.id, section.id)}
                      >
                        <div className="flex items-center gap-2 flex-1">
                          {getSectionIcon(section.type)}
                          <span className="text-sm">{section.title}</span>
                          <Badge variant="outline" className="text-xs">
                            {getSectionTypeText(section.type)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          {section.duration > 0 && (
                            <span className="text-xs text-muted-foreground">
                              {section.duration}分钟
                            </span>
                          )}
                          {section.isCompleted ? (
                            <CheckCircle className="w-3 h-3 text-chart-1" />
                          ) : (
                            <div className="w-3 h-3 border border-muted-foreground rounded-full" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Course Header */}
          <div className="relative">
            {/* Course Cover */}
            <div className="relative h-48 rounded-lg overflow-hidden mb-6">
              <img 
                src={course.cover} 
                alt={course.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h1 className="text-3xl font-bold mb-2">{course.name}</h1>
                <p className="text-lg opacity-90">{course.description}</p>
              </div>
              <div className="absolute top-4 right-4">
                <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2 text-white">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{course.rating}</span>
                  <span className="opacity-70">({course.students}人)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-chart-1/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-6 h-6 text-chart-1" />
                </div>
                <div className="text-2xl font-bold text-chart-1">{course.progress}%</div>
                <p className="text-sm text-muted-foreground">学习进度</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-chart-2/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Trophy className="w-6 h-6 text-chart-2" />
                </div>
                <div className="text-2xl font-bold text-chart-2">{course.averageScore}</div>
                <p className="text-sm text-muted-foreground">平均分</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-chart-3/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Timer className="w-6 h-6 text-chart-3" />
                </div>
                <div className="text-2xl font-bold text-chart-3">{course.timeSpent}h</div>
                <p className="text-sm text-muted-foreground">学习时长</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-chart-4/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Calendar className="w-6 h-6 text-chart-4" />
                </div>
                <div className="text-2xl font-bold text-chart-4">
                  {Math.ceil((new Date(course.nextDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                </div>
                <p className="text-sm text-muted-foreground">天后截止</p>
              </CardContent>
            </Card>
          </div>

          {/* Course Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">学习概览</TabsTrigger>
              <TabsTrigger value="progress">学习进度</TabsTrigger>
              <TabsTrigger value="assignments">作业测验</TabsTrigger>
              <TabsTrigger value="discussions">课程讨论</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activities */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      最近活动
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {course.recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-center gap-3 p-3 border rounded-lg">
                          {getActivityIcon(activity.type)}
                          <div className="flex-1">
                            <h4 className="text-sm font-medium">{activity.title}</h4>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{activity.chapter}</span>
                              <span>·</span>
                              <span>{activity.timestamp}</span>
                              {activity.score && (
                                <>
                                  <span>·</span>
                                  <span className="font-medium text-chart-1">{activity.score}分</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Upcoming Tasks */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      近期任务
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {course.upcomingTasks.map((task) => (
                        <div key={task.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium">{task.title}</h4>
                            <Badge variant={getTaskPriorityColor(task.priority)} className="text-xs">
                              {task.type === 'assignment' && '作业'}
                              {task.type === 'quiz' && '测验'}
                              {task.type === 'exam' && '考试'}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                            <span>截止时间：{new Date(task.dueDate).toLocaleDateString('zh-CN')}</span>
                            <span>{task.progress}% 完成</span>
                          </div>
                          <Progress value={task.progress} className="h-1" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Study Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      学习统计
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">已完成章节</span>
                        <span className="font-medium">{course.completedChapters}/{course.totalChapters}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">总学习时长</span>
                        <span className="font-medium">{course.timeSpent} 小时</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">平均成绩</span>
                        <span className="font-medium">{course.averageScore} 分</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">课程排名</span>
                        <span className="font-medium">8/{course.students}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">本周学习时长</span>
                        <span className="font-medium">8.5 小时</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      快速操作
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        variant="outline" 
                        className="h-auto flex-col gap-2 py-4"
                        onClick={handleContinueStudy}
                      >
                        <Play className="w-5 h-5" />
                        <span className="text-xs">继续学习</span>
                      </Button>
                      <Button variant="outline" className="h-auto flex-col gap-2 py-4">
                        <FileText className="w-5 h-5" />
                        <span className="text-xs">查看作业</span>
                      </Button>
                      <Button variant="outline" className="h-auto flex-col gap-2 py-4">
                        <MessageSquare className="w-5 h-5" />
                        <span className="text-xs">课程讨论</span>
                      </Button>
                      <Button variant="outline" className="h-auto flex-col gap-2 py-4">
                        <Calendar className="w-5 h-5" />
                        <span className="text-xs">课程表</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="progress" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>章节进度详情</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {course.chapters.map((chapter) => (
                      <div key={chapter.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{chapter.title}</h4>
                          <span className="text-sm text-muted-foreground">{chapter.progress}%</span>
                        </div>
                        <Progress value={chapter.progress} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{chapter.sections.filter(s => s.isCompleted).length}/{chapter.sections.length} 节已完成</span>
                          <span>预计 {chapter.estimatedTime} 小时</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assignments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>作业与测验</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>作业与测验列表功能开发中...</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="discussions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>课程讨论</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>课程讨论功能开发中...</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}