import React, { useEffect, useRef, useState, memo, useMemo, useCallback } from 'react';

interface MathRendererProps {
  math: string;
  inline?: boolean;
  className?: string;
}

// 缓存系统
class MathCache {
  private cache = new Map<string, { html: string; displayMode: boolean }>();
  private maxSize = 1000; // 最大缓存数量

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

declare global {
  interface Window {
    katex: any;
  }
}

// Global state to track KaTeX loading
let katexLoadingPromise: Promise<void> | null = null;
let katexLoaded = false;

// 预加载KaTeX的函数
function preloadKaTeX(): Promise<void> {
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

    const loadResources = async () => {
      try {
        // Load CSS first
        if (!document.querySelector('link[href*="katex"]')) {
          const cssLink = document.createElement('link');
          cssLink.rel = 'stylesheet';
          cssLink.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
          cssLink.crossOrigin = 'anonymous';
          document.head.appendChild(cssLink);
        }

        // Load JS with better error handling
        if (!document.querySelector('script[src*="katex"]')) {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
          script.crossOrigin = 'anonymous';
          script.async = true;
          
          await new Promise<void>((resolveScript, rejectScript) => {
            script.onload = () => {
              if (window.katex) {
                katexLoaded = true;
                resolveScript();
              } else {
                rejectScript(new Error('KaTeX failed to load'));
              }
            };
            
            script.onerror = () => {
              rejectScript(new Error('Failed to load KaTeX script'));
            };
            
            document.head.appendChild(script);
          });
        } else if (window.katex) {
          katexLoaded = true;
        }

        resolve();
      } catch (error) {
        reject(error);
      }
    };

    loadResources();
  });

  return katexLoadingPromise;
}

// 优化的环境预处理函数
const preprocessMathEnvironments = memo((math: string): string => {
  if (!math) return '';
  
  let processed = math;
  
  // 批量替换，减少正则表达式执行次数
  const replacements = [
    [/\\begin\{align\*?\}(.*?)\\end\{align\*?\}/gs, '\\begin{aligned}$1\\end{aligned}'],
    [/\\begin\{gather\*?\}(.*?)\\end\{gather\*?\}/gs, '\\begin{gathered}$1\\end{gathered}'],
    [/\\begin\{multline\*?\}(.*?)\\end\{multline\*?\}/gs, '\\begin{aligned}$1\\end{aligned}'],
    [/\\begin\{eqnarray\*?\}(.*?)\\end\{eqnarray\*?\}/gs, (match: string, inner: string) => {
      const alignedInner = inner.replace(/&\s*=\s*&/g, '&=');
      return `\\begin{aligned}${alignedInner}\\end{aligned}`;
    }]
  ];

  for (const [pattern, replacement] of replacements) {
    if (processed.includes('\\begin{')) {
      processed = processed.replace(pattern as RegExp, replacement as any);
    }
  }
  
  return processed;
});

// 优化的清理函数
const cleanMathString = memo((math: string): string => {
  if (!math) return '';
  
  let cleaned = math.trim();
  
  // Remove wrapping dollar signs if present
  if (cleaned.startsWith('$') && cleaned.endsWith('$') && cleaned.length > 2) {
    cleaned = cleaned.slice(1, -1);
  }
  
  // Apply environment preprocessing only if needed
  if (cleaned.includes('\\begin{')) {
    cleaned = preprocessMathEnvironments(cleaned);
  }
  
  return cleaned;
});

// KaTeX渲染选项（常量化以避免重复创建）
const KATEX_OPTIONS = {
  throwOnError: false,
  errorColor: '#dc2626',
  strict: false,
  trust: false,
  macros: {
    // Number sets
    '\\R': '\\mathbb{R}',
    '\\N': '\\mathbb{N}',
    '\\Z': '\\mathbb{Z}',
    '\\Q': '\\mathbb{Q}',
    '\\C': '\\mathbb{C}',
    '\\F': '\\mathbb{F}',
    
    // Matrix shortcuts
    '\\pmat': '\\begin{pmatrix}#1\\end{pmatrix}',
    '\\bmat': '\\begin{bmatrix}#1\\end{bmatrix}',
    '\\vmat': '\\begin{vmatrix}#1\\end{vmatrix}',
    '\\Bmat': '\\begin{Bmatrix}#1\\end{Bmatrix}',
    '\\Vmat': '\\begin{Vmatrix}#1\\end{Vmatrix}',
    
    // Common functions
    '\\abs': '\\left|#1\\right|',
    '\\norm': '\\left\\|#1\\right\\|',
    '\\set': '\\left\\{#1\\right\\}',
    '\\ceil': '\\left\\lceil#1\\right\\rceil',
    '\\floor': '\\left\\lfloor#1\\right\\rfloor',
    
    // Derivatives
    '\\dd': '\\mathrm{d}',
    '\\diff': '\\frac{\\mathrm{d}#1}{\\mathrm{d}#2}',
    '\\pdiff': '\\frac{\\partial#1}{\\partial#2}',
    
    // Logic symbols
    '\\implies': '\\Rightarrow',
    '\\iff': '\\Leftrightarrow',
  }
};

