import React, { useEffect, useRef, useState, memo, useMemo, useCallback } from 'react';

// 统一的渲染器接口
interface MathRendererProps {
  content: string;
  inline?: boolean;
  className?: string;
}

// 保持向后兼容的 math 属性接口
interface LegacyMathRendererProps {
  math: string;
  inline?: boolean;
  className?: string;
}

declare global {
  interface Window {
    katex: any;
  }
}

// 改进的缓存系统
class MathCache {
  private cache = new Map<string, { html: string; displayMode: boolean }>();
  private maxSize = 1000; // 增加缓存容量

  get(key: string): { html: string; displayMode: boolean } | undefined {
    const cached = this.cache.get(key);
    if (cached) {
      // Move to end (LRU)
      this.cache.delete(key);
      this.cache.set(key, cached);
    }
    return cached;
  }

  set(key: string, value: { html: string; displayMode: boolean }) {
    if (this.cache.size >= this.maxSize) {
      // Remove oldest entry
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }
}

// 全局缓存实例
const mathCache = new MathCache();

// Global state to track KaTeX loading
let katexLoadingPromise: Promise<void> | null = null;
let katexLoaded = false;

function loadKaTeX(): Promise<void> {
  if (katexLoaded && window.katex) {
    return Promise.resolve();
  }
  
  if (katexLoadingPromise) {
    return katexLoadingPromise;
  }

  katexLoadingPromise = new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.katex) {
      katexLoaded = true;
      resolve();
      return;
    }

    // Load KaTeX CSS
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
    cssLink.crossOrigin = 'anonymous';
    document.head.appendChild(cssLink);

    // Load KaTeX JS
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
    script.crossOrigin = 'anonymous';
    script.async = true;
    
    script.onload = () => {
      if (window.katex) {
        katexLoaded = true;
        resolve();
      } else {
        reject(new Error('KaTeX failed to load'));
      }
    };
    
    script.onerror = () => {
      reject(new Error('Failed to load KaTeX script'));
    };
    
    document.head.appendChild(script);
  });

  return katexLoadingPromise;
}

// 改进的环境预处理函数
function preprocessMathEnvironments(math: string): string {
  if (!math) return '';
  
  let processed = math;
  
  // 只处理特定的对齐环境，保持其他环境不变
  const alignReplacements = [
    { from: /\\begin\{align\*?\}(.*?)\\end\{align\*?\}/gs, to: '\\begin{aligned}$1\\end{aligned}' },
    { from: /\\begin\{gather\*?\}(.*?)\\end\{gather\*?\}/gs, to: '\\begin{gathered}$1\\end{gathered}' },
    { from: /\\begin\{multline\*?\}(.*?)\\end\{multline\*?\}/gs, to: '\\begin{aligned}$1\\end{aligned}' },
    { from: /\\begin\{eqnarray\*?\}(.*?)\\end\{eqnarray\*?\}/gs, to: (match: string, inner: string) => {
      // Convert eqnarray format (&=&) to aligned format (&=)
      const alignedInner = inner.replace(/&\s*=\s*&/g, '&=');
      return `\\begin{aligned}${alignedInner}\\end{aligned}`;
    }}
  ];

  for (const replacement of alignReplacements) {
    if (typeof replacement.to === 'function') {
      processed = processed.replace(replacement.from, replacement.to);
    } else {
      processed = processed.replace(replacement.from, replacement.to);
    }
  }
  
  return processed;
}

// 检测是否为数学环境（不需要$包裹的环境）
function isMathEnvironment(content: string): boolean {
  if (!content) return false;
  
  // 数学环境列表（完整）
  const mathEnvironments = [
    // 对齐环境
    'align', 'align\\*', 'aligned',
    'gather', 'gather\\*', 'gathered',
    'multline', 'multline\\*',
    'eqnarray', 'eqnarray\\*',
    'flalign', 'flalign\\*',
    'alignat', 'alignat\\*',
    // 矩阵环境
    'matrix', 'pmatrix', 'bmatrix', 'vmatrix', 'Bmatrix', 'Vmatrix',
    'smallmatrix',
    // 其他环境
    'cases', 'array', 'split', 'subequations',
    // 定理环境
    'theorem', 'proposition', 'lemma', 'corollary', 
    'definition', 'example', 'exercise', 'proof', 'solution'
  ];
  
  return mathEnvironments.some(env => {
    const beginPattern = new RegExp(`\\\\begin\\{${env}\\}`, 'i');
    return beginPattern.test(content);
  });
}

