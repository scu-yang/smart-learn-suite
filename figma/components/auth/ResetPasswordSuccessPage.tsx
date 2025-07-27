import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { CheckCircle, ArrowRight, LogIn } from 'lucide-react';

export function ResetPasswordSuccessPage() {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Auto redirect to login after countdown
      navigate('/login');
    }
  }, [countdown]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-4 pb-6">
            <div className="flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mx-auto">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <div className="text-center">
              <CardTitle className="text-2xl text-green-700">密码重置成功！</CardTitle>
              <p className="text-muted-foreground mt-2">
                您的密码已成功更新
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-green-50 rounded-lg p-4 space-y-3">
              <div className="space-y-2">
                <h4 className="font-medium text-green-800">密码已更新</h4>
                <p className="text-sm text-green-700">
                  您现在可以使用新密码登录四川大学智慧教学系统了。
                </p>
              </div>
              
              <div className="border-t border-green-200 pt-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-600">安全提醒:</span>
                  <span className="text-green-700 font-medium">请妥善保管新密码</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">安全建议</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 定期更换密码以保护账户安全</li>
                <li>• 不要在多个网站使用相同密码</li>
                <li>• 避免在公共设备上保存密码</li>
                <li>• 如发现异常活动请立即联系管理员</li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  {countdown > 0 ? (
                    `${countdown} 秒后自动跳转到登录页面`
                  ) : (
                    '正在跳转...'
                  )}
                </p>
              </div>

              <Link to="/login" className="block">
                <Button className="w-full h-12">
                  <LogIn className="w-4 h-4 mr-2" />
                  立即登录
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>

              <Link to="/forgot-password" className="block">
                <Button variant="outline" className="w-full">
                  重新重置密码
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 space-y-2">
          <div className="text-sm text-muted-foreground">
            <p>四川大学智慧教学系统</p>
            <p>如需帮助，请联系技术支持团队</p>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <p>技术支持邮箱: support@scu.edu.cn</p>
            <p>服务时间: 周一至周五 9:00-17:00</p>
          </div>
        </div>
      </div>
    </div>
  );
}