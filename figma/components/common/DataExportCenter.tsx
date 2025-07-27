import React, { useState } from 'react';
import { Download, FileText, Table, BarChart3, Calendar, Filter, Clock, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DateRangePicker } from '../ui/calendar';
import { Progress } from '../ui/progress';

interface ExportTask {
  id: string;
  name: string;
  type: 'grades' | 'analytics' | 'usage' | 'students' | 'courses';
  format: 'excel' | 'pdf' | 'csv' | 'word';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  createdAt: string;
  completedAt?: string;
  fileSize?: string;
  downloadUrl?: string;
  parameters: {
    course?: string;
    dateRange?: string;
    includeDetails?: boolean;
  };
}

interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  format: string;
  icon: React.ReactNode;
  category: 'academic' | 'analytics' | 'administrative';
}

export function DataExportCenter() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock export tasks
  const [exportTasks, setExportTasks] = useState<ExportTask[]>([
    {
      id: '1',
      name: '线性代数期中成绩报表',
      type: 'grades',
      format: 'excel',
      status: 'completed',
      progress: 100,
      createdAt: '2025-07-23T10:00:00Z',
      completedAt: '2025-07-23T10:05:00Z',
      fileSize: '2.3 MB',
      downloadUrl: '/exports/grades_linear_algebra_midterm.xlsx',
      parameters: {
        course: '线性代数',
        dateRange: '2025-07-01 到 2025-07-20',
        includeDetails: true
      }
    },
    {
      id: '2',
      name: '学生学习行为分析报告',
      type: 'analytics',
      format: 'pdf',
      status: 'processing',
      progress: 65,
      createdAt: '2025-07-23T09:30:00Z',
      parameters: {
        dateRange: '2025-07-01 到 2025-07-23',
        includeDetails: true
      }
    },
    {
      id: '3',
      name: '班级学生名单',
      type: 'students',
      format: 'csv',
      status: 'pending',
      progress: 0,
      createdAt: '2025-07-23T09:15:00Z',
      parameters: {
        course: '高等数学A',
        includeDetails: false
      }
    }
  ]);

  // Export templates
  const exportTemplates: ExportTemplate[] = [
    {
      id: 'student-grades',
      name: '学生成绩单',
      description: '导出指定课程或班级的学生成绩详情',
      type: 'grades',
      format: 'excel',
      icon: <BarChart3 className="h-6 w-6" />,
      category: 'academic'
    },
    {
      id: 'class-summary',
      name: '班级成绩汇总',
      description: '生成班级整体成绩分析报告',
      type: 'analytics',
      format: 'pdf',
      icon: <FileText className="h-6 w-6" />,
      category: 'academic'
    },
    {
      id: 'student-list',
      name: '学生名单',
      description: '导出学生基本信息和联系方式',
      type: 'students',
      format: 'excel',
      icon: <Table className="h-6 w-6" />,
      category: 'administrative'
    },
    {
      id: 'learning-analytics',
      name: '学习行为分析',
      description: '学生学习时长、答题记录等数据分析',
      type: 'analytics',
      format: 'excel',
      icon: <BarChart3 className="h-6 w-6" />,
      category: 'analytics'
    },
    {
      id: 'usage-report',
      name: '系统使用报告',
      description: '平台使用情况统计和趋势分析',
      type: 'usage',
      format: 'pdf',
      icon: <FileText className="h-6 w-6" />,
      category: 'analytics'
    },
    {
      id: 'course-report',
      name: '课程统计报告',
      description: '课程完成度、参与度等综合分析',
      type: 'courses',
      format: 'word',
      icon: <FileText className="h-6 w-6" />,
      category: 'academic'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '已完成';
      case 'processing':
        return '处理中';
      case 'pending':
        return '等待中';
      case 'failed':
        return '失败';
      default:
        return '未知';
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'excel':
        return <Table className="h-4 w-4" />;
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      case 'csv':
        return <Table className="h-4 w-4" />;
      case 'word':
        return <FileText className="h-4 w-4" />;
      default:
        return <Download className="h-4 w-4" />;
    }
  };

  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return '刚刚';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}分钟前`;
    } else {
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) {
        return `${diffInHours}小时前`;
      } else {
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays}天前`;
      }
    }
  };

  const filteredTemplates = exportTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const startExport = (template: ExportTemplate) => {
    // Simulate starting an export task
    const newTask: ExportTask = {
      id: Date.now().toString(),
      name: `${template.name}_${new Date().toISOString().split('T')[0]}`,
      type: template.type as any,
      format: template.format as any,
      status: 'pending',
      progress: 0,
      createdAt: new Date().toISOString(),
      parameters: {}
    };
    
    setExportTasks(prev => [newTask, ...prev]);
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">数据导出中心</h1>
        <p className="text-muted-foreground">
          导出各类教学数据和统计报告
        </p>
      </div>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="templates">导出模板</TabsTrigger>
          <TabsTrigger value="tasks">导出任务</TabsTrigger>
          <TabsTrigger value="history">历史记录</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          {/* 搜索和筛选 */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="搜索导出模板..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="选择分类" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部分类</SelectItem>
                    <SelectItem value="academic">学术数据</SelectItem>
                    <SelectItem value="analytics">分析报告</SelectItem>
                    <SelectItem value="administrative">管理数据</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* 导出模板网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        {template.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <Badge variant="outline" className="mt-1">
                          {template.format.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {template.description}
                  </p>
                  <Button 
                    className="w-full" 
                    onClick={() => startExport(template)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    开始导出
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>当前导出任务</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exportTasks.filter(task => task.status !== 'completed').map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getFormatIcon(task.format)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{task.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          创建于 {getRelativeTime(task.createdAt)}
                        </p>
                        {task.status === 'processing' && (
                          <div className="mt-2">
                            <Progress value={task.progress} className="w-full" />
                            <p className="text-xs text-muted-foreground mt-1">
                              {task.progress}% 完成
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(task.status)}>
                        {getStatusText(task.status)}
                      </Badge>
                      {task.status === 'processing' && (
                        <Button variant="outline" size="sm" disabled>
                          <Clock className="h-4 w-4 mr-1" />
                          处理中
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                {exportTasks.filter(task => task.status !== 'completed').length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">当前没有进行中的导出任务</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>历史记录</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exportTasks.filter(task => task.status === 'completed').map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="p-2 bg-green-100 rounded-lg text-green-600">
                        {getFormatIcon(task.format)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{task.name}</h3>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>完成于 {getRelativeTime(task.completedAt!)}</p>
                          <p>文件大小: {task.fileSize}</p>
                          {task.parameters.course && (
                            <p>课程: {task.parameters.course}</p>
                          )}
                          {task.parameters.dateRange && (
                            <p>时间范围: {task.parameters.dateRange}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(task.status)}>
                        {getStatusText(task.status)}
                      </Badge>
                      <Button size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        下载
                      </Button>
                    </div>
                  </div>
                ))}
                
                {exportTasks.filter(task => task.status === 'completed').length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">暂无历史导出记录</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}