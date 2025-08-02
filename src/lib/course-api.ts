import { API_CONFIG } from "@/config/api";
import { httpClient, type ApiResponse } from "./http-client";

export type CourseStatus = 'Pending' | 'Ongoing' | 'Ended' | 'Canceled';
export function getCourseStatusName(status: CourseStatus): string {
    switch (status) {
        case 'Pending':
            return '待开始';
        case 'Ongoing':
            return '进行中';
        case 'Ended':
            return '已结束';
        case 'Canceled':
            return '已取消';
        default:
            return '未知状态';
    }
}

export interface CourseInfo {
  id: number;
  title: string;
  description: string;
  notes: string;
  cover: string;
  tags: string[];
  status: CourseStatus;
  startDate: number;
  endDate: number;
  teacherName: string;
  credits: number;
  classroom: string;
}

export const courseApi = {
    async getCourse(): Promise<ApiResponse<CourseInfo[]>> {
        return httpClient.get<CourseInfo[]>(API_CONFIG.ENDPOINTS.COURSE.GET);
    }
}

