import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { MarkdownEditor } from '@/components/markdown-editor';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Save, X, FileText, HelpCircle, Eye, Settings } from 'lucide-react';
import type { QuestionBank } from '@/types';

interface QuestionEditorWorkspaceProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question?: QuestionBank | null;
  onSave: (questionData: any) => void;
  mode?: 'create' | 'edit';
}

export function QuestionEditorWorkspace({
  open,
  onOpenChange,
  question,
  onSave,
  mode = 'create'
}: QuestionEditorWorkspaceProps) {
  const [formData, setFormData] = useState({
    subject: '',
    chapter: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    type: 'single-choice' as 'single-choice' | 'multiple-choice' | 'true-false' | 'essay',
    score: 5,
    tags: [] as string[],
    content: ''
  });
  
  const [showPreview, setShowPreview] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (question && mode === 'edit') {
      // 编辑模式下，将现有题目数据转换为 Markdown 格式
      const markdownContent = convertQuestionToMarkdown(question);
      setFormData({
        subject: question.subject,
        chapter: question.chapter,
        difficulty: question.difficulty,
        type: question.type,
        score: question.score,
        tags: question.tags,
        content: markdownContent
      });
    } else {
      // 创建模式下重置表单
      setFormData({
        subject: '',
        chapter: '',
        difficulty: 'medium',
        type: 'single-choice',
        score: 5,
        tags: [],
        content: ''
      });
    }
  }, [question, mode, open]);

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

  const handleSave = () => {
    const parsedQuestion = parseMarkdownToQuestion(formData.content);
    
    const questionData = {
      ...formData,
      ...parsedQuestion,
      tags: formData.tags
    };

    onSave(questionData);
    onOpenChange(false);
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
      
      default:
        return '';
    }
  };

  const handleTypeChange = (newType: string) => {
    setFormData(prev => ({
      ...prev,
      type: newType as any,
      content: getQuestionTypeTemplate(newType)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[95vh] w-[95vw] p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>{mode === 'create' ? '创建新题目' : '编辑题目'}</span>
            </DialogTitle>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                title="题目设置"
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                title="预览题目"
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* 侧边栏设置面板 */}
          {showSettings && (
            <div className="w-80 border-r bg-gray-50 p-4 overflow-y-auto">
              <h3 className="font-medium text-gray-900 mb-4">题目设置</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">科目</label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="请输入科目"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">章节</label>
                  <Input
                    value={formData.chapter}
                    onChange={(e) => setFormData(prev => ({ ...prev, chapter: e.target.value }))}
                    placeholder="请输入章节"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">题型</label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleTypeChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="single-choice">单选题</option>
                    <option value="multiple-choice">多选题</option>
                    <option value="true-false">判断题</option>
                    <option value="essay">问答题</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">难度</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="easy">简单</option>
                    <option value="medium">中等</option>
                    <option value="hard">困难</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">分值</label>
                  <Input
                    type="number"
                    value={formData.score}
                    onChange={(e) => setFormData(prev => ({ ...prev, score: parseInt(e.target.value) || 0 }))}
                    min="1"
                    max="100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">标签</label>
                  <div className="flex space-x-1 mb-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="输入标签"
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      className="flex-1"
                    />
                    <Button size="sm" onClick={addTag}>添加</Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {formData.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => removeTag(tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 主编辑区域 */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-6">
              <MarkdownEditor
                value={formData.content}
                onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                height="calc(100vh - 200px)"
                label="题目内容 (支持 Markdown 格式)"
              />
            </div>
          </div>

          {/* 预览面板 */}
          {showPreview && (
            <div className="w-96 border-l bg-white p-4 overflow-y-auto">
              <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                题目预览
              </h3>
              
              <Card className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant={formData.difficulty === 'easy' ? 'secondary' : formData.difficulty === 'medium' ? 'default' : 'destructive'}>
                      {formData.difficulty === 'easy' ? '简单' : formData.difficulty === 'medium' ? '中等' : '困难'}
                    </Badge>
                    <Badge variant="outline">
                      {formData.type === 'single-choice' ? '单选题' :
                       formData.type === 'multiple-choice' ? '多选题' :
                       formData.type === 'true-false' ? '判断题' : '问答题'}
                    </Badge>
                  </div>
                  <span className="text-sm text-gray-500">{formData.score}分</span>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    <strong>科目:</strong> {formData.subject || '未设置'}
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>章节:</strong> {formData.chapter || '未设置'}
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="text-sm text-gray-600">
                      <strong>标签:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {formData.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="prose prose-sm max-w-none">
                  {formData.content ? (
                    <div dangerouslySetInnerHTML={{ 
                      __html: formData.content.replace(/\n/g, '<br>') 
                    }} />
                  ) : (
                    <p className="text-gray-400 italic">暂无内容</p>
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>

        <DialogFooter className="px-6 py-4 border-t">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <HelpCircle className="w-4 h-4" />
              <span>支持 Markdown 语法，使用模板快速创建题目</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                取消
              </Button>
              <Button onClick={handleSave} className="flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>{mode === 'create' ? '创建题目' : '保存修改'}</span>
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
