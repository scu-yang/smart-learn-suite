import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Checkbox } from '../../ui/checkbox';
import { Calendar } from '../../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { Switch } from '../../ui/switch';
import { Slider } from '../../ui/slider';
import { 
  ArrowLeft,
  Save,
  Send,
  Clock,
  Users,
  FileText,
  Plus,
  X,
  AlertCircle,
  CheckCircle,
  Calendar as CalendarIcon,
  Upload,
  Eye,
  Settings,
  Target,
  BookOpen,
  Timer,
  HelpCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { cn } from '../../ui/utils';

interface AssignmentData {
  title: string;
  description: string;
  instructions: string;
  type: 'homework' | 'quiz' | 'project' | 'reading';
  course: string;
  classes: string[];
  totalPoints: number;
  timeLimit?: number; // minutes
  attempts: number;
  dueDate?: Date;
  publishDate?: Date;
  availability: {
    fromDate?: Date;
    untilDate?: Date;
    specificTimes: boolean;
  };
  settings: {
    shuffleQuestions: boolean;
    showCorrectAnswers: boolean;
    allowLateSubmission: boolean;
    latePenalty: number;
    requireProctoring: boolean;
    lockdownBrowser: boolean;
    showOneQuestionAtTime: boolean;
    preventBackTracking: boolean;
  };
  grading: {
    autoGrade: boolean;
    passingScore: number;
    gradingMethod: 'highest' | 'latest' | 'average';
    anonymousGrading: boolean;
  };
  feedback: {
    showScoreImmediately: boolean;
    showFeedbackImmediately: boolean;
    customFeedback: {
      high: string;
      medium: string;
      low: string;
    };
  };
  attachments: File[];
  tags: string[];
}

const courses = [
  { id: '1', name: '高等数学A', code: 'MATH101' },
  { id: '2', name: '线性代数', code: 'MATH201' },
  { id: '3', name: '概率论与数理统计', code: 'MATH301' },
  { id: '4', name: '离散数学', code: 'CS101' }
];

const classes = [
  { id: '1', name: '高等数学A-01班', courseId: '1' },
  { id: '2', name: '高等数学A-02班', courseId: '1' },
  { id: '3', name: '线性代数-01班', courseId: '2' },
  { id: '4', name: '概率论-01班', courseId: '3' },
  { id: '5', name: '离散数学-01班', courseId: '4' }
];

const assignmentTypes = [
  { value: 'homework', label: '课后作业', description: '学生课后完成的练习题' },
  { value: 'quiz', label: '随堂测验', description: '短时间的课堂测验' },
  { value: 'project', label: '课程项目', description: '长期的综合性项目' },
  { value: 'reading', label: '阅读任务', description: '指定阅读材料和思考题' }
];

export function AssignmentCreation() {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('basic');
  const [assignmentData, setAssignmentData] = useState<AssignmentData>({
    title: '',
    description: '',
    instructions: '',
    type: 'homework',
    course: '',
    classes: [],
    totalPoints: 100,
    timeLimit: undefined,
    attempts: 1,
    availability: {
      specificTimes: false
    },
    settings: {
      shuffleQuestions: false,
      showCorrectAnswers: true,
      allowLateSubmission: false,
      latePenalty: 10,
      requireProctoring: false,
      lockdownBrowser: false,
      showOneQuestionAtTime: false,
      preventBackTracking: false
    },
    grading: {
      autoGrade: true,
      passingScore: 60,
      gradingMethod: 'highest',
      anonymousGrading: false
    },
    feedback: {
      showScoreImmediately: true,
      showFeedbackImmediately: true,
      customFeedback: {
        high: '优秀！您已经很好地掌握了这部分内容。',
        medium: '不错！还有一些地方需要加强。',
        low: '需要更多练习，建议复习相关材料。'
      }
    },
    attachments: [],
    tags: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newTag, setNewTag] = useState('');

  const getAvailableClasses = () => {
    if (!assignmentData.course) return [];
    return classes.filter(cls => cls.courseId === assignmentData.course);
  };

  const validateBasicInfo = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!assignmentData.title.trim()) newErrors.title = '作业标题不能为空';
    if (!assignmentData.course) newErrors.course = '请选择课程';
    if (assignmentData.classes.length === 0) newErrors.classes = '请选择至少一个班级';
    if (!assignmentData.description.trim()) newErrors.description = '作业描述不能为空';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = () => {
    console.log('Saving draft:', assignmentData);
    navigate('/exams');
  };

  const handlePublish = () => {
    if (validateBasicInfo()) {
      console.log('Publishing assignment:', assignmentData);
      navigate('/exams');
    }
  };

  const addTag = () => {
    if (newTag.trim() && !assignmentData.tags.includes(newTag.trim())) {
      setAssignmentData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setAssignmentData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">作业标题 *</Label>
          <Input
            id="title"
            value={assignmentData.title}
            onChange={(e) => setAssignmentData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="例：第三章积分练习"
            className={errors.title ? 'border-destructive' : ''}
          />
          {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">作业类型</Label>
          <Select value={assignmentData.type} onValueChange={(value: any) => setAssignmentData(prev => ({ ...prev, type: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {assignmentTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  <div>
                    <div className="font-medium">{type.label}</div>
                    <div className="text-xs text-muted-foreground">{type.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="course">选择课程 *</Label>
          <Select value={assignmentData.course} onValueChange={(value) => {
            setAssignmentData(prev => ({ ...prev, course: value, classes: [] }));
          }}>
            <SelectTrigger className={errors.course ? 'border-destructive' : ''}>
              <SelectValue placeholder="选择课程" />
            </SelectTrigger>
            <SelectContent>
              {courses.map(course => (
                <SelectItem key={course.id} value={course.id}>
                  {course.name} ({course.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.course && <p className="text-xs text-destructive">{errors.course}</p>}
        </div>

        <div className="space-y-2">
          <Label>选择班级 *</Label>
          <div className="border rounded-lg p-3 space-y-2 max-h-32 overflow-y-auto">
            {getAvailableClasses().map(cls => (
              <div key={cls.id} className="flex items-center space-x-2">
                <Checkbox
                  id={cls.id}
                  checked={assignmentData.classes.includes(cls.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setAssignmentData(prev => ({
                        ...prev,
                        classes: [...prev.classes, cls.id]
                      }));
                    } else {
                      setAssignmentData(prev => ({
                        ...prev,
                        classes: prev.classes.filter(id => id !== cls.id)
                      }));
                    }
                  }}
                />
                <Label htmlFor={cls.id} className="text-sm">{cls.name}</Label>
              </div>
            ))}
            {getAvailableClasses().length === 0 && (
              <p className="text-sm text-muted-foreground">请先选择课程</p>
            )}
          </div>
          {errors.classes && <p className="text-xs text-destructive">{errors.classes}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">作业描述 *</Label>
        <Textarea
          id="description"
          value={assignmentData.description}
          onChange={(e) => setAssignmentData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="描述作业的目标、要求和注意事项..."
          rows={4}
          className={errors.description ? 'border-destructive' : ''}
        />
        {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="instructions">详细说明</Label>
        <Textarea
          id="instructions"
          value={assignmentData.instructions}
          onChange={(e) => setAssignmentData(prev => ({ ...prev, instructions: e.target.value }))}
          placeholder="提供详细的作业说明、步骤和要求..."
          rows={6}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="totalPoints">总分</Label>
          <Input
            id="totalPoints"
            type="number"
            value={assignmentData.totalPoints}
            onChange={(e) => setAssignmentData(prev => ({ ...prev, totalPoints: parseInt(e.target.value) || 0 }))}
            min="1"
            max="1000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="timeLimit">时间限制（分钟）</Label>
          <Input
            id="timeLimit"
            type="number"
            value={assignmentData.timeLimit || ''}
            onChange={(e) => setAssignmentData(prev => ({ 
              ...prev, 
              timeLimit: e.target.value ? parseInt(e.target.value) : undefined 
            }))}
            placeholder="不限制"
            min="1"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="attempts">允许提交次数</Label>
          <Select 
            value={assignmentData.attempts.toString()} 
            onValueChange={(value) => setAssignmentData(prev => ({ ...prev, attempts: parseInt(value) }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1次</SelectItem>
              <SelectItem value="2">2次</SelectItem>
              <SelectItem value="3">3次</SelectItem>
              <SelectItem value="5">5次</SelectItem>
              <SelectItem value="-1">无限制</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-4">
        <div>
          <Label>标签</Label>
          <p className="text-sm text-muted-foreground">添加标签帮助分类和搜索</p>
        </div>

        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="添加标签..."
            onKeyPress={(e) => e.key === 'Enter' && addTag()}
          />
          <Button onClick={addTag}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {assignmentData.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="gap-1">
              {tag}
              <button onClick={() => removeTag(tag)}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label>发布时间</Label>
            <p className="text-sm text-muted-foreground">设置作业何时对学生可见</p>
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <CalendarIcon className="w-4 h-4 mr-2" />
                {assignmentData.publishDate ? format(assignmentData.publishDate, 'yyyy-MM-dd HH:mm') : '立即发布'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={assignmentData.publishDate}
                onSelect={(date) => setAssignmentData(prev => ({ ...prev, publishDate: date }))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-4">
          <div>
            <Label>截止时间</Label>
            <p className="text-sm text-muted-foreground">学生必须在此时间前提交</p>
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <CalendarIcon className="w-4 h-4 mr-2" />
                {assignmentData.dueDate ? format(assignmentData.dueDate, 'yyyy-MM-dd HH:mm') : '选择截止时间'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={assignmentData.dueDate}
                onSelect={(date) => setAssignmentData(prev => ({ ...prev, dueDate: date }))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">可用性设置</CardTitle>
          <CardDescription>控制学生何时可以访问和提交作业</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>指定开放时间段</Label>
              <p className="text-sm text-muted-foreground">限制学生只能在特定时间段内完成作业</p>
            </div>
            <Switch 
              checked={assignmentData.availability.specificTimes}
              onCheckedChange={(checked) => 
                setAssignmentData(prev => ({
                  ...prev,
                  availability: { ...prev.availability, specificTimes: checked }
                }))
              }
            />
          </div>

          {assignmentData.availability.specificTimes && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l-2 border-muted">
              <div className="space-y-2">
                <Label>开始时间</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {assignmentData.availability.fromDate ? 
                        format(assignmentData.availability.fromDate, 'yyyy-MM-dd HH:mm') : 
                        '选择开始时间'
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={assignmentData.availability.fromDate}
                      onSelect={(date) => setAssignmentData(prev => ({
                        ...prev,
                        availability: { ...prev.availability, fromDate: date }
                      }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>结束时间</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {assignmentData.availability.untilDate ? 
                        format(assignmentData.availability.untilDate, 'yyyy-MM-dd HH:mm') : 
                        '选择结束时间'
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={assignmentData.availability.untilDate}
                      onSelect={(date) => setAssignmentData(prev => ({
                        ...prev,
                        availability: { ...prev.availability, untilDate: date }
                      }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">提交设置</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>允许迟交</Label>
              <p className="text-sm text-muted-foreground">学生可以在截止时间后提交</p>
            </div>
            <Switch 
              checked={assignmentData.settings.allowLateSubmission}
              onCheckedChange={(checked) => 
                setAssignmentData(prev => ({
                  ...prev,
                  settings: { ...prev.settings, allowLateSubmission: checked }
                }))
              }
            />
          </div>

          {assignmentData.settings.allowLateSubmission && (
            <div className="pl-4 border-l-2 border-muted">
              <Label>迟交扣分比例 (%)</Label>
              <div className="flex items-center gap-4 mt-2">
                <Slider
                  value={[assignmentData.settings.latePenalty]}
                  onValueChange={([value]) => 
                    setAssignmentData(prev => ({
                      ...prev,
                      settings: { ...prev.settings, latePenalty: value }
                    }))
                  }
                  max={50}
                  step={5}
                  className="flex-1"
                />
                <span className="w-12 text-sm">{assignmentData.settings.latePenalty}%</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">考试安全设置</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>打乱题目顺序</Label>
              <p className="text-sm text-muted-foreground">为每个学生随机排列题目顺序</p>
            </div>
            <Switch 
              checked={assignmentData.settings.shuffleQuestions}
              onCheckedChange={(checked) => 
                setAssignmentData(prev => ({
                  ...prev,
                  settings: { ...prev.settings, shuffleQuestions: checked }
                }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>一次只显示一题</Label>
              <p className="text-sm text-muted-foreground">学生一次只能看到一道题目</p>
            </div>
            <Switch 
              checked={assignmentData.settings.showOneQuestionAtTime}
              onCheckedChange={(checked) => 
                setAssignmentData(prev => ({
                  ...prev,
                  settings: { ...prev.settings, showOneQuestionAtTime: checked }
                }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>禁止回看</Label>
              <p className="text-sm text-muted-foreground">学生不能返回修改已答题目</p>
            </div>
            <Switch 
              checked={assignmentData.settings.preventBackTracking}
              onCheckedChange={(checked) => 
                setAssignmentData(prev => ({
                  ...prev,
                  settings: { ...prev.settings, preventBackTracking: checked }
                }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>需要监考</Label>
              <p className="text-sm text-muted-foreground">启用在线监考功能</p>
            </div>
            <Switch 
              checked={assignmentData.settings.requireProctoring}
              onCheckedChange={(checked) => 
                setAssignmentData(prev => ({
                  ...prev,
                  settings: { ...prev.settings, requireProctoring: checked }
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">反馈设置</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>立即显示分数</Label>
              <p className="text-sm text-muted-foreground">学生提交后立即看到成绩</p>
            </div>
            <Switch 
              checked={assignmentData.feedback.showScoreImmediately}
              onCheckedChange={(checked) => 
                setAssignmentData(prev => ({
                  ...prev,
                  feedback: { ...prev.feedback, showScoreImmediately: checked }
                }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>显示正确答案</Label>
              <p className="text-sm text-muted-foreground">让学生看到题目的正确答案</p>
            </div>
            <Switch 
              checked={assignmentData.settings.showCorrectAnswers}
              onCheckedChange={(checked) => 
                setAssignmentData(prev => ({
                  ...prev,
                  settings: { ...prev.settings, showCorrectAnswers: checked }
                }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>立即显示反馈</Label>
              <p className="text-sm text-muted-foreground">提交后立即显示详细反馈</p>
            </div>
            <Switch 
              checked={assignmentData.feedback.showFeedbackImmediately}
              onCheckedChange={(checked) => 
                setAssignmentData(prev => ({
                  ...prev,
                  feedback: { ...prev.feedback, showFeedbackImmediately: checked }
                }))
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderGrading = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">评分设置</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>自动评分</Label>
              <p className="text-sm text-muted-foreground">系统自动计算并记录成绩</p>
            </div>
            <Switch 
              checked={assignmentData.grading.autoGrade}
              onCheckedChange={(checked) => 
                setAssignmentData(prev => ({
                  ...prev,
                  grading: { ...prev.grading, autoGrade: checked }
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>及格分数</Label>
            <div className="flex items-center gap-4">
              <Slider
                value={[assignmentData.grading.passingScore]}
                onValueChange={([value]) => 
                  setAssignmentData(prev => ({
                    ...prev,
                    grading: { ...prev.grading, passingScore: value }
                  }))
                }
                max={100}
                step={5}
                className="flex-1"
              />
              <span className="w-12 text-sm">{assignmentData.grading.passingScore}分</span>
            </div>
          </div>

          {assignmentData.attempts > 1 && (
            <div className="space-y-2">
              <Label>多次提交计分方式</Label>
              <Select 
                value={assignmentData.grading.gradingMethod} 
                onValueChange={(value: any) => 
                  setAssignmentData(prev => ({
                    ...prev,
                    grading: { ...prev.grading, gradingMethod: value }
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="highest">取最高分</SelectItem>
                  <SelectItem value="latest">取最新分</SelectItem>
                  <SelectItem value="average">取平均分</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <Label>匿名评分</Label>
              <p className="text-sm text-muted-foreground">批改时隐藏学生姓名</p>
            </div>
            <Switch 
              checked={assignmentData.grading.anonymousGrading}
              onCheckedChange={(checked) => 
                setAssignmentData(prev => ({
                  ...prev,
                  grading: { ...prev.grading, anonymousGrading: checked }
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">反馈内容设置</CardTitle>
          <CardDescription>根据学生成绩提供个性化反馈</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>高分反馈 (80分以上)</Label>
            <Textarea
              value={assignmentData.feedback.customFeedback.high}
              onChange={(e) => setAssignmentData(prev => ({
                ...prev,
                feedback: {
                  ...prev.feedback,
                  customFeedback: { ...prev.feedback.customFeedback, high: e.target.value }
                }
              }))}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>中等反馈 (60-79分)</Label>
            <Textarea
              value={assignmentData.feedback.customFeedback.medium}
              onChange={(e) => setAssignmentData(prev => ({
                ...prev,
                feedback: {
                  ...prev.feedback,
                  customFeedback: { ...prev.feedback.customFeedback, medium: e.target.value }
                }
              }))}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>低分反馈 (60分以下)</Label>
            <Textarea
              value={assignmentData.feedback.customFeedback.low}
              onChange={(e) => setAssignmentData(prev => ({
                ...prev,
                feedback: {
                  ...prev.feedback,
                  customFeedback: { ...prev.feedback.customFeedback, low: e.target.value }
                }
              }))}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/exams')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1>创建作业</h1>
            <p className="text-muted-foreground">设置作业内容、时间安排和评分标准</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSaveDraft}>
            <Save className="w-4 h-4 mr-2" />
            保存草稿
          </Button>
          <Button onClick={handlePublish}>
            <Send className="w-4 h-4 mr-2" />
            发布作业
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic" className="gap-2">
            <FileText className="w-4 h-4" />
            基本信息
          </TabsTrigger>
          <TabsTrigger value="schedule" className="gap-2">
            <Clock className="w-4 h-4" />
            时间安排
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="w-4 h-4" />
            作业设置
          </TabsTrigger>
          <TabsTrigger value="grading" className="gap-2">
            <Target className="w-4 h-4" />
            评分标准
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
              <CardDescription>设置作业的基本信息和要求</CardDescription>
            </CardHeader>
            <CardContent>
              {renderBasicInfo()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>时间安排</CardTitle>
              <CardDescription>设置作业的发布时间、截止时间和可用性</CardDescription>
            </CardHeader>
            <CardContent>
              {renderSchedule()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {renderSettings()}
        </TabsContent>

        <TabsContent value="grading" className="space-y-6">
          {renderGrading()}
        </TabsContent>
      </Tabs>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            作业预览
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{assignmentData.title || '作业标题'}</h3>
                <p className="text-sm text-muted-foreground">
                  {assignmentData.description || '作业描述'}
                </p>
              </div>
              <Badge>{assignmentTypes.find(t => t.value === assignmentData.type)?.label}</Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-muted-foreground" />
                <span>{assignmentData.totalPoints}分</span>
              </div>
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-muted-foreground" />
                <span>{assignmentData.timeLimit ? `${assignmentData.timeLimit}分钟` : '不限时'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span>{assignmentData.attempts === -1 ? '无限次' : `${assignmentData.attempts}次`}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                <span>{assignmentData.dueDate ? format(assignmentData.dueDate, 'MM-dd HH:mm') : '无截止时间'}</span>
              </div>
            </div>

            {assignmentData.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {assignmentData.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">{tag}</Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}