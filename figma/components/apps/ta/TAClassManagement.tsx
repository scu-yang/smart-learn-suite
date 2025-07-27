import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  BookOpen,
  GraduationCap,
  TrendingUp,
  MessageSquare,
  Calendar
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  studentId: string;
  email: string;
  phone?: string;
  class: string;
  course: string;
  averageScore: number;
  submissionRate: number;
  lastActive: string;
  status: 'active' | 'inactive';
}

interface ClassInfo {
  id: string;
  name: string;
  course: string;
  studentCount: number;
  averageScore: number;
  submissionRate: number;
  instructor: string;
}

export function TAClassManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState('all');

  // Mock data
  const classes: ClassInfo[] = [
    {
      id: '1',
      name: '2025春-线性代数-01班',
      course: '线性代数',
      studentCount: 45,
      averageScore: 82.5,
      submissionRate: 92,
      instructor: '张教授'
    },
    {
      id: '2',
      name: '2025春-微积分基础-02班',
      course: '微积分基础',
      studentCount: 38,
      averageScore: 76.3,
      submissionRate: 88,
      instructor: '李教授'
    },
    {
      id: '3',
      name: '2025春-高等数学-03班',
      course: '高等数学',
      studentCount: 52,
      averageScore: 79.1,
      submissionRate: 85,
      instructor: '王老师'
    }
  ];

  const students: Student[] = [
    {
      id: '1',
      name: '张三',
      studentId: '2023001001',
      email: 'zhangsan@student.edu.cn',
      phone: '138****5678',
      class: '2025春-线性代数-01班',
      course: '线性代数',
      averageScore: 88.5,
      submissionRate: 95,
      lastActive: '2025-07-23T09:30:00Z',
      status: 'active'
    },
    {
      id: '2',
      name: '李四',
      studentId: '2023001002',
      email: 'lisi@student.edu.cn',
      phone: '139****1234',
      class: '2025春-线性代数-01班',
      course: '线性代数',
      averageScore: 72.3,
      submissionRate: 85,
      lastActive: '2025-07-22T14:20:00Z',
      status: 'active'
    },
    {
      id: '3',
      name: '王五',
      studentId: '2023001003',
      email: 'wangwu@student.edu.cn',
      class: '2025春-微积分基础-02班',
      course: '微积分基础',
      averageScore: 91.2,
      submissionRate: 100,
      lastActive: '2025-07-23T11:15:00Z',
      status: 'active'
    },
    {
      id: '4',
      name: '赵六',
      studentId: '2023001004',
      email: 'zhaoliu@student.edu.cn',
      class: '2025春-微积分基础-02班',
      course: '微积分基础',
      averageScore: 65.8,
      submissionRate: 70,
      lastActive: '2025-07-20T16:45:00Z',
      status: 'inactive'
    },
    {
      id: '5',
      name: '钱七',
      studentId: '2023001005',
      email: 'qianqi@student.edu.cn',
      class: '2025春-高等数学-03班',
      course: '高等数学',
      averageScore: 83.7,
      submissionRate: 92,
      lastActive: '2025-07-23T08:50:00Z',
      status: 'active'
    }
  ];

  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return '刚刚活跃';
    } else if (diffInHours < 24) {
      return `${diffInHours}小时前活跃`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}天前活跃`;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSubmissionRateColor = (rate: number) => {
    if (rate >= 90) return 'bg-green-100 text-green-800';
    if (rate >= 80) return 'bg-blue-100 text-blue-800';
    if (rate >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.studentId.includes(searchQuery) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === 'all' || student.class === selectedClass;
    const matchesCourse = selectedCourse === 'all' || student.course === selectedCourse;
    
    return matchesSearch && matchesClass && matchesCourse;
  });

  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'active').length;
  const averageScore = students.reduce((sum, s) => sum + s.averageScore, 0) / students.length;
  const averageSubmissionRate = students.reduce((sum, s) => sum + s.submissionRate, 0) / students.length;

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-semibold mb-2">班级管理</h1>
        <p className="text-muted-foreground">
          管理您负责的班级和学生信息
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="students">学生管理</TabsTrigger>
          <TabsTrigger value="classes">班级详情</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* 统计概览 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">管理学生数</p>
                    <p className="text-2xl font-semibold">{totalStudents}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  活跃学生: {activeStudents}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">平均成绩</p>
                    <p className={`text-2xl font-semibold ${getScoreColor(averageScore)}`}>
                      {averageScore.toFixed(1)}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">平均提交率</p>
                    <p className="text-2xl font-semibold">{averageSubmissionRate.toFixed(0)}%</p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">管理班级数</p>
                    <p className="text-2xl font-semibold">{classes.length}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 班级概览 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {classes.map((classInfo) => (
              <Card key={classInfo.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{classInfo.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    主讲教师: {classInfo.instructor}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">学生数量</span>
                      <span className="font-medium">{classInfo.studentCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">平均成绩</span>
                      <span className={`font-medium ${getScoreColor(classInfo.averageScore)}`}>
                        {classInfo.averageScore}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">提交率</span>
                      <Badge className={getSubmissionRateColor(classInfo.submissionRate)}>
                        {classInfo.submissionRate}%
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4" size="sm">
                    查看详情
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          {/* 搜索和筛选 */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="搜索学生姓名、学号或邮箱..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="选择课程" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部课程</SelectItem>
                      <SelectItem value="线性代数">线性代数</SelectItem>
                      <SelectItem value="微积分基础">微积分基础</SelectItem>
                      <SelectItem value="高等数学">高等数学</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="选择班级" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部班级</SelectItem>
                      {classes.map(cls => (
                        <SelectItem key={cls.id} value={cls.name}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 学生列表 */}
          <div className="space-y-4">
            {filteredStudents.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">没有找到匹配的学生</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredStudents.map((student) => (
                <Card key={student.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <GraduationCap className="h-6 w-6 text-blue-600" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{student.name}</h3>
                            <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                              {student.status === 'active' ? '活跃' : '不活跃'}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-2">
                              <span>学号: {student.studentId}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              <span>{student.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4" />
                              <span>{student.course}</span>
                            </div>
                            {student.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                <span>{student.phone}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <span className="text-xs text-muted-foreground">平均成绩</span>
                              <p className={`font-medium ${getScoreColor(student.averageScore)}`}>
                                {student.averageScore}分
                              </p>
                            </div>
                            <div>
                              <span className="text-xs text-muted-foreground">提交率</span>
                              <p className="font-medium">{student.submissionRate}%</p>
                            </div>
                            <div>
                              <span className="text-xs text-muted-foreground">最后活跃</span>
                              <p className="font-medium">{getRelativeTime(student.lastActive)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          私信
                        </Button>
                        <Button size="sm" variant="outline">
                          查看详情
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="classes" className="space-y-6">
          {/* 班级详细信息 */}
          <div className="space-y-6">
            {classes.map((classInfo) => (
              <Card key={classInfo.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{classInfo.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        课程: {classInfo.course} | 主讲教师: {classInfo.instructor}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        发送通知
                      </Button>
                      <Button size="sm">
                        管理学生
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-semibold text-blue-600">{classInfo.studentCount}</p>
                      <p className="text-sm text-muted-foreground">学生总数</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className={`text-2xl font-semibold ${getScoreColor(classInfo.averageScore)}`}>
                        {classInfo.averageScore}
                      </p>
                      <p className="text-sm text-muted-foreground">平均成绩</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-semibold text-purple-600">{classInfo.submissionRate}%</p>
                      <p className="text-sm text-muted-foreground">作业提交率</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <p className="text-2xl font-semibold text-orange-600">85%</p>
                      <p className="text-sm text-muted-foreground">活跃度</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}