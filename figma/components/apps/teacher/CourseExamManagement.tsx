import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Checkbox } from '../../ui/checkbox';
import { Progress } from '../../ui/progress';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { 
  Plus,
  Calendar,
  Clock,
  Users,
  Target,
  Eye,
  Edit,
  Copy,
  Trash2,
  Send,
  MoreVertical,
  CheckCircle,
  AlertTriangle,
  FileText,
  BarChart3
} from 'lucide-react';

interface ExamItem {
  id: string;
  title: string;
  type: 'practice' | 'assignment' | 'quiz' | 'exam';
  status: 'draft' | 'active' | 'completed' | 'grading';
  createdDate: string;
  dueDate: string;
  duration: number; // minutes
  totalQuestions: number;
  totalPoints: number;
  assignedClasses: string[];
  submissions: {
    submitted: number;
    total: number;
  };
  avgScore?: number;
  knowledgePoints: string[];
}

const mockExams: ExamItem[] = [
  {
    id: 'e1',
    title: '第三章极限计算练习',
    type: 'assignment',
    status: 'active',
    createdDate: '2025-01-15',
    dueDate: '2025-01-25 23:59',
    duration: 90,
    totalQuestions: 15,
    totalPoints: 100,
    assignedClasses: ['高等数学A-01班', '高等数学A-02班'],
    submissions: { submitted: 67, total: 87 },
    avgScore: 78.5,
    knowledgePoints: ['极限计算', '连续性']
  },
  {
    id: 'e2',
    title: '导数应用小测验',
    type: 'quiz',
    status: 'grading',
    createdDate: '2025-01-18',
    dueDate: '2025-01-22 15:00',
    duration: 45,
    totalQuestions: 8,
    totalPoints: 60,
    assignedClasses: ['高等数学A-01班'],
    submissions: { submitted: 45, total: 45 },
    avgScore: 82.3,
    knowledgePoints: ['导数应用', '极值问题']
  },
  {
    id: 'e3',
    title: '积分基础练习',
    type: 'practice',
    status: 'draft',
    createdDate: '2025-01-20',
    dueDate: '2025-01-30 23:59',
    duration: 60,
    totalQuestions: 12,
    totalPoints: 80,
    assignedClasses: [],
    submissions: { submitted: 0, total: 0 },
    knowledgePoints: ['不定积分', '分部积分']
  }
];

interface CourseExamManagementProps {
  selectedKnowledgePoint?: string;
}

