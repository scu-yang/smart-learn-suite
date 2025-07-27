import React from 'react';
import { MathRenderer, MixedContentRenderer } from './MathRenderer';
import { TheoremEnvironment } from './TheoremEnvironments';

interface AdvancedMathRendererProps {
  content: string;
  className?: string;
}

// Parse theorem environments from LaTeX content (simplified)
function parseTheoremEnvironments(content: string): Array<{
  type: 'text' | 'theorem';
  content: string;
  theoremType?: string;
  title?: string;
  number?: string;
}> {
  const parts: Array<{
    type: 'text' | 'theorem';
    content: string;
    theoremType?: string;
    title?: string;
    number?: string;
  }> = [];

  // Check if content contains theorem environments
  if (!content.includes('\\begin{theorem') && 
      !content.includes('\\begin{proposition') && 
      !content.includes('\\begin{lemma') && 
      !content.includes('\\begin{corollary') && 
      !content.includes('\\begin{example') && 
      !content.includes('\\begin{exercise') && 
      !content.includes('\\begin{proof') && 
      !content.includes('\\begin{solution')) {
    // No theorem environments, return as text
    return [{ type: 'text', content }];
  }

  // Simple regex for theorem environments
  const theoremRegex = /\\begin\{(theorem|proposition|lemma|corollary|example|exercise|proof|solution)\}(?:\[([^\]]*)\])?(.*?)\\end\{\1\}/gs;
  
  let lastIndex = 0;
  let match;

  while ((match = theoremRegex.exec(content)) !== null) {
    // Add text before theorem
    if (match.index > lastIndex) {
      const textBefore = content.slice(lastIndex, match.index).trim();
      if (textBefore) {
        parts.push({
          type: 'text',
          content: textBefore
        });
      }
    }

    // Parse title and number from optional argument
    const optionalArg = match[2];
    let title: string | undefined;
    let number: string | undefined;

    if (optionalArg) {
      const numberMatch = optionalArg.match(/^[\d.]+$/);
      if (numberMatch) {
        number = optionalArg;
      } else {
        const titleNumberMatch = optionalArg.match(/^([\d.]+):\s*(.+)$|^(.+)$/);
        if (titleNumberMatch) {
          if (titleNumberMatch[1] && titleNumberMatch[2]) {
            number = titleNumberMatch[1];
            title = titleNumberMatch[2];
          } else {
            title = titleNumberMatch[3];
          }
        }
      }
    }

    // Add theorem
    parts.push({
      type: 'theorem',
      content: match[3].trim(),
      theoremType: match[1],
      title,
      number
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    const remainingText = content.slice(lastIndex).trim();
    if (remainingText) {
      parts.push({
        type: 'text',
        content: remainingText
      });
    }
  }

  // If no theorem environments found, return the whole content as text
  if (parts.length === 0) {
    parts.push({
      type: 'text',
      content: content
    });
  }

  return parts;
}

// Main component for advanced math rendering
export function AdvancedMathRenderer({ content, className = '' }: AdvancedMathRendererProps) {
  if (!content) return null;

  const parts = parseTheoremEnvironments(content);

  return (
    <div className={`advanced-math-content ${className}`}>
      {parts.map((part, index) => {
        if (part.type === 'theorem' && part.theoremType) {
          return (
            <TheoremEnvironment
              key={index}
              type={part.theoremType as any}
              title={part.title}
              number={part.number}
            >
              <MixedContentRenderer content={part.content} />
            </TheoremEnvironment>
          );
        } else {
          return (
            <div key={index} className="math-text-content">
              <MixedContentRenderer content={part.content} />
            </div>
          );
        }
      })}
    </div>
  );
}

// Export the enhanced renderer as the default export
export default AdvancedMathRenderer;

// Utility function to check if content has advanced environments
export function hasAdvancedMathEnvironments(content: string): boolean {
  if (!content) return false;
  
  return /\\begin\{(theorem|proposition|lemma|corollary|example|exercise|proof|solution)\}/.test(content);
}

// Simplified component for common use cases
export function SmartMathRenderer({ 
  content, 
  className = '', 
  fallbackToSimple = true 
}: { 
  content: string; 
  className?: string; 
  fallbackToSimple?: boolean; 
}) {
  if (!content) return null;

  // Check if content needs advanced processing
  if (hasAdvancedMathEnvironments(content)) {
    return <AdvancedMathRenderer content={content} className={className} />;
  }

  // Use simple renderer for basic content
  if (fallbackToSimple) {
    return <MixedContentRenderer content={content} className={className} />;
  }

  return <AdvancedMathRenderer content={content} className={className} />;
}