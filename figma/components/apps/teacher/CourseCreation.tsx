import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Checkbox } from '../../ui/checkbox';
import { Calendar } from '../../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { 
  ArrowLeft,
  Save,
  Upload,
  BookOpen,
  Calendar as CalendarIcon,
  Clock,
  Users,
  MapPin,
  FileText,
  Settings,
  Camera,
  Plus,
  X,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { cn } from '../../ui/utils';

interface CourseData {
  name: string;
  code: string;
  description: string;
  semester: string;
  type: 'required' | 'elective';
  credits: number;
  department: string;
  category: string;
  language: string;
  capacity: number;
  location: string;
  schedule: {
    day: string;
    startTime: string;
    endTime: string;
    location: string;
  }[];
  objectives: string[];
  prerequisites: string[];
  assessmentMethods: {
    type: string;
    weight: number;
  }[];
  resources: {
    type: string;
    title: string;
    url?: string;
  }[];
  tags: string[];
  coverImage?: string;
  startDate?: Date;
  endDate?: Date;
}

const departments = [
  '数学与统计学院',
  '计算机科学学院',
  '物理学院',
  '化学学院',
  '生物学院',
  '经济学院',
  '管理学院'
];

const categories = [
  '基础数学',
  '应用数学',
  '统计学',
  '数据科学',
  '人工智能',
  '软件工程',
  '网络安全'
];

const weekDays = [
  { value: 'monday', label: '周一' },
  { value: 'tuesday', label: '周二' },
  { value: 'wednesday', label: '周三' },
  { value: 'thursday', label: '周四' },
  { value: 'friday', label: '周五' },
  { value: 'saturday', label: '周六' },
  { value: 'sunday', label: '周日' }
];

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00', '21:30'
];

const assessmentTypes = [
  { value: 'final', label: '期末考试' },
  { value: 'midterm', label: '期中考试' },
  { value: 'assignment', label: '平时作业' },
  { value: 'quiz', label: '课堂测验' },
  { value: 'project', label: '课程项目' },
  { value: 'participation', label: '课堂参与' },
  { value: 'presentation', label: '学术报告' }
];

