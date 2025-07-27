import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Users, UserPlus, Download, Upload } from 'lucide-react';

export function ClassManagement() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>班级管理</h1>
          <p className="text-muted-foreground">管理您的班级和学生信息</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="w-4 h-4" />
            导入学生
          </Button>
          <Button className="gap-2">
            <UserPlus className="w-4 h-4" />
            创建班级
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((classId) => (
          <Card key={classId}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                计算机2023-{classId}班
              </CardTitle>
              <CardDescription>45名学生 · 87%完成率</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>活跃学生</span>
                <span>42/45</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  学生管理
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  成绩分析
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}