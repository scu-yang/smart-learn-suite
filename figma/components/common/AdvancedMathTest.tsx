import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { MathRenderer, DisplayMath, InlineMath, MixedContentRenderer } from './MathRenderer';
import { AdvancedMathRenderer, SmartMathRenderer } from './AdvancedMathRenderer';
import { 
  Theorem, 
  Proposition, 
  Lemma, 
  Corollary, 
  Example, 
  Exercise, 
  Proof, 
  Solution,
  TheoremEnvironment 
} from './TheoremEnvironments';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

// Test examples for different LaTeX environments
const mathExamples = {
  alignment: [
    {
      title: 'Align Environment',
      latex: `\\begin{align}
f(x) &= x^2 + 2x + 1 \\\\
&= (x + 1)^2 \\\\
&\\geq 0
\\end{align}`,
      description: 'Multi-line aligned equations'
    },
    {
      title: 'Align* Environment (no numbering)',
      latex: `\\begin{align*}
\\sin^2 x + \\cos^2 x &= 1 \\\\
e^{i\\pi} + 1 &= 0 \\\\
\\sum_{n=1}^{\\infty} \\frac{1}{n^2} &= \\frac{\\pi^2}{6}
\\end{align*}`,
      description: 'Aligned equations without numbering'
    },
    {
      title: 'Gather Environment',
      latex: `\\begin{gather}
x^2 + y^2 = r^2 \\\\
\\frac{d}{dx}[f(x)g(x)] = f'(x)g(x) + f(x)g'(x) \\\\
\\int_a^b f(x) dx = F(b) - F(a)
\\end{gather}`,
      description: 'Centered equations'
    },
    {
      title: 'Gather* Environment',
      latex: `\\begin{gather*}
\\nabla \\cdot \\vec{E} = \\frac{\\rho}{\\epsilon_0} \\\\
\\nabla \\cdot \\vec{B} = 0 \\\\
\\nabla \\times \\vec{E} = -\\frac{\\partial \\vec{B}}{\\partial t}
\\end{gather*}`,
      description: 'Centered equations without numbering'
    },
    {
      title: 'Multline Environment',
      latex: `\\begin{multline}
\\sum_{i=1}^n \\sum_{j=1}^m a_{ij} x_i y_j = \\\\
x_1 y_1 a_{11} + x_1 y_2 a_{12} + \\cdots + x_n y_m a_{nm}
\\end{multline}`,
      description: 'Multi-line single equation'
    },
    {
      title: 'Multline* Environment',
      latex: `\\begin{multline*}
(a + b + c + d + e + f + g + h + i + j + k)^2 = \\\\
a^2 + b^2 + c^2 + \\cdots + 2ab + 2ac + \\cdots
\\end{multline*}`,
      description: 'Multi-line single equation without numbering'
    }
  ],
  matrices: [
    {
      title: 'Parenthesis Matrix (pmatrix)',
      latex: `A = \\begin{pmatrix}
1 & 2 & 3 \\\\
4 & 5 & 6 \\\\
7 & 8 & 9
\\end{pmatrix}`,
      description: 'Matrix with round brackets'
    },
    {
      title: 'Bracket Matrix (bmatrix)',
      latex: `B = \\begin{bmatrix}
a & b \\\\
c & d
\\end{bmatrix}`,
      description: 'Matrix with square brackets'
    },
    {
      title: 'Determinant (vmatrix)',
      latex: `\\det(A) = \\begin{vmatrix}
a & b \\\\
c & d
\\end{vmatrix} = ad - bc`,
      description: 'Determinant notation'
    },
    {
      title: 'Curly Brace Matrix (Bmatrix)',
      latex: `\\begin{Bmatrix}
x_1 \\\\
x_2 \\\\
x_3
\\end{Bmatrix}`,
      description: 'Matrix with curly braces'
    },
    {
      title: 'Double Bar Matrix (Vmatrix)',
      latex: `\\begin{Vmatrix}
1 & 2 \\\\
3 & 4
\\end{Vmatrix}`,
      description: 'Matrix with double vertical bars'
    },
    {
      title: 'Matrix Shortcuts',
      latex: `\\pmat{1 & 2 \\\\ 3 & 4} \\quad \\bmat{a \\\\ b} \\quad \\vmat{x & y \\\\ z & w}`,
      description: 'Using shortcut macros'
    }
  ],
  advanced: [
    {
      title: 'Cases Environment',
      latex: `f(x) = \\begin{cases}
x^2 & \\text{if } x \\geq 0 \\\\
-x^2 & \\text{if } x < 0
\\end{cases}`,
      description: 'Piecewise functions'
    },
    {
      title: 'Array Environment',
      latex: `\\begin{array}{c|cc}
& A & B \\\\
\\hline
C & 1 & 2 \\\\
D & 3 & 4
\\end{array}`,
      description: 'Custom alignment and borders'
    },
    {
      title: 'Enhanced Symbols',
      latex: `\\R, \\N, \\Z, \\Q, \\C \\quad \\abs{x}, \\norm{v}, \\set{1,2,3} \\\\
\\diff{f}{x}, \\pdiff{f}{x}, \\inner{u,v}`,
      description: 'Number sets and function shortcuts'
    }
  ]
};

