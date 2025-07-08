// src/app/auth/register/page.tsx
import { AuthForm } from '@/components/auth/auth-form'

export default function RegisterPage() {
  return <AuthForm mode="register" />
}

export const metadata = {
  title: '注册 - ContentCompass',
  description: '创建您的 ContentCompass 账户',
}