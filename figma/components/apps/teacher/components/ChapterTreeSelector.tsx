import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Checkbox } from '../../../ui/checkbox';
import { Button } from '../../../ui/button';
import { 
  ChevronDown, 
  ChevronRight, 
  BookOpen, 
  FileText,
  CheckSquare,
  Square
} from 'lucide-react';

interface Section {
  id: string;
  name: string;
  homeworkCount: number;
  examCount: number;
}

interface Chapter {
  id: string;
  name: string;
  sections: Section[];
}

interface ChapterTreeSelectorProps {
  chapters: Chapter[];
  selectedChapters: string[];
  selectedSections: string[];
  onSelectionChange: (chapters: string[], sections: string[]) => void;
  className?: string;
}

interface ChapterState {
  [chapterId: string]: {
    expanded: boolean;
    selected: boolean;
    indeterminate: boolean;
    sections: {
      [sectionId: string]: boolean;
    };
  };
}

export function ChapterTreeSelector({
  chapters,
  selectedChapters,
  selectedSections,
  onSelectionChange,
  className = ''
}: ChapterTreeSelectorProps) {
  const [chapterStates, setChapterStates] = useState<ChapterState>({});

  // 初始化章节状态
  useEffect(() => {
    const initialState: ChapterState = {};
    chapters.forEach(chapter => {
      const sectionStates: { [sectionId: string]: boolean } = {};
      chapter.sections.forEach(section => {
        sectionStates[section.id] = selectedSections.includes(section.id);
      });

      const selectedSectionCount = Object.values(sectionStates).filter(Boolean).length;
      const totalSectionCount = chapter.sections.length;

      initialState[chapter.id] = {
        expanded: false,
        selected: selectedSectionCount === totalSectionCount,
        indeterminate: selectedSectionCount > 0 && selectedSectionCount < totalSectionCount,
        sections: sectionStates
      };
    });

    setChapterStates(initialState);
  }, [chapters, selectedChapters, selectedSections]);

  // 处理章节选择
  const handleChapterToggle = (chapterId: string) => {
    const chapter = chapters.find(ch => ch.id === chapterId);
    if (!chapter) return;

    const currentState = chapterStates[chapterId];
    const newSelected = !currentState.selected && !currentState.indeterminate;

    // 更新章节状态
    const newSectionStates: { [sectionId: string]: boolean } = {};
    chapter.sections.forEach(section => {
      newSectionStates[section.id] = newSelected;
    });

    setChapterStates(prev => ({
      ...prev,
      [chapterId]: {
        ...prev[chapterId],
        selected: newSelected,
        indeterminate: false,
        sections: newSectionStates
      }
    }));

    // 计算新的选择结果
    const newSelectedSections = new Set(selectedSections);
    chapter.sections.forEach(section => {
      if (newSelected) {
        newSelectedSections.add(section.id);
      } else {
        newSelectedSections.delete(section.id);
      }
    });

    const newSelectedChapters = new Set(selectedChapters);
    if (newSelected) {
      newSelectedChapters.add(chapterId);
    } else {
      newSelectedChapters.delete(chapterId);
    }

    onSelectionChange(Array.from(newSelectedChapters), Array.from(newSelectedSections));
  };

  // 处理节选择
  const handleSectionToggle = (chapterId: string, sectionId: string) => {
    const chapter = chapters.find(ch => ch.id === chapterId);
    if (!chapter) return;

    const currentState = chapterStates[chapterId];
    const newSectionSelected = !currentState.sections[sectionId];

    // 更新节状态
    const newSectionStates = {
      ...currentState.sections,
      [sectionId]: newSectionSelected
    };

    const selectedSectionCount = Object.values(newSectionStates).filter(Boolean).length;
    const totalSectionCount = chapter.sections.length;

    setChapterStates(prev => ({
      ...prev,
      [chapterId]: {
        ...prev[chapterId],
        selected: selectedSectionCount === totalSectionCount,
        indeterminate: selectedSectionCount > 0 && selectedSectionCount < totalSectionCount,
        sections: newSectionStates
      }
    }));

    // 计算新的选择结果
    const newSelectedSections = new Set(selectedSections);
    if (newSectionSelected) {
      newSelectedSections.add(sectionId);
    } else {
      newSelectedSections.delete(sectionId);
    }

    const newSelectedChapters = new Set(selectedChapters);
    if (selectedSectionCount === totalSectionCount) {
      newSelectedChapters.add(chapterId);
    } else {
      newSelectedChapters.delete(chapterId);
    }

    onSelectionChange(Array.from(newSelectedChapters), Array.from(newSelectedSections));
  };

  // 展开/折叠章节
  const toggleChapterExpansion = (chapterId: string) => {
    setChapterStates(prev => ({
      ...prev,
      [chapterId]: {
        ...prev[chapterId],
        expanded: !prev[chapterId]?.expanded
      }
    }));
  };

  // 全选/全不选
  const handleSelectAll = () => {
    const allSections = chapters.flatMap(ch => ch.sections.map(s => s.id));
    const allChapters = chapters.map(ch => ch.id);
    
    if (selectedSections.length === allSections.length) {
      // 全不选
      onSelectionChange([], []);
    } else {
      // 全选
      onSelectionChange(allChapters, allSections);
    }
  };

  const allSectionsCount = chapters.reduce((sum, ch) => sum + ch.sections.length, 0);
  const isAllSelected = selectedSections.length === allSectionsCount;
  const isIndeterminate = selectedSections.length > 0 && selectedSections.length < allSectionsCount;

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            章节选择
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            className="text-xs"
          >
            <div className="flex items-center gap-2">
              {isAllSelected ? <CheckSquare className="w-3 h-3" /> : <Square className="w-3 h-3" />}
              {isAllSelected ? '全不选' : '全选'}
            </div>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {chapters.map(chapter => {
          const state = chapterStates[chapter.id];
          if (!state) return null;

          return (
            <div key={chapter.id} className="space-y-1">
              {/* 章节头部 */}
              <div className="flex items-center gap-2 p-2 rounded-md hover:bg-accent/50 transition-colors">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-4 h-4 p-0"
                  onClick={() => toggleChapterExpansion(chapter.id)}
                >
                  {state.expanded ? 
                    <ChevronDown className="w-3 h-3" /> : 
                    <ChevronRight className="w-3 h-3" />
                  }
                </Button>
                
                <Checkbox
                  checked={state.selected}
                  onCheckedChange={() => handleChapterToggle(chapter.id)}
                  className="data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground"
                  {...(state.indeterminate && { 'data-state': 'indeterminate' })}
                />
                
                <div className="flex-1 flex items-center justify-between">
                  <span className="font-medium text-sm">{chapter.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {Object.values(state.sections).filter(Boolean).length}/{chapter.sections.length}
                  </span>
                </div>
              </div>

              {/* 章节内容 */}
              {state.expanded && (
                <div className="ml-6 space-y-1">
                  {chapter.sections.map(section => (
                    <div 
                      key={section.id} 
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-accent/30 transition-colors"
                    >
                      <FileText className="w-3 h-3 text-muted-foreground" />
                      <Checkbox
                        checked={state.sections[section.id] || false}
                        onCheckedChange={() => handleSectionToggle(chapter.id, section.id)}
                      />
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm">{section.name}</span>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>作业: {section.homeworkCount}</span>
                          <span>考试: {section.examCount}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {chapters.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">暂无章节数据</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}