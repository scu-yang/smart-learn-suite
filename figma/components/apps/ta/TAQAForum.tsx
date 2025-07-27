import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  MessageSquare, 
  Search, 
  Filter,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { QuestionCard } from './components/QuestionCard';
import { QuestionDetail } from './components/QuestionDetail';
import { filterQuestions } from './utils/forumUtils';
import { mockQuestions } from './data/mockForumData';

export function TAQAForum() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [questions, setQuestions] = useState(mockQuestions);

  const filteredQuestions = filterQuestions(questions, searchQuery, statusFilter, courseFilter);
  
  const selectedQuestionData = selectedQuestion ? 
    questions.find(q => q.id === selectedQuestion) : null;

  const stats = {
    total: questions.length,
    pending: questions.filter(q => q.status === 'pending').length,
    answered: questions.filter(q => q.status === 'answered').length,
    resolved: questions.filter(q => q.status === 'resolved').length
  };

  const handleReply = (content: string) => {
    if (selectedQuestion) {
      // Mock adding reply
      setQuestions(prev => prev.map(q => 
        q.id === selectedQuestion 
          ? {
              ...q,
              replies: [...q.replies, {
                id: Date.now().toString(),
                content,
                author: { name: '当前助教', role: 'ta' as const },
                createdAt: new Date().toISOString(),
                likes: 0
              }],
              status: 'answered' as const
            }
          : q
      ));
    }
  };

  const handleMarkResolved = (questionId: string) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId ? { ...q, status: 'resolved' as const } : q
    ));
  };

  if (selectedQuestionData) {
    return (
      <div className="p-6">
        <QuestionDetail
          question={selectedQuestionData}
          onBack={() => setSelectedQuestion(null)}
          onReply={handleReply}
          onMarkResolved={handleMarkResolved}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold mb-2">学生答疑</h1>
        <p className="text-muted-foreground">
          回复学生提问，提供学习指导和答疑服务
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">总问题数</p>
                <p className="text-2xl font-semibold">{stats.total}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">待回复</p>
                <p className="text-2xl font-semibold text-red-600">{stats.pending}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">已回复</p>
                <p className="text-2xl font-semibold text-blue-600">{stats.answered}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">已解决</p>
                <p className="text-2xl font-semibold text-green-600">{stats.resolved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索问题、内容或标签..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="pending">待回复</SelectItem>
                  <SelectItem value="answered">已回复</SelectItem>
                  <SelectItem value="resolved">已解决</SelectItem>
                </SelectContent>
              </Select>
              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="课程" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部课程</SelectItem>
                  <SelectItem value="线性代数">线性代数</SelectItem>
                  <SelectItem value="微积分基础">微积分基础</SelectItem>
                  <SelectItem value="高等数学">高等数学</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">没有找到匹配的问题</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onSelect={setSelectedQuestion}
              onReply={setSelectedQuestion}
            />
          ))
        )}
      </div>
    </div>
  );
}