export function CourseExamManagement({ selectedKnowledgePoint }: CourseExamManagementProps) {
  const navigate = useNavigate();
  const [selectedExams, setSelectedExams] = useState<Set<string>>(new Set());

  // Filter exams by selected knowledge point
  const filteredExams = selectedKnowledgePoint 
    ? mockExams.filter(exam => 
        exam.knowledgePoints.some(kp => kp.includes(selectedKnowledgePoint))
      )
    : mockExams;

  const handleCreateExam = () => {
    const params = selectedKnowledgePoint 
      ? `?knowledgePoint=${encodeURIComponent(selectedKnowledgePoint)}`
      : '';
    navigate(`/exams/create${params}`);
  };

  const handleExamSelect = (examId: string, checked: boolean) => {
    const newSelected = new Set(selectedExams);
    if (checked) {
      newSelected.add(examId);
    } else {
      newSelected.delete(examId);
    }
    setSelectedExams(newSelected);
  };

  const handleBatchAction = (action: string) => {
    console.log(`Batch ${action} for exams:`, Array.from(selectedExams));
  };

  const getStatusIcon = (status: ExamItem['status']) => {
    switch (status) {
      case 'draft': return <FileText className="w-4 h-4 text-muted-foreground" />;
      case 'active': return <Clock className="w-4 h-4 text-chart-2" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-chart-1" />;
      case 'grading': return <AlertTriangle className="w-4 h-4 text-chart-4" />;
    }
  };

  const getStatusText = (status: ExamItem['status']) => {
    switch (status) {
      case 'draft': return '草稿';
      case 'active': return '进行中';
      case 'completed': return '已完成';
      case 'grading': return '待批改';
    }
  };

  const getStatusColor = (status: ExamItem['status']) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'active': return 'default';
      case 'completed': return 'outline';
      case 'grading': return 'destructive';
    }
  };

  const getTypeText = (type: ExamItem['type']) => {
    switch (type) {
      case 'practice': return '练习';
      case 'assignment': return '作业';
      case 'quiz': return '测验';
      case 'exam': return '考试';
    }
  };

  const getCompletionRate = (exam: ExamItem) => {
    if (exam.submissions.total === 0) return 0;
    return (exam.submissions.submitted / exam.submissions.total) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">作业/考试管理</h3>
          <p className="text-sm text-muted-foreground">
            {selectedKnowledgePoint 
              ? `当前知识点：${selectedKnowledgePoint}` 
              : '管理所有作业和考试'
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedExams.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                已选择 {selectedExams.size} 项
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    批量操作
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleBatchAction('publish')}>
                    <Send className="w-4 h-4 mr-2" />
                    批量发布
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBatchAction('copy')}>
                    <Copy className="w-4 h-4 mr-2" />
                    批量复制
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={() => handleBatchAction('delete')}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    批量删除
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          <Button onClick={handleCreateExam} className="gap-2">
            <Plus className="w-4 h-4" />
            创建作业/考试
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-1">
              {filteredExams.filter(e => e.status === 'active').length}
            </div>
            <p className="text-sm text-muted-foreground">进行中</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-2">
              {filteredExams.filter(e => e.status === 'grading').length}
            </div>
            <p className="text-sm text-muted-foreground">待批改</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-3">
              {filteredExams.filter(e => e.status === 'completed').length}
            </div>
            <p className="text-sm text-muted-foreground">已完成</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-4">
              {filteredExams.filter(e => e.status === 'draft').length}
            </div>
            <p className="text-sm text-muted-foreground">草稿</p>
          </CardContent>
        </Card>
      </div>

      {/* Exam List */}
      <div className="space-y-4">
        {filteredExams.length > 0 ? (
          filteredExams.map((exam) => (
            <Card key={exam.id} className="group hover:shadow-sm transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={selectedExams.has(exam.id)}
                    onCheckedChange={(checked) => handleExamSelect(exam.id, checked as boolean)}
                  />
                  
                  <div className="flex-1 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(exam.status)}
                          <h4 className="font-medium">{exam.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {getTypeText(exam.type)}
                          </Badge>
                          <Badge variant={getStatusColor(exam.status)} className="text-xs">
                            {getStatusText(exam.status)}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>截止：{new Date(exam.dueDate).toLocaleDateString('zh-CN')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>时长：{exam.duration}分钟</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            <span>{exam.totalQuestions}题 · {exam.totalPoints}分</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {exam.knowledgePoints.map(kp => (
                            <Badge key={kp} variant="secondary" className="text-xs">
                              {kp}
                            </Badge>
                          ))}
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
                            查看详情
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            编辑
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="w-4 h-4 mr-2" />
                            复制
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <BarChart3 className="w-4 h-4 mr-2" />
                            查看统计
                          </DropdownMenuItem>
                          {exam.status === 'draft' && (
                            <DropdownMenuItem>
                              <Send className="w-4 h-4 mr-2" />
                              发布
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            删除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Progress and Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>提交进度</span>
                          <span>{exam.submissions.submitted}/{exam.submissions.total}</span>
                        </div>
                        <Progress value={getCompletionRate(exam)} className="h-2" />
                      </div>
                      
                      <div className="text-center">
                        <div className="text-lg font-bold">
                          {exam.avgScore ? `${exam.avgScore.toFixed(1)}` : '--'}
                        </div>
                        <p className="text-xs text-muted-foreground">平均分</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-lg font-bold">
                          {exam.assignedClasses.length}
                        </div>
                        <p className="text-xs text-muted-foreground">分配班级</p>
                      </div>
                    </div>

                    {/* Assigned Classes */}
                    {exam.assignedClasses.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">分配班级：</p>
                        <div className="flex flex-wrap gap-1">
                          {exam.assignedClasses.map(className => (
                            <Badge key={className} variant="outline" className="text-xs">
                              {className}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quick Actions */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>创建时间：{new Date(exam.createdDate).toLocaleDateString('zh-CN')}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {exam.status === 'grading' && (
                          <Button size="sm" variant="outline" className="gap-2">
                            <CheckCircle className="w-4 h-4" />
                            去批改
                          </Button>
                        )}
                        {exam.status === 'active' && (
                          <Button size="sm" variant="outline" className="gap-2">
                            <BarChart3 className="w-4 h-4" />
                            查看数据
                          </Button>
                        )}
                        {exam.status === 'draft' && (
                          <Button size="sm" className="gap-2">
                            <Send className="w-4 h-4" />
                            发布
                          </Button>
                        )}
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
              <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="font-medium mb-2">
                {selectedKnowledgePoint 
                  ? `"${selectedKnowledgePoint}" 暂无相关作业/考试`
                  : '暂无作业/考试'
                }
              </h3>
              <p className="text-muted-foreground mb-4">
                点击下方按钮创建第一个作业或考试
              </p>
              <Button onClick={handleCreateExam} className="gap-2">
                <Plus className="w-4 h-4" />
                创建作业/考试
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}