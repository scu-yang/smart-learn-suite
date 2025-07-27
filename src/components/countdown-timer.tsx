import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';

interface CountdownTimerProps {
  targetDate: Date;
  onTimeUp?: () => void;
  className?: string;
}

export function CountdownTimer({ targetDate, onTimeUp, className }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        if (onTimeUp) {
          onTimeUp();
        }
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onTimeUp]);

  if (timeLeft.isExpired) {
    return (
      <Badge variant="destructive" className={className}>
        考试时间已到
      </Badge>
    );
  }

  // 如果距离时间小于1小时，显示分钟和秒
  if (timeLeft.days === 0 && timeLeft.hours === 0) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Badge variant="warning" className="animate-pulse">
          {String(timeLeft.minutes).padStart(2, '0')}:
          {String(timeLeft.seconds).padStart(2, '0')}
        </Badge>
        <span className="text-sm text-yellow-600">分钟后开始</span>
      </div>
    );
  }

  // 如果距离时间小于24小时，显示小时和分钟
  if (timeLeft.days === 0) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Badge variant="info">
          {timeLeft.hours}小时 {timeLeft.minutes}分钟
        </Badge>
        <span className="text-sm text-blue-600">后开始</span>
      </div>
    );
  }

  // 显示天数、小时和分钟
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Badge variant="secondary">
        {timeLeft.days}天 {timeLeft.hours}小时 {timeLeft.minutes}分钟
      </Badge>
      <span className="text-sm text-gray-600">后开始</span>
    </div>
  );
}
