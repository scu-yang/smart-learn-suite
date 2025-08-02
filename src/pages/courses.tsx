import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  BookOpen, 
  Users, 
  Clock, 
  MoreVertical, 
  Play, 
  Settings, 
  Trash2,
  Calendar,
  GraduationCap
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

// 模拟课程数据
const coursesData = [
  {
    id: 1,
    title: '高等数学A',
    description: '高等数学基础课程，涵盖微积分、导数、积分等核心内容',
    type: '必修课',
    students: 45,
    progress: 75,
    status: '进行中',
    startDate: '2025-02-01',
    endDate: '2025-06-30',
    cover: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=200&fit=crop',
    teacher: '张教授',
    credits: 4,
    classroom: '理A301'
  },
  {
    id: 2,
    title: '线性代数',
    description: '线性代数基础理论与应用，矩阵运算、向量空间等',
    type: '必修课',
    students: 38,
    progress: 60,
    status: '进行中',
    startDate: '2025-02-01',
    endDate: '2025-06-30',
    cover: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=200&fit=crop',
    teacher: '李教授',
    credits: 3,
    classroom: '理A302'
  },
  {
    id: 3,
    title: '概率论与数理统计',
    description: '概率论基础、随机变量、统计推断等内容',
    type: '必修课',
    students: 42,
    progress: 90,
    status: '即将结束',
    startDate: '2024-09-01',
    endDate: '2025-01-31',
    cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
    teacher: '王教授',
    credits: 3,
    classroom: '理A303'
  },
  {
    id: 4,
    title: '离散数学',
    description: '离散数学基础，集合论、图论、组合数学等',
    type: '选修课',
    students: 35,
    progress: 45,
    status: '进行中',
    startDate: '2025-02-01',
    endDate: '2025-06-30',
    cover: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=400&h=200&fit=crop',
    teacher: '赵教授',
    credits: 2,
    classroom: '理A304'
  },
  {
    id: 5,
    title: '数据结构与算法',
    description: '计算机数据结构基础，算法设计与分析',
    type: '专业课',
    students: 52,
    progress: 30,
    status: '进行中',
    startDate: '2025-02-01',
    endDate: '2025-06-30',
    cover: 'https://images.unsplash.com/photo-1518932945647-7a1c969f8be2?w=400&h=200&fit=crop',
    teacher: '刘教授',
    credits: 4,
    classroom: '计算机楼301'
  },
  {
    id: 6,
    title: '计算机网络',
    description: '计算机网络原理、协议栈、网络安全等',
    type: '专业课',
    students: 48,
    progress: 15,
    status: '准备中',
    startDate: '2025-03-01',
    endDate: '2025-07-31',
    cover: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop',
    teacher: '陈教授',
    credits: 3,
    classroom: '计算机楼302'
  }
];

export function CoursesPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { user } = useAuth();
  const getStatusColor = (status: string) => {
    switch (status) {
      case '进行中': return 'bg-green-100 text-green-800';
      case '即将结束': return 'bg-yellow-100 text-yellow-800';
      case '准备中': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 根据用户角色显示不同的界面
  const isTeacher = user?.currentRole === 'Teacher' || user?.currentRole === 'Admin';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <GraduationCap className="w-8 h-8 mr-3 text-blue-600" />
              {isTeacher ? '我的课程' : '课程中心'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isTeacher ? '管理您的所有课程和班级' : '查看学习进度和课程资料'}
            </p>
          </div>
          
          {isTeacher && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  创建课程
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>创建新课程</DialogTitle>
                  <DialogDescription>填写课程基本信息</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">课程名称</Label>
                    <Input id="title" placeholder="输入课程名称" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">课程类型</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="选择课程类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="必修课">必修课</SelectItem>
                        <SelectItem value="选修课">选修课</SelectItem>
                        <SelectItem value="专业课">专业课</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">课程描述</Label>
                    <Textarea id="description" placeholder="输入课程描述" />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => setIsCreateDialogOpen(false)} className="flex-1">
                      创建课程
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      取消
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
        {/* 课程网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursesData.map((course) => (
            <Card key={course.id} className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
              {/* 课程封面 */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={course.cover} 
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute top-4 right-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="sm" className="h-8 w-8 p-0 bg-white/80 backdrop-blur-sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {isTeacher ? (
                        <>
                          <DropdownMenuItem>
                            <Settings className="w-4 h-4 mr-2" />
                            课程设置
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            删除课程
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <>
                          <DropdownMenuItem>
                            <BookOpen className="w-4 h-4 mr-2" />
                            加入课程
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{course.type}</Badge>
                      <Badge variant="outline" className={getStatusColor(course.status)}>
                        {course.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <CardDescription className="line-clamp-2">
                  {course.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* 课程信息 */}
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{course.students} 学生</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{course.credits} 学分</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{course.classroom}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    <span>{course.teacher}</span>
                  </div>
                </div>

                {/* 学习进度 */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">学习进度</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <Progress 
                    value={course.progress} 
                    className="h-2" 
                  />
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 gap-2"
                    onClick={() => window.location.href = `/course/${course.id}`}
                  >
                    <BookOpen className="w-4 h-4" />
                    查看详情
                  </Button>
                  {course.progress > 0 && (
                    <Button className="gap-2">
                      <Play className="w-4 h-4" />
                      继续学习
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
