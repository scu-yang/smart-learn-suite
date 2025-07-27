import type { 
  Exam, 
  Course, 
  ErrorQuestion, 
  ExamPaper, 
  ExamSession, 
  UserAnswer, 
  ExamResult,
  CourseDetail,
  Assignment,
  Chapter,
  Announcement,
  ChapterProgress,
  Notification,
  NotificationFilter,
  NotificationStats
} from '@/types';
import { API_CONFIG } from '@/config/api';
import { httpClient } from '@/lib/http-client';

// 导出认证相关 API
export * from '@/lib/auth-api';

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟考试数据
export const mockExams: Exam[] = [
  {
    id: "1",
    title: "高等数学期中考试",
    subject: "数学",
    date: "2025-07-12T08:00:00Z",
    duration: 120,
    status: "upcoming",
    description: "涵盖第1-6章内容"
  },
  {
    id: "2",
    title: "英语四级模拟考试",
    subject: "英语",
    date: "2025-07-22T09:00:00Z",
    duration: 150,
    status: "upcoming",
    description: "全真模拟考试环境"
  },
  {
    id: "3",
    title: "计算机基础测试",
    subject: "计算机",
    date: "2025-07-15T14:00:00Z",
    duration: 90,
    status: "completed",
    description: "计算机基础知识测试"
  }
];

// 模拟课程数据
export const mockCourses: Course[] = [
  {
    id: "1",
    name: "高等数学A",
    teacher: "李教授",
    progress: 75,
    description: "微积分基础与应用",
    enrolledAt: "2024-09-01T00:00:00Z",
    totalLessons: 32,
    completedLessons: 24,
  },
  {
    id: "2",
    name: "大学英语",
    teacher: "王老师",
    progress: 60,
    description: "英语听说读写综合训练",
    enrolledAt: "2024-09-01T00:00:00Z",
    totalLessons: 28,
    completedLessons: 17,
  },
  {
    id: "3",
    name: "计算机程序设计",
    teacher: "张老师",
    progress: 45,
    description: "C语言程序设计基础",
    enrolledAt: "2024-09-01T00:00:00Z",
    totalLessons: 36,
    completedLessons: 16,
  }
];

// 模拟错题数据
export const mockErrorQuestions: ErrorQuestion[] = [
  {
    id: "1",
    questionText: "求函数f(x)=x²+2x-3的导数",
    subject: "数学",
    correctAnswer: "f'(x)=2x+2",
    userAnswer: "f'(x)=2x",
    explanation: "对于多项式函数，每一项分别求导。常数项的导数为0，所以2x项的导数是2。",
    attemptedAt: "2025-07-18T10:30:00",
    difficulty: "easy"
  },
  {
    id: "2",
    questionText: "牛顿第二定律的表达式是？",
    subject: "物理",
    correctAnswer: "F = ma",
    userAnswer: "F = mv",
    explanation: "牛顿第二定律表述为：物体的加速度与作用力成正比，与物体质量成反比",
    attemptedAt: "2025-07-17T15:20:00",
    difficulty: "medium"
  },
  {
    id: "3",
    questionText: "在C语言中，下列哪个是正确的变量声明？",
    subject: "计算机",
    correctAnswer: "int count = 0;",
    userAnswer: "int count;",
    explanation: "虽然两种声明都是语法正确的，但初始化变量是一个好习惯",
    attemptedAt: "2025-07-16T11:15:00",
    difficulty: "easy"
  }
];

