import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  Activity,
  Server,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Download,
  Settings,
  Zap,
  Users,
  FileText,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Monitor
} from 'lucide-react';

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
}

interface Service {
  name: string;
  status: 'running' | 'stopped' | 'error';
  uptime: string;
  memory: number;
  cpu: number;
  description: string;
}

const systemMetrics: SystemMetric[] = [
  {
    name: 'CPU 使用率',
    value: 45,
    unit: '%',
    status: 'normal',
    trend: 'stable',
    icon: <Cpu className="w-5 h-5" />
  },
  {
    name: '内存使用率',
    value: 78,
    unit: '%',
    status: 'warning',
    trend: 'up',
    icon: <Server className="w-5 h-5" />
  },
  {
    name: '磁盘使用率',
    value: 92,
    unit: '%',
    status: 'critical',
    trend: 'up',
    icon: <HardDrive className="w-5 h-5" />
  },
  {
    name: '网络延迟',
    value: 23,
    unit: 'ms',
    status: 'normal',
    trend: 'down',
    icon: <Wifi className="w-5 h-5" />
  }
];

const services: Service[] = [
  {
    name: '用户认证服务',
    status: 'running',
    uptime: '15天 8小时',
    memory: 512,
    cpu: 12,
    description: '处理用户登录和权限验证'
  },
  {
    name: '数据库服务',
    status: 'running',
    uptime: '30天 12小时',
    memory: 2048,
    cpu: 25,
    description: '主数据库服务器'
  },
  {
    name: '文件存储服务',
    status: 'running',
    uptime: '45天 6小时',
    memory: 256,
    cpu: 5,
    description: '处理文件上传和下载'
  },
  {
    name: 'AI批改服务',
    status: 'error',
    uptime: '0天 0小时',
    memory: 0,
    cpu: 0,
    description: 'AI自动批改功能'
  },
  {
    name: '通知推送服务',
    status: 'running',
    uptime: '7天 18小时',
    memory: 128,
    cpu: 3,
    description: '消息和通知推送'
  },
  {
    name: '数据分析服务',
    status: 'stopped',
    uptime: '0天 0小时',
    memory: 0,
    cpu: 0,
    description: '学习数据分析和报告生成'
  }
];

const systemLogs = [
  {
    id: 1,
    timestamp: '2025-01-20 14:30:15',
    level: 'error',
    service: 'AI批改服务',
    message: '连接超时: 无法连接到AI推理服务器',
    details: 'Connection timeout after 30s'
  },
  {
    id: 2,
    timestamp: '2025-01-20 14:25:33',
    level: 'warning',
    service: '数据库服务',
    message: '慢查询检测: 查询执行时间超过5秒',
    details: 'SELECT * FROM submissions WHERE...'
  },
  {
    id: 3,
    timestamp: '2025-01-20 14:20:02',
    level: 'info',
    service: '用户认证服务',
    message: '用户登录: teacher@university.edu',
    details: 'Login successful'
  },
  {
    id: 4,
    timestamp: '2025-01-20 14:15:44',
    level: 'warning',
    service: '文件存储服务',
    message: '磁盘空间不足: 可用空间低于10%',
    details: 'Available space: 8.2%'
  },
  {
    id: 5,
    timestamp: '2025-01-20 14:10:12',
    level: 'info',
    service: '数据分析服务',
    message: '服务停止: 手动停止数据分析服务',
    details: 'Service stopped by admin'
  }
];

