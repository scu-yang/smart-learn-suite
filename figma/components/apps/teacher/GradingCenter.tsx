import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Textarea } from '../../ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { 
  ClipboardCheck,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  FileText,
  Search,
  Filter,
  Star,
  MessageSquare,
  Send,
  Save,
  SkipForward,
  Eye,
  Download,
  BarChart3,
  Zap,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Users,
  Target,
  Calendar,
  Timer,
  Edit
} from 'lucide-react';
import { MixedContentRenderer } from '../../common/MathRenderer';
import { usePermissions, PermissionGuard } from '../../../contexts/PermissionContext';

interface Assignment {
  id: string;
  title: string;
  course: string;
  class: string;
  dueDate: string;
  totalStudents: number;
  submittedStudents: number;
  gradedStudents: number;
  questions: Question[];
  createdAt: string;
}

interface Question {
  id: string;
  title: string;
  description: string;
  type: 'choice' | 'fill' | 'subjective' | 'calculation';
  maxPoints: number;
  isPersonalized: boolean; // 是否为个性化题目
  studentAnswers: StudentAnswer[];
  currentStudentIndex: number; // 当前批改到第几个学生
}

interface StudentAnswer {
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  answer: string;
  submittedAt: string;
  timeSpent: number; // 答题用时（秒）
  aiGrading?: AIGrading;
  teacherGrading?: TeacherGrading;
  status: 'pending' | 'ai-graded' | 'teacher-reviewed' | 'completed';
}

interface AIGrading {
  score: number;
  maxScore: number;
  confidence: number;
  feedback: string;
  keyPoints: string[];
  suggestions: string[];
}

interface TeacherGrading {
  score: number;
  feedback: string;
  comments: string;
  gradedAt: string;
  gradedBy: string;
}

