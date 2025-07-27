import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { 
  ChevronDown, 
  ChevronRight, 
  BookOpen, 
  FileText,
  Search,
  X,
  Target
} from 'lucide-react';

interface KnowledgePoint {
  id: string;
  name: string;
  type: 'chapter' | 'section';
  parentId?: string;
}

interface Chapter {
  id: string;
  name: string;
  sections: KnowledgePoint[];
}

interface KnowledgePointTreeSelectorProps {
  selectedPoints: string[];
  onSelectionChange: (points: string[]) => void;
  courseId?: string;
  label?: string;
  required?: boolean;
  className?: string;
}

// Mock knowledge points data based on course
const getKnowledgePointsByCourse = (courseId: string): Chapter[] => {
  const knowledgePointsMap: { [key: string]: Chapter[] } = {
    'course-1': [ // 高等数学A
      {
        id: 'ch1',
        name: '第1章 函数与极限',
        sections: [
          { id: 'ch1s1', name: '1.1 函数的概念', type: 'section', parentId: 'ch1' },
          { id: 'ch1s2', name: '1.2 数列的极限', type: 'section', parentId: 'ch1' },
          { id: 'ch1s3', name: '1.3 函数的极限', type: 'section', parentId: 'ch1' },
          { id: 'ch1s4', name: '1.4 无穷小与无穷大', type: 'section', parentId: 'ch1' },
          { id: 'ch1s5', name: '1.5 函数的连续性', type: 'section', parentId: 'ch1' }
        ]
      },
      {
        id: 'ch2',
        name: '第2章 导数与微分',
        sections: [
          { id: 'ch2s1', name: '2.1 导数的定义', type: 'section', parentId: 'ch2' },
          { id: 'ch2s2', name: '2.2 函数的求导法则', type: 'section', parentId: 'ch2' },
          { id: 'ch2s3', name: '2.3 高阶导数', type: 'section', parentId: 'ch2' },
          { id: 'ch2s4', name: '2.4 隐函数及由参数方程确定的函数的导数', type: 'section', parentId: 'ch2' },
          { id: 'ch2s5', name: '2.5 微分', type: 'section', parentId: 'ch2' }
        ]
      },
      {
        id: 'ch3',
        name: '第3章 导数的应用',
        sections: [
          { id: 'ch3s1', name: '3.1 中值定理', type: 'section', parentId: 'ch3' },
          { id: 'ch3s2', name: '3.2 洛必达法则', type: 'section', parentId: 'ch3' },
          { id: 'ch3s3', name: '3.3 函数的单调性与曲线的凹凸性', type: 'section', parentId: 'ch3' },
          { id: 'ch3s4', name: '3.4 函数的极值与最大值最小值', type: 'section', parentId: 'ch3' },
          { id: 'ch3s5', name: '3.5 函数图形的描绘', type: 'section', parentId: 'ch3' }
        ]
      }
    ],
    'course-3': [ // 线性代数
      {
        id: 'ch1',
        name: '第1章 行列式',
        sections: [
          { id: 'ch1s1', name: '1.1 二阶与三阶行列式', type: 'section', parentId: 'ch1' },
          { id: 'ch1s2', name: '1.2 全排列和对换', type: 'section', parentId: 'ch1' },
          { id: 'ch1s3', name: '1.3 n阶行列式的定义', type: 'section', parentId: 'ch1' },
          { id: 'ch1s4', name: '1.4 行列式的性质', type: 'section', parentId: 'ch1' },
          { id: 'ch1s5', name: '1.5 行列式按行(列)展开', type: 'section', parentId: 'ch1' }
        ]
      },
      {
        id: 'ch2',
        name: '第2章 矩阵及其运算',
        sections: [
          { id: 'ch2s1', name: '2.1 矩阵的概念', type: 'section', parentId: 'ch2' },
          { id: 'ch2s2', name: '2.2 矩阵的运算', type: 'section', parentId: 'ch2' },
          { id: 'ch2s3', name: '2.3 逆矩阵', type: 'section', parentId: 'ch2' },
          { id: 'ch2s4', name: '2.4 矩阵分块法', type: 'section', parentId: 'ch2' }
        ]
      }
    ]
  };

  return knowledgePointsMap[courseId] || [];
};

