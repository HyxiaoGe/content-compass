'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const particlesRef = useRef<Array<{
    x: number
    y: number
    vx: number
    vy: number
    size: number
    color: string
  }>>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 设置画布大小
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // 初始化粒子
    const initParticles = () => {
      particlesRef.current = []
      for (let i = 0; i < 50; i++) {
        // 使用固定的伪随机值避免hydration mismatch
        const pseudoRandomX = ((i * 17 + 23) % 100) / 100 * canvas.width
        const pseudoRandomY = ((i * 13 + 37) % 100) / 100 * canvas.height
        const pseudoRandomVx = (((i * 11 + 7) % 100) / 100 - 0.5) * 0.5
        const pseudoRandomVy = (((i * 19 + 41) % 100) / 100 - 0.5) * 0.5
        const pseudoRandomSize = ((i * 7 + 3) % 100) / 100 * 3 + 1
        const pseudoRandomColor = ((i * 23 + 17) % 100) > 50 ? '#3B82F6' : '#8B5CF6'
        
        particlesRef.current.push({
          x: pseudoRandomX,
          y: pseudoRandomY,
          vx: pseudoRandomVx,
          vy: pseudoRandomVy,
          size: pseudoRandomSize,
          color: pseudoRandomColor
        })
      }
    }
    initParticles()

    // 鼠标移动监听
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', handleMouseMove)

    // 动画循环
    const animate = () => {
      ctx.fillStyle = 'rgba(249, 250, 251, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // 绘制粒子
      particlesRef.current.forEach((particle, index) => {
        // 鼠标吸引力
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 100) {
          particle.vx += dx * 0.00005
          particle.vy += dy * 0.00005
        }

        // 更新位置
        particle.x += particle.vx
        particle.y += particle.vy

        // 边界反弹
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        // 速度衰减
        particle.vx *= 0.999
        particle.vy *= 0.999

        // 绘制粒子
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color + '40'
        ctx.fill()

        // 连接临近粒子
        particlesRef.current.forEach((otherParticle, otherIndex) => {
          if (index !== otherIndex) {
            const dx = particle.x - otherParticle.x
            const dy = particle.y - otherParticle.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            
            if (distance < 150) {
              ctx.beginPath()
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(otherParticle.x, otherParticle.y)
              ctx.strokeStyle = particle.color + Math.floor((1 - distance / 150) * 20).toString(16)
              ctx.lineWidth = 0.5
              ctx.stroke()
            }
          }
        })
      })

      requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none"
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-gray-900/5 via-blue-900/5 to-purple-900/5" />
      
      {/* 动态光效 */}
      <motion.div
        className="fixed top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </>
  )
}