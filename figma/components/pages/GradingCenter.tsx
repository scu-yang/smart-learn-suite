import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ClipboardCheck, Download, FileText, Clock } from 'lucide-react';

export function GradingCenter() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>批改中心</h1>
          <p className="text-muted-foreground">管理作业批改和成绩</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            导出Excel
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            导出PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar - Assignment List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              待批改作业
            </CardTitle>
            <CardDescription>需要您处理的作业列表</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[1, 2, 3, 4, 5].map((assignment) => (
              <div key={assignment} className="p-3 border rounded-lg cursor-pointer hover:bg-accent">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="font-medium">第{assignment}章作业</p>
                    <p className="text-sm text-muted-foreground">高等数学A</p>
                  </div>
                  <Badge variant="secondary">
                    <Clock className="w-3 h-3 mr-1" />
                    待批改
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Main Content - Grading Interface */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>第1章作业 - 张同学</CardTitle>
            <CardDescription>提交时间：2025-01-20 14:30</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="auto-grade" className="space-y-4">
              <TabsList>
                <TabsTrigger value="auto-grade">AI评分</TabsTrigger>
                <TabsTrigger value="manual-grade">人工评分</TabsTrigger>
              </TabsList>

              <TabsContent value="auto-grade" className="space-y-4">
                <div className="space-y-4">
                  <div className="p-4 bg-accent rounded-lg">
                    <h4 className="font-medium mb-2">AI评分结果</h4>
                    <div className="flex justify-between items-center mb-2">
                      <span>总分：</span>
                      <span className="font-bold text-chart-1">85/100</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      解题思路正确，计算过程清晰，但第3题答案有误。
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    {[1, 2, 3].map((question) => (
                      <div key={question} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">第{question}题</span>
                          <Badge variant={question === 3 ? "destructive" : "default"}>
                            {question === 3 ? "错误" : "正确"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          求函数 f(x) = x² + 2x + 1 的导数
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="manual-grade" className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-4">手动评分</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">总分</label>
                      <input 
                        type="number" 
                        className="w-20 px-3 py-2 border rounded-md" 
                        placeholder="100" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">评语</label>
                      <textarea 
                        className="w-full px-3 py-2 border rounded-md" 
                        rows={3}
                        placeholder="输入评语..."
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button>保存评分</Button>
                      <Button variant="outline">下一份作业</Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}