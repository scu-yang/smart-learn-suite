import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Plus, 
  Search, 
  BookOpen, 
  Users, 
  Calendar, 
  MoreHorizontal,
  Edit,
  Trash2,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

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
    cover: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=200&fit=crop'
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
    cover: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=200&fit=crop'
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
    cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop'
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
    cover: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=400&h=200&fit=crop'
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
    cover: 'https://images.unsplash.com/photo-1518932945647-7a1c969f8be2?w=400&h=200&fit=crop'
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
    cover: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop'
  }
];

export function MyCourses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('全部');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredCourses = coursesData.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === '全部' || course.type === filterType;
    return matchesSearch && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case '进行中': return 'bg-chart-2';
      case '即将结束': return 'bg-chart-4';
      case '准备中': return 'bg-chart-3';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>我的课程</h1>
          <p className="text-muted-foreground">管理您的所有课程内容</p>
        </div>
        
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
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="搜索课程..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="全部">全部</SelectItem>
            <SelectItem value="必修课">必修课</SelectItem>
            <SelectItem value="选修课">选修课</SelectItem>
            <SelectItem value="专业课">专业课</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-muted relative">
              <img 
                src={course.cover} 
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="sm" className="w-8 h-8 p-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      编辑课程
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="w-4 h-4 mr-2" />
                      课程设置
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      删除课程
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="line-clamp-1">{course.title}</CardTitle>
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
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{course.students}人</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{course.startDate}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">课程进度</span>
                  <span className="text-sm font-medium">{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>
              
              <Link to={`/course/${course.id}`}>
                <Button className="w-full gap-2">
                  <BookOpen className="w-4 h-4" />
                  进入课程
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium mb-2">暂无课程</h3>
          <p className="text-muted-foreground mb-4">您还没有创建任何课程</p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            创建第一个课程
          </Button>
        </div>
      )}
    </div>
  );
}