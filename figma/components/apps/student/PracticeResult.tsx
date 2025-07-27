import React from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Separator } from '../../ui/separator';
import { 
  CheckCircle,
  XCircle,
  Award,
  Target,
  Clock,
  TrendingUp,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Download,
  Share,
  Star,
  Trophy,
  Brain
} from 'lucide-react';
import UnifiedMathRenderer from '../../common/UnifiedMathRenderer';

interface QuestionResult {
  id: string;
  title: string;
  content: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  points: number;
  earnedPoints: number;
  timeSpent: number;
  difficulty: 'easy' | 'medium' | 'hard';
  chapter: string;
  explanation?: string;
}

const mockResults: QuestionResult[] = [
  {
    id: 'q1',
    title: '极限计算',
    content: '计算极限 $\\lim_{x \\to 0} \\frac{\\sin x}{x}$ 的值是：',
    userAnswer: '1',
    correctAnswer: '1',
    isCorrect: true,
    points: 10,
    earnedPoints: 10,
    timeSpent: 45,
    difficulty: 'easy',
    chapter: '第3章 极限与连续',
    explanation: '这是一个重要极限，$\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$'
  },
  {
    id: 'q2',
    title: '导数计算',
    content: '函数 $f(x) = x^3 - 3x^2 + 2$ 在 $x = 1$ 处的导数值是：',
    userAnswer: '0',
    correctAnswer: '-3',
    isCorrect: false,
    points: 15,
    earnedPoints: 0,
    timeSpent: 120,
    difficulty: 'medium',
    chapter: '第4章 导数与微分',
    explanation: '$f\'(x) = 3x^2 - 6x$，所以 $f\'(1) = 3 - 6 = -3$'
  },
  {
    id: 'q3',
    title: '积分计算',
    content: '计算不定积分：$\\int 2x e^{x^2} dx = $ _____ $+ C$',
    userAnswer: 'e^{x^2}',
    correctAnswer: 'e^{x^2}',
    isCorrect: true,
    points: 20,
    earnedPoints: 20,
    timeSpent: 180,
    difficulty: 'hard',
    chapter: '第5章 积分学',
    explanation: '设 $u = x^2$，则 $du = 2x dx$，所以原积分 = $\\int e^u du = e^u = e^{x^2}$'
  },
  {
    id: 'q4',
    title: '连续性判断',
    content: '函数在 $x = 1$ 处的连续性：',
    userAnswer: '连续',
    correctAnswer: '连续',
    isCorrect: true,
    points: 12,
    earnedPoints: 12,
    timeSpent: 90,
    difficulty: 'medium',
    chapter: '第3章 极限与连续',
    explanation: '$\\lim_{x \\to 1^-} f(x) = 1$, $\\lim_{x \\to 1^+} f(x) = 1$, $f(1) = 1$，三者相等，所以连续'
  },
  {
    id: 'q5',
    title: '应用题',
    content: '优化问题求解',
    userAnswer: '部分正确',
    correctAnswer: '完整解答',
    isCorrect: false,
    points: 25,
    earnedPoints: 15,
    timeSpent: 300,
    difficulty: 'hard',
    chapter: '第4章 导数应用',
    explanation: '需要建立容积函数，然后求极值。完整步骤包括：1)建立函数 2)求导 3)解方程 4)验证'
  }
];

