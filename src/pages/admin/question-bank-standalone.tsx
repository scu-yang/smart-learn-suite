import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
import type { QuestionBank } from '@/types';

export function QuestionBankPage() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<QuestionBank[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<QuestionBank[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionBank | null>(null);
  const [loading, setLoading] = useState(true);
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

  const goToEditor = (questionId: string = 'new', type?: string) => {
    const params = type ? `?type=${type}` : '';
    window.location.href = `/admin/question-editor/${questionId}${params}`;
  };

  const goBack = () => {
    window.location.href = '/admin';
  };

  if (user?.role !== 'teacher' && user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">访问被拒绝</h2>
          <p className="text-gray-600">您没有权限访问题库管理</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={goBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>返回管理端</span>
              </Button>
              
              <div className="h-6 w-px bg-gray-300" />
              
              <h1 className="text-xl font-semibold text-gray-900">题库管理</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => goToEditor('new', 'single-choice')}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>创建题目</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* 筛选面板 */}
          <div className="col-span-3">
            <Card className="p-6">
              <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                筛选条件
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">科目</label>
                  <Input
                    placeholder="输入科目名称"
                    value={filters.subject}
                    onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">章节</label>
                  <Input
                    placeholder="输入章节名称"
                    value={filters.chapter}
                    onChange={(e) => setFilters(prev => ({ ...prev, chapter: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">难度</label>
                  <select
                    value={filters.difficulty}
                    onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">全部难度</option>
                    <option value="easy">简单</option>
                    <option value="medium">中等</option>
                    <option value="hard">困难</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">题型</label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">全部题型</option>
                    <option value="single-choice">单选题</option>
                    <option value="multiple-choice">多选题</option>
                    <option value="true-false">判断题</option>
                    <option value="essay">问答题</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">搜索</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="搜索题目内容或标签"
                      value={filters.searchTerm}
                      onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* 题目列表 */}
          <div className="col-span-6">
            <Card>
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">
                    题目列表 ({filteredQuestions.length})
                  </h3>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToEditor('new', 'single-choice')}
                    >
                      单选题
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToEditor('new', 'multiple-choice')}
                    >
                      多选题
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToEditor('new', 'math')}
                    >
                      数学题
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToEditor('new', 'essay')}
                    >
                      问答题
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="max-h-[600px] overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : filteredQuestions.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">没有找到符合条件的题目</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredQuestions.map((question) => (
                      <div
                        key={question.id}
                        className={`p-4 cursor-pointer hover:bg-gray-50 ${
                          selectedQuestion?.id === question.id ? 'bg-blue-50 border-r-4 border-blue-600' : ''
                        }`}
                        onClick={() => setSelectedQuestion(question)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                                question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {question.difficulty === 'easy' ? '简单' :
                                 question.difficulty === 'medium' ? '中等' : '困难'}
                              </span>
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                                {question.type === 'single-choice' ? '单选题' :
                                 question.type === 'multiple-choice' ? '多选题' :
                                 question.type === 'true-false' ? '判断题' : '问答题'}
                              </span>
                              <span className="text-xs text-gray-500">{question.score}分</span>
                            </div>
                            
                            <p className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                              {question.question}
                            </p>
                            
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>{question.subject}</span>
                              <span>{question.chapter}</span>
                              <span>使用次数: {question.usageCount}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1 ml-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedQuestion(question);
                              }}
                              title="查看详情"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                goToEditor(question.id);
                              }}
                              title="编辑"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteQuestion(question.id);
                              }}
                              className="text-red-600 hover:text-red-700"
                              title="删除"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* 题目详情 */}
          <div className="col-span-3">
            {selectedQuestion ? (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">题目详情</h3>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => goToEditor(selectedQuestion.id)}
                      title="编辑题目"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">题目内容</label>
                    <p className="text-sm text-gray-900">{selectedQuestion.question}</p>
                  </div>
                  
                  {selectedQuestion.options && selectedQuestion.options.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">选项</label>
                      <div className="space-y-1">
                        {selectedQuestion.options.map((option, index) => (
                          <p key={index} className="text-sm text-gray-700">
                            {String.fromCharCode(65 + index)}. {option}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">正确答案</label>
                    <p className="text-sm text-green-600 font-medium">
                      {Array.isArray(selectedQuestion.correctAnswer)
                        ? selectedQuestion.correctAnswer.join(', ')
                        : selectedQuestion.correctAnswer}
                    </p>
                  </div>
                  
                  {selectedQuestion.explanation && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">解析</label>
                      <p className="text-sm text-gray-700">{selectedQuestion.explanation}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 gap-3 text-sm">
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
    </div>
  );
}
