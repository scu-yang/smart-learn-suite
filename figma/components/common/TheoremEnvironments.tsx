import React from 'react';
import { MixedContentRenderer } from './MathRenderer';
import { Card } from '../ui/card';

export interface TheoremProps {
  type: 'theorem' | 'proposition' | 'lemma' | 'corollary' | 'example' | 'exercise' | 'proof' | 'solution';
  title?: string;
  number?: string;
  children: React.ReactNode;
  className?: string;
}

const theoremStyles = {
  theorem: {
    borderColor: 'border-l-chart-1',
    bgColor: 'bg-chart-1/10',
    titleColor: 'text-chart-1',
    icon: '📐',
    defaultTitle: '定理'
  },
  proposition: {
    borderColor: 'border-l-chart-2',
    bgColor: 'bg-chart-2/10',
    titleColor: 'text-chart-2',
    icon: '💡',
    defaultTitle: '命题'
  },
  lemma: {
    borderColor: 'border-l-chart-4',
    bgColor: 'bg-chart-4/10',
    titleColor: 'text-chart-4',
    icon: '🔧',
    defaultTitle: '引理'
  },
  corollary: {
    borderColor: 'border-l-chart-3',
    bgColor: 'bg-chart-3/10',
    titleColor: 'text-chart-3',
    icon: '⚡',
    defaultTitle: '推论'
  },
  example: {
    borderColor: 'border-l-chart-5',
    bgColor: 'bg-chart-5/10',
    titleColor: 'text-chart-5',
    icon: '📝',
    defaultTitle: '例题'
  },
  exercise: {
    borderColor: 'border-l-orange-500',
    bgColor: 'bg-orange-50',
    titleColor: 'text-orange-700',
    icon: '✏️',
    defaultTitle: '练习'
  },
  proof: {
    borderColor: 'border-l-gray-500',
    bgColor: 'bg-gray-50',
    titleColor: 'text-gray-700',
    icon: '✓',
    defaultTitle: '证明'
  },
  solution: {
    borderColor: 'border-l-green-500',
    bgColor: 'bg-green-50',
    titleColor: 'text-green-700',
    icon: '💚',
    defaultTitle: '解答'
  }
};

export function TheoremEnvironment({ type, title, number, children, className = '' }: TheoremProps) {
  const style = theoremStyles[type];
  const displayTitle = title || style.defaultTitle;
  const fullTitle = number ? `${displayTitle} ${number}` : displayTitle;

  return (
    <div className={`theorem-env ${type} my-6 ${className}`}>
      <Card className={`border-l-4 ${style.borderColor} ${style.bgColor} border-t-0 border-r-0 border-b-0`}>
        <div className="p-4">
          <div className={`theorem-header flex items-center gap-2 font-medium mb-3 ${style.titleColor}`}>
            <span className="text-lg">{style.icon}</span>
            <span className="font-semibold">{fullTitle}</span>
          </div>
          <div className="theorem-content">
            {typeof children === 'string' ? (
              <MixedContentRenderer content={children} />
            ) : (
              <div className="theorem-child-content">
                {children}
              </div>
            )}
            {type === 'proof' && (
              <div className="flex justify-end mt-3">
                <span className="text-lg font-bold text-gray-600">∎</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

// Individual theorem environment components for easier use
export function Theorem({ title, number, children, className }: Omit<TheoremProps, 'type'>) {
  return <TheoremEnvironment type="theorem" title={title} number={number} className={className}>{children}</TheoremEnvironment>;
}

export function Proposition({ title, number, children, className }: Omit<TheoremProps, 'type'>) {
  return <TheoremEnvironment type="proposition" title={title} number={number} className={className}>{children}</TheoremEnvironment>;
}

export function Lemma({ title, number, children, className }: Omit<TheoremProps, 'type'>) {
  return <TheoremEnvironment type="lemma" title={title} number={number} className={className}>{children}</TheoremEnvironment>;
}

export function Corollary({ title, number, children, className }: Omit<TheoremProps, 'type'>) {
  return <TheoremEnvironment type="corollary" title={title} number={number} className={className}>{children}</TheoremEnvironment>;
}

export function Example({ title, number, children, className }: Omit<TheoremProps, 'type'>) {
  return <TheoremEnvironment type="example" title={title} number={number} className={className}>{children}</TheoremEnvironment>;
}

export function Exercise({ title, number, children, className }: Omit<TheoremProps, 'type'>) {
  return <TheoremEnvironment type="exercise" title={title} number={number} className={className}>{children}</TheoremEnvironment>;
}

export function Proof({ title, children, className }: Omit<TheoremProps, 'type' | 'number'>) {
  return <TheoremEnvironment type="proof" title={title} className={className}>{children}</TheoremEnvironment>;
}

export function Solution({ title, number, children, className }: Omit<TheoremProps, 'type'>) {
  return <TheoremEnvironment type="solution" title={title} number={number} className={className}>{children}</TheoremEnvironment>;
}

// Advanced theorem component with automatic numbering
interface AdvancedTheoremProps {
  type: 'theorem' | 'proposition' | 'lemma' | 'corollary' | 'example' | 'exercise';
  title?: string;
  autoNumber?: boolean;
  chapter?: number;
  children: React.ReactNode;
  className?: string;
}

// Simple counter for auto-numbering (in a real app, this would be more sophisticated)
const theoremCounters: Record<string, number> = {
  theorem: 0,
  proposition: 0,
  lemma: 0,
  corollary: 0,
  example: 0,
  exercise: 0,
};

export function AdvancedTheorem({ 
  type, 
  title, 
  autoNumber = true, 
  chapter, 
  children, 
  className 
}: AdvancedTheoremProps) {
  let number = undefined;
  
  if (autoNumber) {
    theoremCounters[type]++;
    number = chapter ? `${chapter}.${theoremCounters[type]}` : `${theoremCounters[type]}`;
  }

  return (
    <TheoremEnvironment 
      type={type} 
      title={title} 
      number={number} 
      className={className}
    >
      {children}
    </TheoremEnvironment>
  );
}

// Reset counters function (useful for new chapters/sections)
export function resetTheoremCounters() {
  Object.keys(theoremCounters).forEach(key => {
    theoremCounters[key] = 0;
  });
}