export function PracticeResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const sessionId = searchParams.get('sessionId');
  const mode = searchParams.get('mode') || 'chapter';
  
  // 获取从PracticeSession传递的数据
  const { answers, questions, timeSpent } = location.state || {};
  
  const getModeTitle = () => {
    switch (mode) {
      case 'chapter': return '章节练习';
      case 'errors': return '错题重练';
      case 'simulation': return '模拟练习';
      case 'daily': return '每日一练';
      case 'adaptive': return 'AI智能练习';
      default: return '练习';
    }
  };

  // Calculate statistics
  const totalQuestions = mockResults.length;
  const totalPoints = mockResults.reduce((sum, q) => sum + q.points, 0);
  const earnedPoints = mockResults.reduce((sum, q) => sum + q.earnedPoints, 0);
  const correctAnswers = mockResults.filter(q => q.isCorrect).length;
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
  const totalTime = mockResults.reduce((sum, q) => sum + q.timeSpent, 0);
  const avgTimePerQuestion = Math.round(totalTime / totalQuestions);
  
  const getScoreLevel = () => {
    const percentage = (earnedPoints / totalPoints) * 100;
    if (percentage >= 90) return { level: 'A', color: 'text-chart-1', bgColor: 'bg-chart-1/10' };
    if (percentage >= 80) return { level: 'B', color: 'text-chart-2', bgColor: 'bg-chart-2/10' };
    if (percentage >= 70) return { level: 'C', color: 'text-chart-3', bgColor: 'bg-chart-3/10' };
    return { level: 'D', color: 'text-destructive', bgColor: 'bg-destructive/10' };
  };

  const scoreLevel = getScoreLevel();

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyStats = () => {
    const stats = { easy: 0, medium: 0, hard: 0 };
    const correct = { easy: 0, medium: 0, hard: 0 };
    
    mockResults.forEach(q => {
      stats[q.difficulty]++;
      if (q.isCorrect) correct[q.difficulty]++;
    });

    return { stats, correct };
  };

  const { stats: difficultyStats, correct: difficultyCorrect } = getDifficultyStats();

  const getChapterStats = () => {
    const chapters = new Map();
    mockResults.forEach(q => {
      if (!chapters.has(q.chapter)) {
        chapters.set(q.chapter, { total: 0, correct: 0 });
      }
      const chapterData = chapters.get(q.chapter);
      chapterData.total++;
      if (q.isCorrect) chapterData.correct++;
    });
    return Array.from(chapters.entries());
  };

  const chapterStats = getChapterStats();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/practice')}>
            <ArrowRight className="w-4 h-4 mr-2" />
            返回练习中心
          </Button>
          <div>
            <h1>练习结果</h1>
            <p className="text-muted-foreground">
              {getModeTitle()}完成
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Share className="w-4 h-4" />
            分享成绩
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            下载报告
          </Button>
        </div>
      </div>

      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-chart-1" />
            总体成绩
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className={`w-20 h-20 ${scoreLevel.bgColor} rounded-full flex items-center justify-center mx-auto mb-2`}>
                <span className={`text-2xl font-bold ${scoreLevel.color}`}>
                  {scoreLevel.level}
                </span>
              </div>
              <div className="text-2xl font-bold">{earnedPoints}/{totalPoints}</div>
              <p className="text-sm text-muted-foreground">总分</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-chart-2/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Target className="w-8 h-8 text-chart-2" />
              </div>
              <div className="text-2xl font-bold text-chart-2">{accuracy}%</div>
              <p className="text-sm text-muted-foreground">正确率</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-chart-3/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="w-8 h-8 text-chart-3" />
              </div>
              <div className="text-2xl font-bold text-chart-3">{formatTime(totalTime)}</div>
              <p className="text-sm text-muted-foreground">总用时</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-chart-4/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Award className="w-8 h-8 text-chart-4" />
              </div>
              <div className="text-2xl font-bold text-chart-4">{correctAnswers}/{totalQuestions}</div>
              <p className="text-sm text-muted-foreground">答对题数</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Difficulty Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              难度分析
            </CardTitle>
            <CardDescription>不同难度题目的表现</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(difficultyStats).map(([difficulty, total]) => {
              const correct = difficultyCorrect[difficulty as keyof typeof difficultyCorrect];
              const percentage = total > 0 ? (correct / total) * 100 : 0;
              const label = difficulty === 'easy' ? '简单' : difficulty === 'medium' ? '中等' : '困难';
              
              return (
                <div key={difficulty}>
                  <div className="flex justify-between text-sm mb-2">
                    <span>{label}题</span>
                    <span>{correct}/{total} ({Math.round(percentage)}%)</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Chapter Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              章节分析
            </CardTitle>
            <CardDescription>各章节知识点掌握情况</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {chapterStats.map(([chapter, data]) => {
              const percentage = data.total > 0 ? (data.correct / data.total) * 100 : 0;
              
              return (
                <div key={chapter}>
                  <div className="flex justify-between text-sm mb-2">
                    <span>{chapter}</span>
                    <span>{data.correct}/{data.total} ({Math.round(percentage)}%)</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Results */}
      <Card>
        <CardHeader>
          <CardTitle>详细答题情况</CardTitle>
          <CardDescription>逐题分析和解答</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {mockResults.map((result, index) => (
            <div key={result.id}>
              {index > 0 && <Separator />}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {result.isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-chart-1" />
                    ) : (
                      <XCircle className="w-6 h-6 text-destructive" />
                    )}
                    <div>
                      <h4 className="font-medium">第{index + 1}题: {result.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {result.chapter}
                        </Badge>
                        <Badge variant={
                          result.difficulty === 'easy' ? 'secondary' : 
                          result.difficulty === 'medium' ? 'default' : 'destructive'
                        } className="text-xs">
                          {result.difficulty === 'easy' ? '简单' : 
                           result.difficulty === 'medium' ? '中等' : '困难'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {result.earnedPoints}/{result.points}分 · 用时{formatTime(result.timeSpent)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="ml-9 space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-1">题目:</p>
                    <div className="text-sm">
                      <UnifiedMathRenderer>{result.content}</UnifiedMathRenderer>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-1">您的答案:</p>
                      <div className={`p-2 rounded border text-sm ${
                        result.isCorrect ? 'bg-chart-1/10 border-chart-1' : 'bg-destructive/10 border-destructive'
                      }`}>
                        <UnifiedMathRenderer>{result.userAnswer}</UnifiedMathRenderer>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-1">正确答案:</p>
                      <div className="p-2 rounded border bg-chart-1/10 border-chart-1 text-sm">
                        <UnifiedMathRenderer>{result.correctAnswer}</UnifiedMathRenderer>
                      </div>
                    </div>
                  </div>

                  {result.explanation && (
                    <div>
                      <p className="text-sm font-medium mb-1">解析:</p>
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                        <UnifiedMathRenderer>{result.explanation}</UnifiedMathRenderer>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={() => navigate('/practice')}
        >
          <RotateCcw className="w-4 h-4" />
          再次练习
        </Button>
        <Button 
          className="gap-2"
          onClick={() => navigate('/errors')}
        >
          <Brain className="w-4 h-4" />
          加入错题本
        </Button>
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={() => navigate('/courses')}
        >
          <BookOpen className="w-4 h-4" />
          回到课程
        </Button>
      </div>
    </div>
  );
}