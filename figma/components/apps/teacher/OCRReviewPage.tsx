import React, { useState, useRef, useCallback, useEffect, useMemo, startTransition } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Textarea } from '../../ui/textarea';
import { Progress } from '../../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Label } from '../../ui/label';
import { Checkbox } from '../../ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../ui/alert-dialog';
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
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from '../../ui/dropdown-menu';
import { Slider } from '../../ui/slider';
import { Switch } from '../../ui/switch';
import { Separator } from '../../ui/separator';
import { 
  ArrowLeft,
  Save,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Move,
  Square,
  Eye,
  EyeOff,
  Sun,
  Monitor,
  Settings,
  Lightbulb,
  BookOpen,
  Calculator,
  FileText,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Download,
  Upload,
  Maximize,
  Minimize,
  MoreVertical,
  Copy,
  Edit,
  Trash2,
  Star,
  Tag,
  Plus,
  AlertTriangle,
  FileQuestion,
  Brain,
  Scan,
  ImageIcon,
  Layout,
  Columns,
  SplitSquareHorizontal,
  ExpandIcon,
  ShrinkIcon,
  RotateCcw,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  CheckSquare,
  XSquare,
  Clock,
  SendIcon,
  Archive
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import UnifiedMathRenderer from '../../common/UnifiedMathRenderer';
import LaTeXEditor from '../../common/LaTeXEditor';
import CourseSelector from '../../common/CourseSelector';
import KnowledgePointTreeSelector from '../../common/KnowledgePointTreeSelector';

interface OCRReviewPageProps {
  onBack?: () => void;
  taskId?: string;
}

// OCR内容类型
type OCRContentType = 'question' | 'text' | 'formula' | 'diagram' | 'table' | 'other';

// 布局模式
type LayoutMode = 'three-column' | 'two-column-image' | 'two-column-editor' | 'fullscreen-preview' | 'fullscreen-image';

// 审核状态
type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'modified';

// OCR审核项接口
interface OCRReviewItem {
  id: string;
  type: OCRContentType;
  pageNumber: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  rawText: string;
  confidence: number;
  status: ReviewStatus;
  suggestions: string[];
  metadata?: any;
  reviewNotes?: string; // 审核备注
  reviewTime?: Date; // 审核时间
  hasChanges?: boolean; // 是否有修改
}

// 题目类型的OCR项目
interface OCRQuestionItem extends OCRReviewItem {
  type: 'question';
  metadata: {
    questionData: {
      title: string;
      content: string;
      answer?: string;
      explanation: string;
      type: 'multiple-choice' | 'fill-blank' | 'calculation' | 'proof' | 'subjective';
      difficulty: 'easy' | 'medium' | 'hard';
      points: number;
      courseId: string;
      knowledgePoints: string[];
      tags: string[];
      options: string[];
      correctAnswers: number[];
    };
  };
}

// 其他内容类型的OCR项目
interface OCRContentItem extends OCRReviewItem {
  type: 'text' | 'formula' | 'diagram' | 'table' | 'other';
  metadata: {
    processedContent: string;
    category?: string;
    description?: string;
  };
}

interface DocumentInfo {
  id: string;
  fileName: string;
  totalPages: number;
  itemsFound: number;
  currentPage: number;
  processingTime: string;
  source: string;
  ocrSettings: {
    language: string;
    mathMode: boolean;
    autoClassify: boolean;
  };
}

// 审核统计信息
interface ReviewStats {
  total: number;
  approved: number;
  rejected: number;
  modified: number;
  pending: number;
}

const mockDocument: DocumentInfo = {
  id: 'doc1',
  fileName: '高等数学练习册第3章.pdf',
  totalPages: 25,
  itemsFound: 23,
  currentPage: 1,
  processingTime: '2分钟30秒',
  source: '教材配套练习',
  ocrSettings: {
    language: 'zh-CN',
    mathMode: true,
    autoClassify: true
  }
};

// 初始OCR数据
const initialOCRItems: (OCRQuestionItem | OCRContentItem)[] = [
  {
    id: 'ocr1',
    type: 'question',
    pageNumber: 1,
    boundingBox: { x: 50, y: 100, width: 400, height: 120 },
    rawText: '计算极限 lim(x→0) (sin x)/x。这是一个重要极限，在微积分学中有着广泛的应用。',
    confidence: 0.92,
    status: 'pending',
    suggestions: ['建议增加解题步骤', '可以添加图形辅助理解'],
    metadata: {
      questionData: {
        title: '基本极限计算 - 重要极限之一',
        content: '计算极限：$\\lim_{x \\to 0} \\frac{\\sin x}{x}$\n\n请详细写出计算过程，并说明使用的定理或方法。',
        explanation: '这是重要极限之一，可以利用洛必达法则或者几何意义来求解。当x→0时，sin x与x的比值趋向于1。详细解法：\n\n方法一：利用几何意义\n在单位圆中，当角度x很小时，sin x ≈ x，因此比值趋向于1。\n\n方法二：洛必达法则\n由于当x→0时，sin x和x都趋向于0，可以使用洛必达法则：\n$\\lim_{x \\to 0} \\frac{\\sin x}{x} = \\lim_{x \\to 0} \\frac{\\cos x}{1} = \\frac{\\cos 0}{1} = 1$',
        type: 'calculation',
        difficulty: 'medium',
        points: 10,
        courseId: 'course-1',
        knowledgePoints: ['ch1s2', 'ch1s3'],
        tags: ['重要极限', '基础概念'],
        options: [],
        correctAnswers: []
      }
    }
  } as OCRQuestionItem,
  {
    id: 'ocr2',
    type: 'question',
    pageNumber: 1,
    boundingBox: { x: 50, y: 250, width: 450, height: 180 },
    rawText: '下列关于导数的说法正确的是（可能有多个正确答案）：A.导数是函数的变化率 B.导数就是切线斜率 C.导数存在则函数连续 D.函数连续则导数存在',
    confidence: 0.88,
    status: 'pending',
    suggestions: ['选项表述清晰', '难度适中'],
    metadata: {
      questionData: {
        title: '导数基本概念理解',
        content: '下列关于导数的说法正确的是（可能有多个正确答案）：',
        explanation: '导数具有几何意义（切线斜率）、物理意义（变化率）和数学意义（极限）。导数存在的必要条件是函数连续，但函数连续不是导数存在的充分条件。\n\n详细分析：\nA. 正确 - 导数的物理意义就是变化率\nB. 正确 - 导数的几何意义是切线斜率\nC. 正确 - 可导必连续（导数存在的必要条件）\nD. 错误 - 连续不一定可导，如y=|x|在x=0处连续但不可导',
        type: 'multiple-choice',
        difficulty: 'easy',
        points: 15,
        courseId: 'course-1',
        knowledgePoints: ['ch2s1', 'ch2s2'],
        tags: ['导数', '基础概念'],
        options: [
          '导数是函数的变化率',
          '导数就是切线斜率',
          '导数存在则函数连续',
          '函数连续则导数存在'
        ],
        correctAnswers: [0, 1, 2]
      }
    }
  } as OCRQuestionItem,
  {
    id: 'ocr3',
    type: 'formula',
    pageNumber: 1,
    boundingBox: { x: 50, y: 450, width: 300, height: 80 },
    rawText: 'f\'(x) = lim[h→0] (f(x+h) - f(x))/h',
    confidence: 0.95,
    status: 'pending',
    suggestions: ['LaTeX格式转换正确'],
    metadata: {
      processedContent: '$f\'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$',
      category: '导数定义',
      description: '导数的定义公式'
    }
  } as OCRContentItem,
  {
    id: 'ocr4',
    type: 'text',
    pageNumber: 1,
    boundingBox: { x: 50, y: 550, width: 400, height: 60 },
    rawText: '注：以上公式是微分学的基础，需要熟练掌握。',
    confidence: 0.98,
    status: 'pending',
    suggestions: [],
    metadata: {
      processedContent: '注：以上公式是微分学的基础，需要熟练掌握。',
      category: '说明文字',
      description: '教学说明'
    }
  } as OCRContentItem,
  {
    id: 'ocr5',
    type: 'question',
    pageNumber: 2,
    boundingBox: { x: 50, y: 100, width: 400, height: 150 },
    rawText: '求函数 f(x) = x^3 - 3x + 1 的导数，并求其在 x = 2 处的切线方程。',
    confidence: 0.91,
    status: 'pending',
    suggestions: ['计算步骤完整'],
    metadata: {
      questionData: {
        title: '函数求导与切线方程',
        content: '求函数 $f(x) = x^3 - 3x + 1$ 的导数，并求其在 $x = 2$ 处的切线方程。',
        explanation: '首先求导数：\n$f\'(x) = 3x^2 - 3$\n\n在 $x = 2$ 处：\n$f\'(2) = 3(2)^2 - 3 = 12 - 3 = 9$\n$f(2) = 2^3 - 3(2) + 1 = 8 - 6 + 1 = 3$\n\n切线方程：$y - 3 = 9(x - 2)$\n即：$y = 9x - 15$',
        type: 'calculation',
        difficulty: 'medium',
        points: 12,
        courseId: 'course-1',
        knowledgePoints: ['ch2s3', 'ch2s4'],
        tags: ['导数', '切线方程'],
        options: [],
        correctAnswers: []
      }
    }
  } as OCRQuestionItem,
  {
    id: 'ocr6',
    type: 'formula',
    pageNumber: 2,
    boundingBox: { x: 50, y: 300, width: 350, height: 100 },
    rawText: '∫(x^2 + 2x + 1)dx = (x^3)/3 + x^2 + x + C',
    confidence: 0.89,
    status: 'pending',
    suggestions: ['公式正确'],
    metadata: {
      processedContent: '$\\int (x^2 + 2x + 1)dx = \\frac{x^3}{3} + x^2 + x + C$',
      category: '积分公式',
      description: '基本积分运算'
    }
  } as OCRContentItem
];

const questionTypes = {
  'multiple-choice': '不定项选择题',
  'fill-blank': '填空题',
  'calculation': '计算题',
  'proof': '证明题',
  'subjective': '其他主观题'
};

const difficultyConfig = {
  easy: { label: '简单', color: 'bg-chart-2/20 text-chart-2' },
  medium: { label: '中等', color: 'bg-chart-4/20 text-chart-4' },
  hard: { label: '困难', color: 'bg-destructive/20 text-destructive' }
};

const statusConfig = {
  pending: { label: '待审核', color: 'bg-chart-4/20 text-chart-4', icon: <Clock className="w-3 h-3" /> },
  approved: { label: '已通过', color: 'bg-chart-2/20 text-chart-2', icon: <Check className="w-3 h-3" /> },
  rejected: { label: '已拒绝', color: 'bg-destructive/20 text-destructive', icon: <X className="w-3 h-3" /> },
  modified: { label: '已修改', color: 'bg-chart-1/20 text-chart-1', icon: <Edit className="w-3 h-3" /> }
};

const contentTypeConfig: Record<OCRContentType, { label: string; icon: React.ReactNode; color: string }> = {
  question: { label: '题目', icon: <FileQuestion className="w-4 h-4" />, color: 'bg-blue-50 text-blue-700' },
  text: { label: '文本', icon: <FileText className="w-4 h-4" />, color: 'bg-gray-50 text-gray-700' },
  formula: { label: '公式', icon: <Calculator className="w-4 h-4" />, color: 'bg-green-50 text-green-700' },
  diagram: { label: '图表', icon: <ImageIcon className="w-4 h-4" />, color: 'bg-purple-50 text-purple-700' },
  table: { label: '表格', icon: <Square className="w-4 h-4" />, color: 'bg-orange-50 text-orange-700' },
  other: { label: '其他', icon: <MoreVertical className="w-4 h-4" />, color: 'bg-gray-50 text-gray-700' }
};

export function OCRReviewPage({ onBack, taskId }: OCRReviewPageProps) {
  const navigate = useNavigate();
  const params = useParams();
  
  // 状态管理
  const [ocrItems, setOcrItems] = useState<(OCRQuestionItem | OCRContentItem)[]>(initialOCRItems);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [selectedTool, setSelectedTool] = useState<'select' | 'move' | 'draw'>('select');
  const [contentFilter, setContentFilter] = useState<OCRContentType | 'all'>('all');
  const [showFullscreenPreview, setShowFullscreenPreview] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  
  const imageRef = useRef<HTMLDivElement>(null);

  // 使用useMemo优化过滤计算
  const filteredItems = useMemo(() => {
    return ocrItems.filter(item => {
      if (contentFilter === 'all') return true;
      return item.type === contentFilter;
    });
  }, [ocrItems, contentFilter]);

  const currentItem = useMemo(() => {
    return filteredItems[currentItemIndex];
  }, [filteredItems, currentItemIndex]);

  // 使用useMemo优化统计计算
  const reviewStats: ReviewStats = useMemo(() => {
    return {
      total: ocrItems.length,
      approved: ocrItems.filter(item => item.status === 'approved').length,
      rejected: ocrItems.filter(item => item.status === 'rejected').length,
      modified: ocrItems.filter(item => item.status === 'modified').length,
      pending: ocrItems.filter(item => item.status === 'pending').length
    };
  }, [ocrItems]);

  // 计算进度百分比
  const progressPercentage = useMemo(() => {
    return Math.round(((reviewStats.total - reviewStats.pending) / reviewStats.total) * 100);
  }, [reviewStats]);

  // 智能自适应内容宽度
  const autoAdjustContentWidth = useCallback(() => {
    toast.info('布局已自动调整为最佳显示模式');
  }, []);

  // 更新项目状态
  const updateItemStatus = useCallback((itemId: string, status: ReviewStatus, notes?: string) => {
    setOcrItems(prev => prev.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            status, 
            reviewNotes: notes,
            reviewTime: new Date(),
            hasChanges: status === 'modified' 
          }
        : item
    ));
  }, []);

  // 修复的项目导航 - 确保状态更新正确
  const handleItemChange = useCallback((newIndex: number) => {
    console.log('handleItemChange called with newIndex:', newIndex, 'current:', currentItemIndex, 'filteredItems.length:', filteredItems.length);
    
    if (newIndex >= 0 && newIndex < filteredItems.length) {
      console.log('Setting currentItemIndex to:', newIndex);
      setCurrentItemIndex(newIndex);
      console.log('Successfully navigated to item:', newIndex);
    } else {
      console.log('Invalid index:', newIndex, 'valid range: 0 to', filteredItems.length - 1);
    }
  }, [filteredItems.length, currentItemIndex]);

  // 快速导航函数 - 直接使用handleItemChange
  const navigatePrevious = useCallback(() => {
    console.log('navigatePrevious called, current:', currentItemIndex);
    const newIndex = Math.max(0, currentItemIndex - 1);
    if (newIndex !== currentItemIndex) {
      handleItemChange(newIndex);
    }
  }, [currentItemIndex, handleItemChange]);

  const navigateNext = useCallback(() => {
    console.log('navigateNext called, current:', currentItemIndex, 'max:', filteredItems.length - 1);
    const newIndex = Math.min(filteredItems.length - 1, currentItemIndex + 1);
    if (newIndex !== currentItemIndex) {
      handleItemChange(newIndex);
    }
  }, [currentItemIndex, filteredItems.length, handleItemChange]);

  // 单项审核操作
  const handleApprove = useCallback(() => {
    if (currentItem) {
      updateItemStatus(currentItem.id, 'approved');
      toast.success('项目已通过审核');
      
      // 自动跳转到下一个待审核项目
      const nextPendingIndex = filteredItems.findIndex((item, idx) => 
        idx > currentItemIndex && item.status === 'pending'
      );
      
      if (nextPendingIndex !== -1) {
        handleItemChange(nextPendingIndex);
      } else if (currentItemIndex < filteredItems.length - 1) {
        navigateNext();
      }
    }
  }, [currentItem, filteredItems, currentItemIndex, updateItemStatus, handleItemChange, navigateNext]);

  const handleReject = useCallback(() => {
    if (currentItem) {
      updateItemStatus(currentItem.id, 'rejected');
      toast.error('项目已拒绝');
      
      // 自动跳转到下一个待审核项目
      const nextPendingIndex = filteredItems.findIndex((item, idx) => 
        idx > currentItemIndex && item.status === 'pending'
      );
      
      if (nextPendingIndex !== -1) {
        handleItemChange(nextPendingIndex);
      } else if (currentItemIndex < filteredItems.length - 1) {
        navigateNext();
      }
    }
  }, [currentItem, filteredItems, currentItemIndex, updateItemStatus, handleItemChange, navigateNext]);

  const handleModify = useCallback(() => {
    if (currentItem) {
      updateItemStatus(currentItem.id, 'modified');
      toast.info('项目标记为已修改');
    }
  }, [currentItem, updateItemStatus]);

  // 批量操作
  const handleBatchApprove = useCallback(() => {
    const pendingItems = filteredItems.filter(item => item.status === 'pending');
    pendingItems.forEach(item => {
      updateItemStatus(item.id, 'approved');
    });
    toast.success(`批量通过了 ${pendingItems.length} 个项目`);
  }, [filteredItems, updateItemStatus]);

  const handleBatchReject = useCallback(() => {
    const pendingItems = filteredItems.filter(item => item.status === 'pending');
    pendingItems.forEach(item => {
      updateItemStatus(item.id, 'rejected');
    });
    toast.error(`批量拒绝了 ${pendingItems.length} 个项目`);
  }, [filteredItems, updateItemStatus]);

  // 保存进度
  const handleSaveProgress = useCallback(async () => {
    try {
      // 这里应该调用API保存审核进度
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟API调用
      setLastSaveTime(new Date());
      toast.success('审核进度已保存');
    } catch (error) {
      toast.error('保存失败，请重试');
    }
  }, []);

  // 提交审核结果
  const handleSubmitReview = useCallback(async () => {
    if (reviewStats.pending > 0) {
      toast.warning(`还有 ${reviewStats.pending} 个项目待审核，请完成后再提交`);
      return;
    }

    setIsSubmitting(true);
    try {
      // 这里应该调用API提交审核结果
      await new Promise(resolve => setTimeout(resolve, 2000)); // 模拟API调用
      
      toast.success('审核结果已提交成功！');
      setShowSubmitDialog(false);
      
      // 返回上一页
      if (onBack) {
        onBack();
      } else {
        navigate('/questions');
      }
    } catch (error) {
      toast.error('提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  }, [reviewStats.pending, onBack, navigate]);

  // 快捷键处理 - 优化事件处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 阻止默认行为，避免页面滚动
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            navigatePrevious();
            break;
          case 'ArrowRight':
            e.preventDefault();
            navigateNext();
            break;
          case 's':
            e.preventDefault();
            handleSaveProgress();
            break;
        }
      } else {
        switch (e.key) {
          case 'Enter':
            e.preventDefault();
            handleApprove();
            break;
          case ' ':
            e.preventDefault();
            handleModify();
            break;
          case 'Delete':
            e.preventDefault();
            handleReject();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigatePrevious, navigateNext, handleSaveProgress, handleApprove, handleModify, handleReject]);

  // 自动保存
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      handleSaveProgress();
    }, 5 * 60 * 1000); // 每5分钟自动保存

    return () => clearInterval(autoSaveInterval);
  }, [handleSaveProgress]);

  const renderContentEditor = useCallback(() => {
    if (!currentItem) return null;

    if (currentItem.type === 'question') {
      return <QuestionReviewEditor item={currentItem as OCRQuestionItem} onUpdate={(updatedItem) => {
        setOcrItems(prev => prev.map(item => 
          item.id === updatedItem.id ? updatedItem : item
        ));
      }} />;
    } else {
      return <ContentReviewEditor item={currentItem as OCRContentItem} onUpdate={(updatedItem) => {
        setOcrItems(prev => prev.map(item => 
          item.id === updatedItem.id ? updatedItem : item
        ));
      }} />;
    }
  }, [currentItem]);

  return (
    <div className="h-full w-full flex flex-col bg-background">
      {/* 顶部工具栏 - 固定高度 */}
      <div className="h-16 border-b px-4 flex items-center justify-between bg-card flex-shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => onBack ? onBack() : navigate('/questions')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-50 text-blue-700">
              <Scan className="w-4 h-4 mr-1" />
              OCR 智能审核
            </Badge>
            <span className="text-sm text-muted-foreground">
              {mockDocument.fileName}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={contentFilter} onValueChange={setContentFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部内容</SelectItem>
              {Object.entries(contentTypeConfig).map(([type, config]) => (
                <SelectItem key={type} value={type}>
                  <div className="flex items-center gap-2">
                    {config.icon}
                    {config.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" onClick={handleSaveProgress}>
            <Save className="w-4 h-4 mr-2" />
            保存进度
          </Button>
        </div>
      </div>

      {/* 主要内容区域 - 使用简单的flex三列布局，关键：高度固定 */}
      <div className="flex-1 flex min-h-0">
        {/* 第一列：原始图像 - 320px 固定宽度 */}
        <div className="w-80 bg-card border-r border-border flex flex-col">
          {/* 图像工具栏 */}
          <div className="h-12 border-b px-3 flex items-center justify-between bg-muted/30 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {Math.round(zoom)}%
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-6 h-6"
                onClick={() => setZoom(Math.max(25, zoom - 25))}
              >
                <ZoomOut className="w-3 h-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-6 h-6"
                onClick={() => setZoom(Math.min(200, zoom + 25))}
              >
                <ZoomIn className="w-3 h-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-6 h-6"
                onClick={() => setZoom(100)}
              >
                <RotateCcw className="w-3 h-3" />
              </Button>
              <Separator orientation="vertical" className="h-4" />
              <Button 
                variant={showBoundingBoxes ? "default" : "ghost"} 
                size="icon" 
                className="w-6 h-6"
                onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
              >
                <Square className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* 图像显示区域 - 关键：这里是纯滚动容器 */}
          <div className="flex-1 bg-muted/30 overflow-auto">
            <div 
              ref={imageRef}
              className="min-h-full flex items-center justify-center p-4"
              style={{ 
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'center center'
              }}
            >
              <div className="relative bg-white border shadow-lg rounded-lg overflow-hidden">
                <div className="w-96 h-[1000px] p-8 space-y-6">
                  <div className="text-center">
                    <h4 className="font-bold">第3章 积分学练习题</h4>
                  </div>
                  
                  {filteredItems.map((item, index) => {
                    const config = contentTypeConfig[item.type];
                    const statusInfo = statusConfig[item.status];
                    return (
                      <div
                        key={item.id}
                        className={`relative p-2 rounded cursor-pointer transition-all ${
                          index === currentItemIndex 
                            ? 'bg-chart-1/20 border-2 border-chart-1 shadow-md' 
                            : showBoundingBoxes 
                              ? 'border-2 border-dashed border-muted-foreground/30 hover:border-chart-2 hover:bg-chart-2/5' 
                              : ''
                        }`}
                        onClick={() => {
                          console.log('Image panel item clicked, index:', index);
                          handleItemChange(index);
                        }}
                      >
                        {showBoundingBoxes && (
                          <div className="absolute -top-7 left-0 flex items-center gap-1 z-10">
                            <Badge variant="secondary" className={`text-xs ${config.color} shadow-sm`}>
                              {config.icon}
                              {config.label} {index + 1}
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-white/90">
                              {Math.round(item.confidence * 100)}%
                            </Badge>
                            <Badge className={`text-xs ${statusInfo.color}`}>
                              {statusInfo.icon}
                              {statusInfo.label}
                            </Badge>
                          </div>
                        )}
                        <div className="text-sm leading-relaxed">
                          {item.rawText.length > 100 ? item.rawText.substring(0, 100) + '...' : item.rawText}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 第二列：内容编辑 - flex-1 自动伸缩 */}
        <div className="flex-1 bg-card border-r border-border flex flex-col">
          {/* 顶部工具栏 */}
          <div className="h-12 border-b px-3 flex items-center justify-between bg-muted/30 flex-shrink-0">
            <div className="flex items-center gap-2">
              {currentItem && (
                <>
                  <Badge className={contentTypeConfig[currentItem.type].color}>
                    {contentTypeConfig[currentItem.type].icon}
                    {contentTypeConfig[currentItem.type].label}
                  </Badge>
                  <Badge className={statusConfig[currentItem.status].color}>
                    {statusConfig[currentItem.status].icon}
                    {statusConfig[currentItem.status].label}
                  </Badge>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-1"
                onClick={() => setShowFullscreenPreview(true)}
              >
                <Maximize className="w-3 h-3" />
                全屏
              </Button>
              <Button variant="ghost" size="sm" className="gap-1">
                <Copy className="w-3 h-3" />
                复制
              </Button>
              <Button variant="ghost" size="sm" className="gap-1">
                <RefreshCw className="w-3 h-3" />
                重置
              </Button>
            </div>
          </div>

          {/* 导航工具栏 - 修复导航按钮 */}
          <div className="h-10 border-b px-3 flex items-center justify-between bg-muted/20 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                console.log('Previous button clicked, current index:', currentItemIndex);
                navigatePrevious();
              }}
              disabled={currentItemIndex === 0}
              className="gap-1"
            >
              <ChevronLeft className="w-3 h-3" />
              上一项
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {currentItemIndex + 1} / {filteredItems.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={autoAdjustContentWidth}
                className="gap-1 text-xs"
              >
                <ExpandIcon className="w-3 h-3" />
                自适应
              </Button>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                console.log('Next button clicked, current index:', currentItemIndex, 'total:', filteredItems.length);
                navigateNext();
              }}
              disabled={currentItemIndex >= filteredItems.length - 1}
              className="gap-1"
            >
              下一项
              <ChevronRight className="w-3 h-3" />
            </Button>
          </div>

          {/* 内容编辑区域 - 关键：这里是纯滚动容器 */}
          <div className="flex-1 overflow-auto">
            {renderContentEditor()}
          </div>
        </div>

        {/* 第三列：审核操作 - 320px 固定宽度 */}
        <div className="w-80 bg-card flex flex-col">
          {/* 状态显示 */}
          <div className="h-12 border-b px-3 flex items-center justify-between bg-muted/30 flex-shrink-0">
            <div className="flex items-center gap-2">
              {currentItem && (
                <Badge className={statusConfig[currentItem.status].color}>
                  {statusConfig[currentItem.status].icon}
                  {statusConfig[currentItem.status].label}
                </Badge>
              )}
            </div>
          </div>

          {/* 操作内容区域 - 关键：这里是纯滚动容器 */}
          <div className="flex-1 overflow-auto p-4">
            <div className="space-y-4">
              {/* 审核统计 */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <CheckSquare className="w-4 h-4" />
                    审核进度
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Progress value={progressPercentage} className="flex-1 h-2" />
                    <span className="text-sm font-medium">{progressPercentage}%</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span>已通过:</span>
                      <span className="text-chart-2">{reviewStats.approved}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>已拒绝:</span>
                      <span className="text-destructive">{reviewStats.rejected}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>已修改:</span>
                      <span className="text-chart-1">{reviewStats.modified}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>待审核:</span>
                      <span className="text-chart-4">{reviewStats.pending}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI信息卡片 */}
              {currentItem && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      AI 识别信息
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground">信心度:</span>
                      <Progress value={currentItem.confidence * 100} className="h-1.5 flex-1" />
                      <span className="font-medium">{(currentItem.confidence * 100).toFixed(0)}%</span>
                    </div>
                    
                    {currentItem.suggestions.length > 0 && (
                      <div>
                        <p className="text-xs font-medium mb-1">AI 建议：</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {currentItem.suggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start gap-1">
                              <Lightbulb className="w-3 h-3 mt-0.5 text-chart-4 shrink-0" />
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* 单项操作 */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">单项操作</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      onClick={handleApprove}
                      disabled={!currentItem || currentItem.status === 'approved'}
                      className="gap-2 bg-chart-2 hover:bg-chart-2/90"
                    >
                      <Check className="w-4 h-4" />
                      通过 (Enter)
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleModify}
                      disabled={!currentItem}
                      className="gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      修改 (Space)
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleReject}
                      disabled={!currentItem || currentItem.status === 'rejected'}
                      className="gap-2"
                    >
                      <X className="w-4 h-4" />
                      拒绝 (Del)
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* 批量操作 */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">批量操作</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full gap-2" disabled={reviewStats.pending === 0}>
                        <CheckSquare className="w-3 h-3" />
                        批量通过待审核项 ({reviewStats.pending})
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>批量通过确认</AlertDialogTitle>
                        <AlertDialogDescription>
                          确定要批量通过所有 {reviewStats.pending} 个待审核项目吗？此操作不可撤销。
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction onClick={handleBatchApprove}>
                          确认通过
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full gap-2" disabled={reviewStats.pending === 0}>
                        <XSquare className="w-3 h-3" />
                        批量拒绝待审核项 ({reviewStats.pending})
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>批量拒绝确认</AlertDialogTitle>
                        <AlertDialogDescription>
                          确定要批量拒绝所有 {reviewStats.pending} 个待审核项目吗？此操作不可撤销。
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction onClick={handleBatchReject} className="bg-destructive text-destructive-foreground">
                          确认拒绝
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>

              {/* 最终提交 */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <SendIcon className="w-4 h-4" />
                    提交审核
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-xs text-muted-foreground">
                    {reviewStats.pending > 0 ? (
                      <div className="flex items-center gap-1 text-chart-4">
                        <AlertTriangle className="w-3 h-3" />
                        还有 {reviewStats.pending} 个项目待审核
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-chart-2">
                        <Check className="w-3 h-3" />
                        所有项目审核完成
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    className="w-full gap-2" 
                    onClick={() => setShowSubmitDialog(true)}
                    disabled={reviewStats.pending > 0}
                  >
                    <SendIcon className="w-4 h-4" />
                    提交审核结果
                  </Button>
                  
                  <div className="text-xs text-muted-foreground">
                    {lastSaveTime && (
                      <div>
                        最后保存: {lastSaveTime.toLocaleString()}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* 全屏预览对话框 */}
      {showFullscreenPreview && (
        <Dialog open={showFullscreenPreview} onOpenChange={setShowFullscreenPreview}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>全屏预览</DialogTitle>
              <DialogDescription>
                详细查看当前审核内容
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {renderContentEditor()}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* 提交审核对话框 */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>提交审核结果</AlertDialogTitle>
            <AlertDialogDescription>
              确定要提交当前的审核结果吗？提交后将无法修改。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="submission-notes">提交说明（可选）</Label>
              <Textarea
                id="submission-notes"
                value={submissionNotes}
                onChange={(e) => setSubmissionNotes(e.target.value)}
                placeholder="请输入提交说明..."
                className="mt-2"
                rows={4}
              />
            </div>
            
            <div className="bg-muted/30 p-3 rounded-lg">
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-medium text-chart-2">{reviewStats.approved}</div>
                  <div className="text-muted-foreground">已通过</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-chart-1">{reviewStats.modified}</div>
                  <div className="text-muted-foreground">已修改</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-destructive">{reviewStats.rejected}</div>
                  <div className="text-muted-foreground">已拒绝</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-chart-4">{reviewStats.pending}</div>
                  <div className="text-muted-foreground">待审核</div>
                </div>
              </div>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              取消
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleSubmitReview}
              disabled={isSubmitting}
            >
              {isSubmitting ? '提交中...' : '确认提交'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// 题目审核编辑器组件
function QuestionReviewEditor({ item, onUpdate }: { 
  item: OCRQuestionItem; 
  onUpdate: (updatedItem: OCRQuestionItem) => void; 
}) {
  const [questionData, setQuestionData] = useState(item.metadata.questionData);
  const [reviewNotes, setReviewNotes] = useState(item.reviewNotes || '');

  // 当数据变化时通知父组件
  useEffect(() => {
    const updatedItem = {
      ...item,
      metadata: {
        ...item.metadata,
        questionData
      },
      reviewNotes,
      hasChanges: true
    };
    onUpdate(updatedItem);
  }, [questionData, reviewNotes, item, onUpdate]);

  return (
    <div className="p-4 space-y-6">
      {/* 原始识别内容对比 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Scan className="w-4 h-4" />
            原始识别对比
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">OCR识别原文：</Label>
            <div className="p-3 bg-muted/30 rounded border text-sm mt-1 max-h-32 overflow-auto">
              {item.rawText}
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">处理后内容：</Label>
            <div className="p-3 border rounded-lg bg-background mt-1">
              <UnifiedMathRenderer>{questionData.content}</UnifiedMathRenderer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 题目编辑 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">题目编辑</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">题目标题</Label>
            <Input
              id="title"
              value={questionData.title}
              onChange={(e) => setQuestionData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="请输入题目标题"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">题目内容</Label>
            <LaTeXEditor
              value={questionData.content}
              onChange={(value) => setQuestionData(prev => ({ ...prev, content: value }))}
              placeholder="请输入题目内容，支持LaTeX公式..."
              rows={6}
              showPreview={true}
            />
          </div>

          {/* 选择题选项 */}
          {questionData.type === 'multiple-choice' && (
            <div className="space-y-3">
              <Label>选项设置</Label>
              {questionData.options.map((option, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Checkbox
                    checked={questionData.correctAnswers.includes(index)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setQuestionData(prev => ({
                          ...prev,
                          correctAnswers: [...prev.correctAnswers, index]
                        }));
                      } else {
                        setQuestionData(prev => ({
                          ...prev,
                          correctAnswers: prev.correctAnswers.filter(i => i !== index)
                        }));
                      }
                    }}
                  />
                  <span className="w-6 text-sm font-medium mt-2">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <div className="flex-1">
                    <LaTeXEditor
                      value={option}
                      onChange={(value) => {
                        const newOptions = [...questionData.options];
                        newOptions[index] = value;
                        setQuestionData(prev => ({ ...prev, options: newOptions }));
                      }}
                      placeholder={`选项 ${String.fromCharCode(65 + index)}`}
                      rows={2}
                      showPreview={false}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 解答过程 */}
          <div className="space-y-2">
            <Label htmlFor="explanation">解答过程</Label>
            <LaTeXEditor
              value={questionData.explanation}
              onChange={(value) => setQuestionData(prev => ({ ...prev, explanation: value }))}
              placeholder="请输入详细的解答过程..."
              rows={8}
              showPreview={true}
            />
          </div>

          {/* 审核备注 */}
          <div className="space-y-2">
            <Label htmlFor="review-notes">审核备注</Label>
            <Textarea
              id="review-notes"
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="请输入审核意见或修改说明..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 其他内容审核编辑器组件
function ContentReviewEditor({ item, onUpdate }: { 
  item: OCRContentItem; 
  onUpdate: (updatedItem: OCRContentItem) => void; 
}) {
  const [processedContent, setProcessedContent] = useState(item.metadata.processedContent);
  const [category, setCategory] = useState(item.metadata.category || '');
  const [reviewNotes, setReviewNotes] = useState(item.reviewNotes || '');

  // 当数据变化时通知父组件
  useEffect(() => {
    const updatedItem = {
      ...item,
      metadata: {
        ...item.metadata,
        processedContent,
        category
      },
      reviewNotes,
      hasChanges: true
    };
    onUpdate(updatedItem);
  }, [processedContent, category, reviewNotes, item, onUpdate]);

  return (
    <div className="p-4 space-y-6">
      {/* 原始识别内容 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Scan className="w-4 h-4" />
            原始识别内容
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-3 bg-muted/30 rounded border text-sm">
            {item.rawText}
          </div>
        </CardContent>
      </Card>

      {/* 内容编辑 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">内容编辑</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">内容分类</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="请输入内容分类"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="processed">处理后内容</Label>
            {item.type === 'formula' ? (
              <LaTeXEditor
                value={processedContent}
                onChange={setProcessedContent}
                placeholder="请输入或编辑LaTeX公式..."
                rows={6}
                showPreview={true}
              />
            ) : (
              <Textarea
                id="processed"
                value={processedContent}
                onChange={(e) => setProcessedContent(e.target.value)}
                placeholder="请输入处理后的内容"
                rows={8}
                className="font-mono text-sm"
              />
            )}
          </div>

          {/* 审核备注 */}
          <div className="space-y-2">
            <Label htmlFor="review-notes">审核备注</Label>
            <Textarea
              id="review-notes"
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="请输入审核意见或修改说明..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default OCRReviewPage;