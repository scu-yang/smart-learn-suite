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

// 根路由
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// 首页路由 - 重定向到布局测试页
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <MainLayout title="布局系统展示"><LayoutTestPage /></MainLayout>,
});

// 登录页路由 - 不使用布局
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

// 注册页路由 - 不使用布局
const signRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sign',
  component: SignPage,
});

// 忘记密码页路由 - 不使用布局
const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forgot-password',
  component: ForgotPasswordPage,
});

// Dashboard 路由 - 使用布局
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => <MainLayout title="仪表盘"><DashboardPage /></MainLayout>,
});

// 考试准备页路由 - 全屏，不使用布局
const examPrepRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/exam/$examId/prep',
  component: () => {
    const { examId } = examPrepRoute.useParams();
    return <ExamPrepPage examId={examId} />;
  },
});

// 考试进行页路由 - 全屏，不使用布局
const examRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/exam/$examId/session/$sessionId',
  component: () => {
    const { examId, sessionId } = examRoute.useParams();
    return <ExamPage examId={examId} sessionId={sessionId} />;
  },
});

// 考试结果页路由 - 全屏，不使用布局
const examResultRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/exam/$examId/result/$resultId',
  component: () => {
    const { examId, resultId } = examResultRoute.useParams();
    return <ExamResultPage examId={examId} resultId={resultId} />;
  },
});

// 课程详情页路由 - 使用布局
const courseDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/course/$courseId',
  component: () => {
    const { courseId } = courseDetailRoute.useParams();
    return <MainLayout title="课程详情"><CourseDetailPage courseId={courseId} /></MainLayout>;
  },
});

// 课程列表页路由 - 使用布局
const coursesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/courses',
  component: () => <MainLayout title="我的课程"><CoursesPage /></MainLayout>,
});

// 通知中心路由 - 使用布局  
const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/notifications',
  component: () => <MainLayout title="通知中心"><NotificationsPage /></MainLayout>,
});

// 公告详情路由 - 使用布局
const announcementDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/announcement/$announcementId',
  component: () => {
    const { announcementId } = announcementDetailRoute.useParams();
    return <MainLayout title="公告详情"><AnnouncementDetailPage announcementId={announcementId} /></MainLayout>;
  },
});

// 管理端路由 - 使用布局
const adminPortalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => <MainLayout title="管理后台"><AdminPortalPage /></MainLayout>,
});

// 测试路由 - 使用布局
const dashboardTestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard-test',
  component: () => <MainLayout title="仪表盘测试"><DashboardTestPage /></MainLayout>,
});

// 用户信息页路由 - 使用布局
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: () => <MainLayout title="个人资料"><ProfilePage /></MainLayout>,
});

// 管理员题库管理路由 - 使用布局
const adminQuestionBankRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/question-bank',
  component: () => <MainLayout title="题库管理"><QuestionBankPage /></MainLayout>,
});

// 题目编辑器路由 - 使用布局
const questionEditorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/question-editor/$questionId',
  component: () => <MainLayout title="题目编辑"><QuestionEditorPage /></MainLayout>,
});

// 角色Dashboard测试路由 - 使用布局
const roleDashboardTestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/role-dashboard-test',
  component: () => <MainLayout title="角色测试"><RoleDashboardTestPage /></MainLayout>,
});

// 消息页路由 - 使用布局
const messagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/messages',
  component: () => <MainLayout title="消息中心"><div className="p-6 text-center text-gray-500">消息中心开发中...</div></MainLayout>,
});

// 设置页路由 - 使用布局
const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: () => <MainLayout title="系统设置"><div className="p-6 text-center text-gray-500">设置页面开发中...</div></MainLayout>,
});

// 布局测试页路由 - 使用布局
const layoutTestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/layout-test',
  component: () => <MainLayout title="布局测试"><LayoutTestPage /></MainLayout>,
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
