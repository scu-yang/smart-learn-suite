import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  MoreVertical,
  Eye,
  Edit,
  Copy,
  Archive,
  Trash2,
  Users,
  BookOpen,
  Calendar,
  Clock,
  TrendingUp,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';

const courses = [
  {
    id: 1,
    name: '高等数学A',
    code: 'MATH101',
    semester: '2025春',
    status: 'active',
    description: '微积分基础理论与应用，适合理工科一年级学生',
    cover: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&h=200&fit=crop',
    students: 156,
    classes: 4,
    progress: 75,
    lastUpdated: '2天前',
    nextClass: '明天 09:00',
    teacher: '张教授',
    teacherAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    completionRate: 87,
    avgScore: 82.5,
    type: 'required'
  },
  {
    id: 2,
    name: '线性代数',
    code: 'MATH201',
    semester: '2025春',
    status: 'active',
    description: '向量空间、矩阵运算、特征值与特征向量',
    cover: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=300&h=200&fit=crop',
    students: 128,
    classes: 3,
    progress: 60,
    lastUpdated: '1天前',
    nextClass: '周三 14:00',
    teacher: '张教授',
    teacherAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    completionRate: 92,
    avgScore: 79.3,
    type: 'required'
  },
  {
    id: 3,
    name: '概率论与数理统计',
    code: 'MATH301',
    semester: '2025春',
    status: 'active',
    description: '概率分布、统计推断、假设检验',
    cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop',
    students: 95,
    classes: 2,
    progress: 90,
    lastUpdated: '3天前',
    nextClass: '周五 10:00',
    teacher: '张教授',
    teacherAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    completionRate: 79,
    avgScore: 85.1,
    type: 'elective'
  },
  {
    id: 4,
    name: '离散数学',
    code: 'CS101',
    semester: '2025春',
    status: 'draft',
    description: '集合论、图论、组合数学基础',
    cover: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=300&h=200&fit=crop',
    students: 0,
    classes: 0,
    progress: 25,
    lastUpdated: '1周前',
    nextClass: '未安排',
    teacher: '张教授',
    teacherAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    completionRate: 0,
    avgScore: 0,
    type: 'elective'
  },
  {
    id: 5,
    name: '数学建模',
    code: 'MATH401',
    semester: '2024秋',
    status: 'archived',
    description: '数学建模方法与实践应用',
    cover: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300&h=200&fit=crop',
    students: 78,
    classes: 2,
    progress: 100,
    lastUpdated: '2个月前',
    nextClass: '已结束',
    teacher: '张教授',
    teacherAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    completionRate: 95,
    avgScore: 88.7,
    type: 'elective'
  }
];

const statusConfig = {
  active: { label: '进行中', color: 'bg-chart-2 text-white', dot: 'bg-chart-2' },
  draft: { label: '草稿', color: 'bg-chart-4/20 text-chart-4', dot: 'bg-chart-4' },
  archived: { label: '已归档', color: 'bg-muted text-muted-foreground', dot: 'bg-muted-foreground' }
};

const typeConfig = {
  required: { label: '必修', color: 'bg-chart-1/20 text-chart-1' },
  elective: { label: '选修', color: 'bg-chart-3/20 text-chart-3' }
};

