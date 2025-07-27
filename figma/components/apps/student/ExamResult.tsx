import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { CheckCircle2, Clock, FileText, ArrowLeft } from 'lucide-react';

export function ExamResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const { examId, answers } = location.state || {};

  const submissionTime = new Date().toLocaleString('zh-CN');
  const questionCount = Object.keys(answers || {}).length;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* 成功提示 */}
        <Card className="border-chart-2 bg-chart-2/5">
          <CardContent className="p-8 text-center">
            <CheckCircle2 className="w-16 h-16 text-chart-2 mx-auto mb-4" />
            <h1 className="text-2xl font-medium mb-2">考试提交成功</h1>
            <p className="text-muted-foreground">
              您的答案已成功提交，请等待系统阅卷
            </p>
          </CardContent>
        </Card>

        {/* 提交信息 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              提交详情
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-muted-foreground">考试名称</span>
                  <p className="font-medium">高等数学期中考试</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">提交时间</span>
                  <p className="font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {submissionTime}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-muted-foreground">答题数量</span>
                  <p className="font-medium">{questionCount} / 5 题</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">状态</span>
                  <Badge className="bg-chart-2/20 text-chart-2">
                    等待阅卷
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 重要提醒 */}
        <Card>
          <CardHeader>
            <CardTitle>重要提醒</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <p className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-chart-1 text-white text-xs flex items-center justify-center mt-0.5 flex-shrink-0">1</span>
                考试结果将在 24-48 小时内公布，请关注系统通知
              </p>
              <p className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-chart-1 text-white text-xs flex items-center justify-center mt-0.5 flex-shrink-0">2</span>
                您可以在"我的考试"页面查看考试状态和成绩
              </p>
              <p className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-chart-1 text-white text-xs flex items-center justify-center mt-0.5 flex-shrink-0">3</span>
                如有疑问，请及时联系任课教师
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" onClick={() => navigate('/exams')} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            返回考试列表
          </Button>
          <Button onClick={() => navigate('/dashboard')} className="gap-2">
            <FileText className="w-4 h-4" />
            返回首页
          </Button>
        </div>
      </div>
    </div>
  );
}