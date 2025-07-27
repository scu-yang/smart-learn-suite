import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
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
  ArrowLeft,
  Lightbulb,
  Target,
  Brain,
  Play,
  Pause,
  Timer
} from 'lucide-react';
import UnifiedMathRenderer from '../../common/UnifiedMathRenderer';

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
  difficulty: 'easy' | 'medium' | 'hard';
  chapter: string;
  hint?: string;
}

interface Answer {
  questionId: string;
  value: string | string[];
  attachments?: File[];
  isMarked?: boolean;
  lastModified: Date;
}

const mockQuestions: Question[] = [
  {
    id: 'p1',
    number: 1,
    title: '基本极限计算',
    content: '计算极限：$\\lim_{x \\to 0} \\frac{\\sin x}{x}$',
    type: 'multiple-choice',
    points: 10,
    options: ['$0$', '$1$', '$\\infty$', '不存在'],
    difficulty: 'easy',
    chapter: '第3章 极限与连续',
    hint: '这是重要极限，可以用洛必达法则或泰勒展开'
  },
  {
    id: 'p2',
    number: 2,
    title: '导数应用',
    content: '下列关于导数的说法正确的是：（可能有多个正确答案）',
    type: 'multiple-choice',
    points: 15,
    options: [
      '导数是函数的变化率',
      '导数就是切线斜率',
      '可导必连续',
      '连续必可导'
    ],
    difficulty: 'medium',
    chapter: '第4章 导数与微分',
    hint: '思考导数的几何意义和连续性的关系'
  },
  {
    id: 'p3',
    number: 3,
    title: '积分计算',
    content: '计算不定积分：$\\int x^2 e^x dx = $ ______',
    type: 'fill-blank',
    points: 20,
    difficulty: 'hard',
    chapter: '第5章 积分学',
    hint: '可以使用分部积分法，需要多次使用'
  },
  {
    id: 'p4',
    number: 4,
    title: '函数连续性证明',
    content: '证明函数 $f(x) = \\begin{cases} x^2 & x < 1 \\\\ 2x-1 & x \\geq 1 \\end{cases}$ 在 $x = 1$ 处连续。',
    type: 'essay',
    points: 25,
    difficulty: 'medium',
    chapter: '第3章 极限与连续',
    hint: '需要证明左极限、右极限和函数值三者相等'
  },
  {
    id: 'p5',
    number: 5,
    title: '最值问题',
    content: '求函数 $f(x) = x^3 - 3x^2 + 2$ 在区间 $[0, 3]$ 上的最大值和最小值。',
    type: 'essay',
    points: 30,
    difficulty: 'hard',
    chapter: '第4章 导数应用',
    hint: '需要比较端点值和驻点的函数值'
  }
];

const mockFormulas = [
  { category: '基本导数', formulas: ['$(x^n)\' = nx^{n-1}$', '$(\\sin x)\' = \\cos x$', '$(\\cos x)\' = -\\sin x$', '$(e^x)\' = e^x$'] },
  { category: '积分公式', formulas: ['$\\int x^n dx = \\frac{x^{n+1}}{n+1} + C$', '$\\int e^x dx = e^x + C$', '$\\int \\sin x dx = -\\cos x + C$'] },
  { category: '重要极限', formulas: ['$\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$', '$\\lim_{x \\to \\infty} (1 + \\frac{1}{x})^x = e$'] },
  { category: '分部积分', formulas: ['$\\int u dv = uv - \\int v du$', '常用: $\\int x e^x dx$, $\\int x \\sin x dx$'] }
];

