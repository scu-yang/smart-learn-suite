import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Edit3,
  Save,
  Eye,
  FileText,
  Search,
  Filter,
  Brain,
  User,
  Clock,
  Target,
  Sparkles,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { MathRenderer } from '../../common/MathRenderer';

interface AIGradingTask {
  id: string;
  studentName: string;
  studentId: string;
  examName: string;
  questionTitle: string;
  questionType: 'multiple-choice' | 'fill-blank' | 'essay';
  fullScore: number;
  aiScore: number;
  aiComment: string;
  confidence: number;
  submissionTime: string;
  studentAnswer: string;
  correctAnswer: string;
  status: 'pending' | 'approved' | 'modified' | 'rejected';
  difficulty: 'easy' | 'medium' | 'hard';
}

const mockGradingTasks: AIGradingTask[] = [
  {
    id: 'task1',
    studentName: '张小明',
    studentId: '2023001',
    examName: '高等数学期中考试',
    questionTitle: '求函数极限',
    questionType: 'essay',
    fullScore: 20,
    aiScore: 16,
    aiComment: '解题思路正确，使用洛必达法则求解。但在第三步的代数化简中有小错误，导致最终结果不够精确。建议加强基础计算训练。',
    confidence: 0.85,
    submissionTime: '2024-01-15 14:30:00',
    studentAnswer: '$\\lim_{x \\to 0} \\frac{\\sin 2x}{x} = \\lim_{x \\to 0} \\frac{2\\sin x \\cos x}{x} = 2\\lim_{x \\to 0} \\frac{\\sin x}{x} \\cdot \\lim_{x \\to 0} \\cos x = 2 \\cdot 1 \\cdot 1 = 2$',
    correctAnswer: '$\\lim_{x \\to 0} \\frac{\\sin 2x}{x} = 2$',
    status: 'pending',
    difficulty: 'medium'
  },
  {
    id: 'task2',
    studentName: '李小红',
    studentId: '2023002',
    examName: '高等数学期中考试',
    questionTitle: '积分计算',
    questionType: 'essay',
    fullScore: 15,
    aiScore: 12,
    aiComment: '积分方法选择正确，但在分部积分的第二步计算中出现符号错误。整体思路清晰，建议复查计算细节。',
    confidence: 0.78,
    submissionTime: '2024-01-15 14:25:00',
    studentAnswer: '$\\int x e^x dx = x e^x - \\int e^x dx = x e^x - e^x + C = e^x(x-1) + C$',
    correctAnswer: '$\\int x e^x dx = e^x(x-1) + C$',
    status: 'pending',
    difficulty: 'hard'
  },
  {
    id: 'task3',
    studentName: '王小强',
    studentId: '2023003',
    examName: '高等数学期中考试',
    questionTitle: '导数应用',
    questionType: 'multiple-choice',
    fullScore: 10,
    aiScore: 10,
    aiComment: '答案完全正确，知识点掌握扎实。',
    confidence: 0.95,
    submissionTime: '2024-01-15 14:20:00',
    studentAnswer: 'A, C',
    correctAnswer: 'A, C',
    status: 'approved',
    difficulty: 'easy'
  }
];

