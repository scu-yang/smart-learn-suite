import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Textarea } from '../../ui/textarea';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { 
  AlertTriangle,
  Search,
  Filter,
  BookOpen,
  Calendar,
  Clock,
  Target,
  CheckCircle,
  RotateCcw,
  Star,
  MessageSquare,
  Edit,
  Trash2,
  MoreVertical,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react';
import { MixedContentRenderer } from '../../common/MathRenderer';

interface ErrorQuestion {
  id: string;
  title: string;
  course: string;
  chapter: string;
  questionType: 'choice' | 'fill' | 'calculation' | 'proof';
  difficulty: 'easy' | 'medium' | 'hard';
  originalQuestion: string;
  correctAnswer: string;
  myAnswer: string;
  explanation: string;
  errorType: '计算错误' | '概念理解' | '方法选择' | '审题不清' | '其他';
  addedDate: string;
  reviewedTimes: number;
  masteryLevel: 'not-started' | 'practicing' | 'understanding' | 'mastered';
  tags: string[];
  notes: string;
  relatedQuestions: string[];
}

const mockErrorQuestions: ErrorQuestion[] = [
  {
    id: 'eq1',
    title: '求函数极限',
    course: '高等数学A',
    chapter: '第1章 函数与极限',
    questionType: 'calculation',
    difficulty: 'medium',
    originalQuestion: '求 $\\lim_{x \\to 0} \\frac{\\sin x}{x}$',
    correctAnswer: '$1$',
    myAnswer: '$0$',
    explanation: '这是一个重要极限，$\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$。可以使用洛必达法则或者泰勒展开来证明：当 $x \\to 0$ 时，$\\sin x \\approx x$，所以比值趋向于 $1$。',
    errorType: '概念理解',
    addedDate: '2025-01-18',
    reviewedTimes: 3,
    masteryLevel: 'understanding',
    tags: ['极限', '重要极限', '洛必达法则'],
    notes: '记住这是第一个重要极限，需要熟记',
    relatedQuestions: ['eq2', 'eq3']
  },
  {
    id: 'eq2',
    title: '导数计算',
    course: '高等数学A',
    chapter: '第2章 导数与微分',
    questionType: 'calculation',
    difficulty: 'easy',
    originalQuestion: '求函数 $f(x) = x^2 \\sin(x)$ 的导数',
    correctAnswer: "$f'(x) = 2x \\cdot \\sin(x) + x^2 \\cdot \\cos(x)$",
    myAnswer: "$f'(x) = 2x \\cdot \\sin(x)$",
    explanation: "这是乘积的求导，需要使用乘积法则：$(uv)' = u'v + uv'$。设 $u = x^2$，$v = \\sin(x)$，则 $u' = 2x$，$v' = \\cos(x)$，所以 $(x^2 \\sin x)' = 2x \\sin x + x^2 \\cos x$。",
    errorType: '方法选择',
    addedDate: '2025-01-19',
    reviewedTimes: 2,
    masteryLevel: 'practicing',
    tags: ['导数', '乘积法则'],
    notes: '乘积法则容易忘记第二项',
    relatedQuestions: []
  },
  {
    id: 'eq3',
    title: '矩阵乘法',
    course: '线性代数',
    chapter: '第1章 矩阵',
    questionType: 'calculation',
    difficulty: 'easy',
    originalQuestion: '计算矩阵 $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$ 与 $B = \\begin{pmatrix} 2 & 1 \\\\ 1 & 3 \\end{pmatrix}$ 的乘积',
    correctAnswer: '$AB = \\begin{pmatrix} 4 & 7 \\\\ 10 & 15 \\end{pmatrix}$',
    myAnswer: '$AB = \\begin{pmatrix} 4 & 6 \\\\ 10 & 12 \\end{pmatrix}$',
    explanation: '矩阵乘法的规则是第一个矩阵的行与第二个矩阵的列相乘求和：\n\n第1行第1列：$1 \\times 2 + 2 \\times 1 = 4$\n第1行第2列：$1 \\times 1 + 2 \\times 3 = 7$\n第2行第1列：$3 \\times 2 + 4 \\times 1 = 10$\n第2行第2列：$3 \\times 1 + 4 \\times 3 = 15$',
    errorType: '计算错误',
    addedDate: '2025-01-20',
    reviewedTimes: 1,
    masteryLevel: 'practicing',
    tags: ['矩阵', '矩阵乘法'],
    notes: '计算时要仔细，避免算错',
    relatedQuestions: []
  },
  {
    id: 'eq4',
    title: '概率计算',
    course: '概率论与数理统计',
    chapter: '第2章 随机变量',
    questionType: 'calculation',
    difficulty: 'hard',
    originalQuestion: '设 $X \\sim N(0,1)$，求 $P(-1 < X < 1)$',
    correctAnswer: '$P(-1 < X < 1) \\approx 0.6826$',
    myAnswer: '$P(-1 < X < 1) = 0.5$',
    explanation: '这是标准正态分布的概率计算。根据标准正态分布表：\n\n$P(-1 < X < 1) = \\Phi(1) - \\Phi(-1) \\approx 0.8413 - 0.1587 = 0.6826$\n\n其中 $\\Phi(x)$ 是标准正态分布的累积分布函数。这个结果也符合"68-95-99.7规则"，即约68%的数据落在均值的一个标准差范围内。',
    errorType: '概念理解',
    addedDate: '2025-01-21',
    reviewedTimes: 0,
    masteryLevel: 'not-started',
    tags: ['正态分布', '概率计算'],
    notes: '需要查标准正态分布表',
    relatedQuestions: []
  }
];

export function ErrorBook() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCourse, setFilterCourse] = useState<string>('all');
  const [filterMastery, setFilterMastery] = useState<string>('all');
  const [selectedQuestion, setSelectedQuestion] = useState<ErrorQuestion | null>(null);
  const [showReviewMode, setShowReviewMode] = useState(false);

  const courses = Array.from(new Set(mockErrorQuestions.map(q => q.course)));
  
  const filteredQuestions = mockErrorQuestions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         question.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCourse = filterCourse === 'all' || question.course === filterCourse;
    const matchesMastery = filterMastery === 'all' || question.masteryLevel === filterMastery;
    return matchesSearch && matchesCourse && matchesMastery;
  });

  const getDifficultyColor = (difficulty: ErrorQuestion['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'text-chart-1';
      case 'medium': return 'text-chart-3';
      case 'hard': return 'text-destructive';
    }
  };

  const getDifficultyText = (difficulty: ErrorQuestion['difficulty']) => {
    switch (difficulty) {
      case 'easy': return '简单';
      case 'medium': return '中等';
      case 'hard': return '困难';
    }
  };

  const getMasteryIcon = (level: ErrorQuestion['masteryLevel']) => {
    switch (level) {
      case 'not-started': return <AlertTriangle className="w-4 h-4 text-chart-4" />;
      case 'practicing': return <RotateCcw className="w-4 h-4 text-chart-3" />;
      case 'understanding': return <Eye className="w-4 h-4 text-chart-2" />;
      case 'mastered': return <CheckCircle className="w-4 h-4 text-chart-1" />;
    }
  };

  const getMasteryText = (level: ErrorQuestion['masteryLevel']) => {
    switch (level) {
      case 'not-started': return '未开始';
      case 'practicing': return '练习中';
      case 'understanding': return '理解中';
      case 'mastered': return '已掌握';
    }
  };

  const getMasteryColor = (level: ErrorQuestion['masteryLevel']) => {
    switch (level) {
      case 'not-started': return 'secondary';
      case 'practicing': return 'outline';
      case 'understanding': return 'default';
      case 'mastered': return 'outline';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1>错题本</h1>
          <p className="text-muted-foreground">整理错题，强化薄弱知识点</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => setShowReviewMode(!showReviewMode)}>
            <Target className="w-4 h-4" />
            {showReviewMode ? '退出复习' : '开始复习'}
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            导出错题
          </Button>
          <Button className="gap-2">
            <BookOpen className="w-4 h-4" />
            添加错题
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-4">
              {mockErrorQuestions.filter(q => q.masteryLevel === 'not-started').length}
            </div>
            <p className="text-sm text-muted-foreground">未开始</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-3">
              {mockErrorQuestions.filter(q => q.masteryLevel === 'practicing').length}
            </div>
            <p className="text-sm text-muted-foreground">练习中</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-2">
              {mockErrorQuestions.filter(q => q.masteryLevel === 'understanding').length}
            </div>
            <p className="text-sm text-muted-foreground">理解中</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-1">
              {mockErrorQuestions.filter(q => q.masteryLevel === 'mastered').length}
            </div>
            <p className="text-sm text-muted-foreground">已掌握</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Error Questions List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                错题列表
              </CardTitle>
              <CardDescription>点击错题查看详情</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search and Filters */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索错题..."
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
                        {filterCourse === 'all' ? '全部课程' : filterCourse}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-full">
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

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full gap-2">
                        <Target className="w-4 h-4" />
                        {filterMastery === 'all' ? '全部状态' : getMasteryText(filterMastery as ErrorQuestion['masteryLevel'])}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-full">
                      <DropdownMenuItem onClick={() => setFilterMastery('all')}>
                        全部状态
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterMastery('not-started')}>
                        未开始
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterMastery('practicing')}>
                        练习中
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterMastery('understanding')}>
                        理解中
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterMastery('mastered')}>
                        已掌握
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Questions List */}
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
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-1">{question.title}</h4>
                          <p className="text-xs text-muted-foreground">{question.course} · {question.chapter}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {getMasteryIcon(question.masteryLevel)}
                          <span className={`text-xs ${getDifficultyColor(question.difficulty)}`}>
                            {getDifficultyText(question.difficulty)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {question.errorType}
                        </Badge>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <RotateCcw className="w-3 h-3" />
                            <span>{question.reviewedTimes}</span>
                          </div>
                          <span>{new Date(question.addedDate).toLocaleDateString('zh-CN')}</span>
                        </div>
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

        {/* Error Question Detail */}
        <div className="lg:col-span-2">
          {selectedQuestion ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {getMasteryIcon(selectedQuestion.masteryLevel)}
                      {selectedQuestion.title}
                    </CardTitle>
                    <CardDescription>
                      {selectedQuestion.course} · {selectedQuestion.chapter}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={getMasteryColor(selectedQuestion.masteryLevel)}>
                      {getMasteryText(selectedQuestion.masteryLevel)}
                    </Badge>
                    <Badge variant="outline" className={getDifficultyColor(selectedQuestion.difficulty)}>
                      {getDifficultyText(selectedQuestion.difficulty)}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-8 h-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          编辑错题
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Star className="w-4 h-4 mr-2" />
                          标为重点
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          重新练习
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          删除错题
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="question" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="question">题目详情</TabsTrigger>
                    <TabsTrigger value="analysis">错误分析</TabsTrigger>
                    <TabsTrigger value="notes">学习笔记</TabsTrigger>
                  </TabsList>

                  <TabsContent value="question" className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">原题</h4>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="text-sm">
                          <MixedContentRenderer content={selectedQuestion.originalQuestion} />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2 text-destructive">我的答案</h4>
                        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                          <div className="text-sm">
                            <MixedContentRenderer content={selectedQuestion.myAnswer} />
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 text-chart-1">正确答案</h4>
                        <div className="p-3 bg-chart-1/10 border border-chart-1/20 rounded-lg">
                          <div className="text-sm">
                            <MixedContentRenderer content={selectedQuestion.correctAnswer} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">解题思路</h4>
                      <div className="p-3 bg-chart-2/10 border border-chart-2/20 rounded-lg">
                        <div className="text-sm">
                          <MixedContentRenderer content={selectedQuestion.explanation} />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>添加时间：{new Date(selectedQuestion.addedDate).toLocaleDateString('zh-CN')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <RotateCcw className="w-3 h-3" />
                        <span>复习次数：{selectedQuestion.reviewedTimes}</span>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="analysis" className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">错误类型</h4>
                      <Badge variant="outline" className="text-sm">
                        {selectedQuestion.errorType}
                      </Badge>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">相关标签</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedQuestion.tags.map(tag => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">掌握程度</h4>
                      <div className="flex items-center gap-2">
                        {getMasteryIcon(selectedQuestion.masteryLevel)}
                        <span>{getMasteryText(selectedQuestion.masteryLevel)}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">更新掌握状态</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {(['not-started', 'practicing', 'understanding', 'mastered'] as const).map(level => (
                          <Button
                            key={level}
                            variant={selectedQuestion.masteryLevel === level ? "default" : "outline"}
                            size="sm"
                            className="gap-2"
                          >
                            {getMasteryIcon(level)}
                            {getMasteryText(level)}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="notes" className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">学习笔记</h4>
                      <Textarea
                        placeholder="记录学习心得、解题技巧等..."
                        value={selectedQuestion.notes}
                        className="min-h-32"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm">
                        保存笔记
                      </Button>
                      <Button variant="outline" size="sm">
                        清空
                      </Button>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">相关题目</h4>
                      <div className="space-y-2">
                        {selectedQuestion.relatedQuestions.length > 0 ? 
                          selectedQuestion.relatedQuestions.map(relatedId => (
                            <div key={relatedId} className="p-2 border rounded text-sm">
                              相关题目 #{relatedId}
                            </div>
                          )) :
                          <p className="text-sm text-muted-foreground">暂无相关题目</p>
                        }
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">选择错题查看详情</h3>
                <p className="text-muted-foreground">
                  从左侧列表中选择一道错题查看详细信息和解析
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}