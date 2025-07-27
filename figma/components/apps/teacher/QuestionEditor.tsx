import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Badge } from '../../ui/badge';
import { Checkbox } from '../../ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  ArrowLeft,
  Plus,
  Trash2,
  Eye,
  Save,
  FileQuestion,
  Calculator,
  BookOpen,
  Tag,
  Check
} from 'lucide-react';
import { MixedContentRenderer } from '../../common/MathRenderer';
import LaTeXEditor from '../../common/LaTeXEditor';
import CourseSelector from '../../common/CourseSelector';
import KnowledgePointTreeSelector from '../../common/KnowledgePointTreeSelector';

interface QuestionData {
  title: string;
  content: string;
  answer?: string; // 只有填空题才有标准答案
  explanation: string;
  type: 'multiple-choice' | 'fill-blank' | 'calculation' | 'proof' | 'subjective';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  courseId: string;
  knowledgePoints: string[];
  tags: string[];
  options: string[];
  correctAnswers: number[]; // 正确答案的索引数组（仅用于不定项选择题）
}

const commonTags = [
  '基础概念',
  '重要极限', 
  '洛必达法则',
  '夹逼定理',
  '连续性',
  '可去间断点',
  '单调性',
  '极值问题',
  '最值问题',
  '分部积分',
  '换元积分',
  '几何应用',
  '物理应用'
];

