import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Send,
  AlertTriangle
} from 'lucide-react';
import { useRouter } from '@tanstack/react-router';
import { useExamPaper } from '@/hooks/useQueries';
import { api } from '@/lib/api';
import type { UserAnswer } from '@/types';

interface ExamPageProps {
  examId: string;
  sessionId: string;
}

export function ExamPage({ examId, sessionId }: ExamPageProps) {
  const router = useRouter();
  const { data: paper, isLoading } = useExamPaper(examId);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, UserAnswer>>({});
  const [timeRemaining, setTimeRemaining] = useState(7200); // 120分钟
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 倒计时
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // 时间到，自动提交
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 格式化时间显示
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 保存答案
  const saveAnswer = useCallback(async (questionId: string, answer: string | string[]) => {
    const userAnswer: UserAnswer = {
      questionId,
      answer,
      timeSpent: 0 // 简化实现，实际应该计算答题时间
    };

    setAnswers(prev => ({
      ...prev,
      [questionId]: userAnswer
    }));

    setIsSaving(true);
    try {
      // 模拟保存答案
      // await api.saveAnswer(sessionId, userAnswer);
      console.log('保存答案:', userAnswer);
    } catch (error) {
      console.error('保存答案失败:', error);
    } finally {
      setIsSaving(false);
    }
  }, [sessionId]);

  // 处理单选题答案
  const handleSingleChoice = (questionId: string, value: string) => {
    saveAnswer(questionId, value);
  };

  // 处理多选题答案
  const handleMultipleChoice = (questionId: string, option: string, checked: boolean) => {
    const currentAnswer = answers[questionId]?.answer as string[] || [];
    let newAnswer: string[];
    
    if (checked) {
      newAnswer = [...currentAnswer, option];
    } else {
      newAnswer = currentAnswer.filter(item => item !== option);
    }
    
    saveAnswer(questionId, newAnswer);
  };

  // 处理判断题答案
  const handleTrueFalse = (questionId: string, value: string) => {
    saveAnswer(questionId, value);
  };

  // 处理简答题答案
  const handleEssay = (questionId: string, value: string) => {
    saveAnswer(questionId, value);
  };

  // 提交考试
  const handleSubmitExam = async () => {
    setIsSubmitting(true);
    try {
      const result = await api.submitExam(sessionId);
      router.navigate({ 
        to: `/exam/${examId}/result/${result.id}` 
      });
    } catch (error) {
      console.error('提交考试失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载试卷中...</p>
        </div>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <CardTitle>试卷加载失败</CardTitle>
            <CardDescription>
              无法加载试卷内容，请刷新页面重试
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const currentQuestion = paper.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / paper.questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 考试头部 */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{paper.title}</h1>
              <p className="text-sm text-gray-600">
                第 {currentQuestionIndex + 1} 题 / 共 {paper.questions.length} 题
              </p>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center text-sm text-gray-600">
                <Save className="h-4 w-4 mr-1" />
                {isSaving ? '保存中...' : '已保存'}
              </div>
              
              <div className="flex items-center text-lg font-mono">
                <Clock className="h-5 w-5 mr-2 text-red-500" />
                <span className={timeRemaining < 600 ? 'text-red-500' : 'text-gray-900'}>
                  {formatTime(timeRemaining)}
                </span>
              </div>

              <Button 
                onClick={() => setShowSubmitDialog(true)}
                variant="outline"
                size="sm"
              >
                <Send className="h-4 w-4 mr-2" />
                提交考试
              </Button>
            </div>
          </div>
          
          {/* 进度条 */}
          <div className="pb-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 题目导航 */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">题目导航</CardTitle>
                <CardDescription>
                  已答 {answeredCount} / {paper.questions.length} 题
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {paper.questions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestionIndex(index)}
                      className={`
                        w-10 h-10 rounded text-sm font-medium transition-colors
                        ${currentQuestionIndex === index 
                          ? 'bg-blue-600 text-white' 
                          : answers[paper.questions[index].id]
                            ? 'bg-green-100 text-green-800 border border-green-300'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                      `}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 题目内容 */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">
                      第 {currentQuestionIndex + 1} 题 
                      <span className="ml-2 text-sm font-normal text-gray-500">
                        ({currentQuestion.score} 分)
                      </span>
                    </CardTitle>
                    <CardDescription className="mt-2">
                      <span className={`inline-block px-2 py-1 rounded text-xs ${
                        currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                        currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {currentQuestion.difficulty === 'easy' ? '简单' : 
                         currentQuestion.difficulty === 'medium' ? '中等' : '困难'}
                      </span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="text-lg leading-relaxed">
                  {currentQuestion.question}
                </div>

                {/* 答题区域 */}
                <div className="space-y-4">
                  {currentQuestion.type === 'single-choice' && currentQuestion.options && (
                    <div className="space-y-3">
                      {currentQuestion.options.map((option, index) => (
                        <label key={index} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name={`question-${currentQuestion.id}`}
                            value={option}
                            checked={answers[currentQuestion.id]?.answer === option}
                            onChange={(e) => handleSingleChoice(currentQuestion.id, e.target.value)}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
                    <div className="space-y-3">
                      {currentQuestion.options.map((option, index) => (
                        <label key={index} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            value={option}
                            checked={
                              Array.isArray(answers[currentQuestion.id]?.answer) && 
                              (answers[currentQuestion.id].answer as string[]).includes(option)
                            }
                            onChange={(e) => handleMultipleChoice(currentQuestion.id, option, e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {currentQuestion.type === 'true-false' && (
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name={`question-${currentQuestion.id}`}
                          value="true"
                          checked={answers[currentQuestion.id]?.answer === 'true'}
                          onChange={(e) => handleTrueFalse(currentQuestion.id, e.target.value)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">正确</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name={`question-${currentQuestion.id}`}
                          value="false"
                          checked={answers[currentQuestion.id]?.answer === 'false'}
                          onChange={(e) => handleTrueFalse(currentQuestion.id, e.target.value)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">错误</span>
                      </label>
                    </div>
                  )}

                  {currentQuestion.type === 'essay' && (
                    <textarea
                      className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="请在此输入您的答案..."
                      value={answers[currentQuestion.id]?.answer as string || ''}
                      onChange={(e) => handleEssay(currentQuestion.id, e.target.value)}
                    />
                  )}
                </div>

                {/* 导航按钮 */}
                <div className="flex justify-between pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                    disabled={currentQuestionIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    上一题
                  </Button>

                  <Button
                    onClick={() => setCurrentQuestionIndex(Math.min(paper.questions.length - 1, currentQuestionIndex + 1))}
                    disabled={currentQuestionIndex === paper.questions.length - 1}
                  >
                    下一题
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* 提交确认对话框 */}
      {showSubmitDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-6 w-6 text-yellow-500 mr-2" />
                确认提交考试
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>您确定要提交考试吗？提交后将无法修改答案。</p>
              <div className="text-sm text-gray-600">
                <p>已答题数: {answeredCount} / {paper.questions.length}</p>
                <p>剩余时间: {formatTime(timeRemaining)}</p>
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowSubmitDialog(false)}
                  className="flex-1"
                >
                  取消
                </Button>
                <Button
                  onClick={handleSubmitExam}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? '提交中...' : '确认提交'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
