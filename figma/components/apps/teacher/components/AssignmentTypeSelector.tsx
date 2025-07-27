import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Checkbox } from '../../../ui/checkbox';
import { Badge } from '../../../ui/badge';
import { 
  FileText, 
  ClipboardCheck,
  BookOpen,
  Target
} from 'lucide-react';

export type AssignmentType = 'homework' | 'exam' | 'all';

interface AssignmentTypeSelectorProps {
  selectedTypes: AssignmentType[];
  onSelectionChange: (types: AssignmentType[]) => void;
  showAll?: boolean;
  className?: string;
}

interface TypeOption {
  value: AssignmentType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const typeOptions: TypeOption[] = [
  {
    value: 'all',
    label: '全部成绩',
    description: '包含作业和考试的综合成绩',
    icon: BookOpen,
    color: 'bg-chart-1/10 text-chart-1'
  },
  {
    value: 'homework',
    label: '作业成绩',
    description: '仅显示作业完成情况',
    icon: FileText,
    color: 'bg-chart-2/10 text-chart-2'
  },
  {
    value: 'exam',
    label: '考试成绩',
    description: '仅显示考试分数',
    icon: ClipboardCheck,
    color: 'bg-chart-3/10 text-chart-3'
  }
];

export function AssignmentTypeSelector({
  selectedTypes,
  onSelectionChange,
  showAll = true,
  className = ''
}: AssignmentTypeSelectorProps) {
  
  const availableOptions = showAll ? typeOptions : typeOptions.filter(opt => opt.value !== 'all');

  const handleTypeToggle = (type: AssignmentType) => {
    const newTypes = [...selectedTypes];
    
    if (type === 'all') {
      // 如果选择"全部"，则取消其他选项
      if (selectedTypes.includes('all')) {
        onSelectionChange(newTypes.filter(t => t !== 'all'));
      } else {
        onSelectionChange(['all']);
      }
    } else {
      // 如果选择具体类型，先取消"全部"选项
      const filteredTypes = newTypes.filter(t => t !== 'all');
      
      if (filteredTypes.includes(type)) {
        onSelectionChange(filteredTypes.filter(t => t !== type));
      } else {
        onSelectionChange([...filteredTypes, type]);
      }
    }
  };

  const getSelectedCount = () => {
    if (selectedTypes.includes('all')) return 1;
    return selectedTypes.filter(t => t !== 'all').length;
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="w-4 h-4" />
            成绩类型
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            已选 {getSelectedCount()} 项
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {availableOptions.map(option => {
          const Icon = option.icon;
          const isSelected = selectedTypes.includes(option.value);
          
          return (
            <div
              key={option.value}
              className={`
                relative p-3 rounded-lg border-2 transition-all cursor-pointer
                ${isSelected 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-border-hover hover:bg-accent/30'
                }
              `}
              onClick={() => handleTypeToggle(option.value)}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${option.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleTypeToggle(option.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <h4 className="font-medium text-sm">{option.label}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {option.description}
                  </p>
                </div>
              </div>

              {/* 选中指示器 */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                </div>
              )}
            </div>
          );
        })}

        {/* 选择提示 */}
        <div className="pt-2 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
            <span>
              {selectedTypes.includes('all') 
                ? '显示综合成绩，包含作业和考试的加权平均'
                : selectedTypes.length === 0
                ? '请选择至少一种成绩类型'
                : `已选择 ${selectedTypes.length} 种成绩类型`
              }
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}