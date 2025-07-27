import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  ArrowLeft,
  Search,
  Filter,
  FileQuestion,
  Check,
  Plus,
  BookOpen,
  Brain
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
  isInCurrentKnowledgePoint?: boolean;
}

// Mock data - 更多题库中的题目
const mockQuestionBank: Question[] = [
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
    avgAccuracy: 85,
    isInCurrentKnowledgePoint: true
  },
  {
    id: 'q4',
    title: '夹逼定理应用',
    content: '利用夹逼定理计算 $\\lim_{n \\to \\infty} \\frac{\\sin n}{n}$：',
    answer: '$0$',
    explanation: '由于 $-1 \\leq \\sin n \\leq 1$，所以 $-\\frac{1}{n} \\leq \\frac{\\sin n}{n} \\leq \\frac{1}{n}$\\n因为 $\\lim_{n \\to \\infty} (-\\frac{1}{n}) = \\lim_{n \\to \\infty} \\frac{1}{n} = 0$\\n根据夹逼定理，$\\lim_{n \\to \\infty} \\frac{\\sin n}{n} = 0$',
    type: 'fill-blank',
    difficulty: 'medium',
    points: 15,
    knowledgePoints: ['数列的极限'],
    tags: ['夹逼定理', '数列极限'],
    createdAt: '2025-01-14',
    createdBy: '李教授',
    usageCount: 28,
    avgAccuracy: 68,
    isInCurrentKnowledgePoint: false
  },
  {
    id: 'q5',
    title: '无穷大量的比较',
    content: '比较当 $x \\to +\\infty$ 时，$x^2$ 和 $e^x$ 的增长速度：',
    answer: '$e^x$ 增长更快',
    explanation: '计算 $\\lim_{x \\to +\\infty} \\frac{x^2}{e^x}$\\n连续使用洛必达法则：\\n$\\lim_{x \\to +\\infty} \\frac{x^2}{e^x} = \\lim_{x \\to +\\infty} \\frac{2x}{e^x} = \\lim_{x \\to +\\infty} \\frac{2}{e^x} = 0$\\n因此 $e^x$ 比 $x^2$ 增长得更快',
    type: 'essay',
    difficulty: 'hard',
    points: 20,
    knowledgePoints: ['数列的极限'],
    tags: ['洛必达法则', '无穷大比较'],
    createdAt: '2025-01-13',
    createdBy: '王教授',
    usageCount: 15,
    avgAccuracy: 52,
    isInCurrentKnowledgePoint: false
  },
  {
    id: 'q6',
    title: '函数连续性判断',
    content: '判断函数 $f(x) = \\begin{cases} \\frac{x^2-1}{x-1} & x \\neq 1 \\\\ 2 & x = 1 \\end{cases}$ 在 $x = 1$ 处的连续性：',
    answer: '连续',
    explanation: '首先化简 $x \\neq 1$ 时的表达式：\\n$\\frac{x^2-1}{x-1} = \\frac{(x-1)(x+1)}{x-1} = x+1$ (当 $x \\neq 1$)\\n计算极限：$\\lim_{x \\to 1} f(x) = \\lim_{x \\to 1} (x+1) = 2$\\n而 $f(1) = 2$\\n因为 $\\lim_{x \\to 1} f(x) = f(1) = 2$，所以函数在 $x = 1$ 处连续',
    type: 'single-choice',
    difficulty: 'medium',
    points: 12,
    knowledgePoints: ['函数的概念'],
    tags: ['连续性', '可去间断点'],
    createdAt: '2025-01-11',
    createdBy: '赵教授',
    options: ['连续', '不连续', '左连续但不右连续', '右连续但不左连续'],
    usageCount: 38,
    avgAccuracy: 76,
    isInCurrentKnowledgePoint: false
  },
  {
    id: 'q7',
    title: '复合函数极限',
    content: '计算 $\\lim_{x \\to 0} \\frac{\\ln(1+x)}{x}$：',
    answer: '$1$',
    explanation: '方法一：使用重要极限 $\\lim_{u \\to 0} \\frac{\\ln(1+u)}{u} = 1$\\n方法二：使用洛必达法则\\n$\\lim_{x \\to 0} \\frac{\\ln(1+x)}{x} = \\lim_{x \\to 0} \\frac{\\frac{1}{1+x}}{1} = \\frac{1}{1+0} = 1$',
    type: 'fill-blank',
    difficulty: 'easy',
    points: 8,
    knowledgePoints: ['数列的极限'],
    tags: ['对数函数', '重要极限'],
    createdAt: '2025-01-09',
    createdBy: '张教授',
    usageCount: 52,
    avgAccuracy: 82,
    isInCurrentKnowledgePoint: false
  }
];

