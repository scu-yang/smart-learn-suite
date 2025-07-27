import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { 
  ClipboardCheck, 
  BookOpen, 
  Bell, 
  Users, 
  TrendingUp, 
  Calendar,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const kpiData = [
  {
    title: '待批改作业',
    value: '23',
    description: '需要您处理的作业',
    icon: ClipboardCheck,
    color: 'text-chart-1',
    link: '/grading'
  },
  {
    title: '活跃课程',
    value: '8',
    description: '当前正在进行的课程',
    icon: BookOpen,
    color: 'text-chart-2',
    link: '/courses'
  },
  {
    title: '学生总数',
    value: '245',
    description: '所有班级学生总数',
    icon: Users,
    color: 'text-chart-3',
    link: '/classes'
  },
  {
    title: '本周完成率',
    value: '87%',
    description: '学生作业完成情况',
    icon: TrendingUp,
    color: 'text-chart-4',
    link: '/analytics'
  }
];

const courseProgress = [
  { name: '高等数学A', progress: 75, students: 45, color: 'bg-chart-1' },
  { name: '线性代数', progress: 60, students: 38, color: 'bg-chart-2' },
  { name: '概率论', progress: 90, students: 42, color: 'bg-chart-3' },
  { name: '离散数学', progress: 45, students: 35, color: 'bg-chart-4' }
];

const notifications = [
  {
    title: '新的作业提交',
    description: '高等数学A - 第三章练习',
    time: '2分钟前',
    type: 'info',
    unread: true
  },
  {
    title: '考试提醒',
    description: '线性代数期中考试将于明天开始',
    time: '1小时前',
    type: 'warning',
    unread: true
  },
  {
    title: '学生提问',
    description: '张同学在概率论讨论区提出了新问题',
    time: '3小时前',
    type: 'info',
    unread: false
  },
  {
    title: '系统通知',
    description: '批改系统已完成升级',
    time: '1天前',
    type: 'success',
    unread: false
  }
];

export function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>仪表盘</h1>
        <p className="text-muted-foreground">欢迎回来！这里是您的教学概览</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                <Icon className={`w-4 h-4 ${item.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
                <p className="text-xs text-muted-foreground">{item.description}</p>
                <Link to={item.link}>
                  <Button variant="ghost" size="sm" className="mt-2 w-full justify-between">
                    查看详情
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              课程进度
            </CardTitle>
            <CardDescription>当前学期课程教学进度</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {courseProgress.map((course) => (
              <div key={course.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{course.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{course.students}人</Badge>
                    <span className="text-sm text-muted-foreground">{course.progress}%</span>
                  </div>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>
            ))}
            <Link to="/courses">
              <Button variant="outline" className="w-full mt-4">
                查看所有课程
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              消息提醒
            </CardTitle>
            <CardDescription>最新的系统消息和提醒</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.map((notification, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  notification.unread ? 'bg-accent/50 border-accent' : 'bg-background'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{notification.title}</p>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-chart-1 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{notification.time}</span>
                </div>
              </div>
            ))}
            <Link to="/notifications">
              <Button variant="outline" className="w-full mt-4">
                查看所有通知
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>快速操作</CardTitle>
          <CardDescription>常用功能快速入口</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/grading">
              <Button variant="outline" className="h-20 flex-col gap-2">
                <ClipboardCheck className="w-6 h-6" />
                批改作业
              </Button>
            </Link>
            <Link to="/courses">
              <Button variant="outline" className="h-20 flex-col gap-2">
                <BookOpen className="w-6 h-6" />
                课程管理
              </Button>
            </Link>
            <Link to="/qa">
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Calendar className="w-6 h-6" />
                学生答疑
              </Button>
            </Link>
            <Link to="/analytics">
              <Button variant="outline" className="h-20 flex-col gap-2">
                <TrendingUp className="w-6 h-6" />
                数据分析
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}