import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar, Clock, Users, Plus, Filter } from 'lucide-react';

export function ExamManagement() {
  const exams = [
    { id: 1, name: '高等数学期中考试', status: '进行中', startTime: '2025-01-20 09:00', duration: '120分钟', participants: 45 },
    { id: 2, name: '线性代数测验', status: '已结束', startTime: '2025-01-15 14:00', duration: '90分钟', participants: 38 },
    { id: 3, name: '概率论期末考试', status: '准备中', startTime: '2025-01-25 09:00', duration: '150分钟', participants: 42 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case '进行中': return 'bg-chart-2';
      case '已结束': return 'bg-muted';
      case '准备中': return 'bg-chart-3';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>考试管理</h1>
          <p className="text-muted-foreground">创建和管理您的考试</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            筛选
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            创建考试
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {exams.map((exam) => (
          <Card key={exam.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle>{exam.name}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{exam.startTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{exam.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{exam.participants}人</span>
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className={getStatusColor(exam.status)}>
                  {exam.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">编辑</Button>
                <Button variant="outline" size="sm">监考</Button>
                <Button variant="outline" size="sm">查看结果</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}