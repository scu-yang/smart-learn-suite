import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { 
  Database,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Archive,
  HardDrive,
  Server,
  FileText,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  Search,
  Filter,
  MoreVertical,
  Copy,
  Edit,
  Eye
} from 'lucide-react';

interface DatabaseInfo {
  name: string;
  type: 'mysql' | 'postgresql' | 'mongodb';
  size: string;
  tables: number;
  records: number;
  lastBackup: string;
  status: 'healthy' | 'warning' | 'error';
}

interface BackupRecord {
  id: string;
  name: string;
  size: string;
  type: 'full' | 'incremental' | 'differential';
  createdAt: string;
  status: 'completed' | 'failed' | 'in-progress';
  description?: string;
}

const mockDatabases: DatabaseInfo[] = [
  {
    name: '用户数据库',
    type: 'mysql',
    size: '2.5 GB',
    tables: 15,
    records: 125000,
    lastBackup: '2025-01-20 02:00',
    status: 'healthy'
  },
  {
    name: '课程数据库',
    type: 'postgresql',
    size: '8.3 GB',
    tables: 28,
    records: 580000,
    lastBackup: '2025-01-20 02:30',
    status: 'healthy'
  },
  {
    name: '文件存储数据库',
    type: 'mongodb',
    size: '45.2 GB',
    tables: 12,
    records: 890000,
    lastBackup: '2025-01-19 02:00',
    status: 'warning'
  }
];

const mockBackups: BackupRecord[] = [
  {
    id: 'b1',
    name: '系统完整备份_20250120',
    size: '56.0 GB',
    type: 'full',
    createdAt: '2025-01-20 02:00',
    status: 'completed',
    description: '定时全量备份'
  },
  {
    id: 'b2',
    name: '增量备份_20250119',
    size: '1.2 GB',
    type: 'incremental',
    createdAt: '2025-01-19 14:00',
    status: 'completed',
    description: '每日增量备份'
  },
  {
    id: 'b3',
    name: '系统完整备份_20250118',
    size: '55.8 GB',
    type: 'full',
    createdAt: '2025-01-18 02:00',
    status: 'completed'
  },
  {
    id: 'b4',
    name: '手动备份_考试数据',
    size: '3.4 GB',
    type: 'differential',
    createdAt: '2025-01-17 16:30',
    status: 'completed',
    description: '考试期间手动备份'
  }
];