// Mock数据
const mockAssignments: Assignment[] = [
  {
    id: 'a1',
    title: '高等数学A - 第三章测验',
    course: '高等数学A',
    class: '01班',
    dueDate: '2025-01-22 23:59',
    totalStudents: 45,
    submittedStudents: 45,
    gradedStudents: 12,
    createdAt: '2025-01-18',
    questions: [
      {
        id: 'q1',
        title: '极限计算',
        description: '计算函数 $f(x) = \\frac{x^2 - 1}{x - 1}$ 在 $x \\to 1$ 时的极限',
        type: 'calculation',
        maxPoints: 15,
        isPersonalized: false,
        currentStudentIndex: 0,
        studentAnswers: [
          {
            studentId: 's1',
            studentName: '张三',
            studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
            answer: '因为 $f(x) = \\frac{x^2 - 1}{x - 1} = \\frac{(x + 1)(x - 1)}{x - 1} = x + 1$（当 $x \\neq 1$），所以 $\\lim_{x \\to 1} f(x) = 1 + 1 = 2$',
            submittedAt: '2025-01-20 14:30',
            timeSpent: 180,
            status: 'ai-graded',
            aiGrading: {
              score: 14,
              maxScore: 15,
              confidence: 0.95,
              feedback: '解答过程清晰，运用了因式分解和约分的方法，结果正确。',
              keyPoints: ['正确运用了因式分解', '约分过程正确', '极限值计算准确'],
              suggestions: ['可以加上连续性验证步骤']
            }
          },
          {
            studentId: 's2',
            studentName: '李四',
            studentAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5b5?w=32&h=32&fit=crop&crop=face',
            answer: '直接代入 $x = 1$，得到 $f(1) = \\frac{1 - 1}{1 - 1} = \\frac{0}{0}$，这是未定义的。',
            submittedAt: '2025-01-20 15:15',
            timeSpent: 120,
            status: 'ai-graded',
            aiGrading: {
              score: 5,
              maxScore: 15,
              confidence: 0.88,
              feedback: '识别了0/0型未定式，但没有进一步求解极限。需要使用洛必达法则或因式分解方法。',
              keyPoints: ['正确识别了未定式'],
              suggestions: ['需要学习极限的求解方法', '可尝试因式分解或洛必达法则']
            }
          }
        ]
      },
      {
        id: 'q2',
        title: '导数应用',
        description: '求函数 $f(x) = x^3 - 3x^2 + 2$ 的极值点',
        type: 'calculation',
        maxPoints: 20,
        isPersonalized: false,
        currentStudentIndex: 0,
        studentAnswers: [
          {
            studentId: 's1',
            studentName: '张三',
            answer: "$f'(x) = 3x^2 - 6x = 3x(x - 2)$，令 $f'(x) = 0$，得 $x = 0$ 或 $x = 2$。$f''(x) = 6x - 6$，$f''(0) = -6 < 0$，所以 $x = 0$ 是极大值点；$f''(2) = 6 > 0$，所以 $x = 2$ 是极小值点。",
            submittedAt: '2025-01-20 14:35',
            timeSpent: 240,
            status: 'ai-graded',
            aiGrading: {
              score: 19,
              maxScore: 20,
              confidence: 0.98,
              feedback: '解答完整准确，正确运用了一阶导数和二阶导数判别法。',
              keyPoints: ['正确求出一阶导数', '正确求出驻点', '正确运用二阶导数判别法'],
              suggestions: ['可以计算出极值的具体数值']
            }
          },
          {
            studentId: 's2',
            studentName: '李四',
            answer: "$f'(x) = 3x^2 - 6x$，令 $f'(x) = 0$，得到 $x = 0$ 和 $x = 2$。",
            submittedAt: '2025-01-20 15:20',
            timeSpent: 90,
            status: 'ai-graded',
            aiGrading: {
              score: 10,
              maxScore: 20,
              confidence: 0.85,
              feedback: '找到了驻点，但没有判断极值的性质。需要使用二阶导数判别法或一阶导数符号变化法。',
              keyPoints: ['正确求出一阶导数', '正确求出驻点'],
              suggestions: ['需要判断极值点的性质', '学习二阶导数判别法']
            }
          }
        ]
      },
      {
        id: 'q3',
        title: '个性化拓展题',
        description: '证明：如果函数在某点连续，则在该点局部有界',
        type: 'subjective',
        maxPoints: 25,
        isPersonalized: true, // 个性化题目，只有部分学生做
        currentStudentIndex: 0,
        studentAnswers: [
          {
            studentId: 's1',
            studentName: '张三',
            answer: '设函数 $f$ 在点 $x_0$ 处连续，即 $\\lim_{x \\to x_0} f(x) = f(x_0)$。根据极限定义，对于 $\\varepsilon = 1$，存在 $\\delta > 0$，使得当 $|x - x_0| < \\delta$ 时，有 $|f(x) - f(x_0)| < 1$，即 $f(x_0) - 1 < f(x) < f(x_0) + 1$。因此在区间 $(x_0 - \\delta, x_0 + \\delta)$ 内，$f(x)$ 被 $\\max\\{f(x_0) - 1, f(x_0) + 1\\}$ 所界定，所以 $f$ 在 $x_0$ 处局部有界。',
            submittedAt: '2025-01-20 14:45',
            timeSpent: 600,
            status: 'ai-graded',
            aiGrading: {
              score: 22,
              maxScore: 25,
              confidence: 0.92,
              feedback: '证明思路正确，运用了连续性定义和极限的ε-δ定义，逻辑清晰。',
              keyPoints: ['正确运用连续性定义', '合理选择ε值', '证明过程逻辑严密'],
              suggestions: ['可以更明确地表述有界性的结论']
            }
          }
          // 注意：个性化题目只有部分学生需要做，所以studentAnswers数组可能较短
        ]
      }
    ]
  },
  {
    id: 'a2',
    title: '线性代数 - 期中考试',
    course: '线性代数',
    class: '02班',
    dueDate: '2025-01-25 16:00',
    totalStudents: 38,
    submittedStudents: 28,
    gradedStudents: 0,
    createdAt: '2025-01-22',
    questions: []
  }
];

