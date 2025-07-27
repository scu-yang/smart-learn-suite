import React, { memo } from 'react';
import { MathRenderer, MixedContentRenderer, SmartMathRenderer } from './MathRenderer';

// 统一的数学渲染器接口
interface UnifiedMathRendererProps {
  children: string;
  mode?: 'auto' | 'math' | 'mixed' | 'text';
  inline?: boolean;
  className?: string;
  fallback?: string;
}

/**
 * 统一的数学渲染器组件
 * 
 * 使用方式：
 * 1. 自动模式（推荐）：<UnifiedMathRenderer>{content}</UnifiedMathRenderer>
 * 2. 数学模式：<UnifiedMathRenderer mode="math">{mathContent}</UnifiedMathRenderer>
 * 3. 混合模式：<UnifiedMathRenderer mode="mixed">{mixedContent}</UnifiedMathRenderer>
 * 4. 文本模式：<UnifiedMathRenderer mode="text">{textContent}</UnifiedMathRenderer>
 */
export const UnifiedMathRenderer = memo(({ 
  children, 
  mode = 'auto', 
  inline = false,
  className = '',
  fallback = ''
}: UnifiedMathRendererProps) => {
  
  // 空内容处理
  if (!children) {
    return fallback ? <span className={className}>{fallback}</span> : null;
  }

  // 根据模式选择渲染器
  switch (mode) {
    case 'math':
      // 纯数学内容渲染
      return (
        <MathRenderer 
          content={children} 
          inline={inline} 
          className={className} 
        />
      );
      
    case 'mixed':
      // 混合文本和数学内容渲染
      return (
        <MixedContentRenderer 
          content={children} 
          className={className} 
        />
      );
      
    case 'text':
      // 纯文本渲染
      return (
        <span className={className}>{children}</span>
      );
      
    case 'auto':
    default:
      // 智能检测渲染
      return (
        <SmartMathRenderer 
          content={children} 
          inline={inline}
          className={className} 
        />
      );
  }
});

UnifiedMathRenderer.displayName = 'UnifiedMathRenderer';

// 便捷组件导出
export const Math = memo(({ children, className = '' }: { children: string; className?: string }) => (
  <UnifiedMathRenderer mode="math" className={className}>{children}</UnifiedMathRenderer>
));

export const InlineMath = memo(({ children, className = '' }: { children: string; className?: string }) => (
  <UnifiedMathRenderer mode="math" inline={true} className={className}>{children}</UnifiedMathRenderer>
));

export const DisplayMath = memo(({ children, className = '' }: { children: string; className?: string }) => (
  <UnifiedMathRenderer mode="math" inline={false} className={className}>{children}</UnifiedMathRenderer>
));

export const MixedContent = memo(({ children, className = '' }: { children: string; className?: string }) => (
  <UnifiedMathRenderer mode="mixed" className={className}>{children}</UnifiedMathRenderer>
));

export const AutoMath = memo(({ children, className = '' }: { children: string; className?: string }) => (
  <UnifiedMathRenderer mode="auto" className={className}>{children}</UnifiedMathRenderer>
));

// 默认导出
export default UnifiedMathRenderer;

// 使用指南
export const MathRenderingGuide = {
  /**
   * 推荐的使用模式：
   * 
   * 1. 题目内容渲染：
   *    <UnifiedMathRenderer>{question.content}</UnifiedMathRenderer>
   * 
   * 2. 选项渲染：
   *    <UnifiedMathRenderer>{option}</UnifiedMathRenderer>
   * 
   * 3. 答案预览：
   *    <UnifiedMathRenderer>{answer}</UnifiedMathRenderer>
   * 
   * 4. 公式参考：
   *    <UnifiedMathRenderer mode="math">{formula}</UnifiedMathRenderer>
   * 
   * 5. 行内数学：
   *    <UnifiedMathRenderer inline={true}>{inlineMath}</UnifiedMathRenderer>
   * 
   * 6. 纯文本：
   *    <UnifiedMathRenderer mode="text">{plainText}</UnifiedMathRenderer>
   */
  
  examples: {
    questionContent: `<UnifiedMathRenderer>{question.content}</UnifiedMathRenderer>`,
    option: `<UnifiedMathRenderer>{option}</UnifiedMathRenderer>`,
    answerPreview: `<UnifiedMathRenderer>{answer}</UnifiedMathRenderer>`,
    formula: `<UnifiedMathRenderer mode="math">{"$\\\\lim_{x \\\\to 0} \\\\frac{\\\\sin x}{x} = 1$"}</UnifiedMathRenderer>`,
    inlineMath: `<UnifiedMathRenderer inline={true}>{"$x^2 + y^2 = r^2$"}</UnifiedMathRenderer>`,
    plainText: `<UnifiedMathRenderer mode="text">{"这是纯文本内容"}</UnifiedMathRenderer>`
  },
  
  tips: [
    '使用 mode="auto" （默认）让组件智能检测内容类型',
    '对于已知的纯数学内容，使用 mode="math" 可以获得更好的性能',
    '对于包含文本和数学混合的内容，使用 mode="mixed"',
    '使用 inline={true} 来渲染行内数学公式',
    '在列表或表格中渲染大量数学内容时，考虑使用 withLazyMath 高阶组件'
  ]
};