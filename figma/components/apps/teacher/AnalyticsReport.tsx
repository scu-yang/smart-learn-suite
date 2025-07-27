import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Target,
  Download,
  Calendar,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

export function AnalyticsReport() {
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [timeRange, setTimeRange] = useState('30d');

  const courses = ['高等数学A', '线性代数', '概率论与数理统计', '离散数学'];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1>学情报告</h1>
          <p className="text-muted-foreground">课程学习数据分析与教学效果评估</p>
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

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">学生总数</p>
                <p className="text-2xl font-bold">245</p>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="w-3 h-3 text-chart-1" />
                  <span className="text-chart-1">+12</span>
                  <span className="text-muted-foreground">vs 上月</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-chart-1/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-chart-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">平均完成率</p>
                <p className="text-2xl font-bold">87%</p>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="w-3 h-3 text-chart-2" />
                  <span className="text-chart-2">+5%</span>
                  <span className="text-muted-foreground">vs 上月</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-chart-2/10 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-chart-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">平均分</p>
                <p className="text-2xl font-bold">82.5</p>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingDown className="w-3 h-3 text-chart-4" />
                  <span className="text-chart-4">-2.3</span>
                  <span className="text-muted-foreground">vs 上月</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-chart-3/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-chart-3" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">活跃度</p>
                <p className="text-2xl font-bold">92%</p>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="w-3 h-3 text-chart-1" />
                  <span className="text-chart-1">+8%</span>
                  <span className="text-muted-foreground">vs 上月</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-chart-4/10 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-chart-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">整体概览</TabsTrigger>
          <TabsTrigger value="performance">学习表现</TabsTrigger>
          <TabsTrigger value="progress">学习进度</TabsTrigger>
          <TabsTrigger value="knowledge">知识点掌握</TabsTrigger>
          <TabsTrigger value="recommendations">教学建议</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>课程参与度趋势</CardTitle>
                <CardDescription>最近30天学生参与情况</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>参与度图表开发中...</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>成绩分布</CardTitle>
                <CardDescription>当前班级成绩分布情况</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">90-100分</span>
                    <div className="flex items-center gap-2">
                      <Progress value={25} className="w-32 h-2" />
                      <span className="text-sm text-muted-foreground">25%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">80-89分</span>
                    <div className="flex items-center gap-2">
                      <Progress value={40} className="w-32 h-2" />
                      <span className="text-sm text-muted-foreground">40%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">70-79分</span>
                    <div className="flex items-center gap-2">
                      <Progress value={20} className="w-32 h-2" />
                      <span className="text-sm text-muted-foreground">20%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">60-69分</span>
                    <div className="flex items-center gap-2">
                      <Progress value={10} className="w-32 h-2" />
                      <span className="text-sm text-muted-foreground">10%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">60分以下</span>
                    <div className="flex items-center gap-2">
                      <Progress value={5} className="w-32 h-2" />
                      <span className="text-sm text-muted-foreground">5%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>班级对比</CardTitle>
              <CardDescription>各班级表现对比分析（点击班级名称查看详情）</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: 'class-01', name: '高等数学A-01班', students: 45, avgScore: 85.2, completion: 92 },
                  { id: 'class-02', name: '高等数学A-02班', students: 42, avgScore: 82.8, completion: 88 },
                  { id: 'class-03', name: '高等数学A-03班', students: 38, avgScore: 79.5, completion: 85 }
                ].map((classData, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <Link 
                        to={`/analytics/class/${classData.id}`}
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                      >
                        <h4 className="font-medium">{classData.name}</h4>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <Badge variant="outline">{classData.students}人</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">平均分</p>
                        <div className="flex items-center gap-2">
                          <Progress value={(classData.avgScore / 100) * 100} className="flex-1 h-2" />
                          <span className="text-sm font-medium">{classData.avgScore}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">完成率</p>
                        <div className="flex items-center gap-2">
                          <Progress value={classData.completion} className="flex-1 h-2" />
                          <span className="text-sm font-medium">{classData.completion}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>学习表现分析</CardTitle>
              <CardDescription>学生学习表现详细数据</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>学习表现分析功能开发中...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>学习进度跟踪</CardTitle>
              <CardDescription>各章节学习进度统计</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { chapter: '第1章 函数与极限', progress: 95, status: 'completed' },
                  { chapter: '第2章 导数与微分', progress: 87, status: 'completed' },
                  { chapter: '第3章 积分学', progress: 73, status: 'in-progress' },
                  { chapter: '第4章 常微分方程', progress: 45, status: 'in-progress' },
                  { chapter: '第5章 级数', progress: 0, status: 'not-started' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{item.chapter}</h4>
                        {item.status === 'completed' && <CheckCircle className="w-4 h-4 text-chart-1" />}
                        {item.status === 'in-progress' && <Clock className="w-4 h-4 text-chart-4" />}
                        {item.status === 'not-started' && <AlertTriangle className="w-4 h-4 text-muted-foreground" />}
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={item.progress} className="flex-1 h-2" />
                        <span className="text-sm font-medium">{item.progress}%</span>
                      </div>
                    </div>
                    <Badge variant={
                      item.status === 'completed' ? 'default' : 
                      item.status === 'in-progress' ? 'secondary' : 'outline'
                    }>
                      {item.status === 'completed' ? '已完成' : 
                       item.status === 'in-progress' ? '进行中' : '未开始'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>知识点掌握情况</CardTitle>
              <CardDescription>各知识点掌握程度分析</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>知识点掌握分析功能开发中...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>教学建议</CardTitle>
              <CardDescription>基于数据分析的个性化教学建议</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border-l-4 border-chart-1 bg-chart-1/5">
                <h4 className="font-medium flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-chart-1" />
                  优势领域
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  学生在基础概念理解方面表现优秀，函数与极限章节掌握良好。建议继续保持并适当增加综合应用题目。
                </p>
              </div>
              
              <div className="p-4 border-l-4 border-chart-4 bg-chart-4/5">
                <h4 className="font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-chart-4" />
                  需要关注
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  积分计算部分完成率较低(73%)，建议增加练习时间，提供更多分步骤讲解和个别辅导。
                </p>
              </div>
              
              <div className="p-4 border-l-4 border-chart-2 bg-chart-2/5">
                <h4 className="font-medium flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-chart-2" />
                  改进建议
                </h4>
                <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                  <li>• 增加互动式教学环节，提高课堂参与度</li>
                  <li>• 针对薄弱知识点设计专项练习</li>
                  <li>• 建立学习小组，促进同伴互助学习</li>
                  <li>• 定期进行形成性评估，及时调整教学策略</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}