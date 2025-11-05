import { motion } from "framer-motion"
import { useRef, useEffect, useState } from "react"

interface NavigationAuthSectionProps {
  variant?: 'login' | 'forgot' | 'verify' | 'reset' | 'default'
}

export function NavigationAuthSection({ variant = 'default' }: NavigationAuthSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return
      
      const rect = ref.current.getBoundingClientRect()
      setMousePosition({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height
      })
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    if (ref.current) {
      const element = ref.current
      element.addEventListener('mousemove', handleMouseMove)
      element.addEventListener('mouseenter', handleMouseEnter)
      element.addEventListener('mouseleave', handleMouseLeave)
      
      return () => {
        element.removeEventListener('mousemove', handleMouseMove)
        element.removeEventListener('mouseenter', handleMouseEnter)
        element.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [])

  return (
    <div 
      ref={ref} 
      className="relative w-full h-full overflow-hidden"
    >
      {/* Enhanced Background with Gradient Mesh */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50/40 via-brand-100/20 to-brand-200/30 dark:from-background dark:via-brand-950/5 dark:to-brand-900/10" />
        
        {/* Dynamic hover glow */}
        <motion.div
          className="absolute inset-0 opacity-0 transition-opacity duration-700"
          animate={{ opacity: isHovering ? 1 : 0 }}
          style={{
            background: `radial-gradient(circle 800px at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, hsl(var(--brand-500) / 0.12) 0%, hsl(var(--brand-600) / 0.06) 35%, transparent 70%)`
          }}
        />
        
        {/* Subtle mesh pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]" 
             style={{
               backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--brand-600)) 1px, transparent 0)`,
               backgroundSize: '24px 24px'
             }} 
        />
        
        {/* Floating geometric shapes */}
        <motion.div 
          className="absolute top-[15%] right-[20%] w-32 h-32 rounded-full opacity-20"
          style={{ background: 'linear-gradient(45deg, hsl(var(--brand-400) / 0.1), hsl(var(--brand-500) / 0.05))' }}
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        
        <motion.div 
          className="absolute bottom-[25%] left-[15%] w-20 h-20 rounded-lg opacity-15"
          style={{ background: 'linear-gradient(135deg, hsl(var(--brand-500) / 0.08), hsl(var(--brand-600) / 0.04))' }}
          animate={{ 
            y: [-10, 10, -10],
            rotate: [0, -90, 0],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Main Illustration Container */}
      <div className="relative z-10 w-full h-full flex items-center justify-center p-8">
        <motion.div
          className="relative w-full max-w-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Navigation Traveler Illustration */}
          <div className="relative">
            {/* Character with map */}
            <motion.div
              className="relative mx-auto w-80 h-96"
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Traveler figure */}
              <svg viewBox="0 0 320 400" className="w-full h-full drop-shadow-2xl">
                {/* Backpack */}
                <motion.path
                  d="M140 80 Q135 75 145 75 L175 75 Q185 75 180 80 L185 120 Q185 130 175 130 L145 130 Q135 130 135 120 Z"
                  fill="hsl(var(--brand-600))"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 0.5 }}
                />
                
                {/* Character body */}
                <motion.ellipse
                  cx="160"
                  cy="180"
                  rx="40"
                  ry="80"
                  fill="hsl(var(--brand-500) / 0.8)"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
                
                {/* Head */}
                <motion.circle
                  cx="160"
                  cy="120"
                  r="25"
                  fill="hsl(var(--brand-400))"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                />
                
                {/* Map in hands */}
                <motion.rect
                  x="120"
                  y="200"
                  width="80"
                  height="60"
                  rx="4"
                  fill="hsl(var(--brand-200))"
                  stroke="hsl(var(--brand-600))"
                  strokeWidth="2"
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                />
                
                {/* Map details */}
                <motion.path
                  d="M130 210 Q150 215 170 210 Q185 215 190 225 Q180 235 160 230 Q140 235 130 225 Z"
                  fill="hsl(var(--brand-600) / 0.3)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 1.5 }}
                />
                
                {/* Route lines on map */}
                <motion.path
                  d="M135 220 Q155 225 175 220 M140 235 Q160 240 180 235 M145 245 Q165 250 185 245"
                  stroke="hsl(var(--brand-600))"
                  strokeWidth="1.5"
                  fill="none"
                  strokeDasharray="3 2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 2 }}
                />
                
                {/* Location pins */}
                <motion.circle cx="145" cy="225" r="3" fill="hsl(var(--brand-600))" 
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.5 }} />
                <motion.circle cx="175" cy="235" r="3" fill="hsl(var(--brand-600))" 
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.7 }} />
                <motion.circle cx="165" cy="245" r="3" fill="hsl(var(--brand-600))" 
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.9 }} />
              </svg>
              
              {/* Floating UI elements */}
              <motion.div
                className="absolute -right-4 top-12"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 3, duration: 0.8 }}
              >
                <div className="bg-white/90 dark:bg-card/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-border/50">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-foreground">Route Active</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                className="absolute -left-8 bottom-16"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 3.5, duration: 0.8 }}
              >
                <div className="bg-white/90 dark:bg-card/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-border/50">
                  <div className="text-xs font-medium text-foreground">2.4 km</div>
                  <div className="text-[10px] text-muted-foreground">to destination</div>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Compass decoration */}
            <motion.div
              className="absolute top-8 right-8 w-16 h-16"
              initial={{ opacity: 0, rotate: -180 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: 2, duration: 1 }}
            >
              <div className="w-full h-full rounded-full bg-white/10 dark:bg-card/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <svg viewBox="0 0 24 24" className="w-8 h-8 text-brand-600">
                    <path fill="currentColor" d="M12 2L13.5 8.5L12 15L10.5 8.5L12 2Z"/>
                    <path fill="currentColor" opacity="0.6" d="M12 22L10.5 15.5L12 9L13.5 15.5L12 22Z"/>
                  </svg>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Path indicators */}
            <motion.div
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 4, duration: 0.8 }}
            >
              <div className="flex space-x-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-brand-500"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity, 
                      delay: i * 0.2 
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Minimal footer text */}
      <motion.div
        className="absolute bottom-8 left-0 right-0 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 4.5, duration: 0.8 }}
      >
        <h3 className="text-lg font-semibold text-foreground/90 mb-2">
          Your Journey Starts Here
        </h3>
        <p className="text-sm text-muted-foreground/80 max-w-xs mx-auto leading-relaxed">
          Navigate with confidence using our intelligent platform
        </p>
      </motion.div>

      {/* Ambient lighting */}
      <motion.div
        className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full pointer-events-none opacity-30"
        style={{
          background: `radial-gradient(circle, hsl(var(--brand-400) / ${isHovering ? 0.08 : 0.04}) 0%, transparent 70%)`
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  )
}
