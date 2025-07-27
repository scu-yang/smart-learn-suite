import { createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { HomePage } from '@/pages/home-modern';
import { LoginPage } from '@/pages/login';
import { SignPage } from '@/pages/sign';
import { ForgotPasswordPage } from '@/pages/forgot-password';
import { DashboardPage } from '@/pages/dashboard';
import { ExamPrepPage } from '@/pages/exam-prep';
import { ExamPage } from '@/pages/exam';
import { ExamResultPage } from '@/pages/exam-result';
import { CourseDetailPage } from '@/pages/course-detail';
import { NotificationsPage } from '@/pages/notifications';
import { AnnouncementDetailPage } from '@/pages/announcement-detail';
import { AdminPortalPage } from '@/pages/admin-portal';
import { QuestionBankPage } from '@/pages/admin/question-bank-standalone';
import { QuestionEditorPage } from '@/pages/admin/question-editor';
import { DashboardTestPage } from '@/pages/dashboard-test';
import { ProfilePage } from '@/pages/profile';

// 根路由
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// 首页路由
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

// 登录页路由
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

// 注册页路由
const signRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sign',
  component: SignPage,
});

// 忘记密码页路由
const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forgot-password',
  component: ForgotPasswordPage,
});

// Dashboard 路由
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage,
});

// 考试准备页路由
const examPrepRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/exam/$examId/prep',
  component: () => {
    const { examId } = examPrepRoute.useParams();
    return <ExamPrepPage examId={examId} />;
  },
});

// 考试进行页路由
const examRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/exam/$examId/session/$sessionId',
  component: () => {
    const { examId, sessionId } = examRoute.useParams();
    return <ExamPage examId={examId} sessionId={sessionId} />;
  },
});

// 考试结果页路由
const examResultRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/exam/$examId/result/$resultId',
  component: () => {
    const { examId, resultId } = examResultRoute.useParams();
    return <ExamResultPage examId={examId} resultId={resultId} />;
  },
});

// 课程详情页路由
const courseDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/course/$courseId',
  component: () => {
    const { courseId } = courseDetailRoute.useParams();
    return <CourseDetailPage courseId={courseId} />;
  },
});

// 通知中心路由
const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/notifications',
  component: NotificationsPage,
});

// 公告详情路由
const announcementDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/announcement/$announcementId',
  component: () => {
    const { announcementId } = announcementDetailRoute.useParams();
    return <AnnouncementDetailPage announcementId={announcementId} />;
  },
});

// 管理端路由
const adminPortalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPortalPage,
});

// 测试路由
const dashboardTestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard-test',
  component: DashboardTestPage,
});

// 用户信息页路由
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
});

// 管理员题库管理路由
const adminQuestionBankRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/question-bank',
  component: QuestionBankPage,
});

// 题目编辑器路由
const questionEditorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/question-editor/$questionId',
  component: QuestionEditorPage,
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
  notificationsRoute,
  announcementDetailRoute,
  adminPortalRoute,
  adminQuestionBankRoute,
  questionEditorRoute,
  dashboardTestRoute,
  profileRoute,
]);

// 创建路由器
export const router = createRouter({ routeTree });

// 声明模块以便 TypeScript 使用
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
