import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import {
  BarChart3,
  TrendingUp,
  Users,
  Target,
  Download,
} from "lucide-react";

export function AnalyticsReport() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>学情报告</h1>
          <p className="text-muted-foreground">
            学生学习情况分析和报告
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            导出报告
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            title: "平均分",
            value: "78.5",
            icon: BarChart3,
            color: "text-chart-1",
          },
          {
            title: "最高分",
            value: "95",
            icon: TrendingUp,
            color: "text-chart-2",
          },
          {
            title: "参与率",
            value: "92%",
            icon: Users,
            color: "text-chart-3",
          },
          {
            title: "通过率",
            value: "87%",
            icon: Target,
            color: "text-chart-4",
          },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {kpi.title}
                </CardTitle>
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {kpi.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chapter Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>章节表现分析</CardTitle>
            <CardDescription>
              各章节学习情况统计
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                chapter: "第1章 极限与连续",
                avg: 85,
                max: 95,
                min: 65,
              },
              {
                chapter: "第2章 导数与微分",
                avg: 78,
                max: 92,
                min: 58,
              },
              {
                chapter: "第3章 积分学",
                avg: 72,
                max: 88,
                min: 52,
              },
              {
                chapter: "第4章 级数",
                avg: 68,
                max: 85,
                min: 45,
              },
            ].map((item) => (
              <div key={item.chapter} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    {item.chapter}
                  </span>
                  <div className="flex gap-2 text-sm">
                    <Badge variant="outline">
                      平均: {item.avg}
                    </Badge>
                    <Badge variant="secondary">
                      最高: {item.max}
                    </Badge>
                    <Badge variant="secondary">
                      最低: {item.min}
                    </Badge>
                  </div>
                </div>
                <Progress value={item.avg} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Student Performance */}
        <Card>
          <CardHeader>
            <CardTitle>学生排名</CardTitle>
            <CardDescription>按平均成绩排序</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "李同学", score: 95, trend: "up" },
                { name: "王同学", score: 92, trend: "up" },
                { name: "张同学", score: 88, trend: "down" },
                { name: "刘同学", score: 85, trend: "up" },
                { name: "陈同学", score: 82, trend: "same" },
              ].map((student, index) => (
                <div
                  key={student.name}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-chart-1 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <span className="font-medium">
                      {student.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">
                      {student.score}
                    </span>
                    <TrendingUp
                      className={`w-4 h-4 ${
                        student.trend === "up"
                          ? "text-chart-2"
                          : student.trend === "down"
                            ? "text-destructive"
                            : "text-muted-foreground"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}