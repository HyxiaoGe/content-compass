'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Sparkles, Activity, Cpu, Brain, Zap } from 'lucide-react'

export function HolographicHeader() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = 400

    // 网格线动画
    const drawGrid = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // 设置网格样式
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)'
      ctx.lineWidth = 1
      
      const gridSize = 50
      const offsetX = (time * 20) % gridSize
      const offsetY = (time * 15) % gridSize
      
      // 绘制垂直线
      for (let x = -gridSize + offsetX; x < canvas.width + gridSize; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      
      // 绘制水平线
      for (let y = -gridSize + offsetY; y < canvas.height + gridSize; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }
      
      // 扫描线效果
      const scanlineY = (time * 100) % (canvas.height + 100)
      const gradient = ctx.createLinearGradient(0, scanlineY - 50, 0, scanlineY + 50)
      gradient.addColorStop(0, 'rgba(0, 255, 255, 0)')
      gradient.addColorStop(0.5, 'rgba(0, 255, 255, 0.8)')
      gradient.addColorStop(1, 'rgba(0, 255, 255, 0)')
      
      ctx.fillStyle = gradient
      ctx.fillRect(0, scanlineY - 2, canvas.width, 4)
    }

    let animationId: number
    let startTime = Date.now()

    const animate = () => {
      const time = (Date.now() - startTime) / 1000
      drawGrid(time)
      animationId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = 400
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className="relative overflow-hidden mb-20">
      {/* 全息网格背景 */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-40"
      />
      
      {/* 渐变遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/20 to-gray-900/80" />
      
      {/* 主标题内容 */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-20">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, type: "spring" }}
        >
          <div className="relative">
            {/* 主Logo */}
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-cyan-400 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-cyan-500/50 mb-6">
              <TrendingUp className="w-12 h-12 text-white" />
              
              {/* 环绕粒子 */}
              <div className="absolute inset-0">
                {Array.from({ length: 8 }).map((_, i) => {
                  const angle = (i / 8) * Math.PI * 2
                  const radius = 50
                  const x = Math.cos(angle) * radius
                  const y = Math.sin(angle) * radius
                  
                  return (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-cyan-400 rounded-full"
                      style={{
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                      }}
                      animate={{
                        rotate: 360,
                        scale: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "linear"
                      }}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.h1
          className="text-6xl md:text-8xl font-bold mb-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Content
          </span>
          <span className="text-white">Compass</span>
        </motion.h1>

        <motion.div
          className="flex items-center space-x-2 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
          <span className="text-xl text-gray-300 font-medium">AI产品更新聚合站</span>
          <Activity className="w-5 h-5 text-purple-400 animate-pulse" />
        </motion.div>

        <motion.p
          className="text-xl text-gray-300 max-w-3xl leading-relaxed mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          实时跟踪AI产品更新，智能分析重要信息，为您呈现最前沿的科技动态
        </motion.p>

        {/* 数据指标 */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-400/20 to-emerald-500/20 border border-green-400/30 rounded-2xl flex items-center justify-center backdrop-blur-sm mb-4">
                <Brain className="w-8 h-8 text-green-400" />
                <div className="absolute inset-0 bg-green-400/10 rounded-2xl animate-pulse" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">50+</div>
              <div className="text-gray-400 text-sm">AI产品监控</div>
            </div>
          </div>

          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-400/20 to-cyan-500/20 border border-blue-400/30 rounded-2xl flex items-center justify-center backdrop-blur-sm mb-4">
                <Cpu className="w-8 h-8 text-blue-400" />
                <div className="absolute inset-0 bg-blue-400/10 rounded-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-400 text-sm">实时更新</div>
            </div>
          </div>

          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-400/20 to-pink-500/20 border border-purple-400/30 rounded-2xl flex items-center justify-center backdrop-blur-sm mb-4">
                <Zap className="w-8 h-8 text-purple-400" />
                <div className="absolute inset-0 bg-purple-400/10 rounded-2xl animate-pulse" style={{ animationDelay: '1s' }} />
              </div>
              <div className="text-3xl font-bold text-white mb-2">AI</div>
              <div className="text-gray-400 text-sm">智能分析</div>
            </div>
          </div>
        </motion.div>

        {/* 装饰性粒子 */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => {
            // 使用索引生成固定的伪随机值，避免hydration mismatch
            const pseudoRandomX = ((i * 17 + 23) % 100)
            const pseudoRandomY = ((i * 13 + 37) % 100)
            const pseudoRandomDuration = 2 + ((i * 7) % 3)
            const pseudoRandomDelay = (i * 0.1) % 2
            
            return (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400/60 rounded-full"
                style={{
                  left: `${pseudoRandomX}%`,
                  top: `${pseudoRandomY}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: pseudoRandomDuration,
                  repeat: Infinity,
                  delay: pseudoRandomDelay,
                }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

// 全息状态指示器
export function HolographicStatusBar() {
  return (
    <motion.div
      className="fixed top-24 right-6 z-30"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2 }}
    >
      <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-4 space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-gray-300">系统在线</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          <span className="text-xs text-gray-300">数据同步</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <span className="text-xs text-gray-300">AI分析</span>
        </div>
      </div>
    </motion.div>
  )
}