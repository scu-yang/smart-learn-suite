import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  CheckCircle, 
  FileText, 
  MessageSquare, 
  ArrowLeft,
  Star,
  Play,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Target,
  Video,
  PenTool,
  BarChart3,
  Timer,
  Trophy,
  HelpCircle,
  Lightbulb
} from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  useCourseDetail, 
  useCourseAssignments, 
  useCourseAnnouncements
} from "@/hooks/useQueries";

interface CourseDetailPageProps {
  courseId: string;
}

// 扩展的章节节点类型，支持树形结构
interface ChapterNode {
  id: string;
  title: string;
  description: string;
  type: 'chapter' | 'knowledge';
  order: number;
  isCompleted?: boolean;
  progress?: number;
  duration?: number;
  parentId?: string;
  children?: ChapterNode[];
  // 章节内容
  videoUrl?: string;
  materials?: {
    id: string;
    name: string;
    type: 'video' | 'pdf' | 'ppt' | 'doc';
    url: string;
    duration?: number;
  }[];
  quizzes?: {
    id: string;
    title: string;
    type: 'quiz' | 'exam';
    questions: number;
    duration: number;
  }[];
}

// 章节详情内容类型
interface ChapterDetail {
  id: string;
  title: string;
  description: string;
  type: 'chapter' | 'knowledge';
  content?: string;
  videoUrl?: string;
  materials?: {
    id: string;
    name: string;
    type: 'video' | 'pdf' | 'ppt' | 'doc';
    url: string;
    duration?: number;
  }[];
  quizzes?: {
    id: string;
    title: string;
    type: 'quiz' | 'exam';
    questions: number;
    duration: number;
  }[];
}

