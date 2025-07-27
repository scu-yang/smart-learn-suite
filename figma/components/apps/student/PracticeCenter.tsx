import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { 
  Target,
  RefreshCw,
  Clock,
  Calendar,
  Trophy,
  Brain,
  BookOpen,
  Zap,
  BarChart3,
  CheckCircle,
  Star,
  Play,
  Settings,
  Filter,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useIsMobile } from '../../ui/use-mobile';

interface PracticeMode {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  stats?: {
    completed: number;
    accuracy: number;
    timeSpent: number;
  };
  available: boolean;
}

interface Chapter {
  id: string;
  name: string;
  progress: number;
  totalQuestions: number;
  completedQuestions: number;
  avgAccuracy: number;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number;
  lastPracticed?: string;
}

interface ErrorType {
  id: string;
  name: string;
  count: number;
  accuracy: number;
  lastReview?: string;
  priority: 'high' | 'medium' | 'low';
}

const practiceModes: PracticeMode[] = [
  {
    id: 'chapter',
    title: '章节练习',
    description: '按知识点系统学习，巩固基础',
    icon: BookOpen,
    color: 'text-chart-1',
    bgColor: 'bg-chart-1/10',
    stats: {
      completed: 45,
      accuracy: 87,
      timeSpent: 120
    },
    available: true
  },
  {
    id: 'errors',
    title: '错题重练',
    description: '针对性复习错题，提升薄弱点',
    icon: RefreshCw,
    color: 'text-chart-2',
    bgColor: 'bg-chart-2/10',
    stats: {
      completed: 23,
      accuracy: 78,
      timeSpent: 45
    },
    available: true
  },
  {
    id: 'simulation',
    title: '模拟考试',
    description: '仿真考试环境，检验学习效果',
    icon: Target,
    color: 'text-chart-3',
    bgColor: 'bg-chart-3/10',
    stats: {
      completed: 8,
      accuracy: 82,
      timeSpent: 180
    },
    available: true
  },
  {
    id: 'daily',
    title: '每日一练',
    description: '每天坚持练习，养成学习习惯',
    icon: Calendar,
    color: 'text-chart-4',
    bgColor: 'bg-chart-4/10',
    stats: {
      completed: 12,
      accuracy: 85,
      timeSpent: 30
    },
    available: true
  },
  {
    id: 'adaptive',
    title: '智能练习',
    description: 'AI推荐题目，个性化学习路径',
    icon: Brain,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    available: false
  },
  {
    id: 'speed',
    title: '限时冲刺',
    description: '提高答题速度，训练考试状态',
    icon: Zap,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    available: false
  }
];

const chapters: Chapter[] = [
  {
    id: 'ch1',
    name: '第一章 函数与极限',
    progress: 85,
    totalQuestions: 50,
    completedQuestions: 42,
    avgAccuracy: 88,
    difficulty: 'medium',
    estimatedTime: 45,
    lastPracticed: '昨天'
  },
  {
    id: 'ch2',
    name: '第二章 导数与微分',
    progress: 70,
    totalQuestions: 45,
    completedQuestions: 32,
    avgAccuracy: 82,
    difficulty: 'medium',
    estimatedTime: 40,
    lastPracticed: '3天前'
  },
  {
    id: 'ch3',
    name: '第三章 导数应用',
    progress: 45,
    totalQuestions: 40,
    completedQuestions: 18,
    avgAccuracy: 79,
    difficulty: 'hard',
    estimatedTime: 50,
    lastPracticed: '1周前'
  },
  {
    id: 'ch4',
    name: '第四章 不定积分',
    progress: 20,
    totalQuestions: 38,
    completedQuestions: 8,
    avgAccuracy: 75,
    difficulty: 'hard',
    estimatedTime: 55
  }
];

const errorTypes: ErrorType[] = [
  {
    id: 'calculation',
    name: '计算错误',
    count: 12,
    accuracy: 65,
    lastReview: '2天前',
    priority: 'high'
  },
  {
    id: 'concept',
    name: '概念理解',
    count: 8,
    accuracy: 70,
    lastReview: '1天前',
    priority: 'medium'
  },
  {
    id: 'method',
    name: '方法应用',
    count: 15,
    accuracy: 60,
    priority: 'high'
  },
  {
    id: 'careless',
    name: '粗心大意',
    count: 6,
    accuracy: 80,
    lastReview: '3天前',
    priority: 'low'
  }
];

const difficultyConfig = {
  easy: { label: '简单', color: 'bg-chart-2/20 text-chart-2' },
  medium: { label: '中等', color: 'bg-chart-4/20 text-chart-4' },
  hard: { label: '困难', color: 'bg-destructive/20 text-destructive' }
};

const priorityConfig = {
  high: { label: '高', color: 'bg-destructive/20 text-destructive' },
  medium: { label: '中', color: 'bg-chart-4/20 text-chart-4' },
  low: { label: '低', color: 'bg-chart-2/20 text-chart-2' }
};

