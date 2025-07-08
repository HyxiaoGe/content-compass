// src/app/page.tsx
import { createServerComponentClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/header'
import { AnimatedBackground } from '@/components/landing/animated-background'
import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { WorkflowSection } from '@/components/landing/workflow-section'
import { CTASection } from '@/components/landing/cta-section'
import { FooterSection } from '@/components/landing/footer-section'
import type { Database } from '@/types/database'

export default async function HomePage() {
  const supabase = await createServerComponentClient()
  const { data: { session } } = await supabase.auth.getSession()

  // 获取用户资料
  let user = null
  if (session) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    user = {
      id: session.user.id,
      email: session.user.email,
      full_name: profile?.full_name || session.user.user_metadata?.full_name,
      avatar_url: profile?.avatar_url || session.user.user_metadata?.avatar_url,
    }
  }

  const isAuthenticated = !!session

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* 动态背景 */}
      <AnimatedBackground />
      
      {/* 导航栏 */}
      <div className="relative z-50">
        <Header user={user} />
      </div>
      
      {/* 主要内容 */}
      <main className="relative z-10">
        {/* Hero 区域 */}
        <HeroSection isAuthenticated={isAuthenticated} />
        
        {/* 功能特性 */}
        <FeaturesSection />
        
        {/* 工作流程 */}
        <WorkflowSection />
        
        {/* CTA 区域 */}
        <CTASection isAuthenticated={isAuthenticated} />
      </main>
      
      {/* Footer */}
      <FooterSection />
    </div>
  )
}

export const metadata = {
  title: 'ContentCompass - 智能网页内容解析平台',
  description: '使用先进的AI技术将网页内容转化为结构化摘要，提供多种摘要格式和导出选项，让信息获取变得更加高效和智能。',
  keywords: 'AI内容解析,网页摘要,智能提取,内容分析,GPT-4,自动摘要',
  openGraph: {
    title: 'ContentCompass - 智能网页内容解析平台',
    description: '使用AI技术将网页内容转化为结构化摘要，提高信息获取效率',
    type: 'website',
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ContentCompass - 智能网页内容解析平台',
    description: '使用AI技术将网页内容转化为结构化摘要，提高信息获取效率',
  },
}