import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../../ui/collapsible';
import { ChapterTreeSelector } from './ChapterTreeSelector';
import { AssignmentTypeSelector, AssignmentType } from './AssignmentTypeSelector';
import { 
  Filter,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Settings
} from 'lucide-react';

interface Chapter {
  id: string;
  name: string;
  sections: Section[];
}

interface Section {
  id: string;
  name: string;
  homeworkCount: number;
  examCount: number;
}

interface FilterState {
  selectedChapters: string[];
  selectedSections: string[];
  selectedTypes: AssignmentType[];
}

interface AdvancedFilterPanelProps {
  chapters: Chapter[];
  filterState: FilterState;
  onFilterChange: (state: FilterState) => void;
  className?: string;
}

export function AdvancedFilterPanel({
  chapters,
  filterState,
  onFilterChange,
  className = ''
}: AdvancedFilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChapterSelectionChange = (selectedChapters: string[], selectedSections: string[]) => {
    onFilterChange({
      ...filterState,
      selectedChapters,
      selectedSections
    });
  };

  const handleTypeSelectionChange = (selectedTypes: AssignmentType[]) => {
    onFilterChange({
      ...filterState,
      selectedTypes
    });
  };

  const handleReset = () => {
    onFilterChange({
      selectedChapters: [],
      selectedSections: [],
      selectedTypes: ['all']
    });
  };

  const getFilterSummary = () => {
    const { selectedChapters, selectedSections, selectedTypes } = filterState;
    const parts: string[] = [];

    // 章节筛选摘要
    if (selectedSections.length > 0) {
      if (selectedChapters.length === chapters.length) {
        parts.push('全部章节');
      } else if (selectedChapters.length > 0) {
        parts.push(`${selectedChapters.length}个章节`);
      } else {
        parts.push(`${selectedSections.length}个小节`);
      }
    }

    // 类型筛选摘要
    if (selectedTypes.includes('all')) {
      parts.push('全部成绩');
    } else if (selectedTypes.length > 0) {
      const typeLabels = selectedTypes.map(type => 
        type === 'homework' ? '作业' : type === 'exam' ? '考试' : ''
      ).filter(Boolean);
      parts.push(typeLabels.join('、'));
    }

    return parts.length > 0 ? parts.join(' · ') : '未设置筛选条件';
  };

  const hasActiveFilters = () => {
    const { selectedSections, selectedTypes } = filterState;
    return selectedSections.length > 0 || !selectedTypes.includes('all') || selectedTypes.length !== 1;
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filterState.selectedSections.length > 0) count++;
    if (!filterState.selectedTypes.includes('all') || filterState.selectedTypes.length !== 1) count++;
    return count;
  };

  return (
    <Card className={className}>
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-3 cursor-pointer hover:bg-accent/30 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  <CardTitle className="text-base">高级筛选</CardTitle>
                </div>
                {hasActiveFilters() && (
                  <Badge variant="secondary" className="text-xs">
                    {getActiveFilterCount()} 项筛选
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {hasActiveFilters() && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReset();
                    }}
                    className="text-xs gap-1 px-2 py-1 h-auto"
                  >
                    <RotateCcw className="w-3 h-3" />
                    重置
                  </Button>
                )}
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            </div>
            
            {/* 筛选摘要 */}
            <div className="text-left">
              <p className="text-sm text-muted-foreground">
                {getFilterSummary()}
              </p>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChapterTreeSelector
                chapters={chapters}
                selectedChapters={filterState.selectedChapters}
                selectedSections={filterState.selectedSections}
                onSelectionChange={handleChapterSelectionChange}
              />
              
              <AssignmentTypeSelector
                selectedTypes={filterState.selectedTypes}
                onSelectionChange={handleTypeSelectionChange}
                showAll={true}
              />
            </div>

            {/* 筛选操作按钮 */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Settings className="w-4 h-4" />
                <span>已选择: {filterState.selectedSections.length} 个小节, {filterState.selectedTypes.length} 种类型</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  disabled={!hasActiveFilters()}
                >
                  重置筛选
                </Button>
                <Button
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                >
                  应用筛选
                </Button>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

export type { FilterState, Chapter, Section };