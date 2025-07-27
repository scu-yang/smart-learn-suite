import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { Button } from '../../../ui/button';
import { Textarea } from '../../../ui/textarea';
import { 
  User, 
  Clock, 
  ThumbsUp, 
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { STATUS_CONFIG, PRIORITY_CONFIG, ROLE_CONFIG } from '../constants/forumConstants';
import { getRelativeTime } from '../utils/forumUtils';

interface QuestionDetailProps {
  question: {
    id: string;
    title: string;
    content: string;
    student: {
      name: string;
      id: string;
    };
    course: string;
    knowledgePoint: string;
    status: 'pending' | 'answered' | 'resolved';
    priority: 'high' | 'medium' | 'low';
    createdAt: string;
    replies: Array<{
      id: string;
      content: string;
      author: {
        name: string;
        role: 'student' | 'ta' | 'teacher';
      };
      createdAt: string;
      likes: number;
      isAccepted?: boolean;
    }>;
    likes: number;
    views: number;
    tags: string[];
  };
  onBack: () => void;
  onReply: (content: string) => void;
  onMarkResolved: (questionId: string) => void;
}

export function QuestionDetail({ question, onBack, onReply, onMarkResolved }: QuestionDetailProps) {
  const [replyContent, setReplyContent] = useState('');

  const handleSubmitReply = () => {
    if (replyContent.trim()) {
      onReply(replyContent);
      setReplyContent('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回列表
        </Button>
      </div>

      {/* Question Detail */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="mb-2">{question.title}</CardTitle>
              <div className="flex items-center gap-2 mb-3">
                <Badge className={STATUS_CONFIG[question.status].color}>
                  {STATUS_CONFIG[question.status].text}
                </Badge>
                <Badge className={PRIORITY_CONFIG[question.priority].color}>
                  {PRIORITY_CONFIG[question.priority].text}
                </Badge>
                {question.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{question.student.name} ({question.student.id})</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{getRelativeTime(question.createdAt)}</span>
                </div>
                <span>{question.course} - {question.knowledgePoint}</span>
              </div>
            </div>
            <div className="flex gap-2">
              {question.status === 'answered' && (
                <Button 
                  size="sm"
                  onClick={() => onMarkResolved(question.id)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  标记为已解决
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            {question.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-3">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <ThumbsUp className="h-4 w-4" />
              <span>{question.likes} 赞</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {question.views} 次查看
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Replies */}
      {question.replies.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold">回复 ({question.replies.length})</h3>
          {question.replies.map((reply) => (
            <Card key={reply.id} className={reply.isAccepted ? 'border-green-500 bg-green-50' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{reply.author.name}</span>
                    <Badge className={ROLE_CONFIG[reply.author.role].color}>
                      {ROLE_CONFIG[reply.author.role].label}
                    </Badge>
                    {reply.isAccepted && (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        最佳答案
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {getRelativeTime(reply.createdAt)}
                  </span>
                </div>
                <div className="prose max-w-none mb-3">
                  {reply.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-2">
                      {paragraph}
                    </p>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    {reply.likes}
                  </Button>
                  {!reply.isAccepted && reply.author.role !== 'student' && (
                    <Button variant="ghost" size="sm">
                      设为最佳答案
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Reply Form */}
      <Card>
        <CardHeader>
          <CardTitle>添加回复</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="请输入您的回复..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={6}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setReplyContent('')}>
                取消
              </Button>
              <Button onClick={handleSubmitReply} disabled={!replyContent.trim()}>
                发送回复
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}