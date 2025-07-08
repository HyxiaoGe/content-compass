// src/app/dashboard/layout.tsx
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'
import type { Database } from '@/types/database'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient<Database>({ cookies })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/auth/login')
  }

  // 获取用户资料
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  const user = {
    id: session.user.id,
    email: session.user.email,
    full_name: profile?.full_name || session.user.user_metadata?.full_name,
    avatar_url: profile?.avatar_url || session.user.user_metadata?.avatar_url,
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      <div className="flex">
        <aside className="hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Sidebar />
        </aside>
        <main className="flex-1 lg:ml-64">
          {children}
        </main>
      </div>
    </div>
  )
}