// 模拟通知数据
const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    userId: "1",
    type: "exam",
    title: "考试提醒",
    content: "您的高等数学期中考试将在明天上午8:00开始，请做好准备。",
    relatedId: "1",
    relatedType: "exam",
    priority: "high",
    isRead: false,
    createdAt: "2025-07-19T16:00:00Z",
    actionUrl: "/exam/1/prep",
    actionText: "准备考试"
  },
  {
    id: "notif-2",
    userId: "1",
    type: "assignment",
    title: "作业截止提醒",
    content: "《导数应用》作业将在3天后截止，请及时完成。",
    relatedId: "2",
    relatedType: "assignment",
    priority: "medium",
    isRead: false,
    createdAt: "2025-07-18T14:30:00Z",
    actionUrl: "/course/1",
    actionText: "查看作业"
  },
  {
    id: "notif-3",
    userId: "1",
    type: "course",
    title: "新课程资料",
    content: "高等数学A课程新增了第三章积分学的补充资料，请及时查看。",
    relatedId: "1",
    relatedType: "course",
    priority: "low",
    isRead: true,
    readAt: "2025-07-18T09:15:00Z",
    createdAt: "2025-07-17T20:00:00Z",
    actionUrl: "/course/1",
    actionText: "查看课程"
  },
  {
    id: "notif-4",
    userId: "1",
    type: "announcement",
    title: "重要公告",
    content: `# 期中考试安排通知

## 考试基本信息
- **考试时间**: 2025年11月15日 (周五)
- **考试地点**: 教学楼A区 101-105教室
- **考试科目**: 高等数学A
- **考试时长**: 120分钟

## 考试范围
本次期中考试涵盖以下章节内容：
1. **第一章**: 函数与极限
2. **第二章**: 导数与微分
3. **第三章**: 积分学基础

## 注意事项
⚠️ **重要提醒**:
- 请携带学生证和身份证
- 禁止携带任何电子设备
- 考试用品：2B铅笔、橡皮、黑色签字笔
- 请提前15分钟到达考场

## 复习建议
- 重点复习课后习题
- 参考历年真题练习
- 关注重要定理和公式

如有疑问，请联系任课教师。

---
**发布时间**: 2025年7月17日  
**发布人**: 李教授`,
    relatedId: "1",
    relatedType: "announcement",
    priority: "urgent",
    isRead: false,
    createdAt: "2025-07-17T10:00:00Z",
    actionUrl: "/announcement/notif-4",
    actionText: "查看公告"
  },
  {
    id: "notif-5",
    userId: "1",
    type: "system",
    title: "系统维护通知",
    content: `# 系统维护通知

## 维护时间
**本周日凌晨 2:00 - 4:00**

## 维护内容
本次维护将进行以下更新：

### 🔧 系统优化
- 数据库性能优化
- 服务器稳定性提升
- 安全补丁更新

### ✨ 新功能
- 在线考试界面优化
- 新增学习进度统计
- 移动端体验改进

## 影响范围
维护期间，以下功能将**暂时无法使用**：
- [ ] 在线考试系统
- [ ] 课程学习平台
- [ ] 作业提交功能
- [ ] 个人数据查询

## 建议
请同学们提前安排学习时间，避免在维护期间进行重要操作。

感谢您的理解与配合！

---
**川大在线考试系统运维团队**`,
    priority: "medium",
    isRead: true,
    readAt: "2025-07-16T18:30:00Z",
    createdAt: "2025-07-16T12:00:00Z"
  },
  {
    id: "notif-6",
    userId: "1",
    type: "exam",
    title: "成绩发布",
    content: "您的英语四级模拟考试成绩已发布，总分85分，请查看详细结果。",
    relatedId: "2",
    relatedType: "exam",
    priority: "medium",
    isRead: false,
    createdAt: "2025-07-15T16:45:00Z",
    actionUrl: "/exam/2/result/result-2",
    actionText: "查看成绩"
  },
  {
    id: "notif-7",
    userId: "1",
    type: "course",
    title: "学习进度提醒",
    content: "您在《大学英语》课程的学习进度为60%，建议加快学习节奏。",
    relatedId: "2",
    relatedType: "course",
    priority: "low",
    isRead: true,
    readAt: "2025-07-14T11:20:00Z",
    createdAt: "2025-07-14T09:00:00Z",
    actionUrl: "/course/2",
    actionText: "继续学习"
  }
];

