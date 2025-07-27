import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import type { ExamManagement, QuestionBank, ExamStatistics } from '@/types';

export function ExamManagementPage() {
  const { user } = useAuth();
  const [exams, setExams] = useState<ExamManagement[]>([]);
  const [selectedExam, setSelectedExam] = useState<ExamManagement | null>(null);
  const [examStats, setExamStats] = useState<ExamStatistics | null>(null);
  const [questionBank, setQuestionBank] = useState<QuestionBank[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateExam, setShowCreateExam] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'questions' | 'statistics'>('info');

  useEffect(() => {
    fetchExams();
    fetchQuestionBank();
  }, []);

  const fetchExams = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockExams: ExamManagement[] = [
        {
          id: '1',
          title: '计算机科学导论期末考试',
          courseId: '1',
          courseName: '计算机科学导论',
          description: '本学期计算机科学导论课程的期末考试',
          duration: 120,
          totalScore: 100,
          startTime: '2024-07-25T09:00:00Z',
          endTime: '2024-07-25T11:00:00Z',
          instructions: '请仔细阅读题目，合理分配时间。考试期间不允许交流。',
          questionIds: ['q1', 'q2', 'q3'],
          allowedClasses: ['1', '2'],
          status: 'scheduled',
          createdBy: 'teacher_001',
          createdAt: '2024-07-15T10:00:00Z',
          updatedAt: '2024-07-20T14:30:00Z',
          settings: {
            shuffleQuestions: true,
            shuffleOptions: true,
            showResultsImmediately: false,
            allowRetake: false,
            maxAttempts: 1,
            requireCamera: true,
            requireFullscreen: true
          }
        },
        {
          id: '2',
          title: '数据结构单元测试',
          courseId: '2',
          courseName: '数据结构与算法',
          description: '第一单元：基础数据结构测试',
          duration: 60,
          totalScore: 50,
          startTime: '2024-07-22T14:00:00Z',
          endTime: '2024-07-22T15:00:00Z',
          instructions: '本次测试重点考查基础数据结构的理解和应用。',
          questionIds: ['q4', 'q5'],
          allowedClasses: ['2'],
          status: 'completed',
          createdBy: 'teacher_002',
          createdAt: '2024-07-10T09:00:00Z',
          updatedAt: '2024-07-22T16:00:00Z',
          settings: {
            shuffleQuestions: false,
            shuffleOptions: false,
            showResultsImmediately: true,
            allowRetake: true,
            maxAttempts: 2,
            requireCamera: false,
            requireFullscreen: false
          }
        }
      ];
      
      setExams(mockExams);
    } catch (error) {
      console.error('获取考试数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestionBank = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockQuestions: QuestionBank[] = [
        {
          id: 'q1',
          subject: '计算机科学导论',
          chapter: '第一章：计算机基础',
          difficulty: 'easy',
          type: 'single-choice',
          question: '计算机的基本组成包括哪些部分？',
          options: ['输入设备、输出设备、存储器、运算器、控制器', '键盘、鼠标、显示器', '软件和硬件', '程序和数据'],
          correctAnswer: '输入设备、输出设备、存储器、运算器、控制器',
          explanation: '计算机的基本组成包括五大部分：输入设备、输出设备、存储器、运算器和控制器。',
          score: 5,
          tags: ['计算机组成', '基础概念'],
          createdBy: 'teacher_001',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
          usageCount: 15
        },
        {
          id: 'q2',
          subject: '计算机科学导论',
          chapter: '第二章：编程基础',
          difficulty: 'medium',
          type: 'multiple-choice',
          question: '以下哪些是编程语言？（多选）',
          options: ['Python', 'HTML', 'Java', 'CSS', 'C++'],
          correctAnswer: ['Python', 'Java', 'C++'],
          explanation: 'Python、Java和C++是编程语言，而HTML和CSS是标记语言和样式表语言。',
          score: 8,
          tags: ['编程语言', '基础概念'],
          createdBy: 'teacher_001',
          createdAt: '2024-01-20T14:00:00Z',
          updatedAt: '2024-01-20T14:00:00Z',
          usageCount: 12
        }
      ];
      
      setQuestionBank(mockQuestions);
    } catch (error) {
      console.error('获取题库数据失败:', error);
    }
  };

  const fetchExamStatistics = async (examId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockStats: ExamStatistics = {
        examId: examId,
        totalParticipants: 85,
        completedCount: 82,
        averageScore: 78.5,
        maxScore: 95,
        minScore: 45,
        passRate: 85.4,
        scoreDistribution: [
          { range: '90-100', count: 15, percentage: 18.3 },
          { range: '80-89', count: 25, percentage: 30.5 },
          { range: '70-79', count: 20, percentage: 24.4 },
          { range: '60-69', count: 15, percentage: 18.3 },
          { range: '0-59', count: 7, percentage: 8.5 }
        ],
        questionStatistics: [
          { questionId: 'q1', correctRate: 85.4, averageTime: 45, difficulty: 0.8 },
          { questionId: 'q2', correctRate: 72.0, averageTime: 120, difficulty: 0.6 }
        ],
        timeStatistics: {
          averageTime: 95,
          maxTime: 120,
          minTime: 65
        }
      };
      
      setExamStats(mockStats);
    } catch (error) {
      console.error('获取考试统计失败:', error);
    }
  };

  const handleCreateExam = async (examData: any) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newExam: ExamManagement = {
        id: Date.now().toString(),
        title: examData.title,
        courseId: examData.courseId,
        courseName: examData.courseName,
        description: examData.description,
        duration: parseInt(examData.duration),
        totalScore: 0,
        startTime: examData.startTime,
        endTime: examData.endTime,
        instructions: examData.instructions,
        questionIds: [],
        allowedClasses: examData.allowedClasses || [],
        status: 'draft',
        createdBy: user!.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        settings: {
          shuffleQuestions: examData.shuffleQuestions || false,
          shuffleOptions: examData.shuffleOptions || false,
          showResultsImmediately: examData.showResultsImmediately || false,
          allowRetake: examData.allowRetake || false,
          maxAttempts: parseInt(examData.maxAttempts) || 1,
          requireCamera: examData.requireCamera || false,
          requireFullscreen: examData.requireFullscreen || false
        }
      };
      
      setExams(prev => [...prev, newExam]);
      setShowCreateExam(false);
    } catch (error) {
      console.error('创建考试失败:', error);
    }
  };

  const handleUpdateExam = async (examId: string, updates: Partial<ExamManagement>) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setExams(prev => prev.map(exam => 
        exam.id === examId 
          ? { ...exam, ...updates, updatedAt: new Date().toISOString() }
          : exam
      ));
      
      if (selectedExam && selectedExam.id === examId) {
        setSelectedExam(prev => prev ? { ...prev, ...updates } : null);
      }
    } catch (error) {
      console.error('更新考试失败:', error);
    }
  };

  const handleSelectExam = (exam: ExamManagement) => {
    setSelectedExam(exam);
    if (exam.status === 'completed') {
      fetchExamStatistics(exam.id);
    }
  };

  if (user?.role !== 'teacher' && user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">访问被拒绝</h2>
          <p className="text-gray-600">您没有权限访问考试管理页面</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">考试管理</h1>
            <p className="text-gray-600">管理您的考试安排和题目组卷</p>
          </div>
          <Button onClick={() => setShowCreateExam(true)}>
            创建新考试
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 考试列表 */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">考试列表</h2>
              {loading ? (
                <div className="text-center py-4">加载中...</div>
              ) : (
                <div className="space-y-3">
                  {exams.map((exam) => (
                    <div
                      key={exam.id}
                      className={`p-4 rounded-lg cursor-pointer transition-colors ${
                        selectedExam?.id === exam.id
                          ? 'bg-blue-50 border-2 border-blue-200'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => handleSelectExam(exam)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm">{exam.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          exam.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                          exam.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                          exam.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {exam.status === 'completed' ? '已完成' :
                           exam.status === 'ongoing' ? '进行中' :
                           exam.status === 'scheduled' ? '已安排' : '草稿'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{exam.courseName}</p>
                      <p className="text-sm text-gray-500">
                        {exam.duration}分钟 · {exam.totalScore}分
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* 考试详情 */}
          <div className="lg:col-span-2">
            {selectedExam ? (
              <Card className="p-6">
                {/* 标签页导航 */}
                <div className="border-b border-gray-200 mb-6">
                  <nav className="-mb-px flex space-x-8">
                    {[
                      { id: 'info', label: '考试信息' },
                      { id: 'questions', label: '题目管理' },
                      { id: 'statistics', label: '考试统计', disabled: selectedExam.status !== 'completed' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => !tab.disabled && setActiveTab(tab.id as any)}
                        disabled={tab.disabled}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : tab.disabled
                            ? 'border-transparent text-gray-300 cursor-not-allowed'
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
                          考试标题
                        </label>
                        <Input 
                          value={selectedExam.title}
                          onChange={(e) => handleUpdateExam(selectedExam.id, { title: e.target.value })}
                          disabled={selectedExam.status !== 'draft'}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          考试时长（分钟）
                        </label>
                        <Input 
                          type="number"
                          value={selectedExam.duration}
                          onChange={(e) => handleUpdateExam(selectedExam.id, { duration: parseInt(e.target.value) })}
                          disabled={selectedExam.status !== 'draft'}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          开始时间
                        </label>
                        <Input 
                          type="datetime-local"
                          value={selectedExam.startTime.slice(0, 16)}
                          onChange={(e) => handleUpdateExam(selectedExam.id, { startTime: e.target.value + ':00Z' })}
                          disabled={selectedExam.status !== 'draft'}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          结束时间
                        </label>
                        <Input 
                          type="datetime-local"
                          value={selectedExam.endTime.slice(0, 16)}
                          onChange={(e) => handleUpdateExam(selectedExam.id, { endTime: e.target.value + ':00Z' })}
                          disabled={selectedExam.status !== 'draft'}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        考试说明
                      </label>
                      <textarea
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={4}
                        value={selectedExam.instructions}
                        onChange={(e) => handleUpdateExam(selectedExam.id, { instructions: e.target.value })}
                        disabled={selectedExam.status !== 'draft'}
                      />
                    </div>

                    {/* 考试设置 */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">考试设置</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedExam.settings.shuffleQuestions}
                            onChange={(e) => handleUpdateExam(selectedExam.id, {
                              settings: { ...selectedExam.settings, shuffleQuestions: e.target.checked }
                            })}
                            disabled={selectedExam.status !== 'draft'}
                          />
                          <span className="text-sm">随机题目顺序</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedExam.settings.shuffleOptions}
                            onChange={(e) => handleUpdateExam(selectedExam.id, {
                              settings: { ...selectedExam.settings, shuffleOptions: e.target.checked }
                            })}
                            disabled={selectedExam.status !== 'draft'}
                          />
                          <span className="text-sm">随机选项顺序</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedExam.settings.showResultsImmediately}
                            onChange={(e) => handleUpdateExam(selectedExam.id, {
                              settings: { ...selectedExam.settings, showResultsImmediately: e.target.checked }
                            })}
                            disabled={selectedExam.status !== 'draft'}
                          />
                          <span className="text-sm">立即显示结果</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedExam.settings.requireCamera}
                            onChange={(e) => handleUpdateExam(selectedExam.id, {
                              settings: { ...selectedExam.settings, requireCamera: e.target.checked }
                            })}
                            disabled={selectedExam.status !== 'draft'}
                          />
                          <span className="text-sm">要求摄像头监控</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <Button variant="outline">保存草稿</Button>
                      <Button 
                        onClick={() => handleUpdateExam(selectedExam.id, { status: 'scheduled' })}
                        disabled={selectedExam.status !== 'draft' || selectedExam.questionIds.length === 0}
                      >
                        发布考试
                      </Button>
                    </div>
                  </div>
                )}

                {activeTab === 'questions' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">题目管理</h3>
                      <Button>从题库选择</Button>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="font-medium mb-2">已选择的题目 ({selectedExam.questionIds.length})</h4>
                      {selectedExam.questionIds.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                          暂无题目，点击"从题库选择"添加题目
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {selectedExam.questionIds.map((questionId, index) => {
                            const question = questionBank.find(q => q.id === questionId);
                            return question ? (
                              <Card key={questionId} className="p-4">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <p className="font-medium">题目 {index + 1}: {question.question}</p>
                                    <p className="text-sm text-gray-600 mt-1">
                                      类型: {question.type === 'single-choice' ? '单选' : 
                                            question.type === 'multiple-choice' ? '多选' : 
                                            question.type === 'true-false' ? '判断' : '问答'} · 
                                      分值: {question.score} · 
                                      难度: {question.difficulty === 'easy' ? '简单' : 
                                            question.difficulty === 'medium' ? '中等' : '困难'}
                                    </p>
                                  </div>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => {
                                      const newQuestionIds = selectedExam.questionIds.filter(id => id !== questionId);
                                      const newTotalScore = newQuestionIds.reduce((sum, id) => {
                                        const q = questionBank.find(q => q.id === id);
                                        return sum + (q?.score || 0);
                                      }, 0);
                                      handleUpdateExam(selectedExam.id, { 
                                        questionIds: newQuestionIds,
                                        totalScore: newTotalScore
                                      });
                                    }}
                                    disabled={selectedExam.status !== 'draft'}
                                  >
                                    移除
                                  </Button>
                                </div>
                              </Card>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">题库预览</h4>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {questionBank.filter(q => !selectedExam.questionIds.includes(q.id)).map((question) => (
                          <Card key={question.id} className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="font-medium">{question.question}</p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {question.subject} · {question.chapter} · 
                                  分值: {question.score} · 
                                  使用次数: {question.usageCount}
                                </p>
                              </div>
                              <Button 
                                size="sm"
                                onClick={() => {
                                  const newQuestionIds = [...selectedExam.questionIds, question.id];
                                  const newTotalScore = selectedExam.totalScore + question.score;
                                  handleUpdateExam(selectedExam.id, { 
                                    questionIds: newQuestionIds,
                                    totalScore: newTotalScore
                                  });
                                }}
                                disabled={selectedExam.status !== 'draft'}
                              >
                                添加
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'statistics' && examStats && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Card className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{examStats.totalParticipants}</div>
                        <div className="text-sm text-gray-600">总参与人数</div>
                      </Card>
                      <Card className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">{examStats.completedCount}</div>
                        <div className="text-sm text-gray-600">完成人数</div>
                      </Card>
                      <Card className="p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">{examStats.averageScore}</div>
                        <div className="text-sm text-gray-600">平均分</div>
                      </Card>
                      <Card className="p-4 text-center">
                        <div className="text-2xl font-bold text-orange-600">{examStats.passRate}%</div>
                        <div className="text-sm text-gray-600">及格率</div>
                      </Card>
                    </div>

                    <Card className="p-6">
                      <h4 className="font-medium mb-4">分数分布</h4>
                      <div className="space-y-2">
                        {examStats.scoreDistribution.map((dist, index) => (
                          <div key={index} className="flex items-center space-x-4">
                            <div className="w-16 text-sm">{dist.range}</div>
                            <div className="flex-1 bg-gray-200 rounded-full h-4">
                              <div 
                                className="bg-blue-500 h-4 rounded-full" 
                                style={{ width: `${dist.percentage}%` }}
                              />
                            </div>
                            <div className="w-16 text-sm text-right">{dist.count}人</div>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card className="p-6">
                      <h4 className="font-medium mb-4">题目分析</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">题目</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">正确率</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">平均用时</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">难度系数</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {examStats.questionStatistics.map((stat, index) => {
                              const question = questionBank.find(q => q.id === stat.questionId);
                              return (
                                <tr key={stat.questionId}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    题目 {index + 1}: {question?.question.substring(0, 30)}...
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {stat.correctRate}%
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {stat.averageTime}秒
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {stat.difficulty}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  </div>
                )}
              </Card>
            ) : (
              <Card className="p-8 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">选择考试</h3>
                <p className="text-gray-600">请从左侧选择一个考试来查看详细信息</p>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* 创建考试对话框 */}
      <Dialog open={showCreateExam} onOpenChange={setShowCreateExam}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>创建新考试</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleCreateExam({
                title: formData.get('title'),
                courseId: formData.get('courseId'),
                courseName: formData.get('courseName'),
                description: formData.get('description'),
                duration: formData.get('duration'),
                startTime: formData.get('startTime'),
                endTime: formData.get('endTime'),
                instructions: formData.get('instructions'),
                shuffleQuestions: formData.get('shuffleQuestions') === 'on',
                shuffleOptions: formData.get('shuffleOptions') === 'on',
                showResultsImmediately: formData.get('showResultsImmediately') === 'on',
                requireCamera: formData.get('requireCamera') === 'on',
                maxAttempts: formData.get('maxAttempts')
              });
            }}
            className="space-y-4"
          >
            <Input name="title" placeholder="考试标题" required />
            <div className="grid grid-cols-2 gap-4">
              <Input name="courseId" placeholder="课程ID" required />
              <Input name="courseName" placeholder="课程名称" required />
            </div>
            <Input name="duration" type="number" placeholder="考试时长（分钟）" required />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">开始时间</label>
                <Input name="startTime" type="datetime-local" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">结束时间</label>
                <Input name="endTime" type="datetime-local" required />
              </div>
            </div>
            
            <Textarea
              name="description"
              placeholder="考试描述"
              rows={3}
              required
            />
            
            <Textarea
              name="instructions"
              placeholder="考试说明"
              rows={3}
            />

            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="shuffleQuestions" />
                <span className="text-sm">随机题目顺序</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="requireCamera" />
                <span className="text-sm">要求摄像头监控</span>
              </label>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateExam(false)}
              >
                取消
              </Button>
              <Button type="submit">创建考试</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
