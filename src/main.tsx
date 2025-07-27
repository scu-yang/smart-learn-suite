import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// 在开发环境中加载测试工具
if (import.meta.env.DEV) {
  import('@/lib/logout-test');
  import('@/lib/api-test');
  import('@/lib/api-examples');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
