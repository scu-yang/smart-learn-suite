import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Textarea } from '../../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { Separator } from '../../ui/separator';
import { Progress } from '../../ui/progress';
import { 
  Upload,
  Search,
  Filter,
  Plus,
  Edit,
  Copy,
  Trash2,
  Eye,
  Download,
  RefreshCw,
  FileText,
  Image,
  Calculator,
  Brain,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Clock,
  BookOpen,
  Tags,
  TrendingUp,
  BarChart3,
  File,
  X,
  Zap,
  Scan,
  Settings,
  Archive
} from 'lucide-react';
import { OCRReviewPage } from './OCRReviewPage';
import { MixedContentRenderer } from '../../common/MathRenderer';
import CourseSelector from '../../common/CourseSelector';

interface Question {
  id: string;
  title: string;
  content: string;
  type: 'multiple-choice' | 'fill-blank' | 'calculation' | 'proof' | 'subjective';
  difficulty: 'easy' | 'medium' | 'hard';
  knowledgePoints: string[];
  courseId: string;
  answer?: string; // 只有填空题才有标准答案
  explanation: string;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  accuracyRate: number;
  aiDifficulty: number;
  manualDifficulty?: number;
  status: 'draft' | 'reviewed' | 'published';
  source: string;
  estimatedTime: number; // minutes
}

interface OCRTask {
  id: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  status: 'uploading' | 'processing' | 'completed' | 'failed' | 'reviewing';
  progress: number;
  questionsFound: number;
  uploadedAt: string;
  processedAt?: string;
  estimatedTime?: string;
  errorMessage?: string;
}

interface UploadedFile {
  file: File;
  id: string;
  preview?: string;
}

const mockQuestions: Question[] = [
  {
    id: 'q1',
    title: '函数极限计算',
    content: '计算 $\\lim_{x \\to 0} \\frac{\\sin x}{x}$',
    type: 'calculation',
    difficulty: 'medium',
    knowledgePoints: ['ch1s2', 'ch1s3'],
    courseId: 'course-1',
    explanation: '这是重要极限之一，利用洛必达法则或者几何意义可以求得结果为1。当x→0时，sin x与x的比值趋向于1。',
    createdAt: '2天前',
    updatedAt: '1天前',
    usageCount: 23,
    accuracyRate: 78,
    aiDifficulty: 0.6,
    manualDifficulty: 0.65,
    status: 'published',
    source: 'OCR扫描',
    estimatedTime: 5
  },
  {
    id: 'q2',
    title: '导数定义理解',
    content: '根据导数的定义，下列说法正确的是：\\nA. 导数是函数的变化率\\nB. 导数就是切线斜率\\nC. 导数存在则函数连续\\nD. 以上都正确',
    type: 'multiple-choice',
    difficulty: 'easy',
    knowledgePoints: ['ch2s1', 'ch2s2'],
    courseId: 'course-1',
    explanation: '导数具有几何意义（切线斜率）、物理意义（变化率）和数学意义（极限）。导数存在的必要条件是函数连续。选择D是因为以上说法都是正确的。',
    createdAt: '3天前',
    updatedAt: '2天前',
    usageCount: 45,
    accuracyRate: 85,
    aiDifficulty: 0.3,
    status: 'published',
    source: '手工录入',
    estimatedTime: 3
  },
  {
    id: 'q3',
    title: '积分计算',
    content: '计算不定积分 $\\int x^2 e^x dx$',
    type: 'calculation',
    difficulty: 'hard',
    knowledgePoints: ['ch3s1', 'ch3s2'],
    courseId: 'course-1',
    explanation: '使用分部积分法，设 $u = x^2$, $dv = e^x dx$，然后应用分部积分公式 $\\int u dv = uv - \\int v du$。结果为 $(x^2 - 2x + 2)e^x + C$',
    createdAt: '1周前',
    updatedAt: '3天前',
    usageCount: 12,
    accuracyRate: 45,
    aiDifficulty: 0.85,
    manualDifficulty: 0.8,
    status: 'reviewed',
    source: 'LaTeX编辑',
    estimatedTime: 8
  },
  {
    id: 'q4',
    title: '函数导数填空',
    content: '函数 $f(x) = x^3 + 2x^2 - x + 1$ 在 $x = 1$ 处的导数值为 \\underline{\\hspace{2cm}}',
    type: 'fill-blank',
    difficulty: 'easy',
    knowledgePoints: ['ch2s1', 'ch2s2'],
    courseId: 'course-1',
    answer: '8', // 填空题有标准答案
    explanation: '首先求导：$f\'(x) = 3x^2 + 4x - 1$，然后代入 $x = 1$：$f\'(1) = 3(1)^2 + 4(1) - 1 = 3 + 4 - 1 = 6$。',
    createdAt: '5天前',
    updatedAt: '3天前',
    usageCount: 38,
    accuracyRate: 92,
    aiDifficulty: 0.2,
    status: 'published',
    source: '手工录入',
    estimatedTime: 2
  },
  {
    id: 'q5',
    title: '微分中值定理证明',
    content: '证明：若函数 $f(x)$ 在 $[a, b]$ 上连续，在 $(a, b)$ 内可导，则存在 $\\xi \\in (a, b)$，使得 $f\'(\\xi) = \\frac{f(b) - f(a)}{b - a}$',
    type: 'proof',
    difficulty: 'hard',
    knowledgePoints: ['ch3s1'],
    courseId: 'course-1',
    explanation: '这是拉格朗日中值定理的证明。构造辅助函数 $F(x) = f(x) - f(a) - \\frac{f(b)-f(a)}{b-a}(x-a)$，利用罗尔定理得出结论。证明步骤包括：1）验证F(x)满足罗尔定理条件；2）应用罗尔定理；3）整理得出结论。',
    createdAt: '1周前',
    updatedAt: '5天前',
    usageCount: 8,
    accuracyRate: 35,
    aiDifficulty: 0.9,
    manualDifficulty: 0.85,
    status: 'published',
    source: 'LaTeX编辑',
    estimatedTime: 15
  }
];

