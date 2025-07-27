import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { MessageSquare, ThumbsUp, Plus, Search } from 'lucide-react';
import { Input } from '../ui/input';

export function QAForum() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>学生答疑</h1>
          <p className="text-muted-foreground">学生讨论区和问题解答</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          发起讨论
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input placeholder="搜索问题..." className="pl-10" />
        </div>
      </div>

      <div className="grid gap-4">
        {[1, 2, 3, 4, 5].map((topic) => (
          <Card key={topic}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <CardTitle className="text-base">关于极限计算的问题</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>张同学 · 2小时前</span>
                    <Badge variant="secondary">高等数学</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>5</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    <span>12</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                请问在计算 lim(x→0) (sin x)/x 时，为什么不能直接代入x=0？
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">查看回复</Button>
                <Button size="sm">回答问题</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}