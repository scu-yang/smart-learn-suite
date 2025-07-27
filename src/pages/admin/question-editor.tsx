import { useState, useEffect } from 'react';
import { useParams, useSearch } from '@tanstack/react-router';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MarkdownEditor } from '@/components/markdown-editor';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Save, 
  ArrowLeft, 
  FileText, 
  Settings,
  Home,
  Check,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import type { QuestionBank } from '@/types';

export function QuestionEditorPage() {
  const params = useParams({ strict: false });
  const search = useSearch({ strict: false });
  const questionId = params.questionId;
  const isEditMode = questionId !== 'new';
  
  const [formData, setFormData] = useState({
    subject: '',
    chapter: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    type: 'single-choice' as 'single-choice' | 'multiple-choice' | 'true-false' | 'essay',
    score: 5,
    tags: [] as string[],
    content: ''
  });
  
  const [settingsCollapsed, setSettingsCollapsed] = useState(window.innerWidth < 1200); // 响应式收缩状态
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1200) {
        setSettingsCollapsed(true);
      } else if (window.innerWidth >= 1400) {
        setSettingsCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isEditMode && questionId) {
      // 编辑模式下，从 API 或存储中加载题目数据
      loadQuestion(questionId);
    } else {
      // 创建模式下，如果有传入的类型参数，设置默认模板
      const type = (search as any)?.type || 'single-choice';
      setFormData(prev => ({
        ...prev,
        type,
        content: getQuestionTypeTemplate(type)
      }));
    }
  }, [questionId, isEditMode, search]);

  const loadQuestion = async (id: string) => {
    // 这里应该从 API 加载题目数据
    // 现在使用模拟数据
    const mockQuestion: QuestionBank = {
      id: id,
      subject: '计算机科学导论',
      chapter: '第一章：计算机基础',
      difficulty: 'medium',
      type: 'single-choice',
      question: '计算机的基本组成包括哪些部分？',
      options: ['输入设备、输出设备、存储器、运算器、控制器', '键盘、鼠标、显示器', '软件和硬件', '程序和数据'],
      correctAnswer: '输入设备、输出设备、存储器、运算器、控制器',
      explanation: '计算机的基本组成包括五大部分：输入设备、输出设备、存储器、运算器和控制器。',
      score: 5,
      tags: ['计算机组成', '基础概念'],
      createdBy: 'teacher_001',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      usageCount: 15
    };
    
    const markdownContent = convertQuestionToMarkdown(mockQuestion);
    setFormData({
      subject: mockQuestion.subject,
      chapter: mockQuestion.chapter,
      difficulty: mockQuestion.difficulty,
      type: mockQuestion.type,
      score: mockQuestion.score,
      tags: mockQuestion.tags,
      content: markdownContent
    });
  };

  const convertQuestionToMarkdown = (q: QuestionBank): string => {
    let markdown = `## 题目\n\n${q.question}\n\n`;
    
    if (q.options && q.options.length > 0) {
      markdown += `## 选项\n\n`;
      q.options.forEach((option, index) => {
        const letter = String.fromCharCode(65 + index);
        markdown += `${letter}. ${option}\n`;
      });
      markdown += '\n';
    }
    
    markdown += `## 正确答案\n\n`;
    if (Array.isArray(q.correctAnswer)) {
      markdown += q.correctAnswer.join(', ') + '\n\n';
    } else {
      markdown += q.correctAnswer + '\n\n';
    }
    
    if (q.explanation) {
      markdown += `## 解析\n\n${q.explanation}\n\n`;
    }
    
    return markdown;
  };

  const parseMarkdownToQuestion = (markdown: string) => {
    const sections = markdown.split(/^##\s/m).filter(Boolean);
    const result: any = {
      question: '',
      options: [],
      correctAnswer: '',
      explanation: ''
    };

    sections.forEach(section => {
      const lines = section.trim().split('\n');
      const title = lines[0].toLowerCase().trim();
      const content = lines.slice(1).join('\n').trim();

      if (title.includes('题目')) {
        result.question = content;
      } else if (title.includes('选项')) {
        const options = content.split('\n')
          .filter(line => /^[A-Z]\.\s/.test(line.trim()))
          .map(line => line.replace(/^[A-Z]\.\s/, '').trim());
        result.options = options;
      } else if (title.includes('正确答案') || title.includes('答案')) {
        if (formData.type === 'multiple-choice') {
          result.correctAnswer = content.split(',').map(s => s.trim()).filter(Boolean);
        } else {
          result.correctAnswer = content;
        }
      } else if (title.includes('解析')) {
        result.explanation = content;
      }
    });

    return result;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const parsedQuestion = parseMarkdownToQuestion(formData.content);
      
      const questionData = {
        ...formData,
        ...parsedQuestion,
        tags: formData.tags
      };

      // 这里应该调用 API 保存题目
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('保存题目数据:', questionData);
      
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      
      // 保存成功后可以选择是否返回题库管理页面
      setTimeout(() => {
        window.location.href = '/admin/question-bank';
      }, 1500);
    } catch (error) {
      console.error('保存题目失败:', error);
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const getQuestionTypeTemplate = (type: string) => {
    switch (type) {
      case 'single-choice':
        return `## 题目

请在此处输入题目内容...

## 选项

A. 选项A
B. 选项B
C. 选项C
D. 选项D

## 正确答案

A

## 解析

请在此处输入答案解析...`;
      
      case 'multiple-choice':
        return `## 题目

请在此处输入题目内容...

## 选项

A. 选项A
B. 选项B
C. 选项C
D. 选项D

## 正确答案

A, C

## 解析

请在此处输入答案解析...`;
      
      case 'true-false':
        return `## 题目

请在此处输入题目内容...

## 正确答案

正确

## 解析

请在此处输入答案解析...`;
      
      case 'essay':
        return `## 题目

请在此处输入题目内容...

## 参考答案

请在此处输入参考答案...

## 评分标准

1. 要点一 (X分)
2. 要点二 (X分)
3. 要点三 (X分)

## 解析

请在此处输入答案解析...`;

      case 'math':
        return `## 题目

已知函数 $f(x) = x^2 + 2x + 1$，求：

1. $f(0)$ 的值
2. 求解方程 $f(x) = 0$

## 解答过程

### 第一问
将 $x = 0$ 代入函数：
$$f(0) = 0^2 + 2 \\cdot 0 + 1 = 1$$

### 第二问
解方程 $x^2 + 2x + 1 = 0$：
$$x^2 + 2x + 1 = (x + 1)^2 = 0$$
因此 $x = -1$

## 答案

1. $f(0) = 1$
2. $x = -1$`;
      
      default:
        return '';
    }
  };

  const handleTypeChange = (newType: string) => {
    // 确认是否要切换模板（如果当前有内容）
    if (formData.content.trim() && formData.content !== getQuestionTypeTemplate(formData.type)) {
      if (!confirm('切换题型将清空当前内容，确定继续吗？')) {
        return;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      type: newType as any,
      content: getQuestionTypeTemplate(newType) // 强制替换为新模板内容，不是追加
    }));
  };

  const goBack = () => {
    window.location.href = '/admin/question-bank';
  };

  const goHome = () => {
    window.location.href = '/admin';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <div className="bg-white border-b">
        <div className="w-full px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex items-center justify-between min-h-16 py-2">
            {/* 左侧区域 */}
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={goBack}
                className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">返回题库</span>
                <span className="sm:hidden">返回</span>
              </Button>
              
              <Separator orientation="vertical" className="h-6 hidden sm:block" />
              
              <div className="flex items-center space-x-2 min-w-0">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                  {isEditMode ? '编辑题目' : '创建新题目'}
                </h1>
              </div>
            </div>
            
            {/* 右侧按钮区域 - 响应式换行 */}
            <div className="flex items-center space-x-1 sm:space-x-2 flex-wrap justify-end ml-2">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goHome}
                  title="返回主页"
                  className="flex-shrink-0"
                >
                  <Home className="w-4 h-4" />
                </Button>
              </div>
              
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0 mt-2 sm:mt-0"
                size="sm"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : saved ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span className="text-sm">{saving ? '保存中...' : saved ? '已保存' : '保存'}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6">
        <div className="flex flex-col xl:flex-row gap-4 sm:gap-6">
          {/* 侧边栏设置面板 - 始终显示但可收缩 */}
          <div className={`flex-shrink-0 transition-all duration-300 ${
            settingsCollapsed ? 'w-full xl:w-16' : 'w-full xl:w-80 2xl:w-96'
          }`}>
            <Card className="p-4 sm:p-6 xl:sticky xl:top-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className={`font-medium text-gray-900 flex items-center text-sm sm:text-base transition-opacity duration-300 ${
                  settingsCollapsed ? 'xl:opacity-0 xl:pointer-events-none' : 'opacity-100'
                }`}>
                  <Settings className="w-4 h-4 mr-2" />
                  题目设置
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSettingsCollapsed(!settingsCollapsed)}
                  className="flex-shrink-0"
                  title={settingsCollapsed ? '展开设置' : '收起设置'}
                >
                  {settingsCollapsed ? (
                    <ChevronRight className="w-4 h-4" />
                  ) : (
                    <ChevronLeft className="w-4 h-4" />
                  )}
                </Button>
              </div>
              
              <div className={`transition-all duration-300 ${
                settingsCollapsed ? 'xl:opacity-0 xl:pointer-events-none xl:h-0 xl:overflow-hidden' : 'opacity-100'
              }`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3 sm:gap-5">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">科目</label>
                    <Input
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="请输入科目"
                      className="text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">章节</label>
                    <Input
                      value={formData.chapter}
                      onChange={(e) => setFormData(prev => ({ ...prev, chapter: e.target.value }))}
                      placeholder="请输入章节"
                      className="text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">题型</label>
                    <select
                      value={formData.type}
                      onChange={(e) => handleTypeChange(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="single-choice">单选题</option>
                      <option value="multiple-choice">多选题</option>
                      <option value="true-false">判断题</option>
                      <option value="essay">问答题</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">难度</label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as any }))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="easy">简单</option>
                      <option value="medium">中等</option>
                      <option value="hard">困难</option>
                    </select>
                  </div>
                  
                  <div className="sm:col-span-2 xl:col-span-1">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">分值</label>
                    <Input
                      type="number"
                      value={formData.score}
                      onChange={(e) => setFormData(prev => ({ ...prev, score: parseInt(e.target.value) || 0 }))}
                      min="1"
                      max="100"
                      className="text-sm"
                    />
                  </div>
                  
                  <div className="sm:col-span-2 xl:col-span-1">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">标签</label>
                    <div className="flex space-x-2 mb-3">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="输入标签"
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                        className="flex-1 text-sm"
                      />
                      <Button size="sm" onClick={addTag} className="text-xs px-3">添加</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-red-100 hover:text-red-800 text-xs"
                          onClick={() => removeTag(tag)}
                        >
                          {tag} <X className="w-3 h-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* 主编辑区域 */}
          <div className="flex-1 min-w-0">
            <Card className="h-full">
              <div className="p-3 sm:p-6">
                <MarkdownEditor
                  value={formData.content}
                  onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                  height="calc(100vh - 200px)"
                  label="题目内容 (支持 Markdown 格式)"
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