export function DataManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | BackupRecord['type']>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | BackupRecord['status']>('all');

  const filteredBackups = mockBackups.filter(backup => {
    const matchesSearch = backup.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || backup.type === filterType;
    const matchesStatus = filterStatus === 'all' || backup.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusIcon = (status: DatabaseInfo['status'] | BackupRecord['status']) => {
    switch (status) {
      case 'healthy':
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-chart-1" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-chart-4" />;
      case 'error':
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'in-progress':
        return <RefreshCw className="w-4 h-4 text-chart-2 animate-spin" />;
    }
  };

  const getStatusText = (status: DatabaseInfo['status'] | BackupRecord['status']) => {
    switch (status) {
      case 'healthy': return '正常';
      case 'warning': return '警告';
      case 'error': return '错误';
      case 'completed': return '已完成';
      case 'failed': return '失败';
      case 'in-progress': return '进行中';
    }
  };

  const getTypeText = (type: BackupRecord['type']) => {
    switch (type) {
      case 'full': return '完整备份';
      case 'incremental': return '增量备份';
      case 'differential': return '差异备份';
    }
  };

  const getTypeColor = (type: BackupRecord['type']) => {
    switch (type) {
      case 'full': return 'default';
      case 'incremental': return 'secondary';
      case 'differential': return 'outline';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1>数据管理</h1>
          <p className="text-muted-foreground">数据库管理、备份恢复和数据分析</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            数据分析
          </Button>
          <Button variant="outline" className="gap-2">
            <Archive className="w-4 h-4" />
            手动备份
          </Button>
          <Button className="gap-2">
            <Download className="w-4 h-4" />
            导出数据
          </Button>
        </div>
      </div>

      {/* Storage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-1">56.0 GB</div>
            <p className="text-sm text-muted-foreground">总数据量</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-2">1,595,000</div>
            <p className="text-sm text-muted-foreground">总记录数</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-3">55</div>
            <p className="text-sm text-muted-foreground">数据表数</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-4">
              {mockBackups.filter(b => b.status === 'completed').length}
            </div>
            <p className="text-sm text-muted-foreground">备份数量</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="databases" className="space-y-4">
        <TabsList>
          <TabsTrigger value="databases">数据库状态</TabsTrigger>
          <TabsTrigger value="backups">备份管理</TabsTrigger>
          <TabsTrigger value="migration">数据迁移</TabsTrigger>
          <TabsTrigger value="analytics">数据分析</TabsTrigger>
        </TabsList>

        <TabsContent value="databases" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                数据库状态
              </CardTitle>
              <CardDescription>查看数据库运行状态和基本信息</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDatabases.map((db, index) => (
                  <Card key={index} className="hover:shadow-sm transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-chart-1/10 rounded-lg flex items-center justify-center">
                            <Database className="w-6 h-6 text-chart-1" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{db.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                {db.type.toUpperCase()}
                              </Badge>
                              {getStatusIcon(db.status)}
                              <Badge variant={db.status === 'healthy' ? 'default' : db.status === 'warning' ? 'outline' : 'destructive'} className="text-xs">
                                {getStatusText(db.status)}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-4 gap-4 text-sm text-muted-foreground">
                              <div>
                                <span className="font-medium">大小：</span>
                                {db.size}
                              </div>
                              <div>
                                <span className="font-medium">表数：</span>
                                {db.tables}
                              </div>
                              <div>
                                <span className="font-medium">记录数：</span>
                                {db.records.toLocaleString()}
                              </div>
                              <div>
                                <span className="font-medium">最后备份：</span>
                                {new Date(db.lastBackup).toLocaleDateString('zh-CN')}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="gap-1">
                            <Eye className="w-3 h-3" />
                            查看
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Archive className="w-3 h-3" />
                            备份
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="w-8 h-8">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                刷新状态
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                编辑配置
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="w-4 h-4 mr-2" />
                                复制连接
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" />
                                清理数据
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backups" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Archive className="w-5 h-5" />
                    备份管理
                  </CardTitle>
                  <CardDescription>管理系统备份和恢复</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="搜索备份..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="备份类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部类型</SelectItem>
                      <SelectItem value="full">完整备份</SelectItem>
                      <SelectItem value="incremental">增量备份</SelectItem>
                      <SelectItem value="differential">差异备份</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="gap-2">
                    <Archive className="w-4 h-4" />
                    新建备份
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredBackups.map((backup) => (
                  <Card key={backup.id} className="hover:shadow-sm transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-chart-2/10 rounded-lg flex items-center justify-center">
                            <Archive className="w-5 h-5 text-chart-2" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{backup.name}</h4>
                              <Badge variant={getTypeColor(backup.type)} className="text-xs">
                                {getTypeText(backup.type)}
                              </Badge>
                              {getStatusIcon(backup.status)}
                              <Badge 
                                variant={backup.status === 'completed' ? 'default' : 
                                        backup.status === 'failed' ? 'destructive' : 'secondary'} 
                                className="text-xs"
                              >
                                {getStatusText(backup.status)}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <HardDrive className="w-3 h-3" />
                                <span>{backup.size}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{new Date(backup.createdAt).toLocaleString('zh-CN')}</span>
                              </div>
                              {backup.description && (
                                <span>{backup.description}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="gap-1">
                            <Download className="w-3 h-3" />
                            下载
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Upload className="w-3 h-3" />
                            恢复
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="w-8 h-8">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                查看详情
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="w-4 h-4 mr-2" />
                                复制备份
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" />
                                删除备份
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="migration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                数据迁移
              </CardTitle>
              <CardDescription>数据导入导出和系统迁移</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Server className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>数据迁移功能开发中...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                数据分析
              </CardTitle>
              <CardDescription>数据使用情况和趋势分析</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>数据分析功能开发中...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}