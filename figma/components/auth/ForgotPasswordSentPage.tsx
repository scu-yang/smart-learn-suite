import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { CheckCircle, Mail, Clock, ArrowLeft } from 'lucide-react';

export function ForgotPasswordSentPage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = () => {
    setCountdown(60);
    // Mock resend logic - replace with actual API call
    console.log('Resending email to:', email);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-4 pb-6">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-center">
              <CardTitle className="text-2xl text-green-700">邮件已发送</CardTitle>
              <p className="text-muted-foreground mt-2">
                重置密码的邮件已发送至您的邮箱
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-green-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">邮箱地址</span>
              </div>
              <p className="text-green-700 font-mono">{email}</p>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">接下来的步骤：</h4>
                <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                  <li>检查您的收件箱（包括垃圾邮件箱）</li>
                  <li>点击邮件中的"重置密码"链接</li>
                  <li>设置您的新密码</li>
                  <li>使用新密码登录系统</li>
                </ol>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <span className="font-medium text-yellow-800">重要提醒</span>
                </div>
                <p className="text-sm text-yellow-700">
                  重置链接将在 <strong>30分钟</strong> 后失效，请尽快完成密码重置。
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleResend}
                disabled={countdown > 0}
              >
                {countdown > 0 ? (
                  `重新发送 (${countdown}s)`
                ) : (
                  '重新发送邮件'
                )}
              </Button>

              <Link to="/login" className="block">
                <Button variant="secondary" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回登录
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-muted-foreground space-y-2">
          <p>四川大学智慧教学系统</p>
          <p>没有收到邮件？请检查网络连接或联系系统管理员</p>
        </div>
      </div>
    </div>
  );
}