export function QuestionSelector() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetKnowledgePoint = searchParams.get('knowledgePoint');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [showOnlyRelevant, setShowOnlyRelevant] = useState(false);

  // Filter questions
  const filteredQuestions = mockQuestionBank.filter(question => {
    const matchesSearch = searchQuery === '' || 
      question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDifficulty = difficultyFilter === 'all' || question.difficulty === difficultyFilter;
    const matchesRelevance = !showOnlyRelevant || 
      (targetKnowledgePoint && question.knowledgePoints.some(kp => 
        kp.includes(targetKnowledgePoint) || targetKnowledgePoint.includes(kp)
      ));
    
    return matchesSearch && matchesDifficulty && matchesRelevance;
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

  const handleAddToKnowledgePoint = () => {
    console.log('Adding questions to knowledge point:', Array.from(selectedQuestions));
    // Here would be the logic to add selected questions to the knowledge point
    navigate(-1);
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
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
            <div>
              <h1>从题库选择题目</h1>
              <p className="text-muted-foreground">
                {targetKnowledgePoint && `目标知识点：${targetKnowledgePoint}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {selectedQuestions.size > 0 && (
              <>
                <span className="text-sm text-muted-foreground">
                  已选择 {selectedQuestions.size} 道题目
                </span>
                <Button onClick={handleAddToKnowledgePoint} className="gap-2">
                  <Plus className="w-4 h-4" />
                  添加到知识点
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-chart-1">
                {filteredQuestions.length}
              </div>
              <p className="text-sm text-muted-foreground">可选题目</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-chart-2">
                {selectedQuestions.size}
              </div>
              <p className="text-sm text-muted-foreground">已选择</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-chart-3">
                {filteredQuestions.filter(q => q.isInCurrentKnowledgePoint).length}
              </div>
              <p className="text-sm text-muted-foreground">已在知识点</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-chart-4">
                {filteredQuestions.filter(q => !q.isInCurrentKnowledgePoint && 
                  targetKnowledgePoint && q.knowledgePoints.some(kp => 
                    kp.includes(targetKnowledgePoint) || targetKnowledgePoint.includes(kp)
                  )).length}
              </div>
              <p className="text-sm text-muted-foreground">推荐题目</p>
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

          <Button 
            variant={showOnlyRelevant ? 'default' : 'outline'} 
            onClick={() => setShowOnlyRelevant(!showOnlyRelevant)}
            className="gap-2"
          >
            <Brain className="w-4 h-4" />
            智能推荐
          </Button>
        </div>

        {/* Question List */}
        <div className="space-y-4">
          {filteredQuestions.map((question) => (
            <Card key={question.id} className={`group hover:shadow-sm transition-all ${
              question.isInCurrentKnowledgePoint ? 'opacity-50 border-muted' : ''
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <Checkbox
                      checked={selectedQuestions.has(question.id)}
                      onCheckedChange={(checked) => handleQuestionSelect(question.id, checked as boolean)}
                      disabled={question.isInCurrentKnowledgePoint}
                    />
                    {question.isInCurrentKnowledgePoint && (
                      <Badge variant="secondary" className="text-xs">
                        <Check className="w-3 h-3 mr-1" />
                        已添加
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-3">
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
                          {targetKnowledgePoint && question.knowledgePoints.some(kp => 
                            kp.includes(targetKnowledgePoint) || targetKnowledgePoint.includes(kp)
                          ) && !question.isInCurrentKnowledgePoint && (
                            <Badge className="text-xs bg-blue-100 text-blue-800">
                              <Brain className="w-3 h-3 mr-1" />
                              推荐
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>创建者：{question.createdBy}</span>
                          <span>使用次数：{question.usageCount}</span>
                          <span>正确率：{question.avgAccuracy}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Question Content */}
                    <div className="space-y-2">
                      <div className="p-3 bg-muted/30 rounded border">
                        <MathRenderer content={question.content} />
                      </div>
                    </div>

                    {/* Knowledge Points and Tags */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">知识点：</span>
                        <div className="flex gap-1">
                          {question.knowledgePoints.map(kp => (
                            <Badge 
                              key={kp} 
                              variant={targetKnowledgePoint === kp ? 'default' : 'outline'} 
                              className="text-xs"
                            >
                              {kp}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="font-medium">标签：</span>
                        <div className="flex gap-1">
                          {question.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {question.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{question.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredQuestions.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <FileQuestion className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="font-medium mb-2">没有找到匹配的题目</h3>
              <p className="text-muted-foreground mb-4">
                尝试调整搜索条件或筛选选项
              </p>
              <Button variant="outline" onClick={() => {
                setSearchQuery('');
                setDifficultyFilter('all');
                setShowOnlyRelevant(false);
              }}>
                清除筛选条件
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Fixed Bottom Bar */}
        {selectedQuestions.size > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                已选择 {selectedQuestions.size} 道题目
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setSelectedQuestions(new Set())}>
                  清空选择
                </Button>
                <Button onClick={handleAddToKnowledgePoint} className="gap-2">
                  <Plus className="w-4 h-4" />
                  添加到知识点
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}