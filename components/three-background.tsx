"use client"

import type React from "react"

import { useRef, useMemo, Suspense, useCallback } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Points, PointMaterial, Sphere, MeshDistortMaterial, Environment, Float } from "@react-three/drei"
import * as THREE from "three"

interface ThreeBackgroundProps {
  executionStatus: string
  activeAgents: number
  progress: number
  selectedFramework?: string
}

// Error boundary for 3D components
function ThreeErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5" />
      {children}
    </div>
  )
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 animate-pulse" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  )
}

// Optimized particle system
function ParticleField({
  executionStatus,
  activeAgents,
  progress,
}: { executionStatus: string; activeAgents: number; progress: number }) {
  const ref = useRef<THREE.Points>(null!)

  const particleCount = useMemo(() => Math.min(activeAgents * 30, 500), [activeAgents])

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      const radius = Math.random() * 10 + 5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = radius * Math.cos(phi)

      // Color based on execution status
      if (executionStatus === "running") {
        colors[i3] = 1.0
        colors[i3 + 1] = 0.5
        colors[i3 + 2] = 0.0
      } else if (executionStatus === "completed") {
        colors[i3] = 0.0
        colors[i3 + 1] = 1.0
        colors[i3 + 2] = 0.3
      } else {
        colors[i3] = 1.0
        colors[i3 + 1] = 0.6
        colors[i3 + 2] = 0.0
      }
    }

    return [positions, colors]
  }, [particleCount, executionStatus])

  useFrame((state) => {
    if (ref.current) {
      const time = state.clock.getElapsedTime()
      const rotationSpeed = executionStatus === "running" ? 0.2 : 0.05

      ref.current.rotation.x = time * rotationSpeed * 0.1
      ref.current.rotation.y = time * rotationSpeed * 0.15

      const scale = 1 + Math.sin(time * 2) * 0.03 * (progress / 100)
      ref.current.scale.setScalar(scale)
    }
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.08}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

// Central hub component
function CentralHub({ executionStatus, progress }: { executionStatus: string; progress: number }) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime()
      meshRef.current.rotation.x = time * 0.05
      meshRef.current.rotation.y = time * 0.1

      const targetScale = executionStatus === "running" ? 1.05 : 1.0
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.01)
    }
  })

  const color = useMemo(() => {
    switch (executionStatus) {
      case "running":
        return "#ff6b35"
      case "completed":
        return "#00ff88"
      case "error":
        return "#ff3333"
      default:
        return "#ff8c42"
    }
  }, [executionStatus])

  return (
    <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.2}>
      <Sphere ref={meshRef} args={[0.8, 24, 24]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.1}
          speed={0.5}
          roughness={0.3}
          metalness={0.4}
          emissive={color}
          emissiveIntensity={0.05}
        />
      </Sphere>
    </Float>
  )
}

// Agent nodes component
function AgentNodes({ activeAgents, executionStatus }: { activeAgents: number; executionStatus: string }) {
  const groupRef = useRef<THREE.Group>(null!)

  const nodes = useMemo(() => {
    return Array.from({ length: Math.min(activeAgents, 6) }, (_, i) => ({
      id: `agent-node-${i}`,
      angle: (i / activeAgents) * Math.PI * 2,
      radius: 4 + Math.random() * 1,
      speed: 0.2 + Math.random() * 0.2,
      size: 0.15 + Math.random() * 0.05,
    }))
  }, [activeAgents])

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime()
      const rotationSpeed = executionStatus === "running" ? 0.3 : 0.1

      groupRef.current.rotation.y = time * rotationSpeed * 0.05

      groupRef.current.children.forEach((child, i) => {
        const node = nodes[i]
        if (node) {
          const angle = node.angle + time * node.speed * 0.05
          child.position.x = Math.cos(angle) * node.radius
          child.position.z = Math.sin(angle) * node.radius
          child.position.y = Math.sin(time * 0.2 + i) * 0.5
        }
      })
    }
  })

  return (
    <group ref={groupRef}>
      {nodes.map((node) => (
        <Float key={node.id} speed={1} rotationIntensity={0.3} floatIntensity={0.2}>
          <Sphere args={[node.size, 12, 12]}>
            <MeshDistortMaterial
              color="#4a9eff"
              attach="material"
              distort={0.05}
              speed={0.3}
              roughness={0.4}
              metalness={0.3}
              emissive="#4a9eff"
              emissiveIntensity={0.03}
            />
          </Sphere>
        </Float>
      ))}
    </group>
  )
}

// Main 3D Scene
function Scene({
  executionStatus,
  activeAgents,
  progress,
}: { executionStatus: string; activeAgents: number; progress: number }) {
  return (
    <>
      <Environment preset="night" />
      <ambientLight intensity={0.03} />
      <pointLight position={[3, 3, 3]} intensity={0.2} color="#ff6b35" />
      <pointLight position={[-3, -3, -3]} intensity={0.15} color="#4a9eff" />

      <ParticleField executionStatus={executionStatus} activeAgents={activeAgents} progress={progress} />
      <CentralHub executionStatus={executionStatus} progress={progress} />
      <AgentNodes activeAgents={activeAgents} executionStatus={executionStatus} />
    </>
  )
}

export default function ThreeBackground({
  executionStatus,
  activeAgents,
  progress,
  selectedFramework,
}: ThreeBackgroundProps) {
  const handleCreated = useCallback((state: any) => {
    state.gl.setClearColor("#000000", 0)
  }, [])

  return (
    <ThreeErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          camera={{ position: [0, 0, 15], fov: 45 }}
          gl={{
            antialias: false,
            alpha: true,
            powerPreference: "high-performance",
            stencil: false,
            depth: true,
          }}
          dpr={[1, 1.5]}
          performance={{ min: 0.5 }}
          frameloop="demand"
          onCreated={handleCreated}
        >
          <Scene executionStatus={executionStatus} activeAgents={activeAgents} progress={progress} />
        </Canvas>
      </Suspense>
    </ThreeErrorBoundary>
  )
}
