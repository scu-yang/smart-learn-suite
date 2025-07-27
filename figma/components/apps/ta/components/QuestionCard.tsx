import React from 'react';
import { Card, CardContent } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { Button } from '../../../ui/button';
import { 
  MessageSquare, 
  Clock, 
  User, 
  ThumbsUp, 
  Eye,
  Tag
} from 'lucide-react';
import { STATUS_CONFIG, PRIORITY_CONFIG } from '../constants/forumConstants';
import { getRelativeTime, truncateText } from '../utils/forumUtils';

interface QuestionCardProps {
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
    replies: any[];
    likes: number;
    views: number;
    tags: string[];
  };
  onSelect: (questionId: string) => void;
  onReply: (questionId: string) => void;
}

export function QuestionCard({ question, onSelect, onReply }: QuestionCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-6" onClick={() => onSelect(question.id)}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold">{question.title}</h3>
              <Badge className={STATUS_CONFIG[question.status].color}>
                {STATUS_CONFIG[question.status].text}
              </Badge>
              <Badge className={PRIORITY_CONFIG[question.priority].color}>
                {PRIORITY_CONFIG[question.priority].text}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3">
              {truncateText(question.content, 150)}
            </p>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{question.student.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{getRelativeTime(question.createdAt)}</span>
              </div>
              <span>{question.course}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>{question.replies.length} 回复</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-3 w-3" />
                  <span>{question.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{question.views}</span>
                </div>
              </div>
              
              <div className="flex gap-1">
                {question.tags.slice(0, 2).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {question.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{question.tags.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 pt-3 border-t" onClick={e => e.stopPropagation()}>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onReply(question.id)}
          >
            回复
          </Button>
          {question.status === 'answered' && (
            <Button size="sm" variant="outline">
              标记为已解决
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}