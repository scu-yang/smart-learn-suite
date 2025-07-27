import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Textarea } from '../../ui/textarea';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { 
  MessageSquare,
  Search,
  Filter,
  Plus,
  ThumbsUp,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  BookOpen,
  User,
  MoreVertical,
  Pin,
  Flag,
  Edit,
  Trash2,
  Send,
  Heart,
  Star,
  TrendingUp
} from 'lucide-react';

interface Question {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    role: 'student' | 'teacher' | 'ta';
    avatar?: string;
  };
  course: string;
  chapter: string;
  createdAt: string;
  status: 'open' | 'answered' | 'closed';
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  likes: number;
  replies: number;
  views: number;
  isPinned?: boolean;
  isFavorited?: boolean;
  lastReply?: string;
}

interface Reply {
  id: string;
  content: string;
  author: {
    name: string;
    role: 'student' | 'teacher' | 'ta';
    avatar?: string;
  };
  createdAt: string;
  likes: number;
  isAnswer?: boolean;
}

const mockQuestions: Question[] = [
  {
    id: 'q1',
    title: '关于极限定义的理解问题',
    content: '老师您好，我在学习极限的ε-δ定义时遇到了困难。能否详细解释一下这个定义的几何意义？特别是为什么要用ε和δ这两个参数？',
    author: {
      name: '张三',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
    },
    course: '高等数学A',
    chapter: '第1章 函数与极限',
    createdAt: '2025-01-20 14:30',
    status: 'answered',
    priority: 'medium',
    tags: ['极限', '定义', '几何意义'],
    likes: 5,
    replies: 2,
    views: 23,
    isPinned: true,
    isFavorited: true,
    lastReply: '2025-01-20 15:45'
  },
  {
    id: 'q2',
    title: '积分计算中的分部积分法',
    content: '在计算∫x²e^x dx时，我尝试使用分部积分法，但不知道该如何选择u和dv。请问有什么选择的技巧吗？',
    author: {
      name: '李四',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5b5?w=32&h=32&fit=crop&crop=face'
    },
    course: '高等数学A',
    chapter: '第4章 积分学',
    createdAt: '2025-01-20 10:15',
    status: 'answered',
    priority: 'low',
    tags: ['积分', '分部积分', '计算技巧'],
    likes: 8,
    replies: 3,
    views: 45,
    lastReply: '2025-01-20 11:30'
  },
  {
    id: 'q3',
    title: '矩阵特征值的计算方法',
    content: '请问老师，对于3×3矩阵，除了解特征方程外，还有其他更简便的求特征值的方法吗？',
    author: {
      name: '王五',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
    },
    course: '线性代数',
    chapter: '第6章 特征值',
    createdAt: '2025-01-19 16:20',
    status: 'open',
    priority: 'high',
    tags: ['矩阵', '特征值', '计算方法'],
    likes: 12,
    replies: 1,
    views: 67,
    lastReply: '2025-01-20 09:15'
  }
];

const mockReplies: Reply[] = [
  {
    id: 'r1',
    content: '关于极限的ε-δ定义，我们可以从几何角度来理解。ε表示函数值的精度要求，δ表示自变量的精度要求。当我们说函数在某点的极限存在时，实际上是说...',
    author: {
      name: '张教授',
      role: 'teacher',
      avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=32&h=32&fit=crop&crop=face'
    },
    createdAt: '2025-01-20 15:45',
    likes: 8,
    isAnswer: true
  },
  {
    id: 'r2',
    content: '补充一下，可以画个图来直观理解这个定义。在坐标系中，ε对应y轴上的区间，δ对应x轴上的区间...',
    author: {
      name: '李助教',
      role: 'ta',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
    },
    createdAt: '2025-01-20 16:10',
    likes: 3
  }
];

