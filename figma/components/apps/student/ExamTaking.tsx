import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Badge } from '../../ui/badge';
import { Checkbox } from '../../ui/checkbox';
import { Label } from '../../ui/label';
import { Separator } from '../../ui/separator';
import { Progress } from '../../ui/progress';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../ui/alert-dialog';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../ui/sheet';
import {
  Clock,
  FileText,
  Calculator,
  BookOpen,
  Flag,
  Camera,
  Upload,
  Save,
  CheckCircle2,
  AlertCircle,
  Circle,
  ChevronLeft,
  ChevronRight,
  Send,
  PenTool,
  Eraser,
  RotateCcw,
  Menu,
  Grid3X3,
  X
} from 'lucide-react';
import UnifiedMathRenderer from '../../common/UnifiedMathRenderer';
import { useIsMobile } from '../../ui/use-mobile';

interface Question {
  id: string;
  number: number;
  title: string;
  content: string;
  type: 'multiple-choice' | 'fill-blank' | 'essay';
  points: number;
  options?: string[];
  answer?: string | string[];
  explanation?: string;
}

interface Answer {
  questionId: string;
  value: string | string[];
  attachments?: File[];
  isMarked?: boolean;
  lastModified: Date;
}

const mockExam = {
  id: 'exam1',
  title: '高等数学期中考试',
  duration: 120, // 分钟
  totalPoints: 100,
  instructions: '请仔细阅读题目，认真作答。考试时间为120分钟，请合理分配时间。',
  questions: [
    {
      id: 'q1',
      number: 1,
      title: '基本极限计算',
      content: '计算极限：$\\lim_{x \\to 0} \\frac{\\sin x}{x}$',
      type: 'multiple-choice' as const,
      points: 10,
      options: ['$0$', '$1$', '$\\infty$', '不存在']
    },
    {
      id: 'q2',
      number: 2,
      title: '导数应用',
      content: '下列关于导数的说法正确的是：（可能有多个正确答案）',
      type: 'multiple-choice' as const,
      points: 15,
      options: [
        '导数是函数的变化率',
        '导数就是切线斜率',
        '可导必连续',
        '连续必可导'
      ]
    },
    {
      id: 'q3',
      number: 3,
      title: '积分计算',
      content: '计算不定积分：$\\int x^2 e^x dx = $ ______',
      type: 'fill-blank' as const,
      points: 20
    },
    {
      id: 'q4',
      number: 4,
      title: '函数连续性证明',
      content: '证明函数 $f(x) = \\begin{cases} x^2 & x < 1 \\\\ 2x-1 & x \\geq 1 \\end{cases}$ 在 $x = 1$ 处连续。',
      type: 'essay' as const,
      points: 25
    },
    {
      id: 'q5',
      number: 5,
      title: '极值问题',
      content: '求函数 $f(x) = x^3 - 3x^2 + 2$ 的极值点和极值。',
      type: 'essay' as const,
      points: 30
    }
  ]
};

const mockFormulas = [
  { 
    category: '基本导数', 
    formulas: [
      '$(x^n)\' = nx^{n-1}$', 
      '$(\\sin x)\' = \\cos x$', 
      '$(\\cos x)\' = -\\sin x$',
      '$(e^x)\' = e^x$',
      '$(\\ln x)\' = \\frac{1}{x}$'
    ] 
  },
  { 
    category: '积分公式', 
    formulas: [
      '$\\int x^n dx = \\frac{x^{n+1}}{n+1} + C$', 
      '$\\int e^x dx = e^x + C$',
      '$\\int \\frac{1}{x} dx = \\ln|x| + C$',
      '$\\int \\sin x dx = -\\cos x + C$'
    ] 
  },
  { 
    category: '重要极限', 
    formulas: [
      '$\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$', 
      '$\\lim_{x \\to \\infty} (1 + \\frac{1}{x})^x = e$',
      '$\\lim_{x \\to 0} \\frac{1 - \\cos x}{x^2} = \\frac{1}{2}$'
    ] 
  }
];

