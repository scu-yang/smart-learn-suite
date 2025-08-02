import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  BookOpen, 
  Clock, 
  MoreVertical, 
  Play, 
  Settings, 
  Trash2,
  Calendar,
  GraduationCap
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { courseApi, getCourseStatusName, type CourseStatus } from "@/lib/course-api";

// 获取课程数据的 hook
function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const response = await courseApi.getCourse();
      console.log("Fetched courses:", response.data);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5分钟缓存
  });
}

export function CoursesPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { user } = useAuth();
  
  // 使用 tanstack query 获取课程数据
  const { data: coursesData, isLoading, error } = useCourses();
  
  const getStatusColor = (status: CourseStatus) => {
    switch (status) {
      case 'Pending': return 'bg-blue-100 text-blue-800';
      case 'Ongoing': return 'bg-green-100 text-green-800';
      case 'Ended': return 'bg-gray-100 text-gray-800';
      case 'Canceled': return 'bg-red-100 text-red-800';
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
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse" />
                <CardHeader>
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded animate-pulse" />
                    <div className="flex gap-2">
                      <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
                      <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
                      ))}
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-2 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 h-9 bg-gray-200 rounded animate-pulse" />
                      <div className="h-9 w-24 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : error ? (
            // 错误状态
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">加载课程失败</h3>
                <p className="text-gray-600 mb-4">请检查网络连接后重试</p>
                <Button onClick={() => window.location.reload()}>重新加载</Button>
              </div>
            </div>
          ) : !coursesData || coursesData.length === 0 ? (
            // 空状态
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无课程</h3>
                <p className="text-gray-600 mb-4">
                  {isTeacher ? '开始创建您的第一门课程' : '还没有可用的课程'}
                </p>
                {isTeacher && (
                  <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    创建课程
                  </Button>
                )}
              </div>
            </div>
          ) : (
            // 课程列表
            coursesData.map((course) => (
              <Card key={course.id} className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
                {/* 课程封面 */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={course.cover || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=200&fit=crop'} 
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {course.title}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {course.tags && course.tags.length > 0 ? course.tags[0] : '课程'}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(course.status)}>
                          {getCourseStatusName(course.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {course.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{course.credits} 学分</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>{course.classroom}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      <span>{course.teacherName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        开始时间:
                        {/* 格式: 2025-01-01 */}
                        {new Date(course.startDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        结束时间:
                        {/* 格式: 2025-01-01 */}
                        {new Date(course.endDate).toLocaleDateString()}
                      </span>
                    </div>
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
                    {/* <Button className="gap-2">
                      <Play className="w-4 h-4" />
                      进入课程
                    </Button> */}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
