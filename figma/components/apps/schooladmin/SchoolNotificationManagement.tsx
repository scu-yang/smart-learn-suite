import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Bell, Plus, Send } from 'lucide-react';

export function SchoolNotificationManagement() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-2">通知管理</h1>
          <p className="text-muted-foreground">
            发布校级通知和重要公告
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          发布通知
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>通知中心</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">通知管理功能正在开发中...</p>
        </CardContent>
      </Card>
    </div>
  );
}