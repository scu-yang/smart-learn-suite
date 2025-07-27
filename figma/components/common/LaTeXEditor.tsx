import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Code, 
  Eye, 
  EyeOff, 
  Calculator, 
  Split, 
  Maximize2, 
  Minimize2,
  RefreshCw,
  Info
} from 'lucide-react';
import { MixedContentRenderer } from './MathRenderer';

interface LaTeXEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  showPreview?: boolean;
  label?: string;
  description?: string;
}

export function LaTeXEditor({
  value,
  onChange,
  placeholder = "输入LaTeX内容...",
  rows = 6,
  className = '',
  showPreview = true,
  label,
  description
}: LaTeXEditorProps) {
  const [isPreviewVisible, setIsPreviewVisible] = useState(showPreview);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewHeight, setPreviewHeight] = useState<number | null>(null);
  const [cursorPosition, setCursorPosition] = useState(0);
  const previewRef = useRef<HTMLDivElement>(null);

  // 自适应预览框高度
  useEffect(() => {
    if (isPreviewVisible && previewRef.current) {
      const updatePreviewHeight = () => {
        const content = previewRef.current?.querySelector('.math-content');
        if (content) {
          const height = content.scrollHeight;
          setPreviewHeight(Math.max(120, Math.min(400, height + 40))); // 最小120px，最大400px
        }
      };

      // 延迟执行以确保内容已渲染
      const timer = setTimeout(updatePreviewHeight, 100);
      
      return () => clearTimeout(timer);
    }
  }, [value, isPreviewVisible]);

  const insertTemplate = (template: string) => {
    const cursorPos = cursorPosition;
    const beforeCursor = value.substring(0, cursorPos);
    const afterCursor = value.substring(cursorPos);
    
    // Remove the | placeholder from template if it exists
    const cleanTemplate = template.replace('|', '');
    const newValue = beforeCursor + cleanTemplate + afterCursor;
    
    onChange(newValue);
    
    // Update cursor position to after the inserted template
    setCursorPosition(cursorPos + cleanTemplate.length);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    setCursorPosition(e.target.selectionStart);
  };

  const handleTextareaSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    setCursorPosition(target.selectionStart);
  };

  const mathTemplates = [
    { label: '分数', template: '\\frac{|}{}' },
    { label: '根号', template: '\\sqrt{|}' },
    { label: '上标', template: '^{|}' },
    { label: '下标', template: '_{|}' },
    { label: '积分', template: '\\int_{|}^{} ' },
    { label: '求和', template: '\\sum_{|}^{} ' },
    { label: '极限', template: '\\lim_{x \\to |} ' },
    { label: '矩阵', template: '\\begin{pmatrix}\n| & \\\\\n & \n\\end{pmatrix}' },
    { label: 'Cases', template: '\\begin{cases}\n| & \\text{if } \\\\\n & \\text{if } \n\\end{cases}' },
    { label: 'Align', template: '\\begin{align}\n| &= \\\\\n &= \n\\end{align}' },
    { label: 'Gather', template: '\\begin{gather}\n|\\\\\n\n\\end{gather}' },
    { label: '定理', template: '\\begin{theorem}[|]\n\n\\end{theorem}' }
  ];

  const editorClass = `
    ${className}
    ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}
  `;

  return (
    <div className={editorClass}>
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              {label && <CardTitle className="text-base">{label}</CardTitle>}
              {description && (
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewVisible(!isPreviewVisible)}
                className="gap-2"
              >
                {isPreviewVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {isPreviewVisible ? '隐藏预览' : '显示预览'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="gap-2"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                {isFullscreen ? '退出全屏' : '全屏编辑'}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Tabs defaultValue="editor" className="h-full">
            <div className="px-6 pb-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="editor" className="gap-2">
                  <Code className="w-4 h-4" />
                  编辑器
                </TabsTrigger>
                <TabsTrigger value="templates" className="gap-2">
                  <Calculator className="w-4 h-4" />
                  模板
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="editor" className="mt-0">
              <div className={`${isPreviewVisible ? 'grid grid-cols-2 gap-4' : ''} px-6 pb-6`}>
                {/* 编辑器区域 */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Code className="w-4 h-4" />
                    <span>LaTeX 源代码</span>
                  </div>
                  <div className="relative">
                    <Textarea
                      value={value}
                      onChange={handleTextareaChange}
                      onSelect={handleTextareaSelect}
                      placeholder={placeholder}
                      rows={isFullscreen ? 20 : rows}
                      className="font-mono text-sm resize-none"
                      style={{
                        minHeight: isFullscreen ? '60vh' : `${rows * 1.5}em`,
                        maxHeight: isFullscreen ? '60vh' : '400px',
                        overflowY: 'auto', // 添加垂直滚动条
                        scrollbarWidth: 'thin'
                      }}
                    />
                    
                    {/* 字符计数 */}
                    <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
                      {value.length} 字符
                    </div>
                  </div>
                  
                  {/* 帮助信息 */}
                  <div className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg text-sm">
                    <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="font-medium">LaTeX 支持说明：</p>
                      <ul className="text-xs text-muted-foreground space-y-0.5">
                        <li>• 数学环境可直接使用，无需 $ 包裹：align, gather, cases 等</li>
                        <li>• 矩阵环境：pmatrix, bmatrix, vmatrix 等</li>
                        <li>• 行内公式使用 $...$ 包裹</li>
                        <li>• 显示公式使用 $$...$$ 包裹或独立环境</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 预览区域 */}
                {isPreviewVisible && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Eye className="w-4 h-4" />
                      <span>实时预览</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.location.reload()}
                        className="p-1 h-auto ml-auto"
                      >
                        <RefreshCw className="w-3 h-3" />
                      </Button>
                    </div>
                    <div 
                      ref={previewRef}
                      className="border rounded-lg bg-background"
                      style={{
                        minHeight: '120px',
                        maxHeight: isFullscreen ? '60vh' : '400px',
                        height: previewHeight ? `${previewHeight}px` : 'auto',
                        overflowY: 'auto', // 添加垂直滚动条
                        overflowX: 'auto'  // 添加水平滚动条防止溢出
                      }}
                    >
                      <div className="p-4 math-content">
                        {value ? (
                          <MixedContentRenderer content={value} />
                        ) : (
                          <div className="text-center text-muted-foreground py-8">
                            <Calculator className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">在左侧输入 LaTeX 代码查看预览</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="templates" className="mt-0 px-6 pb-6">
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  点击模板快速插入到编辑器中
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {mathTemplates.map((template, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => insertTemplate(template.template)}
                      className="justify-start text-left"
                    >
                      {template.label}
                    </Button>
                  ))}
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">常用环境示例：</h4>
                  <div className="text-xs text-muted-foreground space-y-1 font-mono bg-muted/30 p-3 rounded">
                    <div>对齐公式：\begin{`{align}`} x &amp;= 1 \\ y &amp;= 2 \end{`{align}`}</div>
                    <div>矩阵：\begin{`{pmatrix}`} a &amp; b \\ c &amp; d \end{`{pmatrix}`}</div>
                    <div>分情况：\begin{`{cases}`} x &amp; \text{`{if}`} x &gt; 0 \\ 0 &amp; \text{`{otherwise}`} \end{`{cases}`}</div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default LaTeXEditor;