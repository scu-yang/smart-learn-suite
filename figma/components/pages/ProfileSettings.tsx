import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import { User, Lock, Save } from 'lucide-react';

export function ProfileSettings() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>个人设置</h1>
        <p className="text-muted-foreground">管理您的个人信息和账户设置</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              个人信息
            </CardTitle>
            <CardDescription>更新您的个人资料</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">姓名</Label>
              <Input id="name" defaultValue="张教授" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input id="email" type="email" defaultValue="zhang@university.edu" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">电话</Label>
              <Input id="phone" defaultValue="138-0000-0000" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">所属院系</Label>
              <Input id="department" defaultValue="数学与统计学院" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title">职称</Label>
              <Input id="title" defaultValue="教授" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">个人简介</Label>
              <Textarea id="bio" placeholder="介绍一下您自己..." />
            </div>
            
            <Button className="w-full gap-2">
              <Save className="w-4 h-4" />
              保存更改
            </Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              安全设置
            </CardTitle>
            <CardDescription>更改您的密码和安全选项</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">当前密码</Label>
              <Input id="current-password" type="password" />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor="new-password">新密码</Label>
              <Input id="new-password" type="password" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">确认新密码</Label>
              <Input id="confirm-password" type="password" />
            </div>
            
            <Button className="w-full gap-2">
              <Save className="w-4 h-4" />
              更新密码
            </Button>
            
            <Separator />
            
            <div className="space-y-4">
              <h4 className="font-medium">账户选项</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full">
                  导出个人数据
                </Button>
                <Button variant="destructive" className="w-full">
                  删除账户
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}