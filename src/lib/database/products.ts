// ContentCompass v2.0 - AI产品数据库操作
import { createServiceRoleClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';
import type { AIProduct, ProductUpdate, LatestUpdate, Database } from '@/types/database-v2';

// 创建公共客户端（不需要认证）
const createPublicClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  return createClient<Database>(supabaseUrl, supabaseKey);
};

// =================
// 获取产品列表
// =================

export async function getActiveProducts(): Promise<AIProduct[]> {
  try {
    const supabase = createPublicClient();
    
    const { data, error } = await supabase
      .from('ai_products')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    
    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Database connection error:', error);
    return [];
  }
}

export async function getFeaturedProducts(): Promise<AIProduct[]> {
  try {
    const supabase = createPublicClient();
    
    const { data, error } = await supabase
      .from('ai_products')
      .select('*')
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('display_order', { ascending: true });
    
    if (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Database connection error:', error);
    return [];
  }
}

// =================
// 获取产品详情
// =================

export async function getProductBySlug(slug: string): Promise<AIProduct | null> {
  try {
    const supabase = createPublicClient();
    
    const { data, error } = await supabase
      .from('ai_products')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();
    
    if (error) {
      console.error('Error fetching product:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Database connection error:', error);
    return null;
  }
}

// =================
// 获取产品更新记录
// =================

export async function getProductUpdates(
  productId: string,
  limit: number = 10
): Promise<ProductUpdate[]> {
  try {
    const supabase = createPublicClient();
    
    const { data, error } = await supabase
      .from('product_updates')
      .select('*')
      .eq('product_id', productId)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching product updates:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Database connection error:', error);
    return [];
  }
}

export async function getProductUpdatesBySlug(
  slug: string,
  limit: number = 10
): Promise<ProductUpdate[]> {
  try {
    const supabase = createPublicClient();
    
    // 先获取产品ID
    const { data: product } = await supabase
      .from('ai_products')
      .select('id')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();
    
    if (!product) {
      return [];
    }
    
    return getProductUpdates(product.id, limit);
  } catch (error) {
    console.error('Database connection error:', error);
    return [];
  }
}

// =================
// 获取最新更新信息
// =================

export async function getLatestUpdates(limit: number = 20): Promise<LatestUpdate[]> {
  try {
    const supabase = createPublicClient();
    
    const { data, error } = await supabase
      .from('latest_updates')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching latest updates:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Database connection error:', error);
    return [];
  }
}

// =================
// 获取首页数据（产品+最新更新）
// =================

export async function getHomePageData() {
  try {
    const [products, updates] = await Promise.all([
      getFeaturedProducts(),
      getLatestUpdates(8) // 首页显示8个最新更新
    ]);
    
    return {
      products,
      updates,
    };
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return {
      products: [],
      updates: [],
    };
  }
}

// =================
// 管理员功能（如果需要）
// =================

export async function createProduct(productData: Omit<AIProduct, 'id' | 'created_at' | 'updated_at'>): Promise<AIProduct | null> {
  try {
    const supabase = createServiceRoleClient();
    
    const { data, error } = await supabase
      .from('ai_products')
      .insert(productData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating product:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Database connection error:', error);
    return null;
  }
}

export async function createProductUpdate(updateData: Omit<ProductUpdate, 'id' | 'created_at' | 'updated_at'>): Promise<ProductUpdate | null> {
  try {
    const supabase = createServiceRoleClient();
    
    const { data, error } = await supabase
      .from('product_updates')
      .insert(updateData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating product update:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Database connection error:', error);
    return null;
  }
}