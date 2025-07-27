import { createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { HomePage } from '@/pages/home-modern';
import { LoginPage } from '@/pages/login';
import { SignPage } from '@/pages/sign';
import { ForgotPasswordPage } from '@/pages/forgot-password';
import { DashboardPage } from '@/pages/dashboard-content';
import { ExamPrepPage } from '@/pages/exam-prep';
import { ExamPage } from '@/pages/exam';
import { ExamResultPage } from '@/pages/exam-result';
import { CourseDetailPage } from '@/pages/course-detail';
import { CoursesPage } from '@/pages/courses';
import { NotificationsPage } from '@/pages/notifications';
import { AnnouncementDetailPage } from '@/pages/announcement-detail';
import { AdminPortalPage } from '@/pages/admin-portal';
import { QuestionBankPage } from '@/pages/admin/question-bank-standalone';
import { QuestionEditorPage } from '@/pages/admin/question-editor';
import { DashboardTestPage } from '@/pages/dashboard-test';
import { ProfilePage } from '@/pages/profile';
import { RoleDashboardTestPage } from '@/pages/role-dashboard-test';
import { LayoutTestPage } from '@/pages/layout-test';
import { MainLayout } from '@/components/layouts/main-layout';
import { AuthRequiredRoute, GuestOnlyRoute } from '@/components/auth/ProtectedRoute';

// 根路由
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// 首页路由 - 如果已登录重定向到 dashboard，否则显示首页
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <HomePage />,
});

// 登录页路由 - 不使用布局，仅访客可访问
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: () => <GuestOnlyRoute><LoginPage /></GuestOnlyRoute>,
});

// 注册页路由 - 不使用布局，仅访客可访问
const signRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sign',
  component: () => <GuestOnlyRoute><SignPage /></GuestOnlyRoute>,
});

// 忘记密码页路由 - 不使用布局，仅访客可访问
const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forgot-password',
  component: () => <GuestOnlyRoute><ForgotPasswordPage /></GuestOnlyRoute>,
});

// Dashboard 路由 - 使用布局，需要认证
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => (
    <AuthRequiredRoute>
      <MainLayout title="仪表盘">
        <DashboardPage />
      </MainLayout>
    </AuthRequiredRoute>
  ),
});

// 考试准备页路由 - 全屏，需要认证
const examPrepRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/exam/$examId/prep',
  component: () => {
    const { examId } = examPrepRoute.useParams();
    return (
      <AuthRequiredRoute>
        <ExamPrepPage examId={examId} />
      </AuthRequiredRoute>
    );
  },
});

// 考试进行页路由 - 全屏，需要认证
const examRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/exam/$examId/session/$sessionId',
  component: () => {
    const { examId, sessionId } = examRoute.useParams();
    return (
      <AuthRequiredRoute>
        <ExamPage examId={examId} sessionId={sessionId} />
      </AuthRequiredRoute>
    );
  },
});

// 考试结果页路由 - 全屏，需要认证
const examResultRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/exam/$examId/result/$resultId',
  component: () => {
    const { examId, resultId } = examResultRoute.useParams();
    return (
      <AuthRequiredRoute>
        <ExamResultPage examId={examId} resultId={resultId} />
      </AuthRequiredRoute>
    );
  },
});

// 课程详情页路由 - 使用布局，需要认证
const courseDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/course/$courseId',
  component: () => {
    const { courseId } = courseDetailRoute.useParams();
    return (
      <AuthRequiredRoute>
        <MainLayout title="课程详情">
          <CourseDetailPage courseId={courseId} />
        </MainLayout>
      </AuthRequiredRoute>
    );
  },
});

// 课程列表页路由 - 使用布局，需要认证
const coursesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/courses',
  component: () => (
    <AuthRequiredRoute>
      <MainLayout title="我的课程">
        <CoursesPage />
      </MainLayout>
    </AuthRequiredRoute>
  ),
});

