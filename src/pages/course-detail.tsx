import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  Trophy
} from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  useCourseDetail, 
  useCourseChapters, 
  useCourseAssignments, 
  useCourseAnnouncements, 
  useChapterProgress 
} from "@/hooks/useQueries";

interface CourseDetailPageProps {
  courseId: string;
}

export function CourseDetailPage({ courseId }: CourseDetailPageProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "chapters" | "assignments" | "announcements">("overview");
  const [openChapters, setOpenChapters] = useState<string[]>([]);
  
  // 使用 React Query hooks 获取数据
  const { data: course, isLoading: courseLoading } = useCourseDetail(courseId);
  const { data: chapters = [] } = useCourseChapters(courseId);
  const { data: assignments = [] } = useCourseAssignments(courseId);
  const { data: announcements = [] } = useCourseAnnouncements(courseId);
  const { data: chapterProgress = [] } = useChapterProgress(courseId);

  // 切换章节展开/收起
  const toggleChapter = (chapterId: string) => {
    setOpenChapters(prev => 
      prev.includes(chapterId) 
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  // 获取章节类型图标
  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'reading': return <BookOpen className="w-4 h-4" />;
      case 'assignment': return <PenTool className="w-4 h-4" />;
      case 'quiz': return <FileText className="w-4 h-4" />;
      case 'discussion': return <MessageSquare className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getSectionTypeText = (type: string) => {
    switch (type) {
      case 'video': return '视频';
      case 'reading': return '阅读';
      case 'assignment': return '作业';
      case 'quiz': return '测验';
      case 'discussion': return '讨论';
      default: return '内容';
    }
  };

  // 继续学习功能
  const handleContinueStudy = () => {
    // 找到第一个未完成的章节
    const nextChapter = chapters.find(ch => !isChapterCompleted(ch.id));
    if (nextChapter) {
      console.log('继续学习:', nextChapter.title);
      // 这里可以添加跳转逻辑
    }
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

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}小时${mins}分钟` : `${mins}分钟`;
  };

  const getAssignmentStatusText = (status: string) => {
    switch (status) {
      case 'submitted': return '已提交';
      case 'pending': return '待提交';
      case 'overdue': return '已逾期';
      default: return '未知';
    }
  };

  const isChapterCompleted = (chapterId: string) => {
    return chapterProgress.find(p => p.chapterId === chapterId)?.completed || false;
  };

  const getChapterWatchTime = (chapterId: string) => {
    return chapterProgress.find(p => p.chapterId === chapterId)?.watchTime || 0;
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
            {chapters.map((chapter) => (
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
                          {isChapterCompleted(chapter.id) && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-muted-foreground">
                            {chapter.description}
                          </span>
                          <span className="text-xs font-medium">
                            {Math.round((getChapterWatchTime(chapter.id) / chapter.duration) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="pl-6">
                  <div className="space-y-1 mt-2">
                    {chapter.materials?.map((material, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-2 p-2 rounded hover:bg-accent/30 cursor-pointer"
                      >
                        <div className="flex items-center gap-2 flex-1">
                          {getSectionIcon('reading')}
                          <span className="text-sm">{material.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {getSectionTypeText('reading')}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                        </div>
                      </div>
                    )) || (
                      <div className="text-xs text-muted-foreground p-2">
                        暂无章节内容
                      </div>
                    )}
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
              <TabsTrigger value="overview">学习概览</TabsTrigger>
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
              <Card>
                <CardHeader>
                  <CardTitle>章节进度详情</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {chapters.map((chapter) => {
                      const watchTime = getChapterWatchTime(chapter.id);
                      const progress = Math.min((watchTime / chapter.duration) * 100, 100);
                      
                      return (
                        <div key={chapter.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{chapter.title}</h4>
                            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{chapter.description}</span>
                            <span>预计 {formatDuration(chapter.duration)}</span>
                          </div>
                        </div>
                      );
                    })}
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
