import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
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
import { Separator } from '../../ui/separator';
import { CourseExamManagement } from './CourseExamManagement';
import { 
  ChevronRight,
  ChevronDown,
  Plus,
  Search,
  Edit,
  Copy,
  Trash2,
  Upload,
  Download,
  Users,
  UserPlus,
  FileText,
  Video,
  Link as LinkIcon,
  Calculator,
  MoreVertical,
  GripVertical,
  BookOpen,
  Calendar,
  Clock,
  TrendingUp,
  Settings,
  Eye,
  MessageSquare,
  Target,
  FileQuestion
} from 'lucide-react';

interface ChapterNode {
  id: string;
  title: string;
  type: 'chapter' | 'section';
  children?: ChapterNode[];
  resources?: Resource[];
  expanded?: boolean;
}

interface Resource {
  id: string;
  name: string;
  type: 'document' | 'video' | 'link' | 'latex';
  size?: string;
  duration?: string;
  url?: string;
  uploadedAt: string;
  downloads: number;
}

interface ClassInfo {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  students: number;
  assistants: string[];
  avgCompletion: number;
  status: 'active' | 'upcoming' | 'completed';
}

const mockChapters: ChapterNode[] = [
  {
    id: 'ch1',
    title: '第一章 函数与极限',
    type: 'chapter',
    expanded: true,
    children: [
      {
        id: 'ch1s1',
        title: '函数的概念',
        type: 'section',
        resources: [
          {
            id: 'r1',
            name: '函数基本概念.pdf',
            type: 'document',
            size: '2.3MB',
            uploadedAt: '2天前',
            downloads: 45
          },
          {
            id: 'r2',
            name: '函数图像与性质',
            type: 'video',
            duration: '25:30',
            uploadedAt: '3天前',
            downloads: 38
          }
        ]
      },
      {
        id: 'ch1s2',
        title: '数列的极限',
        type: 'section',
        resources: [
          {
            id: 'r3',
            name: '极限定义与性质',
            type: 'latex',
            uploadedAt: '1天前',
            downloads: 32
          }
        ]
      }
    ]
  },
  {
    id: 'ch2',
    title: '第二章 导数与微分',
    type: 'chapter',
    expanded: false,
    children: [
      {
        id: 'ch2s1',
        title: '导数的概念',
        type: 'section',
        resources: []
      },
      {
        id: 'ch2s2',
        title: '求导法则',
        type: 'section',
        resources: []
      }
    ]
  }
];

const mockClasses: ClassInfo[] = [
  {
    id: 'c1',
    name: '高等数学A-01班',
    startDate: '2025-02-20',
    endDate: '2025-06-30',
    students: 45,
    assistants: ['李助教', '王助教'],
    avgCompletion: 87,
    status: 'active'
  },
  {
    id: 'c2',
    name: '高等数学A-02班',
    startDate: '2025-02-20',
    endDate: '2025-06-30',
    students: 42,
    assistants: ['张助教'],
    avgCompletion: 92,
    status: 'active'
  },
  {
    id: 'c3',
    name: '高等数学A-03班',
    startDate: '2025-02-20',
    endDate: '2025-06-30',
    students: 38,
    assistants: [],
    avgCompletion: 79,
    status: 'active'
  }
];

const mockAnnouncements = [
  {
    id: 'a1',
    title: '第三章作业说明',
    content: '请同学们认真完成第三章的练习题，截止时间为本周五晚上23:59。',
    publishedAt: '2天前',
    views: 128,
    classes: ['高等数学A-01班', '高等数学A-02班']
  },
  {
    id: 'a2',
    title: '期中考试安排',
    content: '期中考试将于下周三进行，考试范围为第1-4章内容。',
    publishedAt: '1周前',
    views: 156,
    classes: ['全部班级']
  }
];

