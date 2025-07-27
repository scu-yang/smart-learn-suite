import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { 
  Shield, 
  CheckCircle2, 
  XCircle, 
  Info,
  Users,
  FileEdit,
  Bell,
  BookOpen,
  BarChart3,
  MessageSquare
} from 'lucide-react';
import { usePermissions } from '../../../contexts/PermissionContext';

const PERMISSION_LABELS = {
  classStudentManagement: {
    title: '班级学生管理',
    description: '查看和管理班级学生信息、学习进度',
    icon: Users
  },
  homeworkGrading: {
    title: '作业批改与分数修正',
    description: '批改学生作业，修正AI批改结果',
    icon: FileEdit
  },
  classAnnouncementManagement: {
    title: '班级公告管理',
    description: '发布、编辑班级公告和通知',
    icon: Bell
  },
  courseResourceManagement: {
    title: '课程资源管理',
    description: '管理课程资料、题库内容',
    icon: BookOpen
  },
  learningDataView: {
    title: '学情数据查看',
    description: '查看学生学习数据和分析报告',
    icon: BarChart3
  },
  discussionManagement: {
    title: '讨论区管理',
    description: '管理课程讨论区和学生答疑',
    icon: MessageSquare
  }
};

const ACTION_LABELS = {
  view: '查看',
  create: '创建',
  edit: '编辑',
  delete: '删除'
};

export function TAPermissionManagement() {
  const { permissions, isTeacher, userRole } = usePermissions();

  const getPermissionIcon = (hasPermission: boolean) => {
    return hasPermission ? (
      <CheckCircle2 className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-gray-400" />
    );
  };

  const getPermissionBadge = (hasPermission: boolean) => {
    return hasPermission ? (
      <Badge variant="outline" className="text-green-600 border-green-200">
        允许
      </Badge>
    ) : (
      <Badge variant="outline" className="text-gray-500 border-gray-200">
        禁止
      </Badge>
    );
  };

  const getTotalPermissions = () => {
    let total = 0;
    let allowed = 0;
    
    Object.values(permissions).forEach(modulePerms => {
      Object.values(modulePerms).forEach(hasPermission => {
        total++;
        if (hasPermission) allowed++;
      });
    });
    
    return { total, allowed };
  };

  const { total, allowed } = getTotalPermissions();
  const permissionPercentage = Math.round((allowed / total) * 100);

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-2">权限管理</h1>
          <p className="text-muted-foreground">
            查看您当前的操作权限范围
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium">
            {userRole === 'teacher' ? '教师权限' : '助教权限'}
          </span>
        </div>
      </div>

      {/* 权限概览 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">权限覆盖率</p>
                <p className="text-2xl font-semibold text-blue-600">{permissionPercentage}%</p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {allowed}/{total} 项权限已启用
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">用户类型</p>
                <p className="text-2xl font-semibold">
                  {userRole === 'teacher' ? '主讲教师' : '助教'}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {isTeacher ? '拥有完整权限' : '权限受限制'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">权限来源</p>
                <p className="text-2xl font-semibold">主讲教师</p>
              </div>
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              权限由主讲教师分配
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 详细权限矩阵 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            权限详情
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(permissions).map(([moduleKey, modulePerms]) => {
              const moduleInfo = PERMISSION_LABELS[moduleKey as keyof typeof PERMISSION_LABELS];
              const IconComponent = moduleInfo.icon;
              
              return (
                <div key={moduleKey} className="border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <IconComponent className="h-5 w-5 text-blue-600" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{moduleInfo.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {moduleInfo.description}
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.entries(modulePerms).map(([action, hasPermission]) => (
                          <div key={action} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center gap-2">
                              {getPermissionIcon(hasPermission)}
                              <span className="text-sm">
                                {ACTION_LABELS[action as keyof typeof ACTION_LABELS]}
                              </span>
                            </div>
                            {getPermissionBadge(hasPermission)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 权限说明 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            权限说明
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>
                <strong>查看权限：</strong>可以浏览相关页面和数据，但不能进行修改操作
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>
                <strong>创建权限：</strong>可以新建相关内容，如发布公告、创建资源等
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>
                <strong>编辑权限：</strong>可以修改相关内容，部分模块仅限编辑自己创建的内容
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>
                <strong>删除权限：</strong>可以删除相关内容，部分模块仅限删除自己创建的内容
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <p>
                <strong>特殊说明：</strong>对于班级公告管理和课程资源管理，助教只能编辑和删除自己创建的内容
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}