// 优化的数学渲染器组件
export const OptimizedMathRenderer = memo(({ math, inline = false, className = '' }: MathRendererProps) => {
  const containerRef = useRef<HTMLSpanElement | HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [renderedHtml, setRenderedHtml] = useState<string>('');

  // 创建缓存键
  const cacheKey = useMemo(() => {
    if (!math) return '';
    const cleanMath = cleanMathString(math);
    const shouldUseDisplayMode = !inline || /\\begin\{(aligned|gathered|cases|array|matrix|pmatrix|bmatrix|vmatrix|Bmatrix|Vmatrix)\}/.test(cleanMath);
    return `${cleanMath}|${shouldUseDisplayMode}`;
  }, [math, inline]);

  // 渲染数学公式的回调函数
  const renderMath = useCallback(async () => {
    if (!math || !cacheKey) {
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
      
      await preloadKaTeX();
      
      if (!window.katex) {
        throw new Error('KaTeX not available');
      }

      const cleanMath = cleanMathString(math);
      
      if (!cleanMath) {
        setRenderedHtml(math);
        setIsLoading(false);
        return;
      }

      // Use display mode for multi-line environments or when explicitly requested
      const shouldUseDisplayMode = !inline || /\\begin\{(aligned|gathered|cases|array|matrix|pmatrix|bmatrix|vmatrix|Bmatrix|Vmatrix)\}/.test(cleanMath);

      // 渲染到临时容器以获取HTML
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
      console.warn('KaTeX rendering error:', error);
      setRenderedHtml(math);
      setHasError(true);
      setIsLoading(false);
    }
  }, [math, cacheKey, inline]);

  // 优化的渲染效果
  useEffect(() => {
    let mounted = true;
    
    const render = async () => {
      await renderMath();
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
        minHeight: isLoading ? '1em' : 'auto'
      }}
    >
      {isLoading ? math : ''}
    </Element>
  );
});

OptimizedMathRenderer.displayName = 'OptimizedMathRenderer';

// 优化的内联数学组件
export const OptimizedInlineMath = memo(({ children, className = '' }: { children: string; className?: string }) => {
  return <OptimizedMathRenderer math={children} inline={true} className={className} />;
});

OptimizedInlineMath.displayName = 'OptimizedInlineMath';

// 优化的显示数学组件
export const OptimizedDisplayMath = memo(({ children, className = '' }: { children: string; className?: string }) => {
  return <OptimizedMathRenderer math={children} inline={false} className={className} />;
});

OptimizedDisplayMath.displayName = 'OptimizedDisplayMath';

// 优化的混合内容渲染器
export const OptimizedMixedContentRenderer = memo(({ content, className = '' }: { content: string; className?: string }) => {
  if (!content) return null;

  // 缓存分析结果
  const analysis = useMemo(() => {
    const hasInlineMath = content.includes('$') && /\$[^$]+\$/.test(content);
    const hasDisplayMath = content.includes('$$') && /\$\$[^$]+\$\$/.test(content);
    return { hasInlineMath, hasDisplayMath };
  }, [content]);

  const { hasInlineMath, hasDisplayMath } = analysis;
  
  if (!hasInlineMath && !hasDisplayMath) {
    return <span className={className}>{content}</span>;
  }

  // Handle display math first
  if (hasDisplayMath) {
    const parts = useMemo(() => content.split(/(\$\$[^$]+\$\$)/), [content]);
    
    return (
      <div className={className}>
        {parts.map((part, index) => {
          if (part.startsWith('$$') && part.endsWith('$$')) {
            return (
              <OptimizedMathRenderer 
                key={`${index}-${part.slice(0, 20)}`}
                math={part.slice(2, -2)} 
                inline={false} 
              />
            );
          } else {
            return <OptimizedInlineMathProcessor key={`${index}-${part.slice(0, 20)}`} content={part} />;
          }
        })}
      </div>
    );
  }

  // Handle inline math only
  return <OptimizedInlineMathProcessor content={content} className={className} />;
});

OptimizedMixedContentRenderer.displayName = 'OptimizedMixedContentRenderer';

// 优化的内联数学处理器
const OptimizedInlineMathProcessor = memo(({ content, className = '' }: { content: string; className?: string }) => {
  if (!content || !content.includes('$')) {
    return <span className={className}>{content}</span>;
  }

  const parts = useMemo(() => content.split(/(\$[^$]+\$)/), [content]);
  
  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
          return (
            <OptimizedMathRenderer 
              key={`${index}-${part.slice(0, 10)}`}
              math={part.slice(1, -1)} 
              inline={true} 
            />
          );
        }
        return <span key={`${index}-text`}>{part}</span>;
      })}
    </span>
  );
});

OptimizedInlineMathProcessor.displayName = 'OptimizedInlineMathProcessor';

// 缓存统计和管理函数
export const MathCacheUtils = {
  getStats: () => ({
    size: mathCache.size(),
    maxSize: 1000
  }),
  
  clear: () => mathCache.clear(),
  
  preloadKaTeX,
  
  // 预热常用公式
  warmup: async (commonFormulas: string[]) => {
    await preloadKaTeX();
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
  }
};

// 高阶组件：延迟加载数学内容
export function withLazyMath<P extends object>(Component: React.ComponentType<P>) {
  return memo((props: P) => {
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
}

// 导出优化后的组件作为默认导出
export default OptimizedMathRenderer;