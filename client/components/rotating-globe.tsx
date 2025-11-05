import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function RotatingGlobe() {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = document.getElementById('globe-container')?.getBoundingClientRect()
      if (rect) {
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        })
      }
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    const container = document.getElementById('globe-container')
    container?.addEventListener('mousemove', handleMouseMove)
    container?.addEventListener('mouseenter', handleMouseEnter)
    container?.addEventListener('mouseleave', handleMouseLeave)
    
    return () => {
      container?.removeEventListener('mousemove', handleMouseMove)
      container?.removeEventListener('mouseenter', handleMouseEnter)
      container?.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  // Generate globe grid points
  const generateGlobePoints = () => {
    const points = []
    const latLines = 12
    const lonLines = 16
    
    for (let lat = 0; lat < latLines; lat++) {
      for (let lon = 0; lon < lonLines; lon++) {
        const phi = (lat / (latLines - 1)) * Math.PI
        const theta = (lon / lonLines) * 2 * Math.PI
        
        // Convert spherical to 2D projection
        const x = 50 + (Math.sin(phi) * Math.cos(theta)) * 25
        const y = 50 + (Math.cos(phi)) * 25
        
        // Only show points on visible hemisphere
        if (Math.sin(phi) * Math.sin(theta) > -0.3) {
          points.push({ x, y, intensity: Math.sin(phi) * 0.8 + 0.2 })
        }
      }
    }
    return points
  }

  const globePoints = generateGlobePoints()

  return (
    <div
      id="globe-container"
      className="relative w-full h-full overflow-hidden bg-gradient-to-br from-brand-50 via-slate-50 to-brand-100 dark:from-background dark:via-card dark:to-background"
    >
      {/* Enhanced Grid Background */}
      <div className="absolute inset-0">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern
              id="globe-grid"
              width="30"
              height="30"
              patternUnits="userSpaceOnUse"
            >
              <rect width="30" height="30" fill="none" />
              <path
                d="M 30 0 L 0 0 0 30"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="0.8"
                opacity="0.6"
              />
              <circle
                cx="0"
                cy="0"
                r="1"
                fill="hsl(var(--brand-400))"
                opacity="0.4"
              />
            </pattern>
            
            <radialGradient id="cursorGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(var(--brand-500) / 0.4)" />
              <stop offset="50%" stopColor="hsl(var(--brand-400) / 0.2)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          
          <rect width="100%" height="100%" fill="url(#globe-grid)" />
        </svg>
      </div>

      {/* Enhanced Cursor Interaction Effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
            hsl(var(--brand-500) / 0.3) 0%, 
            hsl(var(--brand-400) / 0.15) 20%, 
            transparent 40%)`
        }}
        animate={{
          opacity: isHovering ? 1 : 0,
          scale: isHovering ? 1 : 0.9,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />

      {/* Globe Container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative w-96 h-96"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Globe Base Circle */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-brand-300/30 bg-gradient-to-br from-brand-100/20 to-brand-200/10 dark:from-brand-950/20 dark:to-brand-900/10 backdrop-blur-sm"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />

          {/* Globe Latitude Lines */}
          {[0, 1, 2, 3, 4].map((index) => (
            <motion.div
              key={`lat-${index}`}
              className="absolute left-1/2 top-1/2 border border-brand-400/20 rounded-full"
              style={{
                width: `${(5 - index) * 40}px`,
                height: `${(5 - index) * 20}px`,
                marginLeft: `${-(5 - index) * 20}px`,
                marginTop: `${-(5 - index) * 10}px`,
              }}
              animate={{ rotate: 360 }}
              transition={{ 
                duration: 25 + index * 2, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            />
          ))}

          {/* Globe Longitude Lines */}
          {[0, 1, 2, 3].map((index) => (
            <motion.div
              key={`lon-${index}`}
              className="absolute left-1/2 top-1/2 w-px h-96 bg-gradient-to-b from-transparent via-brand-400/30 to-transparent origin-bottom"
              style={{
                marginLeft: '-0.5px',
                marginTop: '-192px',
                transform: `rotate(${index * 45}deg)`,
              }}
              animate={{ rotateY: 360 }}
              transition={{ 
                duration: 30 + index * 3, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            />
          ))}

          {/* Globe Points */}
          {globePoints.map((point, index) => {
            const distanceFromMouse = Math.sqrt(
              Math.pow(point.x - mousePosition.x, 2) + 
              Math.pow(point.y - mousePosition.y, 2)
            )
            const proximity = Math.max(0, 1 - distanceFromMouse / 30)
            
            return (
              <motion.div
                key={index}
                className="absolute w-1 h-1 rounded-full bg-brand-500"
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                  opacity: point.intensity * (0.6 + proximity * 0.4),
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [point.intensity * 0.6, point.intensity * 1, point.intensity * 0.6],
                }}
                transition={{
                  duration: 2 + Math.random(),
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            )
          })}

          {/* Globe Highlight */}
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-sm" />

          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full">
            {Array.from({ length: 6 }).map((_, index) => {
              const angle = (index * 60) * (Math.PI / 180)
              const startX = 50 + Math.cos(angle) * 20
              const startY = 50 + Math.sin(angle) * 20
              const endX = 50 + Math.cos(angle + Math.PI) * 15
              const endY = 50 + Math.sin(angle + Math.PI) * 15
              
              return (
                <motion.path
                  key={index}
                  d={`M ${startX}% ${startY}% Q 50% 50% ${endX}% ${endY}%`}
                  stroke="hsl(var(--brand-500))"
                  strokeWidth="1"
                  fill="none"
                  opacity="0.3"
                  strokeDasharray="2 4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 1.5,
                    delay: index * 0.2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    repeatDelay: 1,
                  }}
                />
              )
            })}
          </svg>
        </motion.div>
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-center max-w-md px-8 mt-96"
        >
          <motion.div
            className="text-6xl font-bold bg-gradient-to-r from-brand-600 via-brand-500 to-brand-700 bg-clip-text text-transparent mb-4"
            animate={{ 
              backgroundPosition: ["0%", "100%", "0%"],
              scale: isHovering ? 1.05 : 1
            }}
            transition={{ 
              backgroundPosition: { duration: 3, repeat: Infinity },
              scale: { duration: 0.2 }
            }}
          >
            400K+
          </motion.div>
          
          <motion.div
            className="text-lg text-muted-foreground mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.5 }}
          >
            users navigating with
          </motion.div>
          
          <motion.div
            className="text-4xl font-bold bg-gradient-to-r from-brand-700 via-brand-600 to-brand-500 bg-clip-text text-transparent mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            50M+ AI routes
          </motion.div>
          
          <motion.div
            className="inline-flex items-center space-x-2 bg-card/80 backdrop-blur-sm border border-border rounded-full px-6 py-2 shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.7, duration: 0.4 }}
            whileHover={{ scale: 1.05, boxShadow: `0 8px 25px hsl(var(--brand-500) / 0.25)` }}
          >
            <motion.div 
              className="w-2 h-2 bg-green-500 rounded-full" 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-sm font-medium text-foreground">Global Navigation</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Interactive Corner Elements */}
      <motion.div 
        className="absolute top-8 right-8"
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", damping: 15 }}
      >
        <motion.div
          className="w-12 h-12 border border-border rounded-xl bg-card/80 backdrop-blur-sm flex items-center justify-center shadow-lg"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-4 h-4 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full" />
        </motion.div>
      </motion.div>

      <motion.div 
        className="absolute bottom-8 left-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <div className="text-xs text-muted-foreground bg-card/80 backdrop-blur-sm rounded-lg p-3 border border-border shadow-lg">
          <div className="flex items-center space-x-2 mb-1">
            <motion.div 
              className="w-1.5 h-1.5 bg-green-500 rounded-full" 
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span>Global network active</span>
          </div>
          <div className="flex items-center space-x-2">
            <motion.div 
              className="w-1.5 h-1.5 bg-brand-500 rounded-full" 
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
            <span>Real-time navigation</span>
          </div>
        </div>
      </motion.div>

      {/* Hover hint */}
      <motion.div
        className="absolute top-1/2 left-8 transform -translate-y-1/2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: isHovering ? 0 : 0.6, x: isHovering ? -20 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-xs text-muted-foreground bg-card/60 backdrop-blur-sm rounded-lg p-2 border border-border/50">
          Interact with the globe
        </div>
      </motion.div>
    </div>
  )
}
