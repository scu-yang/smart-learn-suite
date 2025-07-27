import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { MathRenderer, MixedContentRenderer, MathCacheUtils, useMathPerformance } from './MathRenderer';
import { Clock, BarChart3, Zap, Trash2, Gauge } from 'lucide-react';

// 测试用的数学公式
const testFormulas = [
  'f(x) = \\frac{1}{\\sqrt{2\\pi\\sigma^2}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}',
  '\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}',
  '\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}',
  '\\begin{aligned} \\nabla \\times \\vec{E} &= -\\frac{\\partial \\vec{B}}{\\partial t} \\\\ \\nabla \\times \\vec{B} &= \\mu_0\\left(\\vec{J} + \\varepsilon_0 \\frac{\\partial \\vec{E}}{\\partial t}\\right) \\end{aligned}',
  '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} ax + by \\\\ cx + dy \\end{pmatrix}',
  'e^{i\\pi} + 1 = 0',
  '\\lim_{n \\to \\infty} \\left(1 + \\frac{1}{n}\\right)^n = e',
  '\\frac{d}{dx}\\left[\\int_a^x f(t)dt\\right] = f(x)',
];

const complexFormulas = [
  'The quadratic formula: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$ is fundamental in algebra.',
  'Einstein\'s field equations: $$G_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu}$$',
  'Maxwell\'s equations in vacuum: $$\\begin{aligned} \\nabla \\cdot \\vec{E} &= \\frac{\\rho}{\\varepsilon_0} \\\\ \\nabla \\cdot \\vec{B} &= 0 \\\\ \\nabla \\times \\vec{E} &= -\\frac{\\partial \\vec{B}}{\\partial t} \\\\ \\nabla \\times \\vec{B} &= \\mu_0\\left(\\vec{J} + \\varepsilon_0 \\frac{\\partial \\vec{E}}{\\partial t}\\right) \\end{aligned}$$',
  'The Schrödinger equation: $i\\hbar\\frac{\\partial}{\\partial t}\\Psi(\\vec{r},t) = \\hat{H}\\Psi(\\vec{r},t)$ where $\\hat{H} = -\\frac{\\hbar^2}{2m}\\nabla^2 + V(\\vec{r})$.',
];

interface PerformanceMetrics {
  renderTime: number;
  cacheHits: number;
  cacheMisses: number;
  totalRenders: number;
}

