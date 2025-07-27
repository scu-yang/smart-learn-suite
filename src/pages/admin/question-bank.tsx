import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { QuestionEditorWorkspace } from '@/components/question-editor-workspace';
import { useAuth } from '@/hooks/useAuth';
import type { QuestionBank } from '@/types';

export function QuestionBankPage() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<QuestionBank[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<QuestionBank[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionBank | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);
  const [showEditWorkspace, setShowEditWorkspace] = useState(false);
  const [filters, setFilters] = useState({
    subject: '',
    chapter: '',
    difficulty: '',
    type: '',
    searchTerm: ''
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    filterQuestions();
  }, [questions, filters]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockQuestions: QuestionBank[] = [
        {
          id: '1',
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
          id: '2',
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
        },
        {
          id: '3',
          subject: '数据结构与算法',
          chapter: '第一章：数组与链表',
          difficulty: 'hard',
          type: 'essay',
          question: '请详细解释数组和链表的区别，并分析它们在时间复杂度和空间复杂度方面的优缺点。',
          correctAnswer: '数组和链表的主要区别在于内存存储方式和访问方式...',
          explanation: '这是一道综合性题目，考查学生对基础数据结构的深入理解。',
          score: 15,
          tags: ['数据结构', '时间复杂度', '空间复杂度'],
          createdBy: 'teacher_002',
          createdAt: '2024-02-01T09:00:00Z',
          updatedAt: '2024-02-01T09:00:00Z',
          usageCount: 8
        },
        {
          id: '4',
          subject: '数据结构与算法',
          chapter: '第二章：栈与队列',
          difficulty: 'medium',
          type: 'true-false',
          question: '栈是一种先进先出（FIFO）的数据结构。',
          correctAnswer: 'false',
          explanation: '栈是后进先出（LIFO）的数据结构，队列才是先进先出（FIFO）的数据结构。',
          score: 3,
          tags: ['栈', '队列', '数据结构'],
          createdBy: 'teacher_002',
          createdAt: '2024-02-05T11:00:00Z',
          updatedAt: '2024-02-05T11:00:00Z',
          usageCount: 20
        }
      ];
      
      setQuestions(mockQuestions);
    } catch (error) {
      console.error('获取题目数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterQuestions = () => {
    let filtered = questions;

    if (filters.subject) {
      filtered = filtered.filter(q => q.subject.includes(filters.subject));
    }
    if (filters.chapter) {
      filtered = filtered.filter(q => q.chapter.includes(filters.chapter));
    }
    if (filters.difficulty) {
      filtered = filtered.filter(q => q.difficulty === filters.difficulty);
    }
    if (filters.type) {
      filtered = filtered.filter(q => q.type === filters.type);
    }
    if (filters.searchTerm) {
      filtered = filtered.filter(q => 
        q.question.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        q.tags.some(tag => tag.toLowerCase().includes(filters.searchTerm.toLowerCase()))
      );
    }

    setFilteredQuestions(filtered);
  };

  const handleCreateQuestion = async (questionData: any) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newQuestion: QuestionBank = {
        id: Date.now().toString(),
        subject: questionData.subject,
        chapter: questionData.chapter,
        difficulty: questionData.difficulty,
        type: questionData.type,
        question: questionData.question,
        options: questionData.options,
        correctAnswer: questionData.correctAnswer,
        explanation: questionData.explanation,
        score: questionData.score,
        tags: questionData.tags || [],
        createdBy: user!.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 0
      };
      
      setQuestions(prev => [...prev, newQuestion]);
      setShowCreateWorkspace(false);
    } catch (error) {
      console.error('创建题目失败:', error);
    }
  };

  const handleUpdateQuestion = async (questionId: string, updates: any) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setQuestions(prev => prev.map(q => 
        q.id === questionId 
          ? { ...q, ...updates, updatedAt: new Date().toISOString() }
          : q
      ));
      
      if (selectedQuestion && selectedQuestion.id === questionId) {
        setSelectedQuestion(prev => prev ? { ...prev, ...updates } : null);
      }

      setShowEditWorkspace(false);
    } catch (error) {
      console.error('更新题目失败:', error);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('确定要删除这个题目吗？')) return;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setQuestions(prev => prev.filter(q => q.id !== questionId));
      if (selectedQuestion?.id === questionId) {
        setSelectedQuestion(null);
      }
    } catch (error) {
      console.error('删除题目失败:', error);
    }
  };

  if (user?.role !== 'teacher' && user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">访问被拒绝</h2>
          <p className="text-gray-600">您没有权限访问题库管理页面</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">题库管理</h1>
            <p className="text-gray-600">管理您的考试题目和组建题库</p>
          </div>
          <Button onClick={() => setShowCreateWorkspace(true)}>
            创建新题目
          </Button>
        </div>

        {/* 筛选器 */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">筛选条件</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Input
              placeholder="搜索题目..."
              value={filters.searchTerm}
              onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
            />
            <Input
              placeholder="科目"
              value={filters.subject}
              onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
            />
            <Input
              placeholder="章节"
              value={filters.chapter}
              onChange={(e) => setFilters(prev => ({ ...prev, chapter: e.target.value }))}
            />
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.difficulty}
              onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
            >
              <option value="">所有难度</option>
              <option value="easy">简单</option>
              <option value="medium">中等</option>
              <option value="hard">困难</option>
            </select>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            >
              <option value="">所有类型</option>
              <option value="single-choice">单选</option>
              <option value="multiple-choice">多选</option>
              <option value="true-false">判断</option>
              <option value="essay">问答</option>
            </select>
            <Button 
              variant="outline" 
              onClick={() => setFilters({ subject: '', chapter: '', difficulty: '', type: '', searchTerm: '' })}
            >
              清空筛选
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 题目列表 */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">题目列表</h2>
                <span className="text-gray-600">共 {filteredQuestions.length} 道题目</span>
              </div>
              
              {loading ? (
                <div className="text-center py-8">加载中...</div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {filteredQuestions.map((question) => (
                    <div
                      key={question.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedQuestion?.id === question.id
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-white hover:bg-gray-50 border-gray-200'
                      }`}
                      onClick={() => setSelectedQuestion(question)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900 flex-1 pr-4">
                          {question.question.length > 100 
                            ? question.question.substring(0, 100) + '...' 
                            : question.question}
                        </h3>
                        <div className="flex space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                            question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {question.difficulty === 'easy' ? '简单' :
                             question.difficulty === 'medium' ? '中等' : '困难'}
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                            {question.type === 'single-choice' ? '单选' :
                             question.type === 'multiple-choice' ? '多选' :
                             question.type === 'true-false' ? '判断' : '问答'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        {question.subject} · {question.chapter}
                      </div>
                      
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <div className="flex space-x-4">
                          <span>分值: {question.score}</span>
                          <span>使用次数: {question.usageCount}</span>
                        </div>
                        <div className="flex space-x-1">
                          {question.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* 题目详情 */}
          <div className="lg:col-span-1">
            {selectedQuestion ? (
              <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">题目详情</h2>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setShowEditWorkspace(true)}
                    >
                      编辑
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDeleteQuestion(selectedQuestion.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      删除
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">题目</label>
                    <p className="text-gray-900">{selectedQuestion.question}</p>
                  </div>
                  
                  {selectedQuestion.options && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">选项</label>
                      <div className="space-y-1">
                        {selectedQuestion.options.map((option, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-sm">
                              {String.fromCharCode(65 + index)}
                            </span>
                            <span className={
                              Array.isArray(selectedQuestion.correctAnswer)
                                ? selectedQuestion.correctAnswer.includes(option) ? 'text-green-600 font-medium' : 'text-gray-700'
                                : selectedQuestion.correctAnswer === option ? 'text-green-600 font-medium' : 'text-gray-700'
                            }>
                              {option}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">正确答案</label>
                    <p className="text-green-600 font-medium">
                      {Array.isArray(selectedQuestion.correctAnswer)
                        ? selectedQuestion.correctAnswer.join(', ')
                        : selectedQuestion.correctAnswer}
                    </p>
                  </div>
                  
                  {selectedQuestion.explanation && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">解析</label>
                      <p className="text-gray-700">{selectedQuestion.explanation}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">科目</label>
                      <p className="text-gray-900">{selectedQuestion.subject}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">章节</label>
                      <p className="text-gray-900">{selectedQuestion.chapter}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">难度</label>
                      <p className="text-gray-900">
                        {selectedQuestion.difficulty === 'easy' ? '简单' :
                         selectedQuestion.difficulty === 'medium' ? '中等' : '困难'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">分值</label>
                      <p className="text-gray-900">{selectedQuestion.score}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">标签</label>
                    <div className="flex flex-wrap gap-1">
                      {selectedQuestion.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-8 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">选择题目</h3>
                <p className="text-gray-600">请从左侧选择一个题目来查看详细信息</p>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* 题目编辑工作区 */}
      <QuestionEditorWorkspace
        open={showCreateWorkspace}
        onOpenChange={setShowCreateWorkspace}
        onSave={handleCreateQuestion}
        mode="create"
      />

      <QuestionEditorWorkspace
        open={showEditWorkspace}
        onOpenChange={setShowEditWorkspace}
        question={selectedQuestion}
        onSave={(data) => selectedQuestion && handleUpdateQuestion(selectedQuestion.id, data)}
        mode="edit"
      />
    </div>
  );
}
