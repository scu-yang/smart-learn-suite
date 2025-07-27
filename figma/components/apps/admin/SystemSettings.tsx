import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Switch } from '../../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Slider } from '../../ui/slider';
import { 
  Settings,
  Database,
  Mail,
  Bell,
  Shield,
  Palette,
  Globe,
  Cloud,
  HardDrive,
  Cpu,
  Wifi,
  Save,
  RefreshCw,
  Download,
  Upload,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface SystemConfig {
  general: {
    siteName: string;
    siteDescription: string;
    language: string;
    timezone: string;
    dateFormat: string;
    maintenanceMode: boolean;
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    smtpSSL: boolean;
    fromEmail: string;
    fromName: string;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    digestFrequency: string;
  };
  security: {
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordMinLength: number;
    requireTwoFactor: boolean;
    allowRegistration: boolean;
  };
  performance: {
    cacheEnabled: boolean;
    cacheTTL: number;
    compressionEnabled: boolean;
    maxFileSize: number;
    maxUploadSize: number;
  };
  backup: {
    autoBackup: boolean;
    backupFrequency: string;
    retentionDays: number;
    backupLocation: string;
  };
}

const defaultConfig: SystemConfig = {
  general: {
    siteName: '智慧教学系统',
    siteDescription: '基于AI的数学教育平台',
    language: 'zh-CN',
    timezone: 'Asia/Shanghai',
    dateFormat: 'YYYY-MM-DD',
    maintenanceMode: false
  },
  email: {
    smtpHost: 'smtp.university.edu',
    smtpPort: 587,
    smtpUser: 'system@university.edu',
    smtpPassword: '••••••••',
    smtpSSL: true,
    fromEmail: 'noreply@university.edu',
    fromName: '智慧教学系统'
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    digestFrequency: 'daily'
  },
  security: {
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireTwoFactor: false,
    allowRegistration: true
  },
  performance: {
    cacheEnabled: true,
    cacheTTL: 3600,
    compressionEnabled: true,
    maxFileSize: 10,
    maxUploadSize: 100
  },
  backup: {
    autoBackup: true,
    backupFrequency: 'daily',
    retentionDays: 30,
    backupLocation: '/backup/system'
  }
};

export function SystemSettings() {
  const [config, setConfig] = useState<SystemConfig>(defaultConfig);
  const [showPassword, setShowPassword] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const updateConfig = (section: keyof SystemConfig, key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // 这里实现保存逻辑
    console.log('Saving config:', config);
    setHasChanges(false);
  };

  const handleReset = () => {
    setConfig(defaultConfig);
    setHasChanges(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1>系统设置</h1>
          <p className="text-muted-foreground">配置系统参数和功能选项</p>
        </div>
        <div className="flex gap-2">
          {hasChanges && (
            <Badge variant="outline" className="text-chart-4">
              有未保存的更改
            </Badge>
          )}
          <Button variant="outline" onClick={handleReset} disabled={!hasChanges}>
            <RefreshCw className="w-4 h-4 mr-2" />
            重置
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges} className="gap-2">
            <Save className="w-4 h-4" />
            保存设置
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="general">常规设置</TabsTrigger>
          <TabsTrigger value="email">邮件配置</TabsTrigger>
          <TabsTrigger value="notifications">通知设置</TabsTrigger>
          <TabsTrigger value="security">安全配置</TabsTrigger>
          <TabsTrigger value="performance">性能优化</TabsTrigger>
          <TabsTrigger value="backup">备份设置</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                常规设置
              </CardTitle>
              <CardDescription>基本系统配置和显示选项</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">站点名称</label>
                    <Input
                      value={config.general.siteName}
                      onChange={(e) => updateConfig('general', 'siteName', e.target.value)}
                      placeholder="输入站点名称"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">站点描述</label>
                    <Textarea
                      value={config.general.siteDescription}
                      onChange={(e) => updateConfig('general', 'siteDescription', e.target.value)}
                      placeholder="输入站点描述"
                      className="min-h-20"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">语言</label>
                    <Select
                      value={config.general.language}
                      onValueChange={(value) => updateConfig('general', 'language', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="zh-CN">简体中文</SelectItem>
                        <SelectItem value="zh-TW">繁体中文</SelectItem>
                        <SelectItem value="en-US">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">时区</label>
                    <Select
                      value={config.general.timezone}
                      onValueChange={(value) => updateConfig('general', 'timezone', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Shanghai">北京时间 (UTC+8)</SelectItem>
                        <SelectItem value="Asia/Tokyo">东京时间 (UTC+9)</SelectItem>
                        <SelectItem value="America/New_York">纽约时间 (UTC-5)</SelectItem>
                        <SelectItem value="Europe/London">伦敦时间 (UTC+0)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">日期格式</label>
                    <Select
                      value={config.general.dateFormat}
                      onValueChange={(value) => updateConfig('general', 'dateFormat', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="YYYY-MM-DD">2025-01-20</SelectItem>
                        <SelectItem value="DD/MM/YYYY">20/01/2025</SelectItem>
                        <SelectItem value="MM/DD/YYYY">01/20/2025</SelectItem>
                        <SelectItem value="DD-MM-YYYY">20-01-2025</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">维护模式</h4>
                      <p className="text-sm text-muted-foreground">启用后用户无法访问系统</p>
                    </div>
                    <Switch
                      checked={config.general.maintenanceMode}
                      onCheckedChange={(checked) => updateConfig('general', 'maintenanceMode', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                邮件配置
              </CardTitle>
              <CardDescription>SMTP服务器和邮件发送设置</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">SMTP 服务器</label>
                    <Input
                      value={config.email.smtpHost}
                      onChange={(e) => updateConfig('email', 'smtpHost', e.target.value)}
                      placeholder="smtp.example.com"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">端口</label>
                    <Input
                      type="number"
                      value={config.email.smtpPort}
                      onChange={(e) => updateConfig('email', 'smtpPort', parseInt(e.target.value))}
                      placeholder="587"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">用户名</label>
                    <Input
                      value={config.email.smtpUser}
                      onChange={(e) => updateConfig('email', 'smtpUser', e.target.value)}
                      placeholder="username@example.com"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">密码</label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={config.email.smtpPassword}
                        onChange={(e) => updateConfig('email', 'smtpPassword', e.target.value)}
                        placeholder="••••••••"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full w-10"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">发件人邮箱</label>
                    <Input
                      value={config.email.fromEmail}
                      onChange={(e) => updateConfig('email', 'fromEmail', e.target.value)}
                      placeholder="noreply@example.com"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">发件人名称</label>
                    <Input
                      value={config.email.fromName}
                      onChange={(e) => updateConfig('email', 'fromName', e.target.value)}
                      placeholder="系统名称"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">启用 SSL/TLS</h4>
                      <p className="text-sm text-muted-foreground">安全连接到SMTP服务器</p>
                    </div>
                    <Switch
                      checked={config.email.smtpSSL}
                      onCheckedChange={(checked) => updateConfig('email', 'smtpSSL', checked)}
                    />
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-chart-1" />
                      <h4 className="font-medium">连接测试</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      发送测试邮件验证配置是否正确
                    </p>
                    <Button variant="outline" size="sm">
                      发送测试邮件
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                通知设置
              </CardTitle>
              <CardDescription>配置系统通知方式和频率</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">邮件通知</h4>
                      <p className="text-sm text-muted-foreground">通过邮件发送重要通知</p>
                    </div>
                    <Switch
                      checked={config.notifications.emailNotifications}
                      onCheckedChange={(checked) => updateConfig('notifications', 'emailNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">短信通知</h4>
                      <p className="text-sm text-muted-foreground">通过短信发送紧急通知</p>
                    </div>
                    <Switch
                      checked={config.notifications.smsNotifications}
                      onCheckedChange={(checked) => updateConfig('notifications', 'smsNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">推送通知</h4>
                      <p className="text-sm text-muted-foreground">浏览器推送通知</p>
                    </div>
                    <Switch
                      checked={config.notifications.pushNotifications}
                      onCheckedChange={(checked) => updateConfig('notifications', 'pushNotifications', checked)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">摘要频率</label>
                    <Select
                      value={config.notifications.digestFrequency}
                      onValueChange={(value) => updateConfig('notifications', 'digestFrequency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">从不</SelectItem>
                        <SelectItem value="daily">每日</SelectItem>
                        <SelectItem value="weekly">每周</SelectItem>
                        <SelectItem value="monthly">每月</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      系统活动摘要的发送频率
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">通知类型</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">用户注册</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">系统错误</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">备份完成</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">安全警告</span>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                安全配置
              </CardTitle>
              <CardDescription>用户认证和安全策略设置</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      会话超时时间 (分钟)
                    </label>
                    <div className="space-y-2">
                      <Slider
                        value={[config.security.sessionTimeout]}
                        onValueChange={(value) => updateConfig('security', 'sessionTimeout', value[0])}
                        max={120}
                        min={5}
                        step={5}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>5分钟</span>
                        <span className="font-medium">{config.security.sessionTimeout}分钟</span>
                        <span>120分钟</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      最大登录尝试次数
                    </label>
                    <div className="space-y-2">
                      <Slider
                        value={[config.security.maxLoginAttempts]}
                        onValueChange={(value) => updateConfig('security', 'maxLoginAttempts', value[0])}
                        max={10}
                        min={3}
                        step={1}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>3次</span>
                        <span className="font-medium">{config.security.maxLoginAttempts}次</span>
                        <span>10次</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      密码最小长度
                    </label>
                    <div className="space-y-2">
                      <Slider
                        value={[config.security.passwordMinLength]}
                        onValueChange={(value) => updateConfig('security', 'passwordMinLength', value[0])}
                        max={20}
                        min={6}
                        step={1}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>6位</span>
                        <span className="font-medium">{config.security.passwordMinLength}位</span>
                        <span>20位</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">双因子认证</h4>
                      <p className="text-sm text-muted-foreground">强制要求所有用户启用2FA</p>
                    </div>
                    <Switch
                      checked={config.security.requireTwoFactor}
                      onCheckedChange={(checked) => updateConfig('security', 'requireTwoFactor', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">允许用户注册</h4>
                      <p className="text-sm text-muted-foreground">允许新用户自助注册账户</p>
                    </div>
                    <Switch
                      checked={config.security.allowRegistration}
                      onCheckedChange={(checked) => updateConfig('security', 'allowRegistration', checked)}
                    />
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">密码策略</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">包含大写字母</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">包含小写字母</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">包含数字</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">包含特殊字符</span>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="w-5 h-5" />
                性能优化
              </CardTitle>
              <CardDescription>缓存、压缩和文件处理设置</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">启用缓存</h4>
                      <p className="text-sm text-muted-foreground">提升页面加载速度</p>
                    </div>
                    <Switch
                      checked={config.performance.cacheEnabled}
                      onCheckedChange={(checked) => updateConfig('performance', 'cacheEnabled', checked)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      缓存过期时间 (秒)
                    </label>
                    <div className="space-y-2">
                      <Slider
                        value={[config.performance.cacheTTL]}
                        onValueChange={(value) => updateConfig('performance', 'cacheTTL', value[0])}
                        max={7200}
                        min={300}
                        step={300}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>5分钟</span>
                        <span className="font-medium">{Math.round(config.performance.cacheTTL / 60)}分钟</span>
                        <span>2小时</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">启用压缩</h4>
                      <p className="text-sm text-muted-foreground">压缩响应内容减少带宽</p>
                    </div>
                    <Switch
                      checked={config.performance.compressionEnabled}
                      onCheckedChange={(checked) => updateConfig('performance', 'compressionEnabled', checked)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      单文件最大大小 (MB)
                    </label>
                    <div className="space-y-2">
                      <Slider
                        value={[config.performance.maxFileSize]}
                        onValueChange={(value) => updateConfig('performance', 'maxFileSize', value[0])}
                        max={50}
                        min={1}
                        step={1}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>1MB</span>
                        <span className="font-medium">{config.performance.maxFileSize}MB</span>
                        <span>50MB</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      总上传大小限制 (MB)
                    </label>
                    <div className="space-y-2">
                      <Slider
                        value={[config.performance.maxUploadSize]}
                        onValueChange={(value) => updateConfig('performance', 'maxUploadSize', value[0])}
                        max={500}
                        min={10}
                        step={10}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>10MB</span>
                        <span className="font-medium">{config.performance.maxUploadSize}MB</span>
                        <span>500MB</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">允许的文件类型</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">图片 (jpg, png, gif)</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">文档 (pdf, doc, txt)</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">视频 (mp4, avi)</span>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">压缩包 (zip, rar)</span>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="w-5 h-5" />
                备份设置
              </CardTitle>
              <CardDescription>自动备份和数据保护配置</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">自动备份</h4>
                      <p className="text-sm text-muted-foreground">定时自动备份系统数据</p>
                    </div>
                    <Switch
                      checked={config.backup.autoBackup}
                      onCheckedChange={(checked) => updateConfig('backup', 'autoBackup', checked)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">备份频率</label>
                    <Select
                      value={config.backup.backupFrequency}
                      onValueChange={(value) => updateConfig('backup', 'backupFrequency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">每小时</SelectItem>
                        <SelectItem value="daily">每日</SelectItem>
                        <SelectItem value="weekly">每周</SelectItem>
                        <SelectItem value="monthly">每月</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      保留天数
                    </label>
                    <div className="space-y-2">
                      <Slider
                        value={[config.backup.retentionDays]}
                        onValueChange={(value) => updateConfig('backup', 'retentionDays', value[0])}
                        max={365}
                        min={7}
                        step={7}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>7天</span>
                        <span className="font-medium">{config.backup.retentionDays}天</span>
                        <span>365天</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">备份位置</label>
                    <Input
                      value={config.backup.backupLocation}
                      onChange={(e) => updateConfig('backup', 'backupLocation', e.target.value)}
                      placeholder="/backup/system"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      备份文件存储的本地路径
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">备份内容</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">数据库</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">用户文件</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">系统配置</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">日志文件</span>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-chart-1" />
                      <h4 className="font-medium">立即备份</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      手动执行一次完整备份
                    </p>
                    <Button variant="outline" size="sm">
                      开始备份
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}