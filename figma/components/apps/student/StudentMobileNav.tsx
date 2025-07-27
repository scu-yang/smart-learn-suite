import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  BookOpen,
  Target,
  FileText,
  User
} from 'lucide-react';

const navItems = [
  {
    name: '首页',
    path: '/dashboard',
    icon: LayoutDashboard,
    exact: true
  },
  {
    name: '课程',
    path: '/courses',
    icon: BookOpen
  },
  {
    name: '练习',
    path: '/practice',
    icon: Target
  },
  {
    name: '考试',
    path: '/exams',
    icon: FileText
  },
  {
    name: '我的',
    path: '/profile',
    icon: User
  }
];

export function StudentMobileNav() {
  const location = useLocation();

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === '/' || location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-30">
      <nav className="flex">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path, item.exact);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-1 min-h-[64px] transition-colors ${
                active
                  ? 'text-primary bg-primary/5'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${active ? 'text-primary' : ''}`} />
              <span className={`text-xs font-medium ${active ? 'text-primary' : ''}`}>
                {item.name}
              </span>
              {active && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}