export function MyCourses() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSemester, setFilterSemester] = useState<string>('all');

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || course.status === filterStatus;
    const matchesSemester = filterSemester === 'all' || course.semester === filterSemester;
    
    return matchesSearch && matchesStatus && matchesSemester;
  });

  const activeCourses = courses.filter(c => c.status === 'active');
  const draftCourses = courses.filter(c => c.status === 'draft');
  const archivedCourses = courses.filter(c => c.status === 'archived');

  const handleCourseAction = (action: string, courseId: number) => {
    console.log(`${action} course ${courseId}`);
    switch (action) {
      case 'view':
        navigate(`/course/${courseId}`);
        break;
      case 'edit':
        // Navigate to course edit page (could be the same as create but with courseId)
        navigate(`/courses/create?edit=${courseId}`);
        break;
      case 'copy':
        // Navigate to create course with copy data
        navigate(`/courses/create?copy=${courseId}`);
        break;
      case 'archive':
        // Handle archive action
        console.log('Archive course', courseId);
        break;
      case 'delete':
        // Handle delete action
        console.log('Delete course', courseId);
        break;
      default:
        break;
    }
  };

  const CourseCard = ({ course }: { course: typeof courses[0] }) => (
    <Card className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
      <div className="relative">
        <img 
          src={course.cover} 
          alt={course.name}
          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute top-2 right-2 flex gap-1">
          <Badge className={statusConfig[course.status as keyof typeof statusConfig].color}>
            {statusConfig[course.status as keyof typeof statusConfig].label}
          </Badge>
          <Badge className={typeConfig[course.type as keyof typeof typeConfig].color}>
            {typeConfig[course.type as keyof typeof typeConfig].label}
          </Badge>
        </div>
        <div className="absolute top-2 left-2">
          <div className={`w-2 h-2 rounded-full ${statusConfig[course.status as keyof typeof statusConfig].dot} animate-pulse`} />
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="group-hover:text-primary transition-colors">
              {course.name}
            </CardTitle>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{course.code}</code>
              <span className="text-xs text-muted-foreground">{course.semester}</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>课程操作</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleCourseAction('view', course.id)}>
                <Eye className="w-4 h-4 mr-2" />
                查看详情
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCourseAction('edit', course.id)}>
                <Edit className="w-4 h-4 mr-2" />
                编辑课程
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCourseAction('copy', course.id)}>
                <Copy className="w-4 h-4 mr-2" />
                复制课程
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleCourseAction('archive', course.id)}>
                <Archive className="w-4 h-4 mr-2" />
                归档课程
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleCourseAction('delete', course.id)}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                删除课程
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="line-clamp-2">
          {course.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>教学进度</span>
            <span>{course.progress}%</span>
          </div>
          <Progress value={course.progress} className="h-2" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <Users className="w-3 h-3 text-muted-foreground" />
              <span className="text-sm font-medium">{course.students}</span>
            </div>
            <p className="text-xs text-muted-foreground">学生</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <BookOpen className="w-3 h-3 text-muted-foreground" />
              <span className="text-sm font-medium">{course.classes}</span>
            </div>
            <p className="text-xs text-muted-foreground">班级</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="w-3 h-3 text-muted-foreground" />
              <span className="text-sm font-medium">{course.avgScore}</span>
            </div>
            <p className="text-xs text-muted-foreground">均分</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Link to={`/course/${course.id}`} className="flex-1">
            <Button size="sm" className="w-full">
              进入课程
            </Button>
          </Link>
          <Button size="sm" variant="outline">
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* Meta info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>更新于 {course.lastUpdated}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{course.nextClass}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const CourseListItem = ({ course }: { course: typeof courses[0] }) => (
    <Card className="group hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <img 
            src={course.cover} 
            alt={course.name}
            className="w-16 h-12 object-cover rounded flex-shrink-0"
          />
          
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium truncate group-hover:text-primary transition-colors">
                {course.name}
              </h3>
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{course.code}</code>
              <Badge className={statusConfig[course.status as keyof typeof statusConfig].color}>
                {statusConfig[course.status as keyof typeof statusConfig].label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground truncate">{course.description}</p>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div className="text-center">
              <div className="font-medium">{course.students}</div>
              <div className="text-xs text-muted-foreground">学生</div>
            </div>
            <div className="text-center">
              <div className="font-medium">{course.classes}</div>
              <div className="text-xs text-muted-foreground">班级</div>
            </div>
            <div className="text-center">
              <div className="font-medium">{course.avgScore}</div>
              <div className="text-xs text-muted-foreground">均分</div>
            </div>
            <div className="text-center min-w-[80px]">
              <div className="font-medium">{course.progress}%</div>
              <Progress value={course.progress} className="h-1.5 mt-1" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to={`/course/${course.id}`}>
              <Button size="sm">进入课程</Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleCourseAction('edit', course.id)}>
                  <Edit className="w-4 h-4 mr-2" />
                  编辑
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCourseAction('copy', course.id)}>
                  <Copy className="w-4 h-4 mr-2" />
                  复制
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCourseAction('archive', course.id)}>
                  <Archive className="w-4 h-4 mr-2" />
                  归档
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1>我的课程</h1>
          <p className="text-muted-foreground">管理您的所有课程和班级</p>
        </div>
        <Link to="/courses/create">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            创建课程
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="搜索课程名称或编号..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="w-4 h-4" />
                    状态筛选
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                    全部状态
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('active')}>
                    进行中
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('draft')}>
                    草稿
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('archived')}>
                    已归档
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Calendar className="w-4 h-4" />
                    学期筛选
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilterSemester('all')}>
                    全部学期
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterSemester('2025春')}>
                    2025春
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterSemester('2024秋')}>
                    2024秋
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            全部课程 ({filteredCourses.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            进行中 ({activeCourses.length})
          </TabsTrigger>
          <TabsTrigger value="draft">
            草稿 ({draftCourses.length})
          </TabsTrigger>
          <TabsTrigger value="archived">
            已归档 ({archivedCourses.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCourses.map((course) => (
                <CourseListItem key={course.id} course={course} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {activeCourses.map((course) => (
                <CourseListItem key={course.id} course={course} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="draft" className="space-y-4">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {draftCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {draftCourses.map((course) => (
                <CourseListItem key={course.id} course={course} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="archived" className="space-y-4">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {archivedCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {archivedCourses.map((course) => (
                <CourseListItem key={course.id} course={course} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {filteredCourses.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">没有找到课程</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? '尝试调整搜索条件' : '开始创建您的第一门课程'}
            </p>
            <Link to="/courses/create">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                创建课程
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}