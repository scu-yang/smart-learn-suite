import React, { useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { 
  ArrowLeft,
  Play,
  Pause,
  SkipForward,
  Volume2,
  Maximize,
  FileText,
  MessageSquare,
  CheckCircle,
  Clock,
  Users,
  Download,
  BookOpen,
  PenTool,
  Send,
  ThumbsUp,
  Video,
  Settings,
  MoreVertical,
  RotateCcw,
  Bookmark,
  Share,
  ArrowRight
} from 'lucide-react';
import { MixedContentRenderer } from '../../common/MathRenderer';

interface ChapterData {
  id: string;
  title: string;
  description: string;
  sections: SectionData[];
}

interface SectionData {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'assignment' | 'quiz' | 'discussion';
  duration: number;
  isCompleted: boolean;
  content: any;
}

interface Discussion {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  timestamp: string;
  replies: number;
  likes: number;
  isLiked: boolean;
}

const mockChapterData: Record<string, ChapterData> = {
  'ch3': {
    id: 'ch3',
    title: '第3章 积分学',
    description: '不定积分与定积分的概念与计算',
    sections: [
      {
        id: 's3-1',
        title: '不定积分',
        type: 'video',
        duration: 50,
        isCompleted: true,
        content: {
          videoUrl: 'https://example.com/video1.mp4',
          transcript: '在这节课中，我们将学习不定积分的概念。不定积分是导数的反运算，也称为原函数。',
          notes: ['不定积分是导数的反运算', '积分常数C不能省略', '基本积分公式需要熟记'],
          keyPoints: [
            '不定积分的定义和几何意义',
            '基本积分公式的记忆和应用：$\\int x^n dx = \\frac{x^{n+1}}{n+1} + C$',
            '换元积分法的使用技巧',
            '分部积分法的应用场景'
          ]
        }
      },
      {
        id: 's3-2',
        title: '定积分',
        type: 'video',
        duration: 45,
        isCompleted: true,
        content: {
          videoUrl: 'https://example.com/video2.mp4',
          transcript: '定积分的概念建立在黎曼积分的基础上，表示曲线下方的面积。',
          notes: ['定积分有明确的几何意义', '牛顿-莱布尼茨公式的应用'],
          keyPoints: [
            '定积分的几何意义和物理意义',
            '定积分的性质和计算方法：$\\int_a^b f(x)dx$',
            '牛顿-莱布尼茨公式的推导：$\\int_a^b f(x)dx = F(b) - F(a)$',
            '定积分在实际问题中的应用'
          ]
        }
      },
      {
        id: 's3-3',
        title: '积分方法',
        type: 'video',
        duration: 40,
        isCompleted: false,
        content: {
          videoUrl: 'https://example.com/video3.mp4',
          transcript: '常用的积分方法包括换元积分法和分部积分法，掌握这些方法对于求解复杂积分至关重要。',
          notes: ['换元积分法的选择技巧', '分部积分法的应用条件'],
          keyPoints: [
            '换元积分法的基本思路',
            '三角换元和分式分解',
            '分部积分法的使用原则：$\\int u dv = uv - \\int v du$',
            '特殊函数的积分技巧'
          ]
        }
      },
      {
        id: 's3-4',
        title: '积分应用',
        type: 'assignment',
        duration: 60,
        isCompleted: false,
        content: {
          questions: [
            {
              id: 'q1',
              text: '计算积分 $\\int x^2 dx$',
              type: 'calculation',
              points: 10,
              hint: '使用基本积分公式：$\\int x^n dx = \\frac{x^{n+1}}{n+1} + C$'
            },
            {
              id: 'q2',
              text: '求曲线 $y=x^2$ 与 $x$ 轴围成的面积（区间 $[0,2]$）',
              type: 'application',
              points: 15,
              hint: '面积等于定积分 $\\int_0^2 x^2 dx$'
            },
            {
              id: 'q3',
              text: '使用分部积分法计算 $\\int xe^x dx$',
              type: 'method',
              points: 20,
              hint: '设 $u=x$, $dv=e^x dx$，然后应用分部积分公式'
            }
          ],
          dueDate: '2025-01-25',
          attempts: 3,
          maxScore: 45
        }
      }
    ]
  }
};

const mockDiscussions: Discussion[] = [
  {
    id: 'd1',
    author: '李同学',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5b5?w=32&h=32&fit=crop&crop=face',
    content: '请问老师，在计算定积分时，上下限的确定有什么规律吗？特别是在处理复杂函数时，如何选择合适的积分区间？',
    timestamp: '2小时前',
    replies: 3,
    likes: 5,
    isLiked: false
  },
  {
    id: 'd2',
    author: '王同学',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    content: '分部积分法的选择原则是什么？我总是选错u和dv，导致积分变得更复杂。有没有什么口诀或者记忆方法？',
    timestamp: '5小时前',
    replies: 2,
    likes: 8,
    isLiked: true
  },
  {
    id: 'd3',
    author: '张同学',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    content: '换元积分法中，如何判断应该使用哪种换元方式？三角换元什么时候使用最合适？',
    timestamp: '1天前',
    replies: 5,
    likes: 12,
    isLiked: false
  }
];

export function ChapterStudy({ courseId }: { courseId?: string }) {
  const { chapterId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const sectionId = searchParams.get('sectionId');
  const currentCourseId = courseId || searchParams.get('courseId');
  
  const chapter = mockChapterData[chapterId || 'ch3'];
  const [currentSectionIndex, setCurrentSectionIndex] = useState(() => {
    if (sectionId && chapter) {
      const index = chapter.sections.findIndex(s => s.id === sectionId);
      return index !== -1 ? index : 0;
    }
    return 0;
  });
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState('');
  const [discussions, setDiscussions] = useState(mockDiscussions);

  const section = chapter?.sections[currentSectionIndex];

  const nextSection = () => {
    if (chapter && currentSectionIndex < chapter.sections.length - 1) {
      const nextSec = chapter.sections[currentSectionIndex + 1];
      setCurrentSectionIndex(prev => prev + 1);
      navigate(`/student/course-study/chapter/${chapterId}?courseId=${currentCourseId}&sectionId=${nextSec.id}`, { replace: true });
    }
  };

  const prevSection = () => {
    if (chapter && currentSectionIndex > 0) {
      const prevSec = chapter.sections[currentSectionIndex - 1];
      setCurrentSectionIndex(prev => prev - 1);
      navigate(`/student/course-study/chapter/${chapterId}?courseId=${currentCourseId}&sectionId=${prevSec.id}`, { replace: true });
    }
  };

  const toggleLike = (discussionId: string) => {
    setDiscussions(prev => prev.map(d => 
      d.id === discussionId 
        ? { ...d, isLiked: !d.isLiked, likes: d.isLiked ? d.likes - 1 : d.likes + 1 }
        : d
    ));
  };

  const submitDiscussion = () => {
    if (newDiscussion.trim()) {
      const newMsg: Discussion = {
        id: `d${Date.now()}`,
        author: '我',
        content: newDiscussion,
        timestamp: '刚刚',
        replies: 0,
        likes: 0,
        isLiked: false
      };
      setDiscussions(prev => [newMsg, ...prev]);
      setNewDiscussion('');
    }
  };

  if (!chapter || !section) {
    return (
      <div className="p-6 text-center">
        <h1>章节不存在</h1>
        <Button onClick={() => navigate(`/student/course-study?courseId=${currentCourseId}`)}>
          返回课程
        </Button>
      </div>
    );
  }

  const renderSectionContent = () => {
    switch (section.type) {
      case 'video':
        return (
          <div className="space-y-6">
            {/* Video Player */}
            <Card>
              <CardContent className="p-0">
                <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto cursor-pointer hover:bg-white/30 transition-colors"
                           onClick={() => setIsPlaying(!isPlaying)}>
                        {isPlaying ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10" />}
                      </div>
                      <p className="text-xl font-medium">{section.title}</p>
                      <p className="text-sm opacity-80">{section.duration}分钟</p>
                    </div>
                  </div>
                  
                  {/* Video Controls */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="text-white text-sm">
                        {Math.floor(progress * section.duration / 100)}:{Math.floor((progress * section.duration / 100) % 1 * 60).toString().padStart(2, '0')}
                      </div>
                      <div className="flex-1">
                        <Progress value={progress} className="h-1 cursor-pointer" />
                      </div>
                      <div className="text-white text-sm">
                        {Math.floor(section.duration)}:{Math.floor((section.duration % 1) * 60).toString().padStart(2, '0')}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20"
                          onClick={() => setIsPlaying(!isPlaying)}
                        >
                          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20"
                          onClick={() => setProgress(Math.min(100, progress + 10))}
                        >
                          <SkipForward className="w-5 h-5" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20"
                        >
                          <Volume2 className="w-5 h-5" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20"
                          onClick={() => setShowTranscript(!showTranscript)}
                        >
                          <FileText className="w-5 h-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20"
                        >
                          <Settings className="w-5 h-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20"
                        >
                          <Maximize className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Video Info & Notes */}
              <div className="space-y-4">
                {/* Key Points */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">学习要点</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {section.content.keyPoints?.map((point: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-chart-1 rounded-full mt-2 flex-shrink-0"></div>
                          <div className="text-sm">
                            <MixedContentRenderer content={point} />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Study Notes */}
                {section.content.notes && section.content.notes.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">重点笔记</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {section.content.notes.map((note: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-chart-2 rounded-full mt-2 flex-shrink-0"></div>
                            <div className="text-sm">
                              <MixedContentRenderer content={note} />
                            </div>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Transcript */}
              <div className="space-y-4">
                {showTranscript && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">视频字幕</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm leading-relaxed">
                        <MixedContentRenderer content={section.content.transcript} />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">学习工具</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Bookmark className="w-4 h-4" />
                        收藏
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="w-4 h-4" />
                        下载
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Share className="w-4 h-4" />
                        分享
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <RotateCcw className="w-4 h-4" />
                        重播
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      case 'assignment':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <PenTool className="w-5 h-5" />
                    {section.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      截止：{new Date(section.content.dueDate).toLocaleDateString('zh-CN')}
                    </Badge>
                    <Badge variant="secondary">
                      总分：{section.content.maxScore}分
                    </Badge>
                  </div>
                </div>
                <CardDescription>
                  完成作业巩固本章学习内容 · {section.content.questions.length}题 · 最多{section.content.attempts}次尝试
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {section.content.questions.map((question: any, index: number) => (
                    <Card key={question.id} className="border-l-4 border-l-chart-1">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-medium">题目 {index + 1}</h4>
                          <Badge variant="secondary">{question.points}分</Badge>
                        </div>
                        <div className="mb-4 text-base">
                          <MixedContentRenderer content={question.text} />
                        </div>
                        
                        {question.hint && (
                          <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm text-muted-foreground">
                              <strong>提示：</strong>
                              <MixedContentRenderer content={question.hint} />
                            </p>
                          </div>
                        )}
                        
                        <div className="space-y-3">
                          <label className="text-sm font-medium">答案：</label>
                          <Textarea
                            placeholder="请在此输入您的答案..."
                            className="min-h-24"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <div className="flex justify-between pt-4 border-t">
                    <div className="flex gap-2">
                      <Button variant="outline">保存草稿</Button>
                      <Button variant="outline">重置答案</Button>
                    </div>
                    <Button>提交作业</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>内容开发中...</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-full bg-background">
      {/* Section Navigation */}
      <div className="w-64 border-r bg-card overflow-y-auto">
        <div className="p-4 border-b">
          <Link to={`/student/course-study?courseId=${currentCourseId}`} className="flex items-center gap-2 text-sm hover:text-primary mb-3">
            <ArrowLeft className="w-4 h-4" />
            返回课程
          </Link>
          <h2 className="font-semibold">{chapter.title}</h2>
          <p className="text-sm text-muted-foreground">{chapter.description}</p>
        </div>

        <div className="p-4">
          <h3 className="font-medium mb-3">章节内容</h3>
          <div className="space-y-2">
            {chapter.sections.map((sec, index) => (
              <div
                key={sec.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  index === currentSectionIndex 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-accent'
                }`}
                onClick={() => {
                  setCurrentSectionIndex(index);
                  navigate(`/student/course-study/chapter/${chapterId}?courseId=${currentCourseId}&sectionId=${sec.id}`, { replace: true });
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    {sec.type === 'video' && <Video className="w-4 h-4" />}
                    {sec.type === 'assignment' && <PenTool className="w-4 h-4" />}
                    {sec.type === 'quiz' && <FileText className="w-4 h-4" />}
                    {sec.type === 'discussion' && <MessageSquare className="w-4 h-4" />}
                    <span className="text-sm font-medium">{sec.title}</span>
                  </div>
                  {sec.isCompleted && (
                    <CheckCircle className="w-4 h-4 text-chart-1" />
                  )}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs opacity-70">
                    {sec.duration > 0 ? `${sec.duration}分钟` : ''}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {sec.type === 'video' && '视频'}
                    {sec.type === 'assignment' && '作业'}
                    {sec.type === 'quiz' && '测验'}
                    {sec.type === 'discussion' && '讨论'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1>{section.title}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{section.duration}分钟</span>
                </div>
                <Badge variant="outline">
                  {section.type === 'video' && '视频课程'}
                  {section.type === 'assignment' && '课后作业'}
                  {section.type === 'quiz' && '章节测验'}
                  {section.type === 'discussion' && '课堂讨论'}
                </Badge>
                {section.isCompleted && (
                  <Badge variant="default" className="gap-1">
                    <CheckCircle className="w-3 h-3" />
                    已完成
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={prevSection}
                disabled={currentSectionIndex === 0}
              >
                上一节
              </Button>
              <Button 
                onClick={nextSection}
                disabled={currentSectionIndex === chapter.sections.length - 1}
                className="gap-2"
              >
                下一节
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Section Content */}
          <Tabs defaultValue="content" className="space-y-4">
            <TabsList>
              <TabsTrigger value="content">学习内容</TabsTrigger>
              <TabsTrigger value="discussion">课堂讨论</TabsTrigger>
              <TabsTrigger value="notes">学习笔记</TabsTrigger>
            </TabsList>

            <TabsContent value="content">
              {renderSectionContent()}
            </TabsContent>

            <TabsContent value="discussion" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    课堂讨论
                  </CardTitle>
                  <CardDescription>与同学交流学习心得，提出疑问</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Post new discussion */}
                  <div className="mb-6 p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">发表讨论</h4>
                    <Textarea
                      placeholder="分享你的学习心得或提出问题..."
                      value={newDiscussion}
                      onChange={(e) => setNewDiscussion(e.target.value)}
                      className="mb-3"
                    />
                    <Button onClick={submitDiscussion} disabled={!newDiscussion.trim()}>
                      <Send className="w-4 h-4 mr-2" />
                      发表
                    </Button>
                  </div>

                  {/* Discussion list */}
                  <div className="space-y-4">
                    {discussions.map((discussion) => (
                      <Card key={discussion.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={discussion.avatar} />
                              <AvatarFallback>{discussion.author.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium text-sm">{discussion.author}</span>
                                <span className="text-xs text-muted-foreground">{discussion.timestamp}</span>
                              </div>
                              <div className="text-sm mb-3 leading-relaxed">
                                <MixedContentRenderer content={discussion.content} />
                              </div>
                              <div className="flex items-center gap-4 text-xs">
                                <button 
                                  className={`flex items-center gap-1 hover:text-chart-1 transition-colors ${
                                    discussion.isLiked ? 'text-chart-1' : ''
                                  }`}
                                  onClick={() => toggleLike(discussion.id)}
                                >
                                  <ThumbsUp className="w-3 h-3" />
                                  <span>{discussion.likes}</span>
                                </button>
                                <button className="flex items-center gap-1 hover:text-chart-2 transition-colors">
                                  <MessageSquare className="w-3 h-3" />
                                  <span>{discussion.replies}条回复</span>
                                </button>
                                <button className="flex items-center gap-1 hover:text-chart-3 transition-colors">
                                  <Share className="w-3 h-3" />
                                  分享
                                </button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>学习笔记</CardTitle>
                  <CardDescription>记录学习要点和心得体会</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="在这里记录你的学习笔记..."
                      className="min-h-32"
                    />
                    <div className="flex justify-between">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Bookmark className="w-4 h-4 mr-2" />
                          添加书签
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          导出笔记
                        </Button>
                      </div>
                      <Button size="sm">保存笔记</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}