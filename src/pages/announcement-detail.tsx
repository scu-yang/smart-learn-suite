import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, Eye, Bell } from "lucide-react";
import { Link, useRouter } from "@tanstack/react-router";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { api } from "@/lib/api";
import { useMarkNotificationRead } from "@/hooks/useMutations";
import type { Notification } from "@/types";

interface AnnouncementDetailPageProps {
  announcementId: string;
}

export function AnnouncementDetailPage({ announcementId }: AnnouncementDetailPageProps) {
  const router = useRouter();
  const [announcement, setAnnouncement] = useState<Notification | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const markAsRead = useMarkNotificationRead();

  useEffect(() => {
    const loadAnnouncement = async () => {
      try {
        setIsLoading(true);
        // 从通知列表中查找对应的公告
        const notifications = await api.getNotifications();
        const found = notifications.find(n => n.id === announcementId);
        
        if (found) {
          setAnnouncement(found);
          // 如果未读，自动标记为已读
          if (!found.isRead) {
            markAsRead.mutate(found.id);
          }
        }
      } catch (error) {
        console.error('加载公告失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnnouncement();
  }, [announcementId, markAsRead]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载公告中...</p>
        </div>
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">公告不存在或已被删除</p>
          <Link to="/notifications" className="text-blue-600 hover:text-blue-800">
            返回通知中心
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'exam': return 'text-blue-600 bg-blue-100';
      case 'course': return 'text-green-600 bg-green-100';
      case 'assignment': return 'text-yellow-600 bg-yellow-100';
      case 'announcement': return 'text-purple-600 bg-purple-100';
      case 'system': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'exam': return '考试';
      case 'course': return '课程';
      case 'assignment': return '作业';
      case 'announcement': return '公告';
      case 'system': return '系统';
      default: return '其他';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return '紧急';
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return '普通';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link to="/notifications" className="flex items-center text-gray-600 hover:text-gray-900 mr-6">
              <ArrowLeft className="h-5 w-5 mr-2" />
              返回通知中心
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">公告详情</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <div className="flex flex-col space-y-4">
              {/* 标题和标签 */}
              <div className="flex items-start justify-between">
                <CardTitle className="text-2xl font-bold text-gray-900 flex-1">
                  {announcement.title}
                </CardTitle>
                <div className="flex items-center space-x-2 ml-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(announcement.type)}`}>
                    {getTypeText(announcement.type)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(announcement.priority)}`}>
                    {getPriorityText(announcement.priority)}
                  </span>
                </div>
              </div>

              {/* 元信息 */}
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  发布时间：{formatDate(announcement.createdAt)}
                </div>
                {announcement.readAt && (
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-2" />
                    已读于：{formatDate(announcement.readAt)}
                  </div>
                )}
                <div className="flex items-center">
                  <Bell className="h-4 w-4 mr-2" />
                  {announcement.isRead ? '已读' : '未读'}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {/* Markdown 内容渲染 */}
            <div className="prose prose-slate max-w-none">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  // 自定义样式
                  h1: ({children}) => <h1 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b">{children}</h1>,
                  h2: ({children}) => <h2 className="text-xl font-semibold text-gray-800 mb-3 mt-6">{children}</h2>,
                  h3: ({children}) => <h3 className="text-lg font-medium text-gray-700 mb-2 mt-4">{children}</h3>,
                  p: ({children}) => <p className="text-gray-700 mb-4 leading-relaxed">{children}</p>,
                  ul: ({children}) => <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700">{children}</ul>,
                  ol: ({children}) => <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-700">{children}</ol>,
                  li: ({children}) => <li className="mb-1">{children}</li>,
                  strong: ({children}) => <strong className="font-semibold text-gray-900">{children}</strong>,
                  em: ({children}) => <em className="italic text-gray-800">{children}</em>,
                  blockquote: ({children}) => (
                    <blockquote className="border-l-4 border-blue-200 pl-4 py-2 mb-4 bg-blue-50 text-gray-700 italic">
                      {children}
                    </blockquote>
                  ),
                  code: ({children}) => (
                    <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono">
                      {children}
                    </code>
                  ),
                  pre: ({children}) => (
                    <pre className="bg-gray-100 text-gray-800 p-4 rounded-lg mb-4 overflow-x-auto">
                      {children}
                    </pre>
                  ),
                  hr: () => <hr className="border-gray-300 my-6" />,
                  table: ({children}) => (
                    <div className="overflow-x-auto mb-4">
                      <table className="min-w-full border border-gray-300 rounded-lg">
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({children}) => <thead className="bg-gray-50">{children}</thead>,
                  th: ({children}) => (
                    <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-900">
                      {children}
                    </th>
                  ),
                  td: ({children}) => (
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">
                      {children}
                    </td>
                  ),
                  // 任务列表样式
                  input: (props) => {
                    if (props.type === 'checkbox') {
                      return (
                        <input 
                          type="checkbox" 
                          checked={props.checked || false}
                          disabled
                          className="mr-2 accent-blue-600"
                        />
                      );
                    }
                    return <input {...props} />;
                  }
                }}
              >
                {announcement.content}
              </ReactMarkdown>
            </div>

            {/* 操作按钮 */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  公告 ID: {announcement.id}
                </div>
                <div className="flex space-x-3">
                  <Button variant="outline" onClick={() => router.history.back()}>
                    返回
                  </Button>
                  {announcement.actionUrl && announcement.actionText && (
                    <Link to={announcement.actionUrl as any}>
                      <Button>
                        {announcement.actionText}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
