import { AuthProvider } from '@/hooks/useAuth';
import { LoginPage } from '@/pages/login';
import { DashboardPage } from '@/pages/dashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

function AuthTest() {
  const { user, login, testAccounts } = useAuth();

  const handleQuickLogin = async (account: any) => {
    try {
      await login(account.email, account.password);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  if (user) {
    return <DashboardPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>基于角色的Dashboard测试</CardTitle>
            <CardDescription>
              点击下面的快速登录按钮测试不同角色的仪表盘界面
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testAccounts.map((account) => (
                <Card key={account.role} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg">{account.name}</h3>
                        <p className="text-sm text-gray-600">{account.description}</p>
                      </div>
                      <div className="text-xs text-gray-500">
                        <p>邮箱: {account.email}</p>
                        <p>密码: {account.password}</p>
                      </div>
                      <Button 
                        onClick={() => handleQuickLogin(account)}
                        className="w-full"
                      >
                        快速登录
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>手动登录</CardTitle>
            <CardDescription>使用正常的登录流程</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginPage />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function RoleDashboardTestPage() {
  return (
    <AuthProvider>
      <AuthTest />
    </AuthProvider>
  );
}