export function PracticeCenter() {
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const studyStats = {
    totalTime: 285, // minutes today
    dailyStreak: 7,
    weeklyGoal: 300,
    weeklyProgress: 85,
    totalQuestions: 156,
    correctRate: 84
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handleStartPractice = (mode: string, chapterId?: string, timeLimit?: number) => {
    const sessionId = `session_${Date.now()}`;
    const params = new URLSearchParams({
      mode,
      ...(chapterId && { chapterId }),
      ...(timeLimit && { timeLimit: timeLimit.toString() })
    });
    navigate(`/practice/session/${sessionId}?${params.toString()}`);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl">练习中心</h1>
          <p className="text-muted-foreground text-sm sm:text-base">多种练习模式，提升学习效果</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-chart-1">
            <Trophy className="w-4 h-4" />
            <span className="text-sm font-medium">
              {isMobile ? `${studyStats.dailyStreak}天` : `连续学习 ${studyStats.dailyStreak} 天`}
            </span>
          </div>
          <Button variant="outline" size="icon" onClick={() => setShowSettings(!showSettings)}>
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Today's Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
            今日学习概况
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold text-chart-1">{formatTime(studyStats.totalTime)}</div>
              <p className="text-xs sm:text-sm text-muted-foreground">学习时长</p>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold text-chart-2">{studyStats.totalQuestions}</div>
              <p className="text-xs sm:text-sm text-muted-foreground">练习题数</p>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold text-chart-3">{studyStats.correctRate}%</div>
              <p className="text-xs sm:text-sm text-muted-foreground">正确率</p>
            </div>
            <div className="text-center">
              <div className="space-y-1">
                <div className="text-sm font-medium">周目标: {studyStats.weeklyProgress}%</div>
                <Progress value={studyStats.weeklyProgress} className="h-2" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">周进度</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Practice Modes */}
      <div>
        <h2 className="mb-4 text-lg sm:text-xl">练习模式</h2>
        <div className={`grid grid-cols-1 ${isMobile ? 'sm:grid-cols-2 gap-3' : 'md:grid-cols-2 lg:grid-cols-3 gap-4'}`}>
          {practiceModes.map((mode) => {
            const Icon = mode.icon;
            return (
              <Card 
                key={mode.id} 
                className={`group hover:shadow-lg transition-all duration-200 cursor-pointer ${
                  !mode.available ? 'opacity-60' : ''
                }`}
                onClick={() => mode.available && setSelectedMode(mode.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 ${mode.bgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${mode.color}`} />
                    </div>
                    {!mode.available && (
                      <Badge variant="secondary" className="text-xs">
                        即将推出
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-base sm:text-lg">{mode.title}</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">{mode.description}</CardDescription>
                  </div>
                </CardHeader>
                
                {mode.stats && (
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-sm font-medium">{mode.stats.completed}</div>
                        <div className="text-xs text-muted-foreground">已完成</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-chart-1">{mode.stats.accuracy}%</div>
                        <div className="text-xs text-muted-foreground">正确率</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">{formatTime(mode.stats.timeSpent)}</div>
                        <div className="text-xs text-muted-foreground">总时长</div>
                      </div>
                    </div>
                    
                    {mode.available && (
                      <Button 
                        className="w-full mt-4 group-hover:bg-primary/90 transition-colors"
                        size={isMobile ? 'sm' : 'default'}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartPractice(mode.id);
                        }}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        开始练习
                      </Button>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Detailed Content based on selected mode */}
      {selectedMode === 'chapter' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              章节练习
            </CardTitle>
            <CardDescription className="text-sm">选择章节开始系统练习</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            {chapters.map((chapter) => (
              <Card key={chapter.id} className="group hover:shadow-sm transition-shadow">
                <CardContent className="p-3 sm:p-4">
                  <div className={`flex ${isMobile ? 'flex-col gap-3' : 'items-center justify-between'} mb-3`}>
                    <div className="space-y-1 flex-1">
                      <h4 className="font-medium text-sm sm:text-base">{chapter.name}</h4>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={`${difficultyConfig[chapter.difficulty].color} text-xs`}>
                          {difficultyConfig[chapter.difficulty].label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          预计 {chapter.estimatedTime} 分钟
                        </span>
                        {chapter.lastPracticed && (
                          <span className="text-xs text-muted-foreground">
                            上次练习: {chapter.lastPracticed}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className={`${isMobile ? 'w-full' : 'opacity-0 group-hover:opacity-100 transition-opacity'}`}
                      onClick={() => handleStartPractice('chapter', chapter.id, chapter.estimatedTime * 60)}
                    >
                      开始练习
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-3">
                    <div className="text-center">
                      <div className="text-sm sm:text-lg font-bold">{chapter.completedQuestions}/{chapter.totalQuestions}</div>
                      <div className="text-xs text-muted-foreground">题目进度</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm sm:text-lg font-bold text-chart-1">{chapter.avgAccuracy}%</div>
                      <div className="text-xs text-muted-foreground">平均正确率</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm sm:text-lg font-bold">{chapter.progress}%</div>
                      <div className="text-xs text-muted-foreground">掌握程度</div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span>完成进度</span>
                      <span>{chapter.progress}%</span>
                    </div>
                    <Progress value={chapter.progress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {selectedMode === 'errors' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
              错题重练
            </CardTitle>
            <CardDescription className="text-sm">根据错误类型针对性复习</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            {errorTypes.map((errorType) => (
              <Card key={errorType.id} className="group hover:shadow-sm transition-shadow">
                <CardContent className="p-3 sm:p-4">
                  <div className={`flex ${isMobile ? 'flex-col gap-3' : 'items-center justify-between'} mb-3`}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-destructive/10 rounded-lg flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-destructive" />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <h4 className="font-medium text-sm sm:text-base">{errorType.name}</h4>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={`${priorityConfig[errorType.priority].color} text-xs`}>
                            优先级{priorityConfig[errorType.priority].label}
                          </Badge>
                          {errorType.lastReview && (
                            <span className="text-xs text-muted-foreground">
                              上次复习: {errorType.lastReview}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant={errorType.priority === 'high' ? 'default' : 'outline'}
                      className={isMobile ? 'w-full' : 'shrink-0'}
                      onClick={() => handleStartPractice('errors', errorType.id)}
                    >
                      开始复习
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:gap-4">
                    <div className="text-center">
                      <div className="text-sm sm:text-lg font-bold text-destructive">{errorType.count}</div>
                      <div className="text-xs text-muted-foreground">错题数量</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm sm:text-lg font-bold text-chart-1">{errorType.accuracy}%</div>
                      <div className="text-xs text-muted-foreground">复习正确率</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm sm:text-lg font-bold">
                        {errorType.count > 10 ? '高' : errorType.count > 5 ? '中' : '低'}
                      </div>
                      <div className="text-xs text-muted-foreground">重要程度</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {selectedMode === 'simulation' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Target className="w-4 h-4 sm:w-5 sm:h-5" />
              模拟考试
            </CardTitle>
            <CardDescription className="text-sm">在仿真环境中检验学习成果</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className={`grid grid-cols-1 ${isMobile ? 'gap-3' : 'md:grid-cols-2 gap-4'}`}>
              {[
                {
                  id: 'midterm',
                  title: '期中模拟考试',
                  description: '覆盖第1-4章内容',
                  duration: 90,
                  questions: 25,
                  difficulty: 'medium',
                  lastScore: 85
                },
                {
                  id: 'final',
                  title: '期末模拟考试',
                  description: '全册内容综合测试',
                  duration: 120,
                  questions: 30,
                  difficulty: 'hard',
                  lastScore: null
                },
                {
                  id: 'quick',
                  title: '快速测验',
                  description: '15分钟小测验',
                  duration: 15,
                  questions: 10,
                  difficulty: 'easy',
                  lastScore: 92
                }
              ].map((exam) => (
                <Card key={exam.id} className="group hover:shadow-sm transition-shadow">
                  <CardContent className="p-3 sm:p-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm sm:text-base">{exam.title}</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground">{exam.description}</p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={`${difficultyConfig[exam.difficulty as keyof typeof difficultyConfig].color} text-xs`}>
                          {difficultyConfig[exam.difficulty as keyof typeof difficultyConfig].label}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{exam.duration}分钟</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Target className="w-3 h-3" />
                          <span>{exam.questions}题</span>
                        </div>
                      </div>

                      {exam.lastScore && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-chart-1" />
                          <span className="text-xs sm:text-sm">上次得分: {exam.lastScore}分</span>
                        </div>
                      )}

                      <Button 
                        className="w-full"
                        size={isMobile ? 'sm' : 'default'}
                        onClick={() => handleStartPractice('simulation', exam.id, exam.duration * 60)}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        开始考试
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedMode === 'daily' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              每日一练
            </CardTitle>
            <CardDescription className="text-sm">每天坚持练习，养成学习习惯</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4 sm:p-6 border-2 border-dashed border-muted-foreground/25 rounded-lg">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-chart-1/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-chart-1" />
              </div>
              <h3 className="font-medium mb-2 text-sm sm:text-base">今日练习</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                已为您准备了5道精选题目，预计用时15分钟
              </p>
              <Button 
                size={isMobile ? 'sm' : 'lg'}
                className="gap-2"
                onClick={() => handleStartPractice('daily', undefined, 15 * 60)}
              >
                <Play className="w-4 h-4" />
                开始今日练习
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {Array.from({ length: 7 }, (_, i) => {
                const isCompleted = i < 6; // Mock completed days
                const isToday = i === 6;
                return (
                  <div 
                    key={i}
                    className={`aspect-square rounded-lg border-2 flex items-center justify-center text-xs font-medium ${
                      isCompleted 
                        ? 'bg-chart-1 border-chart-1 text-white' 
                        : isToday
                        ? 'border-chart-1 text-chart-1'
                        : 'border-muted text-muted-foreground'
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" /> : i + 1}
                  </div>
                );
              })}
            </div>

            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <Trophy className="w-4 h-4 text-chart-1" />
                <span>连续打卡 {studyStats.dailyStreak} 天，继续保持！</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}