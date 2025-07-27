import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Progress } from '../../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { Checkbox } from '../../ui/checkbox';
import { Label } from '../../ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { 
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  Upload,
  MoreVertical,
  Mail,
  Phone,
  Edit,
  Trash2,
  Eye,
  GraduationCap,
  BookOpen,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Shield,
  UserCheck,
  Settings,
  Plus,
  Save
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  studentId: string;
  email: string;
  phone?: string;
  class: string;
  course: string;
  progress: number;
  averageScore: number;
  assignments: {
    completed: number;
    total: number;
  };
  lastActive: string;
  status: 'active' | 'inactive' | 'warning';
  avatar?: string;
}

interface ClassGroup {
  id: string;
  name: string;
  course: string;
  semester: string;
  students: number;
  averageProgress: number;
  averageScore: number;
  nextClass: string;
  status: 'active' | 'completed' | 'upcoming';
}

interface Permission {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

interface TAPermissions {
  classStudentManagement: Permission;
  homeworkGrading: Permission;
  classAnnouncementManagement: Permission;
  courseResourceManagement: Permission;
  learningDataView: Permission;
  discussionManagement: Permission;
}

interface TeachingAssistant {
  id: string;
  name: string;
  email: string;
  phone?: string;
  assignedClasses: string[];
  permissions: TAPermissions;
  avatar?: string;
  status: 'active' | 'inactive';
  joinDate: string;
}

const mockClasses: ClassGroup[] = [
  {
    id: 'c1',
    name: '高等数学A-01班',
    course: '高等数学A',
    semester: '2025春',
    students: 45,
    averageProgress: 87,
    averageScore: 82.5,
    nextClass: '明天 09:00',
    status: 'active'
  },
  {
    id: 'c2',
    name: '线性代数-02班',
    course: '线性代数',
    semester: '2025春',
    students: 38,
    averageProgress: 92,
    averageScore: 85.3,
    nextClass: '周三 14:00',
    status: 'active'
  },
  {
    id: 'c3',
    name: '概率论-01班',
    course: '概率论与数理统计',
    semester: '2025春',
    students: 42,
    averageProgress: 79,
    averageScore: 78.9,
    nextClass: '周五 10:00',
    status: 'active'
  }
];

const mockStudents: Student[] = [
  {
    id: 's1',
    name: '张三',
    studentId: '2024001001',
    email: 'zhangsan@university.edu',
    phone: '138****1234',
    class: '高等数学A-01班',
    course: '高等数学A',
    progress: 95,
    averageScore: 88.5,
    assignments: { completed: 8, total: 8 },
    lastActive: '2小时前',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
  },
  {
    id: 's2',
    name: '李四',
    studentId: '2024001002',
    email: 'lisi@university.edu',
    phone: '139****5678',
    class: '高等数学A-01班',
    course: '高等数学A',
    progress: 72,
    averageScore: 76.2,
    assignments: { completed: 6, total: 8 },
    lastActive: '1天前',
    status: 'warning',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5b5?w=32&h=32&fit=crop&crop=face'
  },
  {
    id: 's3',
    name: '王五',
    studentId: '2024001003',
    email: 'wangwu@university.edu',
    class: '高等数学A-01班',
    course: '高等数学A',
    progress: 58,
    averageScore: 65.8,
    assignments: { completed: 4, total: 8 },
    lastActive: '3天前',
    status: 'inactive',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
  }
];

const mockTeachingAssistants: TeachingAssistant[] = [
  {
    id: 'ta1',
    name: '助教张老师',
    email: 'ta.zhang@university.edu',
    phone: '138****5678',
    assignedClasses: ['c1', 'c2'],
    permissions: {
      classStudentManagement: { view: true, create: true, edit: true, delete: false },
      homeworkGrading: { view: true, create: false, edit: true, delete: false },
      classAnnouncementManagement: { view: true, create: true, edit: true, delete: true },
      courseResourceManagement: { view: true, create: false, edit: true, delete: false },
      learningDataView: { view: true, create: false, edit: false, delete: false },
      discussionManagement: { view: true, create: false, edit: true, delete: true }
    },
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5b5?w=32&h=32&fit=crop&crop=face',
    status: 'active',
    joinDate: '2024-09-01'
  },
  {
    id: 'ta2',
    name: '助教李老师',
    email: 'ta.li@university.edu',
    phone: '139****1234',
    assignedClasses: ['c3'],
    permissions: {
      classStudentManagement: { view: true, create: true, edit: true, delete: true },
      homeworkGrading: { view: true, create: false, edit: true, delete: false },
      classAnnouncementManagement: { view: false, create: false, edit: false, delete: false },
      courseResourceManagement: { view: true, create: true, edit: true, delete: true },
      learningDataView: { view: true, create: false, edit: false, delete: false },
      discussionManagement: { view: true, create: false, edit: true, delete: false }
    },
    status: 'active',
    joinDate: '2024-10-15'
  }
];

const PERMISSION_LABELS = {
  classStudentManagement: '班级学生管理',
  homeworkGrading: '作业批改与分数修正',
  classAnnouncementManagement: '班级公告管理',
  courseResourceManagement: '课程资源管理',
  learningDataView: '学情数据查看',
  discussionManagement: '讨论区管理'
};

const ACTION_LABELS = {
  view: '查看',
  create: '创建',
  edit: '编辑',
  delete: '删除'
};

const PERMISSION_TEMPLATES = {
  full: {
    classStudentManagement: { view: true, create: true, edit: true, delete: true },
    homeworkGrading: { view: true, create: false, edit: true, delete: false },
    classAnnouncementManagement: { view: true, create: true, edit: true, delete: true },
    courseResourceManagement: { view: true, create: true, edit: true, delete: true },
    learningDataView: { view: true, create: false, edit: false, delete: false },
    discussionManagement: { view: true, create: false, edit: true, delete: true }
  },
  grading: {
    classStudentManagement: { view: true, create: true, edit: true, delete: true },
    homeworkGrading: { view: true, create: false, edit: true, delete: false },
    classAnnouncementManagement: { view: false, create: false, edit: false, delete: false },
    courseResourceManagement: { view: false, create: false, edit: false, delete: false },
    learningDataView: { view: true, create: false, edit: false, delete: false },
    discussionManagement: { view: false, create: false, edit: false, delete: false }
  },
  qa: {
    classStudentManagement: { view: false, create: false, edit: false, delete: false },
    homeworkGrading: { view: false, create: false, edit: false, delete: false },
    classAnnouncementManagement: { view: true, create: true, edit: true, delete: true },
    courseResourceManagement: { view: false, create: false, edit: false, delete: false },
    learningDataView: { view: false, create: false, edit: false, delete: false },
    discussionManagement: { view: true, create: false, edit: true, delete: true }
  }
};

export function ClassManagement() {
  const [selectedClass, setSelectedClass] = useState<string>('c1');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'warning' | 'inactive'>('all');
  const [teachingAssistants, setTeachingAssistants] = useState<TeachingAssistant[]>(mockTeachingAssistants);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [selectedTA, setSelectedTA] = useState<TeachingAssistant | null>(null);
  const [permissionTemplate, setPermissionTemplate] = useState<string>('');

  const selectedClassData = mockClasses.find(c => c.id === selectedClass);
  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.studentId.includes(searchQuery);
    const matchesFilter = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: Student['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-chart-2" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-chart-4" />;
      case 'inactive':
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: Student['status']) => {
    switch (status) {
      case 'active':
        return '正常';
      case 'warning':
        return '需关注';
      case 'inactive':
        return '不活跃';
    }
  };

  const handlePermissionChange = (permissionModule: keyof TAPermissions, action: keyof Permission, value: boolean) => {
    if (selectedTA) {
      setSelectedTA(prev => ({
        ...prev!,
        permissions: {
          ...prev!.permissions,
          [permissionModule]: {
            ...prev!.permissions[permissionModule],
            [action]: value
          }
        }
      }));
    }
  };

  const handleTemplateChange = (template: string) => {
    setPermissionTemplate(template);
    if (selectedTA && template && PERMISSION_TEMPLATES[template as keyof typeof PERMISSION_TEMPLATES]) {
      setSelectedTA(prev => ({
        ...prev!,
        permissions: PERMISSION_TEMPLATES[template as keyof typeof PERMISSION_TEMPLATES]
      }));
    }
  };

  const handleSavePermissions = () => {
    if (selectedTA) {
      setTeachingAssistants(prev => prev.map(ta => 
        ta.id === selectedTA.id ? selectedTA : ta
      ));
      setShowPermissionModal(false);
      setSelectedTA(null);
      setPermissionTemplate('');
    }
  };

  const openPermissionModal = (ta: TeachingAssistant) => {
    setSelectedTA({ ...ta });
    setPermissionTemplate('');
    setShowPermissionModal(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1>班级管理</h1>
          <p className="text-muted-foreground">管理课程班级和学生信息</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="w-4 h-4" />
            导入学生
          </Button>
          <Button className="gap-2">
            <UserPlus className="w-4 h-4" />
            添加学生
          </Button>
        </div>
      </div>

      {/* Class Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockClasses.map((classGroup) => (
          <Card 
            key={classGroup.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedClass === classGroup.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedClass(classGroup.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{classGroup.name}</CardTitle>
                <Badge variant={classGroup.status === 'active' ? 'default' : 'secondary'}>
                  {classGroup.status === 'active' ? '进行中' : '已结束'}
                </Badge>
              </div>
              <CardDescription>{classGroup.course} · {classGroup.semester}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-lg font-bold text-chart-1">{classGroup.students}</div>
                  <p className="text-xs text-muted-foreground">学生</p>
                </div>
                <div>
                  <div className="text-lg font-bold text-chart-2">{classGroup.averageProgress}%</div>
                  <p className="text-xs text-muted-foreground">进度</p>
                </div>
                <div>
                  <div className="text-lg font-bold text-chart-3">{classGroup.averageScore}</div>
                  <p className="text-xs text-muted-foreground">平均分</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>下次上课：{classGroup.nextClass}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="students" className="space-y-4">
        <TabsList>
          <TabsTrigger value="students">学生管理</TabsTrigger>
          <TabsTrigger value="assistants">助教管理</TabsTrigger>
          <TabsTrigger value="performance">学习情况</TabsTrigger>
          <TabsTrigger value="assignments">作业统计</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-4">
          {/* Student Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    {selectedClassData?.name} - 学生列表
                  </CardTitle>
                  <CardDescription>共 {selectedClassData?.students} 名学生</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    导出
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Filter className="w-4 h-4" />
                        筛选
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>按状态筛选</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                        全部学生
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus('active')}>
                        正常学生
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus('warning')}>
                        需要关注
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus('inactive')}>
                        不活跃学生
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="搜索学生姓名或学号..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Students List */}
              <div className="space-y-3">
                {filteredStudents.map((student) => (
                  <div key={student.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={student.avatar} />
                      <AvatarFallback>{student.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{student.name}</h4>
                        <code className="text-xs bg-muted px-2 py-1 rounded">{student.studentId}</code>
                        {getStatusIcon(student.status)}
                        <Badge variant="outline" className="text-xs">
                          {getStatusText(student.status)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs">学习进度</p>
                          <div className="flex items-center gap-2">
                            <Progress value={student.progress} className="h-1 flex-1" />
                            <span className="text-xs font-medium">{student.progress}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">平均分</p>
                          <p className="font-medium">{student.averageScore}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">作业完成</p>
                          <p className="font-medium">{student.assignments.completed}/{student.assignments.total}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">最后活跃</p>
                          <p className="font-medium">{student.lastActive}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        <span>{student.email}</span>
                        {student.phone && (
                          <>
                            <span>•</span>
                            <Phone className="w-3 h-3" />
                            <span>{student.phone}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="w-8 h-8">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="w-8 h-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            编辑信息
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="w-4 h-4 mr-2" />
                            发送邮件
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <TrendingUp className="w-4 h-4 mr-2" />
                            查看学情
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            移除学生
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assistants" className="space-y-4">
          {/* Teaching Assistant Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5" />
                    助教管理
                  </CardTitle>
                  <CardDescription>为班级分配助教并设置权限</CardDescription>
                </div>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  添加助教
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teachingAssistants.map((ta) => (
                  <div key={ta.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={ta.avatar} />
                        <AvatarFallback>{ta.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{ta.name}</h4>
                          <Badge variant={ta.status === 'active' ? 'default' : 'secondary'}>
                            {ta.status === 'active' ? '活跃' : '不活跃'}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{ta.email}</span>
                          </div>
                          {ta.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>{ta.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>负责 {ta.assignedClasses.length} 个班级</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>加入时间: {ta.joinDate}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-medium">权限概览</p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {Object.entries(ta.permissions).map(([key, perms]) => {
                              const enabledActions = Object.values(perms).filter(Boolean).length;
                              const totalActions = Object.keys(perms).length;
                              const permissionLabel = PERMISSION_LABELS[key as keyof typeof PERMISSION_LABELS];
                              
                              return (
                                <div key={key} className="flex items-center gap-2 text-xs">
                                  <div className={`w-2 h-2 rounded-full ${
                                    enabledActions > 0 ? 'bg-green-500' : 'bg-gray-300'
                                  }`}></div>
                                  <span className={enabledActions > 0 ? 'text-green-700' : 'text-gray-500'}>
                                    {permissionLabel}
                                  </span>
                                  <span className="text-muted-foreground">
                                    ({enabledActions}/{totalActions})
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openPermissionModal(ta)}
                          className="gap-2"
                        >
                          <Settings className="w-4 h-4" />
                          配置权限
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="w-8 h-8">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              编辑信息
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="w-4 h-4 mr-2" />
                              发送邮件
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              移除助教
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                学习情况统计
              </CardTitle>
              <CardDescription>班级整体学习表现分析</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <GraduationCap className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>学习情况分析功能开发中...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                作业完成统计
              </CardTitle>
              <CardDescription>班级作业提交和完成情况</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>作业统计功能开发中...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Permission Configuration Modal */}
      {showPermissionModal && selectedTA && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold">配置助教权限</h2>
                <p className="text-sm text-muted-foreground">{selectedTA.name} ({selectedTA.email})</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPermissionModal(false)}
              >
                ×
              </Button>
            </div>

            <div className="space-y-6">
              {/* Permission Templates */}
              <div>
                <Label className="text-sm font-medium">权限模板</Label>
                <Select value={permissionTemplate} onValueChange={handleTemplateChange}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="选择权限模板或自定义配置" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">完全权限 (除课程设置外的所有权限)</SelectItem>
                    <SelectItem value="grading">批改助教 (仅批改和学生管理)</SelectItem>
                    <SelectItem value="qa">答疑助教 (仅讨论区和公告)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Permission Matrix */}
              <div>
                <h3 className="font-medium mb-4">权限详细配置</h3>
                <div className="border rounded-lg overflow-hidden">
                  <div className="grid grid-cols-5 gap-0 bg-muted text-sm font-medium">
                    <div className="p-3 border-r">权限项</div>
                    <div className="p-3 border-r text-center">查看</div>
                    <div className="p-3 border-r text-center">创建</div>
                    <div className="p-3 border-r text-center">编辑</div>
                    <div className="p-3 text-center">删除</div>
                  </div>
                  
                  {Object.entries(selectedTA.permissions).map(([moduleKey, modulePerms]) => {
                    const isRestrictedModule = moduleKey === 'classAnnouncementManagement' || 
                                            moduleKey === 'courseResourceManagement';
                    
                    return (
                      <div key={moduleKey} className="grid grid-cols-5 gap-0 border-t">
                        <div className="p-3 border-r">
                          <div>
                            <p className="font-medium text-sm">
                              {PERMISSION_LABELS[moduleKey as keyof typeof PERMISSION_LABELS]}
                            </p>
                            {isRestrictedModule && (
                              <p className="text-xs text-orange-600 mt-1">
                                * 编辑/删除仅限自己创建的内容
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {Object.entries(modulePerms).map(([action, hasPermission]) => (
                          <div key={action} className="p-3 border-r last:border-r-0 flex justify-center">
                            <Checkbox
                              checked={hasPermission}
                              onCheckedChange={(checked) => 
                                handlePermissionChange(
                                  moduleKey as keyof TAPermissions, 
                                  action as keyof Permission, 
                                  checked as boolean
                                )
                              }
                              disabled={
                                // 某些权限组合的逻辑限制
                                (moduleKey === 'homeworkGrading' && (action === 'create' || action === 'delete')) ||
                                (moduleKey === 'learningDataView' && (action === 'create' || action === 'edit' || action === 'delete'))
                              }
                            />
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Permission Description */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">权限说明</h4>
                <div className="space-y-1 text-sm text-blue-800">
                  <p>• <strong>查看权限：</strong>可以浏览相关页面和数据</p>
                  <p>• <strong>创建权限：</strong>可以新建相关内容</p>
                  <p>• <strong>编辑权限：</strong>可以修改相关内容</p>
                  <p>• <strong>删除权限：</strong>可以删除相关内容</p>
                  <p>• <strong>特殊限制：</strong>班级公告管理和课程资源管理的编辑/删除权限仅适用于助教自己创建的内容</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowPermissionModal(false)}
                >
                  取消
                </Button>
                <Button onClick={handleSavePermissions} className="gap-2">
                  <Save className="w-4 h-4" />
                  保存权限
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}