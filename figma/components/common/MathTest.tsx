import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { DisplayMath } from './MathRenderer';
import { Theorem, Proposition, Lemma, Example, Proof } from './TheoremEnvironments';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { useNavigate } from 'react-router-dom';

export function MathTest() {
  const navigate = useNavigate();

  const basicFormula = 'x^2 + y^2 = z^2';
  const fractionFormula = String.raw`\frac{1}{2}`;
  const matrixFormula = String.raw`\begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix}`;

  return (
    <div className="p-6 space-y-8">
      <div className="text-center">
        <h1 className="mb-2">数学公式渲染测试</h1>
        <p className="text-muted-foreground mb-4">测试KaTeX渲染效果</p>
        <div className="flex justify-center gap-2 mb-4">
          <Badge variant="secondary">KaTeX</Badge>
          <Badge variant="secondary">数学环境</Badge>
        </div>
        <div className="flex justify-center gap-2">
          <Button variant="outline" onClick={() => navigate('/math-test/simple')}>
            简化测试
          </Button>
          <Button variant="outline" onClick={() => navigate('/math-test/advanced')}>
            高级功能
          </Button>
        </div>
      </div>

      <Separator />

      <div className="space-y-6">
        <h2>基础数学公式</h2>
        <Card>
          <CardHeader>
            <CardTitle>基本公式</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-mono bg-muted/50 p-2 rounded">
                {basicFormula}
              </div>
              <div className="border rounded p-3 bg-white">
                <DisplayMath>{basicFormula}</DisplayMath>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-mono bg-muted/50 p-2 rounded">
                \frac{'{1}'}{'{}2}'}
              </div>
              <div className="border rounded p-3 bg-white">
                <DisplayMath>{fractionFormula}</DisplayMath>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="space-y-6">
        <h2>矩阵测试</h2>
        <Card>
          <CardHeader>
            <CardTitle>矩阵公式</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-mono bg-muted/50 p-2 rounded">
                matrix formula
              </div>
              <div className="border rounded p-3 bg-white">
                <DisplayMath>{matrixFormula}</DisplayMath>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="space-y-6">
        <h2>定理环境</h2>
        
        <Theorem number="1">
          这是一个定理。
        </Theorem>

        <Proposition number="2">
          这是一个命题。
        </Proposition>

        <Lemma number="3">
          这是一个引理。
        </Lemma>

        <Example number="4">
          这是一个例子。
        </Example>

        <Proof>
          这是一个证明。
        </Proof>
      </div>

      <div className="text-center py-8">
        <p className="text-muted-foreground">测试完成</p>
      </div>
    </div>
  );
}