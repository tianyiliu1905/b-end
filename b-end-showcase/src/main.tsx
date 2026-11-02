import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tailwind.css'
import './styles/tokens.css'
import App from './App.tsx'

// 注意：MTD 组件层 CSS（index.css / theme-yellow.css）不在这里静态导入，
// 统一由 src/theme/useTheme.tsx 的 ThemeProvider 通过唯一 <link id="mtd-theme-css">
// 动态加载与切换，避免出现「静态蓝色样式 + 动态主题样式」两份 MTD CSS 同时存在、
// 导致黄→蓝切换时部分组件颜色不恢复的问题。

createRoot(document.getElementById('root')!).render(
  <App />,
)