export function GradingCenter() {
  const { hasPermission, isTeacher } = usePermissions();
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [currentStudentAnswer, setCurrentStudentAnswer] = useState<StudentAnswer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [teacherScore, setTeacherScore] = useState<number>(0);
  const [teacherFeedback, setTeacherFeedback] = useState('');
  const [teacherComments, setTeacherComments] = useState('');

  // 当选择作业时，自动选择第一个题目
  useEffect(() => {
    if (selectedAssignment && selectedAssignment.questions.length > 0) {
      const firstQuestion = selectedAssignment.questions[0];
      setSelectedQuestion(firstQuestion);
      if (firstQuestion.studentAnswers.length > 0) {
        setCurrentStudentAnswer(firstQuestion.studentAnswers[firstQuestion.currentStudentIndex]);
        setTeacherScore(firstQuestion.studentAnswers[firstQuestion.currentStudentIndex].aiGrading?.score || 0);
      }
    }
  }, [selectedAssignment]);

  // 当选择题目时，设置当前学生答案
  useEffect(() => {
    if (selectedQuestion && selectedQuestion.studentAnswers.length > 0) {
      const currentAnswer = selectedQuestion.studentAnswers[selectedQuestion.currentStudentIndex];
      setCurrentStudentAnswer(currentAnswer);
      setTeacherScore(currentAnswer.aiGrading?.score || 0);
      setTeacherFeedback('');
      setTeacherComments('');
    }
  }, [selectedQuestion]);

  const filteredAssignments = mockAssignments.filter(assignment =>
    assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assignment.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNextStudent = () => {
    if (!selectedQuestion || !selectedAssignment) return;

    // 保存当前批改结果
    if (currentStudentAnswer) {
      currentStudentAnswer.teacherGrading = {
        score: teacherScore,
        feedback: teacherFeedback,
        comments: teacherComments,
        gradedAt: new Date().toISOString(),
        gradedBy: '张教授'
      };
      currentStudentAnswer.status = 'completed';
    }

    // 移动到下一个学生
    const currentIndex = selectedQuestion.currentStudentIndex;
    if (currentIndex < selectedQuestion.studentAnswers.length - 1) {
      // 还有下一个学生
      selectedQuestion.currentStudentIndex = currentIndex + 1;
      const nextAnswer = selectedQuestion.studentAnswers[currentIndex + 1];
      setCurrentStudentAnswer(nextAnswer);
      setTeacherScore(nextAnswer.aiGrading?.score || 0);
      setTeacherFeedback('');
      setTeacherComments('');
    } else {
      // 当前题目所有学生都批改完了，移动到下一个题目
      const questionIndex = selectedAssignment.questions.findIndex(q => q.id === selectedQuestion.id);
      if (questionIndex < selectedAssignment.questions.length - 1) {
        const nextQuestion = selectedAssignment.questions[questionIndex + 1];
        setSelectedQuestion(nextQuestion);
      } else {
        // 所有题目都批改完了
        alert('当前作业所有题目都已批改完成！');
      }
    }
  };

  const handlePreviousStudent = () => {
    if (!selectedQuestion) return;

    const currentIndex = selectedQuestion.currentStudentIndex;
    if (currentIndex > 0) {
      selectedQuestion.currentStudentIndex = currentIndex - 1;
      const prevAnswer = selectedQuestion.studentAnswers[currentIndex - 1];
      setCurrentStudentAnswer(prevAnswer);
      setTeacherScore(prevAnswer.teacherGrading?.score || prevAnswer.aiGrading?.score || 0);
      setTeacherFeedback(prevAnswer.teacherGrading?.feedback || '');
      setTeacherComments(prevAnswer.teacherGrading?.comments || '');
    }
  };

  const getQuestionProgress = (question: Question) => {
    const completed = question.studentAnswers.filter(answer => answer.status === 'completed').length;
    return (completed / question.studentAnswers.length) * 100;
  };

  const getQuestionStatusIcon = (question: Question) => {
    const progress = getQuestionProgress(question);
    if (progress === 100) {
      return <CheckCircle className="w-4 h-4 text-chart-1" />;
    } else if (progress > 0) {
      return <Clock className="w-4 h-4 text-chart-3" />;
    } else {
      return <AlertCircle className="w-4 h-4 text-chart-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1>批改中心</h1>
          <p className="text-muted-foreground">AI辅助批改，按题目批改模式</p>
        </div>
        <div className="flex gap-2">
          <PermissionGuard module="learningDataView" action="view">
            <Button variant="outline" className="gap-2">
              <BarChart3 className="w-4 w-4" />
              批改统计
            </Button>
          </PermissionGuard>
          <PermissionGuard module="learningDataView" action="view">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              导出成绩
            </Button>
          </PermissionGuard>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-4">
              {mockAssignments.reduce((sum, a) => sum + (a.submittedStudents - a.gradedStudents), 0)}
            </div>
            <p className="text-sm text-muted-foreground">待批改</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-1">
              {mockAssignments.reduce((sum, a) => sum + a.gradedStudents, 0)}
            </div>
            <p className="text-sm text-muted-foreground">已完成</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-2">
              {mockAssignments.length}
            </div>
            <p className="text-sm text-muted-foreground">待批作业</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-3">
              {Math.round((mockAssignments.reduce((sum, a) => sum + a.gradedStudents, 0) / 
                mockAssignments.reduce((sum, a) => sum + a.submittedStudents, 0)) * 100) || 0}%
            </div>
            <p className="text-sm text-muted-foreground">完成率</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Assignment and Question Selection */}
        <div className="lg:col-span-1 space-y-4">
          {/* Assignment List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5" />
                待批改作业
              </CardTitle>
              <CardDescription>选择要批改的作业</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="搜索作业..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {filteredAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                      selectedAssignment?.id === assignment.id ? 'ring-2 ring-primary bg-accent/50' : ''
                    }`}
                    onClick={() => setSelectedAssignment(assignment)}
                  >
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">{assignment.title}</h4>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{assignment.course} · {assignment.class}</span>
                        <span>{assignment.submittedStudents}/{assignment.totalStudents}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(assignment.gradedStudents / assignment.submittedStudents) * 100} 
                          className="flex-1 h-1.5" 
                        />
                        <span className="text-xs">
                          {Math.round((assignment.gradedStudents / assignment.submittedStudents) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Question List */}
          {selectedAssignment && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  题目列表
                </CardTitle>
                <CardDescription>选择要批改的题目</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedAssignment.questions.map((question, index) => (
                    <div
                      key={question.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                        selectedQuestion?.id === question.id ? 'ring-2 ring-primary bg-accent/50' : ''
                      }`}
                      onClick={() => setSelectedQuestion(question)}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">第{index + 1}题</span>
                              {question.isPersonalized && (
                                <Badge variant="secondary" className="text-xs">个性化</Badge>
                              )}
                              {getQuestionStatusIcon(question)}
                            </div>
                            <h4 className="font-medium text-sm mt-1">{question.title}</h4>
                            <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              <MixedContentRenderer content={question.description} />
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground text-right">
                            <div>{question.maxPoints}分</div>
                            <div>{question.studentAnswers.length}人</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Progress value={getQuestionProgress(question)} className="flex-1 h-1.5" />
                          <span className="text-xs">
                            {question.studentAnswers.filter(a => a.status === 'completed').length}/
                            {question.studentAnswers.length}
                          </span>
                        </div>

                        {selectedQuestion?.id === question.id && (
                          <div className="text-xs text-muted-foreground">
                            当前：{question.currentStudentIndex + 1}/{question.studentAnswers.length} 
                            ({question.studentAnswers[question.currentStudentIndex]?.studentName})
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Student Answer and AI Grading */}
        <div className="lg:col-span-2 space-y-4">
          {currentStudentAnswer && selectedQuestion ? (
            <>
              {/* Student Answer Section */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={currentStudentAnswer.studentAvatar} />
                        <AvatarFallback>{currentStudentAnswer.studentName.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{currentStudentAnswer.studentName}</CardTitle>
                        <CardDescription>
                          {selectedQuestion.title} · {selectedQuestion.maxPoints}分 · 
                          用时 {Math.floor(currentStudentAnswer.timeSpent / 60)}分{currentStudentAnswer.timeSpent % 60}秒
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {selectedQuestion.currentStudentIndex + 1}/{selectedQuestion.studentAnswers.length}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePreviousStudent}
                        disabled={selectedQuestion.currentStudentIndex === 0}
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNextStudent}
                        disabled={selectedQuestion.currentStudentIndex === selectedQuestion.studentAnswers.length - 1 && 
                                 selectedAssignment?.questions.findIndex(q => q.id === selectedQuestion.id) === selectedAssignment?.questions.length - 1}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">题目</h4>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="text-sm">
                        <MixedContentRenderer content={selectedQuestion.description} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">学生答案</h4>
                    <div className="p-3 border rounded-lg">
                      <div className="text-sm whitespace-pre-wrap">
                        <MixedContentRenderer content={currentStudentAnswer.answer} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>提交时间：{new Date(currentStudentAnswer.submittedAt).toLocaleString('zh-CN')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Timer className="w-3 h-3" />
                      <span>答题用时：{Math.floor(currentStudentAnswer.timeSpent / 60)}分{currentStudentAnswer.timeSpent % 60}秒</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Grading and Teacher Review Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-chart-2" />
                    AI智能批改
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentStudentAnswer.aiGrading && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">AI建议分数</span>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-chart-2">
                                {currentStudentAnswer.aiGrading.score}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                /{currentStudentAnswer.aiGrading.maxScore}
                              </span>
                            </div>
                          </div>
                          <Progress 
                            value={(currentStudentAnswer.aiGrading.score / currentStudentAnswer.aiGrading.maxScore) * 100} 
                            className="h-2" 
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">AI置信度</span>
                            <span className="font-medium">
                              {Math.round(currentStudentAnswer.aiGrading.confidence * 100)}%
                            </span>
                          </div>
                          <Progress value={currentStudentAnswer.aiGrading.confidence * 100} className="h-2" />
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">AI评价</h4>
                        <div className="p-3 bg-chart-2/10 border border-chart-2/20 rounded-lg">
                          <p className="text-sm">{currentStudentAnswer.aiGrading.feedback}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2 text-chart-1">答题亮点</h4>
                          <ul className="space-y-1">
                            {currentStudentAnswer.aiGrading.keyPoints.map((point, index) => (
                              <li key={index} className="text-sm flex items-start gap-2">
                                <CheckCircle className="w-3 h-3 text-chart-1 mt-0.5 flex-shrink-0" />
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2 text-chart-4">改进建议</h4>
                          <ul className="space-y-1">
                            {currentStudentAnswer.aiGrading.suggestions.map((suggestion, index) => (
                              <li key={index} className="text-sm flex items-start gap-2">
                                <AlertCircle className="w-3 h-3 text-chart-4 mt-0.5 flex-shrink-0" />
                                <span>{suggestion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="gap-2">
                          <ThumbsUp className="w-3 h-3" />
                          采纳AI建议
                        </Button>
                        <Button size="sm" variant="outline" className="gap-2">
                          <ThumbsDown className="w-3 h-3" />
                          不同意AI评分
                        </Button>
                      </div>
                    </>
                  )}

                  {/* Teacher Grading Section */}
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">教师批改</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">最终得分</label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min="0"
                              max={selectedQuestion.maxPoints}
                              value={teacherScore}
                              onChange={(e) => setTeacherScore(Number(e.target.value))}
                              className="w-20"
                            />
                            <span className="text-sm text-muted-foreground">
                              / {selectedQuestion.maxPoints} 分
                            </span>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">评价等级</label>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-chart-1" />
                            <Star className="w-4 h-4 text-chart-1" />
                            <Star className="w-4 h-4 text-chart-1" />
                            <Star className="w-4 h-4 text-muted-foreground" />
                            <Star className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">评语</label>
                        <Textarea
                          placeholder="请输入对该学生答案的评语..."
                          value={teacherFeedback}
                          onChange={(e) => setTeacherFeedback(e.target.value)}
                          className="min-h-20"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">备注</label>
                        <Textarea
                          placeholder="内部备注（学生不可见）..."
                          value={teacherComments}
                          onChange={(e) => setTeacherComments(e.target.value)}
                          className="min-h-16"
                        />
                      </div>

                      <div className="flex gap-2 pt-4 border-t">
                        <Button onClick={handleNextStudent} className="gap-2">
                          <Save className="w-4 h-4" />
                          保存并下一个
                        </Button>
                        <Button variant="outline" className="gap-2">
                          <Save className="w-4 h-4" />
                          仅保存
                        </Button>
                        <Button variant="outline" className="gap-2">
                          <MessageSquare className="w-4 h-4" />
                          私信学生
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2" onClick={handleNextStudent}>
                          <SkipForward className="w-4 h-4" />
                          跳过
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <ClipboardCheck className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">选择作业和题目开始批改</h3>
                <p className="text-muted-foreground">
                  从左侧选择要批改的作业和具体题目
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}