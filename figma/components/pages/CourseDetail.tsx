import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { 
  Plus, 
  FileText, 
  Users, 
  Megaphone, 
  ChevronRight,
  Download,
  Upload
} from 'lucide-react';

export function CourseDetail() {
  const { id } = useParams();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>高等数学A</h1>
          <p className="text-muted-foreground">课程详情管理</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="w-4 h-4" />
            导入内容
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            导出课程
          </Button>
        </div>
      </div>

      <Tabs defaultValue="chapters" className="space-y-4">
        <TabsList>
          <TabsTrigger value="chapters">章节管理</TabsTrigger>
          <TabsTrigger value="announcements">课程公告</TabsTrigger>
          <TabsTrigger value="classes">班级列表</TabsTrigger>
        </TabsList>

        <TabsContent value="chapters" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3>课程章节</h3>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              添加章节
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                {[1, 2, 3, 4].map((chapter) => (
                  <div key={chapter} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <ChevronRight className="w-4 h-4" />
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span>第{chapter}章 - 极限与连续</span>
                      <Badge variant="secondary">8节</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">编辑</Button>
                      <Button variant="ghost" size="sm">删除</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3>课程公告</h3>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              发布公告
            </Button>
          </div>
          
          <div className="space-y-3">
            {[1, 2, 3].map((announcement) => (
              <Card key={announcement}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-base">期中考试安排通知</CardTitle>
                      <p className="text-sm text-muted-foreground">2025-01-20 发布</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">编辑</Button>
                      <Button variant="ghost" size="sm">撤回</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">各位同学请注意，期中考试将于下周三开始，请做好复习准备...</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="classes" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3>关联班级</h3>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              导出数据
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-4">班级名称</th>
                      <th className="text-left p-4">报名人数</th>
                      <th className="text-left p-4">完成率</th>
                      <th className="text-left p-4">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: '计算机2023-1班', students: 45, completion: 87 },
                      { name: '计算机2023-2班', students: 42, completion: 92 },
                      { name: '软件工程2023-1班', students: 38, completion: 79 }
                    ].map((classItem, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-4">{classItem.name}</td>
                        <td className="p-4">{classItem.students}</td>
                        <td className="p-4">{classItem.completion}%</td>
                        <td className="p-4">
                          <Button variant="ghost" size="sm">查看详情</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}