// Mock API 实现
const mockDataApi = {
  // 获取考试列表
  getExams: async (): Promise<Exam[]> => {
    await delay(500);
    return mockExams;
  },

  // 获取课程列表
  getCourses: async (): Promise<Course[]> => {
    await delay(500);
    return mockCourses;
  },

  // 获取错题列表
  getErrorQuestions: async (): Promise<ErrorQuestion[]> => {
    await delay(500);
    return mockErrorQuestions;
  },

  // 根据状态获取考试
  getExamsByStatus: async (status: Exam['status']): Promise<Exam[]> => {
    await delay(300);
    return mockExams.filter(exam => exam.status === status);
  },

  // 根据科目获取错题
  getErrorQuestionsBySubject: async (subject: string): Promise<ErrorQuestion[]> => {
    await delay(300);
    return mockErrorQuestions.filter(error => error.subject === subject);
  },

  // 获取考试试卷
  getExamPaper: async (examId: string): Promise<ExamPaper> => {
    await delay(500);
    const mockPaper: ExamPaper = {
      id: `paper-${examId}`,
      examId,
      title: "高等数学期末考试试卷",
      description: "本试卷包含单选题、多选题和简答题，请仔细作答",
      totalScore: 100,
      duration: 120,
      instructions: "1. 考试时间为120分钟\n2. 请仔细阅读题目\n3. 答题完成后请及时提交\n4. 考试期间不得使用任何辅助工具",
      questions: [
        {
          id: "q1",
          type: "single-choice",
          question: "函数 f(x) = x² + 2x + 1 的导数是：",
          options: ["2x + 2", "2x + 1", "x + 2", "2x"],
          correctAnswer: "2x + 2",
          score: 5,
          difficulty: "easy",
          explanation: "对于多项式求导，x²的导数是2x，2x的导数是2，常数1的导数是0"
        },
        {
          id: "q2",
          type: "multiple-choice",
          question: "以下哪些是微积分的基本定理？",
          options: ["牛顿-莱布尼茨公式", "中值定理", "洛必达法则", "泰勒展开"],
          correctAnswer: ["牛顿-莱布尼茨公式", "中值定理"],
          score: 10,
          difficulty: "medium",
          explanation: "牛顿-莱布尼茨公式和中值定理是微积分的基本定理"
        },
        {
          id: "q3",
          type: "true-false",
          question: "函数的连续性是函数可导的充分条件",
          correctAnswer: "false",
          score: 5,
          difficulty: "medium",
          explanation: "连续是可导的必要条件，不是充分条件"
        },
        {
          id: "q4",
          type: "essay",
          question: "#请证明：lim(x→0) (sin x)/x = 1",
          correctAnswer: "利用夹逼定理或洛必达法则证明",
          score: 20,
          difficulty: "hard",
          explanation: "可以使用夹逼定理：当x→0时，cos x ≤ (sin x)/x ≤ 1"
        }
      ]
    };
    return mockPaper;
  },

  // 创建考试会话
  createExamSession: async (examId: string, paperId: string): Promise<ExamSession> => {
    await delay(300);
    const session: ExamSession = {
      id: `session-${Date.now()}`,
      examId,
      paperId,
      userId: "1",
      startTime: new Date().toISOString(),
      answers: [],
      timeRemaining: 7200, // 120分钟 = 7200秒
      status: 'in-progress',
      totalScore: 100
    };
    return session;
  },

  // 提交答案
  submitAnswer: async (sessionId: string, answer: UserAnswer): Promise<void> => {
    await delay(200);
    console.log(`会话 ${sessionId} 提交答案:`, answer);
  },

  // 提交考试
  submitExam: async (sessionId: string): Promise<ExamResult> => {
    await delay(500);
    const result: ExamResult = {
      id: `result-${sessionId}`,
      sessionId,
      examId: "1",
      userId: "1",
      score: 85,
      totalScore: 100,
      percentage: 85,
      correctAnswers: 8,
      totalQuestions: 10,
      timeSpent: 5400, // 90分钟
      submittedAt: new Date().toISOString(),
      questionResults: []
    };
    return result;
  },

  // 获取考试结果
  getExamResult: async (sessionId: string): Promise<ExamResult> => {
    await delay(300);
    const result: ExamResult = {
      id: `result-${sessionId}`,
      sessionId,
      examId: "1",
      userId: "1",
      score: 85,
      totalScore: 100,
      percentage: 85,
      correctAnswers: 8,
      totalQuestions: 10,
      timeSpent: 5400,
      submittedAt: "2025-07-18T10:30:00Z",
      questionResults: [
        {
          questionId: "q1",
          userAnswer: "2x + 2",
          correctAnswer: "2x + 2",
          isCorrect: true,
          score: 5,
          maxScore: 5,
          timeSpent: 30
        },
        {
          questionId: "q2",
          userAnswer: ["牛顿-莱布尼茨公式"],
          correctAnswer: ["牛顿-莱布尼茨公式", "中值定理"],
          isCorrect: false,
          score: 5,
          maxScore: 10,
          timeSpent: 120
        }
      ]
    };
    return result;
  },

  // 获取课程详情
  getCourseDetail: async (courseId: string): Promise<CourseDetail> => {
    await delay(500);
    
    const mockCourseDetail: CourseDetail = {
      id: courseId,
      name: "高等数学A",
      teacher: "张教授",
      progress: 75,
      description: "学习微积分、线性代数等数学基础知识，培养逻辑思维能力",
      enrolledAt: "2025-02-20",
      totalLessons: 40,
      completedLessons: 30,
      credits: 4,
      semester: "2024秋季学期", 
      schedule: "周一、周三 8:00-9:40",
      classroom: "教学楼A-301",
      syllabus: "本课程涵盖函数、极限、导数、积分、级数等核心内容，通过理论学习和实践练习，帮助学生掌握数学分析的基本方法。",
      resources: [
        { name: "课程大纲.pdf", url: "/resources/syllabus.pdf", type: "pdf" },
        { name: "参考教材.pdf", url: "/resources/textbook.pdf", type: "pdf" },
        { name: "习题集.pdf", url: "/resources/exercises.pdf", type: "pdf" }
      ]
    };

    return mockCourseDetail;
  },

  // 更新章节完成状态
  updateChapterProgress: async (courseId: string, chapterId: string, completed: boolean): Promise<void> => {
    await delay(300);
    console.log(`更新课程 ${courseId} 章节 ${chapterId} 完成状态: ${completed}`);
  },

  // 提交作业
  submitAssignment: async (assignmentId: string, submission: any): Promise<void> => {
    await delay(500);
    console.log(`提交作业 ${assignmentId}:`, submission);
  },

  // 标记公告为已读
  markAnnouncementRead: async (announcementId: string): Promise<void> => {
    await delay(200);
    console.log(`标记公告 ${announcementId} 为已读`);
  },

  // 获取课程章节列表
  getCourseChapters: async (courseId: string): Promise<Chapter[]> => {
    await delay(300);
    const mockChapters: Chapter[] = [
      {
        id: "1",
        courseId,
        title: "第一章：函数与极限",
        description: "介绍函数的基本概念、极限的定义和性质",
        order: 1,
        duration: 240,
        content: "本章内容包括：函数的概念、复合函数、反函数、基本初等函数、极限的概念、极限的性质、无穷小与无穷大、连续函数等。",
        videoUrl: "/videos/chapter1.mp4",
        materials: [
          { name: "第一章课件.pptx", url: "/materials/ch1.pptx", type: "pptx" }
        ]
      },
      {
        id: "2",
        courseId,
        title: "第二章：导数与微分",
        description: "学习导数的概念、计算方法和应用",
        order: 2,
        duration: 300,
        content: "本章内容包括：导数的概念、求导法则、高阶导数、隐函数求导、参数方程求导、微分的概念和应用等。",
        videoUrl: "/videos/chapter2.mp4",
        materials: [
          { name: "第二章课件.pptx", url: "/materials/ch2.pptx", type: "pptx" },
          { name: "求导练习题.pdf", url: "/materials/ch2_exercises.pdf", type: "pdf" }
        ]
      },
      {
        id: "3",
        courseId,
        title: "第三章：积分学",
        description: "掌握不定积分和定积分的概念及计算",
        order: 3,
        duration: 360,
        content: "本章内容包括：不定积分的概念、基本积分表、换元积分法、分部积分法、定积分的概念、定积分的计算、定积分的应用等。",
        videoUrl: "/videos/chapter3.mp4",
        materials: [
          { name: "第三章课件.pptx", url: "/materials/ch3.pptx", type: "pptx" }
        ]
      }
    ];
    return mockChapters;
  },

  // 获取课程作业列表
  getCourseAssignments: async (courseId: string): Promise<Assignment[]> => {
    await delay(300);
    const mockAssignments: Assignment[] = [
      {
        id: "1",
        courseId,
        title: "第一次作业：函数与极限",
        description: "完成课本第1-2章练习题",
        dueDate: "2024-10-15T23:59:59Z",
        status: "submitted",
        maxScore: 100,
        submittedAt: "2024-10-14T18:30:00Z",
        score: 85,
        feedback: "解题思路正确，但在极限计算中有一些小的计算错误。建议多练习基础计算。",
        attachments: [
          { name: "作业要求.pdf", url: "/assignments/hw1.pdf", type: "pdf" }
        ]
      },
      {
        id: "2",
        courseId,
        title: "第二次作业：导数应用",
        description: "求解函数的导数并分析函数性质",
        dueDate: "2024-11-01T23:59:59Z",
        status: "pending",
        maxScore: 100,
        attachments: [
          { name: "作业要求.pdf", url: "/assignments/hw2.pdf", type: "pdf" }
        ]
      }
    ];
    return mockAssignments;
  },

  // 获取课程公告列表
  getCourseAnnouncements: async (courseId: string): Promise<Announcement[]> => {
    await delay(300);
    const mockAnnouncements: Announcement[] = [
      {
        id: "1",
        courseId,
        title: "期中考试安排通知",
        content: `# 期中考试安排通知

## 📝 考试基本信息
- **考试时间**: 2025年11月15日 (周五) 14:00-16:00
- **考试地点**: 教学楼A区 201-205教室
- **考试时长**: 120分钟
- **满分**: 100分

## 📚 考试范围
本次期中考试涵盖以下章节：

### 第一章：函数与极限
- 函数的概念与性质
- 极限的定义与计算
- 连续函数的性质

### 第二章：导数与微分  
- 导数的概念
- 求导法则与技巧
- 微分的应用

### 第三章：积分学基础
- 不定积分的概念
- 基本积分公式
- 简单的积分计算

## ⚠️ 注意事项
> **请务必携带**：学生证、身份证、2B铅笔、橡皮、黑色签字笔

**考试纪律**：
- [ ] 提前15分钟到达考场
- [ ] 关闭手机等电子设备  
- [ ] 独立完成，严禁作弊

## 📋 复习建议
1. **重点复习课后习题**
2. **掌握基本概念和定理**
3. **多做计算练习**

**祝同学们考试顺利！** 🎯`,
        publishedAt: "2024-10-20T10:00:00Z",
        isImportant: true,
        isRead: false
      },
      {
        id: "2",
        courseId,
        title: "课程资料更新",
        content: `# 课程资料更新通知

## 📂 更新内容

### 第三章：积分学
已更新以下资料：

#### 📄 课件资料
- **积分学基础.pptx** - 新增20页内容
- **定积分应用.pdf** - 补充实际应用案例

#### 📝 练习题
- **积分计算练习100题** - 按难度分级
- **历年考试真题汇编** - 包含详细解析

## 🔄 更新说明
1. **增加了更多例题**：覆盖各种题型
2. **补充了解题技巧**：提高计算效率
3. **加入了实际应用**：帮助理解概念

## 📥 下载方式
请从课程资料页面下载最新版本，**旧版本将于本周五停止访问**。

## 💡 学习建议
建议同学们：
- 先阅读课件理解概念
- 再做练习题巩固知识
- 遇到问题及时向老师或助教请教

---
**更新时间**: 2024年10月18日  
**版本**: v2.1`,
        publishedAt: "2024-10-18T14:30:00Z",
        isImportant: false,
        isRead: true
      }
    ];
    return mockAnnouncements;
  },

  // 获取章节学习进度
  getChapterProgress: async (courseId: string): Promise<ChapterProgress[]> => {
    await delay(300);
    const mockProgress: ChapterProgress[] = [
      { id: "1", courseId, chapterId: "1", userId: "1", completed: true, completedAt: "2024-09-15T16:00:00Z", watchTime: 240 },
      { id: "2", courseId, chapterId: "2", userId: "1", completed: true, completedAt: "2024-09-25T20:30:00Z", watchTime: 300 },
      { id: "3", courseId, chapterId: "3", userId: "1", completed: false, watchTime: 180 }
    ];
    return mockProgress;
  },

  // 获取通知列表
  getNotifications: async (filter: NotificationFilter = {}): Promise<Notification[]> => {
    await delay(300);
    let notifications = [...mockNotifications];

    // 按类型筛选
    if (filter.type) {
      notifications = notifications.filter(n => n.type === filter.type);
    }

    // 按优先级筛选
    if (filter.priority) {
      notifications = notifications.filter(n => n.priority === filter.priority);
    }

    // 按已读状态筛选
    if (filter.isRead !== undefined) {
      notifications = notifications.filter(n => n.isRead === filter.isRead);
    }

    // 按时间范围筛选
    if (filter.timeRange) {
      const now = new Date();
      let startDate: Date;

      switch (filter.timeRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'quarter':
          const quarter = Math.floor(now.getMonth() / 3);
          startDate = new Date(now.getFullYear(), quarter * 3, 1);
          break;
        default:
          startDate = new Date(0);
      }

      notifications = notifications.filter(n => 
        new Date(n.createdAt) >= startDate
      );
    }
    
    if (filter.startDate) {
      notifications = notifications.filter(n => n.createdAt >= filter.startDate!);
    }
    if (filter.endDate) {
      notifications = notifications.filter(n => n.createdAt <= filter.endDate!);
    }

    // 按创建时间倒序排列
    notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // 分页
    if (filter.offset || filter.limit) {
      const start = filter.offset || 0;
      const end = filter.limit ? start + filter.limit : undefined;
      notifications = notifications.slice(start, end);
    }

    return notifications;
  },

  // 获取通知统计
  getNotificationStats: async (): Promise<NotificationStats> => {
    await delay(200);
    const notifications = mockNotifications;
    
    const stats: NotificationStats = {
      total: notifications.length,
      unread: notifications.filter(n => !n.isRead).length,
      byType: {
        exam: notifications.filter(n => n.type === 'exam').length,
        course: notifications.filter(n => n.type === 'course').length,
        assignment: notifications.filter(n => n.type === 'assignment').length,
        announcement: notifications.filter(n => n.type === 'announcement').length,
        system: notifications.filter(n => n.type === 'system').length,
      },
      byPriority: {
        low: notifications.filter(n => n.priority === 'low').length,
        medium: notifications.filter(n => n.priority === 'medium').length,
        high: notifications.filter(n => n.priority === 'high').length,
        urgent: notifications.filter(n => n.priority === 'urgent').length,
      }
    };

    return stats;
  },

  // 获取单个通知详情
  getNotificationById: async (notificationId: string): Promise<Notification | null> => {
    await delay(200);
    const notification = mockNotifications.find(n => n.id === notificationId);
    return notification || null;
  },

  // 标记通知为已读
  markNotificationRead: async (notificationId: string): Promise<void> => {
    await delay(200);
    const notification = mockNotifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
      notification.readAt = new Date().toISOString();
    }
    console.log(`标记通知 ${notificationId} 为已读`);
  },

  // 批量标记通知为已读
  markNotificationsRead: async (notificationIds: string[]): Promise<void> => {
    await delay(300);
    const now = new Date().toISOString();
    notificationIds.forEach(id => {
      const notification = mockNotifications.find(n => n.id === id);
      if (notification) {
        notification.isRead = true;
        notification.readAt = now;
      }
    });
    console.log(`批量标记 ${notificationIds.length} 个通知为已读`);
  },

  // 标记所有通知为已读
  markAllNotificationsRead: async (): Promise<void> => {
    await delay(300);
    const now = new Date().toISOString();
    mockNotifications.forEach(notification => {
      if (!notification.isRead) {
        notification.isRead = true;
        notification.readAt = now;
      }
    });
    console.log('标记所有通知为已读');
  },

  // 删除通知
  deleteNotification: async (notificationId: string): Promise<void> => {
    await delay(200);
    const index = mockNotifications.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      mockNotifications.splice(index, 1);
    }
    console.log(`删除通知 ${notificationId}`);
  },

  // 批量删除通知
  deleteNotifications: async (notificationIds: string[]): Promise<void> => {
    await delay(300);
    notificationIds.forEach(id => {
      const index = mockNotifications.findIndex(n => n.id === id);
      if (index !== -1) {
        mockNotifications.splice(index, 1);
      }
    });
    console.log(`批量删除 ${notificationIds.length} 个通知`);
  },
};

// 真实 API 实现 (待后端 API 就绪后实现)
const realDataApi = {
  // TODO: 实现真实的 API 调用
  // 这里可以使用 httpClient 调用后端接口
  
  // 获取考试列表
  getExamsFromAPI: async (): Promise<Exam[]> => {
    const response = await httpClient.get<Exam[]>('/exams');
    return response.data || [];
  },

  // 获取课程列表
  getCoursesFromAPI: async (): Promise<Course[]> => {
    const response = await httpClient.get<Course[]>('/courses');
    return response.data || [];
  },

  // ... 其他方法类似实现
  // 为了简化，这里暂时使用 mock 实现
  ...mockDataApi
};

// 根据配置选择使用 Mock 还是真实 API
export const api = API_CONFIG.USE_MOCK ? mockDataApi : realDataApi;
