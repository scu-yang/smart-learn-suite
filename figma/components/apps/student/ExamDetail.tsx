import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Separator } from '../../ui/separator';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { 
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Save,
  Send,
  Calculator,
  Eye,
  Download,
  Timer,
  Flag,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { MathRenderer, DisplayMath } from '../../common/MathRenderer';

interface Question {
  id: string;
  type: 'single-choice' | 'multiple-choice' | 'fill-blank' | 'essay';
  title: string;
  content: string;
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  chapter: string;
}

interface ExamData {
  id: string;
  title: string;
  course: string;
  description: string;
  duration: number; // minutes
  totalPoints: number;
  startTime?: string;
  endTime: string;
  questions: Question[];
  status: 'not-started' | 'in-progress' | 'completed' | 'reviewing';
  timeRemaining?: number; // seconds
  currentAnswers: Record<string, string | string[]>;
}

const mockQuestions: Question[] = [
  {
    id: 'q1',
    type: 'single-choice',
    title: '极限计算',
    content: '计算极限 $\\lim_{x \\to 0} \\frac{\\sin x}{x}$ 的值是：',
    options: ['0', '1', '∞', '不存在'],
    correctAnswer: '1',
    points: 10,
    difficulty: 'easy',
    chapter: '第3章 极限与连续'
  },
  {
    id: 'q2',
    type: 'single-choice',
    title: '导数应用',
    content: '函数 $f(x) = x^3 - 3x^2 + 2$ 的极值点是：',
    options: ['x = 0', 'x = 2', 'x = 0 和 x = 2', 'x = 1'],
    correctAnswer: 'x = 0 和 x = 2',
    points: 15,
    difficulty: 'medium',
    chapter: '第4章 导数与微分'
  },
  {
    id: 'q3',
    type: 'fill-blank',
    title: '积分计算',
    content: '计算不定积分：$\\int x^2 e^x dx = $ _____ $+ C$',
    correctAnswer: '(x^2 - 2x + 2)e^x',
    points: 20,
    difficulty: 'hard',
    chapter: '第5章 积分学'
  },
  {
    id: 'q4',
    type: 'essay',
    title: '证明题',
    content: '证明：对于任意实数 $a > 0$，有 $\\lim_{x \\to +\\infty} \\frac{\\ln x}{x^a} = 0$',
    points: 25,
    difficulty: 'hard',
    chapter: '第3章 极限与连续'
  }
];

export function ExamDetail() {
  const { examId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get('mode') || 'take'; // take, review, result
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [timeRemaining, setTimeRemaining] = useState(5400); // 90 minutes in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());

  // Mock exam data
  const examData: ExamData = {
    id: examId || 'e1',
    title: '第三章测验 - 极限与连续',
    course: '高等数学A',
    description: '测验内容包括极限计算、连续性判断等',
    duration: 90,
    totalPoints: 70,
    endTime: '2025-01-25 23:59',
    questions: mockQuestions,
    status: mode === 'result' ? 'completed' : mode === 'review' ? 'reviewing' : 'in-progress',
    timeRemaining: timeRemaining,
    currentAnswers: answers
  };

  // Timer effect
  useEffect(() => {
    if (mode === 'take' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [timeRemaining, mode]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleQuestionNavigation = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleFlag = (questionId: string) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleAutoSubmit = () => {
    setIsSubmitting(true);
    // Auto submit logic
    setTimeout(() => {
      navigate('/exams');
    }, 2000);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Submit logic
    setTimeout(() => {
      navigate('/exams');
    }, 2000);
  };

  const getCurrentQuestion = () => examData.questions[currentQuestionIndex];
  const currentQuestion = getCurrentQuestion();

  const getQuestionStatusColor = (questionId: string) => {
    if (answers[questionId]) {
      return 'bg-chart-1 text-white';
    } else if (flaggedQuestions.has(questionId)) {
      return 'bg-chart-4 text-white';
    } else {
      return 'bg-muted text-muted-foreground hover:bg-accent';
    }
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  const renderQuestionContent = (question: Question) => {
    return (
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {question.chapter}
              </Badge>
              <Badge variant={question.difficulty === 'easy' ? 'secondary' : question.difficulty === 'medium' ? 'default' : 'destructive'} className="text-xs">
                {question.difficulty === 'easy' ? '简单' : question.difficulty === 'medium' ? '中等' : '困难'}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {question.points}分
              </span>
            </div>
            <h3 className="font-medium mb-3">{question.title}</h3>
            <div className="mb-4">
              <MathRenderer content={question.content} />
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFlag(question.id)}
            className={flaggedQuestions.has(question.id) ? 'text-chart-4' : ''}
          >
            <Flag className="w-4 h-4" />
          </Button>
        </div>

        {question.type === 'single-choice' && question.options && (
          <RadioGroup
            value={answers[question.id] as string || ''}
            onValueChange={(value) => handleAnswerChange(question.id, value)}
          >
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent/50">
                <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                <Label htmlFor={`${question.id}-${index}`} className="flex-1 cursor-pointer">
                  <MathRenderer content={option} />
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {question.type === 'fill-blank' && (
          <div>
            <Label htmlFor={`answer-${question.id}`} className="text-sm font-medium">
              请填入答案：
            </Label>
            <Textarea
              id={`answer-${question.id}`}
              placeholder="请输入您的答案..."
              value={answers[question.id] as string || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              className="mt-2"
              rows={3}
            />
          </div>
        )}

        {question.type === 'essay' && (
          <div>
            <Label htmlFor={`answer-${question.id}`} className="text-sm font-medium">
              请写出详细解答过程：
            </Label>
            <Textarea
              id={`answer-${question.id}`}
              placeholder="请输入您的解答..."
              value={answers[question.id] as string || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              className="mt-2"
              rows={8}
            />
          </div>
        )}
      </div>
    );
  };

  if (mode === 'result') {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/exams')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回考试列表
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-chart-1" />
              考试结果
            </CardTitle>
            <CardDescription>{examData.title} - {examData.course}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-chart-1">85</div>
                  <p className="text-sm text-muted-foreground">总分</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-chart-2">60/70</div>
                  <p className="text-sm text-muted-foreground">得分</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-chart-3">A-</div>
                  <p className="text-sm text-muted-foreground">等级</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-4">
              <Button className="gap-2">
                <Eye className="w-4 h-4" />
                查看详细解析
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                下载成绩单
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/exams')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            退出考试
          </Button>
          <div>
            <h1 className="font-medium">{examData.title}</h1>
            <p className="text-sm text-muted-foreground">{examData.course}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {mode === 'take' && (
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
              timeRemaining < 300 ? 'bg-destructive/10 text-destructive' : 'bg-muted'
            }`}>
              <Timer className="w-4 h-4" />
              <span className="font-mono font-medium">
                {formatTime(timeRemaining)}
              </span>
            </div>
          )}
          <Button variant="outline" size="sm">
            <Save className="w-4 h-4 mr-2" />
            保存
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Question Navigation Sidebar */}
        <div className="w-64 border-r bg-card p-4 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">答题进度</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>已答题：</span>
                  <span>{getAnsweredCount()}/{examData.questions.length}</span>
                </div>
                <Progress 
                  value={(getAnsweredCount() / examData.questions.length) * 100} 
                  className="h-2" 
                />
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-2">题目导航</h3>
              <div className="grid grid-cols-4 gap-2">
                {examData.questions.map((question, index) => (
                  <Button
                    key={question.id}
                    variant="ghost"
                    size="sm"
                    className={`w-10 h-10 p-0 ${getQuestionStatusColor(question.id)} ${
                      currentQuestionIndex === index ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleQuestionNavigation(index)}
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
              
              <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-chart-1 rounded"></div>
                  <span>已答题</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-chart-4 rounded"></div>
                  <span>已标记</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-muted rounded border"></div>
                  <span>未答题</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    第 {currentQuestionIndex + 1} 题 / 共 {examData.questions.length} 题
                  </CardTitle>
                  <Badge variant="outline">
                    {currentQuestion.points} 分
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {renderQuestionContent(currentQuestion)}
              </CardContent>
            </Card>
          </div>

          {/* Navigation Footer */}
          <div className="border-t bg-card px-6 py-4 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              上一题
            </Button>

            <div className="flex items-center gap-2">
              {mode === 'take' && (
                <Button
                  variant="destructive"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="gap-2"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? '提交中...' : '提交试卷'}
                </Button>
              )}
            </div>

            <Button
              variant="outline"
              onClick={() => setCurrentQuestionIndex(prev => Math.min(examData.questions.length - 1, prev + 1))}
              disabled={currentQuestionIndex === examData.questions.length - 1}
              className="gap-2"
            >
              下一题
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}