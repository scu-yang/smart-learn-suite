import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import type { Class, ClassStudent } from '@/types';

export function ClassManagementPage() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [classStudents, setClassStudents] = useState<ClassStudent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddStudent, setShowAddStudent] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      // 模拟API调用 - 根据角色获取不同的班级数据
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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

      // 如果是教师，只显示自己的班级
      if (user?.role === 'teacher') {
        setClasses(mockClasses.filter(c => c.teacherId === user.id));
      } else {
        setClasses(mockClasses);
      }
    } catch (error) {
      console.error('获取班级数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClassStudents = async (classId: string) => {
    try {
      // 模拟获取班级学生数据
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockStudents: ClassStudent[] = [
        {
          id: '1',
          classId: classId,
          studentId: '2023001',
          student: {
            id: '1',
            studentId: '2023001',
            name: '张三',
            email: 'zhangsan@scu.edu.cn',
            phone: '13800138001',
            department: '计算机学院',
            major: '计算机科学与技术',
            grade: '2023',
            enrolledAt: '2023-09-01T00:00:00Z',
            status: 'active'
          },
          enrolledAt: '2024-01-15T08:00:00Z',
          status: 'active',
          performance: {
            averageScore: 85.5,
            attendanceRate: 95,
            assignmentCompletion: 90
          }
        },
        {
          id: '2',
          classId: classId,
          studentId: '2023002',
          student: {
            id: '2',
            studentId: '2023002',
            name: '李四',
            email: 'lisi@scu.edu.cn',
            phone: '13800138002',
            department: '计算机学院',
            major: '计算机科学与技术',
            grade: '2023',
            enrolledAt: '2023-09-01T00:00:00Z',
            status: 'active'
          },
          enrolledAt: '2024-01-15T08:00:00Z',
          status: 'active',
          performance: {
            averageScore: 78.2,
            attendanceRate: 88,
            assignmentCompletion: 85
          }
        }
      ];
      
      setClassStudents(mockStudents);
    } catch (error) {
      console.error('获取学生数据失败:', error);
    }
  };

  const handleClassSelect = (classItem: Class) => {
    setSelectedClass(classItem);
    fetchClassStudents(classItem.id);
  };

  const handleRemoveStudent = async (studentId: string) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setClassStudents(prev => prev.filter(cs => cs.student.id !== studentId));
      
      // 更新班级学生数量
      if (selectedClass) {
        setSelectedClass(prev => prev ? {...prev, studentCount: prev.studentCount - 1} : null);
        setClasses(prev => prev.map(c => 
          c.id === selectedClass.id ? {...c, studentCount: c.studentCount - 1} : c
        ));
      }
    } catch (error) {
      console.error('移除学生失败:', error);
    }
  };

  const handleAddStudent = async (studentData: any) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newClassStudent: ClassStudent = {
        id: Date.now().toString(),
        classId: selectedClass!.id,
        studentId: studentData.studentId,
        student: {
          id: Date.now().toString(),
          studentId: studentData.studentId,
          name: studentData.name,
          email: studentData.email,
          department: studentData.department,
          major: studentData.major,
          grade: studentData.grade,
          enrolledAt: new Date().toISOString(),
          status: 'active'
        },
        enrolledAt: new Date().toISOString(),
        status: 'active',
        performance: {
          averageScore: 0,
          attendanceRate: 100,
          assignmentCompletion: 100
        }
      };
      
      setClassStudents(prev => [...prev, newClassStudent]);
      
      // 更新班级学生数量
      if (selectedClass) {
        setSelectedClass(prev => prev ? {...prev, studentCount: prev.studentCount + 1} : null);
        setClasses(prev => prev.map(c => 
          c.id === selectedClass.id ? {...c, studentCount: c.studentCount + 1} : c
        ));
      }
      
      setShowAddStudent(false);
    } catch (error) {
      console.error('添加学生失败:', error);
    }
  };

  const filteredStudents = classStudents.filter(cs =>
    cs.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cs.student.studentId.includes(searchTerm)
  );

  if (user?.role !== 'teacher' && user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">访问被拒绝</h2>
          <p className="text-gray-600">您没有权限访问班级管理页面</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">班级管理</h1>
          <p className="text-gray-600">管理您的班级和学生信息</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 班级列表 */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">我的班级</h2>
              {loading ? (
                <div className="text-center py-4">加载中...</div>
              ) : (
                <div className="space-y-3">
                  {classes.map((classItem) => (
                    <div
                      key={classItem.id}
                      className={`p-4 rounded-lg cursor-pointer transition-colors ${
                        selectedClass?.id === classItem.id
                          ? 'bg-blue-50 border-2 border-blue-200'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => handleClassSelect(classItem)}
                    >
                      <h3 className="font-semibold text-gray-900">{classItem.name}</h3>
                      <p className="text-sm text-gray-600">{classItem.schedule}</p>
                      <p className="text-sm text-gray-500">
                        {classItem.studentCount}/{classItem.maxStudents} 学生
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* 学生列表 */}
          <div className="lg:col-span-2">
            {selectedClass ? (
              <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">{selectedClass.name} - 学生列表</h2>
                    <p className="text-gray-600">共 {selectedClass.studentCount} 名学生</p>
                  </div>
                  <Button onClick={() => setShowAddStudent(true)}>
                    添加学生
                  </Button>
                </div>

                {/* 搜索框 */}
                <div className="mb-6">
                  <Input
                    placeholder="搜索学生姓名或学号..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-md"
                  />
                </div>

                {/* 学生表格 */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          学生信息
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          专业年级
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          学习表现
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredStudents.map((classStudent) => (
                        <tr key={classStudent.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {classStudent.student.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {classStudent.student.studentId}
                              </div>
                              <div className="text-sm text-gray-500">
                                {classStudent.student.email}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{classStudent.student.major}</div>
                            <div className="text-sm text-gray-500">{classStudent.student.grade}级</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              平均分: {classStudent.performance.averageScore}
                            </div>
                            <div className="text-sm text-gray-500">
                              出勤率: {classStudent.performance.attendanceRate}%
                            </div>
                            <div className="text-sm text-gray-500">
                              作业完成率: {classStudent.performance.assignmentCompletion}%
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveStudent(classStudent.student.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              移除
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            ) : (
              <Card className="p-8 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">选择班级</h3>
                <p className="text-gray-600">请从左侧选择一个班级来查看学生列表</p>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* 添加学生对话框 */}
      <Dialog open={showAddStudent} onOpenChange={setShowAddStudent}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>添加学生</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleAddStudent({
                studentId: formData.get('studentId'),
                name: formData.get('name'),
                email: formData.get('email'),
                department: formData.get('department'),
                major: formData.get('major'),
                grade: formData.get('grade')
              });
            }}
            className="space-y-4"
          >
            <Input name="studentId" placeholder="学号" required />
            <Input name="name" placeholder="姓名" required />
            <Input name="email" type="email" placeholder="邮箱" required />
            <Input name="department" placeholder="院系" required />
            <Input name="major" placeholder="专业" required />
            <Input name="grade" placeholder="年级" required />
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddStudent(false)}
              >
                取消
              </Button>
              <Button type="submit">添加</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