const mockOCRTasks: OCRTask[] = [
  {
    id: 'ocr1',
    fileName: '高等数学练习册第3章.pdf',
    fileSize: '2.5 MB',
    fileType: 'PDF',
    status: 'completed',
    progress: 100,
    questionsFound: 25,
    uploadedAt: '2小时前',
    processedAt: '1小时前',
    estimatedTime: '2分钟30秒'
  },
  {
    id: 'ocr2',
    fileName: '线性代数试卷.pdf',
    fileSize: '1.8 MB',
    fileType: 'PDF',
    status: 'reviewing',
    progress: 100,
    questionsFound: 8,
    uploadedAt: '30分钟前',
    processedAt: '5分钟前',
    estimatedTime: '1分钟45秒'
  },
  {
    id: 'ocr3',
    fileName: '概率论习题集.pdf',
    fileSize: '4.1 MB',
    fileType: 'PDF',
    status: 'processing',
    progress: 65,
    questionsFound: 12,
    uploadedAt: '10分钟前',
    estimatedTime: '3分钟'
  },
  {
    id: 'ocr4',
    fileName: '数学分析练习.docx',
    fileSize: '890 KB',
    fileType: 'DOCX',
    status: 'failed',
    progress: 0,
    questionsFound: 0,
    uploadedAt: '1天前',
    errorMessage: '文档格式不支持或文件损坏'
  }
];

const questionTypes = {
  'multiple-choice': '不定项选择题',
  'fill-blank': '填空题',
  'calculation': '计算题',
  'proof': '证明题',
  'subjective': '其他主观题'
};

const difficultyConfig = {
  easy: { label: '简单', color: 'bg-chart-2/20 text-chart-2', value: 0.3 },
  medium: { label: '中等', color: 'bg-chart-4/20 text-chart-4', value: 0.6 },
  hard: { label: '困难', color: 'bg-destructive/20 text-destructive', value: 0.8 }
};

const statusConfig = {
  draft: { label: '草稿', color: 'bg-muted text-muted-foreground' },
  reviewed: { label: '已审核', color: 'bg-chart-4/20 text-chart-4' },
  published: { label: '已发布', color: 'bg-chart-2/20 text-chart-2' }
};

const ocrStatusConfig = {
  uploading: { label: '上传中', color: 'bg-chart-4/20 text-chart-4', icon: Upload },
  processing: { label: '处理中', color: 'bg-chart-2/20 text-chart-2', icon: Scan },
  completed: { label: '已完成', color: 'bg-chart-1/20 text-chart-1', icon: CheckCircle },
  failed: { label: '失败', color: 'bg-destructive/20 text-destructive', icon: AlertCircle },
  reviewing: { label: '待审核', color: 'bg-chart-3/20 text-chart-3', icon: Eye }
};

