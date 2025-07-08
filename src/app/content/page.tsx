// src/app/content/page.tsx
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { ContentList } from '@/components/content/content-list'
import type { Database } from '@/types/database'

async function getContent(userId: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/content?limit=10&sort=created_at&order=desc`, {
      cache: 'no-store',
      headers: {
        'Cookie': cookies().toString(),
      },
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch content')
    }
    
    const data = await response.json()
    return data.success ? data : null
  } catch (error) {
    console.error('Error fetching content:', error)
    return null
  }
}

export default async function ContentPage() {
  const supabase = createServerComponentClient<Database>({ cookies })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/auth/login')
  }

  const initialData = await getContent(session.user.id)

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">我的内容</h1>
          <p className="text-muted-foreground">
            管理和查看您解析的所有网页内容
          </p>
        </div>
      </div>

      {/* 内容列表 */}
      <ContentList initialData={initialData} />
    </div>
  )
}

export const metadata = {
  title: '我的内容 - ContentCompass',
  description: '管理和查看您解析的所有网页内容',
}