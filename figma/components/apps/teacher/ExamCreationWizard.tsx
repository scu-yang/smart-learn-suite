import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Separator } from '../../ui/separator';
import { Checkbox } from '../../ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { Switch } from '../../ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { 
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Users,
  Target,
  Brain,
  FileQuestion,
  Settings,
  ChevronDown,
  Plus,
  Trash2,
  Copy,
  Save,
  Send,
  BarChart3,
  Shield,
  Eye,
  Shuffle
} from 'lucide-react';
import { MathRenderer, DisplayMath } from '../../common/MathRenderer';

interface Question {
  id: string;
  title: string;
  content: string;
  type: 'single-choice' | 'multiple-choice' | 'fill-blank' | 'essay';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  chapter: string;
  knowledgePoint: string;
  options?: string[];
  estimatedTime: number; // minutes
}

interface ExamConfig {
  // Basic Settings
  name: string;
  type: 'practice' | 'assignment' | 'quiz' | 'exam';
  description: string;
  knowledgePoints: string[];
  targetClasses: string[];
  startTime: string;
  endTime: string;
  timeLimit: number; // minutes
  
  // Questions
  commonQuestions: Question[]; // Nc
  personalizedQuestions: {
    count: number;
    strategy: 'random' | 'weakness' | 'adaptive' | 'layered';
    difficultyRange: [number, number];
  };
  
  // Advanced Settings
  questionOrder: 'fixed' | 'random';
  optionOrder: 'fixed' | 'random';
  antiCheat: {
    tabSwitchDetection: boolean;
    cameraMonitoring: boolean;
    timeTracking: boolean;
  };
  gradeRelease: 'immediate' | 'manual' | 'scheduled';
  gradeReleaseTime?: string;
}

const mockQuestions: Question[] = [
  {
    id: 'q1',
    title: '极限计算',
    content: '计算极限 $\\lim_{x \\to 0} \\frac{\\sin x}{x}$ 的值：',
    type: 'single-choice',
    difficulty: 'easy',
    points: 10,
    chapter: '第3章 极限与连续',
    knowledgePoint: '极限计算',
    options: ['0', '1', '∞', '不存在'],
    estimatedTime: 3
  },
  {
    id: 'q2',
    title: '导数应用',
    content: '求函数 $f(x) = x^3 - 3x^2 + 2$ 的极值：',
    type: 'essay',
    difficulty: 'medium',
    points: 20,
    chapter: '第4章 导数与微分',
    knowledgePoint: '极值问题',
    estimatedTime: 8
  },
  {
    id: 'q3',
    title: '积分计算',
    content: '计算不定积分 $\\int x^2 e^x dx$ =',
    type: 'fill-blank',
    difficulty: 'hard',
    points: 15,
    chapter: '第5章 积分学',
    knowledgePoint: '分部积分',
    estimatedTime: 10
  }
];

const mockClasses = [
  { id: 'c1', name: '高等数学A-01班', students: 45 },
  { id: 'c2', name: '高等数学A-02班', students: 42 },
  { id: 'c3', name: '高等数学A-03班', students: 38 }
];