export function QuestionEditor() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultCourse = searchParams.get('defaultCourse');
  const defaultKnowledgePoint = searchParams.get('defaultKnowledgePoint');
  const editingId = searchParams.get('id'); // For editing existing question
  
  const [questionData, setQuestionData] = useState<QuestionData>({
    title: '',
    content: '',
    answer: '', // 初始为空字符串，但只在填空题时使用
    explanation: '',
    type: 'multiple-choice',
    difficulty: 'medium',
    points: 10,
    courseId: defaultCourse || '',
    knowledgePoints: defaultKnowledgePoint ? [defaultKnowledgePoint] : [],
    tags: [],
    options: ['', '', '', ''], // Default for multiple choice
    correctAnswers: [] // 默认没有选中的正确答案
  });

  const [showPreview, setShowPreview] = useState(false);
  const [newTag, setNewTag] = useState('');

  const handleInputChange = (field: keyof QuestionData, value: any) => {
    setQuestionData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...questionData.options];
    newOptions[index] = value;
    setQuestionData(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const handleCorrectAnswerToggle = (index: number, checked: boolean) => {
    setQuestionData(prev => {
      const newCorrectAnswers = checked 
        ? [...prev.correctAnswers, index]
        : prev.correctAnswers.filter(i => i !== index);
      
      return {
        ...prev,
        correctAnswers: newCorrectAnswers.sort() // 保持索引有序
      };
    });
  };

  const addOption = () => {
    setQuestionData(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const removeOption = (index: number) => {
    if (questionData.options.length > 2) {
      const newOptions = questionData.options.filter((_, i) => i !== index);
      // 更新正确答案索引
      const newCorrectAnswers = questionData.correctAnswers
        .filter(i => i !== index) // 移除被删除选项的正确答案标记
        .map(i => i > index ? i - 1 : i); // 调整索引
      
      setQuestionData(prev => ({
        ...prev,
        options: newOptions,
        correctAnswers: newCorrectAnswers
      }));
    }
  };

  const handleCourseChange = (courseId: string) => {
    setQuestionData(prev => ({
      ...prev,
      courseId,
      knowledgePoints: [] // 清空知识点选择当课程改变时
    }));
  };

  const handleKnowledgePointsChange = (points: string[]) => {
    setQuestionData(prev => ({
      ...prev,
      knowledgePoints: points
    }));
  };

  const handleTagToggle = (tag: string, checked: boolean) => {
    if (checked) {
      setQuestionData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    } else {
      setQuestionData(prev => ({
        ...prev,
        tags: prev.tags.filter(t => t !== tag)
      }));
    }
  };

  const addNewTag = () => {
    if (newTag.trim() && !questionData.tags.includes(newTag.trim())) {
      setQuestionData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setQuestionData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tagToRemove)
    }));
  };

  const handleTypeChange = (newType: QuestionData['type']) => {
    setQuestionData(prev => {
      const newData = { ...prev, type: newType };
      
      // 根据题目类型调整相关字段
      if (newType === 'multiple-choice') {
        // 不定项选择题：保留选项和正确答案，清空标准答案
        if (prev.options.length < 2) {
          newData.options = ['', '', '', ''];
          newData.correctAnswers = [];
        }
        newData.answer = undefined;
      } else if (newType === 'fill-blank') {
        // 填空题：清空选项，保留标准答案
        newData.options = [];
        newData.correctAnswers = [];
        newData.answer = prev.answer || '';
      } else {
        // 计算题、证明题、其他主观题：清空选项和标准答案
        newData.options = [];
        newData.correctAnswers = [];
        newData.answer = undefined;
      }
      
      return newData;
    });
  };

  const handleSave = () => {
    // Validation
    if (!questionData.title.trim()) {
      alert('请输入题目标题');
      return;
    }
    if (!questionData.content.trim()) {
      alert('请输入题目内容');
      return;
    }
    if (!questionData.explanation.trim()) {
      alert('请输入解答过程');
      return;
    }
    if (!questionData.courseId) {
      alert('请选择所属课程');
      return;
    }
    if (questionData.knowledgePoints.length === 0) {
      alert('请至少选择一个知识点');
      return;
    }

    // 题型特定验证
    if (questionData.type === 'multiple-choice') {
      if (questionData.correctAnswers.length === 0) {
        alert('请至少选择一个正确答案');
        return;
      }
      if (questionData.options.filter(opt => opt.trim()).length < 2) {
        alert('选择题至少需要2个选项');
        return;
      }
    } else if (questionData.type === 'fill-blank') {
      if (!questionData.answer?.trim()) {
        alert('请输入填空题的标准答案');
        return;
      }
    }

    // Save logic
    console.log('Saving question:', questionData);
    navigate(-1);
  };

  const getDifficultyText = (difficulty: QuestionData['difficulty']) => {
    switch (difficulty) {
      case 'easy': return '简单';
      case 'medium': return '中等';
      case 'hard': return '困难';
    }
  };

  const getTypeText = (type: QuestionData['type']) => {
    switch (type) {
      case 'multiple-choice': return '不定项选择题';
      case 'fill-blank': return '填空题';
      case 'calculation': return '计算题';
      case 'proof': return '证明题';
      case 'subjective': return '其他主观题';
    }
  };

  const getCorrectAnswersText = () => {
    if (questionData.correctAnswers.length === 0) return '未设置';
    return questionData.correctAnswers
      .map(index => String.fromCharCode(65 + index))
      .join(', ');
  };

  // 检查是否需要显示标准答案
  const shouldShowAnswer = () => {
    return questionData.type === 'fill-blank';
  };

  const renderPreview = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileQuestion className="w-5 h-5" />
          题目预览
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline">{getTypeText(questionData.type)}</Badge>
          <Badge variant="secondary">{getDifficultyText(questionData.difficulty)}</Badge>
          <Badge>{questionData.points}分</Badge>
        </div>

        <div>
          <h4 className="font-medium mb-2">{questionData.title}</h4>
          <div className="p-4 border rounded-lg bg-muted/30">
            <MixedContentRenderer content={questionData.content} />
          </div>
        </div>

        {questionData.type === 'multiple-choice' && 
         questionData.options.some(opt => opt.trim()) && (
          <div>
            <p className="font-medium mb-2">选项：</p>
            <div className="space-y-2">
              {questionData.options.filter(opt => opt.trim()).map((option, index) => (
                <div key={index} className={`flex items-start gap-2 p-2 border rounded ${
                  questionData.correctAnswers.includes(index) ? 'bg-chart-2/10 border-chart-2' : ''
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                    {questionData.correctAnswers.includes(index) && (
                      <Check className="w-4 h-4 text-chart-2" />
                    )}
                  </div>
                  <div className="flex-1">
                    <MixedContentRenderer content={option} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              正确答案：{getCorrectAnswersText()}
            </div>
          </div>
        )}

        {shouldShowAnswer() && questionData.answer && (
          <div>
            <p className="font-medium mb-2">标准答案：</p>
            <div className="p-3 bg-chart-1/10 border border-chart-1/30 rounded">
              <MixedContentRenderer content={questionData.answer} />
            </div>
          </div>
        )}

        {questionData.explanation && (
          <div>
            <p className="font-medium mb-2">
              {questionData.type === 'fill-blank' ? '解答过程：' : '参考解答：'}
            </p>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <MixedContentRenderer content={questionData.explanation} />
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 pt-2 border-t">
          <div className="flex items-center gap-2">
            <span className="font-medium">知识点：</span>
            {questionData.knowledgePoints.slice(0, 3).map(kp => (
              <Badge key={kp} variant="outline" className="text-xs">
                {kp}
              </Badge>
            ))}
            {questionData.knowledgePoints.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{questionData.knowledgePoints.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
            <div>
              <h1>{editingId ? '编辑题目' : '创建新题目'}</h1>
              <p className="text-muted-foreground">
                {defaultCourse && '默认课程已设置'}{defaultKnowledgePoint && ' | 默认知识点已设置'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowPreview(!showPreview)}
              className="gap-2"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? '编辑模式' : '预览模式'}
            </Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="w-4 h-4" />
              保存题目
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Editor Panel */}
          <div className="xl:col-span-2 space-y-6">
            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList>
                <TabsTrigger value="basic">基本信息</TabsTrigger>
                <TabsTrigger value="content">内容编辑</TabsTrigger>
                <TabsTrigger value="classification">课程分类</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileQuestion className="w-5 h-5" />
                      基本信息
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">题目标题 *</Label>
                      <Input
                        id="title"
                        value={questionData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="请输入题目标题"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>题目类型 *</Label>
                        <Select 
                          value={questionData.type} 
                          onValueChange={handleTypeChange}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="multiple-choice">不定项选择题</SelectItem>
                            <SelectItem value="fill-blank">填空题</SelectItem>
                            <SelectItem value="calculation">计算题</SelectItem>
                            <SelectItem value="proof">证明题</SelectItem>
                            <SelectItem value="subjective">其他主观题</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>难度等级 *</Label>
                        <Select 
                          value={questionData.difficulty} 
                          onValueChange={(value: any) => handleInputChange('difficulty', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="easy">简单</SelectItem>
                            <SelectItem value="medium">中等</SelectItem>
                            <SelectItem value="hard">困难</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="points">分值</Label>
                      <Input
                        id="points"
                        type="number"
                        min="1"
                        max="100"
                        value={questionData.points}
                        onChange={(e) => handleInputChange('points', parseInt(e.target.value) || 10)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                {/* 题目内容 LaTeX 编辑器 */}
                <LaTeXEditor
                  value={questionData.content}
                  onChange={(value) => handleInputChange('content', value)}
                  placeholder="请输入题目内容，支持LaTeX公式..."
                  rows={6}
                  label="题目内容 *"
                  description="支持 LaTeX 数学公式，如极限、积分、矩阵等。数学环境可直接使用，无需 $ 包裹。"
                  showPreview={true}
                />

                {questionData.type === 'multiple-choice' && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">选项设置</CardTitle>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={addOption}
                          className="gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          添加选项
                        </Button>
                      </div>
                      <CardDescription>
                        勾选正确答案（可多选）
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {questionData.options.map((option, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="w-8 text-sm font-medium">
                              {String.fromCharCode(65 + index)}.
                            </span>
                            <Checkbox
                              checked={questionData.correctAnswers.includes(index)}
                              onCheckedChange={(checked) => handleCorrectAnswerToggle(index, checked as boolean)}
                            />
                            <Label className="text-sm text-muted-foreground">正确答案</Label>
                            {questionData.options.length > 2 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeOption(index)}
                                className="ml-auto w-8 h-8"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          <div className="ml-10">
                            <LaTeXEditor
                              value={option}
                              onChange={(value) => handleOptionChange(index, value)}
                              placeholder={`选项 ${String.fromCharCode(65 + index)} (支持LaTeX)`}
                              rows={2}
                              showPreview={false}
                            />
                          </div>
                        </div>
                      ))}
                      
                      {questionData.correctAnswers.length > 0 && (
                        <div className="mt-4 p-3 bg-chart-2/10 border border-chart-2/30 rounded">
                          <div className="flex items-center gap-2 text-sm">
                            <Check className="w-4 h-4 text-chart-2" />
                            <span className="font-medium">已选择的正确答案：</span>
                            <span className="text-chart-2">
                              {getCorrectAnswersText()}
                            </span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* 标准答案 - 仅填空题显示 */}
                {shouldShowAnswer() && (
                  <LaTeXEditor
                    value={questionData.answer || ''}
                    onChange={(value) => handleInputChange('answer', value)}
                    placeholder="请输入填空题的标准答案，支持LaTeX公式..."
                    rows={4}
                    label="标准答案 *"
                    description="填空题的标准答案，支持LaTeX数学公式"
                    showPreview={true}
                  />
                )}

                {/* 解答过程 LaTeX 编辑器 */}
                <LaTeXEditor
                  value={questionData.explanation}
                  onChange={(value) => handleInputChange('explanation', value)}
                  placeholder={
                    questionData.type === 'fill-blank' 
                      ? "请输入详细的解答过程，支持LaTeX公式..."
                      : questionData.type === 'multiple-choice'
                        ? "请输入选择依据和解题思路，支持LaTeX公式..."
                        : "请输入参考解答过程，支持LaTeX公式..."
                  }
                  rows={8}
                  label={
                    questionData.type === 'fill-blank' 
                      ? "解答过程 *"
                      : questionData.type === 'multiple-choice'
                        ? "解题思路 *"
                        : "参考解答 *"
                  }
                  description={
                    questionData.type === 'fill-blank' 
                      ? "详细的解题步骤和说明，支持LaTeX数学公式"
                      : questionData.type === 'multiple-choice'
                        ? "选择依据和解题思路，支持LaTeX数学公式"
                        : "参考解答过程和评分要点，支持LaTeX数学公式"
                  }
                  showPreview={true}
                />
              </TabsContent>

              <TabsContent value="classification" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      课程与知识点
                    </CardTitle>
                    <CardDescription>选择题目所属的课程和相关知识点</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* 课程选择 */}
                    <CourseSelector
                      value={questionData.courseId}
                      onValueChange={handleCourseChange}
                      required={true}
                    />

                    {/* 知识点选择 */}
                    <KnowledgePointTreeSelector
                      selectedPoints={questionData.knowledgePoints}
                      onSelectionChange={handleKnowledgePointsChange}
                      courseId={questionData.courseId}
                      required={true}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Tag className="w-5 h-5" />
                      标签管理
                    </CardTitle>
                    <CardDescription>为题目添加标签，便于检索和分类</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Selected Tags */}
                    {questionData.tags.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">已选择标签：</p>
                        <div className="flex flex-wrap gap-2">
                          {questionData.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="gap-1">
                              {tag}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 hover:bg-transparent"
                                onClick={() => removeTag(tag)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Add New Tag */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="输入自定义标签"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addNewTag()}
                      />
                      <Button onClick={addNewTag} disabled={!newTag.trim()}>
                        添加
                      </Button>
                    </div>

                    {/* Common Tags */}
                    <div>
                      <p className="text-sm font-medium mb-2">常用标签：</p>
                      <div className="grid grid-cols-2 gap-2">
                        {commonTags.map(tag => (
                          <div key={tag} className="flex items-center space-x-2">
                            <Checkbox
                              id={`tag-${tag}`}
                              checked={questionData.tags.includes(tag)}
                              onCheckedChange={(checked) => handleTagToggle(tag, checked as boolean)}
                            />
                            <Label htmlFor={`tag-${tag}`} className="text-sm">
                              {tag}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview Panel */}
          <div className="xl:col-span-1">
            <div className="sticky top-6">
              {showPreview ? renderPreview() : (
                <Card>
                  <CardHeader>
                    <CardTitle>实时预览</CardTitle>
                    <CardDescription>
                      点击右上角"预览模式"查看题目效果
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center py-8 text-muted-foreground">
                    <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>预览面板</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}