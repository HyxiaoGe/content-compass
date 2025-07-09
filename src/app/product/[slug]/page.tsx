// ContentCompass v2.0 - 产品详情页（使用数据库数据）
import { notFound } from 'next/navigation'
import { getProductBySlug, getProductUpdatesBySlug } from '@/lib/database/products'
import { ProductDetailClient } from '@/components/front/product-detail-client'

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  
  // 从数据库获取产品信息和更新记录
  const [product, updates] = await Promise.all([
    getProductBySlug(slug),
    getProductUpdatesBySlug(slug, 20) // 获取最近20条更新
  ])
  
  // 如果产品不存在，返回404
  if (!product) {
    notFound()
  }
  
  return <ProductDetailClient product={product} updates={updates} />
}

// 生成静态参数（可选，用于构建时预生成页面）
export async function generateStaticParams() {
  // 可以从数据库获取所有产品slug，用于静态生成
  return [
    { slug: 'cursor' },
    { slug: 'claude' },
    { slug: 'github-copilot' },
    { slug: 'openai' },
    { slug: 'stability-ai' },
    { slug: 'qwen' },
    { slug: 'gemini' },
    { slug: 'deepseek' },
    { slug: 'claude-code' },
    { slug: 'midjourney' }
  ]
}