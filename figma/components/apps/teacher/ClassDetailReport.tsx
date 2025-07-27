import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Input } from '../../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { AdvancedFilterPanel, FilterState, Chapter, Section } from './components/AdvancedFilterPanel';
import { AssignmentType } from './components/AssignmentTypeSelector';
import { 
  ArrowLeft,
  Download,
  RefreshCw,
  Search,
  SortAsc,
  SortDesc,
  Users,
  BarChart3,
  Target,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  studentId: string;
  avatar?: string;
  scores: {
    [key: string]: {
      homework?: number[];
      exam?: number[];
      average?: number;
    };
  };
  totalAverage: number;
  completionRate: number;
}

type SortField = 'name' | 'studentId' | 'totalAverage' | 'completionRate' | string;
type SortOrder = 'asc' | 'desc';

const mockChapters: Chapter[] = [
  {
    id: 'ch1',
    name: '第1章 函数与极限',
    sections: [
      { id: 'ch1s1', name: '1.1 函数', homeworkCount: 3, examCount: 1 },
      { id: 'ch1s2', name: '1.2 极限', homeworkCount: 4, examCount: 1 },
      { id: 'ch1s3', name: '1.3 连续性', homeworkCount: 2, examCount: 1 }
    ]
  },
  {
    id: 'ch2',
    name: '第2章 导数与微分',
    sections: [
      { id: 'ch2s1', name: '2.1 导数定义', homeworkCount: 3, examCount: 1 },
      { id: 'ch2s2', name: '2.2 求导法则', homeworkCount: 5, examCount: 2 },
      { id: 'ch2s3', name: '2.3 微分', homeworkCount: 2, examCount: 1 }
    ]
  },
  {
    id: 'ch3',
    name: '第3章 积分学',
    sections: [
      { id: 'ch3s1', name: '3.1 不定积分', homeworkCount: 4, examCount: 1 },
      { id: 'ch3s2', name: '3.2 定积分', homeworkCount: 5, examCount: 2 },
      { id: 'ch3s3', name: '3.3 积分应用', homeworkCount: 3, examCount: 1 }
    ]
  }
];

const mockStudents: Student[] = [
  {
    id: 'stu001',
    name: '张小明',
    studentId: '2023001',
    scores: {
      'ch1s1': { homework: [85, 90, 88], exam: [87], average: 87.5 },
      'ch1s2': { homework: [82, 86, 90, 84], exam: [85], average: 85.4 },
      'ch1s3': { homework: [88, 92], exam: [90], average: 90 },
      'ch2s1': { homework: [75, 80, 85], exam: [78], average: 79.5 },
      'ch2s2': { homework: [70, 75, 80, 82, 78], exam: [76, 80], average: 77.3 },
      'ch2s3': { homework: [85, 88], exam: [86], average: 86.3 }
    },
    totalAverage: 84.3,
    completionRate: 95
  },
  {
    id: 'stu002',
    name: '李小红',
    studentId: '2023002',
    scores: {
      'ch1s1': { homework: [90, 95, 92], exam: [93], average: 92.5 },
      'ch1s2': { homework: [88, 90, 92, 89], exam: [90], average: 89.8 },
      'ch1s3': { homework: [85, 90], exam: [88], average: 87.7 },
      'ch2s1': { homework: [88, 92, 90], exam: [90], average: 90 },
      'ch2s2': { homework: [85, 88, 90, 92, 87], exam: [88, 90], average: 88.6 },
      'ch2s3': { homework: [92, 95], exam: [93], average: 93.3 }
    },
    totalAverage: 90.3,
    completionRate: 100
  },
  {
    id: 'stu003',
    name: '王小强',
    studentId: '2023003',
    scores: {
      'ch1s1': { homework: [78, 82, 80], exam: [79], average: 79.8 },
      'ch1s2': { homework: [75, 78, 82, 80], exam: [78], average: 78.6 },
      'ch1s3': { homework: [80, 85], exam: [82], average: 82.3 },
      'ch2s1': { homework: [70, 75, 78], exam: [72], average: 73.8 },
      'ch2s2': { homework: [68, 72, 75, 78, 70], exam: [70, 74], average: 72.4 },
      'ch2s3': { homework: [75, 80], exam: [77], average: 77.3 }
    },
    totalAverage: 77.4,
    completionRate: 88
  },
  {
    id: 'stu004',
    name: '陈小美',
    studentId: '2023004',
    scores: {
      'ch1s1': { homework: [92, 95, 90], exam: [92], average: 92.3 },
      'ch1s2': { homework: [90, 92, 95, 88], exam: [91], average: 91.2 },
      'ch1s3': { homework: [88, 92], exam: [90], average: 90 },
      'ch2s1': { homework: [85, 88, 90], exam: [87], average: 87.5 },
      'ch2s2': { homework: [82, 85, 88, 90, 85], exam: [85, 88], average: 86.1 },
      'ch2s3': { homework: [90, 93], exam: [91], average: 91.3 }
    },
    totalAverage: 89.7,
    completionRate: 98
  },
  {
    id: 'stu005',
    name: '刘小伟',
    studentId: '2023005',
    scores: {
      'ch1s1': { homework: [65, 70, 68], exam: [67], average: 67.5 },
      'ch1s2': { homework: [62, 68, 70, 65], exam: [66], average: 66.2 },
      'ch1s3': { homework: [70, 75], exam: [72], average: 72.3 },
      'ch2s1': { homework: [60, 65, 68], exam: [63], average: 64 },
      'ch2s2': { homework: [58, 62, 65, 68, 60], exam: [60, 65], average: 62.6 },
      'ch2s3': { homework: [68, 72], exam: [70], average: 70 }
    },
    totalAverage: 67.1,
    completionRate: 85
  }
];

