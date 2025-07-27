import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Eye, Edit, HelpCircle, Copy, FileText, Calculator, Undo2, Redo2 } from 'lucide-react';
import 'katex/dist/katex.min.css';

interface MarkdownEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  height?: string;
  label?: string;
}

export function MarkdownEditor({ 
  value = '', 
  onChange, 
  height = '400px',
  label 
}: MarkdownEditorProps) {
  const [content, setContent] = useState(value);
  const [mode, setMode] = useState<'edit' | 'preview' | 'split'>('edit');
  const [showTips, setShowTips] = useState(false);
  const editorRef = useRef<any>(null);

  // 自动关闭提示框
  useEffect(() => {
    if (showTips) {
      const timer = setTimeout(() => {
        setShowTips(false);
      }, 8000); // 8秒后自动关闭
      
      return () => clearTimeout(timer);
    }
  }, [showTips]);

  useEffect(() => {
    setContent(value);
  }, [value]);

  const handleEditorChange = (newValue: string | undefined) => {
    const updatedValue = newValue || '';
    setContent(updatedValue);
    onChange?.(updatedValue);
  };

  const insertTemplate = (template: string) => {
    if (editorRef.current) {
      const editor = editorRef.current;
      const selection = editor.getSelection();
      const range = {
        startLineNumber: selection.startLineNumber,
        startColumn: selection.startColumn,
        endLineNumber: selection.endLineNumber,
        endColumn: selection.endColumn,
      };
      
      // 如果是模板替换，则清空整个编辑器内容
      if (template.includes('## 题目')) {
        const model = editor.getModel();
        if (model) {
          model.setValue(template);
        }
      } else {
        // 否则在当前位置插入
        editor.executeEdits('insert-template', [
          {
            range: range,
            text: template,
            forceMoveMarkers: true,
          },
        ]);
      }
      
      editor.focus();
    }
  };

  const templates = [
    {
      name: '单选题模板',
      icon: <FileText className="w-4 h-4" />,
      template: `## 题目

请在此处输入题目内容...

## 选项

A. 选项A
B. 选项B  
C. 选项C
D. 选项D

## 正确答案

A

## 解析

请在此处输入答案解析...`
    },
    {
      name: '多选题模板',
      icon: <FileText className="w-4 h-4" />,
      template: `## 题目

请在此处输入题目内容...

## 选项

A. 选项A
B. 选项B
C. 选项C
D. 选项D

## 正确答案

A, C

## 解析

请在此处输入答案解析...`
    },
    {
      name: '数学题模板',
      icon: <Calculator className="w-4 h-4" />,
      template: `## 题目

已知函数 $f(x) = x^2 + 2x + 1$，求：

1. $f(0)$ 的值
2. 求解方程 $f(x) = 0$

## 解答过程

### 第一问
将 $x = 0$ 代入函数：
$$f(0) = 0^2 + 2 \\cdot 0 + 1 = 1$$

### 第二问
解方程 $x^2 + 2x + 1 = 0$：
$$x^2 + 2x + 1 = (x + 1)^2 = 0$$
因此 $x = -1$

## 答案

1. $f(0) = 1$
2. $x = -1$`
    },
    {
      name: '问答题模板',
      icon: <FileText className="w-4 h-4" />,
      template: `## 题目

请在此处输入题目内容...

## 参考答案

请在此处输入参考答案...

## 评分标准

1. 要点一 (X分)
2. 要点二 (X分)  
3. 要点三 (X分)

## 解析

请在此处输入答案解析...`
    }
  ];

  const markdownTips = [
    { syntax: '# 标题', description: '一级标题' },
    { syntax: '## 标题', description: '二级标题' },
    { syntax: '**粗体**', description: '粗体文本' },
    { syntax: '*斜体*', description: '斜体文本' },
    { syntax: '`代码`', description: '行内代码' },
    { syntax: '```代码块```', description: '代码块' },
    { syntax: '- 列表项', description: '无序列表' },
    { syntax: '1. 列表项', description: '有序列表' },
    { syntax: '[链接](URL)', description: '超链接' },
    { syntax: '![图片](URL)', description: '图片' },
    { syntax: '> 引用', description: '引用块' },
    { syntax: '| 表格 | 标题 |', description: '表格' },
    { syntax: '$x^2$', description: '行内公式' },
    { syntax: '$$\\frac{a}{b}$$', description: '块级公式' },
    { syntax: '$\\sqrt{x}$', description: '根号' },
    { syntax: '$\\sum_{i=1}^n$', description: '求和符号' },
    { syntax: '$\\int_a^b$', description: '积分符号' },
    { syntax: '$\\alpha, \\beta$', description: '希腊字母' },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleUndo = () => {
    if (editorRef.current) {
      editorRef.current.trigger('keyboard', 'undo', null);
    }
  };

  const handleRedo = () => {
    if (editorRef.current) {
      editorRef.current.trigger('keyboard', 'redo', null);
    }
  };

  return (
    <div className="space-y-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      {/* 工具栏 */}
      <div className="bg-gray-50 p-2 sm:p-3 rounded-t-lg border">
        {/* 第一行：模式切换和主要功能 */}
        <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-white rounded-md p-1">
              <Button
                variant={mode === 'edit' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setMode('edit')}
                className="h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3"
              >
                <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden xs:inline">编辑</span>
              </Button>
              <Button
                variant={mode === 'preview' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setMode('preview')}
                className="h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3"
              >
                <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden xs:inline">预览</span>
              </Button>
              <Button
                variant={mode === 'split' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setMode('split')}
                className="h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3 hidden sm:flex"
              >
                <div className="flex items-center">
                  <Edit className="w-3 h-3" />
                  <Eye className="w-3 h-3 ml-1" />
                </div>
                <span className="ml-1">分屏</span>
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUndo}
              title="撤销"
              className="h-7 sm:h-8 px-2 sm:px-3"
            >
              <Undo2 className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRedo}
              title="重做"
              className="h-7 sm:h-8 px-2 sm:px-3"
            >
              <Redo2 className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTips(!showTips)}
              title="Markdown 语法提示"
              className="h-7 sm:h-8 px-2 sm:px-3"
            >
              <HelpCircle className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(content)}
              title="复制内容"
              className="h-7 sm:h-8 px-2 sm:px-3"
            >
              <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>
        
        {/* 第二行：数学公式快捷按钮和模板 */}
        <div className="flex items-center flex-wrap gap-1 sm:gap-2">
          <Separator orientation="vertical" className="h-6 hidden sm:block" />
          
          {/* 数学公式快捷按钮 */}
          <div className="flex items-center space-x-1 order-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertTemplate('$x^2$')}
              title="插入上标"
              className="h-7 sm:h-8 px-2 text-xs"
            >
              x²
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertTemplate('$\\frac{a}{b}$')}
              title="插入分数"
              className="h-7 sm:h-8 px-2 text-xs"
            >
              a/b
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertTemplate('$\\sqrt{x}$')}
              title="插入根号"
              className="h-7 sm:h-8 px-2 text-xs"
            >
              √x
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertTemplate('$$\n\\begin{equation}\n\\end{equation}\n$$')}
              title="插入公式块"
              className="h-7 sm:h-8 px-2"
            >
              <Calculator className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
          
          <Separator orientation="vertical" className="h-6 hidden sm:block" />
          
          {/* 模板按钮 */}
          <div className="flex items-center flex-wrap gap-1 order-2">
            {templates.map((template, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => insertTemplate(template.template)}
                title={template.name}
                className="h-7 sm:h-8 px-2 text-xs"
              >
                {template.icon}
                <span className="ml-1 hidden lg:inline text-xs">{template.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Markdown 语法提示弹窗 */}
      <Dialog open={showTips} onOpenChange={setShowTips}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white border border-gray-300 shadow-2xl">
          <DialogHeader className="border-b border-gray-200 pb-4">
            <DialogTitle className="flex items-center space-x-2 text-gray-900 font-semibold">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              <span>Markdown 语法参考</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 bg-white p-1">
            <div>
              <h5 className="font-semibold text-gray-900 mb-4 text-base">基础语法</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {markdownTips.slice(0, 12).map((tip, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                    <code className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-md text-xs font-mono border border-blue-200 font-semibold whitespace-nowrap">
                      {tip.syntax}
                    </code>
                    <span className="text-sm text-gray-800 font-medium">{tip.description}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h5 className="font-semibold text-gray-900 mb-4 text-base">数学公式（LaTeX）</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {markdownTips.slice(12).map((tip, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors">
                    <code className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-md text-xs font-mono border border-emerald-200 font-semibold whitespace-nowrap">
                      {tip.syntax}
                    </code>
                    <span className="text-sm text-emerald-800 font-medium">{tip.description}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <p className="text-sm text-emerald-900 mb-4 font-semibold">
                  常用数学公式示例：
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-emerald-800">
                  <div className="flex items-center space-x-3">
                    <code className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-md text-xs font-mono border border-emerald-200 font-semibold whitespace-nowrap">
                      {`$a^2 + b^2 = c^2$`}
                    </code>
                    <span className="font-medium">勾股定理</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <code className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-md text-xs font-mono border border-emerald-200 font-semibold whitespace-nowrap">
                      {`$\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$`}
                    </code>
                    <span className="font-medium">极限</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <code className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-md text-xs font-mono border border-emerald-200 font-semibold whitespace-nowrap">
                      {`$$\\int_0^1 x^2 dx = \\frac{1}{3}$$`}
                    </code>
                    <span className="font-medium">定积分</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <code className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-md text-xs font-mono border border-emerald-200 font-semibold whitespace-nowrap">
                      {`$\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$`}
                    </code>
                    <span className="font-medium">矩阵</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center pt-6 border-t border-gray-200">
              <Button 
                onClick={() => setShowTips(false)} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 font-semibold shadow-sm"
              >
                知道了
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 编辑器内容区域 */}
      <div className="border rounded-b-lg overflow-hidden" style={{ height }}>
        {mode === 'edit' && (
          <Editor
            height="100%"
            defaultLanguage="markdown"
            value={content}
            onChange={handleEditorChange}
            onMount={(editor) => {
              editorRef.current = editor;
            }}
            options={{
              wordWrap: 'on',
              lineNumbers: 'on',
              minimap: { enabled: false },
              fontSize: 14,
              lineHeight: 1.6,
              padding: { top: 16 },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              insertSpaces: true,
              renderWhitespace: 'boundary',
              bracketPairColorization: { enabled: true },
              guides: {
                bracketPairs: true,
                indentation: true
              }
            }}
            theme="vs"
          />
        )}
        
        {mode === 'preview' && (
          <div className="h-full overflow-auto p-6 bg-white">
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  h1: ({ children }) => <h1 className="text-2xl font-bold text-gray-900 mt-6 mb-4">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl font-semibold text-gray-800 mt-5 mb-3">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-lg font-medium text-gray-700 mt-4 mb-2">{children}</h3>,
                  p: ({ children }) => <p className="text-gray-700 mb-3 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-6 mb-3 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-6 mb-3 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="text-gray-700">{children}</li>,
                  code: ({ children }) => <code className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm font-mono">{children}</code>,
                  pre: ({ children }) => <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>,
                  blockquote: ({ children }) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 mb-4">{children}</blockquote>,
                  table: ({ children }) => <table className="min-w-full border-collapse border border-gray-300 mb-4">{children}</table>,
                  th: ({ children }) => <th className="border border-gray-300 px-4 py-2 bg-gray-50 font-semibold text-left">{children}</th>,
                  td: ({ children }) => <td className="border border-gray-300 px-4 py-2">{children}</td>,
                }}
              >
                {content || '*暂无内容*'}
              </ReactMarkdown>
            </div>
          </div>
        )}
        
        {mode === 'split' && (
          <div className="flex h-full">
            <div className="w-1/2 border-r">
              <Editor
                height="100%"
                defaultLanguage="markdown"
                value={content}
                onChange={handleEditorChange}
                onMount={(editor) => {
                  editorRef.current = editor;
                }}
                options={{
                  wordWrap: 'on',
                  lineNumbers: 'on',
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineHeight: 1.6,
                  padding: { top: 16 },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  insertSpaces: true,
                }}
                theme="vs"
              />
            </div>
            <div className="w-1/2 overflow-auto p-6 bg-white">
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  components={{
                    h1: ({ children }) => <h1 className="text-2xl font-bold text-gray-900 mt-6 mb-4">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-xl font-semibold text-gray-800 mt-5 mb-3">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-lg font-medium text-gray-700 mt-4 mb-2">{children}</h3>,
                    p: ({ children }) => <p className="text-gray-700 mb-3 leading-relaxed">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc pl-6 mb-3 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-6 mb-3 space-y-1">{children}</ol>,
                    li: ({ children }) => <li className="text-gray-700">{children}</li>,
                    code: ({ children }) => <code className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm font-mono">{children}</code>,
                    pre: ({ children }) => <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>,
                    blockquote: ({ children }) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 mb-4">{children}</blockquote>,
                    table: ({ children }) => <table className="min-w-full border-collapse border border-gray-300 mb-4">{children}</table>,
                    th: ({ children }) => <th className="border border-gray-300 px-4 py-2 bg-gray-50 font-semibold text-left">{children}</th>,
                    td: ({ children }) => <td className="border border-gray-300 px-4 py-2">{children}</td>,
                  }}
                >
                  {content || '*暂无内容*'}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
