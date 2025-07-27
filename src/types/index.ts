export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  role: 'student' | 'teacher' | 'admin'; // 添加角色字段
  department?: string; // 院系
  createdAt: string;
}

export interface LoginForm {
  username: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  date: string;
  duration: number; // 分钟
  status: 'upcoming' | 'ongoing' | 'completed';
  description?: string;
}

export interface Course {
  id: string;
  name: string;
  teacher: string;
  progress: number; // 0-100
  description: string;
  enrolledAt: string;
  totalLessons: number;
  completedLessons: number;
}

export interface ErrorQuestion {
  id: string;
  questionText: string;
  subject: string;
  correctAnswer: string;
  userAnswer: string;
  explanation: string;
  attemptedAt: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface AuthContextType {
  user: User | null;
  login: (credentials: LoginForm) => Promise<void>;
  register: (data: RegisterForm) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

// 考试题目类型
export interface Question {
  id: string;
  type: 'single-choice' | 'multiple-choice' | 'essay' | 'true-false';
  question: string;
  options?: string[]; // 选择题选项
  correctAnswer: string | string[]; // 正确答案
  score: number; // 题目分值
  difficulty: 'easy' | 'medium' | 'hard';
  explanation?: string; // 答案解析
}

// 考试试卷
export interface ExamPaper {
  id: string;
  examId: string;
  title: string;
  description: string;
  questions: Question[];
  totalScore: number;
  duration: number; // 考试时长（分钟）
  instructions: string; // 考试说明
}

// 用户答案
export interface UserAnswer {
  questionId: string;
  answer: string | string[]; // 用户选择的答案
  timeSpent: number; // 答题耗时（秒）
}

// 考试会话
export interface ExamSession {
  id: string;
  examId: string;
  paperId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  answers: UserAnswer[];
  timeRemaining: number; // 剩余时间（秒）
  status: 'in-progress' | 'submitted' | 'expired';
  score?: number;
  totalScore: number;
}

// 考试结果
export interface ExamResult {
  id: string;
  sessionId: string;
  examId: string;
  userId: string;
  score: number;
  totalScore: number;
  percentage: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number; // 总答题时间（秒）
  submittedAt: string;
  questionResults: QuestionResult[];
}

// 单题结果
export interface QuestionResult {
  questionId: string;
  userAnswer: string | string[];
  correctAnswer: string | string[];
  isCorrect: boolean;
  score: number;
  maxScore: number;
  timeSpent: number;
}

// 课程章节
export interface CourseChapter {
  id: string;
  title: string;
  description: string;
  order: number;
  duration: number; // 分钟
  isCompleted: boolean;
  videoUrl?: string;
  materials?: CourseMaterial[];
  assignments?: Assignment[];
}

// 课程资料
export interface CourseMaterial {
  id: string;
  title: string;
  type: 'pdf' | 'doc' | 'ppt' | 'video' | 'link';
  url: string;
  size?: string;
  uploadedAt: string;
}

// 作业/任务
export interface Assignment {
  id: string;
  courseId?: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'submitted' | 'pending' | 'overdue';
  maxScore: number;
  submittedAt?: string;
  score?: number;
  feedback?: string;
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
}

// 简化的章节类型（用于课程详情页）
export interface Chapter {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  duration: number; // 分钟
  content: string;
  videoUrl?: string;
  materials?: {
    name: string;
    url: string;
    type: string;
  }[];
}

// 简化的公告类型（用于课程详情页）
export interface Announcement {
  id: string;
  courseId: string;
  title: string;
  content: string;
  publishedAt: string;
  isImportant: boolean;
  isRead: boolean;
}

// 章节学习进度
export interface ChapterProgress {
  id: string;
  courseId: string;
  chapterId: string;
  userId: string;
  completed: boolean;
  completedAt?: string;
  watchTime: number; // 观看时长（分钟）
}

// 扩展CourseDetail类型以支持更多字段
export interface CourseDetail extends Course {
  credits: number;
  semester: string;
  schedule: string;
  classroom: string;
  syllabus: string;
  resources: {
    name: string;
    url: string;
    type: string;
  }[];
}

// 通知类型
export interface Notification {
  id: string;
  userId: string;
  type: 'exam' | 'course' | 'assignment' | 'announcement' | 'system';
  title: string;
  content: string;
  relatedId?: string; // 关联的资源ID（考试ID、课程ID等）
  relatedType?: 'exam' | 'course' | 'assignment' | 'announcement';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  expiresAt?: string;
  actionUrl?: string; // 点击通知跳转的URL
  actionText?: string; // 操作按钮文本
}

// 通知筛选参数
export interface NotificationFilter {
  type?: Notification['type'];
  priority?: Notification['priority'];
  isRead?: boolean;
  startDate?: string;
  endDate?: string;
  timeRange?: 'today' | 'week' | 'month' | 'quarter';
  limit?: number;
  offset?: number;
}

// 通知统计
export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<Notification['type'], number>;
  byPriority: Record<Notification['priority'], number>;
}

// 管理端相关类型

// 班级类型
export interface Class {
  id: string;
  name: string;
  courseId: string;
  teacherId: string;
  teacherName: string;
  studentCount: number;
  maxStudents: number;
  semester: string;
  year: string;
  schedule: string;
  classroom: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// 学生类型
export interface Student {
  id: string;
  studentId: string; // 学号
  name: string;
  email: string;
  phone?: string;
  department: string;
  major: string;
  grade: string;
  enrolledAt: string;
  status: 'active' | 'suspended' | 'graduated';
  avatar?: string;
}

// 教师类型
export interface Teacher {
  id: string;
  employeeId: string; // 工号
  name: string;
  email: string;
  phone?: string;
  department: string;
  title: string; // 职称
  specialization: string[]; // 专业领域
  hiredAt: string;
  status: 'active' | 'inactive';
  avatar?: string;
}

// 题目库题目类型
export interface QuestionBank {
  id: string;
  subject: string;
  chapter: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'single-choice' | 'multiple-choice' | 'essay' | 'true-false';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  score: number;
  tags: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  usageCount: number; // 使用次数
}

// 考试管理类型
export interface ExamManagement {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  description: string;
  duration: number; // 分钟
  totalScore: number;
  startTime: string;
  endTime: string;
  instructions: string;
  questionIds: string[]; // 题目ID列表
  allowedClasses: string[]; // 允许参加的班级ID
  status: 'draft' | 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  settings: {
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
    showResultsImmediately: boolean;
    allowRetake: boolean;
    maxAttempts: number;
    requireCamera: boolean;
    requireFullscreen: boolean;
  };
}

// 考试统计数据
export interface ExamStatistics {
  examId: string;
  totalParticipants: number;
  completedCount: number;
  averageScore: number;
  maxScore: number;
  minScore: number;
  passRate: number; // 及格率
  scoreDistribution: {
    range: string;
    count: number;
    percentage: number;
  }[];
  questionStatistics: {
    questionId: string;
    correctRate: number;
    averageTime: number;
    difficulty: number;
  }[];
  timeStatistics: {
    averageTime: number;
    maxTime: number;
    minTime: number;
  };
}

// 班级学生管理
export interface ClassStudent {
  id: string;
  classId: string;
  studentId: string;
  student: Student;
  enrolledAt: string;
  status: 'active' | 'dropped';
  performance: {
    averageScore: number;
    attendanceRate: number;
    assignmentCompletion: number;
  };
}

// 通知发布类型
export interface NotificationCreate {
  title: string;
  content: string;
  type: 'exam' | 'course' | 'assignment' | 'announcement' | 'system';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  targetType: 'all' | 'class' | 'course' | 'individual';
  targetIds: string[]; // 目标ID列表（班级ID、课程ID或用户ID）
  scheduledAt?: string; // 定时发送
  expiresAt?: string;
  actionUrl?: string;
  actionText?: string;
}

// 课程管理类型
export interface CourseManagement {
  id: string;
  code: string; // 课程代码
  name: string;
  description: string;
  credits: number;
  department: string;
  category: string;
  prerequisites: string[]; // 先修课程
  teacherIds: string[]; // 授课教师ID列表
  teachers: Teacher[];
  semester: string;
  year: string;
  maxStudents: number;
  currentStudents: number;
  schedule: string;
  classroom: string;
  syllabus: string;
  objectives: string[];
  assessmentMethods: string[];
  textbooks: {
    title: string;
    author: string;
    isbn: string;
    required: boolean;
  }[];
  chapters: CourseChapter[];
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}

// 管理员仪表板数据
export interface AdminDashboard {
  overview: {
    totalStudents: number;
    totalTeachers: number;
    totalCourses: number;
    totalExams: number;
    activeClasses: number;
  };
  recentActivities: {
    type: string;
    description: string;
    timestamp: string;
    userId: string;
    userName: string;
  }[];
  examStatistics: {
    scheduledExams: number;
    ongoingExams: number;
    completedExams: number;
    averageScore: number;
  };
  systemHealth: {
    serverStatus: 'healthy' | 'warning' | 'error';
    databaseStatus: 'healthy' | 'warning' | 'error';
    lastBackup: string;
    diskUsage: number;
    memoryUsage: number;
  };
}


