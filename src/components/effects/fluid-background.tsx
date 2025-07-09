'use client'

import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial, Text } from '@react-three/drei'
import * as THREE from 'three'

// 流体粒子组件
function FluidParticles() {
  const pointsRef = useRef<THREE.Points>(null)
  const particleCount = 1000
  
  // 创建粒子位置
  const positions = new Float32Array(particleCount * 3)
  const velocities = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  
  for (let i = 0; i < particleCount; i++) {
    // 使用固定种子生成伪随机值，避免hydration mismatch
    const seed1 = (i * 9301 + 49297) % 233280
    const seed2 = (i * 9301 + 49297 + 1) % 233280
    const seed3 = (i * 9301 + 49297 + 2) % 233280
    
    const pseudoRandom1 = (seed1 / 233280 - 0.5) * 20
    const pseudoRandom2 = (seed2 / 233280 - 0.5) * 20
    const pseudoRandom3 = (seed3 / 233280 - 0.5) * 20
    
    positions[i * 3] = pseudoRandom1
    positions[i * 3 + 1] = pseudoRandom2
    positions[i * 3 + 2] = pseudoRandom3
    
    velocities[i * 3] = (pseudoRandom1 / 20) * 0.02
    velocities[i * 3 + 1] = (pseudoRandom2 / 20) * 0.02
    velocities[i * 3 + 2] = (pseudoRandom3 / 20) * 0.02
    
    // 渐变色彩：蓝色到紫色到粉色
    const hue = ((i * 17 + 23) % 100) / 100 * 0.3 + 0.6 // 0.6-0.9 (蓝紫粉)
    const color = new THREE.Color().setHSL(hue, 0.8, 0.6)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
  }

  useFrame((state) => {
    if (!pointsRef.current) return
    
    const time = state.clock.getElapsedTime()
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      // 流体动力学模拟
      positions[i3] += Math.sin(time * 0.5 + i * 0.01) * 0.005
      positions[i3 + 1] += Math.cos(time * 0.3 + i * 0.01) * 0.005
      positions[i3 + 2] += Math.sin(time * 0.7 + i * 0.01) * 0.003
      
      // 边界循环
      if (positions[i3] > 10) positions[i3] = -10
      if (positions[i3] < -10) positions[i3] = 10
      if (positions[i3 + 1] > 10) positions[i3 + 1] = -10
      if (positions[i3 + 1] < -10) positions[i3 + 1] = 10
      if (positions[i3 + 2] > 10) positions[i3 + 2] = -10
      if (positions[i3 + 2] < -10) positions[i3 + 2] = 10
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        vertexColors
        blending={THREE.AdditiveBlending}
      />
      <bufferAttribute
        attach="geometry-attributes-color"
        args={[colors, 3]}
      />
    </Points>
  )
}

// 神经网络节点
function NeuralNetwork() {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1
    }
  })

  const nodes: Array<{x: number, y: number, z: number}> = []
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2
    const radius = 3
    // 使用固定的伪随机值避免hydration mismatch
    const pseudoRandomZ = ((i * 13 + 7) % 100) / 100 * 2 - 1
    nodes.push({
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      z: pseudoRandomZ
    })
  }

  return (
    <group ref={groupRef} position={[0, 0, -5]}>
      {nodes.map((node, i) => (
        <group key={i}>
          <mesh position={[node.x, node.y, node.z]}>
            <sphereGeometry args={[0.1, 32, 32]} />
            <meshBasicMaterial color="#00ffff" transparent opacity={0.8} />
          </mesh>
          {/* 连接线 */}
          {i < nodes.length - 1 && (
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[new Float32Array([
                    node.x, node.y, node.z,
                    nodes[i + 1].x, nodes[i + 1].y, nodes[i + 1].z
                  ]), 3]}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#00ffff" transparent opacity={0.3} />
            </line>
          )}
        </group>
      ))}
    </group>
  )
}

// 数据流效果
function DataStreams() {
  const streamRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (streamRef.current) {
      streamRef.current.children.forEach((child, i) => {
        child.position.z += 0.1
        if (child.position.z > 5) {
          child.position.z = -5
        }
        child.rotation.z = state.clock.getElapsedTime() * (i * 0.1 + 0.5)
      })
    }
  })

  return (
    <group ref={streamRef}>
      {Array.from({ length: 20 }).map((_, i) => {
        // 使用固定的伪随机值避免hydration mismatch
        const pseudoRandomX = ((i * 17 + 11) % 100) / 100 * 10 - 5
        const pseudoRandomY = ((i * 23 + 13) % 100) / 100 * 10 - 5
        const pseudoRandomZ = ((i * 31 + 17) % 100) / 100 * 10 - 5
        const pseudoRandomHue = 0.6 + ((i * 7 + 3) % 100) / 100 * 0.3
        
        return (
          <mesh
            key={i}
            position={[
              pseudoRandomX,
              pseudoRandomY,
              pseudoRandomZ
            ]}
          >
            <boxGeometry args={[0.02, 0.02, 1]} />
            <meshBasicMaterial 
              color={new THREE.Color().setHSL(pseudoRandomHue, 0.8, 0.6)} 
              transparent 
              opacity={0.6}
            />
        </mesh>
        )
      })}
    </group>
  )
}

export function FluidBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />
        
        <FluidParticles />
        <NeuralNetwork />
        <DataStreams />
      </Canvas>
      
      {/* 渐变遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/30 to-gray-900/80 pointer-events-none" />
    </div>
  )
}