// 改进的清理函数
function cleanMathString(math: string): string {
  if (!math) return '';
  
  let cleaned = math.trim();
  
  // 检查是否为独立的数学环境
  if (isMathEnvironment(cleaned)) {
    // 如果是数学环境，移除外层的$包裹（如果有）
    if (cleaned.startsWith('$$') && cleaned.endsWith('$$')) {
      cleaned = cleaned.slice(2, -2).trim();
    } else if (cleaned.startsWith('$') && cleaned.endsWith('$')) {
      cleaned = cleaned.slice(1, -1).trim();
    }
  } else {
    // 对于普通的数学表达式，移除外层的$包裹
    if (cleaned.startsWith('$$') && cleaned.endsWith('$$') && cleaned.length > 4) {
      cleaned = cleaned.slice(2, -2);
    } else if (cleaned.startsWith('$') && cleaned.endsWith('$') && cleaned.length > 2) {
      cleaned = cleaned.slice(1, -1);
    }
  }
  
  // 应用环境预处理（仅对特定对齐环境）
  if (cleaned.includes('\\begin{') && 
      (/\\begin\{align/.test(cleaned) || 
       /\\begin\{gather/.test(cleaned) || 
       /\\begin\{multline/.test(cleaned) || 
       /\\begin\{eqnarray/.test(cleaned))) {
    cleaned = preprocessMathEnvironments(cleaned);
  }
  
  return cleaned;
}

// 改进的KaTeX渲染选项
const KATEX_OPTIONS = {
  throwOnError: false,
  errorColor: '#dc2626',
  strict: false,
  trust: true,
  macros: {
    // 数字集合
    '\\R': '\\mathbb{R}',
    '\\N': '\\mathbb{N}',
    '\\Z': '\\mathbb{Z}',
    '\\Q': '\\mathbb{Q}',
    '\\C': '\\mathbb{C}',
    '\\F': '\\mathbb{F}',
    
    // 常用函数
    '\\abs': '\\left|#1\\right|',
    '\\norm': '\\left\\|#1\\right\\|',
    '\\set': '\\left\\{#1\\right\\}',
    '\\ceil': '\\left\\lceil#1\\right\\rceil',
    '\\floor': '\\left\\lfloor#1\\right\\rfloor',
    
    // 导数
    '\\dd': '\\mathrm{d}',
    '\\diff': '\\frac{\\mathrm{d}#1}{\\mathrm{d}#2}',
    '\\pdiff': '\\frac{\\partial#1}{\\partial#2}',
    
    // 逻辑符号
    '\\implies': '\\Rightarrow',
    '\\iff': '\\Leftrightarrow',
  }
};

// 主要渲染组件（统一接口）
export const MathRenderer = memo(({ content, math, inline = false, className = '' }: 
  (MathRendererProps | LegacyMathRendererProps) & { content?: string }) => {
  
  const containerRef = useRef<HTMLSpanElement | HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [renderedHtml, setRenderedHtml] = useState<string>('');

  // 支持新旧接口
  const mathContent = content || (math as any) || '';

  // 创建缓存键
  const cacheKey = useMemo(() => {
    if (!mathContent) return '';
    const cleanMath = cleanMathString(mathContent);
    const shouldUseDisplayMode = !inline || 
      isMathEnvironment(cleanMath) ||
      /\\begin\{(aligned|gathered|cases|array|matrix|pmatrix|bmatrix|vmatrix|Bmatrix|Vmatrix)/.test(cleanMath);
    return `${cleanMath}|${shouldUseDisplayMode}`;
  }, [mathContent, inline]);

  // 渲染数学公式的回调函数
  const renderMath = useCallback(async () => {
    if (!mathContent || !cacheKey) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setHasError(false);
      
      // 检查缓存
      const cached = mathCache.get(cacheKey);
      if (cached) {
        setRenderedHtml(cached.html);
        setIsLoading(false);
        return;
      }
      
      await loadKaTeX();
      
      if (!window.katex) {
        throw new Error('KaTeX not available');
      }

      const cleanMath = cleanMathString(mathContent);
      
      if (!cleanMath) {
        setRenderedHtml(mathContent);
        setIsLoading(false);
        return;
      }

      // 智能显示模式检测
      const shouldUseDisplayMode = !inline || 
        isMathEnvironment(cleanMath) ||
        /\\begin\{(aligned|gathered|cases|array|matrix|pmatrix|bmatrix|vmatrix|Bmatrix|Vmatrix)/.test(cleanMath);

      // 渲染到临时容器
      const tempDiv = document.createElement('div');
      window.katex.render(cleanMath, tempDiv, {
        ...KATEX_OPTIONS,
        displayMode: shouldUseDisplayMode,
      });
      
      const html = tempDiv.innerHTML;
      
      // 缓存结果
      mathCache.set(cacheKey, { html, displayMode: shouldUseDisplayMode });
      
      setRenderedHtml(html);
      setIsLoading(false);
    } catch (error) {
      console.warn('KaTeX rendering error:', error, 'Content:', mathContent);
      setRenderedHtml(mathContent);
      setHasError(true);
      setIsLoading(false);
    }
  }, [mathContent, cacheKey, inline]);

  // 渲染效果
  useEffect(() => {
    let mounted = true;
    
    const render = async () => {
      if (mounted) {
        await renderMath();
      }
    };
    
    render();
    
    return () => {
      mounted = false;
    };
  }, [renderMath]);

  // 设置容器内容
  useEffect(() => {
    if (containerRef.current && renderedHtml) {
      containerRef.current.innerHTML = renderedHtml;
    }
  }, [renderedHtml]);

  const Element = inline ? 'span' : 'div';
  
  return (
    <Element
      ref={containerRef as any}
      className={`${className} ${inline ? 'inline-math' : 'display-math'} ${
        hasError ? 'text-destructive' : ''
      }`}
      style={{
        display: inline ? 'inline' : 'block',
        margin: inline ? '0' : '0.5em 0',
        minHeight: isLoading ? '1em' : 'auto',
        width: inline ? 'auto' : '100%',
        maxWidth: '100%',
        overflowX: 'auto',
        overflowY: 'visible'
      }}
    >
      {isLoading ? mathContent : ''}
    </Element>
  );
});

MathRenderer.displayName = 'MathRenderer';

// 工具组件
export const InlineMath = memo(({ children, className = '' }: { children: string; className?: string }) => {
  return <MathRenderer content={children} inline={true} className={className} />;
});

InlineMath.displayName = 'InlineMath';

export const DisplayMath = memo(({ children, className = '' }: { children: string; className?: string }) => {
  return <MathRenderer content={children} inline={false} className={className} />;
});

DisplayMath.displayName = 'DisplayMath';

// 检测是否包含数学内容
export function containsMath(text: string): boolean {
  if (!text) return false;
  return /\$[^$]+\$|\\\w+|\{|\}|\^|_/.test(text) || isMathEnvironment(text);
}

// 行内数学处理器
const InlineMathProcessor = memo(({ content, className = '' }: { content: string; className?: string }) => {
  const parts = useMemo(() => {
    if (!content || !content.includes('$')) {
      return [content];
    }
    return content.split(/(\$[^$]+\$)/);
  }, [content]);
  
  if (!content || !content.includes('$')) {
    return <span className={className}>{content}</span>;
  }
  
  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
          return (
            <MathRenderer 
              key={`math-${index}`}
              content={part.slice(1, -1)} 
              inline={true} 
            />
          );
        }
        return <span key={`text-${index}`}>{part}</span>;
      })}
    </span>
  );
});

