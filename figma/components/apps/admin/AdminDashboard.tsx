import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { 
  Users, 
  BookOpen, 
  Activity, 
  Database,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

export function AdminDashboard() {
  const systemStats = [
    {
      title: '总用户数',
      value: '1,245',
      change: '+12',
      description: '活跃用户：1,180',
      icon: Users,
      color: 'text-chart-1',
      bgColor: 'bg-chart-1/10'
    },
    {
      title: '总课程数',
      value: '68',
      change: '+3',
      description: '进行中：45',
      icon: BookOpen,
      color: 'text-chart-2',
      bgColor: 'bg-chart-2/10'
    },
    {
      title: '系统负载',
      value: '23%',
      change: '-5%',
      description: 'CPU使用率',
      icon: Activity,
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/10'
    },
    {
      title: '存储使用',
      value: '2.1TB',
      change: '+0.2TB',
      description: '总容量：10TB',
      icon: Database,
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/10'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'user_register',
      message: '5位新用户注册',
      time: '10分钟前',
      status: 'info'
    },
    {
      id: 2,
      type: 'system_backup',
      message: '系统备份已完成',
      time: '2小时前',
      status: 'success'
    },
    {
      id: 3,
      type: 'alert',
      message: 'API响应时间异常',
      time: '3小时前',
      status: 'warning'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1>系统概览</h1>
        <p className="text-muted-foreground">智慧教学系统管理控制台</p>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {systemStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{stat.value}</span>
                    <Badge variant="secondary" className="text-xs">
                      {stat.change}
                    </Badge>
                  </div>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* System Status and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>系统状态</CardTitle>
            <CardDescription>各组件运行状况</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: 'Web服务器', status: 'healthy', uptime: '99.9%' },
              { name: '数据库', status: 'healthy', uptime: '100%' },
              { name: 'AI服务', status: 'warning', uptime: '95.2%' },
              { name: '文件存储', status: 'healthy', uptime: '99.8%' }
            ].map((service) => (
              <div key={service.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {service.status === 'healthy' ? (
                    <CheckCircle className="w-4 h-4 text-chart-2" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-chart-4" />
                  )}
                  <span className="font-medium">{service.name}</span>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={service.status === 'healthy' ? 'secondary' : 'outline'}
                    className="mb-1"
                  >
                    {service.status === 'healthy' ? '正常' : '警告'}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    运行时间: {service.uptime}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>近期活动</CardTitle>
            <CardDescription>系统操作日志</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="flex-shrink-0 mt-1">
                  {activity.status === 'success' && <CheckCircle className="w-4 h-4 text-chart-2" />}
                  {activity.status === 'warning' && <AlertCircle className="w-4 h-4 text-chart-4" />}
                  {activity.status === 'info' && <Clock className="w-4 h-4 text-chart-1" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}