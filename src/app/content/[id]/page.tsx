// src/app/content/[id]/page.tsx
import { notFound, redirect } from 'next/navigation'
import { createServerComponentClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers'
import { ContentDetail } from '@/components/content/content-detail'
import type { Database } from '@/types/database'

async function getContentById(id: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/content/${id}`, {
      cache: 'no-store',
      headers: {
        'Cookie': cookies().toString(),
      },
    })
    
    if (response.status === 404) {
      return null
    }
    
    if (!response.ok) {
      throw new Error('Failed to fetch content')
    }
    
    const data = await response.json()
    return data.success ? data.data : null
  } catch (error) {
    console.error('Error fetching content:', error)
    return null
  }
}

export default async function ContentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const supabase = await createServerComponentClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/auth/login')
  }

  const content = await getContentById(id)

  if (!content) {
    notFound()
  }

  return (
    <div className="flex-1 p-6">
      <ContentDetail content={content} />
    </div>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const content = await getContentById(id)

  if (!content) {
    return {
      title: '内容不存在 - ContentCompass',
    }
  }

  return {
    title: `${content.title || '无标题'} - ContentCompass`,
    description: content.summary?.substring(0, 160) || '查看详细的内容分析和AI摘要',
  }
}