import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  Users, 
  Search, 
  Filter,
  Plus,
  Download,
  Upload,
  GraduationCap,
  BookOpen,
  Settings
} from 'lucide-react';

export function SchoolUserManagement() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-2">用户管理</h1>
          <p className="text-muted-foreground">
            管理全校师生用户账户和权限
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            批量导入
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            新增用户
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">用户概览</TabsTrigger>
          <TabsTrigger value="teachers">教师管理</TabsTrigger>
          <TabsTrigger value="students">学生管理</TabsTrigger>
          <TabsTrigger value="permissions">权限管理</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">教师用户</p>
                    <p className="text-2xl font-semibold">248</p>
                  </div>
                  <GraduationCap className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">学生用户</p>
                    <p className="text-2xl font-semibold">12,456</p>
                  </div>
                  <Users className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">管理员</p>
                    <p className="text-2xl font-semibold">15</p>
                  </div>
                  <Settings className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="teachers">
          <Card>
            <CardHeader>
              <CardTitle>教师用户管理</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">教师用户管理功能正在开发中...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>学生用户管理</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">学生用户管理功能正在开发中...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>权限管理</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">权限管理功能正在开发中...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}