import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  Target, 
  TrendingUp, 
  UserCircle,
  Bell, 
  Search,
  Filter,
  Grid3X3,
  List,
  ChevronRight,
  Activity,
  Award,
  BarChart3,
  Brain,
  Zap,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Timer,
  Play,
  BookMarked,
  PlusCircle,
  MoreHorizontal
} from "lucide-react";
import { Link, useRouter } from "@tanstack/react-router";
import { useNotificationStats } from "@/hooks/useQueries";
import { useAuth } from "@/hooks/useAuth";
import type { Exam, Course, ErrorQuestion } from "@/types";

const mockExams: Exam[] = [
  {
    id: "1",
    title: "高等数学期中考试",
    subject: "数学",
    date: "2025-07-12T08:00:00Z",
    duration: 120,
    status: "ongoing",
    description: "涵盖第1-6章内容"
  },
  {
    id: "2",
    title: "英语四级模拟考试",
    subject: "英语",
    date: "2025-07-22T09:00:00Z",
    duration: 150,
    status: "upcoming",
    description: "全真模拟考试环境"
  },
];

const mockCourses: Course[] = [
  {
    id: "1",
    name: "高等数学A",
    teacher: "李教授",
    progress: 75,
    description: "微积分基础与应用",
    enrolledAt: "2024-09-01T00:00:00Z",
    totalLessons: 32,
    completedLessons: 24,
  },
  {
    id: "2",
    name: "大学英语",
    teacher: "王老师",
    progress: 60,
    description: "英语听说读写综合训练",
    enrolledAt: "2024-09-01T00:00:00Z",
    totalLessons: 28,
    completedLessons: 17,
  },
];

const mockErrors: ErrorQuestion[] = [
  {
    id: "1",
    questionText: "求函数f(x)=x²+2x-3的导数",
    subject: "数学",
    correctAnswer: "f'(x)=2x+2",
    userAnswer: "f'(x)=2x",
    explanation: "对于多项式函数，每一项分别求导。常数项的导数为0，所以2x项的导数是2。",
    attemptedAt: "2025-07-18T10:30:00Z",
    difficulty: "easy",
  },
  {
    id: "2",
    questionText: "What is the past tense of 'go'?",
    subject: "英语",
    correctAnswer: "went",
    userAnswer: "goed",
    explanation: "'go'是不规则动词，其过去式是'went'，不是按规则变化的'goed'。",
    attemptedAt: "2025-07-17T15:20:00Z",
    difficulty: "medium",
  },
];

