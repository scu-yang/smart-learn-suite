import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Brain,
  Target,
  Sparkles,
  ArrowRight,
  GraduationCap,
  BarChart3,
  Zap,
  Users,
  Shield,
  Play,
  Star,
  TrendingUp
} from "lucide-react";
import { Link } from "@tanstack/react-router";

export function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 4);
    }, 3000);

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const features = [
    {
      icon: Brain,
      title: "AI 智能出题",
      description: "基于知识图谱，个性化生成考题"
    },
    {
      icon: Target,
      title: "精准评估",
      description: "多维度能力分析，精准定位薄弱环节"
    },
    {
      icon: BarChart3,
      title: "学习轨迹",
      description: "可视化学习路径，科学规划进度"
    },
    {
      icon: Sparkles,
      title: "智适应学习",
      description: "AI 推荐最优学习策略"
    }
  ];

  const stats = [
    { number: "50,000+", label: "学生用户", animatedNumber: 50000 },
    { number: "1,000+", label: "精品课程", animatedNumber: 1000 },
    { number: "98%", label: "通过率", animatedNumber: 98 },
    { number: "24/7", label: "在线服务", animatedNumber: 24 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '0s'}}></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-3/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-blue-400 rounded-full opacity-40 animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-indigo-400 rounded-full opacity-40 animate-bounce" style={{animationDelay: '3s'}}></div>
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-purple-400 rounded-full opacity-40 animate-bounce" style={{animationDelay: '5s'}}></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full backdrop-blur-lg border-b border-gray-100/50 z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-white/90 shadow-lg' : 'bg-white/80'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">智慧教学系统</span>
              <div className="hidden sm:flex items-center px-3 py-1 bg-blue-50 rounded-full text-blue-700 text-xs font-medium ml-3">
                <Sparkles className="w-3 h-3 mr-1" />
                AI 驱动
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200">
                  登录
                </Button>
              </Link>
              <Link to="/sign">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white group transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  开始使用
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center relative">
            <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full text-blue-700 text-sm font-medium mb-8 hover:bg-blue-100 transition-colors duration-300 cursor-pointer">
                <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                AI 驱动的智能教育平台
                <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                重新定义
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent block animate-pulse">
                  在线考试体验
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
                融合前沿 AI 技术，打造个性化学习路径。从智能组卷到精准评估，
                <br className="hidden md:block" />
                让每一次考试都成为进步的阶梯。
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
                <Link to="/sign">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg group transition-all duration-300 hover:scale-105 hover:shadow-xl">
                    立即体验
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-gray-300 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 group">
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  观看演示
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span>4.9/5 用户评分</span>
                </div>
                <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 text-green-500 mr-1" />
                  <span>银行级安全</span>
                </div>
                <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                  <span>98% 通过率</span>
                </div>
              </div>
            </div>

            {/* Scroll indicator */}
            {/* <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 animate-bounce">
              <ChevronDown className="w-6 h-6 text-gray-400" />
            </div> */}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='10' cy='10' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className={`text-center transition-all duration-1000 delay-${index * 200} hover:scale-105 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <div className="relative group">
                  <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 transition-colors duration-300 group-hover:text-blue-600">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                  
                  {/* Decorative line */}
                  <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-4 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional metrics */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">学习效率提升</div>
              <div className="text-4xl font-bold text-green-600 mb-2">35%</div>
              <div className="text-gray-600">相比传统学习方式</div>
            </div>
            
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">错误率降低</div>
              <div className="text-4xl font-bold text-purple-600 mb-2">60%</div>
              <div className="text-gray-600">智能推荐学习内容</div>
            </div>
            
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">AI 精准度</div>
              <div className="text-4xl font-bold text-orange-600 mb-2">95%</div>
              <div className="text-gray-600">智能评估准确率</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full text-blue-700 text-sm font-medium mb-6">
              <Brain className="w-4 h-4 mr-2" />
              核心功能
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              AI 赋能，智慧教育
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              通过人工智能技术，为每位学习者提供个性化的考试与学习体验
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* 左侧功能列表 */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-2xl transition-all duration-500 cursor-pointer group ${
                    currentFeature === index
                      ? 'bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 shadow-xl scale-105'
                      : 'bg-white border border-gray-200 hover:shadow-lg hover:border-blue-200 hover:scale-102'
                  }`}
                  onClick={() => setCurrentFeature(index)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-4 rounded-xl transition-all duration-300 ${
                      currentFeature === index
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-110'
                        : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                    }`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 ${
                        currentFeature === index ? 'text-gray-900' : 'text-gray-800 group-hover:text-gray-900'
                      }`}>
                        {feature.title}
                      </h3>
                      <p className={`transition-colors duration-300 ${
                        currentFeature === index ? 'text-gray-700' : 'text-gray-600'
                      }`}>
                        {feature.description}
                      </p>
                    </div>
                    {currentFeature === index && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 右侧可视化区域 */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-8 shadow-2xl border border-blue-100">
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                  {/* AI 智能出题 */}
                  {currentFeature === 0 && (
                    <div className="transition-all duration-500">
                      <div className="flex items-center justify-between mb-8">
                        <h4 className="text-2xl font-bold text-gray-900">
                          AI 智能出题系统
                        </h4>
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                          <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-500">
                          <h5 className="font-medium text-gray-900 mb-2">知识点: 二次函数</h5>
                          <p className="text-sm text-gray-700 mb-3">已知函数 f(x) = ax² + bx + c，求导数 f'(x)</p>
                          <div className="flex items-center text-xs text-gray-600">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">难度: 中等</span>
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">分值: 10分</span>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-l-4 border-green-500">
                          <h5 className="font-medium text-gray-900 mb-2">知识点: 英语语法</h5>
                          <p className="text-sm text-gray-700 mb-3">Choose the correct form: "I _____ to the store yesterday."</p>
                          <div className="flex items-center text-xs text-gray-600">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded mr-2">难度: 简单</span>
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">分值: 5分</span>
                          </div>
                        </div>
                        
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <Brain className="w-4 h-4 inline mr-2" />
                            AI 根据学习历史，自动调整题目难度和知识点分布
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 精准评估 */}
                  {currentFeature === 1 && (
                    <div className="transition-all duration-500">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-lg font-semibold text-gray-900">
                          能力雷达图
                        </h4>
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">数学基础</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 h-2 bg-gray-200 rounded-full">
                              <div className="w-20 h-2 bg-green-500 rounded-full"></div>
                            </div>
                            <span className="text-sm text-green-600 font-medium">85%</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">英语语法</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 h-2 bg-gray-200 rounded-full">
                              <div className="w-16 h-2 bg-yellow-500 rounded-full"></div>
                            </div>
                            <span className="text-sm text-yellow-600 font-medium">68%</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">物理概念</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 h-2 bg-gray-200 rounded-full">
                              <div className="w-18 h-2 bg-blue-500 rounded-full"></div>
                            </div>
                            <span className="text-sm text-blue-600 font-medium">72%</span>
                          </div>
                        </div>
                        
                        <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                          <p className="text-sm text-orange-800">
                            <Target className="w-4 h-4 inline mr-2" />
                            建议重点复习: 英语语法中的时态运用，预计提升 15%
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 学习轨迹 */}
                  {currentFeature === 2 && (
                    <div className="transition-all duration-500">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-lg font-semibold text-gray-900">
                          个人学习路径
                        </h4>
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">✓</div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">基础概念学习</h5>
                            <p className="text-sm text-gray-600">已完成 · 2024.07.01</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">强化练习</h5>
                            <p className="text-sm text-gray-600">进行中 · 预计3天完成</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm font-bold">3</div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-500">综合测试</h5>
                            <p className="text-sm text-gray-400">待开始 · 预计7月25日</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm font-bold">4</div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-500">期末冲刺</h5>
                            <p className="text-sm text-gray-400">待开始 · 预计8月1日</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-800">
                          <Target className="w-4 h-4 inline mr-2" />
                          当前进度: 40% · 按计划进行，预计按时完成学习目标
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 智适应学习 */}
                  {currentFeature === 3 && (
                    <div className="transition-all duration-500">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-lg font-semibold text-gray-900">
                          AI 学习策略推荐
                        </h4>
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-l-4 border-purple-500">
                          <div className="flex items-center mb-2">
                            <Sparkles className="w-4 h-4 text-purple-600 mr-2" />
                            <span className="font-medium text-gray-900">今日推荐</span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">复习数学二次函数相关概念</p>
                          <div className="text-xs text-gray-600">
                            基于您的学习数据，建议专注此知识点 20 分钟
                          </div>
                        </div>
                        
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-500">
                          <div className="flex items-center mb-2">
                            <BarChart3 className="w-4 h-4 text-blue-600 mr-2" />
                            <span className="font-medium text-gray-900">学习时段优化</span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">上午 9-11点 是您的高效学习时段</p>
                          <div className="text-xs text-gray-600">
                            根据历史数据分析，此时段学习效率提升 35%
                          </div>
                        </div>
                        
                        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-l-4 border-green-500">
                          <div className="flex items-center mb-2">
                            <Target className="w-4 h-4 text-green-600 mr-2" />
                            <span className="font-medium text-gray-900">错题重点</span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">优先复习英语时态相关错题</p>
                          <div className="text-xs text-gray-600">
                            此类题目错误率较高，建议加强练习
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                        <p className="text-sm text-purple-800">
                          <Sparkles className="w-4 h-4 inline mr-2" />
                          AI 持续学习您的偏好，提供越来越精准的个性化建议
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              为什么选择我们
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              专业、智能、高效的在线考试解决方案
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900 mb-2">安全可靠</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600 leading-relaxed text-base">
                  银行级安全防护，全程数据加密，确保考试公平公正。支持防作弊监控，维护考试诚信。
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900 mb-2">高效便捷</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600 leading-relaxed text-base">
                  一键创建考试，智能批改评分，实时生成报告。大幅降低考试组织成本，提升效率。
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900 mb-2">专业服务</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600 leading-relaxed text-base">
                  专业教研团队支持，7×24小时技术服务。提供完整的培训和技术支持体系。
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-white relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.1'%3E%3Cpath d='M20 20c0 11.046-8.954 20-20 20s-20-8.954-20-20 8.954-20 20-20 20 8.954 20 20z'/%3E%3C/g%3E%3C/svg%3E")`,
              }}></div>
            </div>
            
            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                开启智能教育新时代
              </h2>
              <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
                加入数万名教育工作者，体验 AI 驱动的在线考试平台
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link to="/sign">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    免费注册
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold transition-all duration-300">
                  联系我们
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">智慧教学系统</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                专业的在线考试平台，致力于为教育机构提供智能化的考试解决方案。
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">产品</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors duration-300">在线考试</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">智能组卷</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">学习分析</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">错题管理</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">支持</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors duration-300">帮助中心</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">用户指南</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">API 文档</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">技术支持</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">联系我们</h3>
              <ul className="space-y-3 text-gray-400">
                <li>电话: 400-123-4567</li>
                <li>邮箱: support@scu-exam.edu.cn</li>
                <li>地址: 四川大学望江校区</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 智慧教学系统. 保留所有权利.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
