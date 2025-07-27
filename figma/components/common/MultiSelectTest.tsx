import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { MathRenderer } from './MathRenderer';

interface TestQuestion {
  id: string;
  title: string;
  content: string;
  options: string[];
}

const testQuestion: TestQuestion = {
  id: 'test1',
  title: '多选题测试',
  content: '下列关于数学的说法正确的是：（可选择多个选项）',
  options: [
    '数学是科学的基础',
    '微积分是牛顿发明的',
    '$\\pi$ 是无理数',
    '$e \\approx 2.718$',
    '质数有无穷多个'
  ]
};

export function MultiSelectTest() {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleOptionChange = (index: number, checked: boolean) => {
    const indexStr = index.toString();
    const newSelection = checked 
      ? [...selectedOptions, indexStr]
      : selectedOptions.filter(opt => opt !== indexStr);
    
    setSelectedOptions(newSelection);
    console.log('Selected options:', newSelection);
  };

  const resetSelection = () => {
    console.log('Resetting selection');
    setSelectedOptions([]);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>{testQuestion.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-muted/30 rounded-lg">
            <MathRenderer content={testQuestion.content} />
          </div>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-2">
              请选择正确答案（可选择多个选项）
            </p>
            {testQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`test-${index}`}
                  checked={selectedOptions.includes(index.toString())}
                  onCheckedChange={(checked) => {
                    console.log(`Option ${index} (${option}): ${checked}`);
                    handleOptionChange(index, checked === true);
                  }}
                />
                <Label htmlFor={`test-${index}`} className="flex-1 cursor-pointer">
                  {String.fromCharCode(65 + index)}. <MathRenderer content={option} />
                </Label>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-4 border-t">
            <div className="text-sm">
              <strong>当前选择：</strong>
              {selectedOptions.length === 0 ? (
                <span className="text-muted-foreground">未选择任何选项</span>
              ) : (
                <span>
                  {selectedOptions.map(opt => String.fromCharCode(65 + parseInt(opt))).join(', ')}
                </span>
              )}
            </div>
            
            <div className="text-xs text-muted-foreground">
              <strong>内部值：</strong> [{selectedOptions.join(', ')}]
            </div>
            
            <Button variant="outline" onClick={resetSelection}>
              重置选择
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}