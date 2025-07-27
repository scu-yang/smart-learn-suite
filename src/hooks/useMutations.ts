import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// 更新章节进度
export function useUpdateChapterProgress() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ courseId, chapterId, completed }: {
      courseId: string;
      chapterId: string;
      completed: boolean;
    }) => api.updateChapterProgress(courseId, chapterId, completed),
    onSuccess: (_, variables) => {
      // 更新章节进度缓存
      queryClient.invalidateQueries({ 
        queryKey: ['chapterProgress', variables.courseId] 
      });
      // 也可以更新课程详情缓存
      queryClient.invalidateQueries({ 
        queryKey: ['courseDetail', variables.courseId] 
      });
    },
  });
}

// 提交作业
export function useSubmitAssignment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ assignmentId, submission }: {
      assignmentId: string;
      submission: any;
    }) => api.submitAssignment(assignmentId, submission),
    onSuccess: () => {
      // 更新作业列表缓存
      queryClient.invalidateQueries({ 
        queryKey: ['courseAssignments'] 
      });
    },
  });
}

// 标记公告为已读
export function useMarkAnnouncementRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (announcementId: string) => api.markAnnouncementRead(announcementId),
    onSuccess: () => {
      // 更新公告列表缓存
      queryClient.invalidateQueries({ 
        queryKey: ['courseAnnouncements'] 
      });
    },
  });
}

// 标记通知为已读
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (notificationId: string) => api.markNotificationRead(notificationId),
    onSuccess: () => {
      // 更新通知列表缓存
      queryClient.invalidateQueries({ 
        queryKey: ['notifications'] 
      });
      // 更新通知统计缓存
      queryClient.invalidateQueries({ 
        queryKey: ['notificationStats'] 
      });
    },
  });
}

// 批量标记通知为已读
export function useMarkNotificationsRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (notificationIds: string[]) => api.markNotificationsRead(notificationIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['notifications'] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['notificationStats'] 
      });
    },
  });
}

// 标记所有通知为已读
export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => api.markAllNotificationsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['notifications'] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['notificationStats'] 
      });
    },
  });
}

// 删除通知
export function useDeleteNotification() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (notificationId: string) => api.deleteNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['notifications'] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['notificationStats'] 
      });
    },
  });
}

// 批量删除通知
export function useDeleteNotifications() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (notificationIds: string[]) => api.deleteNotifications(notificationIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['notifications'] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['notificationStats'] 
      });
    },
  });
}
