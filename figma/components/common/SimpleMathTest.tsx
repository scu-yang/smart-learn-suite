import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { MathRenderer, DisplayMath, MixedContentRenderer } from './MathRenderer';
import { Theorem, Proposition, Lemma, Example, Proof } from './TheoremEnvironments';
import { CheckCircle, XCircle } from 'lucide-react';

export function SimpleMathTest() {
  const [testInput, setTestInput] = useState('1^2 + 2^2 = 5');
  const [renderStatus, setRenderStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Safe math formulas using String.raw and avoiding variable names
  const safeFormulas = {
    quadratic: String.raw`1^2 + 2^2 = 5`,
    fraction: String.raw`\frac{1}{2}`,
    sqrt: String.raw`\sqrt{16} = 4`,
    sum: String.raw`\sum_{i=1}^{5} i = 15`,
    integral: String.raw`\int_0^1 t dt = \frac{1}{2}`
  };

  const alignmentFormulas = {
    align: String.raw`\begin{align} f(1) &= 1^2 + 1 \\ g(1) &= 2 \cdot 1 - 3 \end{align}`,
    gather: String.raw`\begin{gather} 1^2 + 2^2 = 5 \\ E = mc^2 \end{gather}`,
    aligned: String.raw`\begin{aligned} u &= v + w \\ p &= q + r \end{aligned}`
  };

  const matrixFormulas = {
    pmatrix: String.raw`\begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix}`,
    bmatrix: String.raw`\begin{bmatrix} 5 & 6 \\ 7 & 8 \end{bmatrix}`,
    vmatrix: String.raw`\begin{vmatrix} 9 & 10 \\ 11 & 12 \end{vmatrix}`
  };

  const testRender = (math: string) => {
    setTestInput(math);
    try {
      if (math.includes('\\') || math.includes('^') || math.includes('_')) {
        setRenderStatus('success');
      } else {
        setRenderStatus('error');
      }
    } catch {
      setRenderStatus('error');
    }
    
    setTimeout(() => setRenderStatus('idle'), 3000);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h1>简化数学渲染测试</h1>
        <p className="text-muted-foreground">
          基础LaTeX渲染功能验证
        </p>
        <div className="flex justify-center gap-2">
          <Badge variant="outline">KaTeX</Badge>
          <Badge variant="outline">基础功能</Badge>
          <Badge variant="outline">性能优化</Badge>
        </div>
      </div>

      {/* Status Alert */}
      {renderStatus !== 'idle' && (
        <Alert className={renderStatus === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          {renderStatus === 'success' ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription>
            {renderStatus === 'success' 
              ? '渲染成功！' 
              : '渲染可能有问题，请检查语法。'
            }
          </AlertDescription>
        </Alert>
      )}

      {/* Interactive Test */}
      <Card>
        <CardHeader>
          <CardTitle>交互式测试</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm">LaTeX 输入:</label>
            <Textarea
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder="输入LaTeX表达式..."
              className="font-mono"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm">渲染结果:</label>
            <div className="border rounded p-4 bg-white min-h-16">
              <MathRenderer math={testInput} inline={false} />
            </div>
          </div>
          <Button onClick={() => testRender(testInput)}>
            测试渲染
          </Button>
        </CardContent>
      </Card>

      {/* Basic Tests */}
      <Card>
        <CardHeader>
          <CardTitle>基础公式测试</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(safeFormulas).map(([key, formula]) => (
            <div key={key} className="space-y-2">
              <div className="text-sm font-mono bg-muted/50 p-2 rounded">
                {formula}
              </div>
              <div className="border rounded p-3 bg-white">
                <DisplayMath>{formula}</DisplayMath>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => testRender(formula)}
              >
                加载测试
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Alignment Tests */}
      <Card>
        <CardHeader>
          <CardTitle>对齐环境测试</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(alignmentFormulas).map(([key, formula]) => (
            <div key={key} className="space-y-2">
              <div className="text-sm font-mono bg-muted/50 p-2 rounded max-h-20 overflow-y-auto">
                {formula}
              </div>
              <div className="border rounded p-3 bg-white">
                <MathRenderer math={formula} inline={false} />
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => testRender(formula)}
              >
                加载测试
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Matrix Tests */}
      <Card>
        <CardHeader>
          <CardTitle>矩阵测试</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(matrixFormulas).map(([key, formula]) => (
            <div key={key} className="space-y-2">
              <div className="text-sm font-mono bg-muted/50 p-2 rounded">
                {formula}
              </div>
              <div className="border rounded p-3 bg-white">
                <MathRenderer math={formula} inline={false} />
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => testRender(formula)}
              >
                加载测试
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Theorem Tests */}
      <Card>
        <CardHeader>
          <CardTitle>定理环境测试</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Theorem title="勾股定理" number="1">
            在直角三角形中，设两直角边长度为3和4，则斜边长度为5。
          </Theorem>

          <Proposition number="2">
            对于任意正数，平方总是正数。
          </Proposition>

          <Example number="3">
            计算积分：
            <DisplayMath>{safeFormulas.integral}</DisplayMath>
          </Example>

          <Proof>
            使用基本积分公式即可证明上述结果。
          </Proof>
        </CardContent>
      </Card>

      {/* Mixed Content Test */}
      <Card>
        <CardHeader>
          <CardTitle>混合内容测试</CardTitle>
        </CardHeader>
        <CardContent>
          <MixedContentRenderer 
            content="在数学中，我们经常使用公式如 $E = mc^2$ 和基本的算术运算。" 
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default SimpleMathTest;