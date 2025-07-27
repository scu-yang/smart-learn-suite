import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Checkbox } from '../../ui/checkbox';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { 
  Search,
  Plus,
  Filter,
  Edit,
  Copy,
  Trash2,
  Eye,
  MoreVertical,
  FileQuestion,
  Database,
  BookOpen
} from 'lucide-react';
import { MathRenderer, DisplayMath } from '../../common/MathRenderer';

interface Question {
  id: string;
  title: string;
  content: string;
  answer: string;
  explanation: string;
  type: 'single-choice' | 'multiple-choice' | 'fill-blank' | 'essay';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  knowledgePoints: string[];
  tags: string[];
  createdAt: string;
  createdBy: string;
  options?: string[];
  usageCount: number;
  avgAccuracy: number;
}

const mockQuestions: Question[] = [
  {
    id: 'q1',
    title: '基本极限计算',
    content: '计算极限 $\\lim_{x \\to 0} \\frac{\\sin x}{x}$：',
    answer: '$1$',
    explanation: '这是一个重要极限。使用洛必达法则：$\\lim_{x \\to 0} \\frac{\\sin x}{x} = \\lim_{x \\to 0} \\frac{\\cos x}{1} = \\cos 0 = 1$',
    type: 'single-choice',
    difficulty: 'easy',
    points: 10,
    knowledgePoints: ['函数的概念', '数列的极限'],
    tags: ['重要极限', '基础'],
    createdAt: '2025-01-15',
    createdBy: '张教授',
    options: ['$0$', '$1$', '$\\infty$', '不存在'],
    usageCount: 45,
    avgAccuracy: 85
  },
  {
    id: 'q2',
    title: '极限的定义应用',
    content: '设函数 $f(x) = \\begin{cases} x^2 & x < 0 \\\\ 2x & x \\geq 0 \\end{cases}$，求 $\\lim_{x \\to 0} f(x)$：',
    answer: '$0$',
    explanation: '需要分别计算左极限和右极限：\\n$\\lim_{x \\to 0^-} f(x) = \\lim_{x \\to 0^-} x^2 = 0$\\n$\\lim_{x \\to 0^+} f(x) = \\lim_{x \\to 0^+} 2x = 0$\\n因为左极限等于右极限，所以 $\\lim_{x \\to 0} f(x) = 0$',
    type: 'fill-blank',
    difficulty: 'medium',
    points: 15,
    knowledgePoints: ['数列的极限'],
    tags: ['分段函数', '左右极限'],
    createdAt: '2025-01-12',
    createdBy: '李教授',
    usageCount: 32,
    avgAccuracy: 72
  },
  {
    id: 'q3',
    title: '函数连续性证明',
    content: '证明函数 $f(x) = x^3 - 3x + 1$ 在区间 $[0, 2]$ 上连续。',
    answer: '证明过程见解答',
    explanation: '\\textbf{证明：}\\n多项式函数在其定义域内处处连续。\\n函数 $f(x) = x^3 - 3x + 1$ 是多项式函数，因此在实数域上连续。\\n特别地，$f(x)$ 在区间 $[0, 2]$ 上连续。\\n\\textbf{详细说明：}\\n对于任意 $x_0 \\in [0, 2]$，有：\\n$\\lim_{x \\to x_0} f(x) = \\lim_{x \\to x_0} (x^3 - 3x + 1) = x_0^3 - 3x_0 + 1 = f(x_0)$\\n因此函数在 $[0, 2]$ 上每一点都连续。',
    type: 'essay',
    difficulty: 'hard',
    points: 25,
    knowledgePoints: ['函数的概念', '数列的极限'],
    tags: ['连续性', '证明题', '多项式函数'],
    createdAt: '2025-01-10',
    createdBy: '王教授',
    usageCount: 18,
    avgAccuracy: 58
  }
];

interface QuestionManagementProps {
  selectedKnowledgePoint?: string;
}