export function KnowledgePointTreeSelector({
  selectedPoints,
  onSelectionChange,
  courseId = '',
  label = "知识点",
  required = false,
  className = ''
}: KnowledgePointTreeSelectorProps) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredChapters, setFilteredChapters] = useState<Chapter[]>([]);

  // 加载课程对应的知识点
  useEffect(() => {
    if (courseId) {
      const knowledgePoints = getKnowledgePointsByCourse(courseId);
      setChapters(knowledgePoints);
      setFilteredChapters(knowledgePoints);
    } else {
      setChapters([]);
      setFilteredChapters([]);
    }
  }, [courseId]);

  // 搜索过滤
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredChapters(chapters);
      return;
    }

    const filtered = chapters.map(chapter => {
      const matchingChapter = chapter.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchingSections = chapter.sections.filter(section =>
        section.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (matchingChapter || matchingSections.length > 0) {
        return {
          ...chapter,
          sections: matchingSections.length > 0 ? matchingSections : chapter.sections
        };
      }
      return null;
    }).filter(Boolean) as Chapter[];

    setFilteredChapters(filtered);
    
    // 展开有匹配结果的章节
    if (searchTerm.trim()) {
      const chaptersToExpand = new Set(filtered.map(ch => ch.id));
      setExpandedChapters(chaptersToExpand);
    }
  }, [searchTerm, chapters]);

  const toggleChapterExpansion = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  const handleChapterToggle = (chapterId: string, checked: boolean) => {
    const chapter = chapters.find(ch => ch.id === chapterId);
    if (!chapter) return;

    let newSelected = [...selectedPoints];

    if (checked) {
      // 选择整个章节，添加所有小节
      const sectionIds = chapter.sections.map(s => s.id);
      newSelected = [...new Set([...newSelected, chapterId, ...sectionIds])];
    } else {
      // 取消选择章节，移除章节和所有小节
      const sectionIds = chapter.sections.map(s => s.id);
      newSelected = newSelected.filter(id => id !== chapterId && !sectionIds.includes(id));
    }

    onSelectionChange(newSelected);
  };

  const handleSectionToggle = (sectionId: string, chapterId: string, checked: boolean) => {
    let newSelected = [...selectedPoints];

    if (checked) {
      newSelected.push(sectionId);
    } else {
      newSelected = newSelected.filter(id => id !== sectionId);
      // 如果取消了小节，也要取消章节的选择
      newSelected = newSelected.filter(id => id !== chapterId);
    }

    // 检查是否选择了章节的所有小节
    const chapter = chapters.find(ch => ch.id === chapterId);
    if (chapter) {
      const selectedSections = chapter.sections.filter(s => newSelected.includes(s.id));
      if (selectedSections.length === chapter.sections.length && !newSelected.includes(chapterId)) {
        newSelected.push(chapterId);
      }
    }

    onSelectionChange([...new Set(newSelected)]);
  };

  const removeSelectedPoint = (pointId: string) => {
    const newSelected = selectedPoints.filter(id => id !== pointId);
    
    // 如果移除的是章节，也要移除其所有小节
    const chapter = chapters.find(ch => ch.id === pointId);
    if (chapter) {
      const sectionIds = chapter.sections.map(s => s.id);
      onSelectionChange(newSelected.filter(id => !sectionIds.includes(id)));
    } else {
      // 如果移除的是小节，检查其父章节是否还应该被选中
      const section = chapters.flatMap(ch => ch.sections).find(s => s.id === pointId);
      if (section?.parentId) {
        const parentChapter = chapters.find(ch => ch.id === section.parentId);
        if (parentChapter) {
          const remainingSections = parentChapter.sections.filter(s => 
            s.id !== pointId && newSelected.includes(s.id)
          );
          if (remainingSections.length < parentChapter.sections.length) {
            onSelectionChange(newSelected.filter(id => id !== section.parentId));
          } else {
            onSelectionChange(newSelected);
          }
        }
      } else {
        onSelectionChange(newSelected);
      }
    }
  };

  const getPointName = (pointId: string): string => {
    // 查找章节
    const chapter = chapters.find(ch => ch.id === pointId);
    if (chapter) return chapter.name;
    
    // 查找小节
    const section = chapters.flatMap(ch => ch.sections).find(s => s.id === pointId);
    return section?.name || pointId;
  };

  const isChapterSelected = (chapterId: string): boolean => {
    return selectedPoints.includes(chapterId);
  };

  const isChapterIndeterminate = (chapterId: string): boolean => {
    const chapter = chapters.find(ch => ch.id === chapterId);
    if (!chapter) return false;
    
    const selectedSections = chapter.sections.filter(s => selectedPoints.includes(s.id));
    return selectedSections.length > 0 && selectedSections.length < chapter.sections.length && !selectedPoints.includes(chapterId);
  };

  if (!courseId) {
    return (
      <div className={`space-y-2 ${className}`}>
        <Label className="flex items-center gap-2">
          <Target className="w-4 h-4" />
          {label}
          {required && <span className="text-destructive">*</span>}
        </Label>
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">请先选择课程</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="flex items-center gap-2">
        <Target className="w-4 h-4" />
        {label}
        {required && <span className="text-destructive">*</span>}
        {selectedPoints.length > 0 && (
          <Badge variant="secondary" className="ml-2">
            已选 {selectedPoints.length} 项
          </Badge>
        )}
      </Label>

      {/* 已选择的知识点 */}
      {selectedPoints.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">已选择的知识点：</p>
          <div className="flex flex-wrap gap-2">
            {selectedPoints.map(pointId => (
              <Badge key={pointId} variant="secondary" className="gap-1">
                {getPointName(pointId)}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removeSelectedPoint(pointId)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">选择知识点</CardTitle>
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="搜索章节或小节..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent className="max-h-80 overflow-y-auto">
          {filteredChapters.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                {searchTerm ? '未找到匹配的知识点' : '该课程暂无知识点数据'}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredChapters.map(chapter => (
                <div key={chapter.id}>
                  {/* 章节头部 */}
                  <div className="flex items-center gap-2 p-2 rounded-md hover:bg-accent/50 transition-colors">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-4 h-4 p-0"
                      onClick={() => toggleChapterExpansion(chapter.id)}
                    >
                      {expandedChapters.has(chapter.id) ? 
                        <ChevronDown className="w-3 h-3" /> : 
                        <ChevronRight className="w-3 h-3" />
                      }
                    </Button>
                    
                    <Checkbox
                      checked={isChapterSelected(chapter.id)}
                      onCheckedChange={(checked) => handleChapterToggle(chapter.id, checked as boolean)}
                      className={isChapterIndeterminate(chapter.id) ? "data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground" : ""}
                      {...(isChapterIndeterminate(chapter.id) && { 'data-state': 'indeterminate' })}
                    />
                    
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-sm flex-1">{chapter.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {chapter.sections.filter(s => selectedPoints.includes(s.id)).length}/{chapter.sections.length}
                    </span>
                  </div>

                  {/* 章节内容 */}
                  {expandedChapters.has(chapter.id) && (
                    <div className="ml-6 space-y-1">
                      {chapter.sections.map(section => (
                        <div 
                          key={section.id} 
                          className="flex items-center gap-2 p-2 rounded-md hover:bg-accent/30 transition-colors"
                        >
                          <FileText className="w-3 h-3 text-muted-foreground" />
                          <Checkbox
                            checked={selectedPoints.includes(section.id)}
                            onCheckedChange={(checked) => handleSectionToggle(section.id, chapter.id, checked as boolean)}
                          />
                          <span className="text-sm flex-1">{section.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default KnowledgePointTreeSelector;