import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import type { CourseManagement } from '@/types';

export function CourseManagementPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseManagement[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseManagement | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'chapters' | 'students'>('info');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockCourses: CourseManagement[] = [
        {
          id: '1',
          code: 'CS101',
          name: '计算机科学导论',
          description: '计算机科学基础课程，涵盖计算机系统、编程基础、算法等核心概念',
          credits: 3,
          department: '计算机学院',
          category: '专业核心课',
          prerequisites: [],
          teacherIds: ['teacher_001'],
          teachers: [{
            id: 'teacher_001',
            employeeId: 'T001',
            name: '张教授',
            email: 'zhang@scu.edu.cn',
            department: '计算机学院',
            title: '教授',
            specialization: ['计算机科学', '算法设计'],
            hiredAt: '2020-01-01T00:00:00Z',
            status: 'active'
          }],
          semester: '2024春',
          year: '2024',
          maxStudents: 100,
          currentStudents: 85,
          schedule: '周一 8:00-10:00, 周三 14:00-16:00',
          classroom: '教学楼A101',
          syllabus: '本课程旨在为学生提供计算机科学的全面介绍...',
          objectives: [
            '理解计算机系统的基本原理',
            '掌握基本的编程技能',
            '了解算法和数据结构的基础概念'
          ],
          assessmentMethods: ['期末考试 50%', '平时作业 30%', '课堂参与 20%'],
          textbooks: [
            {
              title: '计算机科学导论',
              author: '作者名',
              isbn: '978-7-111-12345-6',
              required: true
            }
          ],
          chapters: [],
          status: 'published',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-07-20T10:00:00Z'
        },
        {
          id: '2',
          code: 'CS201',
          name: '数据结构与算法',
          description: '深入学习数据结构和算法设计与分析',
          credits: 4,
          department: '计算机学院',
          category: '专业核心课',
          prerequisites: ['CS101'],
          teacherIds: ['teacher_002'],
          teachers: [{
            id: 'teacher_002',
            employeeId: 'T002',
            name: '李教授',
            email: 'li@scu.edu.cn',
            department: '计算机学院',
            title: '副教授',
            specialization: ['数据结构', '算法设计'],
            hiredAt: '2019-01-01T00:00:00Z',
            status: 'active'
          }],
          semester: '2024春',
          year: '2024',
          maxStudents: 80,
          currentStudents: 72,
          schedule: '周二 10:00-12:00, 周四 16:00-18:00',
          classroom: '教学楼B203',
          syllabus: '本课程深入介绍各种数据结构和算法...',
          objectives: [
            '掌握常用数据结构的实现',
            '理解算法复杂度分析',
            '能够设计高效算法解决实际问题'
          ],
          assessmentMethods: ['期末考试 40%', '编程作业 40%', '课堂测验 20%'],
          textbooks: [
            {
              title: '数据结构与算法分析',
              author: '作者名',
              isbn: '978-7-111-23456-7',
              required: true
            }
          ],
          chapters: [],
          status: 'published',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-07-18T15:30:00Z'
        }
      ];
      
      setCourses(mockCourses);
    } catch (error) {
      console.error('获取课程数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (courseData: any) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCourse: CourseManagement = {
        id: Date.now().toString(),
        code: courseData.code,
        name: courseData.name,
        description: courseData.description,
        credits: parseInt(courseData.credits),
        department: courseData.department,
        category: courseData.category,
        prerequisites: [],
        teacherIds: [user!.id],
        teachers: [{
          id: user!.id,
          employeeId: 'T003',
          name: user!.username,
          email: user!.email,
          department: user!.department!,
          title: '教师',
          specialization: [],
          hiredAt: new Date().toISOString(),
          status: 'active'
        }],
        semester: courseData.semester,
        year: courseData.year,
        maxStudents: parseInt(courseData.maxStudents),
        currentStudents: 0,
        schedule: courseData.schedule,
        classroom: courseData.classroom,
        syllabus: courseData.syllabus,
        objectives: [],
        assessmentMethods: [],
        textbooks: [],
        chapters: [],
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setCourses(prev => [...prev, newCourse]);
      setShowCreateCourse(false);
    } catch (error) {
      console.error('创建课程失败:', error);
    }
  };

  const handleUpdateCourse = async (courseId: string, updates: Partial<CourseManagement>) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCourses(prev => prev.map(course => 
        course.id === courseId 
          ? { ...course, ...updates, updatedAt: new Date().toISOString() }
          : course
      ));
      
      if (selectedCourse && selectedCourse.id === courseId) {
        setSelectedCourse(prev => prev ? { ...prev, ...updates } : null);
      }
    } catch (error) {
      console.error('更新课程失败:', error);
    }
  };

  if (user?.role !== 'teacher' && user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">访问被拒绝</h2>
          <p className="text-gray-600">您没有权限访问课程管理页面</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">课程管理</h1>
            <p className="text-gray-600">管理您的课程信息和内容</p>
          </div>
          <Button onClick={() => setShowCreateCourse(true)}>
            创建新课程
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 课程列表 */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">我的课程</h2>
              {loading ? (
                <div className="text-center py-4">加载中...</div>
              ) : (
                <div className="space-y-3">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className={`p-4 rounded-lg cursor-pointer transition-colors ${
                        selectedCourse?.id === course.id
                          ? 'bg-blue-50 border-2 border-blue-200'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedCourse(course)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{course.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          course.status === 'published' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {course.status === 'published' ? '已发布' : '草稿'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{course.code}</p>
                      <p className="text-sm text-gray-500">
                        {course.currentStudents}/{course.maxStudents} 学生
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* 课程详情 */}
          <div className="lg:col-span-2">
            {selectedCourse ? (
              <Card className="p-6">
                {/* 标签页导航 */}
                <div className="border-b border-gray-200 mb-6">
                  <nav className="-mb-px flex space-x-8">
                    {[
                      { id: 'info', label: '基本信息' },
                      { id: 'chapters', label: '章节管理' },
                      { id: 'students', label: '学生管理' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>

                {activeTab === 'info' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          课程代码
                        </label>
                        <Input 
                          value={selectedCourse.code} 
                          onChange={(e) => handleUpdateCourse(selectedCourse.id, { code: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          课程名称
                        </label>
                        <Input 
                          value={selectedCourse.name}
                          onChange={(e) => handleUpdateCourse(selectedCourse.id, { name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          学分
                        </label>
                        <Input 
                          type="number"
                          value={selectedCourse.credits}
                          onChange={(e) => handleUpdateCourse(selectedCourse.id, { credits: parseInt(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          最大学生数
                        </label>
                        <Input 
                          type="number"
                          value={selectedCourse.maxStudents}
                          onChange={(e) => handleUpdateCourse(selectedCourse.id, { maxStudents: parseInt(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          教室
                        </label>
                        <Input 
                          value={selectedCourse.classroom}
                          onChange={(e) => handleUpdateCourse(selectedCourse.id, { classroom: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          课程安排
                        </label>
                        <Input 
                          value={selectedCourse.schedule}
                          onChange={(e) => handleUpdateCourse(selectedCourse.id, { schedule: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        课程描述
                      </label>
                      <textarea
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={4}
                        value={selectedCourse.description}
                        onChange={(e) => handleUpdateCourse(selectedCourse.id, { description: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        教学大纲
                      </label>
                      <textarea
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={6}
                        value={selectedCourse.syllabus}
                        onChange={(e) => handleUpdateCourse(selectedCourse.id, { syllabus: e.target.value })}
                      />
                    </div>

                    <div className="flex justify-end space-x-3">
                      <Button variant="outline">保存草稿</Button>
                      <Button 
                        onClick={() => handleUpdateCourse(selectedCourse.id, { status: 'published' })}
                        disabled={selectedCourse.status === 'published'}
                      >
                        {selectedCourse.status === 'published' ? '已发布' : '发布课程'}
                      </Button>
                    </div>
                  </div>
                )}

                {activeTab === 'chapters' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">章节管理</h3>
                      <Button>添加章节</Button>
                    </div>
                    <div className="text-center py-8 text-gray-500">
                      暂无章节，点击"添加章节"开始创建课程内容
                    </div>
                  </div>
                )}

                {activeTab === 'students' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">学生管理</h3>
                      <p className="text-gray-600">
                        当前学生数: {selectedCourse.currentStudents}/{selectedCourse.maxStudents}
                      </p>
                    </div>
                    <div className="text-center py-8 text-gray-500">
                      学生列表功能开发中...
                    </div>
                  </div>
                )}
              </Card>
            ) : (
              <Card className="p-8 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">选择课程</h3>
                <p className="text-gray-600">请从左侧选择一个课程来查看详细信息</p>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* 创建课程对话框 */}
      <Dialog open={showCreateCourse} onOpenChange={setShowCreateCourse}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>创建新课程</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleCreateCourse({
                code: formData.get('code'),
                name: formData.get('name'),
                description: formData.get('description'),
                credits: formData.get('credits'),
                department: formData.get('department'),
                category: formData.get('category'),
                semester: formData.get('semester'),
                year: formData.get('year'),
                maxStudents: formData.get('maxStudents'),
                schedule: formData.get('schedule'),
                classroom: formData.get('classroom'),
                syllabus: formData.get('syllabus')
              });
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="code" placeholder="课程代码 (如: CS101)" required />
              <Input name="name" placeholder="课程名称" required />
              <Input name="credits" type="number" placeholder="学分" required />
              <Input name="department" placeholder="院系" required />
              <Input name="category" placeholder="课程类别" required />
              <Input name="semester" placeholder="学期 (如: 2024春)" required />
              <Input name="year" placeholder="学年 (如: 2024)" required />
              <Input name="maxStudents" type="number" placeholder="最大学生数" required />
              <Input name="schedule" placeholder="课程安排" required />
              <Input name="classroom" placeholder="教室" required />
            </div>
            
            <Textarea
              name="description"
              placeholder="课程描述"
              rows={3}
              required
            />
            
            <Textarea
              name="syllabus"
              placeholder="教学大纲"
              rows={4}
            />
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateCourse(false)}
              >
                取消
              </Button>
              <Button type="submit">创建课程</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
