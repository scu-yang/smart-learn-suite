import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Checkbox } from '../../ui/checkbox';
import { Label } from '../../ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { 
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  Users,
  BookOpen,
  CheckCircle2,
  Clock,
  Target,
  BarChart3,
  Calendar,
  Settings,
  Eye
} from 'lucide-react';

interface Chapter {
  id: string;
  name: string;
  sections: Section[];
  selected: boolean;
}

interface Section {
  id: string;
  name: string;
  selected: boolean;
}

interface Student {
  id: string;
  name: string;
  studentId: string;
  grades: { [key: string]: number }; // sectionId -> grade
}

interface Class {
  id: string;
  name: string;
  studentCount: number;
}

const mockClasses: Class[] = [
  { id: 'class1', name: '数学2023-1班', studentCount: 32 },
  { id: 'class2', name: '数学2023-2班', studentCount: 28 },
  { id: 'class3', name: '数学2024-1班', studentCount: 35 }
];

const mockChapters: Chapter[] = [
  {
    id: 'ch1',
    name: '第一章 函数与极限',
    selected: false,
    sections: [
      { id: 'sec1_1', name: '1.1 函数的概念', selected: false },
      { id: 'sec1_2', name: '1.2 函数的性质', selected: false },
      { id: 'sec1_3', name: '1.3 极限的定义', selected: false },
      { id: 'sec1_4', name: '1.4 极限的计算', selected: false }
    ]
  },
  {
    id: 'ch2',
    name: '第二章 导数与微分',
    selected: false,
    sections: [
      { id: 'sec2_1', name: '2.1 导数的定义', selected: false },
      { id: 'sec2_2', name: '2.2 求导法则', selected: false },
      { id: 'sec2_3', name: '2.3 隐函数求导', selected: false },
      { id: 'sec2_4', name: '2.4 微分应用', selected: false }
    ]
  },
  {
    id: 'ch3',
    name: '第三章 积分学',
    selected: false,
    sections: [
      { id: 'sec3_1', name: '3.1 不定积分', selected: false },
      { id: 'sec3_2', name: '3.2 定积分', selected: false },
      { id: 'sec3_3', name: '3.3 积分技巧', selected: false },
      { id: 'sec3_4', name: '3.4 积分应用', selected: false }
    ]
  },
  {
    id: 'ch4',
    name: '第四章 无穷级数',
    selected: false,
    sections: [
      { id: 'sec4_1', name: '4.1 数项级数', selected: false },
      { id: 'sec4_2', name: '4.2 幂级数', selected: false },
      { id: 'sec4_3', name: '4.3 泰勒级数', selected: false }
    ]
  }
];

const mockStudents: Student[] = [
  {
    id: 'stu1',
    name: '张小明',
    studentId: '2023001',
    grades: {
      'sec1_1': 85, 'sec1_2': 90, 'sec1_3': 88, 'sec1_4': 92,
      'sec2_1': 87, 'sec2_2': 89, 'sec2_3': 85, 'sec2_4': 91,
      'sec3_1': 82, 'sec3_2': 86, 'sec3_3': 84, 'sec3_4': 88,
      'sec4_1': 89, 'sec4_2': 87, 'sec4_3': 85
    }
  },
  {
    id: 'stu2',
    name: '李小红',
    studentId: '2023002',
    grades: {
      'sec1_1': 92, 'sec1_2': 94, 'sec1_3': 90, 'sec1_4': 95,
      'sec2_1': 91, 'sec2_2': 93, 'sec2_3': 89, 'sec2_4': 94,
      'sec3_1': 88, 'sec3_2': 92, 'sec3_3': 90, 'sec3_4': 93,
      'sec4_1': 91, 'sec4_2': 89, 'sec4_3': 92
    }
  },
  {
    id: 'stu3',
    name: '王小强',
    studentId: '2023003',
    grades: {
      'sec1_1': 78, 'sec1_2': 82, 'sec1_3': 80, 'sec1_4': 85,
      'sec2_1': 79, 'sec2_2': 81, 'sec2_3': 77, 'sec2_4': 83,
      'sec3_1': 75, 'sec3_2': 78, 'sec3_3': 76, 'sec3_4': 80,
      'sec4_1': 81, 'sec4_2': 79, 'sec4_3': 77
    }
  }
];

