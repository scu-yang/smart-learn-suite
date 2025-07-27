import React from 'react';
import { GraduationCap } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto animate-pulse">
          <GraduationCap className="w-8 h-8 text-primary-foreground" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-medium">智慧教学系统</h2>
          <p className="text-muted-foreground">正在加载...</p>
        </div>
        <div className="flex justify-center">
          <div className="w-8 h-1 bg-primary/20 rounded-full overflow-hidden">
            <div className="w-full h-full bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}