export function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "exams" | "courses" | "errors">("overview");
  const [isLoaded, setIsLoaded] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const router = useRouter();
  const { user, isLoading } = useAuth();
  
  // 获取通知统计信息
  const { data: notificationStats } = useNotificationStats();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // 如果用户未登录且不在加载中，重定向到登录页面
  useEffect(() => {
    if (!isLoading && !user) {
      try {
        router.navigate({ to: '/login' });
      } catch (error) {
        console.error('Navigation error:', error);
      }
    }
  }, [user, isLoading, router]);

  // 移除handleLogout函数，退出登录功能已移动到profile页面

  // 如果用户数据还在加载中，显示加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  // 如果用户未登录，显示空状态（将被重定向）
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">正在跳转到登录页面...</div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'text-blue-600 bg-blue-100';
      case 'ongoing': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return '即将开始';
      case 'ongoing': return '进行中';
      case 'completed': return '已完成';
      default: return '未知';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '简单';
      case 'medium': return '中等';
      case 'hard': return '困难';
      default: return '未知';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse" style={{animationDelay: '0s'}}></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-indigo-200/20 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-3/4 w-72 h-72 bg-purple-200/20 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Modern Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center group">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-blue-500 rounded-xl blur-lg opacity-30 group-hover:opacity-60 transition-opacity" />
                </div>
                <div className="ml-3">
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    川大在线考试
                  </span>
                  <div className="text-xs text-gray-500 font-medium">智能学习平台</div>
                </div>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索课程、考试或题目..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50/80 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200 text-sm"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <Link to="/notifications">
                <Button variant="ghost" size="sm" className="relative hover:bg-blue-50 transition-colors duration-200">
                  <Bell className="h-4 w-4 text-gray-600" />
                  {notificationStats?.unread && notificationStats.unread > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-medium shadow-lg">
                      {notificationStats.unread > 99 ? '99+' : notificationStats.unread}
                    </span>
                  )}
                </Button>
              </Link>

              {/* User Profile */}
              <Link to="/profile">
                <div className="flex items-center space-x-3 bg-gray-50/80 rounded-xl px-3 py-2 hover:bg-gray-100/80 transition-colors duration-200 cursor-pointer">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                    <UserCircle className="h-4 w-4 text-white" />
                  </div>
                  <div className="hidden sm:block">
                    <span className="text-sm font-medium text-gray-900">{user.username}</span>
                    <div className="text-xs text-gray-500">
                      {user.role === 'admin' ? '管理员' : user.role === 'teacher' ? '教师' : '学习者'}
                    </div>
                  </div>
                </div>
              </Link>

              {/* Admin Portal Button */}
              {(user.role === 'admin' || user.role === 'teacher') && (
                <Link to="/admin">
                  <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200">
                    管理中心
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Modern Sidebar */}
        <aside className="w-80 bg-white/80 backdrop-blur-lg border-r border-gray-200/50 shadow-lg relative z-10">
          <div className="p-6">
            {/* Welcome Section */}
            <div className="mb-8">
              <div className="relative">
                <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    欢迎回来，
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {user.username}
                    </span>
                    <Sparkles className="inline h-5 w-5 text-yellow-500 ml-2 animate-pulse" />
                  </h1>
                  <p className="text-gray-600 text-sm">
                    {new Date().toLocaleDateString('zh-CN', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100/50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{mockExams.length}</div>
                    <div className="text-xs text-blue-600/80 font-medium">即将考试</div>
                  </div>
                  <Calendar className="h-6 w-6 text-blue-500/60" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100/50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round(mockCourses.reduce((acc, course) => acc + course.progress, 0) / mockCourses.length)}%
                    </div>
                    <div className="text-xs text-green-600/80 font-medium">平均进度</div>
                  </div>
                  <TrendingUp className="h-6 w-6 text-green-500/60" />
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="space-y-2">
              {[
                { id: "overview", label: "概览", icon: BarChart3, color: "blue" },
                { id: "exams", label: "考试", icon: Timer, color: "green" },
                { id: "courses", label: "课程", icon: BookMarked, color: "purple" },
                { id: "errors", label: "错题", icon: AlertCircle, color: "red" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r from-${tab.color}-50 to-${tab.color}-100/50 border-2 border-${tab.color}-200 shadow-lg scale-[1.02]`
                      : "hover:bg-gray-50/80 hover:scale-[1.01]"
                  }`}
                >
                  <div className={`p-2 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r from-${tab.color}-500 to-${tab.color}-600 text-white shadow-md scale-110`
                      : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                  }`}>
                    <tab.icon className="h-4 w-4" />
                  </div>
                  <span className={`font-medium transition-colors duration-200 ${
                    activeTab === tab.id ? `text-${tab.color}-700` : "text-gray-700"
                  }`}>
                    {tab.label}
                  </span>
                  {activeTab === tab.id && (
                    <ChevronRight className="h-4 w-4 text-blue-500 ml-auto" />
                  )}
                </button>
              ))}
            </nav>

            {/* Quick Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200/50">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">快速操作</h3>
              <div className="space-y-2">
                <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  开始练习
                </Button>
                <Button variant="outline" className="w-full justify-start border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                  <BookOpen className="h-4 w-4 mr-2" />
                  浏览课程
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto relative z-10">
          <div className="p-8">
            {/* Content Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {activeTab === "overview" && "学习概览"}
                  {activeTab === "exams" && "考试管理"}
                  {activeTab === "courses" && "我的课程"}
                  {activeTab === "errors" && "错题分析"}
                </h2>
                <p className="text-gray-600">
                  {activeTab === "overview" && "查看您的学习进度和统计信息"}
                  {activeTab === "exams" && "管理即将到来的考试和查看历史成绩"}
                  {activeTab === "courses" && "跟踪课程进度和继续学习"}
                  {activeTab === "errors" && "复习错题，巩固薄弱知识点"}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" className="hover:bg-gray-50 transition-colors duration-200">
                  <Filter className="h-4 w-4 mr-2" />
                  筛选
                </Button>
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-md transition-colors duration-200 ${
                      viewMode === "grid" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-md transition-colors duration-200 ${
                      viewMode === "list" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Stats Grid */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Performance Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-600 mb-1">即将考试</p>
                            <p className="text-3xl font-bold text-blue-700">{mockExams.length}</p>
                            <p className="text-xs text-blue-500 mt-1">
                              最近: {formatDate(mockExams[0]?.date)}
                            </p>
                          </div>
                          <div className="p-3 bg-blue-500/10 rounded-xl">
                            <Calendar className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-green-600 mb-1">学习进度</p>
                            <p className="text-3xl font-bold text-green-700">
                              {Math.round(mockCourses.reduce((acc, course) => acc + course.progress, 0) / mockCourses.length)}%
                            </p>
                            <p className="text-xs text-green-500 mt-1">平均完成度</p>
                          </div>
                          <div className="p-3 bg-green-500/10 rounded-xl">
                            <TrendingUp className="h-6 w-6 text-green-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-0 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-purple-600 mb-1">错题数量</p>
                            <p className="text-3xl font-bold text-purple-700">{mockErrors.length}</p>
                            <p className="text-xs text-purple-500 mt-1">需要复习</p>
                          </div>
                          <div className="p-3 bg-purple-500/10 rounded-xl">
                            <Target className="h-6 w-6 text-purple-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Activity */}
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                            <Activity className="h-5 w-5 text-blue-600 mr-2" />
                            最近活动
                          </CardTitle>
                          <CardDescription>您最近的学习动态</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { action: "完成了高等数学第24课", time: "2小时前", icon: CheckCircle, color: "green" },
                          { action: "添加了2道错题到错题本", time: "1天前", icon: AlertCircle, color: "yellow" },
                          { action: "完成了英语单元测试", time: "2天前", icon: Award, color: "blue" }
                        ].map((activity, index) => (
                          <div key={index} className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50/80 transition-colors duration-200">
                            <div className={`p-2 rounded-lg bg-${activity.color}-50`}>
                              <activity.icon className={`h-4 w-4 text-${activity.color}-600`} />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                              <p className="text-xs text-gray-500">{activity.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Learning Streak */}
                  <Card className="border-0 bg-gradient-to-br from-orange-50 to-red-50 shadow-lg">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <Zap className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">学习连续天数</h3>
                        <div className="text-3xl font-bold text-orange-600 mb-1">7</div>
                        <p className="text-sm text-orange-600/80">继续保持！</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* AI Recommendations */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                        <Brain className="h-5 w-5 text-purple-600 mr-2" />
                        AI 推荐
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-l-4 border-purple-500">
                        <div className="flex items-center mb-2">
                          <Sparkles className="w-4 h-4 text-purple-600 mr-2" />
                          <span className="font-medium text-gray-900 text-sm">今日推荐</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">复习数学二次函数相关概念</p>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                          开始学习
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Upcoming Exams */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                        <Timer className="h-5 w-5 text-blue-600 mr-2" />
                        即将到来
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {mockExams.slice(0, 2).map((exam) => (
                        <div key={exam.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200/50">
                          <h4 className="font-medium text-gray-900 text-sm mb-1">{exam.title}</h4>
                          <p className="text-xs text-blue-600 mb-2">{formatDate(exam.date)}</p>
                          <Button size="sm" variant="outline" className="w-full border-blue-300 text-blue-600 hover:bg-blue-50">
                            准备考试
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Other tabs content with modern styling */}
            {activeTab === "exams" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {mockExams.map((exam) => (
                    <Card key={exam.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl font-bold text-gray-900">{exam.title}</CardTitle>
                            <CardDescription className="text-blue-600 font-medium">{exam.subject}</CardDescription>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(exam.status)}`}>
                            {getStatusText(exam.status)}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                            <Clock className="h-4 w-4 mr-3 text-blue-500" />
                            <span className="font-medium">{formatDate(exam.date)} · {exam.duration} 分钟</span>
                          </div>
                          {exam.description && (
                            <p className="text-sm text-gray-600 bg-blue-50 rounded-lg p-3">{exam.description}</p>
                          )}
                          <Button 
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                            onClick={() => {
                              try {
                                router.navigate({ 
                                  to: '/exam/$examId/prep', 
                                  params: { examId: exam.id } 
                                });
                              } catch (error) {
                                console.error('Navigation error:', error);
                              }
                            }}
                          >
                            {exam.status === 'upcoming' ? (
                              <>
                                <Play className="h-4 w-4 mr-2" />
                                准备考试
                              </>
                            ) : exam.status === 'completed' ? (
                              <>
                                <Award className="h-4 w-4 mr-2" />
                                查看成绩
                              </>
                            ) : (
                              "考试进行中"
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "courses" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {mockCourses.map((course) => (
                  <Card key={course.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl font-bold text-gray-900">{course.name}</CardTitle>
                      <CardDescription className="text-purple-600 font-medium">教师：{course.teacher}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{course.description}</p>
                        
                        <div className="bg-blue-50 rounded-lg p-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium text-gray-700">学习进度</span>
                            <span className="font-bold text-blue-600">{course.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500" 
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>已完成：{course.completedLessons} / {course.totalLessons} 课</span>
                            <span>加入时间：{new Date(course.enrolledAt).toLocaleDateString('zh-CN')}</span>
                          </div>
                        </div>

                        <Button 
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-200" 
                          onClick={() => {
                            try {
                              router.navigate({ 
                                to: '/course/$courseId', 
                                params: { courseId: course.id } 
                              });
                            } catch (error) {
                              console.error('Navigation error:', error);
                            }
                          }}
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          继续学习
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === "errors" && (
              <div className="space-y-6">
                {mockErrors.map((error) => (
                  <Card key={error.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-bold text-gray-900 mb-2">{error.questionText}</CardTitle>
                          <div className="flex items-center space-x-4">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">{error.subject}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(error.difficulty)}`}>
                              {getDifficultyText(error.difficulty)}
                            </span>
                            <span className="text-xs text-gray-500">{formatDate(error.attemptedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-sm font-medium text-red-700 mb-2">您的答案：</p>
                            <p className="text-sm text-red-600">{error.userAnswer}</p>
                          </div>
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-sm font-medium text-green-700 mb-2">正确答案：</p>
                            <p className="text-sm text-green-600">{error.correctAnswer}</p>
                          </div>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-sm font-medium text-blue-700 mb-2">解析：</p>
                          <p className="text-sm text-blue-600">{error.explanation}</p>
                        </div>
                        <div className="flex space-x-3">
                          <Button size="sm" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
                            <Play className="h-3 w-3 mr-1" />
                            重新练习
                          </Button>
                          <Button size="sm" variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            标记已掌握
                          </Button>
                          <Button size="sm" variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-50">
                            <BookMarked className="h-3 w-3 mr-1" />
                            添加笔记
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
