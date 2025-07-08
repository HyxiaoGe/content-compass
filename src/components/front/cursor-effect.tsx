'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function CursorEffect() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])
  const rippleIdRef = useRef(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseDown = (e: MouseEvent) => {
      const newRipple = {
        id: rippleIdRef.current++,
        x: e.clientX,
        y: e.clientY
      }
      setRipples(prev => [...prev, newRipple])
      
      // 自动移除波纹
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id))
      }, 1000)
    }

    // 检测是否悬停在卡片上
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('.timeline-card')) {
        setIsHovering(true)
      }
    }

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.timeline-card')) {
        setIsHovering(false)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseover', handleMouseOver)
    window.addEventListener('mouseout', handleMouseOut)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseover', handleMouseOver)
      window.removeEventListener('mouseout', handleMouseOut)
    }
  }, [])

  return (
    <>
      {/* 主光标效果 */}
      <motion.div
        className="fixed pointer-events-none z-50 mix-blend-screen"
        animate={{
          x: cursorPosition.x - 20,
          y: cursorPosition.y - 20,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 200,
          mass: 0.5
        }}
      >
        <div className={`
          w-10 h-10 rounded-full
          bg-gradient-to-r from-blue-400/50 to-purple-400/50
          blur-sm
          ${isHovering ? 'scale-150' : 'scale-100'}
          transition-transform duration-300
        `} />
      </motion.div>

      {/* 跟随光标的小圆点 */}
      <motion.div
        className="fixed pointer-events-none z-50"
        animate={{
          x: cursorPosition.x - 4,
          y: cursorPosition.y - 4,
        }}
        transition={{
          type: "spring",
          damping: 50,
          stiffness: 400,
          mass: 0.1
        }}
      >
        <div className="w-2 h-2 rounded-full bg-white/80" />
      </motion.div>

      {/* 点击波纹效果 */}
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            className="fixed pointer-events-none z-40"
            initial={{
              opacity: 1,
              scale: 0,
              x: ripple.x - 50,
              y: ripple.y - 50,
            }}
            animate={{
              opacity: 0,
              scale: 2,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 1,
              ease: "easeOut"
            }}
          >
            <div className="w-24 h-24 rounded-full border-2 border-blue-400/50" />
          </motion.div>
        ))}
      </AnimatePresence>
    </>
  )
}