export function CourseDetailPage({ courseId }: CourseDetailPageProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "chapters" | "assignments" | "announcements">("overview");
  const [openChapters, setOpenChapters] = useState<string[]>(['ch1', 'ch2', 'ch1-1', 'ch2-1', 'ch2-2']); // 默认展开一些章节
  const [selectedChapter, setSelectedChapter] = useState<ChapterDetail | null>(null);
  
  // 使用 React Query hooks 获取数据
  const { data: course, isLoading: courseLoading } = useCourseDetail(courseId);
  const { data: assignments = [] } = useCourseAssignments(courseId);
  const { data: announcements = [] } = useCourseAnnouncements(courseId);

  // 模拟树形章节数据
  const mockChapterTree: ChapterNode[] = [
    {
      id: 'ch1',
      title: '第1章 函数与极限',
      description: '函数的基本概念与极限理论',
      type: 'chapter',
      order: 1,
      isCompleted: true,
      progress: 100,
      duration: 360,
      children: [
        {
          id: 'ch1-1',
          title: '1.1 函数的概念',
          description: '函数的定义、分类与基本性质',
          type: 'chapter',
          order: 1,
          isCompleted: true,
          progress: 100,
          duration: 120,
          parentId: 'ch1',
          children: [
            {
              id: 'ch1-1-k1',
              title: '函数的定义',
              description: '函数的数学定义、定义域、值域',
              type: 'knowledge',
              order: 1,
              isCompleted: true,
              progress: 100,
              duration: 30,
              parentId: 'ch1-1',
              videoUrl: '/videos/ch1-1-k1.mp4',
              materials: [
                { id: 'm1', name: '函数定义讲义.pdf', type: 'pdf', url: '/materials/ch1-1-k1.pdf' }
              ]
            },
            {
              id: 'ch1-1-k2',
              title: '函数的表示方法',
              description: '解析式、图像、表格表示',
              type: 'knowledge',
              order: 2,
              isCompleted: true,
              progress: 100,
              duration: 25,
              parentId: 'ch1-1',
              videoUrl: '/videos/ch1-1-k2.mp4'
            },
            {
              id: 'ch1-1-k3',
              title: '函数的基本性质',
              description: '单调性、奇偶性、周期性、有界性',
              type: 'knowledge',
              order: 3,
              isCompleted: true,
              progress: 100,
              duration: 35,
              parentId: 'ch1-1',
              videoUrl: '/videos/ch1-1-k3.mp4',
              quizzes: [
                { id: 'q1', title: '函数性质练习', type: 'quiz', questions: 8, duration: 15 }
              ]
            }
          ]
        },
        {
          id: 'ch1-2',
          title: '1.2 极限理论',
          description: '数列极限与函数极限',
          type: 'chapter',
          order: 2,
          isCompleted: true,
          progress: 100,
          duration: 180,
          parentId: 'ch1',
          children: [
            {
              id: 'ch1-2-k1',
              title: '数列极限',
              description: '数列极限的定义与性质',
              type: 'knowledge',
              order: 1,
              isCompleted: true,
              progress: 100,
              duration: 40,
              parentId: 'ch1-2',
              videoUrl: '/videos/ch1-2-k1.mp4'
            },
            {
              id: 'ch1-2-k2',
              title: '函数极限',
              description: '函数极限的ε-δ定义',
              type: 'knowledge',
              order: 2,
              isCompleted: true,
              progress: 100,
              duration: 50,
              parentId: 'ch1-2',
              videoUrl: '/videos/ch1-2-k2.mp4',
              materials: [
                { id: 'm2', name: '极限定义详解.pdf', type: 'pdf', url: '/materials/ch1-2-k2.pdf' }
              ],
              quizzes: [
                { id: 'q2', title: '极限概念测验', type: 'quiz', questions: 10, duration: 20 }
              ]
            },
            {
              id: 'ch1-2-k3',
              title: '极限运算法则',
              description: '极限的四则运算与复合运算',
              type: 'knowledge',
              order: 3,
              isCompleted: true,
              progress: 100,
              duration: 45,
              parentId: 'ch1-2',
              videoUrl: '/videos/ch1-2-k3.mp4'
            }
          ]
        },
        {
          id: 'ch1-k1',
          title: '连续性',
          description: '函数的连续性定义与性质',
          type: 'knowledge',
          order: 3,
          isCompleted: true,
          progress: 100,
          duration: 60,
          parentId: 'ch1',
          videoUrl: '/videos/ch1-k1.mp4',
          materials: [
            { id: 'm3', name: '连续性理论.pdf', type: 'pdf', url: '/materials/ch1-k1.pdf' }
          ]
        }
      ]
    },
    {
      id: 'ch2',
      title: '第2章 导数与微分',
      description: '导数的概念、计算方法与应用',
      type: 'chapter',
      order: 2,
      isCompleted: false,
      progress: 60,
      duration: 480,
      children: [
        {
          id: 'ch2-1',
          title: '2.1 导数的定义',
          description: '导数的几何意义与物理意义',
          type: 'chapter',
          order: 1,
          isCompleted: true,
          progress: 100,
          duration: 120,
          parentId: 'ch2',
          children: [
            {
              id: 'ch2-1-k1',
              title: '导数的概念',
              description: '导数的定义与几何意义',
              type: 'knowledge',
              order: 1,
              isCompleted: true,
              progress: 100,
              duration: 40,
              parentId: 'ch2-1',
              videoUrl: '/videos/ch2-1-k1.mp4'
            },
            {
              id: 'ch2-1-k2',
              title: '可导性与连续性',
              description: '可导与连续的关系',
              type: 'knowledge',
              order: 2,
              isCompleted: true,
              progress: 100,
              duration: 35,
              parentId: 'ch2-1',
              videoUrl: '/videos/ch2-1-k2.mp4'
            }
          ]
        },
        {
          id: 'ch2-2',
          title: '2.2 求导法则',
          description: '基本求导公式与求导法则',
          type: 'chapter',
          order: 2,
          isCompleted: false,
          progress: 40,
          duration: 200,
          parentId: 'ch2',
          children: [
            {
              id: 'ch2-2-k1',
              title: '基本求导公式',
              description: '常用函数的导数公式',
              type: 'knowledge',
              order: 1,
              isCompleted: true,
              progress: 100,
              duration: 45,
              parentId: 'ch2-2',
              videoUrl: '/videos/ch2-2-k1.mp4'
            },
            {
              id: 'ch2-2-k2',
              title: '复合函数求导',
              description: '链式法则的应用',
              type: 'knowledge',
              order: 2,
              isCompleted: false,
              progress: 30,
              duration: 55,
              parentId: 'ch2-2'
            },
            {
              id: 'ch2-2-k3',
              title: '隐函数求导',
              description: '隐函数的求导方法',
              type: 'knowledge',
              order: 3,
              isCompleted: false,
              progress: 0,
              duration: 50,
              parentId: 'ch2-2'
            }
          ]
        },
        {
          id: 'ch2-k1',
          title: '微分的概念',
          description: '微分的定义与几何意义',
          type: 'knowledge',
          order: 3,
          isCompleted: false,
          progress: 0,
          duration: 40,
          parentId: 'ch2',
          videoUrl: '/videos/ch2-k1.mp4'
        }
      ]
    }
  ];

  // 切换章节展开/收起
  const toggleChapter = (chapterId: string) => {
    setOpenChapters(prev => 
      prev.includes(chapterId) 
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  // 选择章节或知识点
  const handleNodeClick = (node: ChapterNode) => {
    const chapterDetail: ChapterDetail = {
      id: node.id,
      title: node.title,
      description: node.description,
      type: node.type,
      content: `这里是${node.title}的详细内容...`,
      videoUrl: node.videoUrl,
      materials: node.materials || [],
      quizzes: node.quizzes || []
    };
    setSelectedChapter(chapterDetail);
    setActiveTab("chapters");
  };

  // 获取节点类型图标
  const getNodeIcon = (type: 'chapter' | 'knowledge') => {
    switch (type) {
      case 'chapter': return <BookOpen className="w-4 h-4" />;
      case 'knowledge': return <Lightbulb className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  // 获取章节类型图标
  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'reading': return <BookOpen className="w-4 h-4" />;
      case 'assignment': return <PenTool className="w-4 h-4" />;
      case 'quiz': return <HelpCircle className="w-4 h-4" />;
      case 'discussion': return <MessageSquare className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  // 继续学习功能
  const handleContinueStudy = () => {
    // 找到第一个未完成的节点
    const findNextIncomplete = (nodes: ChapterNode[]): ChapterNode | null => {
      for (const node of nodes) {
        if (!node.isCompleted) {
          return node;
        }
        if (node.children) {
          const nextInChildren = findNextIncomplete(node.children);
          if (nextInChildren) return nextInChildren;
        }
      }
      return null;
    };
    
    const nextNode = findNextIncomplete(mockChapterTree);
    if (nextNode) {
      handleNodeClick(nextNode);
    }
  };

  // 计算章节和知识点统计
  const getChapterStats = () => {
    let totalChapters = 0;
    let totalKnowledge = 0;
    let completedChapters = 0;
    let completedKnowledge = 0;

    const countNodes = (nodes: ChapterNode[]) => {
      nodes.forEach(node => {
        if (node.type === 'chapter') {
          totalChapters++;
          if (node.isCompleted) completedChapters++;
        } else {
          totalKnowledge++;
          if (node.isCompleted) completedKnowledge++;
        }
        if (node.children) {
          countNodes(node.children);
        }
      });
    };

    countNodes(mockChapterTree);
    return { totalChapters, totalKnowledge, completedChapters, completedKnowledge };
  };

  const stats = getChapterStats();

  // 渲染章节树节点
  const renderChapterNode = (node: ChapterNode, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isOpen = openChapters.includes(node.id);
    const paddingLeft = level * 12; // 减小缩进，让层级更紧凑
    
    return (
      <div key={node.id}>
        <div 
          className={`flex items-center gap-2 p-2 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer ${
            selectedChapter?.id === node.id ? 'bg-accent' : ''
          } ${level > 0 ? 'border-l-2 border-muted ml-2' : ''}`} // 添加左边框线显示层级
          style={{ paddingLeft: `${paddingLeft + 8}px` }}
          onClick={() => handleNodeClick(node)}
        >
          {hasChildren ? (
            <Button
              variant="ghost"
              size="icon"
              className="w-4 h-4 p-0 hover:bg-accent shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                toggleChapter(node.id);
              }}
            >
              {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </Button>
          ) : (
            <div className="w-4 h-4 shrink-0" />
          )}
          
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className={`shrink-0 ${node.type === 'chapter' ? 'text-blue-600' : 'text-amber-600'}`}>
              {getNodeIcon(node.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className={`font-medium text-sm truncate ${
                  node.type === 'chapter' ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {node.title}
                </h4>
                {node.isCompleted && (
                  <CheckCircle className="w-3 h-3 text-green-600 shrink-0" />
                )}
                {!node.isCompleted && node.progress && node.progress > 0 && (
                  <div className="w-3 h-3 rounded-full border-2 border-blue-600 bg-blue-100 shrink-0">
                    <div 
                      className="w-full h-full bg-blue-600 rounded-full"
                      style={{ clipPath: `polygon(0 0, ${node.progress}% 0, ${node.progress}% 100%, 0 100%)` }}
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-muted-foreground truncate pr-2">
                  {node.description}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  {node.duration && (
                    <span className="text-xs text-muted-foreground">
                      {node.duration}分钟
                    </span>
                  )}
                  {node.progress !== undefined && (
                    <span className="text-xs font-medium">
                      {Math.round(node.progress)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {hasChildren && isOpen && (
          <div className="mt-1">
            {node.children?.map(child => renderChapterNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // 加载状态处理
  if (courseLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载课程详情中...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">课程不存在或已被删除</p>
          <Button 
            variant="outline" 
            className="mt-2" 
            onClick={() => window.history.back()}
          >
            返回 Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAssignmentStatusText = (status: string) => {
    switch (status) {
      case 'submitted': return '已提交';
      case 'pending': return '待提交';
      case 'overdue': return '已逾期';
      default: return '未知';
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
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4" />
            返回课程列表
          </Button>
          
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold">{course.name}</h2>
              <p className="text-sm text-muted-foreground">{course.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <Avatar className="w-6 h-6">
              <AvatarFallback className="text-xs">{course.teacher?.slice(0, 2) || 'T'}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{course.teacher}</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>总体进度</span>
              <span>{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{course.completedLessons}/{course.totalLessons} 课时</span>
              <span>课程进度</span>
            </div>
            <div className="pt-2 border-t">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="font-medium text-blue-600">{stats.completedChapters}/{stats.totalChapters}</div>
                  <div className="text-muted-foreground">章节</div>
                </div>
                <div className="text-center p-2 bg-amber-50 rounded">
                  <div className="font-medium text-amber-600">{stats.completedKnowledge}/{stats.totalKnowledge}</div>
                  <div className="text-muted-foreground">知识点</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chapter Tree */}
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
          <div className="space-y-1">
            {mockChapterTree.map(node => renderChapterNode(node))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Course Header */}
          <div className="relative">
            {/* Course Cover */}
            <div className="relative h-48 rounded-lg overflow-hidden mb-6 bg-gradient-to-r from-blue-600 to-purple-600">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h1 className="text-3xl font-bold mb-2">{course.name}</h1>
                <p className="text-lg opacity-90">{course.description}</p>
              </div>
              <div className="absolute top-4 right-4">
                <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2 text-white">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>4.8</span>
                  <span className="opacity-70">(45人)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-600">{course.progress}%</div>
                <p className="text-sm text-muted-foreground">学习进度</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Trophy className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">85</div>
                <p className="text-sm text-muted-foreground">平均分</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Timer className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-purple-600">48h</div>
                <p className="text-sm text-muted-foreground">学习时长</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-orange-600">5</div>
                <p className="text-sm text-muted-foreground">天后截止</p>
              </CardContent>
            </Card>
          </div>

          {/* Course Content Tabs */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">课程概览</TabsTrigger>
              <TabsTrigger value="chapters">章节内容</TabsTrigger>
              <TabsTrigger value="assignments">作业测验</TabsTrigger>
              <TabsTrigger value="announcements">课程讨论</TabsTrigger>
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
                      {announcements.slice(0, 3).map((announcement) => (
                        <div key={announcement.id} className="flex items-center gap-3 p-3 border rounded-lg">
                          <Video className="w-4 h-4 text-blue-600" />
                          <div className="flex-1">
                            <h4 className="text-sm font-medium">{announcement.title}</h4>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>课程公告</span>
                              <span>·</span>
                              <span>{formatDate(announcement.publishedAt)}</span>
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
                      {assignments.slice(0, 3).map((assignment) => (
                        <div key={assignment.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium">{assignment.title}</h4>
                            <Badge variant={assignment.status === 'submitted' ? 'default' : 'destructive'} className="text-xs">
                              {getAssignmentStatusText(assignment.status)}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                            <span>截止时间：{formatDate(assignment.dueDate)}</span>
                            <span>{assignment.score || 0}% 完成</span>
                          </div>
                          <Progress value={assignment.score || 0} className="h-1" />
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
                        <span className="font-medium">{course.completedLessons}/{course.totalLessons}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">总学习时长</span>
                        <span className="font-medium">48 小时</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">平均成绩</span>
                        <span className="font-medium">85 分</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">课程排名</span>
                        <span className="font-medium">8/45</span>
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

            <TabsContent value="chapters" className="space-y-4">
              {selectedChapter ? (
                <div className="space-y-6">
                  {/* 章节标题 */}
                  <div className="border-b pb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${
                        selectedChapter.type === 'chapter' 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-amber-100 text-amber-600'
                      }`}>
                        {getNodeIcon(selectedChapter.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-2xl font-bold">{selectedChapter.title}</h2>
                          <Badge variant={selectedChapter.type === 'chapter' ? 'default' : 'secondary'}>
                            {selectedChapter.type === 'chapter' ? '章节' : '知识点'}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">{selectedChapter.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* 视频内容 */}
                  {selectedChapter.videoUrl && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Video className="w-5 h-5" />
                          教学视频
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <Video className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                            <p className="text-gray-500">视频播放器</p>
                            <p className="text-sm text-gray-400">{selectedChapter.videoUrl}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* 课件资料 */}
                  {selectedChapter.materials && selectedChapter.materials.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          课件资料
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedChapter.materials.map((material) => (
                            <div key={material.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
                              {getSectionIcon(material.type)}
                              <div className="flex-1">
                                <h4 className="font-medium">{material.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {material.type.toUpperCase()} 文件
                                  {material.duration && ` · ${material.duration}分钟`}
                                </p>
                              </div>
                              <Button variant="outline" size="sm">
                                查看
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* 测验考试 */}
                  {selectedChapter.quizzes && selectedChapter.quizzes.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <HelpCircle className="w-5 h-5" />
                          测验考试
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedChapter.quizzes.map((quiz) => (
                            <div key={quiz.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
                              <HelpCircle className="w-4 h-4" />
                              <div className="flex-1">
                                <h4 className="font-medium">{quiz.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {quiz.questions}道题 · {quiz.duration}分钟
                                </p>
                              </div>
                              <Button variant="outline" size="sm">
                                开始
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* 章节内容 */}
                  {selectedChapter.content && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="w-5 h-5" />
                          章节内容
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {selectedChapter.content}
                          </ReactMarkdown>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="text-muted-foreground">+</div>
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <Lightbulb className="w-6 h-6 text-amber-600" />
                      </div>
                    </div>
                    <h3 className="text-lg font-medium mb-2">选择学习内容</h3>
                    <p className="text-muted-foreground mb-4">
                      从左侧选择要学习的<span className="font-medium text-blue-600">章节</span>或<span className="font-medium text-amber-600">知识点</span>
                    </p>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex items-center justify-center gap-2">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                        <span>章节：包含多个知识点或子章节</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-600" />
                        <span>知识点：具体的学习内容</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="assignments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>作业与测验</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {assignments.map((assignment) => (
                      <div key={assignment.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{assignment.title}</h4>
                          <Badge variant={assignment.status === 'submitted' ? 'default' : 'destructive'}>
                            {getAssignmentStatusText(assignment.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{assignment.description}</p>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>截止时间：{formatDate(assignment.dueDate)}</span>
                          <span>满分：{assignment.maxScore} 分</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="announcements" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>课程讨论</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {announcements.map((announcement) => (
                      <div key={announcement.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-start space-x-3">
                            {announcement.isImportant && (
                              <Star className="h-4 w-4 text-yellow-500 mt-1" />
                            )}
                            <div>
                              <h4 className="font-medium">{announcement.title}</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatDate(announcement.publishedAt)}
                              </p>
                            </div>
                          </div>
                          {!announcement.isRead && (
                            <Badge variant="secondary">未读</Badge>
                          )}
                        </div>
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {announcement.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    ))}
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
