import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { MathRenderer, DisplayMath } from './MathRenderer';
import { Badge } from '../ui/badge';

interface TestCase {
  name: string;
  description: string;
  latex: string;
  category: string;
}

const testCases: TestCase[] = [
  // 矩阵环境测试
  {
    name: 'pmatrix',
    description: '圆括号矩阵',
    latex: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}',
    category: '矩阵环境'
  },
  {
    name: 'bmatrix',
    description: '方括号矩阵',
    latex: '\\begin{bmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\\\ 7 & 8 & 9 \\end{bmatrix}',
    category: '矩阵环境'
  },
  {
    name: 'vmatrix',
    description: '行列式',
    latex: '\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix} = ad - bc',
    category: '矩阵环境'
  },
  {
    name: 'Bmatrix',
    description: '大括号矩阵',
    latex: '\\begin{Bmatrix} x \\\\ y \\\\ z \\end{Bmatrix}',
    category: '矩阵环境'
  },
  {
    name: 'Vmatrix',
    description: '双竖线矩阵',
    latex: '\\begin{Vmatrix} a & b \\\\ c & d \\end{Vmatrix}',
    category: '矩阵环境'
  },
  {
    name: 'matrix',
    description: '普通矩阵',
    latex: '\\begin{matrix} 1 & 0 \\\\ 0 & 1 \\end{matrix}',
    category: '矩阵环境'
  },
  
  // 对齐环境测试
  {
    name: 'aligned',
    description: '对齐环境',
    latex: '\\begin{aligned} x &= a + b \\\\ y &= c + d \\\\ z &= e + f \\end{aligned}',
    category: '对齐环境'
  },
  {
    name: 'align (converted)',
    description: 'align环境（自动转换为aligned）',
    latex: '\\begin{align} x &= 1 + 2 \\\\ y &= 3 + 4 \\end{align}',
    category: '对齐环境'
  },
  {
    name: 'gathered',
    description: '居中对齐',
    latex: '\\begin{gathered} a + b = c \\\\ d + e = f \\\\ g + h = i \\end{gathered}',
    category: '对齐环境'
  },
  {
    name: 'gather (converted)',
    description: 'gather环境（自动转换为gathered）',
    latex: '\\begin{gather} x = y + z \\\\ a = b + c \\end{gather}',
    category: '对齐环境'
  },
  
  // Cases环境测试
  {
    name: 'cases',
    description: '分情况讨论',
    latex: 'f(x) = \\begin{cases} x^2 & \\text{if } x \\geq 0 \\\\ -x^2 & \\text{if } x < 0 \\end{cases}',
    category: 'Cases环境'
  },
  {
    name: 'cases with fractions',
    description: '带分数的cases',
    latex: '\\delta_{ij} = \\begin{cases} 1 & \\text{if } i = j \\\\ 0 & \\text{if } i \\neq j \\end{cases}',
    category: 'Cases环境'
  },
  {
    name: 'nested cases',
    description: '复杂cases环境',
    latex: 'f(x,y) = \\begin{cases} \\begin{cases} x+y & \\text{if } x > 0 \\\\ x-y & \\text{if } x \\leq 0 \\end{cases} & \\text{if } y > 0 \\\\ 0 & \\text{if } y \\leq 0 \\end{cases}',
    category: 'Cases环境'
  },
  
  // 复杂组合测试
  {
    name: 'matrix with cases',
    description: '矩阵与cases组合',
    latex: 'A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}, \\quad \\det(A) = \\begin{cases} ad - bc & \\text{if } A \\text{ is } 2\\times 2 \\\\ \\text{complex} & \\text{otherwise} \\end{cases}',
    category: '复杂组合'
  },
  {
    name: 'aligned with matrices',
    description: '对齐环境中的矩阵',
    latex: '\\begin{aligned} A &= \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix} \\\\ B &= \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix} \\\\ AB &= \\begin{pmatrix} 1+2c & 2+2d \\\\ 3+4c & 6+4d \\end{pmatrix} \\end{aligned}',
    category: '复杂组合'
  }
];

export function MathEnvironmentTest() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [renderStatus, setRenderStatus] = useState<{ [key: string]: 'success' | 'error' | 'loading' }>({});

  const categories = ['all', ...Array.from(new Set(testCases.map(tc => tc.category)))];
  
  const filteredTestCases = selectedCategory === 'all' 
    ? testCases 
    : testCases.filter(tc => tc.category === selectedCategory);

  const handleRender = (testCase: TestCase) => {
    setRenderStatus(prev => ({ ...prev, [testCase.name]: 'loading' }));
    
    // 模拟渲染延迟
    setTimeout(() => {
      setRenderStatus(prev => ({ ...prev, [testCase.name]: 'success' }));
    }, 100);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="mb-4">数学环境测试</h1>
        <p className="text-muted-foreground mb-4">
          测试各种LaTeX数学环境的渲染效果，包括矩阵环境、对齐环境和cases环境。
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'all' ? '全部' : category}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTestCases.map((testCase) => (
          <Card key={testCase.name} className="border">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{testCase.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {testCase.description}
                  </p>
                </div>
                <Badge variant="secondary" className="shrink-0">
                  {testCase.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">LaTeX代码：</h4>
                  <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                    <code>{testCase.latex}</code>
                  </pre>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium">渲染结果：</h4>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRender(testCase)}
                      disabled={renderStatus[testCase.name] === 'loading'}
                    >
                      {renderStatus[testCase.name] === 'loading' ? '渲染中...' : '重新渲染'}
                    </Button>
                  </div>
                  
                  <div className="min-h-[60px] p-4 border rounded bg-background flex items-center justify-center">
                    <MathRenderer 
                      math={testCase.latex} 
                      inline={false}
                      className="text-center"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="mb-2">测试说明</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• <strong>矩阵环境</strong>：pmatrix、bmatrix、vmatrix等应该正常显示</li>
          <li>• <strong>对齐环境</strong>：align和gather会自动转换为aligned和gathered</li>
          <li>• <strong>Cases环境</strong>：cases环境应该保持原样，支持嵌套和复杂结构</li>
          <li>• <strong>复杂组合</strong>：测试不同环境的组合使用</li>
        </ul>
      </div>
    </div>
  );
}

export default MathEnvironmentTest;