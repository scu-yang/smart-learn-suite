import React from 'react';
import { Label } from '../ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { BookOpen } from 'lucide-react';

interface Course {
  id: string;
  name: string;
  code: string;
  semester: string;
  year: number;
}

interface CourseSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  className?: string;
}

// Mock courses data - in real app this would come from API
const mockCourses: Course[] = [
  { id: 'course-1', name: '高等数学A', code: 'MATH101A', semester: '秋季', year: 2024 },
  { id: 'course-2', name: '高等数学B', code: 'MATH101B', semester: '秋季', year: 2024 },
  { id: 'course-3', name: '线性代数', code: 'MATH201', semester: '春季', year: 2024 },
  { id: 'course-4', name: '概率论与数理统计', code: 'MATH301', semester: '秋季', year: 2024 },
  { id: 'course-5', name: '数学分析', code: 'MATH401', semester: '春季', year: 2024 },
  { id: 'course-6', name: '复变函数', code: 'MATH402', semester: '秋季', year: 2024 }
];

export function CourseSelector({
  value,
  onValueChange,
  placeholder = "请选择课程",
  label = "所属课程",
  required = false,
  className = ''
}: CourseSelectorProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="flex items-center gap-2">
        <BookOpen className="w-4 h-4" />
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {mockCourses.map(course => (
            <SelectItem key={course.id} value={course.id}>
              <div className="flex flex-col">
                <span className="font-medium">{course.name}</span>
                <span className="text-xs text-muted-foreground">
                  {course.code} · {course.year}年{course.semester}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export { type Course };
export default CourseSelector;