export function MathPerformanceTest() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    cacheHits: 0,
    cacheMisses: 0,
    totalRenders: 0
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);
  const { size: cacheSize, maxSize, clearCache, preloadKaTeX, warmup } = useMathPerformance();

  // 性能测试函数
  const runPerformanceTest = useCallback(async (iterations: number) => {
    setIsLoading(true);
    setTestResults([]);
    
    const results: string[] = [];
    let totalTime = 0;
    let cacheHitCount = 0;
    let cacheMissCount = 0;

    results.push(`Starting performance test with ${iterations} iterations...`);
    
    // 预热
    results.push('Preloading KaTeX...');
    await preloadKaTeX();
    
    results.push('Warming up cache with common formulas...');
    await warmup(testFormulas.slice(0, 4));
    
    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now();
      
      // 模拟渲染过程
      const formula = testFormulas[i % testFormulas.length];
      const cacheStatsBefore = MathCacheUtils.getStats();
      
      // 这里我们模拟渲染，实际应用中是MathRenderer组件处理
      try {
        if (typeof window !== 'undefined' && window.katex) {
          const tempDiv = document.createElement('div');
          window.katex.render(formula, tempDiv, {
            displayMode: false,
            throwOnError: false
          });
        }
      } catch (error) {
        // Ignore errors for performance test
      }
      
      const cacheStatsAfter = MathCacheUtils.getStats();
      const endTime = performance.now();
      
      const renderTime = endTime - startTime;
      totalTime += renderTime;
      
      if (cacheStatsAfter.size > cacheStatsBefore.size) {
        cacheMissCount++;
      } else {
        cacheHitCount++;
      }
      
      if (i % 10 === 0) {
        results.push(`Iteration ${i + 1}/${iterations} - ${renderTime.toFixed(2)}ms`);
        setTestResults([...results]);
      }
    }
    
    const avgTime = totalTime / iterations;
    results.push(`\nTest completed!`);
    results.push(`Average render time: ${avgTime.toFixed(2)}ms`);
    results.push(`Cache hits: ${cacheHitCount}`);
    results.push(`Cache misses: ${cacheMissCount}`);
    results.push(`Cache hit rate: ${((cacheHitCount / iterations) * 100).toFixed(1)}%`);
    
    setMetrics({
      renderTime: avgTime,
      cacheHits: cacheHitCount,
      cacheMisses: cacheMissCount,
      totalRenders: iterations
    });
    
    setTestResults(results);
    setIsLoading(false);
  }, [preloadKaTeX, warmup]);

  // 清理缓存
  const handleClearCache = useCallback(() => {
    clearCache();
    setTestResults(prev => [...prev, 'Cache cleared!']);
  }, [clearCache]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1>数学公式渲染性能测试</h1>
          <p className="text-muted-foreground">测试优化后的数学公式渲染性能</p>
        </div>
      </div>

      {/* 缓存状态 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-1">{cacheSize}</div>
            <p className="text-sm text-muted-foreground">缓存数量</p>
            <Progress value={(cacheSize / maxSize) * 100} className="mt-2 h-1" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-2">
              {metrics.renderTime.toFixed(2)}ms
            </div>
            <p className="text-sm text-muted-foreground">平均渲染时间</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-3">
              {metrics.totalRenders > 0 ? ((metrics.cacheHits / metrics.totalRenders) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-sm text-muted-foreground">缓存命中率</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-4">{metrics.totalRenders}</div>
            <p className="text-sm text-muted-foreground">总渲染次数</p>
          </CardContent>
        </Card>
      </div>

      {/* 控制按钮 */}
      <div className="flex gap-4">
        <Button
          onClick={() => runPerformanceTest(50)}
          disabled={isLoading}
          className="gap-2"
        >
          <Gauge className="w-4 h-4" />
          {isLoading ? '测试中...' : '运行性能测试 (50次)'}
        </Button>
        
        <Button
          onClick={() => runPerformanceTest(100)}
          disabled={isLoading}
          variant="outline"
          className="gap-2"
        >
          <BarChart3 className="w-4 h-4" />
          深度测试 (100次)
        </Button>
        
        <Button
          onClick={handleClearCache}
          variant="outline"
          className="gap-2"
        >
          <Trash2 className="w-4 h-4" />
          清理缓存
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 测试结果 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              测试结果
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg h-64 overflow-y-auto">
              <pre className="text-sm whitespace-pre-wrap">
                {testResults.join('\n') || '点击上方按钮开始性能测试...'}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* 示例公式 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              示例公式渲染
            </CardTitle>
            <CardDescription>展示缓存优化效果</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {testFormulas.slice(0, 4).map((formula, index) => (
              <div key={index} className="border rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">公式 {index + 1}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {formula.length} 字符
                  </span>
                </div>
                <MathRenderer math={formula} inline={false} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 混合内容测试 */}
      <Card>
        <CardHeader>
          <CardTitle>混合内容渲染测试</CardTitle>
          <CardDescription>测试文本和数学公式混合内容的渲染性能</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {complexFormulas.map((content, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4">
              <MixedContentRenderer content={content} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 性能优化说明 */}
      <Card>
        <CardHeader>
          <CardTitle>性能优化特性</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-chart-1">缓存机制</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• LRU (最近最少使用) 缓存策略</li>
                <li>• 最大缓存 {maxSize} 个公式</li>
                <li>• 基于公式内容和显示模式的智能键值</li>
                <li>• 自动缓存清理</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-chart-2">性能优化</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• React.memo 避免不必要的重渲染</li>
                <li>• useMemo 缓存计算结果</li>
                <li>• useCallback 优化函数引用</li>
                <li>• 异步加载 KaTeX 库</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-chart-3">渲染优化</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• 环境预处理优化</li>
                <li>• 智能显示模式检测</li>
                <li>• 预加载常用公式</li>
                <li>• 错误处理和降级显示</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-chart-4">高级特性</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• 懒加载支持</li>
                <li>• 性能监控 Hook</li>
                <li>• 批量预热机制</li>
                <li>• 可配置缓存大小</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}