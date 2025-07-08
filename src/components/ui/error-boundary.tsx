// src/components/ui/error-boundary.tsx
'use client'

import { Component, ReactNode } from 'react'
import { Button } from './button'
import { Card, CardContent, CardHeader, CardTitle } from './card'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Card className="max-w-md mx-auto mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>出错了</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              很抱歉，页面遇到了一个错误。请尝试刷新页面或稍后再试。
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-xs bg-gray-50 p-3 rounded">
                <summary className="cursor-pointer font-medium">错误详情</summary>
                <pre className="mt-2 whitespace-pre-wrap">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <div className="flex space-x-2">
              <Button
                onClick={() => window.location.reload()}
                variant="default"
                size="sm"
              >
                刷新页面
              </Button>
              <Button
                onClick={() => this.setState({ hasError: false })}
                variant="outline"
                size="sm"
              >
                重试
              </Button>
            </div>
          </CardContent>
        </Card>
      )
    }

    return this.props.children
  }
}