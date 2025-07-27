import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Bell, Plus, Users, Send } from 'lucide-react';

export function NotificationManagement() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>通知管理</h1>
          <p className="text-muted-foreground">发布和管理系统通知</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          发布通知
        </Button>
      </div>

      <div className="grid gap-4">
        {[1, 2, 3, 4].map((notification) => (
          <Card key={notification}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    期中考试安排通知
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      <Users className="w-3 h-3 mr-1" />
                      所有学生
                    </Badge>
                    <span className="text-sm text-muted-foreground">2025-01-20 发布</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">编辑</Button>
                  <Button variant="outline" size="sm">
                    <Send className="w-3 h-3 mr-1" />
                    推送
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                各位同学请注意，期中考试将于下周三开始，请做好复习准备...
              </p>
              <div className="text-xs text-muted-foreground">
                已发送给 245 名学生 · 已读 189 人
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}