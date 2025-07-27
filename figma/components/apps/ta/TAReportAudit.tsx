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
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Download,
  Share
} from 'lucide-react';
import { MathRenderer } from '../../common/MathRenderer';

interface AIReport {
  id: string;
  title: string;
  type: 'individual' | 'class';
  targetName: string; // 学生姓名或班级名称
  targetId: string;
  generatedTime: string;
  status: 'pending' | 'approved' | 'modified' | 'rejected';
  confidence: number;
  reportContent: {
    summary: string;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    progressData: {
      overall: number;
      chapters: { name: string; score: number; }[];
    };
  };
  aiAnalysis: string;
  lastModified?: string;
}

const mockReports: AIReport[] = [
  {
    id: 'report1',
    title: '张小明个人学习报告',
    type: 'individual',
    targetName: '张小明',
    targetId: '2023001',
    generatedTime: '2024-01-15 10:00:00',
    status: 'pending',
    confidence: 0.87,
    reportContent: {
      summary: '该学生在高等数学学习中表现良好，基础知识掌握扎实，在极限和导数部分表现尤为突出。但在积分应用方面仍有提升空间。',
      strengths: [
        '极限计算准确率达到92%',
        '导数基本概念理解透彻',
        '解题思路清晰，步骤完整',
        '数学符号使用规范'
      ],
      weaknesses: [
        '积分应用题正确率仅为68%',
        '复杂函数求导时偶有错误',
        '几何应用理解不够深入',
        '计算细节需要加强'
      ],
      suggestions: [
        '加强积分应用练习，特别是几何应用',
        '多做复杂函数求导练习',
        '注意计算过程中的细节检查',
        '建议参加辅导课程'
      ],
      progressData: {
        overall: 82.5,
        chapters: [
          { name: '函数与极限', score: 88 },
          { name: '导数与微分', score: 85 },
          { name: '积分学', score: 75 },
          { name: '无穷级数', score: 79 }
        ]
      }
    },
    aiAnalysis: '通过对该学生历次作业和考试的综合分析，AI系统识别出其学习模式和知识掌握情况。建议重点关注积分应用能力的提升。'
  },
  {
    id: 'report2',
    title: '数学2023-1班班级学习报告',
    type: 'class',
    targetName: '数学2023-1班',
    targetId: 'class_2023_1',
    generatedTime: '2024-01-15 09:30:00',
    status: 'pending',
    confidence: 0.91,
    reportContent: {
      summary: '本班级整体学习情况良好，平均成绩为78.6分。在基础概念掌握方面表现突出，但在应用题和综合题目方面需要加强。',
      strengths: [
        '基础概念掌握率达到85%',
        '出勤率保持在95%以上',
        '作业完成质量较高',
        '课堂互动积极性强'
      ],
      weaknesses: [
        '应用题平均正确率仅为65%',
        '部分学生计算能力薄弱',
        '综合题目分析能力有待提升',
        '个别学生学习进度滞后'
      ],
      suggestions: [
        '增加应用题练习，结合实际案例',
        '设置分层教学，照顾不同水平学生',
        '定期进行计算能力专项训练',
        '建立学习小组，互帮互助'
      ],
      progressData: {
        overall: 78.6,
        chapters: [
          { name: '函数与极限', score: 82 },
          { name: '导数与微分', score: 79 },
          { name: '积分学', score: 75 },
          { name: '无穷级数', score: 77 }
        ]
      }
    },
    aiAnalysis: '基于班级整体学习数据分析，发现学生在理论知识掌握较好，但实际应用能力相对薄弱。建议调整教学策略，增强实践环节。'
  },
  {
    id: 'report3',
    title: '李小红个人学习报告',
    type: 'individual',
    targetName: '李小红',
    targetId: '2023002',
    generatedTime: '2024-01-14 16:00:00',
    status: 'approved',
    confidence: 0.93,
    reportContent: {
      summary: '该学生学习态度认真，基础扎实，各章节掌握均衡，是班级中的优秀学生。',
      strengths: [
        '各章节成绩均衡，无明显短板',
        '解题思路清晰，逻辑性强',
        '自主学习能力强',
        '作业质量优秀'
      ],
      weaknesses: [
        '解题速度相对较慢',
        '部分难题缺乏创新思路',
        '考试时略显紧张'
      ],
      suggestions: [
        '加强计时练习，提高解题速度',
        '多接触竞赛题目，拓展思路',
        '进行心理调适训练'
      ],
      progressData: {
        overall: 91.2,
        chapters: [
          { name: '函数与极限', score: 92 },
          { name: '导数与微分', score: 90 },
          { name: '积分学', score: 91 },
          { name: '无穷级数', score: 92 }
        ]
      }
    },
    aiAnalysis: '该学生表现优异，学习习惯良好，建议给予更多挑战性题目以促进进一步发展。'
  }
];

