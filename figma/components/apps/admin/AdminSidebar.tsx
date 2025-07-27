import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../ui/utils';
import { 
  LayoutDashboard,
  Users,
  Monitor,
  Database,
  FileText,
  Shield,
  Settings,
  User
} from 'lucide-react';

const navigation = [
  { name: '控制台', href: '/dashboard', icon: LayoutDashboard },
  { name: '用户管理', href: '/users', icon: Users },
  { name: '系统监控', href: '/monitor', icon: Monitor },
  { name: '数据管理', href: '/data', icon: Database },
  { name: '日志审计', href: '/audit', icon: FileText },
  { name: '权限配置', href: '/permissions', icon: Shield },
  { name: '系统设置', href: '/system-settings', icon: Settings },
  { name: '个人设置', href: '/settings', icon: User },
];

export function AdminSidebar() {
  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-sidebar-foreground">系统管理</h2>
        <p className="text-sm text-sidebar-foreground/70">管理员控制面板</p>
      </div>
      <nav className="px-4 pb-4">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                    )
                  }
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}