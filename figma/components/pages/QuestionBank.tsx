import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { FileQuestion, Eye, Plus, Search } from 'lucide-react';
import { Input } from '../ui/input';

export function QuestionBank() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>题目管理</h1>
          <p className="text-muted-foreground">管理您的题库和OCR审核</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          添加题目
        </Button>
      </div>

      <Tabs defaultValue="ocr-review" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ocr-review">OCR审核</TabsTrigger>
          <TabsTrigger value="manual">手工维护</TabsTrigger>
        </TabsList>

        <TabsContent value="ocr-review" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                待审核OCR结果
              </CardTitle>
              <CardDescription>需要您确认或修正的OCR识别结果</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <p className="font-medium">题目 #{item}</p>
                        <p className="text-sm text-muted-foreground">
                          求函数 f(x) = x² + 2x + 1 的导数
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">预览</Button>
                        <Button size="sm">修正</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual" className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="搜索题目..." className="pl-10" />
            </div>
          </div>

          <div className="grid gap-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <Card key={item}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <FileQuestion className="w-4 h-4" />
                        <span className="font-medium">选择题 - 高等数学</span>
                      </div>
                      <p className="text-sm">计算 ∫₀¹ x² dx 的值是：</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">编辑</Button>
                      <Button variant="outline" size="sm">删除</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}