export function TAGradeExport() {
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [chapters, setChapters] = useState<Chapter[]>(mockChapters);
  const [exportFormat, setExportFormat] = useState<string>('excel');
  const [includeStatistics, setIncludeStatistics] = useState(true);
  const [includeCharts, setIncludeCharts] = useState(false);
  const [dateRange, setDateRange] = useState<string>('all');
  const [showPreview, setShowPreview] = useState(false);

  const handleChapterToggle = (chapterId: string, checked: boolean) => {
    setChapters(prev => prev.map(chapter => {
      if (chapter.id === chapterId) {
        // 如果选择章节，则默认选择所有小节
        const updatedSections = chapter.sections.map(section => ({
          ...section,
          selected: checked
        }));
        return { ...chapter, selected: checked, sections: updatedSections };
      }
      return chapter;
    }));
  };

  const handleSectionToggle = (chapterId: string, sectionId: string, checked: boolean) => {
    setChapters(prev => prev.map(chapter => {
      if (chapter.id === chapterId) {
        const updatedSections = chapter.sections.map(section =>
          section.id === sectionId ? { ...section, selected: checked } : section
        );
        // 检查章节是否应该被选中（所有小节都被选中）
        const allSectionsSelected = updatedSections.every(section => section.selected);
        const anySectionSelected = updatedSections.some(section => section.selected);
        
        return {
          ...chapter,
          sections: updatedSections,
          selected: allSectionsSelected
        };
      }
      return chapter;
    }));
  };

  const getSelectedSections = () => {
    return chapters.flatMap(chapter => 
      chapter.sections.filter(section => section.selected)
    );
  };

  const calculateStatistics = () => {
    const selectedSections = getSelectedSections();
    if (selectedSections.length === 0) return null;

    const stats = selectedSections.map(section => {
      const grades = mockStudents.map(student => student.grades[section.id]).filter(grade => grade !== undefined);
      const average = grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
      const highest = Math.max(...grades);
      const lowest = Math.min(...grades);
      
      return {
        section: section.name,
        average: average.toFixed(1),
        highest,
        lowest,
        count: grades.length
      };
    });

    return stats;
  };

  const handleExport = () => {
    const selectedSections = getSelectedSections();
    if (selectedSections.length === 0) {
      alert('请至少选择一个章节或小节');
      return;
    }
    if (!selectedClass) {
      alert('请选择要导出的班级');
      return;
    }

    // 模拟导出过程
    console.log('导出配置:', {
      class: selectedClass,
      sections: selectedSections,
      format: exportFormat,
      includeStatistics,
      includeCharts,
      dateRange
    });

    alert(`正在导出${exportFormat === 'excel' ? 'Excel' : 'PDF'}文件...`);
  };

  const selectedSectionsCount = getSelectedSections().length;
  const selectedClass_obj = mockClasses.find(cls => cls.id === selectedClass);
  const statistics = calculateStatistics();

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-2">班级成绩导出</h1>
          <p className="text-muted-foreground">
            按章节选择导出学生成绩，支持多种格式
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? '隐藏预览' : '预览数据'}
          </Button>
          <Button onClick={handleExport} disabled={!selectedClass || selectedSectionsCount === 0}>
            <Download className="h-4 w-4 mr-2" />
            导出成绩
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 导出配置 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 班级选择 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                选择班级
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择要导出成绩的班级" />
                </SelectTrigger>
                <SelectContent>
                  {mockClasses.map(cls => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name} ({cls.studentCount}人)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* 章节选择 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                选择章节和小节
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {chapters.map(chapter => (
                  <div key={chapter.id} className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Checkbox
                        id={chapter.id}
                        checked={chapter.selected}
                        onCheckedChange={(checked) => handleChapterToggle(chapter.id, checked as boolean)}
                      />
                      <Label htmlFor={chapter.id} className="font-medium">
                        {chapter.name}
                      </Label>
                      <Badge variant="outline" className="ml-2">
                        {chapter.sections.filter(s => s.selected).length}/{chapter.sections.length}
                      </Badge>
                    </div>
                    <div className="ml-6 grid grid-cols-1 md:grid-cols-2 gap-2">
                      {chapter.sections.map(section => (
                        <div key={section.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={section.id}
                            checked={section.selected}
                            onCheckedChange={(checked) => 
                              handleSectionToggle(chapter.id, section.id, checked as boolean)
                            }
                          />
                          <Label htmlFor={section.id} className="text-sm">
                            {section.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 导出选项 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                导出选项
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">导出格式</label>
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excel">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="h-4 w-4" />
                        Excel (.xlsx)
                      </div>
                    </SelectItem>
                    <SelectItem value="pdf">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        PDF (.pdf)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">时间范围</label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部时间</SelectItem>
                    <SelectItem value="current_semester">当前学期</SelectItem>
                    <SelectItem value="last_month">最近一个月</SelectItem>
                    <SelectItem value="custom">自定义时间</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-statistics"
                    checked={includeStatistics}
                    onCheckedChange={setIncludeStatistics}
                  />
                  <Label htmlFor="include-statistics">包含统计信息</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-charts"
                    checked={includeCharts}
                    onCheckedChange={setIncludeCharts}
                  />
                  <Label htmlFor="include-charts">包含图表分析</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 导出摘要 */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>导出摘要</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">选择班级：</span>
                <span className="font-medium">
                  {selectedClass_obj ? selectedClass_obj.name : '未选择'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">学生人数：</span>
                <span className="font-medium">
                  {selectedClass_obj ? selectedClass_obj.studentCount : 0}人
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">选择小节：</span>
                <span className="font-medium">{selectedSectionsCount}个</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">导出格式：</span>
                <span className="font-medium">
                  {exportFormat === 'excel' ? 'Excel' : 'PDF'}
                </span>
              </div>
            </CardContent>
          </Card>

          {statistics && statistics.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  统计预览
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {statistics.slice(0, 3).map((stat, index) => (
                    <div key={index} className="space-y-1">
                      <div className="text-sm font-medium">{stat.section}</div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>平均: {stat.average}</span>
                        <span>最高: {stat.highest}</span>
                        <span>最低: {stat.lowest}</span>
                      </div>
                    </div>
                  ))}
                  {statistics.length > 3 && (
                    <div className="text-xs text-muted-foreground text-center pt-2 border-t">
                      还有 {statistics.length - 3} 个小节...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>导出说明</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• 选择章节后将自动选择该章节下的所有小节</p>
              <p>• 可以手动取消选择不需要的小节</p>
              <p>• 导出文件将包含选定时间范围内的成绩</p>
              <p>• 统计信息包括平均分、最高分、最低分等</p>
              <p>• 图表分析需要选择Excel格式</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 数据预览 */}
      {showPreview && selectedSectionsCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>数据预览</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">学号</th>
                    <th className="text-left p-2">姓名</th>
                    {getSelectedSections().map(section => (
                      <th key={section.id} className="text-center p-2">{section.name}</th>
                    ))}
                    <th className="text-center p-2">平均分</th>
                  </tr>
                </thead>
                <tbody>
                  {mockStudents.slice(0, 5).map(student => {
                    const selectedSections = getSelectedSections();
                    const grades = selectedSections.map(section => student.grades[section.id] || 0);
                    const average = grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
                    
                    return (
                      <tr key={student.id} className="border-b">
                        <td className="p-2">{student.studentId}</td>
                        <td className="p-2">{student.name}</td>
                        {grades.map((grade, index) => (
                          <td key={index} className="text-center p-2">{grade}</td>
                        ))}
                        <td className="text-center p-2 font-medium">{average.toFixed(1)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {mockStudents.length > 5 && (
                <div className="text-center text-sm text-muted-foreground py-2">
                  显示前5名学生，实际导出将包含所有学生
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}