export function QuestionBank() {
  // ALL HOOKS MUST BE DECLARED AT THE TOP - NO CONDITIONAL HOOKS
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterCourse, setFilterCourse] = useState<string>('all');
  const [showLatexEditor, setShowLatexEditor] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [ocrTasks, setOCRTasks] = useState<OCRTask[]>(mockOCRTasks);
  const [selectedOCRTask, setSelectedOCRTask] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // File upload handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  }, []);

  // NOW WE CAN HAVE CONDITIONAL LOGIC AFTER ALL HOOKS ARE DEFINED
  // Show OCR Review Page
  if (selectedOCRTask) {
    return <OCRReviewPage onBack={() => setSelectedOCRTask(null)} taskId={selectedOCRTask} />;
  }

  const filteredQuestions = mockQuestions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         question.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         question.knowledgePoints.some(kp => kp.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === 'all' || question.type === filterType;
    const matchesDifficulty = filterDifficulty === 'all' || question.difficulty === filterDifficulty;
    const matchesCourse = filterCourse === 'all' || question.courseId === filterCourse;
    
    return matchesSearch && matchesType && matchesDifficulty && matchesCourse;
  });

  const stats = {
    total: mockQuestions.length,
    published: mockQuestions.filter(q => q.status === 'published').length,
    avgAccuracy: Math.round(mockQuestions.reduce((acc, q) => acc + q.accuracyRate, 0) / mockQuestions.length),
    totalUsage: mockQuestions.reduce((acc, q) => acc + q.usageCount, 0)
  };

  const handleFiles = (files: File[]) => {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png', 'image/jpeg'];
    
    files.forEach(file => {
      if (!validTypes.includes(file.type)) {
        alert(`不支持的文件类型: ${file.name}`);
        return;
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert(`文件过大: ${file.name}`);
        return;
      }

      const newFile: UploadedFile = {
        file,
        id: Date.now() + Math.random().toString(),
      };

      setUploadedFiles(prev => [...prev, newFile]);
      
      // Create OCR task
      const ocrTask: OCRTask = {
        id: `ocr${Date.now()}`,
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        fileType: getFileType(file.type),
        status: 'uploading',
        progress: 0,
        questionsFound: 0,
        uploadedAt: '刚刚',
      };

      setOCRTasks(prev => [ocrTask, ...prev]);
      
      // Simulate upload and processing
      simulateOCRProcess(ocrTask.id);
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileType = (mimeType: string) => {
    switch (mimeType) {
      case 'application/pdf': return 'PDF';
      case 'application/msword': return 'DOC';
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': return 'DOCX';
      case 'image/png': return 'PNG';
      case 'image/jpeg': return 'JPG';
      default: return 'Unknown';
    }
  };

  const simulateOCRProcess = (taskId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      
      setOCRTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              progress: Math.min(progress, 100),
              status: progress >= 100 ? 'completed' : progress > 10 ? 'processing' : 'uploading',
              questionsFound: progress > 50 ? Math.floor(Math.random() * 20) + 5 : 0,
              processedAt: progress >= 100 ? '刚刚' : undefined,
              estimatedTime: progress >= 100 ? `${Math.floor(Math.random() * 3) + 1}分${Math.floor(Math.random() * 60)}秒` : undefined
            }
          : task
      ));

      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 1000);
  };

  const removeUploadedFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const getOCRStatusIcon = (status: OCRTask['status']) => {
    const config = ocrStatusConfig[status];
    const Icon = config.icon;
    return <Icon className="w-4 h-4" />;
  };

  const handleCreateQuestion = () => {
    // 导航到题目创建页面，并传递默认课程参数
    const defaultCourse = filterCourse !== 'all' ? filterCourse : '';
    if (defaultCourse) {
      navigate(`/questions/create?defaultCourse=${defaultCourse}`);
    } else {
      navigate('/questions/create');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1>题库管理</h1>
          <p className="text-muted-foreground">管理和维护教学题目资源</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Archive className="w-4 h-4" />
            批量导入
          </Button>
          <Button className="gap-2" onClick={handleCreateQuestion}>
            <Plus className="w-4 h-4" />
            创建题目
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-1">{stats.total}</div>
            <p className="text-sm text-muted-foreground">题目总数</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-2">{stats.published}</div>
            <p className="text-sm text-muted-foreground">已发布</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-3">{stats.avgAccuracy}%</div>
            <p className="text-sm text-muted-foreground">平均正确率</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-4">{stats.totalUsage}</div>
            <p className="text-sm text-muted-foreground">使用次数</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">题库总览</TabsTrigger>
          <TabsTrigger value="ocr">OCR识别</TabsTrigger>
          <TabsTrigger value="convert">智能转换</TabsTrigger>
          <TabsTrigger value="manual">手工维护</TabsTrigger>
        </TabsList>

        {/* Question Overview */}
        <TabsContent value="overview" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="搜索题目内容、知识点..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="题型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部题型</SelectItem>
                      {Object.entries(questionTypes).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="难度" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部难度</SelectItem>
                      {Object.entries(difficultyConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>{config.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filterCourse} onValueChange={setFilterCourse}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="课程" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部课程</SelectItem>
                      <SelectItem value="course-1">高等数学A</SelectItem>
                      <SelectItem value="course-2">高等数学B</SelectItem>
                      <SelectItem value="course-3">线性代数</SelectItem>
                      <SelectItem value="course-4">概率论与数理统计</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Question List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>题目列表 ({filteredQuestions.length})</span>
                <div className="flex gap-2">
                  {selectedQuestions.length > 0 && (
                    <>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Copy className="w-3 h-3" />
                        批量复制
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Trash2 className="w-3 h-3" />
                        批量删除
                      </Button>
                    </>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredQuestions.map(question => (
                <Card key={question.id} className="group hover:shadow-sm transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={selectedQuestions.includes(question.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedQuestions([...selectedQuestions, question.id]);
                          } else {
                            setSelectedQuestions(selectedQuestions.filter(id => id !== question.id));
                          }
                        }}
                        className="mt-1"
                      />

                      <div className="flex-1 space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h4 className="font-medium">{question.title}</h4>
                            <div className="flex items-center gap-2">
                              <Badge className={difficultyConfig[question.difficulty].color}>
                                {difficultyConfig[question.difficulty].label}
                              </Badge>
                              <Badge variant="outline">
                                {questionTypes[question.type]}
                              </Badge>
                              <Badge className={statusConfig[question.status].color}>
                                {statusConfig[question.status].label}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                课程ID: {question.courseId}
                              </span>
                            </div>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                预览
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => navigate(`/questions/edit/${question.id}`)}>
                                <Edit className="w-4 h-4 mr-2" />
                                编辑
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="w-4 h-4 mr-2" />
                                复制
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" />
                                删除
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Content Preview with Math Rendering */}
                        <div className="bg-muted/30 p-3 rounded-lg">
                          <div className="text-sm line-clamp-2">
                            <MixedContentRenderer content={question.content} />
                          </div>
                        </div>

                        {/* Show answer for fill-blank questions */}
                        {question.type === 'fill-blank' && question.answer && (
                          <div className="bg-chart-1/10 p-2 rounded border border-chart-1/30">
                            <span className="text-xs font-medium text-chart-1">标准答案：</span>
                            <span className="text-sm ml-2">
                              <MixedContentRenderer content={question.answer} />
                            </span>
                          </div>
                        )}

                        {/* Knowledge Points */}
                        <div className="flex items-center gap-2">
                          <Tags className="w-4 h-4 text-muted-foreground" />
                          <div className="flex gap-1 flex-wrap">
                            {question.knowledgePoints.map(kp => (
                              <Badge key={kp} variant="secondary" className="text-xs">
                                {kp}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-4 gap-4 pt-2 border-t">
                          <div className="text-center">
                            <div className="text-sm font-medium">{question.usageCount}</div>
                            <div className="text-xs text-muted-foreground">使用次数</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium text-chart-1">{question.accuracyRate}%</div>
                            <div className="text-xs text-muted-foreground">正确率</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium">{question.estimatedTime}分钟</div>
                            <div className="text-xs text-muted-foreground">预估用时</div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <div className="text-sm font-medium">{(question.aiDifficulty * 100).toFixed(0)}%</div>
                              {question.manualDifficulty && (
                                <div className="text-xs text-muted-foreground">
                                  ({(question.manualDifficulty * 100).toFixed(0)}%)
                                </div>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">AI难度</div>
                          </div>
                        </div>

                        {/* Meta */}
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>来源：{question.source}</span>
                          <span>更新于 {question.updatedAt}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* OCR Recognition */}
        <TabsContent value="ocr" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Area */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  文档上传
                </CardTitle>
                <CardDescription>
                  支持 PDF、DOC、DOCX、PNG、JPG 格式，单文件最大 10MB
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div 
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                    isDragging 
                      ? 'border-primary bg-primary/5' 
                      : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">
                    {isDragging ? '释放文件到此处' : '拖拽文件到此处'}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    或点击选择文件
                  </p>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button>选择文件</Button>
                </div>

                {/* Uploaded Files Preview */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">已选择文件</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {uploadedFiles.map(file => (
                        <div key={file.id} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            <File className="w-4 h-4" />
                            <span className="text-sm truncate">{file.file.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatFileSize(file.file.size)}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-6 h-6"
                            onClick={() => removeUploadedFile(file.id)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <h4 className="font-medium">识别设置</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">默认课程</label>
                      <CourseSelector
                        value={filterCourse !== 'all' ? filterCourse : ''}
                        onValueChange={(courseId) => {
                          // 更新默认课程设置
                          console.log('设置默认课程:', courseId);
                        }}
                        placeholder="选择识别题目的默认课程"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* OCR Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  处理任务
                </CardTitle>
                <CardDescription>
                  文档识别和题目提取进度
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {ocrTasks.map(task => (
                  <Card key={task.id} className="p-3">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm truncate">{task.fileName}</h4>
                            <Badge variant="outline" className="text-xs">{task.fileType}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{task.fileSize}</span>
                            <span>{task.uploadedAt}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge className={ocrStatusConfig[task.status].color}>
                            {getOCRStatusIcon(task.status)}
                            <span className="ml-1">{ocrStatusConfig[task.status].label}</span>
                          </Badge>
                          
                          {task.status === 'completed' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedOCRTask(task.id)}
                            >
                              审核
                            </Button>
                          )}
                        </div>
                      </div>

                      {task.status === 'processing' && (
                        <div className="space-y-2">
                          <Progress value={task.progress} className="h-2" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>处理中...</span>
                            <span>{task.progress}%</span>
                          </div>
                        </div>
                      )}

                      {task.status === 'failed' && task.errorMessage && (
                        <div className="flex items-center gap-2 text-sm text-destructive">
                          <AlertCircle className="w-4 h-4" />
                          <span>{task.errorMessage}</span>
                        </div>
                      )}

                      {task.status === 'completed' && (
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-sm font-medium">{task.questionsFound}</div>
                            <div className="text-xs text-muted-foreground">题目数量</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">{task.estimatedTime}</div>
                            <div className="text-xs text-muted-foreground">处理时间</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">{task.processedAt}</div>
                            <div className="text-xs text-muted-foreground">完成时间</div>
                          </div>
                        </div>
                      )}

                      {task.status === 'reviewing' && (
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            发现 {task.questionsFound} 道题目，等待审核
                          </div>
                          <Button 
                            size="sm"
                            onClick={() => setSelectedOCRTask(task.id)}
                            className="gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            开始审核
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Smart Conversion */}
        <TabsContent value="convert" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                AI智能转换
              </CardTitle>
              <CardDescription>
                将纯文本题目转换为标准化格式，并自动添加数学公式渲染
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">输入原始文本</h4>
                  <Textarea
                    placeholder="粘贴或输入题目文本，AI将自动识别并转换为LaTeX格式..."
                    rows={10}
                    className="resize-none"
                  />
                  <div className="flex justify-between">
                    <Button variant="outline">
                      <Settings className="w-4 h-4 mr-2" />
                      转换设置
                    </Button>
                    <Button>
                      <Zap className="w-4 h-4 mr-2" />
                      开始转换
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">转换结果</h4>
                  <div className="border rounded-lg p-4 bg-muted/30 min-h-64">
                    <p className="text-sm text-muted-foreground text-center py-8">
                      转换结果将在此显示
                    </p>
                  </div>
                  <Button className="w-full" disabled>
                    保存到题库
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manual Maintenance */}
        <TabsContent value="manual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="w-5 h-5" />
                手工维护
              </CardTitle>
              <CardDescription>
                批量编辑、标签管理、质量审核等维护操作
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="cursor-pointer hover:shadow-sm transition-shadow">
                  <CardContent className="p-4 text-center">
                    <Edit className="w-8 h-8 mx-auto mb-2 text-chart-1" />
                    <h4 className="font-medium">批量编辑</h4>
                    <p className="text-sm text-muted-foreground">批量修改题目属性</p>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:shadow-sm transition-shadow">
                  <CardContent className="p-4 text-center">
                    <Tags className="w-8 h-8 mx-auto mb-2 text-chart-2" />
                    <h4 className="font-medium">标签管理</h4>
                    <p className="text-sm text-muted-foreground">管理知识点标签</p>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:shadow-sm transition-shadow">
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2 text-chart-3" />
                    <h4 className="font-medium">质量审核</h4>
                    <p className="text-sm text-muted-foreground">审核题目质量</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}