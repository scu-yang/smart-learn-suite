import React from 'react';
import { Button } from '@/components/ui/button';
import { showToast } from '@/lib/toast';
import { httpClient } from '@/lib/http-client';

const ToastTestPage: React.FC = () => {
  const testApiError = async () => {
    try {
      // 故意调用一个不存在的接口来测试错误处理
      await httpClient.get('/api/nonexistent');
    } catch (error) {
      console.log('API 错误已被处理并显示 toast');
    }
  };

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold mb-6">Toast 测试页面</h1>
      
      <div className="grid grid-cols-2 gap-4 max-w-md">
        <Button 
          variant="default"
          onClick={() => showToast.success({ 
            title: "操作成功", 
            description: "这是一个成功提示，3秒后自动消失" 
          })}
        >
          成功 Toast
        </Button>
        
        <Button 
          variant="destructive"
          onClick={() => showToast.error({ 
            title: "操作失败", 
            description: "这是一个错误提示，3秒后自动消失" 
          })}
        >
          错误 Toast
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => showToast.warning({ 
            title: "注意", 
            description: "这是一个警告提示，3秒后自动消失" 
          })}
        >
          警告 Toast
        </Button>
        
        <Button 
          variant="secondary"
          onClick={() => showToast.info({ 
            title: "提示信息", 
            description: "这是一个信息提示，3秒后自动消失" 
          })}
        >
          信息 Toast
        </Button>
      </div>
      
      <div className="mt-8">
        <Button 
          variant="destructive"
          onClick={testApiError}
          className="w-full max-w-md"
        >
          测试 API 错误提示
        </Button>
        <p className="text-sm text-gray-500 mt-2">
          点击此按钮将触发一个 API 错误，您应该会看到右下角弹出错误提示
        </p>
      </div>
    </div>
  );
};

export default ToastTestPage;