export function ExamCreationWizard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const knowledgePoint = searchParams.get('knowledgePoint');
  
  const [currentStep, setCurrentStep] = useState(1);
  const [examConfig, setExamConfig] = useState<ExamConfig>({
    name: '',
    type: 'assignment',
    description: '',
    knowledgePoints: knowledgePoint ? [knowledgePoint] : [],
    targetClasses: [],
    startTime: '',
    endTime: '',
    timeLimit: 90,
    commonQuestions: [],
    personalizedQuestions: {
      count: 5,
      strategy: 'random',
      difficultyRange: [1, 3]
    },
    questionOrder: 'fixed',
    optionOrder: 'fixed',
    antiCheat: {
      tabSwitchDetection: false,
      cameraMonitoring: false,
      timeTracking: true
    },
    gradeRelease: 'immediate'
  });

  const totalSteps = 3;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFinish = () => {
    // Save exam configuration and navigate back
    console.log('Exam configuration:', examConfig);
    navigate(-1);
  };

  const addCommonQuestion = (question: Question) => {
    setExamConfig(prev => ({
      ...prev,
      commonQuestions: [...prev.commonQuestions, question]
    }));
  };

  const removeCommonQuestion = (questionId: string) => {
    setExamConfig(prev => ({
      ...prev,
      commonQuestions: prev.commonQuestions.filter(q => q.id !== questionId)
    }));
  };

  const getEstimatedTotalTime = () => {
    const commonTime = examConfig.commonQuestions.reduce((sum, q) => sum + q.estimatedTime, 0);
    const personalizedTime = examConfig.personalizedQuestions.count * 5; // Estimated 5 min per question
    return commonTime + personalizedTime;
  };

  const getTotalPoints = () => {
    const commonPoints = examConfig.commonQuestions.reduce((sum, q) => sum + q.points, 0);
    const personalizedPoints = examConfig.personalizedQuestions.count * 10; // Estimated 10 points per question
    return commonPoints + personalizedPoints;
  };

  const getDifficultyDistribution = () => {
    const distribution = { easy: 0, medium: 0, hard: 0 };
    examConfig.commonQuestions.forEach(q => {
      distribution[q.difficulty]++;
    });
    return distribution;
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        {[1, 2, 3].map(step => (
          <div key={step} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step <= currentStep 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground'
            }`}>
              {step}
            </div>
            <span className={`text-sm ${
              step <= currentStep ? 'text-foreground' : 'text-muted-foreground'
            }`}>
              {step === 1 && '基本设置'}
              {step === 2 && '智能组卷'}
              {step === 3 && '高级设置'}
            </span>
            {step < 3 && (
              <ArrowRight className="w-4 h-4 text-muted-foreground ml-2" />
            )}
          </div>
        ))}
      </div>
      <div className="text-sm text-muted-foreground">
        第 {currentStep} 步，共 {totalSteps} 步
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1>创建作业/考试</h1>
            <p className="text-muted-foreground">
              {knowledgePoint && `知识点：${knowledgePoint}`}
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            取消
          </Button>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <StepIndicator />

        {/* Step 1: Basic Settings */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                基本设置
              </CardTitle>
              <CardDescription>设置考试的基本信息和时间安排</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">考试名称 *</Label>
                    <Input
                      id="name"
                      placeholder="请输入考试名称"
                      value={examConfig.name}
                      onChange={(e) => setExamConfig(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">考试类型 *</Label>
                    <Select 
                      value={examConfig.type} 
                      onValueChange={(value: any) => setExamConfig(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="practice">练习</SelectItem>
                        <SelectItem value="assignment">作业</SelectItem>
                        <SelectItem value="quiz">测验</SelectItem>
                        <SelectItem value="exam">考试</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">考试说明</Label>
                    <Textarea
                      id="description"
                      placeholder="请输入考试说明..."
                      value={examConfig.description}
                      onChange={(e) => setExamConfig(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>目标班级 *</Label>
                    <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-3">
                      {mockClasses.map(cls => (
                        <div key={cls.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`class-${cls.id}`}
                            checked={examConfig.targetClasses.includes(cls.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setExamConfig(prev => ({
                                  ...prev,
                                  targetClasses: [...prev.targetClasses, cls.id]
                                }));
                              } else {
                                setExamConfig(prev => ({
                                  ...prev,
                                  targetClasses: prev.targetClasses.filter(id => id !== cls.id)
                                }));
                              }
                            }}
                          />
                          <Label htmlFor={`class-${cls.id}`} className="text-sm">
                            {cls.name} ({cls.students}人)
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">开始时间</Label>
                      <Input
                        id="startTime"
                        type="datetime-local"
                        value={examConfig.startTime}
                        onChange={(e) => setExamConfig(prev => ({ ...prev, startTime: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endTime">结束时间 *</Label>
                      <Input
                        id="endTime"
                        type="datetime-local"
                        value={examConfig.endTime}
                        onChange={(e) => setExamConfig(prev => ({ ...prev, endTime: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeLimit">限时设置 (分钟)</Label>
                    <Input
                      id="timeLimit"
                      type="number"
                      placeholder="90"
                      value={examConfig.timeLimit}
                      onChange={(e) => setExamConfig(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Smart Question Selection */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  智能组卷
                </CardTitle>
                <CardDescription>配置公共题目和个性化题目</CardDescription>
              </CardHeader>
            </Card>

            <Tabs defaultValue="common" className="space-y-4">
              <TabsList>
                <TabsTrigger value="common">公共题目 (Nc)</TabsTrigger>
                <TabsTrigger value="personalized">个性化题目 (Np)</TabsTrigger>
                <TabsTrigger value="preview">试卷预览</TabsTrigger>
              </TabsList>

              <TabsContent value="common" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>公共题目选择</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-2">
                          <FileQuestion className="w-4 h-4" />
                          从题库选择
                        </Button>
                        <Button size="sm" className="gap-2">
                          <Brain className="w-4 h-4" />
                          AI推荐
                        </Button>
                      </div>
                    </CardTitle>
                    <CardDescription>
                      所有学生都需要回答的题目 (当前已选 {examConfig.commonQuestions.length} 题)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {examConfig.commonQuestions.length > 0 ? (
                      <div className="space-y-4">
                        {examConfig.commonQuestions.map((question, index) => (
                          <Card key={question.id} className="group">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">第{index + 1}题</span>
                                  <Badge variant={
                                    question.difficulty === 'easy' ? 'secondary' :
                                    question.difficulty === 'medium' ? 'default' : 'destructive'
                                  }>
                                    {question.difficulty === 'easy' ? '简单' :
                                     question.difficulty === 'medium' ? '中等' : '困难'}
                                  </Badge>
                                  <Badge variant="outline">{question.points}分</Badge>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button variant="ghost" size="icon" className="w-8 h-8">
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="w-8 h-8"
                                    onClick={() => removeCommonQuestion(question.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              <h4 className="font-medium mb-2">{question.title}</h4>
                              <div className="text-sm">
                                <MathRenderer content={question.content} />
                              </div>
                              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                                <span>{question.chapter}</span>
                                <span>预计用时: {question.estimatedTime}分钟</span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileQuestion className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <h3 className="font-medium mb-2">还没有选择公共题目</h3>
                        <p className="text-muted-foreground mb-4">
                          点击上方按钮从题库选择或使用AI推荐
                        </p>
                        <div className="flex justify-center gap-2">
                          {mockQuestions.map(question => (
                            <Button 
                              key={question.id}
                              variant="outline" 
                              size="sm"
                              onClick={() => addCommonQuestion(question)}
                            >
                              添加示例题目
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="personalized" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>个性化题目配置</CardTitle>
                    <CardDescription>为不同学生生成个性化题目</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="personalizedCount">题目数量</Label>
                          <Input
                            id="personalizedCount"
                            type="number"
                            value={examConfig.personalizedQuestions.count}
                            onChange={(e) => setExamConfig(prev => ({
                              ...prev,
                              personalizedQuestions: {
                                ...prev.personalizedQuestions,
                                count: parseInt(e.target.value) || 0
                              }
                            }))}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>生成策略</Label>
                          <RadioGroup
                            value={examConfig.personalizedQuestions.strategy}
                            onValueChange={(value: any) => setExamConfig(prev => ({
                              ...prev,
                              personalizedQuestions: {
                                ...prev.personalizedQuestions,
                                strategy: value
                              }
                            }))}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="random" id="random" />
                              <Label htmlFor="random">随机抽取</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="weakness" id="weakness" />
                              <Label htmlFor="weakness">错题优先</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="adaptive" id="adaptive" />
                              <Label htmlFor="adaptive">薄弱点针对</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="layered" id="layered" />
                              <Label htmlFor="layered">分层设置</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <h4 className="font-medium mb-3">策略说明</h4>
                          <div className="space-y-2 text-sm text-muted-foreground">
                            {examConfig.personalizedQuestions.strategy === 'random' && (
                              <p>从题库中随机选择题目，确保每个学生获得不同的题目组合。</p>
                            )}
                            {examConfig.personalizedQuestions.strategy === 'weakness' && (
                              <p>优先选择学生历史错题相关的题目，针对性提升薄弱环节。</p>
                            )}
                            {examConfig.personalizedQuestions.strategy === 'adaptive' && (
                              <p>基于知识图谱分析学生薄弱点，智能推荐相关题目。</p>
                            )}
                            {examConfig.personalizedQuestions.strategy === 'layered' && (
                              <p>根据学生水平分层，不同水平的学生获得不同难度的题目。</p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>难度范围</Label>
                          <div className="flex items-center gap-2">
                            <Select defaultValue="1">
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">简单</SelectItem>
                                <SelectItem value="2">中等</SelectItem>
                                <SelectItem value="3">困难</SelectItem>
                              </SelectContent>
                            </Select>
                            <span className="text-sm text-muted-foreground">至</span>
                            <Select defaultValue="3">
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">简单</SelectItem>
                                <SelectItem value="2">中等</SelectItem>
                                <SelectItem value="3">困难</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      试卷分析
                    </CardTitle>
                    <CardDescription>试卷难度和时间分析</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-chart-1">{getTotalPoints()}</div>
                          <p className="text-sm text-muted-foreground">总分</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-chart-2">{getEstimatedTotalTime()}</div>
                          <p className="text-sm text-muted-foreground">预计用时(分钟)</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-chart-3">
                            {examConfig.commonQuestions.length + examConfig.personalizedQuestions.count}
                          </div>
                          <p className="text-sm text-muted-foreground">题目总数</p>
                        </CardContent>
                      </Card>
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-4">
                      <h4 className="font-medium">难度分布</h4>
                      <div className="space-y-2">
                        {Object.entries(getDifficultyDistribution()).map(([difficulty, count]) => (
                          <div key={difficulty} className="flex items-center justify-between">
                            <span className="text-sm">
                              {difficulty === 'easy' ? '简单' : difficulty === 'medium' ? '中等' : '困难'}
                            </span>
                            <div className="flex items-center gap-2">
                              <Progress value={(count / examConfig.commonQuestions.length) * 100} className="w-24 h-2" />
                              <span className="text-sm w-8">{count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Step 3: Advanced Settings */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                高级设置
              </CardTitle>
              <CardDescription>配置考试行为和防作弊设置</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">题目设置</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>题目顺序</Label>
                        <p className="text-sm text-muted-foreground">题目是否随机排列</p>
                      </div>
                      <Switch
                        checked={examConfig.questionOrder === 'random'}
                        onCheckedChange={(checked) => setExamConfig(prev => ({
                          ...prev,
                          questionOrder: checked ? 'random' : 'fixed'
                        }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>选项顺序</Label>
                        <p className="text-sm text-muted-foreground">选择题选项是否随机排列</p>
                      </div>
                      <Switch
                        checked={examConfig.optionOrder === 'random'}
                        onCheckedChange={(checked) => setExamConfig(prev => ({
                          ...prev,
                          optionOrder: checked ? 'random' : 'fixed'
                        }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">防作弊设置</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>切屏检测</Label>
                        <p className="text-sm text-muted-foreground">检测学生是否切换到其他页面</p>
                      </div>
                      <Switch
                        checked={examConfig.antiCheat.tabSwitchDetection}
                        onCheckedChange={(checked) => setExamConfig(prev => ({
                          ...prev,
                          antiCheat: { ...prev.antiCheat, tabSwitchDetection: checked }
                        }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>摄像头监控</Label>
                        <p className="text-sm text-muted-foreground">要求学生开启摄像头</p>
                      </div>
                      <Switch
                        checked={examConfig.antiCheat.cameraMonitoring}
                        onCheckedChange={(checked) => setExamConfig(prev => ({
                          ...prev,
                          antiCheat: { ...prev.antiCheat, cameraMonitoring: checked }
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>时间跟踪</Label>
                        <p className="text-sm text-muted-foreground">记录每题的答题时间</p>
                      </div>
                      <Switch
                        checked={examConfig.antiCheat.timeTracking}
                        onCheckedChange={(checked) => setExamConfig(prev => ({
                          ...prev,
                          antiCheat: { ...prev.antiCheat, timeTracking: checked }
                        }))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">成绩发布设置</h4>
                <RadioGroup
                  value={examConfig.gradeRelease}
                  onValueChange={(value: any) => setExamConfig(prev => ({ ...prev, gradeRelease: value }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="immediate" id="immediate" />
                    <Label htmlFor="immediate">立即发布 - 学生完成后立即看到成绩</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="manual" id="manual" />
                    <Label htmlFor="manual">手动发布 - 教师手动发布成绩</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="scheduled" id="scheduled" />
                    <Label htmlFor="scheduled">定时发布 - 指定时间发布成绩</Label>
                  </div>
                </RadioGroup>

                {examConfig.gradeRelease === 'scheduled' && (
                  <div className="ml-6 space-y-2">
                    <Label htmlFor="gradeReleaseTime">发布时间</Label>
                    <Input
                      id="gradeReleaseTime"
                      type="datetime-local"
                      value={examConfig.gradeReleaseTime || ''}
                      onChange={(e) => setExamConfig(prev => ({ 
                        ...prev, 
                        gradeReleaseTime: e.target.value 
                      }))}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            上一步
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Save className="w-4 h-4" />
              保存草稿
            </Button>
            
            {currentStep === totalSteps ? (
              <Button onClick={handleFinish} className="gap-2">
                <Send className="w-4 h-4" />
                创建并发布
              </Button>
            ) : (
              <Button onClick={handleNext}>
                下一步
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}