// 通知中心路由 - 使用布局，需要认证
const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/notifications',
  component: () => (
    <AuthRequiredRoute>
      <MainLayout title="通知中心">
        <NotificationsPage />
      </MainLayout>
    </AuthRequiredRoute>
  ),
});

// 公告详情路由 - 使用布局，需要认证
const announcementDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/announcement/$announcementId',
  component: () => {
    const { announcementId } = announcementDetailRoute.useParams();
    return (
      <AuthRequiredRoute>
        <MainLayout title="公告详情">
          <AnnouncementDetailPage announcementId={announcementId} />
        </MainLayout>
      </AuthRequiredRoute>
    );
  },
});

// 管理端路由 - 使用布局，需要认证
const adminPortalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <AuthRequiredRoute>
      <MainLayout title="管理后台">
        <AdminPortalPage />
      </MainLayout>
    </AuthRequiredRoute>
  ),
});

// 测试路由 - 使用布局，需要认证
const dashboardTestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard-test',
  component: () => (
    <AuthRequiredRoute>
      <MainLayout title="仪表盘测试">
        <DashboardTestPage />
      </MainLayout>
    </AuthRequiredRoute>
  ),
});

// 用户信息页路由 - 使用布局，需要认证
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: () => (
    <AuthRequiredRoute>
      <MainLayout title="个人资料">
        <ProfilePage />
      </MainLayout>
    </AuthRequiredRoute>
  ),
});

// 管理员题库管理路由 - 使用布局，需要认证
const adminQuestionBankRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/question-bank',
  component: () => (
    <AuthRequiredRoute>
      <MainLayout title="题库管理">
        <QuestionBankPage />
      </MainLayout>
    </AuthRequiredRoute>
  ),
});

// 题目编辑器路由 - 使用布局，需要认证
const questionEditorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/question-editor/$questionId',
  component: () => (
    <AuthRequiredRoute>
      <MainLayout title="题目编辑">
        <QuestionEditorPage />
      </MainLayout>
    </AuthRequiredRoute>
  ),
});

// 角色Dashboard测试路由 - 使用布局，需要认证
const roleDashboardTestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/role-dashboard-test',
  component: () => (
    <AuthRequiredRoute>
      <MainLayout title="角色测试">
        <RoleDashboardTestPage />
      </MainLayout>
    </AuthRequiredRoute>
  ),
});

// 消息页路由 - 使用布局，需要认证
const messagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/messages',
  component: () => (
    <AuthRequiredRoute>
      <MainLayout title="消息中心">
        <div className="p-6 text-center text-gray-500">消息中心开发中...</div>
      </MainLayout>
    </AuthRequiredRoute>
  ),
});

// 设置页路由 - 使用布局，需要认证
const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: () => (
    <AuthRequiredRoute>
      <MainLayout title="系统设置">
        <div className="p-6 text-center text-gray-500">设置页面开发中...</div>
      </MainLayout>
    </AuthRequiredRoute>
  ),
});

// 布局测试页路由 - 使用布局，需要认证
const layoutTestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/layout-test',
  component: () => (
    <AuthRequiredRoute>
      <MainLayout title="布局测试">
        <LayoutTestPage />
      </MainLayout>
    </AuthRequiredRoute>
  ),
});

// 创建路由树
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  signRoute,
  forgotPasswordRoute,
  dashboardRoute,
  examPrepRoute,
  examRoute,
  examResultRoute,
  courseDetailRoute,
  coursesRoute,
  notificationsRoute,
  announcementDetailRoute,
  adminPortalRoute,
  adminQuestionBankRoute,
  questionEditorRoute,
  dashboardTestRoute,
  roleDashboardTestRoute,
  profileRoute,
  messagesRoute,
  settingsRoute,
  layoutTestRoute,
]);

// 创建路由器
export const router = createRouter({ routeTree });

// 声明模块以便 TypeScript 使用
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