InlineMathProcessor.displayName = 'InlineMathProcessor';

// 混合内容渲染器（统一的LaTeX渲染组件）
export const MixedContentRenderer = memo(({ content, className = '' }: { content: string; className?: string }) => {
  const analysis = useMemo(() => {
    if (!content) return { hasInlineMath: false, hasDisplayMath: false, hasMathEnvironment: false };
    const hasInlineMath = content.includes('$') && /\$[^$]+\$/.test(content);
    const hasDisplayMath = content.includes('$$') && /\$\$[^$]+\$\$/.test(content);
    const hasMathEnvironment = isMathEnvironment(content);
    return { hasInlineMath, hasDisplayMath, hasMathEnvironment };
  }, [content]);

  const displayMathParts = useMemo(() => {
    if (!content || !content.includes('$$')) return [content];
    return content.split(/(\$\$[^$]+\$\$)/);
  }, [content]);

  if (!content) return null;

  const { hasInlineMath, hasDisplayMath, hasMathEnvironment } = analysis;
  
  // 如果整个内容是数学环境，直接渲染
  if (hasMathEnvironment && !hasInlineMath && !hasDisplayMath) {
    return (
      <div className={className}>
        <MathRenderer content={content} inline={false} />
      </div>
    );
  }
  
  if (!hasInlineMath && !hasDisplayMath) {
    return <span className={className}>{content}</span>;
  }

  // 处理显示数学
  if (hasDisplayMath) {
    return (
      <div className={className}>
        {displayMathParts.map((part, index) => {
          if (part.startsWith('$$') && part.endsWith('$$')) {
            return (
              <MathRenderer 
                key={`display-${index}`}
                content={part.slice(2, -2)} 
                inline={false} 
              />
            );
          } else {
            return <InlineMathProcessor key={`inline-${index}`} content={part} />;
          }
        })}
      </div>
    );
  }

  // 处理行内数学
  return <InlineMathProcessor content={content} className={className} />;
});