export function TAReportAudit() {
  const [reports, setReports] = useState<AIReport[]>(mockReports);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<AIReport | null>(null);
  const [editingContent, setEditingContent] = useState<string>('');
  const [showDetailModal, setShowDetailModal] = useState(false);

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.targetName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleEditReport = (report: AIReport) => {
    setSelectedReport(report);
    setEditingContent(report.reportContent.summary);
    setShowDetailModal(true);
  };

  const handleSaveEdit = () => {
    if (selectedReport) {
      setReports(prev => prev.map(report => 
        report.id === selectedReport.id 
          ? { 
              ...report, 
              reportContent: {
                ...report.reportContent,
                summary: editingContent
              },
              status: 'modified' as const,
              lastModified: new Date().toLocaleString()
            }
          : report
      ));
      setShowDetailModal(false);
      setSelectedReport(null);
      setEditingContent('');
    }
  };

  const handleApprove = (reportId: string) => {
    setReports(prev => prev.map(report => 
      report.id === reportId ? { ...report, status: 'approved' as const } : report
    ));
  };

  const handleReject = (reportId: string) => {
    setReports(prev => prev.map(report => 
      report.id === reportId ? { ...report, status: 'rejected' as const } : report
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

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'individual':
        return <Badge variant="secondary" className="text-blue-600">个人报告</Badge>;
      case 'class':
        return <Badge variant="secondary" className="text-purple-600">班级报告</Badge>;
      default:
        return <Badge variant="secondary">未知</Badge>;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const pendingCount = reports.filter(report => report.status === 'pending').length;
  const approvedCount = reports.filter(report => report.status === 'approved').length;
  const modifiedCount = reports.filter(report => report.status === 'modified').length;

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-2">AI学习报告审核</h1>
          <p className="text-muted-foreground">
            审核和修订AI生成的个人及班级学习报告
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            批量导出
          </Button>
          <Button>
            <Brain className="h-4 w-4 mr-2" />
            重新生成
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
                <p className="text-sm text-muted-foreground">总报告</p>
                <p className="text-2xl font-semibold">{reports.length}</p>
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
                  placeholder="搜索报告标题或学生姓名..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="报告类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="individual">个人报告</SelectItem>
                <SelectItem value="class">班级报告</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
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

      {/* 报告列表 */}
      <Card>
        <CardHeader>
          <CardTitle>学习报告列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {filteredReports.map((report) => (
              <div key={report.id} className="border rounded-lg p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{report.title}</h3>
                      {getTypeBadge(report.type)}
                      {getStatusBadge(report.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        {report.type === 'individual' ? <User className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                        {report.targetName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {report.generatedTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Sparkles className="h-4 w-4" />
                        <span className={getConfidenceColor(report.confidence)}>
                          置信度 {(report.confidence * 100).toFixed(0)}%
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-blue-600">
                      {report.reportContent.progressData.overall}分
                    </div>
                    <div className="text-sm text-muted-foreground">总体评分</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-1">AI分析摘要：</p>
                    <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded">
                      {report.reportContent.summary}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-2 flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        优势分析
                      </p>
                      <ul className="space-y-1">
                        {report.reportContent.strengths.slice(0, 2).map((strength, index) => (
                          <li key={index} className="text-sm text-green-700 flex items-start gap-2">
                            <span className="w-1 h-1 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                            {strength}
                          </li>
                        ))}
                        {report.reportContent.strengths.length > 2 && (
                          <li className="text-sm text-muted-foreground">
                            还有 {report.reportContent.strengths.length - 2} 项...
                          </li>
                        )}
                      </ul>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                        改进建议
                      </p>
                      <ul className="space-y-1">
                        {report.reportContent.suggestions.slice(0, 2).map((suggestion, index) => (
                          <li key={index} className="text-sm text-orange-700 flex items-start gap-2">
                            <span className="w-1 h-1 bg-orange-600 rounded-full mt-2 flex-shrink-0"></span>
                            {suggestion}
                          </li>
                        ))}
                        {report.reportContent.suggestions.length > 2 && (
                          <li className="text-sm text-muted-foreground">
                            还有 {report.reportContent.suggestions.length - 2} 项...
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">各章节表现：</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {report.reportContent.progressData.chapters.map((chapter, index) => (
                        <div key={index} className="text-center">
                          <div className="text-sm font-medium">{chapter.score}</div>
                          <div className="text-xs text-muted-foreground">{chapter.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditReport(report)}
                      className="gap-2"
                    >
                      <Edit3 className="h-4 w-4" />
                      编辑
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      详情
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Share className="h-4 w-4" />
                      分享
                    </Button>
                  </div>
                  
                  {report.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(report.id)}
                        className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <ThumbsDown className="h-4 w-4" />
                        驳回
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(report.id)}
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
      {showDetailModal && selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">编辑学习报告</h2>
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
                <label className="text-sm font-medium">报告标题</label>
                <p className="text-sm text-muted-foreground">{selectedReport.title}</p>
              </div>

              <div>
                <label className="text-sm font-medium">报告摘要</label>
                <Textarea
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  rows={6}
                  className="mt-1"
                  placeholder="请输入报告摘要..."
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