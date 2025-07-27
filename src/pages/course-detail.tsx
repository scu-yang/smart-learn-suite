import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  User, 
  CheckCircle, 
  Circle, 
  FileText, 
  MessageSquare, 
  ArrowLeft,
  Download,
  Star,
  Play
} from "lucide-react";
import { Link } from "@tanstack/react-router";
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
  
  // 使用 React Query hooks 获取数据
  const { data: course, isLoading: courseLoading } = useCourseDetail(courseId);
  const { data: chapters = [] } = useCourseChapters(courseId);
  const { data: assignments = [] } = useCourseAssignments(courseId);
  const { data: announcements = [] } = useCourseAnnouncements(courseId);
  const { data: chapterProgress = [] } = useChapterProgress(courseId);

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
          <Link to="/dashboard" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
            返回 Dashboard
          </Link>
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

  const getAssignmentStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link to="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5 mr-2" />
              返回主页
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.name}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {course.teacher}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {course.semester}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {course.schedule}
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  {course.classroom}
                </div>
              </div>
              <p className="text-gray-700 mb-4">{course.description}</p>
            </div>
            
            <div className="lg:ml-8 lg:flex-shrink-0">
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">{course.progress}%</div>
                  <div className="text-sm text-gray-600 mb-3">学习进度</div>
                  <div className="w-32 bg-gray-200 rounded-full h-2 mb-3">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {course.completedLessons} / {course.totalLessons} 课时
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-2 text-sm font-medium border-b-2 ${
                activeTab === "overview"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              课程概览
            </button>
            <button
              onClick={() => setActiveTab("chapters")}
              className={`pb-2 text-sm font-medium border-b-2 ${
                activeTab === "chapters"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              章节内容
            </button>
            <button
              onClick={() => setActiveTab("assignments")}
              className={`pb-2 text-sm font-medium border-b-2 ${
                activeTab === "assignments"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              作业管理
            </button>
            <button
              onClick={() => setActiveTab("announcements")}
              className={`pb-2 text-sm font-medium border-b-2 ${
                activeTab === "announcements"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              课程公告
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Course Info */}
              <Card>
                <CardHeader>
                  <CardTitle>课程信息</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">学分：</span>
                      <span className="text-gray-600">{course.credits} 学分</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">上课时间：</span>
                      <span className="text-gray-600">{course.schedule}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">上课地点：</span>
                      <span className="text-gray-600">{course.classroom}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">加入时间：</span>
                      <span className="text-gray-600">{formatDate(course.enrolledAt)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Syllabus */}
              <Card>
                <CardHeader>
                  <CardTitle>课程大纲</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm leading-relaxed">{course.syllabus}</p>
                </CardContent>
              </Card>

              {/* Recent Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>最近学习进度</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {chapters.slice(0, 3).map((chapter) => {
                      const completed = isChapterCompleted(chapter.id);
                      const watchTime = getChapterWatchTime(chapter.id);
                      const progress = Math.min((watchTime / chapter.duration) * 100, 100);
                      
                      return (
                        <div key={chapter.id} className="flex items-center space-x-4">
                          {completed ? (
                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{chapter.title}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                <div 
                                  className={`h-1.5 rounded-full ${completed ? 'bg-green-600' : 'bg-blue-600'}`} 
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500">
                                {Math.round(progress)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>快速操作</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    继续学习
                  </Button>
                  <Button variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    查看作业
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    课程讨论
                  </Button>
                </CardContent>
              </Card>

              {/* Course Resources */}
              <Card>
                <CardHeader>
                  <CardTitle>课程资料</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {course.resources.map((resource, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{resource.name}</span>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Announcements */}
              <Card>
                <CardHeader>
                  <CardTitle>最新公告</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {announcements.slice(0, 2).map((announcement) => (
                      <div key={announcement.id} className="text-sm">
                        <div className="flex items-start space-x-2">
                          {announcement.isImportant && (
                            <Star className="h-3 w-3 text-yellow-500 mt-1 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className={`font-medium ${announcement.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                              {announcement.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(announcement.publishedAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "chapters" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">章节内容</h2>
              <div className="text-sm text-gray-600">
                总计 {chapters.length} 个章节 · {chapterProgress.filter(p => p.completed).length} 个已完成
              </div>
            </div>
            
            <div className="space-y-4">
              {chapters.map((chapter) => {
                const completed = isChapterCompleted(chapter.id);
                const watchTime = getChapterWatchTime(chapter.id);
                const progress = Math.min((watchTime / chapter.duration) * 100, 100);
                
                return (
                  <Card key={chapter.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          {completed ? (
                            <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                          ) : (
                            <Circle className="h-6 w-6 text-gray-400 mt-1" />
                          )}
                          <div>
                            <CardTitle className="text-lg">{chapter.title}</CardTitle>
                            <CardDescription className="mt-1">{chapter.description}</CardDescription>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                              <span>时长：{formatDuration(chapter.duration)}</span>
                              <span>已观看：{formatDuration(watchTime)}</span>
                              <span>进度：{Math.round(progress)}%</span>
                            </div>
                          </div>
                        </div>
                        <Button>
                          {completed ? "重新学习" : "开始学习"}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm text-gray-700">{chapter.content}</p>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${completed ? 'bg-green-600' : 'bg-blue-600'}`} 
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>

                        {chapter.materials && chapter.materials.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">课件资料：</p>
                            <div className="flex flex-wrap gap-2">
                              {chapter.materials.map((material, index) => (
                                <Button key={index} size="sm" variant="outline">
                                  <FileText className="h-3 w-3 mr-1" />
                                  {material.name}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "assignments" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">作业管理</h2>
              <div className="text-sm text-gray-600">
                总计 {assignments.length} 个作业 · {assignments.filter(a => a.status === 'submitted').length} 个已提交
              </div>
            </div>
            
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <Card key={assignment.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{assignment.title}</CardTitle>
                        <CardDescription className="mt-1">{assignment.description}</CardDescription>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          <span>截止时间：{formatDate(assignment.dueDate)}</span>
                          <span>满分：{assignment.maxScore} 分</span>
                          {assignment.score && (
                            <span>得分：{assignment.score} 分</span>
                          )}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAssignmentStatusColor(assignment.status)}`}>
                        {getAssignmentStatusText(assignment.status)}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {assignment.attachments && assignment.attachments.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">作业附件：</p>
                          <div className="flex flex-wrap gap-2">
                            {assignment.attachments.map((attachment, index) => (
                              <Button key={index} size="sm" variant="outline">
                                <FileText className="h-3 w-3 mr-1" />
                                {attachment.name}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      {assignment.status === 'submitted' && assignment.feedback && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-blue-900 mb-2">教师反馈：</p>
                          <p className="text-sm text-blue-800">{assignment.feedback}</p>
                          {assignment.submittedAt && (
                            <p className="text-xs text-blue-600 mt-2">
                              提交时间：{formatDate(assignment.submittedAt)}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="flex space-x-2">
                        {assignment.status === 'pending' ? (
                          <Button>提交作业</Button>
                        ) : (
                          <Button variant="outline">查看详情</Button>
                        )}
                        <Button variant="outline">下载附件</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "announcements" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">课程公告</h2>
              <div className="text-sm text-gray-600">
                总计 {announcements.length} 条公告 · {announcements.filter(a => !a.isRead).length} 条未读
              </div>
            </div>
            
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <Card key={announcement.id} className={announcement.isRead ? '' : 'border-blue-200 bg-blue-50'}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-3">
                        {announcement.isImportant && (
                          <Star className="h-5 w-5 text-yellow-500 mt-1" />
                        )}
                        <div>
                          <CardTitle className={`text-lg ${announcement.isRead ? 'text-gray-900' : 'text-blue-900'}`}>
                            {announcement.title}
                          </CardTitle>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                            <span>发布时间：{formatDate(announcement.publishedAt)}</span>
                            {announcement.isImportant && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                重要
                              </span>
                            )}
                            {!announcement.isRead && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                未读
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-slate max-w-none prose-sm">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({children}) => <h1 className="text-lg font-bold text-gray-900 mb-3">{children}</h1>,
                          h2: ({children}) => <h2 className="text-base font-semibold text-gray-800 mb-2 mt-4">{children}</h2>,
                          h3: ({children}) => <h3 className="text-sm font-medium text-gray-700 mb-2 mt-3">{children}</h3>,
                          p: ({children}) => <p className="text-sm text-gray-700 mb-2 leading-relaxed">{children}</p>,
                          ul: ({children}) => <ul className="list-disc list-inside mb-2 space-y-1 text-sm text-gray-700">{children}</ul>,
                          ol: ({children}) => <ol className="list-decimal list-inside mb-2 space-y-1 text-sm text-gray-700">{children}</ol>,
                          li: ({children}) => <li className="text-sm">{children}</li>,
                          strong: ({children}) => <strong className="font-semibold text-gray-900">{children}</strong>,
                          blockquote: ({children}) => (
                            <blockquote className="border-l-3 border-blue-200 pl-3 py-1 mb-2 bg-blue-50 text-sm text-gray-700 italic">
                              {children}
                            </blockquote>
                          ),
                          code: ({children}) => (
                            <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-xs font-mono">
                              {children}
                            </code>
                          ),
                          hr: () => <hr className="border-gray-300 my-3" />,
                          input: (props) => {
                            if (props.type === 'checkbox') {
                              return (
                                <input 
                                  type="checkbox" 
                                  checked={props.checked || false}
                                  disabled
                                  className="mr-1 accent-blue-600"
                                />
                              );
                            }
                            return <input {...props} />;
                          }
                        }}
                      >
                        {announcement.content}
                      </ReactMarkdown>
                    </div>
                    {!announcement.isRead && (
                      <div className="mt-4">
                        <Button size="sm">标记为已读</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
