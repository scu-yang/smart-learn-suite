import { useEffect } from 'react';
import { useRouter } from '@tanstack/react-router';
import { useAuth } from '@/hooks/useAuth';
import { LoadingScreen } from '@/components/common/LoadingScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

/**
 * 路由保护组件
 * @param children - 子组件
 * @param requireAuth - 是否需要认证，默认为 true
 * @param redirectTo - 重定向路径，默认为 '/login'
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  redirectTo = '/login'
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 如果需要认证但用户未登录，重定向到登录页
    if (requireAuth && !isLoading && !isAuthenticated) {
      console.log('用户未认证，重定向到登录页');
      router.navigate({ to: redirectTo });
      return;
    }

    // 如果不需要认证但用户已登录，重定向到仪表盘
    if (!requireAuth && !isLoading && isAuthenticated) {
      console.log('用户已登录，重定向到仪表盘');
      router.navigate({ to: '/dashboard' });
      return;
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, router]);

  // 加载中显示加载屏幕
  if (isLoading) {
    return <LoadingScreen />;
  }

  // 如果需要认证但用户未登录，显示加载屏幕（等待重定向）
  if (requireAuth && !isAuthenticated) {
    return <LoadingScreen />;
  }

  // 如果不需要认证但用户已登录，显示加载屏幕（等待重定向）
  if (!requireAuth && isAuthenticated) {
    return <LoadingScreen />;
  }

  // 认证状态正确，显示子组件
  return <>{children}</>;
};

/**
 * 需要认证的路由包装器
 */
export const AuthRequiredRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requireAuth={true}>
    {children}
  </ProtectedRoute>
);

/**
 * 仅访客可访问的路由包装器（已登录用户会被重定向）
 */
export const GuestOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requireAuth={false}>
    {children}
  </ProtectedRoute>
);
