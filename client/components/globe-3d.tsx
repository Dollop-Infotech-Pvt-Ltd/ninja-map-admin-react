import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function Globe3D() {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = document.getElementById('globe-3d-container')?.getBoundingClientRect()
      if (rect) {
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        })
      }
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    const container = document.getElementById('globe-3d-container')
    container?.addEventListener('mousemove', handleMouseMove)
    container?.addEventListener('mouseenter', handleMouseEnter)
    container?.addEventListener('mouseleave', handleMouseLeave)
    
    return () => {
      container?.removeEventListener('mousemove', handleMouseMove)
      container?.removeEventListener('mouseenter', handleMouseEnter)
      container?.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  // Generate 3D sphere points
  const generateSpherePoints = () => {
    const points = []
    const radius = 150
    const segments = 16
    const rings = 12
    
    for (let ring = 0; ring < rings; ring++) {
      const phi = (ring / (rings - 1)) * Math.PI
      for (let segment = 0; segment < segments; segment++) {
        const theta = (segment / segments) * 2 * Math.PI
        
        const x = Math.sin(phi) * Math.cos(theta) * radius
        const y = Math.cos(phi) * radius
        const z = Math.sin(phi) * Math.sin(theta) * radius
        
        points.push({ x, y, z, phi, theta })
      }
    }
    return points
  }

  const spherePoints = generateSpherePoints()

  return (
    <div
      id="globe-3d-container"
      className="relative w-full h-full overflow-hidden bg-gradient-to-br from-brand-50/30 via-slate-50/50 to-brand-100/30 dark:from-background dark:via-card/10 dark:to-background"
    >
      {/* Enhanced Grid Background */}
      <div className="absolute inset-0">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern
              id="globe-3d-grid"
              width="25"
              height="25"
              patternUnits="userSpaceOnUse"
            >
              <rect width="25" height="25" fill="none" />
              <path
                d="M 25 0 L 0 0 0 25"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="0.5"
                opacity="0.8"
              />
              <circle
                cx="0"
                cy="0"
                r="0.8"
                fill="hsl(var(--brand-400))"
                opacity="0.6"
              />
            </pattern>
            
            <radialGradient id="cursorGlow3D" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(var(--brand-500) / 0.5)" />
              <stop offset="50%" stopColor="hsl(var(--brand-400) / 0.25)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          
          <rect width="100%" height="100%" fill="url(#globe-3d-grid)" />
        </svg>
      </div>

      {/* Enhanced Cursor Interaction Effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
            hsl(var(--brand-500) / 0.4) 0%, 
            hsl(var(--brand-400) / 0.2) 25%, 
            transparent 50%)`
        }}
        animate={{
          opacity: isHovering ? 1 : 0,
          scale: isHovering ? 1 : 0.8,
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      />

      {/* 3D Globe Container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="relative"
          style={{ 
            width: '300px', 
            height: '300px',
            perspective: '1000px',
            perspectiveOrigin: 'center center'
          }}
        >
          {/* 3D Globe Sphere */}
          <motion.div
            className="relative w-full h-full"
            style={{
              transformStyle: 'preserve-3d',
              transform: 'rotateX(10deg)',
            }}
            animate={{ 
              rotateY: 360,
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {/* Globe Base */}
            <div 
              className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-100/40 to-brand-200/20 dark:from-brand-900/30 dark:to-brand-800/10 backdrop-blur-sm border border-brand-300/30"
              style={{
                boxShadow: 'inset 0 0 50px hsl(var(--brand-500) / 0.1), 0 0 30px hsl(var(--brand-500) / 0.2)'
              }}
            />

            {/* Latitude Lines */}
            {[-60, -30, 0, 30, 60].map((lat, index) => (
              <div
                key={`lat-${lat}`}
                className="absolute border border-brand-400/25 rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                  width: `${Math.cos((lat * Math.PI) / 180) * 300}px`,
                  height: '300px',
                  marginLeft: `${-Math.cos((lat * Math.PI) / 180) * 150}px`,
                  marginTop: '-150px',
                  transform: `rotateX(90deg) translateZ(${Math.sin((lat * Math.PI) / 180) * 150}px)`,
                  transformStyle: 'preserve-3d'
                }}
              />
            ))}

            {/* Longitude Lines */}
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={`lon-${index}`}
                className="absolute border border-brand-400/25 rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                  width: '300px',
                  height: '300px',
                  marginLeft: '-150px',
                  marginTop: '-150px',
                  transform: `rotateY(${index * 30}deg)`,
                  transformStyle: 'preserve-3d'
                }}
              />
            ))}

            {/* 3D Surface Points */}
            {spherePoints.map((point, index) => {
              if (index % 3 !== 0) return null // Reduce point density
              
              const distanceFromMouse = Math.sqrt(
                Math.pow((point.x + 150) / 3 - mousePosition.x, 2) + 
                Math.pow((150 - point.y) / 3 - mousePosition.y, 2)
              )
              const proximity = Math.max(0, 1 - distanceFromMouse / 40)
              
              return (
                <motion.div
                  key={index}
                  className="absolute w-1 h-1 rounded-full bg-brand-500"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate3d(${point.x}px, ${point.y}px, ${point.z}px)`,
                    transformStyle: 'preserve-3d',
                    opacity: 0.6 + proximity * 0.4,
                  }}
                  animate={{
                    scale: [1, 1.2 + proximity * 0.3, 1],
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
            <div 
              className="absolute rounded-full bg-gradient-to-br from-white/20 to-transparent"
              style={{
                left: '25%',
                top: '25%',
                width: '50%',
                height: '50%',
                transform: 'translateZ(150px)',
                transformStyle: 'preserve-3d',
                filter: 'blur(10px)'
              }}
            />

            {/* Connection Networks */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ transform: 'translateZ(1px)', transformStyle: 'preserve-3d' }}
            >
              {Array.from({ length: 8 }).map((_, index) => {
                const angle1 = (index * 45) * (Math.PI / 180)
                const angle2 = ((index + 1) * 45) * (Math.PI / 180)
                const radius = 120
                
                const x1 = 150 + Math.cos(angle1) * radius
                const y1 = 150 + Math.sin(angle1) * radius
                const x2 = 150 + Math.cos(angle2) * radius
                const y2 = 150 + Math.sin(angle2) * radius
                
                return (
                  <motion.path
                    key={index}
                    d={`M ${x1} ${y1} Q 150 150 ${x2} ${y2}`}
                    stroke="hsl(var(--brand-500))"
                    strokeWidth="1"
                    fill="none"
                    opacity="0.4"
                    strokeDasharray="3 6"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 2,
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
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center max-w-md px-8 mt-80"
        >
          <motion.div
            className="text-6xl font-bold bg-gradient-to-r from-brand-600 via-brand-500 to-brand-700 bg-clip-text text-transparent mb-4"
            animate={{ 
              backgroundPosition: ["0%", "100%", "0%"],
              scale: isHovering ? 1.02 : 1
            }}
            transition={{ 
              backgroundPosition: { duration: 4, repeat: Infinity },
              scale: { duration: 0.2 }
            }}
          >
            400K+
          </motion.div>
          
          <motion.div
            className="text-lg text-muted-foreground mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.4 }}
          >
            users navigating with
          </motion.div>
          
          <motion.div
            className="text-4xl font-bold bg-gradient-to-r from-brand-700 via-brand-600 to-brand-500 bg-clip-text text-transparent mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.4 }}
          >
            50M+ AI routes
          </motion.div>
          
          <motion.div
            className="inline-flex items-center space-x-2 bg-card/80 backdrop-blur-sm border border-border rounded-full px-6 py-2 shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4, duration: 0.3 }}
            whileHover={{ scale: 1.02, boxShadow: `0 8px 25px hsl(var(--brand-500) / 0.2)` }}
          >
            <motion.div 
              className="w-2 h-2 bg-green-500 rounded-full" 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-sm font-medium text-foreground">3D Global Navigation</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Status Indicators */}
      <motion.div 
        className="absolute bottom-8 left-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.5 }}
      >
        <div className="text-xs text-muted-foreground bg-card/80 backdrop-blur-sm rounded-lg p-3 border border-border shadow-lg">
          <div className="flex items-center space-x-2 mb-1">
            <motion.div 
              className="w-1.5 h-1.5 bg-green-500 rounded-full" 
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span>3D Network Active</span>
          </div>
          <div className="flex items-center space-x-2">
            <motion.div 
              className="w-1.5 h-1.5 bg-brand-500 rounded-full" 
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
            <span>Real-time tracking</span>
          </div>
        </div>
      </motion.div>

      {/* Interaction hint */}
      <motion.div
        className="absolute top-1/2 left-8 transform -translate-y-1/2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: isHovering ? 0 : 0.6, x: isHovering ? -20 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-xs text-muted-foreground bg-card/60 backdrop-blur-sm rounded-lg p-2 border border-border/50">
          Move cursor to interact with 3D globe
        </div>
      </motion.div>
    </div>
  )
}
