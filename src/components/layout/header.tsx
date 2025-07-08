// src/components/layout/header.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button'
import type { Database } from '@/types/database'

interface HeaderProps {
  user?: {
    id: string
    email?: string
    full_name?: string
    avatar_url?: string
  } | null
}

export function Header({ user }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href={user ? '/dashboard' : '/'} className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <span className="font-bold text-xl">ContentCompass</span>
        </Link>

        {/* 桌面导航 */}
        <nav className="hidden md:flex items-center space-x-6">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-foreground/60 hover:text-foreground transition-colors"
              >
                仪表板
              </Link>
              <Link
                href="/parse"
                className="text-foreground/60 hover:text-foreground transition-colors"
              >
                解析内容
              </Link>
              <Link
                href="/content"
                className="text-foreground/60 hover:text-foreground transition-colors"
              >
                我的内容
              </Link>
              <Link
                href="/settings"
                className="text-foreground/60 hover:text-foreground transition-colors"
              >
                设置
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/features"
                className="text-foreground/60 hover:text-foreground transition-colors"
              >
                功能特性
              </Link>
              <Link
                href="/pricing"
                className="text-foreground/60 hover:text-foreground transition-colors"
              >
                价格方案
              </Link>
              <Link
                href="/docs"
                className="text-foreground/60 hover:text-foreground transition-colors"
              >
                文档
              </Link>
            </>
          )}
        </nav>

        {/* 用户菜单 */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              {/* 用户头像和菜单 */}
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 rounded-lg p-2 hover:bg-accent transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.full_name || user.email || ''}
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <span className="text-white text-sm font-medium">
                        {(user.full_name || user.email || '?')[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                  <svg
                    className="h-4 w-4 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* 下拉菜单 */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-md border bg-popover p-1 shadow-lg">
                    <div className="px-3 py-2 border-b">
                      <p className="text-sm font-medium">{user.full_name || '用户'}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/settings"
                        className="flex items-center px-3 py-2 text-sm hover:bg-accent rounded-sm"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        设置
                      </Link>
                      <Link
                        href="/billing"
                        className="flex items-center px-3 py-2 text-sm hover:bg-accent rounded-sm"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        账单
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex w-full items-center px-3 py-2 text-sm hover:bg-accent rounded-sm text-left"
                      >
                        退出登录
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">登录</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">注册</Link>
              </Button>
            </div>
          )}

          {/* 移动端菜单按钮 */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* 移动端导航 */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container py-4 space-y-2">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 text-sm hover:bg-accent rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  仪表板
                </Link>
                <Link
                  href="/parse"
                  className="block px-4 py-2 text-sm hover:bg-accent rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  解析内容
                </Link>
                <Link
                  href="/content"
                  className="block px-4 py-2 text-sm hover:bg-accent rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  我的内容
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-sm hover:bg-accent rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  设置
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/features"
                  className="block px-4 py-2 text-sm hover:bg-accent rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  功能特性
                </Link>
                <Link
                  href="/pricing"
                  className="block px-4 py-2 text-sm hover:bg-accent rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  价格方案
                </Link>
                <Link
                  href="/docs"
                  className="block px-4 py-2 text-sm hover:bg-accent rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  文档
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}