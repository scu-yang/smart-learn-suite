import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import type { NotificationCreate, Class, CourseManagement } from '@/types';

export function NotificationManagementPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [courses, setCourses] = useState<CourseManagement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateNotification, setShowCreateNotification] = useState(false);
  const [selectedTargetType, setSelectedTargetType] = useState<'all' | 'class' | 'course' | 'individual'>('all');

  useEffect(() => {
    fetchNotifications();
    fetchClasses();
    fetchCourses();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockNotifications = [
        {
          id: '1',
          title: '期末考试安排通知',
          content: '计算机科学导论期末考试将于7月25日进行，请同学们做好准备。',
          type: 'exam',
          priority: 'high',
          targetType: 'course',
          targetIds: ['1'],
          targetNames: ['计算机科学导论'],
          status: 'sent',
          createdAt: '2024-07-20T10:00:00Z',
          sentAt: '2024-07-20T10:05:00Z',
          recipientCount: 85,
          readCount: 62
        },
        {
          id: '2',
          title: '作业提交提醒',
          content: '第三章练习作业将于本周五截止，请及时提交。',
          type: 'assignment',
          priority: 'medium',
          targetType: 'class',
          targetIds: ['1'],
          targetNames: ['计算机科学2023级1班'],
          status: 'sent',
          createdAt: '2024-07-18T14:30:00Z',
          sentAt: '2024-07-18T14:35:00Z',
          recipientCount: 32,
          readCount: 28
        },
        {
          id: '3',
          title: '系统维护公告',
          content: '系统将于本周六凌晨2点进行维护，预计维护时间2小时。',
          type: 'system',
          priority: 'urgent',
          targetType: 'all',
          targetIds: [],
          targetNames: ['全体用户'],
          status: 'scheduled',
          createdAt: '2024-07-19T16:00:00Z',
          scheduledAt: '2024-07-21T08:00:00Z',
          recipientCount: 1250,
          readCount: 0
        }
      ];
      
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('获取通知数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockClasses: Class[] = [
        {
          id: '1',
          name: '计算机科学2023级1班',
          courseId: 'cs001',
          teacherId: 'teacher_001',
          teacherName: '张教授',
          studentCount: 32,
          maxStudents: 35,
          semester: '2024春',
          year: '2024',
          schedule: '周一 8:00-10:00, 周三 14:00-16:00',
          classroom: '教学楼A101',
          description: '计算机科学与技术专业核心课程班级',
          createdAt: '2024-01-15T08:00:00Z',
          updatedAt: '2024-07-20T10:00:00Z'
        },
        {
          id: '2',
          name: '数据结构2023级2班',
          courseId: 'cs002',
          teacherId: 'teacher_002',
          teacherName: '李教授',
          studentCount: 28,
          maxStudents: 30,
          semester: '2024春',
          year: '2024',
          schedule: '周二 10:00-12:00, 周四 16:00-18:00',
          classroom: '教学楼B203',
          description: '数据结构与算法专业课程班级',
          createdAt: '2024-01-20T08:00:00Z',
          updatedAt: '2024-07-18T15:30:00Z'
        }
      ];
      
      setClasses(mockClasses);
    } catch (error) {
      console.error('获取班级数据失败:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockCourses: CourseManagement[] = [
        {
          id: '1',
          code: 'CS101',
          name: '计算机科学导论',
          description: '计算机科学基础课程',
          credits: 3,
          department: '计算机学院',
          category: '专业核心课',
          prerequisites: [],
          teacherIds: ['teacher_001'],
          teachers: [],
          semester: '2024春',
          year: '2024',
          maxStudents: 100,
          currentStudents: 85,
          schedule: '周一 8:00-10:00, 周三 14:00-16:00',
          classroom: '教学楼A101',
          syllabus: '',
          objectives: [],
          assessmentMethods: [],
          textbooks: [],
          chapters: [],
          status: 'published',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-07-20T10:00:00Z'
        }
      ];
      
      setCourses(mockCourses);
    } catch (error) {
      console.error('获取课程数据失败:', error);
    }
  };

  const handleCreateNotification = async (notificationData: NotificationCreate) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 计算接收者数量
      let recipientCount = 0;
      let targetNames: string[] = [];
      
      if (notificationData.targetType === 'all') {
        recipientCount = 1250; // 假设总用户数
        targetNames = ['全体用户'];
      } else if (notificationData.targetType === 'class') {
        const selectedClasses = classes.filter(c => notificationData.targetIds.includes(c.id));
        recipientCount = selectedClasses.reduce((sum, c) => sum + c.studentCount, 0);
        targetNames = selectedClasses.map(c => c.name);
      } else if (notificationData.targetType === 'course') {
        const selectedCourses = courses.filter(c => notificationData.targetIds.includes(c.id));
        recipientCount = selectedCourses.reduce((sum, c) => sum + c.currentStudents, 0);
        targetNames = selectedCourses.map(c => c.name);
      } else {
        recipientCount = notificationData.targetIds.length;
        targetNames = ['指定用户'];
      }
      
      const newNotification = {
        id: Date.now().toString(),
        title: notificationData.title,
        content: notificationData.content,
        type: notificationData.type,
        priority: notificationData.priority,
        targetType: notificationData.targetType,
        targetIds: notificationData.targetIds,
        targetNames,
        status: notificationData.scheduledAt ? 'scheduled' : 'sent',
        createdAt: new Date().toISOString(),
        sentAt: notificationData.scheduledAt ? undefined : new Date().toISOString(),
        scheduledAt: notificationData.scheduledAt,
        recipientCount,
        readCount: 0
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      setShowCreateNotification(false);
    } catch (error) {
      console.error('创建通知失败:', error);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    if (!confirm('确定要删除这条通知吗？')) return;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('删除通知失败:', error);
    }
  };

  if (user?.role !== 'teacher' && user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">访问被拒绝</h2>
          <p className="text-gray-600">您没有权限访问通知管理页面</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">通知管理</h1>
            <p className="text-gray-600">发布和管理系统通知公告</p>
          </div>
          <Button onClick={() => setShowCreateNotification(true)}>
            发布新通知
          </Button>
        </div>

        {/* 通知列表 */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">通知列表</h2>
          {loading ? (
            <div className="text-center py-8">加载中...</div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{notification.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          notification.type === 'exam' ? 'bg-blue-100 text-blue-800' :
                          notification.type === 'assignment' ? 'bg-green-100 text-green-800' :
                          notification.type === 'announcement' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {notification.type === 'exam' ? '考试' :
                           notification.type === 'assignment' ? '作业' :
                           notification.type === 'announcement' ? '公告' :
                           notification.type === 'course' ? '课程' : '系统'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          notification.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          notification.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {notification.priority === 'urgent' ? '紧急' :
                           notification.priority === 'high' ? '重要' :
                           notification.priority === 'medium' ? '普通' : '一般'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          notification.status === 'sent' ? 'bg-green-100 text-green-800' :
                          notification.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {notification.status === 'sent' ? '已发送' :
                           notification.status === 'scheduled' ? '已安排' : '草稿'}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">{notification.content}</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <strong>发送对象：</strong>{notification.targetNames.join(', ')}
                        </div>
                        <div>
                          <strong>接收人数：</strong>{notification.recipientCount}
                        </div>
                        <div>
                          <strong>已读人数：</strong>{notification.readCount} ({notification.recipientCount > 0 ? ((notification.readCount / notification.recipientCount) * 100).toFixed(1) : 0}%)
                        </div>
                        <div>
                          <strong>创建时间：</strong>{new Date(notification.createdAt).toLocaleString('zh-CN')}
                        </div>
                        {notification.sentAt && (
                          <div>
                            <strong>发送时间：</strong>{new Date(notification.sentAt).toLocaleString('zh-CN')}
                          </div>
                        )}
                        {notification.scheduledAt && (
                          <div>
                            <strong>计划发送：</strong>{new Date(notification.scheduledAt).toLocaleString('zh-CN')}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeleteNotification(notification.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        删除
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* 发布通知对话框 */}
      <Dialog open={showCreateNotification} onOpenChange={setShowCreateNotification}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>发布新通知</DialogTitle>
          </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                
                let targetIds: string[] = [];
                if (selectedTargetType === 'class') {
                  const selectedClasses = Array.from(formData.getAll('targetClasses') as string[]);
                  targetIds = selectedClasses;
                } else if (selectedTargetType === 'course') {
                  const selectedCourses = Array.from(formData.getAll('targetCourses') as string[]);
                  targetIds = selectedCourses;
                } else if (selectedTargetType === 'individual') {
                  const userIds = (formData.get('userIds') as string).split(',').map(id => id.trim()).filter(Boolean);
                  targetIds = userIds;
                }
                
                const notificationData: NotificationCreate = {
                  title: formData.get('title') as string,
                  content: formData.get('content') as string,
                  type: formData.get('type') as any,
                  priority: formData.get('priority') as any,
                  targetType: selectedTargetType,
                  targetIds,
                  scheduledAt: formData.get('scheduledAt') as string || undefined,
                  expiresAt: formData.get('expiresAt') as string || undefined,
                  actionUrl: formData.get('actionUrl') as string || undefined,
                  actionText: formData.get('actionText') as string || undefined
                };
                
                handleCreateNotification(notificationData);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input name="title" placeholder="通知标题" required />
                <select name="type" className="px-3 py-2 border border-gray-300 rounded-md" required>
                  <option value="">选择通知类型</option>
                  <option value="exam">考试通知</option>
                  <option value="course">课程通知</option>
                  <option value="assignment">作业通知</option>
                  <option value="announcement">一般公告</option>
                  <option value="system">系统通知</option>
                </select>
                <select name="priority" className="px-3 py-2 border border-gray-300 rounded-md" required>
                  <option value="">选择优先级</option>
                  <option value="low">一般</option>
                  <option value="medium">普通</option>
                  <option value="high">重要</option>
                  <option value="urgent">紧急</option>
                </select>
                <select 
                  className="px-3 py-2 border border-gray-300 rounded-md" 
                  value={selectedTargetType}
                  onChange={(e) => setSelectedTargetType(e.target.value as any)}
                  required
                >
                  <option value="all">全体用户</option>
                  <option value="class">指定班级</option>
                  <option value="course">指定课程</option>
                  <option value="individual">指定用户</option>
                </select>
              </div>
              
              {/* 目标选择 */}
              {selectedTargetType === 'class' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">选择班级</label>
                  <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
                    {classes.map(cls => (
                      <label key={cls.id} className="flex items-center space-x-2 mb-1">
                        <input type="checkbox" name="targetClasses" value={cls.id} />
                        <span className="text-sm">{cls.name} ({cls.studentCount}人)</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedTargetType === 'course' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">选择课程</label>
                  <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
                    {courses.map(course => (
                      <label key={course.id} className="flex items-center space-x-2 mb-1">
                        <input type="checkbox" name="targetCourses" value={course.id} />
                        <span className="text-sm">{course.name} ({course.currentStudents}人)</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedTargetType === 'individual' && (
                <Input 
                  name="userIds" 
                  placeholder="用户ID（用逗号分隔）" 
                  required 
                />
              )}
              
            <Textarea
              name="content"
              placeholder="通知内容"
              rows={4}
              required
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">定时发送（可选）</label>
                <Input name="scheduledAt" type="datetime-local" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">过期时间（可选）</label>
                <Input name="expiresAt" type="datetime-local" />
              </div>
              <Input name="actionUrl" placeholder="操作链接（可选）" />
              <Input name="actionText" placeholder="操作按钮文本（可选）" />
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateNotification(false)}
              >
                取消
              </Button>
              <Button type="submit">发布通知</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