export function QuestionManagement({ selectedKnowledgePoint }: QuestionManagementProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | Question['type']>('all');

  // Filter questions by selected knowledge point and other filters
  const filteredQuestions = mockQuestions.filter(question => {
    const matchesKnowledgePoint = selectedKnowledgePoint 
      ? question.knowledgePoints.some(kp => kp.includes(selectedKnowledgePoint))
      : true;
    const matchesSearch = searchQuery === '' || 
      question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDifficulty = difficultyFilter === 'all' || question.difficulty === difficultyFilter;
    const matchesType = typeFilter === 'all' || question.type === typeFilter;
    
    return matchesKnowledgePoint && matchesSearch && matchesDifficulty && matchesType;
  });

  const handleQuestionSelect = (questionId: string, checked: boolean) => {
    const newSelected = new Set(selectedQuestions);
    if (checked) {
      newSelected.add(questionId);
    } else {
      newSelected.delete(questionId);
    }
    setSelectedQuestions(newSelected);
  };

  const handleSelectFromBank = () => {
    const params = new URLSearchParams();
    if (selectedKnowledgePoint) {
      params.set('knowledgePoint', selectedKnowledgePoint);
    }
    navigate(`/questions/browse?${params.toString()}`);
  };

  const handleCreateNew = () => {
    const params = new URLSearchParams();
    if (selectedKnowledgePoint) {
      params.set('defaultKnowledgePoint', selectedKnowledgePoint);
    }
    navigate(`/questions/create?${params.toString()}`);
  };

  const getDifficultyColor = (difficulty: Question['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'text-chart-2 bg-chart-2/10';
      case 'medium': return 'text-chart-4 bg-chart-4/10';
      case 'hard': return 'text-destructive bg-destructive/10';
    }
  };

  const getDifficultyText = (difficulty: Question['difficulty']) => {
    switch (difficulty) {
      case 'easy': return '简单';
      case 'medium': return '中等';
      case 'hard': return '困难';
    }
  };

  const getTypeText = (type: Question['type']) => {
    switch (type) {
      case 'single-choice': return '单选题';
      case 'multiple-choice': return '多选题';
      case 'fill-blank': return '填空题';
      case 'essay': return '问答题';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">题目管理</h3>
          <p className="text-sm text-muted-foreground">
            {selectedKnowledgePoint 
              ? `当前知识点：${selectedKnowledgePoint}` 
              : '管理所有题目'
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedQuestions.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                已选择 {selectedQuestions.size} 题
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    批量操作
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Copy className="w-4 h-4 mr-2" />
                    复制到其他知识点
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    从当前知识点移除
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          <Button variant="outline" onClick={handleSelectFromBank} className="gap-2">
            <Database className="w-4 h-4" />
            从题库选择
          </Button>
          <Button onClick={handleCreateNew} className="gap-2">
            <Plus className="w-4 h-4" />
            创建新题目
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-1">
              {filteredQuestions.length}
            </div>
            <p className="text-sm text-muted-foreground">相关题目</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-2">
              {filteredQuestions.filter(q => q.difficulty === 'easy').length}
            </div>
            <p className="text-sm text-muted-foreground">简单题目</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-3">
              {filteredQuestions.filter(q => q.difficulty === 'medium').length}
            </div>
            <p className="text-sm text-muted-foreground">中等题目</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive">
              {filteredQuestions.filter(q => q.difficulty === 'hard').length}
            </div>
            <p className="text-sm text-muted-foreground">困难题目</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="搜索题目内容、标签..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              难度：{difficultyFilter === 'all' ? '全部' : getDifficultyText(difficultyFilter)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setDifficultyFilter('all')}>
              全部难度
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDifficultyFilter('easy')}>
              简单
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDifficultyFilter('medium')}>
              中等
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDifficultyFilter('hard')}>
              困难
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              类型：{typeFilter === 'all' ? '全部' : getTypeText(typeFilter)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setTypeFilter('all')}>
              全部类型
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter('single-choice')}>
              单选题
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter('multiple-choice')}>
              多选题
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter('fill-blank')}>
              填空题
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter('essay')}>
              问答题
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Question List */}
      <div className="space-y-4">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((question) => (
            <Card key={question.id} className="group hover:shadow-sm transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={selectedQuestions.has(question.id)}
                    onCheckedChange={(checked) => handleQuestionSelect(question.id, checked as boolean)}
                  />
                  
                  <div className="flex-1 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <FileQuestion className="w-4 h-4 text-muted-foreground" />
                          <h4 className="font-medium">{question.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {getTypeText(question.type)}
                          </Badge>
                          <Badge className={`text-xs ${getDifficultyColor(question.difficulty)}`}>
                            {getDifficultyText(question.difficulty)}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {question.points}分
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>创建者：{question.createdBy}</span>
                          <span>创建时间：{question.createdAt}</span>
                          <span>使用次数：{question.usageCount}</span>
                          <span>平均正确率：{question.avgAccuracy}%</span>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            预览题目
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            编辑题目
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="w-4 h-4 mr-2" />
                            复制题目
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            从知识点移除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Question Content */}
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-1">题目内容：</p>
                        <div className="p-3 bg-muted/30 rounded border">
                          <MathRenderer content={question.content} />
                        </div>
                      </div>

                      {question.options && (
                        <div>
                          <p className="text-sm font-medium mb-1">选项：</p>
                          <div className="grid grid-cols-2 gap-2">
                            {question.options.map((option, index) => (
                              <div key={index} className="p-2 bg-muted/20 rounded text-sm">
                                {String.fromCharCode(65 + index)}. <MathRenderer content={option} />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <p className="text-sm font-medium mb-1">标准答案：</p>
                        <div className="p-2 bg-chart-1/10 border border-chart-1/30 rounded text-sm">
                          <MathRenderer content={question.answer} />
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-1">解答过程：</p>
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                          <MathRenderer content={question.explanation} />
                        </div>
                      </div>
                    </div>

                    {/* Knowledge Points and Tags */}
                    <div className="flex items-center gap-4 pt-2 border-t">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">知识点：</span>
                        <div className="flex gap-1">
                          {question.knowledgePoints.map(kp => (
                            <Badge key={kp} variant="outline" className="text-xs">
                              {kp}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">标签：</span>
                        <div className="flex gap-1">
                          {question.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <FileQuestion className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="font-medium mb-2">
                {selectedKnowledgePoint 
                  ? `"${selectedKnowledgePoint}" 暂无相关题目`
                  : '暂无题目'
                }
              </h3>
              <p className="text-muted-foreground mb-4">
                点击下方按钮从题库选择或创建新题目
              </p>
              <div className="flex justify-center gap-2">
                <Button variant="outline" onClick={handleSelectFromBank} className="gap-2">
                  <Database className="w-4 h-4" />
                  从题库选择
                </Button>
                <Button onClick={handleCreateNew} className="gap-2">
                  <Plus className="w-4 h-4" />
                  创建新题目
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}