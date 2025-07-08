// src/components/ui/error-message.tsx
import { Button } from './button'
import { Card, CardContent } from './card'
import { cn } from '@/lib/utils'

interface ErrorMessageProps {
  title?: string
  message: string
  details?: string
  onRetry?: () => void
  onDismiss?: () => void
  variant?: 'default' | 'destructive' | 'warning'
  className?: string
}

export function ErrorMessage({
  title = '出错了',
  message,
  details,
  onRetry,
  onDismiss,
  variant = 'destructive',
  className
}: ErrorMessageProps) {
  const variantStyles = {
    default: 'border-gray-200 bg-gray-50',
    destructive: 'border-red-200 bg-red-50',
    warning: 'border-yellow-200 bg-yellow-50'
  }

  const iconStyles = {
    default: 'text-gray-500',
    destructive: 'text-red-500',
    warning: 'text-yellow-500'
  }

  const textStyles = {
    default: 'text-gray-800',
    destructive: 'text-red-800',
    warning: 'text-yellow-800'
  }

  const Icon = () => {
    if (variant === 'warning') {
      return (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      )
    }

    return (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }

  return (
    <Card className={cn(variantStyles[variant], className)}>
      <CardContent className="pt-6">
        <div className="flex items-start space-x-3">
          <div className={cn('flex-shrink-0', iconStyles[variant])}>
            <Icon />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={cn('text-sm font-medium', textStyles[variant])}>
              {title}
            </h3>
            <div className={cn('mt-1 text-sm', textStyles[variant])}>
              {message}
            </div>
            
            {details && (
              <details className="mt-2">
                <summary className={cn('cursor-pointer text-xs font-medium', textStyles[variant])}>
                  详细信息
                </summary>
                <div className={cn('mt-1 text-xs', textStyles[variant])}>
                  {details}
                </div>
              </details>
            )}
            
            {(onRetry || onDismiss) && (
              <div className="mt-4 flex space-x-2">
                {onRetry && (
                  <Button
                    onClick={onRetry}
                    size="sm"
                    variant={variant === 'destructive' ? 'destructive' : 'default'}
                  >
                    重试
                  </Button>
                )}
                {onDismiss && (
                  <Button
                    onClick={onDismiss}
                    size="sm"
                    variant="outline"
                  >
                    关闭
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}