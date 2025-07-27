import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnimatedStatCard } from '@/components/animated-stat-card';
import { useAuth } from '@/hooks/useAuth';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  FileText, 
  Building2,
  Activity,
  Server,
  Database,
  HardDrive,
  MemoryStick,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  BarChart3,
  Settings,
  Bell,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Plus,
  MoreHorizontal,
  ArrowUpRight
} from 'lucide-react';
import type { AdminDashboard } from '@/types';

export function AdminDashboardPage() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟获取管理员仪表板数据
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockData: AdminDashboard = {
          overview: {
            totalStudents: 1250,
            totalTeachers: 85,
            totalCourses: 120,
            totalExams: 45,
            activeClasses: 32
          },
          recentActivities: [
            {
              type: 'exam_created',
              description: '张教师创建了《数据结构》期末考试',
              timestamp: '2025-07-20T10:30:00Z',
              userId: 'teacher_001',
              userName: '张教师'
            },
            {
              type: 'student_enrolled',
              description: '新增学生李明注册了系统',
              timestamp: '2025-07-20T09:15:00Z',
              userId: 'student_001',
              userName: '李明'
            },
            {
              type: 'notification_sent',
              description: '向计算机学院发送了考试通知',
              timestamp: '2025-07-20T08:45:00Z',
              userId: 'admin_001',
              userName: '管理员'
            }
          ],
          examStatistics: {
            scheduledExams: 12,
            ongoingExams: 3,
            completedExams: 30,
            averageScore: 82.5
          },
          systemHealth: {
            serverStatus: 'healthy',
            databaseStatus: 'healthy',
            lastBackup: '2025-07-20T02:00:00Z',
            diskUsage: 65,
            memoryUsage: 72
          }
        };
        
        setDashboardData(mockData);
      } catch (error) {
        console.error('获取仪表板数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 flex items-center justify-center">
        <Card className="p-8 text-center shadow-xl border-0 bg-white/80 backdrop-blur-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">访问被拒绝</h2>
          <p className="text-gray-600">您没有权限访问管理员页面</p>
        </Card>
      </div>
    );
  }

  if (loading || !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-lg text-gray-700">加载中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse" style={{animationDelay: '0s'}}></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-indigo-200/20 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-3/4 w-72 h-72 bg-purple-200/20 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>



      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <AnimatedStatCard
            icon={Users}
            title="学生总数"
            value={dashboardData.overview.totalStudents}
            subtitle="人"
            trend={{ value: 12, isPositive: true }}
            color="blue"
            delay={0}
          />
          <AnimatedStatCard
            icon={GraduationCap}
            title="教师总数"
            value={dashboardData.overview.totalTeachers}
            subtitle="人"
            trend={{ value: 5, isPositive: true }}
            color="green"
            delay={100}
          />
          <AnimatedStatCard
            icon={BookOpen}
            title="课程总数"
            value={dashboardData.overview.totalCourses}
            subtitle="门"
            trend={{ value: 8, isPositive: true }}
            color="purple"
            delay={200}
          />
          <AnimatedStatCard
            icon={FileText}
            title="考试总数"
            value={dashboardData.overview.totalExams}
            subtitle="场"
            trend={{ value: 15, isPositive: true }}
            color="yellow"
            delay={300}
          />
          <AnimatedStatCard
            icon={Building2}
            title="活跃班级"
            value={dashboardData.overview.activeClasses}
            subtitle="个"
            trend={{ value: 3, isPositive: true }}
            color="red"
            delay={400}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Exam Statistics */}
          <Card className="lg:col-span-1 border-0 shadow-xl bg-white/80 backdrop-blur-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                  考试统计
                </CardTitle>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-900">已安排</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-blue-600">{dashboardData.examStatistics.scheduledExams}</span>
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Activity className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="font-medium text-gray-900">进行中</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-green-600">{dashboardData.examStatistics.ongoingExams}</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-gray-600" />
                  </div>
                  <span className="font-medium text-gray-900">已完成</span>
                </div>
                <span className="text-xl font-bold text-gray-600">{dashboardData.examStatistics.completedExams}</span>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">平均分数</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-purple-600">{dashboardData.examStatistics.averageScore}</span>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">+2.3%</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card className="lg:col-span-1 border-0 shadow-xl bg-white/80 backdrop-blur-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Server className="h-5 w-5 mr-2 text-green-600" />
                  系统监控
                </CardTitle>
                <Badge 
                  variant="secondary" 
                  className={`${
                    dashboardData.systemHealth.serverStatus === 'healthy' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {dashboardData.systemHealth.serverStatus === 'healthy' ? '正常运行' : '异常'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Server className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-gray-900">服务器状态</span>
                </div>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Database className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-gray-900">数据库状态</span>
                </div>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <HardDrive className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-600">磁盘使用率</span>
                  </div>
                  <span className="text-sm font-medium">{dashboardData.systemHealth.diskUsage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${dashboardData.systemHealth.diskUsage}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MemoryStick className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-600">内存使用率</span>
                  </div>
                  <span className="text-sm font-medium">{dashboardData.systemHealth.memoryUsage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${dashboardData.systemHealth.memoryUsage}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="border-t pt-3 mt-4">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>最后备份</span>
                  <span>{new Date(dashboardData.systemHealth.lastBackup).toLocaleDateString('zh-CN')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="lg:col-span-1 border-0 shadow-xl bg-white/80 backdrop-blur-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center">
                <Settings className="h-5 w-5 mr-2 text-purple-600" />
                快速操作
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-200"
              >
                <Users className="h-4 w-4 mr-3" />
                用户管理
                <ArrowUpRight className="h-4 w-4 ml-auto" />
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-all duration-200"
              >
                <BookOpen className="h-4 w-4 mr-3" />
                课程管理
                <ArrowUpRight className="h-4 w-4 ml-auto" />
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200 transition-all duration-200"
              >
                <FileText className="h-4 w-4 mr-3" />
                考试管理
                <ArrowUpRight className="h-4 w-4 ml-auto" />
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start hover:bg-yellow-50 hover:text-yellow-600 hover:border-yellow-200 transition-all duration-200"
              >
                <Bell className="h-4 w-4 mr-3" />
                通知管理
                <ArrowUpRight className="h-4 w-4 ml-auto" />
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200"
              >
                <BarChart3 className="h-4 w-4 mr-3" />
                数据分析
                <ArrowUpRight className="h-4 w-4 ml-auto" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center">
                <Activity className="h-5 w-5 mr-2 text-blue-600" />
                最近活动
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  查看全部
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentActivities.map((activity, index) => (
                <div 
                  key={index} 
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg ${
                    activity.type === 'exam_created' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                    activity.type === 'student_enrolled' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                    'bg-gradient-to-r from-purple-500 to-purple-600'
                  }`}>
                    {activity.type === 'exam_created' ? <FileText className="h-5 w-5" /> :
                     activity.type === 'student_enrolled' ? <Users className="h-5 w-5" /> : 
                     <Bell className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {activity.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-1">
                      <p className="text-sm text-gray-500">
                        {new Date(activity.timestamp).toLocaleString('zh-CN')}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {activity.userName}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
