// 权限管理系统 - 基于邮箱白名单的管理员验证

import { createServerComponentClient, createRouteHandlerClient } from '@/lib/supabase/server'
import { User } from '@/types/database-refactor'

// 默认管理员邮箱白名单
const DEFAULT_ADMIN_EMAILS = [
  'admin@contentcompass.dev',
  // 可以通过环境变量添加更多管理员邮箱
]

// 从环境变量获取额外的管理员邮箱
function getAdminEmailsFromEnv(): string[] {
  const envEmails = process.env.ADMIN_EMAILS
  if (!envEmails) return []
  
  try {
    return JSON.parse(envEmails)
  } catch {
    // 如果是逗号分隔的字符串
    return envEmails.split(',').map(email => email.trim()).filter(Boolean)
  }
}

// 获取完整的管理员邮箱列表
export function getAdminEmails(): string[] {
  const envEmails = getAdminEmailsFromEnv()
  return [...DEFAULT_ADMIN_EMAILS, ...envEmails]
}

// 检查邮箱是否为管理员
export function isAdminEmail(email: string): boolean {
  const adminEmails = getAdminEmails()
  return adminEmails.includes(email.toLowerCase())
}

// 从数据库获取管理员邮箱列表（动态配置）
export async function getAdminEmailsFromDB(): Promise<string[]> {
  try {
    const supabase = await createRouteHandlerClient()
    const { data, error } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', 'admin_emails')
      .single()

    if (error || !data) {
      return getAdminEmails() // 回退到环境变量配置
    }

    const dbEmails = Array.isArray(data.value) ? data.value : []
    return [...getAdminEmails(), ...dbEmails]
  } catch {
    return getAdminEmails()
  }
}

// 更新数据库中的管理员邮箱列表
export async function updateAdminEmailsInDB(emails: string[]): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createRouteHandlerClient()
    const { error } = await supabase
      .from('system_settings')
      .upsert({
        key: 'admin_emails',
        value: emails,
        description: '管理员邮箱白名单',
        updated_at: new Date().toISOString()
      })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '更新失败' 
    }
  }
}

// 获取当前用户信息（服务器组件使用）
export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = await createServerComponentClient()
    const { data: { session }, error: authError } = await supabase.auth.getSession()

    if (authError || !session?.user) {
      return null
    }

    // 从数据库获取用户详细信息
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (profileError) {
      // 如果用户不存在，创建用户记录
      if (profileError.code === 'PGRST116') {
        const isAdmin = isAdminEmail(session.user.email || '')
        
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            id: session.user.id,
            email: session.user.email!,
            role: isAdmin ? 'admin' : 'user',
            full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
            avatar_url: session.user.user_metadata?.avatar_url
          })
          .select()
          .single()

        if (createError) {
          console.error('Error creating user:', createError)
          return null
        }

        return newUser
      }
      
      console.error('Error fetching user profile:', profileError)
      return null
    }

    return userProfile
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// 获取当前用户信息（API路由使用）
export async function getCurrentUserFromRequest(): Promise<User | null> {
  try {
    const supabase = await createRouteHandlerClient()
    const { data: { session }, error: authError } = await supabase.auth.getSession()

    if (authError || !session?.user) {
      return null
    }

    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (profileError) {
      return null
    }

    return userProfile
  } catch (error) {
    console.error('Error getting current user from request:', error)
    return null
  }
}

// 检查当前用户是否为管理员
export async function isCurrentUserAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.role === 'admin' || false
}

// 检查当前用户是否为管理员（API路由使用）
export async function isCurrentUserAdminFromRequest(): Promise<boolean> {
  const user = await getCurrentUserFromRequest()
  return user?.role === 'admin' || false
}

// 权限验证中间件
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Authentication required')
  }
  return user
}

// 管理员权限验证中间件
export async function requireAdmin(): Promise<User> {
  const user = await requireAuth()
  if (user.role !== 'admin') {
    throw new Error('Admin privileges required')
  }
  return user
}

// API路由权限验证中间件
export async function requireAuthFromRequest(): Promise<User> {
  const user = await getCurrentUserFromRequest()
  if (!user) {
    throw new Error('Authentication required')
  }
  return user
}

// API路由管理员权限验证中间件
export async function requireAdminFromRequest(): Promise<User> {
  const user = await requireAuthFromRequest()
  if (user.role !== 'admin') {
    throw new Error('Admin privileges required')
  }
  return user
}

// 检查用户是否有权限访问特定资源
export function canAccessResource(user: User | null, resourceOwnerId?: string): boolean {
  if (!user) return false
  if (user.role === 'admin') return true
  if (resourceOwnerId && user.id === resourceOwnerId) return true
  return false
}

// 权限错误处理
export class PermissionError extends Error {
  constructor(
    message: string,
    public code: 'UNAUTHORIZED' | 'FORBIDDEN' | 'ADMIN_REQUIRED' = 'FORBIDDEN'
  ) {
    super(message)
    this.name = 'PermissionError'
  }
}

// 权限检查装饰器工厂
export function withPermission(requiredRole: 'user' | 'admin' = 'user') {
  return function (handler: Function) {
    return async function (...args: any[]) {
      try {
        const user = requiredRole === 'admin' 
          ? await requireAdminFromRequest()
          : await requireAuthFromRequest()
        
        return handler(...args, user)
      } catch (error) {
        if (error instanceof Error && error.message.includes('Authentication required')) {
          throw new PermissionError('Authentication required', 'UNAUTHORIZED')
        }
        if (error instanceof Error && error.message.includes('Admin privileges required')) {
          throw new PermissionError('Admin privileges required', 'ADMIN_REQUIRED')
        }
        throw error
      }
    }
  }
}

// 用户角色更新
export async function updateUserRole(userId: string, newRole: 'user' | 'admin'): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createRouteHandlerClient()
    
    // 验证当前用户是否为管理员
    await requireAdminFromRequest()
    
    const { error } = await supabase
      .from('users')
      .update({ 
        role: newRole,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '更新用户角色失败' 
    }
  }
}