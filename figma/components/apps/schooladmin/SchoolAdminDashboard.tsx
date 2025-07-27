import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  TrendingUp,
  School,
  Calendar,
  Award,
  Activity,
  BarChart3,
  Bell
} from 'lucide-react';

export function SchoolAdminDashboard() {
  // Mock data
  const stats = {
    totalTeachers: 248,
    totalStudents: 12456,
    activeCourses: 186,
    systemUsage: 92.5,
    newUsersThisMonth: 156,
    avgPerformance: 84.2
  };

  const departmentStats = [
    { name: '数学系', teachers: 45, students: 2340, courses: 32, avgScore: 86.7 },
    { name: '物理系', teachers: 38, students: 1890, courses: 28, avgScore: 82.3 },
    { name: '化学系', teachers: 35, students: 1650, courses: 25, avgScore: 84.9 },
    { name: '计算机系', teachers: 52, students: 3120, courses: 38, avgScore: 88.1 },
    { name: '生物系', teachers: 29, students: 1456, courses: 22, avgScore: 83.5 }
  ];

  const recentActivities = [
    {
      id: '1',
      action: '新增课程',
      target: '高等数学进阶课程',
      department: '数学系',
      time: '2小时前',
      status: 'success'
    },
    {
      id: '2',
      action: '用户注册',
      target: '新增学生用户 (25人)',
      department: '计算机系',
      time: '4小时前',
      status: 'info'
    },
    {
      id: '3',
      action: '成绩审核',
      target: '线性代数期末考试',
      department: '数学系',
      time: '6小时前',
      status: 'warning'
    },
    {
      id: '4',
      action: '系统维护',
      target: '平台例行维护完成',
      department: '技术部',
      time: '1天前',
      status: 'success'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-2">学校管理概览</h1>
          <p className="text-muted-foreground">
            智慧教学平台全校使用情况和数据统计
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            生成月报
          </Button>
          <Button>
            <Award className="h-4 w-4 mr-2" />
            教学评估
          </Button>
        </div>
      </div>

      {/* 核心统计 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">教师总数</p>
                <p className="text-2xl font-semibold text-blue-600">{stats.totalTeachers}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              本月新增 12 人
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">学生总数</p>
                <p className="text-2xl font-semibold text-green-600">{stats.totalStudents.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              本月新增 {stats.newUsersThisMonth} 人
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">活跃课程</p>
                <p className="text-2xl font-semibold text-purple-600">{stats.activeCourses}</p>
              </div>
              <BookOpen className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              覆盖 15 个院系
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">系统使用率</p>
                <p className="text-2xl font-semibold text-orange-600">{stats.systemUsage}%</p>
              </div>
              <Activity className="h-8 w-8 text-orange-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              较上月提升 3.2%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">平均成绩</p>
                <p className="text-2xl font-semibold text-indigo-600">{stats.avgPerformance}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-indigo-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              较上月提升 1.8 分
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">院系数量</p>
                <p className="text-2xl font-semibold text-teal-600">15</p>
              </div>
              <School className="h-8 w-8 text-teal-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              全部接入平台
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 院系统计 */}
        <Card>
          <CardHeader>
            <CardTitle>院系概览</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentStats.map((dept, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{dept.name}</h3>
                    <div className="grid grid-cols-3 gap-4 mt-2 text-sm text-muted-foreground">
                      <span>教师: {dept.teachers}</span>
                      <span>学生: {dept.students}</span>
                      <span>课程: {dept.courses}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">平均分</p>
                    <p className="font-semibold text-green-600">{dept.avgScore}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              查看详细报告
            </Button>
          </CardContent>
        </Card>

        {/* 近期活动 */}
        <Card>
          <CardHeader>
            <CardTitle>近期活动</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'success' ? 'bg-green-500' : 
                    activity.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.action}</span>
                      <span className="text-muted-foreground"> - {activity.target}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {activity.department}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              查看活动日志
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 快捷操作 */}
      <Card>
        <CardHeader>
          <CardTitle>快捷操作</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <Users className="h-6 w-6" />
              <span>用户管理</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <BookOpen className="h-6 w-6" />
              <span>课程审核</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <BarChart3 className="h-6 w-6" />
              <span>数据报表</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <Bell className="h-6 w-6" />
              <span>发布通知</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}