export function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chapters, setChapters] = useState<ChapterNode[]>(mockChapters);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock course data - 映射课程ID到实际课程ID
  const courseIdMap: { [key: string]: string } = {
    '1': 'course-1',
    '2': 'course-2',
    '3': 'course-3',
    '4': 'course-4'
  };

  const course = {
    id: courseIdMap[id || '1'] || 'course-1',
    name: '高等数学A',
    code: 'MATH101',
    description: '微积分基础理论与应用，适合理工科一年级学生',
    semester: '2025春',
    students: 125,
    classes: 3,
    progress: 75,
    completionRate: 87,
    avgScore: 82.5
  };

  const toggleChapter = (chapterId: string) => {
    setChapters(prev => prev.map(chapter => {
      if (chapter.id === chapterId) {
        return { ...chapter, expanded: !chapter.expanded };
      }
      return chapter;
    }));
  };

  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'document': return <FileText className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'link': return <LinkIcon className="w-4 h-4" />;
      case 'latex': return <Calculator className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getSelectedNodeTitle = () => {
    if (!selectedNode) return null;
    
    const findNode = (nodes: ChapterNode[]): ChapterNode | null => {
      for (const node of nodes) {
        if (node.id === selectedNode) return node;
        if (node.children) {
          const found = findNode(node.children);
          if (found) return found;
        }
      }
      return null;
    };
    
    return findNode(chapters)?.title;
  };

  const handleCreateQuestion = () => {
    // 构建创建题目的URL，传递课程和知识点参数
    const params = new URLSearchParams();
    params.set('defaultCourse', course.id);
    
    if (selectedNode) {
      params.set('defaultKnowledgePoint', selectedNode);
    }
    
    navigate(`/questions/create?${params.toString()}`);
  };

  const handleSelectFromQuestionBank = () => {
    // 导航到题库浏览器，传递课程参数进行筛选
    const params = new URLSearchParams();
    params.set('courseFilter', course.id);
    
    if (selectedNode) {
      params.set('knowledgePointFilter', selectedNode);
    }
    
    navigate(`/questions/browse?${params.toString()}`);
  };

  const ChapterTree = ({ node, level = 0 }: { node: ChapterNode; level?: number }) => (
    <div className={`${level > 0 ? 'ml-4' : ''}`}>
      <div
        className={`flex items-center gap-2 p-2 rounded-lg hover:bg-accent cursor-pointer group ${
          selectedNode === node.id ? 'bg-accent' : ''
        }`}
        onClick={() => {
          if (node.type === 'chapter') {
            toggleChapter(node.id);
          }
          setSelectedNode(node.id);
        }}
      >
        <div className="flex items-center gap-1">
          {node.type === 'chapter' && (
            <Button variant="ghost" size="icon" className="w-4 h-4 p-0">
              {node.expanded ? 
                <ChevronDown className="w-3 h-3" /> : 
                <ChevronRight className="w-3 h-3" />
              }
            </Button>
          )}
          <GripVertical className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        
        <div className="flex-1 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-muted-foreground" />
          <span className={node.type === 'chapter' ? 'font-medium' : 'text-sm'}>{node.title}</span>
          {node.resources && node.resources.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {node.resources.length}
            </Badge>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="w-4 h-4 mr-2" />
              编辑
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Plus className="w-4 h-4 mr-2" />
              添加子节点
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy className="w-4 h-4 mr-2" />
              复制
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              删除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {node.expanded && node.children && (
        <div className="ml-2">
          {node.children.map(child => (
            <ChapterTree key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );

  const ResourceList = ({ resources }: { resources: Resource[] }) => (
    <div className="space-y-2">
      {resources.map(resource => (
        <div key={resource.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/50 group">
          <div className="text-muted-foreground">
            {getResourceIcon(resource.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{resource.name}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{resource.uploadedAt}</span>
              {resource.size && (
                <>
                  <span>•</span>
                  <span>{resource.size}</span>
                </>
              )}
              {resource.duration && (
                <>
                  <span>•</span>
                  <span>{resource.duration}</span>
                </>
              )}
              <span>•</span>
              <span>{resource.downloads} 下载</span>
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <Eye className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <Download className="w-4 h-4" />
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
                  编辑
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="w-4 h-4 mr-2" />
                  复制链接
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  删除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Course Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1>{course.name}</h1>
            <code className="text-sm bg-muted px-2 py-1 rounded">{course.code}</code>
            <Badge variant="secondary">{course.semester}</Badge>
          </div>
          <p className="text-muted-foreground">{course.description}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Settings className="w-4 h-4" />
            课程设置
          </Button>
          <Button className="gap-2">
            <MessageSquare className="w-4 h-4" />
            发布公告
          </Button>
        </div>
      </div>

      {/* Course Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-1">{course.students}</div>
            <p className="text-sm text-muted-foreground">学生总数</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-2">{course.classes}</div>
            <p className="text-sm text-muted-foreground">开设班级</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-3">{course.completionRate}%</div>
            <p className="text-sm text-muted-foreground">完成率</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-4">{course.avgScore}</div>
            <p className="text-sm text-muted-foreground">平均分</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chapter Tree Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>章节目录</span>
                <div className="flex gap-1">
                  <Button variant="outline" size="icon" className="w-8 h-8">
                    <Upload className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="w-8 h-8">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button size="icon" className="w-8 h-8">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>拖拽调整章节顺序</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-1 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索章节..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {chapters.map(chapter => (
                  <ChapterTree key={chapter.id} node={chapter} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="classes" className="space-y-4">
            <TabsList>
              <TabsTrigger value="classes">班级管理</TabsTrigger>
              <TabsTrigger value="resources">资源管理</TabsTrigger>
              <TabsTrigger value="questions">题目管理</TabsTrigger>
              <TabsTrigger value="exams">作业/考试管理</TabsTrigger>
              <TabsTrigger value="announcements">课程公告</TabsTrigger>
            </TabsList>

            <TabsContent value="classes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>班级列表</span>
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      创建班级
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockClasses.map(classInfo => (
                    <Card key={classInfo.id} className="group hover:shadow-sm transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="space-y-1">
                            <h4 className="font-medium">{classInfo.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              <span>{classInfo.startDate} - {classInfo.endDate}</span>
                            </div>
                          </div>
                          <Badge variant={classInfo.status === 'active' ? 'default' : 'secondary'}>
                            {classInfo.status === 'active' ? '进行中' : '未开始'}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-xl font-bold text-chart-1">{classInfo.students}</div>
                            <p className="text-xs text-muted-foreground">学生数</p>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold text-chart-2">{classInfo.assistants.length}</div>
                            <p className="text-xs text-muted-foreground">助教数</p>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold text-chart-3">{classInfo.avgCompletion}%</div>
                            <p className="text-xs text-muted-foreground">完成率</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>整体进度</span>
                            <span>{classInfo.avgCompletion}%</span>
                          </div>
                          <Progress value={classInfo.avgCompletion} className="h-2" />
                        </div>

                        <Separator className="my-3" />

                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="gap-1">
                              <UserPlus className="w-3 h-3" />
                              导入学生
                            </Button>
                            <Button variant="outline" size="sm" className="gap-1">
                              <Users className="w-3 h-3" />
                              分配助教
                            </Button>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                更多操作
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Download className="w-4 h-4 mr-2" />
                                导出名单
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                编辑班级
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" />
                                删除班级
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>资源管理</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="gap-2">
                          <Plus className="w-4 h-4" />
                          添加资源
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <FileText className="w-4 h-4 mr-2" />
                          上传文档
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Video className="w-4 h-4 mr-2" />
                          上传视频
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <LinkIcon className="w-4 h-4 mr-2" />
                          添加链接
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleCreateQuestion}>
                          <Calculator className="w-4 h-4 mr-2" />
                          创建题目
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardTitle>
                  <CardDescription>
                    {selectedNode ? 
                      `当前选中：${getSelectedNodeTitle()}` :
                      '请在左侧选择章节来管理资源'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedNode ? (
                    <div className="space-y-4">
                      <ResourceList resources={mockChapters[0].children?.[0].resources || []} />
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>请在左侧章节树中选择要管理的章节</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="questions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>题目管理</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="gap-2">
                          <Plus className="w-4 h-4" />
                          添加题目
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleSelectFromQuestionBank}>
                          <FileQuestion className="w-4 h-4 mr-2" />
                          从题库选择
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleCreateQuestion}>
                          <Plus className="w-4 h-4 mr-2" />
                          创建新题目
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardTitle>
                  <CardDescription>
                    {selectedNode ? 
                      `当前知识点：${getSelectedNodeTitle()}` :
                      '请在左侧选择知识点来查看相关题目'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedNode ? (
                    <div className="text-center py-8">
                      <FileQuestion className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="font-medium mb-2">题目管理功能</h3>
                      <p className="text-muted-foreground mb-4">
                        管理 "{getSelectedNodeTitle()}" 知识点下的所有题目
                      </p>
                      <div className="flex justify-center gap-2">
                        <Button variant="outline" className="gap-2" onClick={handleSelectFromQuestionBank}>
                          <FileQuestion className="w-4 h-4" />
                          从题库选择
                        </Button>
                        <Button className="gap-2" onClick={handleCreateQuestion}>
                          <Plus className="w-4 h-4" />
                          创建新题目
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileQuestion className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>请在左侧章节树中选择知识点来管理题目</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="exams" className="space-y-4">
              <CourseExamManagement selectedKnowledgePoint={getSelectedNodeTitle()} />
            </TabsContent>

            <TabsContent value="announcements" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>课程公告</span>
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      发布公告
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockAnnouncements.map(announcement => (
                    <Card key={announcement.id} className="group hover:shadow-sm transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">{announcement.title}</h4>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Eye className="w-3 h-3" />
                            <span>{announcement.views}</span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">{announcement.content}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{announcement.publishedAt}</span>
                            <span>•</span>
                            <span>发送至：{announcement.classes.join(', ')}</span>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreVertical className="w-3 h-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                编辑
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="w-4 h-4 mr-2" />
                                复制
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" />
                                删除
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}