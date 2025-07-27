import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { BarChart3, Download, Calendar } from 'lucide-react';

export function SchoolDataReports() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-2">数据报表</h1>
          <p className="text-muted-foreground">
            生成和查看各类教学数据分析报表
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            自定义时间
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            导出报表
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>报表中心</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">数据报表功能正在开发中...</p>
        </CardContent>
      </Card>
    </div>
  );
}