export function QAForum() {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | Question['status']>('all');
  const [filterCourse, setFilterCourse] = useState<string>('all');
  const [replyContent, setReplyContent] = useState('');
  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionContent, setNewQuestionContent] = useState('');
  const [showNewQuestion, setShowNewQuestion] = useState(false);

  const courses = Array.from(new Set(mockQuestions.map(q => q.course)));
  
  const filteredQuestions = mockQuestions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         question.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         question.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || question.status === filterStatus;
    const matchesCourse = filterCourse === 'all' || question.course === filterCourse;
    return matchesSearch && matchesStatus && matchesCourse;
  });

  const getStatusIcon = (status: Question['status']) => {
    switch (status) {
      case 'open': return <AlertCircle className="w-4 h-4 text-chart-4" />;
      case 'answered': return <CheckCircle className="w-4 h-4 text-chart-1" />;
      case 'closed': return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: Question['status']) => {
    switch (status) {
      case 'open': return '待解答';
      case 'answered': return '已解答';
      case 'closed': return '已关闭';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'teacher': return 'text-chart-1';
      case 'ta': return 'text-chart-2';
      case 'student': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'teacher': return '教师';
      case 'ta': return '助教';
      case 'student': return '学生';
      default: return '用户';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1>学习讨论</h1>
          <p className="text-muted-foreground">在线答疑和学习交流平台</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            热门话题
          </Button>
          <Button className="gap-2" onClick={() => setShowNewQuestion(true)}>
            <Plus className="w-4 h-4" />
            提问
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-4">
              {mockQuestions.filter(q => q.status === 'open').length}
            </div>
            <p className="text-sm text-muted-foreground">待解答</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-1">
              {mockQuestions.filter(q => q.status === 'answered').length}
            </div>
            <p className="text-sm text-muted-foreground">已解答</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-2">
              {mockQuestions.reduce((sum, q) => sum + q.replies, 0)}
            </div>
            <p className="text-sm text-muted-foreground">总回复数</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-3">
              {mockQuestions.filter(q => q.isFavorited).length}
            </div>
            <p className="text-sm text-muted-foreground">我的收藏</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Questions List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                讨论列表
              </CardTitle>
              <CardDescription>选择问题查看详情</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search and Filters */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索问题..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full gap-2">
                        <Filter className="w-4 h-4" />
                        {filterStatus === 'all' ? '全部状态' : getStatusText(filterStatus)}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                        全部状态
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus('open')}>
                        待解答
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus('answered')}>
                        已解答
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus('closed')}>
                        已关闭
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full gap-2">
                        <BookOpen className="w-4 h-4" />
                        {filterCourse === 'all' ? '全部课程' : filterCourse}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setFilterCourse('all')}>
                        全部课程
                      </DropdownMenuItem>
                      {courses.map(course => (
                        <DropdownMenuItem key={course} onClick={() => setFilterCourse(course)}>
                          {course}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredQuestions.map((question) => (
                  <div
                    key={question.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                      selectedQuestion?.id === question.id ? 'ring-2 ring-primary bg-accent/50' : ''
                    }`}
                    onClick={() => setSelectedQuestion(question)}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        {question.isPinned && (
                          <Pin className="w-3 h-3 text-chart-4 mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2">{question.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            {getStatusIcon(question.status)}
                            <Badge variant="outline" className="text-xs">
                              {getStatusText(question.status)}
                            </Badge>
                            {question.isFavorited && (
                              <Heart className="w-3 h-3 text-destructive fill-current" />
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{question.author.name}</span>
                        </div>
                        <span>{new Date(question.createdAt).toLocaleDateString('zh-CN')}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <div className="flex gap-3">
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="w-3 h-3" />
                            {question.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            {question.replies}
                          </span>
                          <span>{question.views} 浏览</span>
                        </div>
                        <span className="text-muted-foreground">{question.course}</span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {question.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Question Detail */}
        <div className="lg:col-span-2">
          {showNewQuestion ? (
            <Card>
              <CardHeader>
                <CardTitle>提问</CardTitle>
                <CardDescription>描述你的问题，获得帮助</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">问题标题</label>
                  <Input
                    placeholder="请简洁地描述你的问题..."
                    value={newQuestionTitle}
                    onChange={(e) => setNewQuestionTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">问题详情</label>
                  <Textarea
                    placeholder="详细描述你遇到的问题，包括相关背景、尝试过的方法等..."
                    value={newQuestionContent}
                    onChange={(e) => setNewQuestionContent(e.target.value)}
                    className="min-h-32"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">相关课程</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          选择课程
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        {courses.map(course => (
                          <DropdownMenuItem key={course}>
                            {course}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">问题标签</label>
                    <Input placeholder="添加相关标签，用空格分隔" />
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setShowNewQuestion(false)}>
                    取消
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      保存草稿
                    </Button>
                    <Button className="gap-2">
                      <Send className="w-4 h-4" />
                      发布问题
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : selectedQuestion ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {selectedQuestion.isPinned && (
                        <Pin className="w-4 h-4 text-chart-4" />
                      )}
                      <CardTitle className="text-base">{selectedQuestion.title}</CardTitle>
                      {getStatusIcon(selectedQuestion.status)}
                      <Badge variant={selectedQuestion.status === 'answered' ? 'default' : 'secondary'} className="text-xs">
                        {getStatusText(selectedQuestion.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Avatar className="w-5 h-5">
                          <AvatarImage src={selectedQuestion.author.avatar} />
                          <AvatarFallback className="text-xs">
                            {selectedQuestion.author.name.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span className={getRoleColor(selectedQuestion.author.role)}>
                          {selectedQuestion.author.name} ({getRoleText(selectedQuestion.author.role)})
                        </span>
                      </div>
                      <span>{selectedQuestion.course}</span>
                      <span>{selectedQuestion.chapter}</span>
                      <span>{new Date(selectedQuestion.createdAt).toLocaleString('zh-CN')}</span>
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
                        <Star className="w-4 h-4 mr-2" />
                        收藏问题
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Flag className="w-4 h-4 mr-2" />
                        举报问题
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Question Content */}
                <div className="prose prose-sm max-w-none">
                  <p>{selectedQuestion.content}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {selectedQuestion.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Question Stats */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground border-t pt-4">
                  <button className="flex items-center gap-1 hover:text-chart-1 transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{selectedQuestion.likes}</span>
                  </button>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {selectedQuestion.replies} 回复
                  </span>
                  <span>{selectedQuestion.views} 浏览</span>
                </div>

                {/* Replies */}
                <div className="space-y-4">
                  <h4 className="font-medium">回复 ({mockReplies.length})</h4>
                  
                  {mockReplies.map((reply) => (
                    <div key={reply.id} className={`p-4 rounded-lg border ${reply.isAnswer ? 'border-chart-1 bg-chart-1/5' : ''}`}>
                      <div className="flex items-start gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={reply.author.avatar} />
                          <AvatarFallback className="text-xs">
                            {reply.author.name.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${getRoleColor(reply.author.role)}`}>
                              {reply.author.name}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {getRoleText(reply.author.role)}
                            </Badge>
                            {reply.isAnswer && (
                              <Badge variant="default" className="text-xs">
                                最佳答案
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {new Date(reply.createdAt).toLocaleString('zh-CN')}
                            </span>
                          </div>
                          
                          <div className="prose prose-sm max-w-none">
                            <p>{reply.content}</p>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-chart-1 transition-colors">
                              <ThumbsUp className="w-4 h-4" />
                              <span>{reply.likes}</span>
                            </button>
                            <Button variant="ghost" size="sm" className="text-xs">
                              回复
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Form */}
                <div className="space-y-3 border-t pt-4">
                  <h4 className="font-medium">参与讨论</h4>
                  <Textarea
                    placeholder="输入您的回复内容..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="min-h-24"
                  />
                  <div className="flex justify-between">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        插入公式
                      </Button>
                      <Button variant="outline" size="sm">
                        插入图片
                      </Button>
                    </div>
                    <Button size="sm" className="gap-2">
                      <Send className="w-4 h-4" />
                      发布回复
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">选择问题查看详情</h3>
                <p className="text-muted-foreground">
                  从左侧列表中选择一个问题查看详情并参与讨论
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}