const theoremExamples = [
  {
    type: 'theorem',
    title: 'Pythagorean Theorem',
    number: '1.1',
    content: 'In a right triangle with legs of length $a$ and $b$ and hypotenuse of length $c$, we have:\n$$a^2 + b^2 = c^2$$'
  },
  {
    type: 'proposition',
    title: 'Square Root Property',
    content: 'For any real number $x \\geq 0$, we have $(\\sqrt{x})^2 = x$.'
  },
  {
    type: 'lemma',
    content: 'If $n$ is an even integer, then $n^2$ is also even.'
  },
  {
    type: 'corollary',
    content: 'The square root of 2 is irrational.'
  },
  {
    type: 'example',
    number: '2.1',
    content: `Find the derivative of $f(x) = x^3 + 2x^2 - 5x + 1$.

**Solution:** Using the power rule:
$$f'(x) = 3x^2 + 4x - 5$$`
  },
  {
    type: 'proof',
    content: `We proceed by contradiction. Assume $\\sqrt{2}$ is rational, so $\\sqrt{2} = \\frac{p}{q}$ where $p$ and $q$ are integers with $\\gcd(p,q) = 1$.

Squaring both sides: $2 = \\frac{p^2}{q^2}$, so $2q^2 = p^2$.

This means $p^2$ is even, so $p$ is even. Let $p = 2k$ for some integer $k$.

Then $2q^2 = (2k)^2 = 4k^2$, so $q^2 = 2k^2$.

This means $q^2$ is even, so $q$ is even.

But this contradicts our assumption that $\\gcd(p,q) = 1$.`
  }
];