export function SystemMonitor() {
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const getMetricStatusColor = (status: SystemMetric['status']) => {
    switch (status) {
      case 'normal': return 'text-chart-1';
      case 'warning': return 'text-chart-4';
      case 'critical': return 'text-destructive';
    }
  };

  const getMetricStatusBg = (status: SystemMetric['status']) => {
    switch (status) {
      case 'normal': return 'bg-chart-1/10';
      case 'warning': return 'bg-chart-4/10';
      case 'critical': return 'bg-destructive/10';
    }
  };

  const getTrendIcon = (trend: SystemMetric['trend']) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-chart-4" />;
      case 'down': return <TrendingDown className="w-3 h-3 text-chart-1" />;
      case 'stable': return <Activity className="w-3 h-3 text-muted-foreground" />;
    }
  };

  const getServiceStatusIcon = (status: Service['status']) => {
    switch (status) {
      case 'running': return <CheckCircle className="w-4 h-4 text-chart-1" />;
      case 'stopped': return <Clock className="w-4 h-4 text-muted-foreground" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-destructive" />;
    }
  };

  const getServiceStatusText = (status: Service['status']) => {
    switch (status) {
      case 'running': return '运行中';
      case 'stopped': return '已停止';
      case 'error': return '错误';
    }
  };

  const getServiceStatusColor = (status: Service['status']) => {
    switch (status) {
      case 'running': return 'default';
      case 'stopped': return 'secondary';
      case 'error': return 'destructive';
    }
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-destructive';
      case 'warning': return 'text-chart-4';
      case 'info': return 'text-chart-2';
      default: return 'text-muted-foreground';
    }
  };

  const getLogLevelBg = (level: string) => {
    switch (level) {
      case 'error': return 'bg-destructive/10';
      case 'warning': return 'bg-chart-4/10';
      case 'info': return 'bg-chart-2/10';
      default: return 'bg-muted/10';
    }
  };

  const handleRefresh = () => {
    setLastUpdate(new Date());
    // 这里可以添加实际的数据刷新逻辑
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1>系统监控</h1>
          <p className="text-muted-foreground">实时监控系统状态和性能</p>
        </div>
        <div className="flex gap-2">
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Clock className="w-4 h-4" />
            最后更新: {lastUpdate.toLocaleTimeString('zh-CN')}
          </div>
          <Button variant="outline" onClick={handleRefresh} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            刷新
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            导出报告
          </Button>
          <Button className="gap-2">
            <Settings className="w-4 h-4" />
            系统设置
          </Button>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {systemMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 ${getMetricStatusBg(metric.status)} rounded-lg flex items-center justify-center`}>
                  <span className={getMetricStatusColor(metric.status)}>
                    {metric.icon}
                  </span>
                </div>
                {getTrendIcon(metric.trend)}
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{metric.name}</p>
                <div className="flex items-baseline gap-1">
                  <span className={`text-2xl font-bold ${getMetricStatusColor(metric.status)}`}>
                    {metric.value}
                  </span>
                  <span className="text-sm text-muted-foreground">{metric.unit}</span>
                </div>
                <Progress 
                  value={metric.value} 
                  className={`h-2 ${metric.status === 'critical' ? '[&>div]:bg-destructive' : 
                             metric.status === 'warning' ? '[&>div]:bg-chart-4' : ''}`}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-1">
              {services.filter(s => s.status === 'running').length}
            </div>
            <p className="text-sm text-muted-foreground">运行中服务</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive">
              {services.filter(s => s.status === 'error').length}
            </div>
            <p className="text-sm text-muted-foreground">异常服务</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-2">
              {systemLogs.filter(log => log.level === 'error').length}
            </div>
            <p className="text-sm text-muted-foreground">今日错误</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-3">99.5%</div>
            <p className="text-sm text-muted-foreground">系统可用率</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="services" className="space-y-4">
        <TabsList>
          <TabsTrigger value="services">服务状态</TabsTrigger>
          <TabsTrigger value="logs">系统日志</TabsTrigger>
          <TabsTrigger value="performance">性能分析</TabsTrigger>
          <TabsTrigger value="alerts">告警设置</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                系统服务
              </CardTitle>
              <CardDescription>查看和管理系统服务状态</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {services.map((service, index) => (
                  <Card key={index} className="hover:shadow-sm transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getServiceStatusIcon(service.status)}
                          <div>
                            <h4 className="font-medium">{service.name}</h4>
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">运行时间</p>
                            <p className="text-sm font-medium">{service.uptime}</p>
                          </div>
                          
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">内存</p>
                            <p className="text-sm font-medium">{service.memory}MB</p>
                          </div>
                          
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">CPU</p>
                            <p className="text-sm font-medium">{service.cpu}%</p>
                          </div>

                          <Badge variant={getServiceStatusColor(service.status)}>
                            {getServiceStatusText(service.status)}
                          </Badge>

                          <div className="flex gap-1">
                            {service.status === 'stopped' || service.status === 'error' ? (
                              <Button size="sm" variant="outline">
                                启动
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline">
                                重启
                              </Button>
                            )}
                            <Button size="sm" variant="ghost">
                              详情
                            </Button>
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

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                系统日志
              </CardTitle>
              <CardDescription>查看系统运行日志和错误信息</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemLogs.map((log) => (
                  <div key={log.id} className={`p-3 rounded-lg border-l-4 ${getLogLevelBg(log.level)}`}>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`text-xs ${getLogLevelColor(log.level)}`}>
                            {log.level.toUpperCase()}
                          </Badge>
                          <span className="text-sm font-medium">{log.service}</span>
                          <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                        </div>
                        <p className="text-sm">{log.message}</p>
                        {log.details && (
                          <p className="text-xs text-muted-foreground font-mono bg-muted/50 p-2 rounded">
                            {log.details}
                          </p>
                        )}
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
                <BarChart3 className="w-5 h-5" />
                性能分析
              </CardTitle>
              <CardDescription>系统性能趋势和分析报告</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Monitor className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>性能分析图表开发中...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                告警设置
              </CardTitle>
              <CardDescription>配置系统监控告警规则</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>告警设置功能开发中...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}