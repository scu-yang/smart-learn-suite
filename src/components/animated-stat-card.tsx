import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { LucideIcon } from 'lucide-react';

interface AnimatedStatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  delay?: number;
}

export function AnimatedStatCard({ 
  icon: Icon, 
  title, 
  value, 
  subtitle, 
  trend, 
  color = 'blue',
  delay = 0 
}: AnimatedStatCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      
      // 如果 value 是数字，添加计数动画
      if (typeof value === 'number') {
        const duration = 1000; // 1秒
        const steps = 30;
        const increment = value / steps;
        let current = 0;
        
        const counter = setInterval(() => {
          current += increment;
          if (current >= value) {
            setAnimatedValue(value);
            clearInterval(counter);
          } else {
            setAnimatedValue(Math.floor(current));
          }
        }, duration / steps);
        
        return () => clearInterval(counter);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  const colorClasses = {
    blue: {
      icon: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      accent: 'bg-blue-100'
    },
    green: {
      icon: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      accent: 'bg-green-100'
    },
    yellow: {
      icon: 'text-yellow-600',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      accent: 'bg-yellow-100'
    },
    red: {
      icon: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      accent: 'bg-red-100'
    },
    purple: {
      icon: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      accent: 'bg-purple-100'
    }
  };

  const colorClass = colorClasses[color];

  return (
    <Card 
      className={`
        transition-all duration-500 hover:shadow-lg cursor-pointer group
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        ${colorClass.border} border-l-4
      `}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <div className={`p-2 rounded-lg ${colorClass.bg} group-hover:${colorClass.accent} transition-colors`}>
                <Icon className={`h-5 w-5 ${colorClass.icon}`} />
              </div>
              <h3 className="font-medium text-gray-900">{title}</h3>
            </div>
            
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-gray-900">
                {typeof value === 'number' ? animatedValue : value}
              </span>
              {subtitle && (
                <span className="text-sm text-gray-500">{subtitle}</span>
              )}
            </div>
            
            {trend && (
              <Badge 
                variant={trend.isPositive ? 'success' : 'destructive'}
                className="mt-2"
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
