import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { BookOpen, Plus, Search, Filter } from 'lucide-react';

export function SchoolCourseManagement() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-2">课程管理</h1>
          <p className="text-muted-foreground">
            管理全校课程设置和教学安排
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          新增课程
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>课程概览</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">课程管理功能正在开发中...</p>
        </CardContent>
      </Card>
    </div>
  );
}