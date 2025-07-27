import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Exam } from '@/types';

// 获取考试列表的 hook
export function useExams() {
  return useQuery({
    queryKey: ['exams'],
    queryFn: api.getExams,
    staleTime: 5 * 60 * 1000, // 5分钟
  });
}

// 获取课程列表的 hook
export function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: api.getCourses,
    staleTime: 5 * 60 * 1000,
  });
}

// 获取错题列表的 hook
export function useErrorQuestions() {
  return useQuery({
    queryKey: ['errorQuestions'],
    queryFn: api.getErrorQuestions,
    staleTime: 5 * 60 * 1000,
  });
}

// 根据状态获取考试的 hook
export function useExamsByStatus(status: Exam['status']) {
  return useQuery({
    queryKey: ['exams', 'status', status],
    queryFn: () => api.getExamsByStatus(status),
    staleTime: 5 * 60 * 1000,
  });
}

// 根据科目获取错题的 hook
export function useErrorQuestionsBySubject(subject: string) {
  return useQuery({
    queryKey: ['errorQuestions', 'subject', subject],
    queryFn: () => api.getErrorQuestionsBySubject(subject),
    staleTime: 5 * 60 * 1000,
    enabled: !!subject, // 只有当 subject 存在时才执行查询
  });
}

// 获取考试试卷的 hook
export function useExamPaper(examId: string) {
  return useQuery({
    queryKey: ['examPaper', examId],
    queryFn: () => api.getExamPaper(examId),
    staleTime: 10 * 60 * 1000, // 试卷数据缓存10分钟
    enabled: !!examId,
  });
}

// 获取考试结果的 hook
export function useExamResult(sessionId: string) {
  return useQuery({
    queryKey: ['examResult', sessionId],
    queryFn: () => api.getExamResult(sessionId),
    staleTime: Infinity, // 考试结果永久缓存
    enabled: !!sessionId,
  });
}

// 获取课程详情的 hook
export function useCourseDetail(courseId: string) {
  return useQuery({
    queryKey: ['courseDetail', courseId],
    queryFn: () => api.getCourseDetail(courseId),
    staleTime: 10 * 60 * 1000, // 10分钟
    enabled: !!courseId,
  });
}

// 获取课程章节的 hook
export function useCourseChapters(courseId: string) {
  return useQuery({
    queryKey: ['courseChapters', courseId],
    queryFn: () => api.getCourseChapters(courseId),
    staleTime: 10 * 60 * 1000,
    enabled: !!courseId,
  });
}

// 获取课程作业的 hook
export function useCourseAssignments(courseId: string) {
  return useQuery({
    queryKey: ['courseAssignments', courseId],
    queryFn: () => api.getCourseAssignments(courseId),
    staleTime: 5 * 60 * 1000,
    enabled: !!courseId,
  });
}

// 获取课程公告的 hook
export function useCourseAnnouncements(courseId: string) {
  return useQuery({
    queryKey: ['courseAnnouncements', courseId],
    queryFn: () => api.getCourseAnnouncements(courseId),
    staleTime: 2 * 60 * 1000, // 公告2分钟缓存
    enabled: !!courseId,
  });
}

// 获取章节学习进度的 hook
export function useChapterProgress(courseId: string) {
  return useQuery({
    queryKey: ['chapterProgress', courseId],
    queryFn: () => api.getChapterProgress(courseId),
    staleTime: 1 * 60 * 1000, // 进度1分钟缓存
    enabled: !!courseId,
  });
}

// 获取通知列表的 hook
export function useNotifications(filter?: import('@/types').NotificationFilter) {
  return useQuery({
    queryKey: ['notifications', filter],
    queryFn: () => api.getNotifications(filter),
    staleTime: 1 * 60 * 1000, // 通知1分钟缓存
  });
}

// 获取通知统计的 hook
export function useNotificationStats() {
  return useQuery({
    queryKey: ['notificationStats'],
    queryFn: api.getNotificationStats,
    staleTime: 1 * 60 * 1000, // 统计1分钟缓存
  });
}

// 获取未读通知的 hook
export function useUnreadNotifications() {
  return useQuery({
    queryKey: ['notifications', { isRead: false }],
    queryFn: () => api.getNotifications({ isRead: false }),
    staleTime: 30 * 1000, // 未读通知30秒缓存
    refetchInterval: 30 * 1000, // 每30秒自动刷新
  });
}