export function ExamTaking() {
  const navigate = useNavigate();
  const { examId } = useParams();
  const isMobile = useIsMobile();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [timeRemaining, setTimeRemaining] = useState(mockExam.duration * 60); // 秒
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isFormulaSheetOpen, setIsFormulaSheetOpen] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [calculatorInput, setCalculatorInput] = useState('');
  const [calculatorResult, setCalculatorResult] = useState('');
  const [draftPadContent, setDraftPadContent] = useState('');
  const [showDraftPad, setShowDraftPad] = useState(false);
  const [showQuestionNavigation, setShowQuestionNavigation] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<'pen' | 'eraser'>('pen');

  const currentQuestion = mockExam.questions[currentQuestionIndex];

  // 倒计时器
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 自动保存
  useEffect(() => {
    const autoSaveTimer = setInterval(() => {
      handleAutoSave();
    }, 30000); // 每30秒自动保存

    return () => clearInterval(autoSaveTimer);
  }, [answers]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getQuestionStatus = (questionId: string) => {
    const answer = answers[questionId];
    if (!answer) return 'unanswered';
    if (answer.isMarked) return 'marked';
    return 'answered';
  };

  const handleAnswerChange = (questionId: string, value: string | string[]) => {
    const existingAnswer = answers[questionId] || {};
    const newAnswer: Answer = {
      ...existingAnswer,
      questionId,
      value,
      lastModified: new Date()
    };
    
    setAnswers(prev => ({
      ...prev,
      [questionId]: newAnswer
    }));
  };

  const handleMarkQuestion = (questionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        questionId,
        value: prev[questionId]?.value || '',
        isMarked: !prev[questionId]?.isMarked,
        lastModified: new Date()
      }
    }));
  };

  const handleAutoSave = async () => {
    setAutoSaveStatus('saving');
    try {
      // 模拟保存API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAutoSaveStatus('saved');
    } catch (error) {
      setAutoSaveStatus('error');
    }
  };

  const handleAutoSubmit = () => {
    // 时间到自动提交
    handleSubmit();
  };

  const handleSubmit = () => {
    console.log('提交答案:', answers);
    navigate(`/exam/${examId}/result`, { state: { examId, answers } });
  };

  const getUnansweredQuestions = () => {
    return mockExam.questions.filter(q => !answers[q.id] || !answers[q.id].value);
  };

  const calculateProgress = () => {
    const answeredCount = mockExam.questions.filter(q => answers[q.id]?.value).length;
    return (answeredCount / mockExam.questions.length) * 100;
  };

  // 题目导航函数
  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(prev => Math.min(mockExam.questions.length - 1, prev + 1));
  };

  // 检查是否为最后一题
  const isLastQuestion = currentQuestionIndex === mockExam.questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  // 计算器功能
  const handleCalculatorInput = (value: string) => {
    if (value === '=') {
      try {
        const result = eval(calculatorInput.replace(/[^0-9+\-*/().]/g, ''));
        setCalculatorResult(result.toString());
      } catch {
        setCalculatorResult('错误');
      }
    } else if (value === 'C') {
      setCalculatorInput('');
      setCalculatorResult('');
    } else {
      setCalculatorInput(prev => prev + value);
    }
  };

  // 手写板功能 - 适配移动端
  const getCoordinates = (e: React.TouchEvent | React.MouseEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    if (!canvasRef.current) return;
    
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      setIsDrawing(true);
    }
  };

  const draw = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    if (!isDrawing || !canvasRef.current) return;
    
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.lineWidth = currentTool === 'pen' ? 2 : 10;
      ctx.lineCap = 'round';
      ctx.globalCompositeOperation = currentTool === 'pen' ? 'source-over' : 'destination-out';
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const renderAnswerInput = (question: Question) => {
    const answer = answers[question.id];

    switch (question.type) {
      case 'multiple-choice':
        const multipleValues = Array.isArray(answer?.value) ? answer.value as string[] : [];
        return (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-2">
              请选择正确答案（可选择多个选项）
            </p>
            {question.options?.map((option, index) => {
              const optionValue = index.toString();
              const isChecked = multipleValues.includes(optionValue);
              
              return (
                <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id={`${question.id}-${index}`}
                    checked={isChecked}
                    onCheckedChange={(checked) => {
                      const newValues = checked === true
                        ? [...multipleValues, optionValue]
                        : multipleValues.filter(v => v !== optionValue);
                      handleAnswerChange(question.id, newValues);
                    }}
                    className="mt-0.5"
                  />
                  <Label htmlFor={`${question.id}-${index}`} className="flex-1 cursor-pointer leading-relaxed">
                    <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                    <UnifiedMathRenderer>{option}</UnifiedMathRenderer>
                  </Label>
                </div>
              );
            })}
          </div>
        );

      case 'fill-blank':
        return (
          <div className="space-y-4">
            <Input
              placeholder="请输入答案（支持LaTeX格式）"
              value={answer?.value as string || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              className="font-mono text-base"
            />
            {answer?.value && (
              <div className="p-3 bg-muted/30 rounded border">
                <p className="text-sm text-muted-foreground mb-1">预览：</p>
                <UnifiedMathRenderer>{answer.value as string}</UnifiedMathRenderer>
              </div>
            )}
          </div>
        );

      case 'essay':
        return (
          <div className="space-y-4">
            <Textarea
              placeholder="请输入详细解答过程（支持LaTeX格式）"
              value={answer?.value as string || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              className={`font-mono ${isMobile ? 'min-h-32' : 'min-h-40'} text-base`}
              rows={isMobile ? 6 : 8}
            />
            {answer?.value && (
              <div className="p-3 bg-muted/30 rounded border">
                <p className="text-sm text-muted-foreground mb-1">预览：</p>
                <UnifiedMathRenderer>{answer.value as string}</UnifiedMathRenderer>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const renderQuestionNavigation = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">题目导航</h3>
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowQuestionNavigation(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
      
      <div className={`grid ${isMobile ? 'grid-cols-6' : 'grid-cols-5'} gap-2`}>
        {mockExam.questions.map((question, index) => (
          <Button
            key={question.id}
            variant={currentQuestionIndex === index ? 'default' : 'outline'}
            size="sm"
            className={`relative ${
              getQuestionStatus(question.id) === 'answered' ? 'bg-chart-2/20' :
              getQuestionStatus(question.id) === 'marked' ? 'bg-chart-4/20' : ''
            }`}
            onClick={() => {
              setCurrentQuestionIndex(index);
              if (isMobile) setShowQuestionNavigation(false);
            }}
          >
            {question.number}
            {getQuestionStatus(question.id) === 'answered' && (
              <CheckCircle2 className="w-3 h-3 absolute -top-1 -right-1 text-chart-2" />
            )}
            {getQuestionStatus(question.id) === 'marked' && (
              <Flag className="w-3 h-3 absolute -top-1 -right-1 text-chart-4" />
            )}
          </Button>
        ))}
      </div>

      <Separator />

      {/* 答题统计 */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">答题统计</h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>已答题目：</span>
            <span className="text-chart-2">
              {mockExam.questions.length - getUnansweredQuestions().length}
            </span>
          </div>
          <div className="flex justify-between">
            <span>未答题目：</span>
            <span className="text-muted-foreground">
              {getUnansweredQuestions().length}
            </span>
          </div>
          <div className="flex justify-between">
            <span>标记题目：</span>
            <span className="text-chart-4">
              {mockExam.questions.filter(q => answers[q.id]?.isMarked).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    // 移动端布局
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* 顶部固定栏 */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowQuestionNavigation(true)}
                className="shrink-0"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-sm font-medium truncate">{mockExam.title}</h1>
                <div className="text-xs text-muted-foreground">
                  第 {currentQuestion.number} 题 / 共 {mockExam.questions.length} 题
                </div>
              </div>
            </div>
            
            {/* 倒计时器 */}
            <div className={`flex items-center gap-1 px-2 py-1 rounded font-mono text-sm shrink-0 ${
              timeRemaining < 600 ? 'bg-destructive text-destructive-foreground' : 'bg-chart-4/20 text-chart-4'
            }`}>
              <Clock className="w-3 h-3" />
              <span>{formatTime(timeRemaining)}</span>
            </div>
          </div>

          {/* 进度条 */}
          <div className="px-3 pb-2">
            <Progress value={calculateProgress()} className="h-1" />
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="flex-1 overflow-auto pt-20 pb-20">
          <div className="p-4">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <FileText className="w-4 h-4" />
                      第 {currentQuestion.number} 题
                      <Badge variant="secondary" className="text-xs">{currentQuestion.points} 分</Badge>
                    </CardTitle>
                    <h3 className="text-sm font-medium">{currentQuestion.title}</h3>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMarkQuestion(currentQuestion.id)}
                    className={`shrink-0 ${answers[currentQuestion.id]?.isMarked ? 'bg-chart-4/20' : ''}`}
                  >
                    <Flag className="w-3 h-3" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* 题目内容 */}
                <div className="p-3 bg-muted/30 rounded-lg">
                  <UnifiedMathRenderer>{currentQuestion.content}</UnifiedMathRenderer>
                </div>

                {/* 答题区域 */}
                <div>
                  <h4 className="font-medium mb-3 text-sm">请作答：</h4>
                  {renderAnswerInput(currentQuestion)}
                </div>

                {/* 附件上传 */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">
                    {currentQuestion.type === 'essay' ? '图片答案' : '解答过程图片'}
                    <span className="text-xs text-muted-foreground ml-1">
                      ({currentQuestion.type === 'essay' ? '可作为主要答案' : '可选，辅助说明'})
                    </span>
                  </h4>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2 flex-1">
                      <Camera className="w-4 h-4" />
                      拍照
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 flex-1">
                      <Upload className="w-4 h-4" />
                      上传图片
                    </Button>
                  </div>
                </div>

                {/* 手写板（主观题） */}
                {currentQuestion.type === 'essay' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">手写板</h4>
                      <div className="flex gap-1">
                        <Button
                          variant={currentTool === 'pen' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentTool('pen')}
                        >
                          <PenTool className="w-3 h-3" />
                        </Button>
                        <Button
                          variant={currentTool === 'eraser' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentTool('eraser')}
                        >
                          <Eraser className="w-3 h-3" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={clearCanvas}>
                          <RotateCcw className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="border rounded-lg p-2">
                      <canvas
                        ref={canvasRef}
                        width={300}
                        height={200}
                        className="border rounded cursor-crosshair bg-white w-full"
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        style={{ touchAction: 'none' }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 底部固定导航栏 */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50">
          <div className="p-3">
            {/* 主要导航按钮行 */}
            <div className="flex items-center justify-between gap-2 mb-2">
              {/* 上一题按钮 */}
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousQuestion}
                disabled={isFirstQuestion}
                className="flex-1 gap-1 min-w-0"
              >
                <ChevronLeft className="w-3 h-3 shrink-0" />
                <span className="truncate">上一题</span>
              </Button>

              {/* 工具按钮 */}
              <div className="flex gap-1 shrink-0">
                <Button variant="outline" size="sm" onClick={handleAutoSave}>
                  <Save className="w-3 h-3" />
                </Button>
                
                <Sheet open={isCalculatorOpen} onOpenChange={setIsCalculatorOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Calculator className="w-3 h-3" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-96">
                    <SheetHeader>
                      <SheetTitle>计算器</SheetTitle>
                    </SheetHeader>
                    
                    <div className="mt-4 space-y-4">
                      <div className="bg-muted p-3 rounded font-mono text-right">
                        <div className="text-sm text-muted-foreground">{calculatorInput}</div>
                        <div className="text-lg">{calculatorResult}</div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          'C', '±', '%', '÷',
                          '7', '8', '9', '×',
                          '4', '5', '6', '-',
                          '1', '2', '3', '+',
                          '0', '.', '=', '='
                        ].map((btn, index) => (
                          <Button
                            key={index}
                            variant={['C', '±', '%', '÷', '×', '-', '+', '='].includes(btn) ? 'secondary' : 'outline'}
                            className={btn === '0' ? 'col-span-2' : ''}
                            onClick={() => handleCalculatorInput(btn)}
                            disabled={btn === '±' || btn === '%'}
                          >
                            {btn}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                <Sheet open={isFormulaSheetOpen} onOpenChange={setIsFormulaSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm">
                      <BookOpen className="w-3 h-3" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-96">
                    <SheetHeader>
                      <SheetTitle>公式参考</SheetTitle>
                    </SheetHeader>
                    
                    <div className="mt-4 space-y-4 overflow-auto">
                      {mockFormulas.map((category, index) => (
                        <div key={index}>
                          <h4 className="font-medium mb-2 text-sm">{category.category}</h4>
                          <div className="space-y-2">
                            {category.formulas.map((formula, fIndex) => (
                              <div key={fIndex} className="p-2 bg-muted/30 rounded text-sm">
                                <UnifiedMathRenderer mode="math">{formula}</UnifiedMathRenderer>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* 下一题/交卷按钮 */}
              {isLastQuestion ? (
                <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" className="flex-1 gap-1 min-w-0">
                      <Send className="w-3 h-3 shrink-0" />
                      <span className="truncate">交卷</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="w-[90vw] max-w-md">
                    <AlertDialogHeader>
                      <AlertDialogTitle>确认交卷</AlertDialogTitle>
                      <AlertDialogDescription asChild>
                        <div className="space-y-3">
                          <p className="text-sm">您确定要提交试卷吗？提交后将无法修改答案。</p>
                          
                          {getUnansweredQuestions().length > 0 && (
                            <div className="p-3 bg-destructive/10 rounded border border-destructive/20">
                              <p className="text-destructive font-medium mb-2 text-sm">
                                注意：您还有 {getUnansweredQuestions().length} 道题目未作答
                              </p>
                            </div>
                          )}
                          
                          <div className="text-sm text-muted-foreground">
                            <p>• 剩余时间：{formatTime(timeRemaining)}</p>
                            <p>• 已完成：{Math.round(calculateProgress())}%</p>
                          </div>
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>再检查一下</AlertDialogCancel>
                      <AlertDialogAction onClick={handleSubmit}>
                        确认交卷
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <Button
                  size="sm"
                  onClick={handleNextQuestion}
                  className="flex-1 gap-1 min-w-0"
                >
                  <span className="truncate">下一题</span>
                  <ChevronRight className="w-3 h-3 shrink-0" />
                </Button>
              )}
            </div>

            {/* 题目信息行 */}
            <div className="text-xs text-muted-foreground text-center">
              第 {currentQuestion.number} 题 / 共 {mockExam.questions.length} 题 · {currentQuestion.points}分
            </div>
          </div>
        </div>

        {/* 题目导航抽屉 */}
        {showQuestionNavigation && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowQuestionNavigation(false)}
            />
            <div className="fixed right-0 top-0 h-full w-80 bg-background border-l z-50 p-4 overflow-auto">
              {renderQuestionNavigation()}
            </div>
          </>
        )}
      </div>
    );
  }

  // 桌面端布局
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 顶部固定栏 */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-medium">{mockExam.title}</h1>
            <Badge variant="outline">
              第 {currentQuestion.number} 题 / 共 {mockExam.questions.length} 题
            </Badge>
          </div>
          
          <div className="flex items-center gap-4">
            {/* 自动保存状态 */}
            <div className="flex items-center gap-2 text-sm">
              {autoSaveStatus === 'saved' && (
                <>
                  <CheckCircle2 className="w-4 h-4 text-chart-2" />
                  <span className="text-muted-foreground">已保存</span>
                </>
              )}
              {autoSaveStatus === 'saving' && (
                <>
                  <div className="w-4 h-4 border-2 border-chart-4 border-t-transparent rounded-full animate-spin" />
                  <span className="text-muted-foreground">保存中...</span>
                </>
              )}
              {autoSaveStatus === 'error' && (
                <>
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  <span className="text-destructive">保存失败</span>
                </>
              )}
            </div>

            {/* 倒计时器 */}
            <div className={`flex items-center gap-2 px-3 py-1 rounded font-mono text-lg ${
              timeRemaining < 600 ? 'bg-destructive text-destructive-foreground' : 'bg-chart-4/20 text-chart-4'
            }`}>
              <Clock className="w-5 h-5" />
              <span>{formatTime(timeRemaining)}</span>
            </div>
          </div>
        </div>

        {/* 进度条 */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <span>答题进度</span>
            <span>{Math.round(calculateProgress())}%</span>
          </div>
          <Progress value={calculateProgress()} className="h-1" />
        </div>
      </div>

      <div className="flex flex-1 pt-24">
        {/* 左侧题目导航 */}
        <div className="w-64 border-r bg-card">
          <div className="p-4">
            {renderQuestionNavigation()}
          </div>
        </div>

        {/* 中间答题区 */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      第 {currentQuestion.number} 题
                      <Badge variant="secondary">{currentQuestion.points} 分</Badge>
                    </CardTitle>
                    <h3 className="text-lg">{currentQuestion.title}</h3>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMarkQuestion(currentQuestion.id)}
                    className={answers[currentQuestion.id]?.isMarked ? 'bg-chart-4/20' : ''}
                  >
                    <Flag className="w-4 h-4 mr-1" />
                    {answers[currentQuestion.id]?.isMarked ? '已标记' : '标记'}
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* 题目内容 */}
                <div className="p-4 bg-muted/30 rounded-lg">
                  <UnifiedMathRenderer>{currentQuestion.content}</UnifiedMathRenderer>
                </div>

                {/* 答题区域 */}
                <div>
                  <h4 className="font-medium mb-3">请作答：</h4>
                  {renderAnswerInput(currentQuestion)}
                </div>

                {/* 附件上传 */}
                <div className="space-y-3">
                  <h4 className="font-medium">
                    {currentQuestion.type === 'essay' ? '图片答案' : '解答过程图片'}
                    <span className="text-sm text-muted-foreground ml-1">
                      ({currentQuestion.type === 'essay' ? '可作为主要答案' : '可选，辅助说明'})
                    </span>
                  </h4>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Camera className="w-4 h-4" />
                      拍照
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Upload className="w-4 h-4" />
                      上传图片
                    </Button>
                  </div>
                </div>

                {/* 手写板（主观题） */}
                {currentQuestion.type === 'essay' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">手写板</h4>
                      <div className="flex gap-2">
                        <Button
                          variant={currentTool === 'pen' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentTool('pen')}
                        >
                          <PenTool className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={currentTool === 'eraser' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentTool('eraser')}
                        >
                          <Eraser className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={clearCanvas}>
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="border rounded-lg p-2">
                      <canvas
                        ref={canvasRef}
                        width={600}
                        height={300}
                        className="border rounded cursor-crosshair bg-white"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                      />
                    </div>
                  </div>
                )}

                {/* 导航按钮 */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={handlePreviousQuestion}
                    disabled={isFirstQuestion}
                    className="gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    上一题
                  </Button>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleAutoSave} className="gap-2">
                      <Save className="w-4 h-4" />
                      保存
                    </Button>
                    
                    {isLastQuestion ? (
                      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
                        <AlertDialogTrigger asChild>
                          <Button className="gap-2">
                            <Send className="w-4 h-4" />
                            交卷
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>确认交卷</AlertDialogTitle>
                            <AlertDialogDescription asChild>
                              <div className="space-y-3">
                                <p>您确定要提交试卷吗？提交后将无法修改答案。</p>
                                
                                {getUnansweredQuestions().length > 0 && (
                                  <div className="p-3 bg-destructive/10 rounded border border-destructive/20">
                                    <p className="text-destructive font-medium mb-2">
                                      注意：您还有 {getUnansweredQuestions().length} 道题目未作答
                                    </p>
                                    <div className="text-sm space-y-1">
                                      {getUnansweredQuestions().slice(0, 5).map(q => (
                                        <p key={q.id}>• 第 {q.number} 题：{q.title}</p>
                                      ))}
                                      {getUnansweredQuestions().length > 5 && (
                                        <p>• 还有 {getUnansweredQuestions().length - 5} 道题目...</p>
                                      )}
                                    </div>
                                  </div>
                                )}
                                
                                <div className="text-sm text-muted-foreground">
                                  <p>• 剩余时间：{formatTime(timeRemaining)}</p>
                                  <p>• 已完成：{Math.round(calculateProgress())}%</p>
                                </div>
                              </div>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>再检查一下</AlertDialogCancel>
                            <AlertDialogAction onClick={handleSubmit}>
                              确认交卷
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      <Button
                        onClick={handleNextQuestion}
                        className="gap-2"
                      >
                        下一题
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 右侧工具栏 */}
        <div className="w-16 border-l bg-card flex flex-col items-center py-4 gap-3">
          {/* 计算器 */}
          <Sheet open={isCalculatorOpen} onOpenChange={setIsCalculatorOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" title="计算器">
                <Calculator className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>计算器</SheetTitle>
                <SheetDescription>简单数学计算工具</SheetDescription>
              </SheetHeader>
              
              <div className="mt-6 space-y-4">
                <div className="bg-muted p-3 rounded font-mono text-right">
                  <div className="text-sm text-muted-foreground">{calculatorInput}</div>
                  <div className="text-lg">{calculatorResult}</div>
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  {[
                    'C', '±', '%', '÷',
                    '7', '8', '9', '×',
                    '4', '5', '6', '-',
                    '1', '2', '3', '+',
                    '0', '.', '=', '='
                  ].map((btn, index) => (
                    <Button
                      key={index}
                      variant={['C', '±', '%', '÷', '×', '-', '+', '='].includes(btn) ? 'secondary' : 'outline'}
                      className={btn === '0' ? 'col-span-2' : btn === '=' && index === 19 ? 'row-span-2' : ''}
                      onClick={() => handleCalculatorInput(btn)}
                      disabled={btn === '±' || btn === '%'}
                    >
                      {btn}
                    </Button>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* 公式参考 */}
          <Sheet open={isFormulaSheetOpen} onOpenChange={setIsFormulaSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" title="公式参考">
                <BookOpen className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-96">
              <SheetHeader>
                <SheetTitle>公式参考</SheetTitle>
                <SheetDescription>常用数学公式速查</SheetDescription>
              </SheetHeader>
              
              <div className="mt-6 space-y-6">
                {mockFormulas.map((category, index) => (
                  <div key={index}>
                    <h4 className="font-medium mb-3">{category.category}</h4>
                    <div className="space-y-2">
                      {category.formulas.map((formula, fIndex) => (
                        <div key={fIndex} className="p-3 bg-muted/30 rounded border">
                          <UnifiedMathRenderer mode="math">{formula}</UnifiedMathRenderer>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}