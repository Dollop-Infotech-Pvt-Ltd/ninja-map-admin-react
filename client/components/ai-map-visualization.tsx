import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function AIMapVisualization() {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = document.getElementById('ai-map-container')?.getBoundingClientRect()
      if (rect) {
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        })
      }
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    const container = document.getElementById('ai-map-container')
    container?.addEventListener('mousemove', handleMouseMove)
    container?.addEventListener('mouseenter', handleMouseEnter)
    container?.addEventListener('mouseleave', handleMouseLeave)
    
    return () => {
      container?.removeEventListener('mousemove', handleMouseMove)
      container?.removeEventListener('mouseenter', handleMouseEnter)
      container?.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  const mapNodes = [
    { x: 15, y: 25, size: 12, delay: 0, intensity: 0.8 },
    { x: 35, y: 15, size: 16, delay: 0.1, intensity: 1.0 },
    { x: 65, y: 30, size: 14, delay: 0.2, intensity: 0.9 },
    { x: 80, y: 20, size: 18, delay: 0.3, intensity: 1.1 },
    { x: 25, y: 55, size: 13, delay: 0.4, intensity: 0.7 },
    { x: 50, y: 45, size: 15, delay: 0.5, intensity: 0.8 },
    { x: 75, y: 65, size: 17, delay: 0.6, intensity: 1.0 },
    { x: 20, y: 80, size: 14, delay: 0.7, intensity: 0.9 },
    { x: 60, y: 75, size: 16, delay: 0.8, intensity: 0.8 },
    { x: 85, y: 85, size: 13, delay: 0.9, intensity: 0.7 },
  ]

  const connections = [
    { from: { x: 15, y: 25 }, to: { x: 35, y: 15 }, strength: 0.8 },
    { from: { x: 35, y: 15 }, to: { x: 65, y: 30 }, strength: 1.0 },
    { from: { x: 65, y: 30 }, to: { x: 80, y: 20 }, strength: 0.9 },
    { from: { x: 25, y: 55 }, to: { x: 50, y: 45 }, strength: 0.7 },
    { from: { x: 50, y: 45 }, to: { x: 75, y: 65 }, strength: 0.8 },
    { from: { x: 75, y: 65 }, to: { x: 60, y: 75 }, strength: 0.6 },
    { from: { x: 20, y: 80 }, to: { x: 60, y: 75 }, strength: 0.9 },
    { from: { x: 15, y: 25 }, to: { x: 25, y: 55 }, strength: 0.5 },
    { from: { x: 80, y: 20 }, to: { x: 85, y: 85 }, strength: 0.4 },
  ]

  // Calculate distance from mouse for interactive effects
  const getDistanceFromMouse = (nodeX: number, nodeY: number) => {
    const dx = nodeX - mousePosition.x
    const dy = nodeY - mousePosition.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  return (
    <div
      id="ai-map-container"
      className="relative w-full h-full overflow-hidden bg-gradient-to-br from-brand-50 via-slate-50 to-brand-100 dark:from-background dark:via-card dark:to-background"
    >
      {/* Enhanced Grid Background */}
      <div className="absolute inset-0">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern
              id="enhanced-grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <rect width="40" height="40" fill="none" />
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="0.5"
                opacity="0.4"
              />
              <circle
                cx="0"
                cy="0"
                r="0.8"
                fill="hsl(var(--brand-400))"
                opacity="0.3"
              />
            </pattern>
            
            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--brand-500))" stopOpacity="0.6" />
              <stop offset="50%" stopColor="hsl(var(--brand-400))" stopOpacity="0.4" />
              <stop offset="100%" stopColor="hsl(var(--brand-300))" stopOpacity="0.2" />
            </linearGradient>
            
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <radialGradient id="cursorGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(var(--cursor-glow))" stopOpacity="0.8" />
              <stop offset="50%" stopColor="hsl(var(--cursor-trail))" stopOpacity="0.4" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>
          
          <rect width="100%" height="100%" fill="url(#enhanced-grid)" />
        </svg>
      </div>

      {/* Enhanced Cursor Interaction Effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
            hsl(var(--cursor-glow)) 0%, 
            hsl(var(--cursor-trail)) 15%, 
            transparent 35%)`
        }}
        animate={{
          opacity: isHovering ? 1 : 0,
          scale: isHovering ? 1 : 0.8,
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      />

      {/* Secondary Cursor Ripple */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
            transparent 20%, 
            hsl(var(--brand-400) / 0.1) 25%, 
            transparent 30%)`
        }}
        animate={{
          opacity: isHovering ? 0.6 : 0,
          scale: isHovering ? 1.2 : 0.5,
        }}
        transition={{ type: "spring", damping: 20, stiffness: 150, delay: 0.1 }}
      />

      {/* Interactive Connections */}
      <svg className="absolute inset-0 w-full h-full">
        {connections.map((connection, index) => {
          const midX = (connection.from.x + connection.to.x) / 2
          const midY = (connection.from.y + connection.to.y) / 2
          const distanceFromMouse = getDistanceFromMouse(midX, midY)
          const opacity = Math.max(0.2, Math.min(0.8, 1 - distanceFromMouse / 100))
          
          return (
            <motion.g key={index}>
              <motion.path
                d={`M ${connection.from.x}% ${connection.from.y}% 
                   Q ${midX + (Math.sin(index) * 5)}% ${midY + (Math.cos(index) * 5)}% 
                   ${connection.to.x}% ${connection.to.y}%`}
                stroke="url(#connectionGradient)"
                strokeWidth={connection.strength * 2}
                fill="none"
                strokeDasharray={`${4 * connection.strength} ${6 * connection.strength}`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1, 
                  opacity: isHovering ? opacity * 1.5 : opacity,
                  strokeWidth: isHovering ? connection.strength * 3 : connection.strength * 2
                }}
                transition={{
                  pathLength: { duration: 2, delay: index * 0.2 },
                  opacity: { duration: 0.3 },
                  strokeWidth: { duration: 0.3 }
                }}
                filter="url(#glow)"
              />
              
              {/* Data flow particles */}
              <motion.circle
                r={1.5}
                fill="hsl(var(--brand-500))"
                initial={{ offsetDistance: "0%" }}
                animate={{ offsetDistance: "100%" }}
                transition={{
                  duration: 4 + (index * 0.5),
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  offsetPath: `path('M ${connection.from.x}% ${connection.from.y}% Q ${midX + (Math.sin(index) * 5)}% ${midY + (Math.cos(index) * 5)}% ${connection.to.x}% ${connection.to.y}%')`,
                  opacity: isHovering ? 0.9 : 0.6
                }}
              />
            </motion.g>
          )
        })}
      </svg>

      {/* Enhanced Map Nodes */}
      {mapNodes.map((node, index) => {
        const distanceFromMouse = getDistanceFromMouse(node.x, node.y)
        const proximity = Math.max(0, 1 - distanceFromMouse / 50)
        const scale = 1 + (proximity * 0.5)
        const glowIntensity = proximity * 0.8
        
        return (
          <motion.div
            key={index}
            className="absolute"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: scale, 
              opacity: 1,
            }}
            transition={{
              scale: { type: "spring", damping: 20, stiffness: 300 },
              opacity: { duration: 0.6, delay: node.delay }
            }}
          >
            {/* Dynamic Pulsing Ring */}
            <motion.div
              className="absolute inset-0 -m-6"
              animate={{ 
                scale: [1, 1.5 + (proximity * 0.5), 1], 
                opacity: [0.3, 0, 0.3] 
              }}
              transition={{
                duration: 2 + (index * 0.2),
                repeat: Infinity,
                delay: node.delay,
              }}
            >
              <div 
                className="w-12 h-12 border-2 rounded-full" 
                style={{ 
                  borderColor: `hsl(var(--brand-400) / ${0.3 + glowIntensity})`,
                  boxShadow: isHovering && proximity > 0.3 ? `0 0 20px hsl(var(--brand-500) / 0.6)` : 'none'
                }} 
              />
            </motion.div>

            {/* Main Node */}
            <motion.div
              className="relative rounded-full shadow-lg overflow-hidden"
              style={{ 
                width: `${node.size}px`, 
                height: `${node.size}px`,
                background: `linear-gradient(135deg, hsl(var(--brand-500)), hsl(var(--brand-600)))`,
                boxShadow: `0 4px 20px hsl(var(--brand-500) / ${0.3 + glowIntensity})`
              }}
              animate={{ 
                y: [0, -3, 0],
                boxShadow: `0 4px 20px hsl(var(--brand-500) / ${0.3 + glowIntensity * 2})`
              }}
              transition={{
                y: { duration: 3 + (index * 0.2), repeat: Infinity, ease: "easeInOut" },
                boxShadow: { duration: 0.3 }
              }}
            >
              {/* Inner Highlight */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-full" />
              
              {/* Center Core */}
              <motion.div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.1 }}
              />

              {/* Interactive Pulse on Hover */}
              {proximity > 0.2 && (
                <motion.div
                  className="absolute inset-0 bg-white/20 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, opacity: [1, 0] }}
                  transition={{ duration: 0.6 }}
                />
              )}
            </motion.div>

            {/* Data Visualization Bars */}
            <motion.div
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              animate={{ rotate: 360 }}
              transition={{ duration: 20 + (index * 2), repeat: Infinity, ease: "linear" }}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-0.5 bg-gradient-to-t from-brand-400/60 to-transparent origin-bottom"
                  style={{
                    height: `${8 + (node.intensity * 6)}px`,
                    left: '50%',
                    bottom: '50%',
                    transform: `rotate(${i * 45}deg) translateX(-50%)`,
                  }}
                  animate={{
                    scaleY: [0.3, 1, 0.5, 0.8, 0.3],
                    opacity: [0.6, 1, 0.7, 0.9, 0.6]
                  }}
                  transition={{
                    duration: 2 + (i * 0.1),
                    repeat: Infinity,
                    delay: (index + i) * 0.1,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        )
      })}

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="text-center max-w-md px-8"
        >
          <motion.div
            className="text-6xl font-bold bg-gradient-to-r from-brand-600 via-brand-500 to-brand-700 bg-clip-text text-transparent mb-4"
            animate={{ 
              backgroundPosition: ["0%", "100%", "0%"],
              scale: isHovering ? 1.05 : 1
            }}
            transition={{ 
              backgroundPosition: { duration: 3, repeat: Infinity },
              scale: { duration: 0.3 }
            }}
          >
            400K+
          </motion.div>
          
          <motion.div
            className="text-lg text-muted-foreground mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
          >
            users navigating with
          </motion.div>
          
          <motion.div
            className="text-4xl font-bold bg-gradient-to-r from-brand-700 via-brand-600 to-brand-500 bg-clip-text text-transparent mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.3, duration: 0.8 }}
          >
            50M+ AI routes
          </motion.div>
          
          <motion.div
            className="inline-flex items-center space-x-2 bg-card/80 backdrop-blur-sm border border-border rounded-full px-6 py-2 shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.6, duration: 0.6 }}
            whileHover={{ scale: 1.05, boxShadow: `0 8px 25px hsl(var(--brand-500) / 0.25)` }}
          >
            <motion.div 
              className="w-2 h-2 bg-green-500 rounded-full" 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-sm font-medium text-foreground">Live Navigation</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Interactive Corner Elements */}
      <motion.div 
        className="absolute top-8 right-8"
        whileHover={{ scale: 1.1, rotate: 45 }}
        transition={{ type: "spring", damping: 15 }}
      >
        <motion.div
          className="w-12 h-12 border border-border rounded-xl bg-card/80 backdrop-blur-sm flex items-center justify-center shadow-lg"
          animate={{ rotate: [0, 90, 180, 270, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-4 h-4 bg-gradient-to-br from-brand-500 to-brand-600 rounded" />
        </motion.div>
      </motion.div>

      <motion.div 
        className="absolute bottom-8 left-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
      >
        <div className="text-xs text-muted-foreground bg-card/80 backdrop-blur-sm rounded-lg p-3 border border-border shadow-lg">
          <div className="flex items-center space-x-2 mb-1">
            <motion.div 
              className="w-1.5 h-1.5 bg-green-500 rounded-full" 
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span>Neural network active</span>
          </div>
          <div className="flex items-center space-x-2">
            <motion.div 
              className="w-1.5 h-1.5 bg-brand-500 rounded-full" 
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
            <span>Real-time optimization</span>
          </div>
        </div>
      </motion.div>

      {/* Hover hint */}
      <motion.div
        className="absolute top-1/2 left-8 transform -translate-y-1/2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: isHovering ? 0 : 0.6, x: isHovering ? -20 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-xs text-muted-foreground bg-card/60 backdrop-blur-sm rounded-lg p-2 border border-border/50">
          Move cursor to interact
        </div>
      </motion.div>
    </div>
  )
}