const classData = {
  'class-01': { name: '高等数学A-01班', students: 45 },
  'class-02': { name: '高等数学A-02班', students: 42 },
  'class-03': { name: '高等数学A-03班', students: 38 }
};

export function ClassDetailReport() {
  const { classId } = useParams<{ classId: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('totalAverage');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  
  // 筛选状态
  const [filterState, setFilterState] = useState<FilterState>({
    selectedChapters: [],
    selectedSections: [],
    selectedTypes: ['all']
  });

  const currentClass = classId ? classData[classId as keyof typeof classData] : null;

  // 计算显示的列
  const displayColumns = useMemo(() => {
    const { selectedSections, selectedTypes } = filterState;
    
    // 基础列
    const baseColumns = ['name', 'studentId'];
    
    // 根据筛选条件决定显示的分数列
    if (selectedSections.length > 0) {
      // 如果选择了具体章节，显示这些章节的成绩
      return [...baseColumns, ...selectedSections, 'completionRate'];
    } else {
      // 如果没有选择具体章节，显示总平均分
      return [...baseColumns, 'totalAverage', 'completionRate'];
    }
  }, [filterState]);

  // 筛选和排序学生数据
  const filteredAndSortedStudents = useMemo(() => {
    let filtered = mockStudents.filter(student => {
      // 搜索筛选
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.studentId.includes(searchTerm);
      
      return matchesSearch;
    });

    // 排序
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      if (sortField === 'name') {
        aValue = a.name;
        bValue = b.name;
      } else if (sortField === 'studentId') {
        aValue = a.studentId;
        bValue = b.studentId;
      } else if (sortField === 'totalAverage') {
        aValue = a.totalAverage;
        bValue = b.totalAverage;
      } else if (sortField === 'completionRate') {
        aValue = a.completionRate;
        bValue = b.completionRate;
      } else if (sortField.startsWith('ch')) {
        // 按特定章节/节排序
        aValue = a.scores[sortField]?.average || 0;
        bValue = b.scores[sortField]?.average || 0;
      } else {
        aValue = a.totalAverage;
        bValue = b.totalAverage;
      }

      if (typeof aValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
    });

    return filtered;
  }, [mockStudents, searchTerm, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />;
  };

  const getScoreForDisplay = (student: Student, sectionId: string) => {
    const sectionScore = student.scores[sectionId];
    if (!sectionScore) return '-';

    const { selectedTypes } = filterState;

    if (selectedTypes.includes('homework') && !selectedTypes.includes('exam') && !selectedTypes.includes('all')) {
      // 仅显示作业成绩
      const homeworkAvg = sectionScore.homework 
        ? sectionScore.homework.reduce((a, b) => a + b, 0) / sectionScore.homework.length
        : 0;
      return homeworkAvg.toFixed(1);
    } else if (selectedTypes.includes('exam') && !selectedTypes.includes('homework') && !selectedTypes.includes('all')) {
      // 仅显示考试成绩
      const examAvg = sectionScore.exam 
        ? sectionScore.exam.reduce((a, b) => a + b, 0) / sectionScore.exam.length
        : 0;
      return examAvg.toFixed(1);
    } else {
      // 显示综合成绩
      return sectionScore.average?.toFixed(1) || '-';
    }
  };

  const getColumnName = (columnId: string) => {
    if (columnId === 'name') return '姓名';
    if (columnId === 'studentId') return '学号';
    if (columnId === 'totalAverage') return '总平均分';
    if (columnId === 'completionRate') return '完成率';
    
    // 查找章节名称
    for (const chapter of mockChapters) {
      const section = chapter.sections.find(s => s.id === columnId);
      if (section) {
        return section.name;
      }
    }
    return columnId;
  };

  if (!currentClass) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <h2>班级不存在</h2>
          <p className="text-muted-foreground">请选择有效的班级</p>
          <Link to="/analytics">
            <Button className="mt-4">返回学情报告</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/analytics">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1>{currentClass.name} - 学生成绩详情</h1>
            <p className="text-muted-foreground">班级学生成绩多维度分析</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            刷新
          </Button>
          <Button className="gap-2">
            <Download className="w-4 h-4" />
            导出成绩
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">学生总数</p>
                <p className="text-2xl font-bold">{mockStudents.length}</p>
              </div>
              <div className="w-12 h-12 bg-chart-1/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-chart-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">班级平均分</p>
                <p className="text-2xl font-bold">
                  {(mockStudents.reduce((sum, s) => sum + s.totalAverage, 0) / mockStudents.length).toFixed(1)}
                </p>
              </div>
              <div className="w-12 h-12 bg-chart-2/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-chart-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">平均完成率</p>
                <p className="text-2xl font-bold">
                  {(mockStudents.reduce((sum, s) => sum + s.completionRate, 0) / mockStudents.length).toFixed(0)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-chart-3/10 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-chart-3" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">优秀率(≥85分)</p>
                <p className="text-2xl font-bold">
                  {Math.round((mockStudents.filter(s => s.totalAverage >= 85).length / mockStudents.length) * 100)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-chart-4/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-chart-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="搜索学生姓名或学号..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filter Panel */}
      <AdvancedFilterPanel
        chapters={mockChapters}
        filterState={filterState}
        onFilterChange={setFilterState}
      />

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>学生成绩列表</CardTitle>
          <CardDescription>
            显示 {filteredAndSortedStudents.length} 名学生
            {filterState.selectedSections.length > 0 && ` | 已选择 ${filterState.selectedSections.length} 个小节`}
            {!filterState.selectedTypes.includes('all') && ` | 成绩类型: ${filterState.selectedTypes.map(t => t === 'homework' ? '作业' : '考试').join('、')}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {displayColumns.map((column) => (
                    <TableHead 
                      key={column}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort(column)}
                    >
                      <div className="flex items-center gap-2">
                        {getColumnName(column)}
                        {getSortIcon(column)}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedStudents.map((student) => (
                  <TableRow key={student.id}>
                    {displayColumns.map((column) => (
                      <TableCell key={column}>
                        {column === 'name' && (
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              {student.name[0]}
                            </div>
                            {student.name}
                          </div>
                        )}
                        {column === 'studentId' && student.studentId}
                        {column === 'totalAverage' && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{student.totalAverage.toFixed(1)}</span>
                            <Badge variant={
                              student.totalAverage >= 90 ? 'default' :
                              student.totalAverage >= 80 ? 'secondary' :
                              student.totalAverage >= 70 ? 'outline' : 'destructive'
                            }>
                              {student.totalAverage >= 90 ? '优秀' :
                               student.totalAverage >= 80 ? '良好' :
                               student.totalAverage >= 70 ? '中等' : '待提高'}
                            </Badge>
                          </div>
                        )}
                        {column === 'completionRate' && (
                          <div className="flex items-center gap-2">
                            <Progress value={student.completionRate} className="w-16 h-2" />
                            <span className="text-sm">{student.completionRate}%</span>
                          </div>
                        )}
                        {column.startsWith('ch') && (
                          <div className="text-center">
                            <span className="font-medium">{getScoreForDisplay(student, column)}</span>
                          </div>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}