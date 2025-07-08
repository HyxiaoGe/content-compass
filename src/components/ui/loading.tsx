// src/components/ui/loading.tsx
import { Spinner } from './spinner'
import { cn } from '@/lib/utils'

interface LoadingProps {
  className?: string
  text?: string
  variant?: 'page' | 'card' | 'inline'
  size?: 'sm' | 'md' | 'lg'
}

export function Loading({ 
  className, 
  text = '加载中...', 
  variant = 'page',
  size = 'md' 
}: LoadingProps) {
  if (variant === 'page') {
    return (
      <div className={cn('flex items-center justify-center min-h-[400px]', className)}>
        <div className="text-center space-y-4">
          <Spinner size={size} className="mx-auto text-blue-600" />
          <p className="text-muted-foreground">{text}</p>
        </div>
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div className={cn('flex items-center justify-center p-8', className)}>
        <div className="text-center space-y-3">
          <Spinner size={size} className="mx-auto text-blue-600" />
          <p className="text-sm text-muted-foreground">{text}</p>
        </div>
      </div>
    )
  }

  // inline variant
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Spinner size={size} />
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  )
}