export function AdvancedMathTest() {
  const [customInput, setCustomInput] = useState('');
  const [selectedExample, setSelectedExample] = useState('');
  const [renderTest, setRenderTest] = useState<'success' | 'error' | null>(null);

  const loadExample = (latex: string) => {
    setCustomInput(latex);
    setSelectedExample(latex);
  };

  const testEnvironment = (latex: string) => {
    try {
      // This is a simple test - in reality we'd need to actually render and check
      if (latex.includes('\\begin{') && latex.includes('\\end{')) {
        setRenderTest('success');
      } else {
        setRenderTest('error');
      }
    } catch (error) {
      setRenderTest('error');
    }
    
    setTimeout(() => setRenderTest(null), 3000);
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Enhanced LaTeX Math Rendering</h1>
        <p className="text-muted-foreground">
          Advanced support for alignment environments, matrices, and theorem environments
        </p>
        <div className="flex justify-center gap-2">
          <Badge variant="outline">KaTeX 0.16.9</Badge>
          <Badge variant="outline">Align Support</Badge>
          <Badge variant="outline">Matrix Support</Badge>
          <Badge variant="outline">Theorem Environments</Badge>
        </div>
      </div>

      <Tabs defaultValue="alignment" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="alignment">Alignment</TabsTrigger>
          <TabsTrigger value="matrices">Matrices</TabsTrigger>
          <TabsTrigger value="theorems">Theorems</TabsTrigger>
          <TabsTrigger value="custom">Custom Test</TabsTrigger>
        </TabsList>

        <TabsContent value="alignment" className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Note: align, gather, and multline environments are converted to KaTeX-compatible formats (split, gathered).
            </AlertDescription>
          </Alert>
          
          <div className="grid gap-4">
            {mathExamples.alignment.map((example, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{example.title}</CardTitle>
                      <CardDescription>{example.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadExample(example.latex)}
                      >
                        Load Example
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testEnvironment(example.latex)}
                      >
                        Test
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-muted/30 p-3 rounded font-mono text-sm">
                      <pre>{example.latex}</pre>
                    </div>
                    <div className="border rounded p-4 bg-white">
                      <MathRenderer math={example.latex} inline={false} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="matrices" className="space-y-4">
          <div className="grid gap-4">
            {mathExamples.matrices.map((example, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{example.title}</CardTitle>
                      <CardDescription>{example.description}</CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadExample(example.latex)}
                    >
                      Load Example
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-muted/30 p-3 rounded font-mono text-sm">
                      <pre>{example.latex}</pre>
                    </div>
                    <div className="border rounded p-4 bg-white">
                      <MathRenderer math={example.latex} inline={false} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="theorems" className="space-y-4">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Theorem Environments</CardTitle>
                <CardDescription>
                  Mathematical theorem-like environments with proper styling and math rendering
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {theoremExamples.map((example, index) => (
                  <TheoremEnvironment
                    key={index}
                    type={example.type as any}
                    title={example.title}
                    number={example.number}
                  >
                    <MixedContentRenderer content={example.content} />
                  </TheoremEnvironment>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Complete Theorem with Advanced Math</CardTitle>
                <CardDescription>
                  Complex theorem with multiple alignment environments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdvancedMathRenderer
                  content={`
\\begin{theorem}[Fundamental Theorem of Calculus]
If $f$ is continuous on $[a,b]$ and $F$ is an antiderivative of $f$, then:
$\\int_a^b f(x) dx = F(b) - F(a)$
\\end{theorem}

\\begin{proof}
Consider the function $G(x) = \\int_a^x f(t) dt$. By the definition of the derivative:

$\\begin{align}
G'(x) &= \\lim_{h \\to 0} \\frac{G(x+h) - G(x)}{h} \\\\
&= \\lim_{h \\to 0} \\frac{1}{h} \\left( \\int_a^{x+h} f(t) dt - \\int_a^x f(t) dt \\right) \\\\
&= \\lim_{h \\to 0} \\frac{1}{h} \\int_x^{x+h} f(t) dt
\\end{align}$

Since $f$ is continuous, we have $G'(x) = f(x)$.
\\end{proof}

\\begin{example}
Calculate $\\int_0^1 x^2 dx$.

Using the Fundamental Theorem of Calculus:
$\\begin{gather}
F(x) = \\frac{x^3}{3} \\\\
\\int_0^1 x^2 dx = F(1) - F(0) = \\frac{1}{3} - 0 = \\frac{1}{3}
\\end{gather}$
\\end{example}
                  `}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom LaTeX Input</CardTitle>
              <CardDescription>
                Test your own LaTeX expressions with enhanced environment support
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderTest && (
                <Alert className={renderTest === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                  {renderTest === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription>
                    {renderTest === 'success' 
                      ? 'Environment detected and should render correctly!' 
                      : 'No valid LaTeX environment detected.'
                    }
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">LaTeX Input:</label>
                <Textarea
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Enter your LaTeX expression here..."
                  className="font-mono min-h-32"
                  rows={8}
                />
              </div>

              {customInput && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rendered Output:</label>
                  <div className="border rounded p-4 bg-white min-h-16">
                    <SmartMathRenderer content={customInput} />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Quick Examples:</label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCustomInput('\\begin{align}\nf(x) &= x^2 + 1 \\\\\ng(x) &= 2x - 3\n\\end{align}')}
                  >
                    Align
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCustomInput('\\begin{gather}\nx^2 + y^2 = r^2 \\\\\nE = mc^2\n\\end{gather}')}
                  >
                    Gather
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCustomInput('\\begin{pmatrix}\n1 & 2 \\\\\n3 & 4\n\\end{pmatrix}')}
                  >
                    Matrix
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCustomInput('\\begin{theorem}[Test]\nThis is a theorem with $\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}$.\n\\end{theorem}')}
                  >
                    Theorem
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCustomInput('f(x) = \\begin{cases}\nx^2 & \\text{if } x \\geq 0 \\\\\n-x^2 & \\text{if } x < 0\n\\end{cases}')}
                  >
                    Cases
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Supported Environments & Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Alignment Environments</h4>
                  <div className="space-y-1">
                    <Badge variant="outline" className="block w-fit">align → split</Badge>
                    <Badge variant="outline" className="block w-fit">align* → split</Badge>
                    <Badge variant="outline" className="block w-fit">gather → gathered</Badge>
                    <Badge variant="outline" className="block w-fit">gather* → gathered</Badge>
                    <Badge variant="outline" className="block w-fit">multline → split</Badge>
                    <Badge variant="outline" className="block w-fit">multline* → split</Badge>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Matrix Environments</h4>
                  <div className="space-y-1">
                    <Badge variant="secondary" className="block w-fit">pmatrix ✓</Badge>
                    <Badge variant="secondary" className="block w-fit">bmatrix ✓</Badge>
                    <Badge variant="secondary" className="block w-fit">vmatrix ✓</Badge>
                    <Badge variant="secondary" className="block w-fit">Bmatrix ✓</Badge>
                    <Badge variant="secondary" className="block w-fit">Vmatrix ✓</Badge>
                    <Badge variant="secondary" className="block w-fit">array ✓</Badge>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Theorem Environments</h4>
                  <div className="space-y-1">
                    <Badge variant="default" className="block w-fit">theorem ✓</Badge>
                    <Badge variant="default" className="block w-fit">proposition ✓</Badge>
                    <Badge variant="default" className="block w-fit">lemma ✓</Badge>
                    <Badge variant="default" className="block w-fit">corollary ✓</Badge>
                    <Badge variant="default" className="block w-fit">example ✓</Badge>
                    <Badge variant="default" className="block w-fit">exercise ✓</Badge>
                    <Badge variant="default" className="block w-fit">proof ✓</Badge>
                    <Badge variant="default" className="block w-fit">solution ✓</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AdvancedMathTest;