export function PracticeSession() {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const [searchParams] = useSearchParams();
  
  const mode = searchParams.get('mode') || 'chapter';
  const chapterId = searchParams.get('chapterId');
  const timeLimit = searchParams.get('timeLimit');
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [timeRemaining, setTimeRemaining] = useState(timeLimit ? parseInt(timeLimit) : null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isFormulaSheetOpen, setIsFormulaSheetOpen] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [calculatorInput, setCalculatorInput] = useState('');
  const [calculatorResult, setCalculatorResult] = useState('');
  const [draftPadContent, setDraftPadContent] = useState('');
  const [showDraftPad, setShowDraftPad] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showHint, setShowHint] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<'pen' | 'eraser'>('pen');

  const currentQuestion = mockQuestions[currentQuestionIndex];

  const getPracticeTitle = () => {
    switch (mode) {
      case 'chapter': return `第${chapterId || '1'}章练习`;
      case 'errors': return '错题重练';
      case 'simulation': return '模拟练习';
      case 'daily': return '每日一练';
      case 'adaptive': return 'AI智能练习';
      default: return '练习模式';
    }
  };

  // 倒计时器
  useEffect(() => {
    if (timeRemaining && timeRemaining > 0 && !isPaused) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev && prev <= 0) {
            handleAutoSubmit();
            return 0;
          }
          return prev ? prev - 1 : 0;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining, isPaused]);

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
    navigate('/practice/result', { 
      state: { 
        sessionId, 
        mode, 
        answers,
        questions: mockQuestions,
        timeSpent: timeLimit ? parseInt(timeLimit) - (timeRemaining || 0) : null
      } 
    });
  };

  const getUnansweredQuestions = () => {
    return mockQuestions.filter(q => !answers[q.id] || !answers[q.id].value);
  };

  const calculateProgress = () => {
    const answeredCount = mockQuestions.filter(q => answers[q.id]?.value).length;
    return (answeredCount / mockQuestions.length) * 100;
  };

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

  // 手写板功能
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      setIsDrawing(true);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
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
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${question.id}-${index}`}
                    checked={isChecked}
                    onCheckedChange={(checked) => {
                      console.log(`Question ${question.id}, Option ${index}: ${checked}`);
                      const newValues = checked === true
                        ? [...multipleValues, optionValue]
                        : multipleValues.filter(v => v !== optionValue);
                      console.log('New values:', newValues);
                      handleAnswerChange(question.id, newValues);
                    }}
                  />
                  <Label htmlFor={`${question.id}-${index}`} className="flex-1 cursor-pointer">
                    {String.fromCharCode(65 + index)}. <UnifiedMathRenderer>{option}</UnifiedMathRenderer>
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
              className="font-mono"
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
              className="min-h-32 font-mono"
              rows={8}
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 顶部固定栏 */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/practice')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              退出练习
            </Button>
            <div>
              <h1 className="text-lg font-medium">{getPracticeTitle()}</h1>
              <Badge variant="outline">
                第 {currentQuestion.number} 题 / 共 {mockQuestions.length} 题
              </Badge>
            </div>
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

            {/* 计时器/暂停按钮 */}
            {timeRemaining && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsPaused(!isPaused)}
                  className="gap-2"
                >
                  {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  {isPaused ? '继续' : '暂停'}
                </Button>
                <div className={`flex items-center gap-2 px-3 py-1 rounded font-mono text-lg ${
                  timeRemaining < 300 ? 'bg-destructive text-destructive-foreground' : 'bg-chart-4/20 text-chart-4'
                }`}>
                  <Timer className="w-5 h-5" />
                  <span>{formatTime(timeRemaining)}</span>
                </div>
              </div>
            )}
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
            <h3 className="font-medium mb-4">题目导航</h3>
            <div className="grid grid-cols-5 gap-2">
              {mockQuestions.map((question, index) => (
                <Button
                  key={question.id}
                  variant={currentQuestionIndex === index ? 'default' : 'outline'}
                  size="sm"
                  className={`relative ${
                    getQuestionStatus(question.id) === 'answered' ? 'bg-chart-2/20' :
                    getQuestionStatus(question.id) === 'marked' ? 'bg-chart-4/20' : ''
                  }`}
                  onClick={() => setCurrentQuestionIndex(index)}
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

            <Separator className="my-4" />

            {/* 答题统计 */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">答题统计</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>已答题目：</span>
                  <span className="text-chart-2">
                    {mockQuestions.length - getUnansweredQuestions().length}
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
                    {mockQuestions.filter(q => answers[q.id]?.isMarked).length}
                  </span>
                </div>
              </div>
            </div>
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
                      <Badge className={
                        currentQuestion.difficulty === 'easy' ? 'bg-chart-2/20 text-chart-2' :
                        currentQuestion.difficulty === 'medium' ? 'bg-chart-4/20 text-chart-4' :
                        'bg-destructive/20 text-destructive'
                      }>
                        {currentQuestion.difficulty === 'easy' ? '简单' :
                         currentQuestion.difficulty === 'medium' ? '中等' : '困难'}
                      </Badge>
                    </CardTitle>
                    <h3 className="text-lg">{currentQuestion.title}</h3>
                    <Badge variant="outline" className="text-xs">
                      {currentQuestion.chapter}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {currentQuestion.hint && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowHint(showHint === currentQuestion.id ? null : currentQuestion.id)}
                        className="gap-2"
                      >
                        <Lightbulb className="w-4 h-4" />
                        提示
                      </Button>
                    )}
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
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* 提示信息 */}
                {showHint === currentQuestion.id && currentQuestion.hint && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900 mb-1">解题提示</h4>
                        <p className="text-blue-800 text-sm">{currentQuestion.hint}</p>
                      </div>
                    </div>
                  </div>
                )}

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
                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
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
                    
                    {currentQuestionIndex === mockQuestions.length - 1 ? (
                      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
                        <AlertDialogTrigger asChild>
                          <Button className="gap-2">
                            <Send className="w-4 h-4" />
                            完成练习
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>确认提交</AlertDialogTitle>
                            <AlertDialogDescription asChild>
                              <div className="space-y-3">
                                <p>您确定要提交练习吗？提交后将查看详细结果。</p>
                                
                                {getUnansweredQuestions().length > 0 && (
                                  <div className="p-3 bg-destructive/10 rounded border border-destructive/20">
                                    <p className="text-destructive font-medium mb-2">
                                      注意：您还有 {getUnansweredQuestions().length} 道题目未作答
                                    </p>
                                    <div className="text-sm space-y-1">
                                      {getUnansweredQuestions().slice(0, 3).map(q => (
                                        <p key={q.id}>• 第 {q.number} 题：{q.title}</p>
                                      ))}
                                      {getUnansweredQuestions().length > 3 && (
                                        <p>• 还有 {getUnansweredQuestions().length - 3} 道题目...</p>
                                      )}
                                    </div>
                                  </div>
                                )}
                                
                                <div className="text-sm text-muted-foreground">
                                  {timeRemaining && <p>• 剩余时间：{formatTime(timeRemaining)}</p>}
                                  <p>• 已完成：{Math.round(calculateProgress())}%</p>
                                </div>
                              </div>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>再检查一下</AlertDialogCancel>
                            <AlertDialogAction onClick={handleSubmit}>
                              确认提交
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      <Button
                        onClick={() => setCurrentQuestionIndex(prev => Math.min(mockQuestions.length - 1, prev + 1))}
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
                        <div key={fIndex} className="p-2 bg-muted/50 rounded">
                          <UnifiedMathRenderer>{formula}</UnifiedMathRenderer>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          {/* 草稿纸 */}
          <Sheet open={showDraftPad} onOpenChange={setShowDraftPad}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" title="草稿纸">
                <FileText className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-96">
              <SheetHeader>
                <SheetTitle>草稿纸</SheetTitle>
                <SheetDescription>记录解题思路和计算过程</SheetDescription>
              </SheetHeader>
              
              <div className="mt-6">
                <Textarea
                  placeholder="在这里记录您的解题思路和计算过程..."
                  value={draftPadContent}
                  onChange={(e) => setDraftPadContent(e.target.value)}
                  className="min-h-96 font-mono"
                  rows={20}
                />
              </div>
            </SheetContent>
          </Sheet>

          {/* 标记当前题目 */}
          <Button
            variant={answers[currentQuestion.id]?.isMarked ? 'default' : 'outline'}
            size="icon"
            title="标记题目"
            onClick={() => handleMarkQuestion(currentQuestion.id)}
          >
            <Flag className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}