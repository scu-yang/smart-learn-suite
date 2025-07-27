import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Mail, Clock, CheckCircle, XCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useRouter } from "@tanstack/react-router";

export function ForgotPasswordPage() {
  const [step, setStep] = useState<'email' | 'code' | 'newPassword' | 'success'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<any>({});
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // 倒计时效果
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // 表单验证
  const validateForm = (currentStep: string): boolean => {
    const newErrors: any = {};

    switch (currentStep) {
      case 'email':
        if (!formData.email.trim()) {
          newErrors.email = "请输入邮箱地址";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = "请输入有效的邮箱地址";
        }
        break;
      case 'code':
        if (!formData.verificationCode.trim()) {
          newErrors.verificationCode = "请输入验证码";
        } else if (formData.verificationCode.length !== 6) {
          newErrors.verificationCode = "验证码应为6位数字";
        }
        break;
      case 'newPassword':
        if (!formData.newPassword) {
          newErrors.newPassword = "请输入新密码";
        } else if (formData.newPassword.length < 6) {
          newErrors.newPassword = "密码至少6位";
        }
        
        if (!formData.confirmPassword) {
          newErrors.confirmPassword = "请确认新密码";
        } else if (formData.newPassword !== formData.confirmPassword) {
          newErrors.confirmPassword = "两次输入的密码不一致";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 发送验证码
  const handleSendVerificationCode = async () => {
    if (!validateForm('email')) {
      return;
    }

    setIsLoading(true);
    try {
      // 模拟发送验证码
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("发送验证码到:", formData.email);
      
      setStep('code');
      setCountdown(60); // 60秒倒计时
    } catch (error) {
      console.error("发送验证码失败:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 验证验证码
  const handleVerifyCode = async () => {
    if (!validateForm('code')) {
      return;
    }

    setIsLoading(true);
    try {
      // 模拟验证码验证
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("验证码验证:", formData.verificationCode);
      
      setStep('newPassword');
    } catch (error) {
      console.error("验证码验证失败:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 重置密码
  const handleResetPassword = async () => {
    if (!validateForm('newPassword')) {
      return;
    }

    setIsLoading(true);
    try {
      // 模拟重置密码
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("重置密码成功");
      
      setStep('success');
    } catch (error) {
      console.error("重置密码失败:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // 清除对应字段的错误信息
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBack = () => {
    switch (step) {
      case 'code':
        setStep('email');
        break;
      case 'newPassword':
        setStep('code');
        break;
      default:
        router.navigate({ to: "/login" });
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 'email': return '找回密码';
      case 'code': return '验证邮箱';
      case 'newPassword': return '设置新密码';
      case 'success': return '重置成功';
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 'email': return '请输入您的邮箱地址，我们将发送验证码到您的邮箱';
      case 'code': return '请输入发送到您邮箱的6位验证码';
      case 'newPassword': return '请设置您的新密码';
      case 'success': return '密码重置成功，您现在可以使用新密码登录';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className={`text-center mb-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Link to="/" className="inline-flex items-center group">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div className="ml-0">
              <span className="block text-2xl font-bold text-gray-900">智慧教学系统</span>
              <div className="inline-flex items-center px-3 py-1 bg-blue-50 rounded-full text-blue-700 text-xs font-medium mt-2">
                找回密码
              </div>
            </div>
          </Link>
        </div>

        <Card className={`bg-white border border-gray-200 shadow-xl transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-between mb-4">
              {step !== 'email' && step !== 'success' && (
                <button
                  onClick={handleBack}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold text-gray-900">{getStepTitle()}</CardTitle>
              </div>
            </div>
            <CardDescription className="text-gray-600 text-sm leading-relaxed">
              {getStepDescription()}
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            {/* 步骤1: 输入邮箱 */}
            {step === 'email' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-800">
                    邮箱地址
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="请输入您的邮箱地址"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`pl-10 h-11 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 ${errors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''}`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-600 flex items-center bg-red-50 p-2 rounded-md">
                      <XCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                      {errors.email}
                    </p>
                  )}
                </div>
                
                <Button 
                  onClick={handleSendVerificationCode}
                  disabled={isLoading}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      发送中...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      发送验证码
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  )}
                </Button>

                <div className="text-center mt-6">
                  <p className="text-gray-600 text-sm">
                    想起密码了？{" "}
                    <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                      返回登录
                    </Link>
                  </p>
                </div>
              </div>
            )}

            {/* 步骤2: 输入验证码 */}
            {step === 'code' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="verificationCode" className="text-sm font-medium text-gray-800">
                    验证码
                  </label>
                  <Input
                    id="verificationCode"
                    name="verificationCode"
                    type="text"
                    placeholder="请输入6位验证码"
                    value={formData.verificationCode}
                    onChange={handleInputChange}
                    className={`text-center text-lg tracking-widest h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 ${errors.verificationCode ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''}`}
                    maxLength={6}
                  />
                  {errors.verificationCode && (
                    <p className="text-sm text-red-600 flex items-center bg-red-50 p-2 rounded-md">
                      <XCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                      {errors.verificationCode}
                    </p>
                  )}
                </div>

                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={handleSendVerificationCode}
                    disabled={countdown > 0 || isLoading}
                    className="text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed bg-blue-50 hover:bg-blue-100 disabled:bg-gray-100 px-3 py-2 rounded-md transition-colors"
                  >
                    {countdown > 0 ? (
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {countdown}秒后重新发送
                      </span>
                    ) : (
                      '重新发送验证码'
                    )}
                  </button>
                </div>

                <Button 
                  onClick={handleVerifyCode}
                  disabled={isLoading}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      验证中...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      验证并继续
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  )}
                </Button>
              </div>
            )}

            {/* 步骤3: 设置新密码 */}
            {step === 'newPassword' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="newPassword" className="text-sm font-medium text-gray-800">
                    新密码
                  </label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder="请输入新密码"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className={`h-11 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 ${errors.newPassword ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''}`}
                  />
                  {errors.newPassword && (
                    <p className="text-sm text-red-600 flex items-center bg-red-50 p-2 rounded-md">
                      <XCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                      {errors.newPassword}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-800">
                    确认新密码
                  </label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="请再次输入新密码"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`h-11 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 ${errors.confirmPassword ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''}`}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600 flex items-center bg-red-50 p-2 rounded-md">
                      <XCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <Button 
                  onClick={handleResetPassword}
                  disabled={isLoading}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      重置中...
                    </div>
                  ) : (
                    '重置密码'
                  )}
                </Button>
              </div>
            )}

            {/* 步骤4: 成功页面 */}
            {step === 'success' && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">密码重置成功！</h3>
                  <p className="text-gray-600 leading-relaxed">
                    您的密码已经成功重置，现在可以使用新密码登录账户了。
                  </p>
                </div>
                <Button 
                  onClick={() => router.navigate({ to: "/login" })}
                  className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-medium transition-colors"
                >
                  <div className="flex items-center">
                    前往登录
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