export function CourseCreation() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [courseData, setCourseData] = useState<CourseData>({
    name: '',
    code: '',
    description: '',
    semester: '2025春',
    type: 'required',
    credits: 3,
    department: '',
    category: '',
    language: 'chinese',
    capacity: 50,
    location: '',
    schedule: [],
    objectives: [],
    prerequisites: [],
    assessmentMethods: [
      { type: 'final', weight: 40 },
      { type: 'midterm', weight: 30 },
      { type: 'assignment', weight: 30 }
    ],
    resources: [],
    tags: []
  });

  const [newObjective, setNewObjective] = useState('');
  const [newPrerequisite, setNewPrerequisite] = useState('');
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    { id: 'basic', title: '基本信息', description: '课程名称、编号、描述等' },
    { id: 'schedule', title: '排课信息', description: '上课时间、地点安排' },
    { id: 'content', title: '课程内容', description: '教学目标、先修课程' },
    { id: 'assessment', title: '考核方式', description: '成绩构成、考核标准' },
    { id: 'review', title: '确认创建', description: '检查信息并创建课程' }
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0: // Basic Info
        if (!courseData.name.trim()) newErrors.name = '课程名称不能为空';
        if (!courseData.code.trim()) newErrors.code = '课程编号不能为空';
        if (!courseData.description.trim()) newErrors.description = '课程描述不能为空';
        if (!courseData.department) newErrors.department = '请选择开课院系';
        if (!courseData.category) newErrors.category = '请选择课程类别';
        break;
      case 1: // Schedule
        if (courseData.schedule.length === 0) newErrors.schedule = '请添加至少一个上课时间';
        break;
      case 2: // Content
        if (courseData.objectives.length === 0) newErrors.objectives = '请添加至少一个教学目标';
        break;
      case 3: // Assessment
        const totalWeight = courseData.assessmentMethods.reduce((sum, method) => sum + method.weight, 0);
        if (totalWeight !== 100) newErrors.assessment = '考核权重总和必须为100%';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addScheduleItem = () => {
    setCourseData(prev => ({
      ...prev,
      schedule: [...prev.schedule, { day: '', startTime: '', endTime: '', location: '' }]
    }));
  };

  const updateScheduleItem = (index: number, field: string, value: string) => {
    setCourseData(prev => ({
      ...prev,
      schedule: prev.schedule.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeScheduleItem = (index: number) => {
    setCourseData(prev => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index)
    }));
  };

  const addListItem = (field: 'objectives' | 'prerequisites' | 'tags', value: string) => {
    if (value.trim()) {
      setCourseData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      
      if (field === 'objectives') setNewObjective('');
      if (field === 'prerequisites') setNewPrerequisite('');
      if (field === 'tags') setNewTag('');
    }
  };

  const removeListItem = (field: 'objectives' | 'prerequisites' | 'tags', index: number) => {
    setCourseData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateAssessmentWeight = (index: number, weight: number) => {
    setCourseData(prev => ({
      ...prev,
      assessmentMethods: prev.assessmentMethods.map((method, i) =>
        i === index ? { ...method, weight } : method
      )
    }));
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/courses');
    }
  };

  const handleSubmit = () => {
    // Handle course creation
    console.log('Creating course:', courseData);
    navigate('/courses');
  };

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">课程名称 *</Label>
          <Input
            id="name"
            value={courseData.name}
            onChange={(e) => setCourseData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="例：高等数学A"
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="code">课程编号 *</Label>
          <Input
            id="code"
            value={courseData.code}
            onChange={(e) => setCourseData(prev => ({ ...prev, code: e.target.value }))}
            placeholder="例：MATH101"
            className={errors.code ? 'border-destructive' : ''}
          />
          {errors.code && <p className="text-xs text-destructive">{errors.code}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">课程描述 *</Label>
        <Textarea
          id="description"
          value={courseData.description}
          onChange={(e) => setCourseData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="请描述课程的主要内容、教学目标和特色..."
          rows={4}
          className={errors.description ? 'border-destructive' : ''}
        />
        {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="semester">开课学期</Label>
          <Select value={courseData.semester} onValueChange={(value) => setCourseData(prev => ({ ...prev, semester: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025春">2025春</SelectItem>
              <SelectItem value="2025秋">2025秋</SelectItem>
              <SelectItem value="2026春">2026春</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">课程性质</Label>
          <Select value={courseData.type} onValueChange={(value: 'required' | 'elective') => setCourseData(prev => ({ ...prev, type: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="required">必修课</SelectItem>
              <SelectItem value="elective">选修课</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="credits">学分</Label>
          <Select value={courseData.credits.toString()} onValueChange={(value) => setCourseData(prev => ({ ...prev, credits: parseInt(value) }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1学分</SelectItem>
              <SelectItem value="2">2学分</SelectItem>
              <SelectItem value="3">3学分</SelectItem>
              <SelectItem value="4">4学分</SelectItem>
              <SelectItem value="5">5学分</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="department">开课院系 *</Label>
          <Select value={courseData.department} onValueChange={(value) => setCourseData(prev => ({ ...prev, department: value }))}>
            <SelectTrigger className={errors.department ? 'border-destructive' : ''}>
              <SelectValue placeholder="请选择院系" />
            </SelectTrigger>
            <SelectContent>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.department && <p className="text-xs text-destructive">{errors.department}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">课程类别 *</Label>
          <Select value={courseData.category} onValueChange={(value) => setCourseData(prev => ({ ...prev, category: value }))}>
            <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
              <SelectValue placeholder="请选择类别" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="language">授课语言</Label>
          <Select value={courseData.language} onValueChange={(value) => setCourseData(prev => ({ ...prev, language: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="chinese">中文</SelectItem>
              <SelectItem value="english">英文</SelectItem>
              <SelectItem value="bilingual">双语</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="capacity">课程容量</Label>
          <Input
            id="capacity"
            type="number"
            value={courseData.capacity}
            onChange={(e) => setCourseData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
            placeholder="学生人数上限"
          />
        </div>
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">上课时间安排</h3>
          <p className="text-sm text-muted-foreground">添加课程的上课时间和地点</p>
        </div>
        <Button onClick={addScheduleItem} className="gap-2">
          <Plus className="w-4 h-4" />
          添加时间
        </Button>
      </div>

      {errors.schedule && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <AlertCircle className="w-4 h-4 text-destructive" />
          <p className="text-sm text-destructive">{errors.schedule}</p>
        </div>
      )}

      <div className="space-y-4">
        {courseData.schedule.map((item, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">上课时间 {index + 1}</h4>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeScheduleItem(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>星期</Label>
                  <Select value={item.day} onValueChange={(value) => updateScheduleItem(index, 'day', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择星期" />
                    </SelectTrigger>
                    <SelectContent>
                      {weekDays.map(day => (
                        <SelectItem key={day.value} value={day.value}>{day.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>开始时间</Label>
                  <Select value={item.startTime} onValueChange={(value) => updateScheduleItem(index, 'startTime', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="开始时间" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map(time => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>结束时间</Label>
                  <Select value={item.endTime} onValueChange={(value) => updateScheduleItem(index, 'endTime', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="结束时间" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map(time => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>教室</Label>
                  <Input
                    value={item.location}
                    onChange={(e) => updateScheduleItem(index, 'location', e.target.value)}
                    placeholder="例：A101"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {courseData.schedule.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <h4 className="font-medium mb-1">还没有添加上课时间</h4>
            <p className="text-sm text-muted-foreground mb-4">点击上方按钮添加课程的上课时间安排</p>
            <Button onClick={addScheduleItem} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              添加第一个时间
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderContent = () => (
    <div className="space-y-6">
      {/* Teaching Objectives */}
      <div className="space-y-4">
        <div>
          <h3 className="font-medium">教学目标</h3>
          <p className="text-sm text-muted-foreground">描述学生完成课程后应达到的学习目标</p>
        </div>

        {errors.objectives && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <p className="text-sm text-destructive">{errors.objectives}</p>
          </div>
        )}

        <div className="flex gap-2">
          <Input
            value={newObjective}
            onChange={(e) => setNewObjective(e.target.value)}
            placeholder="添加教学目标..."
            onKeyPress={(e) => e.key === 'Enter' && addListItem('objectives', newObjective)}
          />
          <Button onClick={() => addListItem('objectives', newObjective)}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {courseData.objectives.map((objective, index) => (
            <div key={index} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <CheckCircle className="w-4 h-4 text-chart-1 flex-shrink-0" />
              <span className="flex-1">{objective}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeListItem('objectives', index)}
                className="w-6 h-6 text-muted-foreground hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Prerequisites */}
      <div className="space-y-4">
        <div>
          <h3 className="font-medium">先修课程</h3>
          <p className="text-sm text-muted-foreground">学生需要预先掌握的知识或完成的课程</p>
        </div>

        <div className="flex gap-2">
          <Input
            value={newPrerequisite}
            onChange={(e) => setNewPrerequisite(e.target.value)}
            placeholder="添加先修课程..."
            onKeyPress={(e) => e.key === 'Enter' && addListItem('prerequisites', newPrerequisite)}
          />
          <Button onClick={() => addListItem('prerequisites', newPrerequisite)}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {courseData.prerequisites.map((prerequisite, index) => (
            <Badge key={index} variant="outline" className="gap-1">
              {prerequisite}
              <button onClick={() => removeListItem('prerequisites', index)}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-4">
        <div>
          <h3 className="font-medium">课程标签</h3>
          <p className="text-sm text-muted-foreground">添加关键词帮助学生更好地找到和理解课程</p>
        </div>

        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="添加标签..."
            onKeyPress={(e) => e.key === 'Enter' && addListItem('tags', newTag)}
          />
          <Button onClick={() => addListItem('tags', newTag)}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {courseData.tags.map((tag, index) => (
            <Badge key={index} className="gap-1">
              {tag}
              <button onClick={() => removeListItem('tags', index)}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAssessment = () => {
    const totalWeight = courseData.assessmentMethods.reduce((sum, method) => sum + method.weight, 0);

    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-medium">成绩构成</h3>
          <p className="text-sm text-muted-foreground">设置各种考核方式的权重，总和必须为100%</p>
        </div>

        {errors.assessment && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <p className="text-sm text-destructive">{errors.assessment}</p>
          </div>
        )}

        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              {courseData.assessmentMethods.map((method, index) => {
                const typeInfo = assessmentTypes.find(t => t.value === method.type);
                return (
                  <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="flex-1">
                      <Select 
                        value={method.type} 
                        onValueChange={(value) => 
                          setCourseData(prev => ({
                            ...prev,
                            assessmentMethods: prev.assessmentMethods.map((m, i) =>
                              i === index ? { ...m, type: value } : m
                            )
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {assessmentTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={method.weight}
                        onChange={(e) => updateAssessmentWeight(index, parseInt(e.target.value) || 0)}
                        className="w-20"
                        min="0"
                        max="100"
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => 
                        setCourseData(prev => ({
                          ...prev,
                          assessmentMethods: prev.assessmentMethods.filter((_, i) => i !== index)
                        }))
                      }
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}

              <Button
                variant="outline"
                onClick={() =>
                  setCourseData(prev => ({
                    ...prev,
                    assessmentMethods: [...prev.assessmentMethods, { type: 'assignment', weight: 0 }]
                  }))
                }
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                添加考核方式
              </Button>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="font-medium">权重总计</span>
                <div className={`flex items-center gap-2 ${totalWeight === 100 ? 'text-chart-1' : 'text-destructive'}`}>
                  <span className="font-medium">{totalWeight}%</span>
                  {totalWeight === 100 ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                </div>
              </div>
              <Progress value={totalWeight} className="mt-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderReview = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium">确认课程信息</h3>
        <p className="text-sm text-muted-foreground">请仔细检查以下信息，确认无误后点击创建课程</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">基本信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">课程名称：</span>
              <span>{courseData.name}</span>
              <span className="text-muted-foreground">课程编号：</span>
              <span>{courseData.code}</span>
              <span className="text-muted-foreground">开课学期：</span>
              <span>{courseData.semester}</span>
              <span className="text-muted-foreground">课程性质：</span>
              <span>{courseData.type === 'required' ? '必修课' : '选修课'}</span>
              <span className="text-muted-foreground">学分：</span>
              <span>{courseData.credits}学分</span>
              <span className="text-muted-foreground">开课院系：</span>
              <span>{courseData.department}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">排课信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {courseData.schedule.map((item, index) => {
              const dayLabel = weekDays.find(d => d.value === item.day)?.label || item.day;
              return (
                <div key={index} className="text-sm">
                  {dayLabel} {item.startTime}-{item.endTime} ({item.location})
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">教学目标</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm">
              {courseData.objectives.map((objective, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 text-chart-1 mt-0.5 flex-shrink-0" />
                  {objective}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">成绩构成</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {courseData.assessmentMethods.map((method, index) => {
                const typeInfo = assessmentTypes.find(t => t.value === method.type);
                return (
                  <div key={index} className="flex justify-between">
                    <span>{typeInfo?.label}</span>
                    <span>{method.weight}%</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return renderBasicInfo();
      case 1: return renderSchedule();
      case 2: return renderContent();
      case 3: return renderAssessment();
      case 4: return renderReview();
      default: return null;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1>创建新课程</h1>
          <p className="text-muted-foreground">设置课程基本信息、排课时间和考核方式</p>
        </div>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  index <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "w-16 h-0.5 mx-2",
                    index < currentStep ? "bg-primary" : "bg-muted"
                  )} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h3 className="font-medium">{steps[currentStep].title}</h3>
            <p className="text-sm text-muted-foreground">{steps[currentStep].description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          {currentStep === 0 ? '取消' : '上一步'}
        </Button>
        <Button onClick={handleNext}>
          {currentStep === steps.length - 1 ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              创建课程
            </>
          ) : (
            '下一步'
          )}
        </Button>
      </div>
    </div>
  );
}