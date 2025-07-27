import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Trophy, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Star,
  BarChart3,
  Download,
  Share
} from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useExamResult } from '@/hooks/useQueries';

interface ExamResultPageProps {
  examId: string;
  resultId: string;
}

export function ExamResultPage({ resultId }: ExamResultPageProps) {
  const { data: result, isLoading, error } = useExamResult(resultId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">正在计算成绩...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <CardTitle>无法获取成绩</CardTitle>
            <CardDescription>
              成绩数据加载失败，请稍后重试
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link to="/dashboard">
              <Button>返回仪表板</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getGradeInfo = (percentage: number) => {
    if (percentage >= 90) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-50' };
    if (percentage >= 80) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (percentage >= 70) return { grade: 'C', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (percentage >= 60) return { grade: 'D', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { grade: 'F', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const gradeInfo = getGradeInfo(result.percentage);
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}小时${minutes}分钟`;
    }
    return `${minutes}分钟`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <span className="ml-2 text-xl font-bold text-gray-900">考试成绩</span>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                导出成绩单
              </Button>
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                分享成绩
              </Button>
              <Link to="/dashboard">
                <Button>返回仪表板</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 成绩概览 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className={`text-center ${gradeInfo.bg} border-2`}>
            <CardContent className="pt-6">
              <div className={`text-4xl font-bold ${gradeInfo.color} mb-2`}>
                {gradeInfo.grade}
              </div>
              <p className="text-gray-600">成绩等级</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {result.score}
              </div>
              <p className="text-gray-600">总分 {result.totalScore}</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {result.percentage}%
              </div>
              <p className="text-gray-600">正确率</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {result.correctAnswers}/{result.totalQuestions}
              </div>
              <p className="text-gray-600">答对题数</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 详细信息 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 考试信息 */}
            <Card>
              <CardHeader>
                <CardTitle>考试详情</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-500 mr-2" />
                    <span>用时: {formatTime(result.timeSpent)}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-gray-500 mr-2" />
                    <span>提交时间: {new Date(result.submittedAt).toLocaleString('zh-CN')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 题目详情 */}
            <Card>
              <CardHeader>
                <CardTitle>答题详情</CardTitle>
                <CardDescription>
                  查看每道题的答题情况和解析
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {result.questionResults.map((questionResult, index) => (
                    <div 
                      key={questionResult.questionId}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">
                            第 {index + 1} 题
                          </span>
                          <span className="ml-2 text-sm text-gray-500">
                            ({questionResult.score}/{questionResult.maxScore} 分)
                          </span>
                        </div>
                        {questionResult.isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>

                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">你的答案: </span>
                          <span className={questionResult.isCorrect ? 'text-green-600' : 'text-red-600'}>
                            {Array.isArray(questionResult.userAnswer) 
                              ? questionResult.userAnswer.join(', ') 
                              : questionResult.userAnswer}
                          </span>
                        </div>
                        
                        {!questionResult.isCorrect && (
                          <div>
                            <span className="font-medium text-gray-700">正确答案: </span>
                            <span className="text-green-600">
                              {Array.isArray(questionResult.correctAnswer)
                                ? questionResult.correctAnswer.join(', ')
                                : questionResult.correctAnswer}
                            </span>
                          </div>
                        )}

                        <div className="text-gray-500">
                          答题用时: {Math.floor(questionResult.timeSpent / 60)}分{questionResult.timeSpent % 60}秒
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 统计分析 */}
          <div className="space-y-6">
            {/* 成绩分析 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  成绩分析
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>正确率</span>
                    <span>{result.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${result.percentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>总分:</span>
                    <span className="font-medium">{result.score}/{result.totalScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>答对题数:</span>
                    <span className="font-medium">{result.correctAnswers}/{result.totalQuestions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>用时:</span>
                    <span className="font-medium">{formatTime(result.timeSpent)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>平均每题用时:</span>
                    <span className="font-medium">
                      {Math.round(result.timeSpent / result.totalQuestions)}秒
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 建议 */}
            <Card>
              <CardHeader>
                <CardTitle>学习建议</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  {result.percentage >= 90 && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-green-800">
                        🎉 恭喜！您的成绩优秀，继续保持这样的学习状态。
                      </p>
                    </div>
                  )}
                  
                  {result.percentage >= 70 && result.percentage < 90 && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-blue-800">
                        👍 您的成绩良好，可以进一步复习错题来提高成绩。
                      </p>
                    </div>
                  )}
                  
                  {result.percentage >= 60 && result.percentage < 70 && (
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <p className="text-yellow-800">
                        💪 成绩及格，建议加强基础知识的学习和练习。
                      </p>
                    </div>
                  )}
                  
                  {result.percentage < 60 && (
                    <div className="p-3 bg-red-50 rounded-lg">
                      <p className="text-red-800">
                        📚 需要更多练习，建议重新学习相关章节内容。
                      </p>
                    </div>
                  )}

                  <div className="pt-3 border-t">
                    <Link to="/dashboard">
                      <Button variant="outline" className="w-full">
                        查看错题本
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