export function TAGradeAudit() {
  const [tasks, setTasks] = useState<AIGradingTask[]>(mockGradingTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTask, setSelectedTask] = useState<AIGradingTask | null>(null);
  const [editingScore, setEditingScore] = useState<number | null>(null);
  const [editingComment, setEditingComment] = useState<string>('');
  const [showDetailModal, setShowDetailModal] = useState(false);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.examName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.questionTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEditScore = (task: AIGradingTask) => {
    setSelectedTask(task);
    setEditingScore(task.aiScore);
    setEditingComment(task.aiComment);
    setShowDetailModal(true);
  };

  const handleSaveEdit = () => {
    if (selectedTask && editingScore !== null) {
      setTasks(prev => prev.map(task => 
        task.id === selectedTask.id 
          ? { 
              ...task, 
              aiScore: editingScore, 
              aiComment: editingComment,
              status: 'modified' as const
            }
          : task
      ));
      setShowDetailModal(false);
      setSelectedTask(null);
      setEditingScore(null);
      setEditingComment('');
    }
  };

  const handleApprove = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: 'approved' as const } : task
    ));
  };

  const handleReject = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: 'rejected' as const } : task
    ));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-orange-600 border-orange-200">待审核</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-green-600 border-green-200">已通过</Badge>;
      case 'modified':
        return <Badge variant="outline" className="text-blue-600 border-blue-200">已修改</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-600 border-red-200">已驳回</Badge>;
      default:
        return <Badge variant="outline">未知</Badge>;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return <Badge variant="secondary" className="text-green-600">简单</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="text-yellow-600">中等</Badge>;
      case 'hard':
        return <Badge variant="secondary" className="text-red-600">困难</Badge>;
      default:
        return <Badge variant="secondary">未知</Badge>;
    }
  };

  const pendingCount = tasks.filter(task => task.status === 'pending').length;
  const approvedCount = tasks.filter(task => task.status === 'approved').length;
  const modifiedCount = tasks.filter(task => task.status === 'modified').length;

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-2">AI成绩审核</h1>
          <p className="text-muted-foreground">
            审核和修订AI批改的作业与考试成绩
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            导出报告
          </Button>
          <Button>
            <Brain className="h-4 w-4 mr-2" />
            批量处理
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">待审核</p>
                <p className="text-2xl font-semibold text-orange-600">{pendingCount}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">已通过</p>
                <p className="text-2xl font-semibold text-green-600">{approvedCount}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">已修改</p>
                <p className="text-2xl font-semibold text-blue-600">{modifiedCount}</p>
              </div>
              <Edit3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">总任务</p>
                <p className="text-2xl font-semibold">{tasks.length}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 筛选和搜索 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索学生姓名、考试名称或题目..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="筛选状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="pending">待审核</SelectItem>
                <SelectItem value="approved">已通过</SelectItem>
                <SelectItem value="modified">已修改</SelectItem>
                <SelectItem value="rejected">已驳回</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 任务列表 */}
      <Card>
        <CardHeader>
          <CardTitle>批改任务列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div key={task.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{task.questionTitle}</h3>
                      {getDifficultyBadge(task.difficulty)}
                      {getStatusBadge(task.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {task.studentName} ({task.studentId})
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        {task.examName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {task.submissionTime}
                      </span>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{task.aiScore}/{task.fullScore}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-muted-foreground" />
                      <span className={`text-sm ${getConfidenceColor(task.confidence)}`}>
                        置信度 {(task.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-1">AI评语：</p>
                    <p className="text-sm text-muted-foreground bg-muted/30 p-2 rounded">
                      {task.aiComment}
                    </p>
                  </div>

                  {task.questionType !== 'multiple-choice' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium mb-1">学生答案：</p>
                        <div className="text-sm bg-muted/30 p-2 rounded">
                          <MathRenderer content={task.studentAnswer} />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">参考答案：</p>
                        <div className="text-sm bg-green-50 p-2 rounded">
                          <MathRenderer content={task.correctAnswer} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditScore(task)}
                      className="gap-2"
                    >
                      <Edit3 className="h-4 w-4" />
                      编辑
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedTask(task)}
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      详情
                    </Button>
                  </div>
                  
                  {task.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(task.id)}
                        className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <ThumbsDown className="h-4 w-4" />
                        驳回
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(task.id)}
                        className="gap-2 bg-green-600 hover:bg-green-700"
                      >
                        <ThumbsUp className="h-4 w-4" />
                        通过
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 编辑模态框 */}
      {showDetailModal && selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">编辑成绩和评语</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetailModal(false)}
              >
                ×
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">学生信息</label>
                <p className="text-sm text-muted-foreground">
                  {selectedTask.studentName} ({selectedTask.studentId}) - {selectedTask.examName}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">题目</label>
                <p className="text-sm text-muted-foreground">{selectedTask.questionTitle}</p>
              </div>

              <div>
                <label className="text-sm font-medium">成绩</label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="number"
                    min="0"
                    max={selectedTask.fullScore}
                    value={editingScore || ''}
                    onChange={(e) => setEditingScore(Number(e.target.value))}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">/ {selectedTask.fullScore}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">评语</label>
                <Textarea
                  value={editingComment}
                  onChange={(e) => setEditingComment(e.target.value)}
                  rows={4}
                  className="mt-1"
                  placeholder="请输入评语..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowDetailModal(false)}
                >
                  取消
                </Button>
                <Button onClick={handleSaveEdit} className="gap-2">
                  <Save className="h-4 w-4" />
                  保存
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}