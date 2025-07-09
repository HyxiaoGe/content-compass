// ContentCompass v2.0 - 主页（使用数据库数据）
import { getHomePageData } from '@/lib/database/products'
import { HomePageClient } from '@/components/front/home-page-client'

export default async function HomePage() {
  // 从数据库获取数据
  const { products, updates } = await getHomePageData()
  
  return <HomePageClient products={products} updates={updates} />
}