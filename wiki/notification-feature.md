# 📢 通知功能详细说明

## 功能概述

智慧教学系统的通知功能为用户提供了完整的系统通知管理能力，包括查看、筛选、标记已读、跳转等核心功能。

## 核心功能

### 1. 📋 通知查看
- **通知列表**：显示所有系统通知，支持分页
- **通知详情**：显示通知标题、内容、类型、优先级、时间等完整信息
- **未读标识**：清晰区分已读和未读通知
- **优先级图标**：通过不同图标标识通知优先级（紧急、高、中、低）

### 2. 🔍 智能筛选
- **按类型筛选**：考试、课程、作业、公告、系统
- **按优先级筛选**：紧急、高、中、低
- **按状态筛选**：已读、未读、全部
- **按时间筛选**：今天、本周、本月、本季度、全部时间
- **组合筛选**：支持多条件同时筛选
- **一键清空**：快速清除所有筛选条件

### 3. ✅ 标记已读功能
- **单个标记**：点击单个通知的已读按钮
- **自动标记**：点击通知内容时自动标记为已读
- **批量标记**：选中多个通知批量标记已读
- **全部已读**：一键标记所有通知为已读

### 4. 🔗 智能跳转
- **相关页面跳转**：点击通知自动跳转到相关的页面（考试、课程、作业等）
- **操作按钮**：部分通知提供直接操作按钮（如"立即查看"、"开始考试"等）

### 5. 🗑️ 通知管理
- **单个删除**：删除不需要的通知
- **批量删除**：选中多个通知进行批量删除
- **全选功能**：快速选择所有通知

### 6. 📊 统计信息
- **总数统计**：显示通知总数和未读数量
- **分类统计**：按类型显示通知数量分布
- **实时更新**：统计信息随操作实时更新

## 技术实现

### 类型定义
```typescript
// 通知类型
interface Notification {
  id: string;
  title: string;
  content: string;
  type: 'exam' | 'course' | 'assignment' | 'announcement' | 'system';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  isRead: boolean;
  createdAt: string;
  readAt?: string;
  actionText?: string;
  actionUrl?: string;
}

// 筛选条件
interface NotificationFilter {
  type?: Notification['type'];
  priority?: Notification['priority'];
  isRead?: boolean;
  timeRange?: 'today' | 'week' | 'month' | 'quarter';
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

// 统计信息
interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<Notification['type'], number>;
  byPriority: Record<Notification['priority'], number>;
}
```

### API 接口
- `getNotifications(filter)` - 获取通知列表
- `getNotificationStats()` - 获取通知统计
- `markNotificationRead(id)` - 标记单个通知已读
- `markNotificationsRead(ids)` - 批量标记已读
- `markAllNotificationsRead()` - 标记全部已读
- `deleteNotification(id)` - 删除单个通知
- `deleteNotifications(ids)` - 批量删除通知

### React Query Hooks
- `useNotifications(filter)` - 获取通知列表
- `useNotificationStats()` - 获取统计信息
- `useUnreadNotifications()` - 获取未读通知
- `useMarkNotificationRead()` - 标记已读
- `useMarkNotificationsRead()` - 批量标记已读
- `useMarkAllNotificationsRead()` - 全部标记已读
- `useDeleteNotification()` - 删除通知
- `useDeleteNotifications()` - 批量删除

## 用户界面

### 主要组件
1. **通知入口**：Dashboard 右上角的通知按钮，显示未读数量徽章
2. **通知中心**：独立的通知管理页面
3. **侧边栏**：统计信息和筛选器
4. **主内容区**：通知列表和批量操作栏
5. **通知卡片**：每个通知的详细展示组件

### 视觉设计
- **未读通知**：蓝色边框和背景，突出显示
- **优先级标识**：不同颜色的图标表示优先级
- **类型标签**：彩色标签区分通知类型
- **操作按钮**：悬浮显示的操作按钮
- **选择状态**：选中通知有蓝色边框高亮

## 用户体验

### 便捷性
- **快速访问**：Dashboard 一键进入通知中心
- **智能筛选**：多维度筛选快速找到目标通知
- **批量操作**：支持批量标记和删除，提高效率
- **自动标记**：点击查看自动标记为已读

### 实时性
- **即时更新**：操作后立即刷新列表和统计
- **缓存机制**：React Query 提供智能缓存
- **乐观更新**：操作立即反映在 UI 上

### 响应式
- **移动适配**：支持手机和平板设备
- **触摸友好**：适合触摸操作的按钮大小
- **布局自适应**：不同屏幕尺寸下的最佳显示

## 路由配置

通知中心的路由地址：`/notifications`

在 `/src/router.tsx` 中已配置相应路由，支持直接访问。

## 使用场景

### 学生用户
1. **考试提醒**：接收即将开始的考试通知
2. **课程更新**：获取课程内容更新、作业发布等通知
3. **成绩通知**：查看考试成绩发布通知
4. **系统公告**：了解系统维护、政策变更等信息

### 教师用户
1. **课程管理**：接收学生提交作业、考试申请等通知
2. **系统提醒**：获取平台功能更新、培训安排等信息
3. **截止提醒**：作业评分、成绩录入等截止时间提醒

## 扩展功能

### 未来可增加的功能
1. **推送通知**：浏览器推送和邮件通知
2. **通知设置**：用户自定义通知偏好
3. **通知模板**：管理员自定义通知模板
4. **通知归档**：历史通知的长期存储
5. **通知搜索**：基于关键词的通知搜索
6. **通知订阅**：订阅特定类型的通知

## 维护指南

### 数据管理
- **Mock 数据**：位于 `/src/lib/api.ts` 中的 `mockNotifications`
- **API 接口**：所有通知相关的 API 都在 `api` 对象中
- **缓存策略**：React Query 自动管理缓存，操作后自动失效相关缓存

### 性能优化
- **分页加载**：支持分页减少一次性加载的数据量
- **虚拟滚动**：可考虑在通知数量很大时使用虚拟滚动
- **图标缓存**：Lucide 图标已优化，按需加载

### 代码结构
```
src/
├── pages/notifications.tsx           # 通知中心主页面
├── hooks/
│   ├── useQueries.ts                # 查询相关 hooks
│   └── useMutations.ts              # 变更相关 hooks
├── lib/api.ts                       # API 接口和 mock 数据
├── types/index.ts                   # 类型定义
└── router.tsx                       # 路由配置
```

## 总结

通知功能是智慧教学系统的重要组成部分，提供了完整的通知管理能力。通过合理的设计和实现，为用户提供了便捷、高效的通知体验，同时为系统的进一步扩展奠定了良好的基础。
