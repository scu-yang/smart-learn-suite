import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Eye, EyeOff, CheckCircle, XCircle, ArrowRight, Sparkles } from "lucide-react";
import { Link, useRouter } from "@tanstack/react-router";
import { authApi } from "@/lib/auth-api";
import { showToast } from "@/lib/toast";
import type { RegisterForm } from "@/types";

export function SignPage() {
  const [formData, setFormData] = useState<RegisterForm>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [errors, setErrors] = useState<Partial<RegisterForm>>({});
  const router = useRouter();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterForm> = {};

    if (formData.username.length < 3) {
      newErrors.username = "用户名至少需要3个字符";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "请输入有效的邮箱地址";
    }

    if (formData.password.length < 6) {
      newErrors.password = "密码至少需要6个字符";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "两次输入的密码不一致";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // 调用注册 API（默认注册为学生用户）
      const response = await authApi.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });
      console.log("注册响应:", response);
      
      // code == 200
      if (response.code === 200) {
        // 注册成功，显示成功提示
        showToast.success({
          title: "注册成功",
          description: "账号创建成功，即将跳转到登录页面"
        });
        
        // 等待一下让用户看到成功提示，然后跳转到登录页
        setTimeout(() => {
          router.navigate({ to: "/login" });
        }, 1500);
      }
    } catch (error) {
      console.error("注册失败:", error);
      
      // 显示错误提示
      const errorMessage = error instanceof Error ? error.message : "注册失败，请稍后重试";
      showToast.error({
        title: "注册失败",
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // 清除对应字段的错误信息
    if (errors[name as keyof RegisterForm]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, text: "", color: "" };
    if (password.length < 6) return { strength: 1, text: "弱", color: "text-red-500" };
    if (password.length < 10) return { strength: 2, text: "中等", color: "text-yellow-500" };
    return { strength: 3, text: "强", color: "text-green-500" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

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
                <Sparkles className="w-3 h-3 mr-1" />
                AI 驱动的智能教育平台
              </div>
            </div>
          </Link>
        </div>

        <Card className={`backdrop-blur-sm bg-white/80 border border-gray-200/50 shadow-xl transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">创建账号</CardTitle>
            <CardDescription className="text-gray-600 text-base">
              请填写以下信息完成注册
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-semibold text-gray-700">
                  用户名
                </label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="请输入用户名"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.username ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  required
                />
                {errors.username && (
                  <p className="text-sm text-red-500 flex items-center animate-in slide-in-from-left-1">
                    <XCircle className="h-4 w-4 mr-1" />
                    {errors.username}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-gray-700">
                  邮箱
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="请输入邮箱地址"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  required
                />
                {errors.email && (
                  <p className="text-sm text-red-500 flex items-center animate-in slide-in-from-left-1">
                    <XCircle className="h-4 w-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold text-gray-700">
                  密码
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="请输入密码"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`h-12 pr-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {formData.password && (
                  <div className="flex items-center justify-between">
                    <p className={`text-sm ${passwordStrength.color} flex items-center`}>
                      密码强度: {passwordStrength.text}
                    </p>
                    <div className="flex space-x-1">
                      {[1, 2, 3].map((level) => (
                        <div
                          key={level}
                          className={`w-6 h-1 rounded-full ${
                            passwordStrength.strength >= level
                              ? passwordStrength.strength === 1
                                ? 'bg-red-500'
                                : passwordStrength.strength === 2
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {errors.password && (
                  <p className="text-sm text-red-500 flex items-center animate-in slide-in-from-left-1">
                    <XCircle className="h-4 w-4 mr-1" />
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">
                  确认密码
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="请再次输入密码"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`h-12 pr-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <p className="text-sm text-green-500 flex items-center animate-in slide-in-from-left-1">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    密码匹配
                  </p>
                )}
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 flex items-center animate-in slide-in-from-left-1">
                    <XCircle className="h-4 w-4 mr-1" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-base group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    注册中...
                  </div>
                ) : (
                  <div className="flex items-center">
                    创建账号
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                已有账号？{" "}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                  立即登录
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
