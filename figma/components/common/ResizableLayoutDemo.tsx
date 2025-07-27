import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  ResizableLayout, 
  ResizablePanel, 
  ResizablePanelVertical,
  useLayoutPreferences 
} from './ResizableLayout';
import { 
  Layout,
  Sidebar,
  FileText,
  Settings,
  BarChart3,
  Users,
  MessageSquare,
  Calendar,
  BookOpen,
  Target
} from 'lucide-react';

export function ResizableLayoutDemo() {
  const [preferences, updatePreferences] = useLayoutPreferences('demo');
  const [selectedTab, setSelectedTab] = useState('horizontal');

  // 水平三列布局演示
  const HorizontalThreeColumnDemo = () => (
    <div className="h-[600px] border rounded-lg overflow-hidden">
      <ResizableLayout
        defaultSizes={[300, 400, 350]}
        minSizes={[250, 350, 300]}
        maxSizes={[500, 600, 500]}
        direction="horizontal"
        onResize={(sizes) => {
          updatePreferences({ ...preferences, horizontal: sizes });
        }}
      >
        {/* 左侧面板 - 导航 */}
        <div className="bg-sidebar border-r border-sidebar-border h-full flex flex-col">
          <div className="p-4 border-b border-sidebar-border">
            <h3 className="font-medium flex items-center gap-2">
              <Sidebar className="w-4 h-4" />
              导航面板
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              可拖动调整宽度
            </p>
          </div>
          <div className="flex-1 p-4 space-y-2">
            <div className="space-y-1">
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                <BarChart3 className="w-4 h-4" />
                仪表板
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                <Users className="w-4 h-4" />
                用户管理
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                <FileText className="w-4 h-4" />
                文档管理
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                <MessageSquare className="w-4 h-4" />
                消息中心
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                <Calendar className="w-4 h-4" />
                日程安排
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                <Settings className="w-4 h-4" />
                系统设置
              </Button>
            </div>
          </div>
        </div>

        {/* 中间面板 - 主要内容 */}
        <div className="bg-background border-r h-full flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-medium flex items-center gap-2">
              <FileText className="w-4 h-4" />
              主要内容区
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              中间列可调整宽度
            </p>
          </div>
          <div className="flex-1 p-4 overflow-auto">
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">数据概览</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted rounded">
                      <div className="text-2xl font-bold text-chart-1">1,234</div>
                      <div className="text-sm text-muted-foreground">用户总数</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded">
                      <div className="text-2xl font-bold text-chart-2">567</div>
                      <div className="text-sm text-muted-foreground">活跃用户</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">最近活动</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-chart-1 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm">用户张三登录系统</p>
                        <p className="text-xs text-muted-foreground">2分钟前</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-chart-2 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm">新增文档：项目计划书</p>
                        <p className="text-xs text-muted-foreground">15分钟前</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-chart-3 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm">系统备份完成</p>
                        <p className="text-xs text-muted-foreground">1小时前</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* 右侧面板 - 工具和信息 */}
        <div className="bg-card h-full flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-medium flex items-center gap-2">
              <Target className="w-4 h-4" />
              工具面板
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              右侧面板也可调整
            </p>
          </div>
          <div className="flex-1 p-4 space-y-4 overflow-auto">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">快速操作</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button size="sm" className="w-full gap-2">
                  <BookOpen className="w-3 h-3" />
                  新建文档
                </Button>
                <Button size="sm" variant="outline" className="w-full gap-2">
                  <Users className="w-3 h-3" />
                  添加用户
                </Button>
                <Button size="sm" variant="outline" className="w-full gap-2">
                  <MessageSquare className="w-3 h-3" />
                  发送消息
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">系统状态</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">CPU使用率</span>
                  <Badge variant="secondary">45%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">内存使用</span>
                  <Badge variant="secondary">67%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">磁盘空间</span>
                  <Badge variant="secondary">82%</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">在线用户</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">张三</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">李四</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">王五</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ResizableLayout>
    </div>
  );

  // 垂直布局演示
  const VerticalLayoutDemo = () => (
    <div className="h-[600px] border rounded-lg overflow-hidden">
      <ResizableLayout
        defaultSizes={[150, 300, 150]}
        minSizes={[100, 200, 100]}
        maxSizes={[250, 400, 200]}
        direction="vertical"
        onResize={(sizes) => {
          updatePreferences({ ...preferences, vertical: sizes });
        }}
      >
        {/* 顶部面板 */}
        <div className="bg-card border-b h-full p-4">
          <h3 className="font-medium mb-2">顶部工具栏</h3>
          <p className="text-sm text-muted-foreground mb-4">可拖动调整高度</p>
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" variant="outline">文件</Button>
            <Button size="sm" variant="outline">编辑</Button>
            <Button size="sm" variant="outline">视图</Button>
            <Button size="sm" variant="outline">工具</Button>
            <Button size="sm" variant="outline">帮助</Button>
          </div>
        </div>

        {/* 中间主要内容区 */}
        <div className="bg-background border-b h-full p-4 overflow-auto">
          <h3 className="font-medium mb-4">主要工作区</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">项目列表</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="p-2 border rounded">项目A - 进行中</div>
                  <div className="p-2 border rounded">项目B - 已完成</div>
                  <div className="p-2 border rounded">项目C - 计划中</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">任务分析</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>已完成</span>
                    <Badge>12</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>进行中</span>
                    <Badge variant="secondary">8</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>待开始</span>
                    <Badge variant="outline">5</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 底部状态栏 */}
        <div className="bg-muted/30 h-full p-4">
          <h3 className="font-medium mb-2">状态信息</h3>
          <div className="flex items-center gap-4 text-sm">
            <span>行: 1, 列: 1</span>
            <span>字符: 0</span>
            <span>已保存</span>
            <div className="ml-auto flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>已连接</span>
            </div>
          </div>
        </div>
      </ResizableLayout>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Layout className="w-6 h-6" />
          可调整布局演示
        </h1>
        <p className="text-muted-foreground">
          演示如何在多列和多行布局中实现可拖动调整功能。拖动分割线可以调整各个面板的大小。
        </p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="horizontal">水平三列布局</TabsTrigger>
          <TabsTrigger value="vertical">垂直三行布局</TabsTrigger>
          <TabsTrigger value="usage">使用说明</TabsTrigger>
        </TabsList>

        <TabsContent value="horizontal" className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg font-medium">水平三列可调整布局</h2>
            <p className="text-sm text-muted-foreground">
              左侧导航栏、中间内容区、右侧工具栏，每列都可以通过拖动分割线调整宽度。
            </p>
          </div>
          <HorizontalThreeColumnDemo />
        </TabsContent>

        <TabsContent value="vertical" className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg font-medium">垂直三行可调整布局</h2>
            <p className="text-sm text-muted-foreground">
              顶部工具栏、中间工作区、底部状态栏，每行都可以通过拖动分割线调整高度。
            </p>
          </div>
          <VerticalLayoutDemo />
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>使用说明</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">基本功能</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• 拖动分割线调整面板大小</li>
                  <li>• 设置最小和最大尺寸限制</li>
                  <li>• 自动保存布局偏好设置</li>
                  <li>• 支持水平和垂直方向</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-2">已应用的页面</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• 教师应用 - 可调整导航栏宽度</li>
                  <li>• 学生应用 - 桌面端可调整侧边栏</li>
                  <li>• 管理员应用 - 可调整侧边栏宽度</li>
                  <li>• OCR审核页面 - 三列可调整布局</li>
                  <li>• 所有带侧边栏的页面</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-2">技术特性</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• 基于 re-resizable 库实现</li>
                  <li>• 响应式设计，移动端自动禁用</li>
                  <li>• 布局状态持久化存储</li>
                  <li>• 可视化拖拽指示器</li>
                  <li>• TypeScript 类型安全</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-2">代码示例</h3>
                <div className="bg-muted p-3 rounded text-sm font-mono">
                  <div className="text-muted-foreground">// 基本用法</div>
                  <div>&lt;ResizableLayout</div>
                  <div className="ml-2">defaultSizes=&#123;[300, 400, 350]&#125;</div>
                  <div className="ml-2">minSizes=&#123;[200, 300, 250]&#125;</div>
                  <div className="ml-2">direction="horizontal"</div>
                  <div>&gt;</div>
                  <div className="ml-2">&lt;Panel1 /&gt;</div>
                  <div className="ml-2">&lt;Panel2 /&gt;</div>
                  <div className="ml-2">&lt;Panel3 /&gt;</div>
                  <div>&lt;/ResizableLayout&gt;</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ResizableLayoutDemo;