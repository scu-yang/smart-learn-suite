import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { 
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  BookOpen,
  Award,
  Calendar,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  LineChart,
  Star
} from 'lucide-react';

interface LearningData {
  course: string;
  progress: number;
  averageScore: number;
  timeSpent: number; // hours
  completedAssignments: number;
  totalAssignments: number;
  rank: number;
  totalStudents: number;
  strengthAreas: string[];
  weaknessAreas: string[];
  trend: 'up' | 'down' | 'stable';
}

const mockLearningData: LearningData[] = [
  {
    course: '高等数学A',
    progress: 75,
    averageScore: 85.2,
    timeSpent: 48.5,
    completedAssignments: 8,
    totalAssignments: 10,
    rank: 8,
    totalStudents: 45,
    strengthAreas: ['极限计算', '导数求解', '基础积分'],
    weaknessAreas: ['复合函数求导', '积分应用'],
    trend: 'up'
  },
  {
    course: '线性代数',
    progress: 60,
    averageScore: 78.9,
    timeSpent: 32.0,
    completedAssignments: 6,
    totalAssignments: 8,
    rank: 15,
    totalStudents: 38,
    strengthAreas: ['矩阵运算', '线性方程组'],
    weaknessAreas: ['特征值求解', '线性变换'],
    trend: 'stable'
  },
  {
    course: '概率论与数理统计',
    progress: 90,
    averageScore: 92.1,
    timeSpent: 28.5,
    completedAssignments: 9,
    totalAssignments: 9,
    rank: 3,
    totalStudents: 42,
    strengthAreas: ['概率计算', '随机变量', '概率分布'],
    weaknessAreas: ['假设检验'],
    trend: 'up'
  }
];

const weeklyProgress = [
  { week: '第1周', hours: 8, score: 75 },
  { week: '第2周', hours: 12, score: 82 },
  { week: '第3周', hours: 10, score: 78 },
  { week: '第4周', hours: 15, score: 88 },
  { week: '第5周', hours: 11, score: 85 },
  { week: '第6周', hours: 13, score: 91 },
  { week: '第7周', hours: 9, score: 87 },
  { week: '第8周', hours: 14, score: 93 }
];

export function LearningReport() {
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [timeRange, setTimeRange] = useState('30d');

  const courses = ['高等数学A', '线性代数', '概率论与数理统计'];
  const filteredData = selectedCourse === 'all' ? mockLearningData : 
                      mockLearningData.filter(data => data.course === selectedCourse);

  const totalStats = {
    avgProgress: Math.round(mockLearningData.reduce((sum, data) => sum + data.progress, 0) / mockLearningData.length),
    avgScore: Math.round(mockLearningData.reduce((sum, data) => sum + data.averageScore, 0) / mockLearningData.length * 10) / 10,
    totalTimeSpent: Math.round(mockLearningData.reduce((sum, data) => sum + data.timeSpent, 0) * 10) / 10,
    completionRate: Math.round(mockLearningData.reduce((sum, data) => sum + (data.completedAssignments / data.totalAssignments * 100), 0) / mockLearningData.length)
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-chart-1" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-destructive" />;
      case 'stable': return <Target className="w-4 h-4 text-chart-3" />;
    }
  };

  const getRankColor = (rank: number, total: number) => {
    const percentile = (total - rank + 1) / total;
    if (percentile >= 0.9) return 'text-chart-1';
    if (percentile >= 0.7) return 'text-chart-2';
    if (percentile >= 0.5) return 'text-chart-3';
    return 'text-chart-4';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1>学习报告</h1>
          <p className="text-muted-foreground">查看学习进度和分析报告</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="选择课程" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部课程</SelectItem>
              {courses.map(course => (
                <SelectItem key={course} value={course}>{course}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">最近7天</SelectItem>
              <SelectItem value="30d">最近30天</SelectItem>
              <SelectItem value="90d">最近90天</SelectItem>
              <SelectItem value="semester">本学期</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            刷新
          </Button>
          <Button className="gap-2">
            <Download className="w-4 h-4" />
            导出报告
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">平均进度</p>
                <p className="text-2xl font-bold">{totalStats.avgProgress}%</p>
              </div>
              <div className="w-12 h-12 bg-chart-1/10 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-chart-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">平均分</p>
                <p className="text-2xl font-bold">{totalStats.avgScore}</p>
              </div>
              <div className="w-12 h-12 bg-chart-2/10 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-chart-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">学习时长</p>
                <p className="text-2xl font-bold">{totalStats.totalTimeSpent}h</p>
              </div>
              <div className="w-12 h-12 bg-chart-3/10 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-chart-3" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">完成率</p>
                <p className="text-2xl font-bold">{totalStats.completionRate}%</p>
              </div>
              <div className="w-12 h-12 bg-chart-4/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-chart-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">学习概览</TabsTrigger>
          <TabsTrigger value="performance">成绩分析</TabsTrigger>
          <TabsTrigger value="time">时间统计</TabsTrigger>
          <TabsTrigger value="knowledge">知识点分析</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Course Performance */}
            <Card>
              <CardHeader>
                <CardTitle>课程表现</CardTitle>
                <CardDescription>各科目学习情况对比</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredData.map((data) => (
                    <div key={data.course} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{data.course}</span>
                          {getTrendIcon(data.trend)}
                          <Badge variant="outline" className={getRankColor(data.rank, data.totalStudents)}>
                            排名 {data.rank}/{data.totalStudents}
                          </Badge>
                        </div>
                        <span className="text-sm font-medium">{data.averageScore}分</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>学习进度</span>
                            <span>{data.progress}%</span>
                          </div>
                          <Progress value={data.progress} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>作业完成</span>
                            <span>{data.completedAssignments}/{data.totalAssignments}</span>
                          </div>
                          <Progress value={(data.completedAssignments / data.totalAssignments) * 100} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Progress Chart */}
            <Card>
              <CardHeader>
                <CardTitle>学习趋势</CardTitle>
                <CardDescription>近8周学习时长和成绩变化</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <LineChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>学习趋势图表开发中...</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Strengths and Weaknesses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-chart-1" />
                  优势领域
                </CardTitle>
                <CardDescription>表现较好的知识点</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredData.map((data) => (
                    <div key={data.course}>
                      <h4 className="font-medium mb-2">{data.course}</h4>
                      <div className="flex flex-wrap gap-1">
                        {data.strengthAreas.map((area) => (
                          <Badge key={area} variant="outline" className="text-xs text-chart-1">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-chart-4" />
                  需要改进
                </CardTitle>
                <CardDescription>需要加强练习的知识点</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredData.map((data) => (
                    <div key={data.course}>
                      <h4 className="font-medium mb-2">{data.course}</h4>
                      <div className="flex flex-wrap gap-1">
                        {data.weaknessAreas.map((area) => (
                          <Badge key={area} variant="outline" className="text-xs text-chart-4">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>成绩分析</CardTitle>
              <CardDescription>详细的成绩统计和分析</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>成绩分析图表开发中...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="time" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>时间统计</CardTitle>
              <CardDescription>学习时间分配和利用效率</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <PieChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>时间统计图表开发中...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>知识点掌握情况</CardTitle>
              <CardDescription>各知识点掌握程度详细分析</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>知识点分析功能开发中...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}