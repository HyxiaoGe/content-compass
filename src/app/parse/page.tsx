// src/app/parse/page.tsx
import { ParseForm } from '@/components/parse/parse-form'

export default function ParsePage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      {/* 页面头部 */}
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">解析网页内容</h1>
        <p className="text-lg text-muted-foreground">
          输入任意网页URL，获取清晰结构化的内容摘要
        </p>
      </div>

      {/* 解析表单 */}
      <ParseForm />

      {/* 功能说明 */}
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center space-y-2">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-medium">智能提取</h3>
            <p className="text-sm text-muted-foreground">
              自动识别并提取网页核心内容，过滤广告和无关信息
            </p>
          </div>
          
          <div className="text-center space-y-2">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="font-medium">AI摘要</h3>
            <p className="text-sm text-muted-foreground">
              使用先进的GPT模型生成高质量摘要和关键要点
            </p>
          </div>
          
          <div className="text-center space-y-2">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
              <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h4a2 2 0 002-2V9a2 2 0 00-2-2H7a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-medium">多种格式</h3>
            <p className="text-sm text-muted-foreground">
              支持多种摘要类型和输出格式，满足不同需求
            </p>
          </div>
        </div>

        {/* 支持的网站类型 */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-medium mb-3">支持的内容类型</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>新闻文章</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>博客文章</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>学术论文</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>技术文档</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>产品页面</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>研究报告</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>维基百科</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>更多...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: '解析内容 - ContentCompass',
  description: '输入网页URL，获取AI生成的内容摘要',
}