MixedContentRenderer.displayName = 'MixedContentRenderer';

// LaTeX渲染器（带错误处理）
export function LaTeXRenderer({ 
  latex, 
  fallback, 
  inline = false, 
  className = '' 
}: { 
  latex: string; 
  fallback?: string; 
  inline?: boolean; 
  className?: string; 
}) {
  if (!latex) {
    return fallback ? <span className={className}>{fallback}</span> : null;
  }
  
  return (
    <MathRenderer 
      content={latex} 
      inline={inline} 
      className={className}
    />
  );
}

// 智能数学渲染器（推荐使用）
export const SmartMathRenderer = memo(({ 
  content, 
  className = '', 
  inline = false 
}: { 
  content: string; 
  className?: string; 
  inline?: boolean;
}) => {
  if (!content) return null;

  // 智能检测渲染模式
  if (containsMath(content) || content.includes('$') || isMathEnvironment(content)) {
    return <MixedContentRenderer content={content} className={className} />;
  }
  
  // 纯文本内容
  return <span className={className}>{content}</span>;
});

SmartMathRenderer.displayName = 'SmartMathRenderer';

// 缓存管理工具
export const MathCacheUtils = {
  getStats: () => ({
    size: mathCache.size(),
    maxSize: 1000
  }),
  
  clear: () => mathCache.clear(),
  
  preloadKaTeX: loadKaTeX,
  
  // 预热常用公式
  warmup: async (commonFormulas: string[]) => {
    try {
      await loadKaTeX();
      const renderer = document.createElement('div');
      
      for (const formula of commonFormulas) {
        try {
          if (window.katex && formula) {
            const cleanMath = cleanMathString(formula);
            if (cleanMath) {
              window.katex.render(cleanMath, renderer, KATEX_OPTIONS);
            }
          }
        } catch (error) {
          console.warn('Warmup failed for formula:', formula, error);
        }
      }
    } catch (error) {
      console.warn('Failed to preload KaTeX:', error);
    }
  }
};

// 延迟加载高阶组件
export function withLazyMath<P extends object>(Component: React.ComponentType<P>) {
  const LazyMathComponent = memo((props: P) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => observer.disconnect();
    }, []);

    return (
      <div ref={ref}>
        {isVisible ? <Component {...props} /> : <div style={{ minHeight: '2em' }}>Loading...</div>}
      </div>
    );
  });

  LazyMathComponent.displayName = `withLazyMath(${Component.displayName || Component.name})`;
  return LazyMathComponent;
}

// 性能监控Hook
export function useMathPerformance() {
  const [stats, setStats] = useState(() => MathCacheUtils.getStats());

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(MathCacheUtils.getStats());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return {
    ...stats,
    clearCache: MathCacheUtils.clear,
    preloadKaTeX: MathCacheUtils.preloadKaTeX,
    warmup: MathCacheUtils.warmup
  };
}