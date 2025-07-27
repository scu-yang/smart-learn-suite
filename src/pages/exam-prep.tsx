import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CountdownTimer } from '@/components/countdown-timer';
import { AnimatedStatCard } from '@/components/animated-stat-card';
import { 
  Clock, 
  FileText, 
  AlertTriangle, 
  BookOpen, 
  CheckCircle, 
  Users,
  Award,
  TrendingUp,
  Shield,
  Monitor,
  Timer,
  Play,
  ArrowLeft,
  Zap
} from 'lucide-react';
import { Link, useRouter } from '@tanstack/react-router';
import { useExams } from '@/hooks/useQueries';

interface ExamPrepProps {
  examId: string;
}

export function ExamPrepPage({ examId }: ExamPrepProps) {
  const router = useRouter();
  const { data: exams, isLoading } = useExams();
  const [isStarting, setIsStarting] = useState(false);

  const exam = exams?.find(e => e.id === examId);

  const handleStartExam = async () => {
    setIsStarting(true);
    try {
      // 模拟开始考试
      // const session = await api.startExam(examId, "1"); // 模拟用户ID
      const sessionId = `session-${examId}-${Date.now()}`;
      // 跳转到考试页面
      router.navigate({ 
        to: `/exam/${examId}/session/${sessionId}` 
      });
    } catch (error) {
      console.error('开始考试失败:', error);
    } finally {
      setIsStarting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载考试信息...</p>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <CardTitle>考试不存在</CardTitle>
            <CardDescription>
              找不到指定的考试，请检查考试链接是否正确
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link to="/dashboard">
              <Button>返回仪表板</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const examDate = new Date(exam.date);
  const now = new Date();
  const canStart = examDate <= now && exam.status === 'upcoming';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b backdrop-blur-sm bg-white/95 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  返回
                </Button>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">考试准备</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {exam.status === 'upcoming' && (
                <Badge variant="default" className="px-3 py-1 bg-blue-100 text-blue-800">
                  <Clock className="h-3 w-3 mr-1" />
                  等待开始
                </Badge>
              )}
              {exam.status === 'ongoing' && (
                <Badge variant="default" className="px-3 py-1 bg-green-100 text-green-800">
                  <Play className="h-3 w-3 mr-1" />
                  进行中
                </Badge>
              )}
              {exam.status === 'completed' && (
                <Badge variant="default" className="px-3 py-1 bg-gray-100 text-gray-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  已结束
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 考试标题区域 */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{exam.title}</h1>
          <p className="text-lg text-gray-600">{exam.subject} · {exam.description}</p>
          
          {/* 倒计时 */}
          <div className="mt-6 flex justify-center">
            {exam.status === 'upcoming' && !canStart && (
              <div className="bg-white rounded-2xl px-6 py-4 shadow-lg border">
                <p className="text-sm text-gray-600 mb-2">考试开始倒计时</p>
                <CountdownTimer 
                  targetDate={examDate}
                  className="text-center"
                />
              </div>
            )}
            
            {exam.status === 'upcoming' && canStart && (
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl px-6 py-4 shadow-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">考试已开始，可以进入考场</span>
                </div>
              </div>
            )}

            {exam.status === 'ongoing' && (
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl px-6 py-4 shadow-lg">
                <div className="flex items-center space-x-2">
                  <Play className="h-5 w-5" />
                  <span className="font-medium">考试正在进行中</span>
                </div>
              </div>
            )}

            {exam.status === 'completed' && (
              <div className="bg-gradient-to-r from-gray-500 to-slate-600 text-white rounded-2xl px-6 py-4 shadow-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">考试已结束，可查看成绩</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <AnimatedStatCard
            icon={Clock}
            title="考试时长"
            value={exam.duration}
            subtitle="分钟"
            color="blue"
            delay={0}
          />
          <AnimatedStatCard
            icon={Users}
            title="参考人数"
            value={exam.status === 'completed' ? 125 : 150}
            subtitle={exam.status === 'completed' ? '已完成' : '已报名'}
            color="green"
            delay={200}
          />
          {exam.status === 'completed' ? (
            <>
              <AnimatedStatCard
                icon={Award}
                title="平均分"
                value="82.5"
                subtitle="分"
                color="yellow"
                delay={400}
              />
              <AnimatedStatCard
                icon={TrendingUp}
                title="及格率"
                value="85.6"
                subtitle="%"
                color="purple"
                delay={600}
              />
            </>
          ) : (
            <>
              <AnimatedStatCard
                icon={FileText}
                title="题目数量"
                value="25"
                subtitle="道题"
                color="yellow"
                delay={400}
              />
              <AnimatedStatCard
                icon={Award}
                title="总分"
                value="100"
                subtitle="分"
                color="purple"
                delay={600}
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 考试信息 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 基本信息卡片 */}
            <Card className="animate-slide-in-from-left hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-600" />
                    考试信息
                  </CardTitle>
                  <Badge variant="outline">{exam.status === 'upcoming' ? '即将开始' : '已结束'}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium text-blue-900">考试时长</p>
                      <p className="text-blue-700">{exam.duration} 分钟</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-green-50 rounded-lg">
                    <Timer className="h-5 w-5 text-green-600 mr-3" />
                    <div>
                      <p className="font-medium text-green-900">开始时间</p>
                      <p className="text-green-700">{examDate.toLocaleString('zh-CN')}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 考试说明 */}
            <Card className="animate-slide-in-from-left hover:shadow-lg transition-shadow" style={{ animationDelay: '200ms' }}>
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-green-600" />
                  考试规则与说明
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                      <Zap className="h-4 w-4 mr-2" />
                      基本规则
                    </h3>
                    <ul className="text-blue-800 space-y-2 text-sm">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-blue-600" />
                        考试时间为 {exam.duration} 分钟，请合理安排答题时间
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-blue-600" />
                        考试开始后不能暂停，请确保网络连接稳定
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-blue-600" />
                        请在安静的环境中独立完成考试
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-blue-600" />
                        考试结束后会自动提交，请及时保存答案
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-5 rounded-xl border border-amber-200">
                    <h3 className="font-semibold text-amber-900 mb-3 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      注意事项
                    </h3>
                    <ul className="text-amber-800 space-y-2 text-sm">
                      <li className="flex items-start">
                        <Monitor className="h-4 w-4 mr-2 mt-0.5 text-amber-600" />
                        考试过程中请勿刷新页面或关闭浏览器
                      </li>
                      <li className="flex items-start">
                        <Play className="h-4 w-4 mr-2 mt-0.5 text-amber-600" />
                        答题完成后请务必点击"提交考试"按钮
                      </li>
                      <li className="flex items-start">
                        <Timer className="h-4 w-4 mr-2 mt-0.5 text-amber-600" />
                        考试时间到后系统会自动提交答卷
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 操作面板 */}
          <div className="space-y-6">
            <Card className="animate-slide-in-from-right sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Play className="h-5 w-5 mr-2 text-green-600" />
                  考试操作
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  {exam.status === 'upcoming' && canStart && (
                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                        <div className="flex items-center justify-center text-green-700 mb-2">
                          <CheckCircle className="h-6 w-6 mr-2" />
                          <span className="font-medium">准备就绪</span>
                        </div>
                        <p className="text-sm text-green-600">所有条件已满足，可以开始考试</p>
                      </div>
                      <Button 
                        onClick={handleStartExam}
                        disabled={isStarting}
                        className="w-full h-12 text-lg font-medium bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200"
                        size="lg"
                      >
                        {isStarting ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            正在进入考场...
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Play className="h-5 w-5 mr-2" />
                            开始考试
                          </div>
                        )}
                      </Button>
                    </div>
                  )}

                  {exam.status === 'upcoming' && !canStart && (
                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200">
                        <div className="flex items-center justify-center text-yellow-700 mb-2">
                          <Clock className="h-6 w-6 mr-2" />
                          <span className="font-medium">等待开始</span>
                        </div>
                        <p className="text-sm text-yellow-600">
                          考试将于 {examDate.toLocaleString('zh-CN')} 开始
                        </p>
                      </div>
                      <Button disabled className="w-full h-12 text-lg" size="lg">
                        <Timer className="h-5 w-5 mr-2" />
                        等待考试开始
                      </Button>
                    </div>
                  )}

                  {exam.status === 'ongoing' && (
                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                        <div className="flex items-center justify-center text-green-700 mb-2">
                          <Play className="h-6 w-6 mr-2" />
                          <span className="font-medium">考试进行中</span>
                        </div>
                        <p className="text-sm text-green-600">考试正在进行，可以继续参加</p>
                      </div>
                      <Button 
                        onClick={handleStartExam}
                        disabled={isStarting}
                        className="w-full h-12 text-lg font-medium bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200"
                        size="lg"
                      >
                        {isStarting ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            正在进入考场...
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Play className="h-5 w-5 mr-2" />
                            继续考试
                          </div>
                        )}
                      </Button>
                    </div>
                  )}

                  {exam.status === 'completed' && (
                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-center text-gray-700 mb-2">
                          <CheckCircle className="h-6 w-6 mr-2" />
                          <span className="font-medium">考试已结束</span>
                        </div>
                        <p className="text-sm text-gray-600">可以查看考试成绩和详细解析</p>
                      </div>
                      <Link to="/exam/$examId/result/$resultId" params={{ examId, resultId: `result-${examId}` }}>
                        <Button variant="outline" className="w-full h-12 text-lg" size="lg">
                          <Award className="h-5 w-5 mr-2" />
                          查看成绩
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-blue-600" />
                    {exam.status === 'completed' ? '考试统计' : '考试信息'}
                  </h4>
                  <div className="space-y-3">
                    {exam.status === 'completed' ? (
                      <>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600">参考人数</span>
                          <Badge variant="secondary">125人</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600">平均分</span>
                          <Badge variant="secondary">82.5分</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600">及格率</span>
                          <Badge variant="default" className="bg-green-100 text-green-800">85.6%</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600">最高分</span>
                          <Badge variant="default" className="bg-yellow-100 text-yellow-800">98分</Badge>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600">报名人数</span>
                          <Badge variant="secondary">150人</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600">题目数量</span>
                          <Badge variant="secondary">25题</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600">总分</span>
                          <Badge variant="secondary">100分</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600">考试性质</span>
                          <Badge variant="default" className="bg-blue-100 text-blue-800">正式考试</Badge>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
