// src/app/auth/login/page.tsx
import { AuthForm } from '@/components/auth/auth-form'

export default function LoginPage() {
  return <AuthForm mode="login" />
}

export const metadata = {
  title: '登录 - ContentCompass',
  description: '登录到您的 ContentCompass 账户',
}