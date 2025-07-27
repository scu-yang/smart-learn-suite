# 课程详情功能实现文档

## 概述

课程详情功能是川大在线考试系统的核心功能之一，为学生提供完整的课程学习体验，包括课程信息查看、章节学习、作业管理、公告查看等功能。

## 功能特性

### 1. 课程概览
- **课程基本信息**：显示课程名称、教师、学期、上课时间、地点等
- **学习进度**：可视化显示学习进度百分比和完成课时
- **快速操作**：提供继续学习、查看作业、课程讨论等快捷入口
- **课程资料**：列出课程相关的文档、课件等资源

### 2. 章节内容
- **章节列表**：按顺序显示所有课程章节
- **进度跟踪**：显示每个章节的学习进度和观看时长
- **学习状态**：区分已完成和未完成的章节
- **资料下载**：每个章节包含相关的课件和学习材料

### 3. 作业管理
- **作业列表**：显示所有课程作业，包括待提交和已提交的
- **状态跟踪**：清晰显示作业状态（待提交、已提交、已逾期）
- **成绩反馈**：显示已批改作业的分数和教师反馈
- **文件附件**：支持作业要求文件的下载

### 4. 课程公告
- **公告展示**：按时间顺序显示课程公告
- **重要性标识**：重要公告有特殊标记
- **已读状态**：区分已读和未读公告
- **内容预览**：在列表中直接显示公告完整内容

## 技术实现

### 路由配置
```typescript
// 课程详情页路由
const courseDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/course/$courseId',
  component: () => {
    const { courseId } = courseDetailRoute.useParams();
    return <CourseDetailPage courseId={courseId} />;
  },
});
```

### 数据类型定义

#### 核心类型
```typescript
// 课程详情
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

// 章节信息
export interface Chapter {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  duration: number;
  content: string;
  videoUrl?: string;
  materials?: Material[];
}

// 作业信息
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
  attachments?: Attachment[];
}

// 公告信息
export interface Announcement {
  id: string;
  courseId: string;
  title: string;
  content: string;
  publishedAt: string;
  isImportant: boolean;
  isRead: boolean;
}

// 章节进度
export interface ChapterProgress {
  id: string;
  courseId: string;
  chapterId: string;
  userId: string;
  completed: boolean;
  completedAt?: string;
  watchTime: number;
}
```

### API 接口

#### 查询接口
```typescript
// 获取课程详情
getCourseDetail: (courseId: string) => Promise<CourseDetail>

// 获取课程章节列表
getCourseChapters: (courseId: string) => Promise<Chapter[]>

// 获取课程作业列表
getCourseAssignments: (courseId: string) => Promise<Assignment[]>

// 获取课程公告列表
getCourseAnnouncements: (courseId: string) => Promise<Announcement[]>

// 获取章节学习进度
getChapterProgress: (courseId: string) => Promise<ChapterProgress[]>
```

#### 变更接口
```typescript
// 更新章节进度
updateChapterProgress: (courseId: string, chapterId: string, completed: boolean) => Promise<void>

// 提交作业
submitAssignment: (assignmentId: string, submission: any) => Promise<void>

// 标记公告为已读
markAnnouncementRead: (announcementId: string) => Promise<void>
```

### React Query Hooks

#### 查询 Hooks
```typescript
// 课程详情
export function useCourseDetail(courseId: string)

// 课程章节
export function useCourseChapters(courseId: string)

// 课程作业
export function useCourseAssignments(courseId: string)

// 课程公告
export function useCourseAnnouncements(courseId: string)

// 章节进度
export function useChapterProgress(courseId: string)
```

#### 变更 Hooks
```typescript
// 更新章节进度
export function useUpdateChapterProgress()

// 提交作业
export function useSubmitAssignment()

// 标记公告已读
export function useMarkAnnouncementRead()
```

### 组件架构

#### 主要组件
- `CourseDetailPage`: 课程详情主页面
- `CourseHeader`: 课程头部信息展示
- `TabNavigation`: 标签页导航
- `OverviewTab`: 概览标签页
- `ChaptersTab`: 章节标签页
- `AssignmentsTab`: 作业标签页
- `AnnouncementsTab`: 公告标签页

#### 组件特性
- **响应式设计**：适配桌面和移动设备
- **加载状态**：提供优雅的加载动画
- **错误处理**：处理网络错误和数据异常
- **交互反馈**：操作后及时更新UI状态

## 用户交互流程

### 1. 进入课程详情
1. 用户从 Dashboard 点击课程卡片
2. 系统导航至 `/course/:courseId` 路由
3. 加载课程详情数据并展示

### 2. 学习章节
1. 用户点击章节的"开始学习"按钮
2. 系统跳转到视频播放页面（未实现）
3. 学习完成后自动更新进度

### 3. 提交作业
1. 用户在作业管理页面点击"提交作业"
2. 弹出作业提交表单（未实现）
3. 提交后更新作业状态

### 4. 查看公告
1. 用户点击公告标签页
2. 浏览公告列表
3. 点击"标记为已读"更新状态

## 数据流管理

### 缓存策略
- **课程详情**：10分钟缓存
- **章节列表**：10分钟缓存
- **作业列表**：5分钟缓存
- **公告列表**：2分钟缓存
- **学习进度**：1分钟缓存

### 缓存更新
- 用户操作后自动失效相关缓存
- 使用 `queryClient.invalidateQueries` 刷新数据
- 支持乐观更新提升用户体验

## 样式设计

### 设计原则
- **一致性**：与系统整体风格保持一致
- **层次感**：通过颜色和间距体现信息层级
- **可读性**：确保文字清晰易读
- **交互性**：提供明确的操作反馈

### 颜色系统
- **主色调**：蓝色 (`blue-600`)
- **成功状态**：绿色 (`green-600`)
- **警告状态**：黄色 (`yellow-600`)
- **错误状态**：红色 (`red-600`)
- **中性色**：灰色系 (`gray-*`)

### 组件样式
- **卡片布局**：使用 `Card` 组件统一样式
- **进度条**：可视化显示学习进度
- **状态标签**：不同颜色表示不同状态
- **按钮样式**：主要操作使用主色调

## 待实现功能

### 短期规划
1. **视频播放页面**：集成视频播放器
2. **作业提交表单**：完整的作业提交流程
3. **课程讨论功能**：师生互动交流
4. **学习笔记功能**：支持章节笔记记录

### 长期规划
1. **离线学习支持**：缓存视频和资料
2. **学习统计分析**：详细的学习数据报告
3. **个性化推荐**：基于学习行为推荐内容
4. **移动端优化**：原生应用体验

## 性能优化

### 当前优化
- 使用 React Query 缓存数据
- 组件懒加载避免首屏阻塞
- 合理的 API 请求并发策略

### 后续优化
- 虚拟滚动处理大量数据
- 图片懒加载减少带宽消耗
- Service Worker 支持离线访问

## 测试策略

### 单元测试
- API 接口测试
- React Hook 测试
- 组件渲染测试

### 集成测试
- 用户操作流程测试
- 数据状态管理测试
- 路由跳转测试

### E2E 测试
- 完整学习流程测试
- 跨浏览器兼容性测试
- 移动端适配测试

## 总结

课程详情功能为川大在线考试系统提供了完整的课程学习体验。通过合理的架构设计、数据管理和用户交互，为学生提供了直观、高效的学习平台。后续将继续完善相关功能，提升用户体验。
