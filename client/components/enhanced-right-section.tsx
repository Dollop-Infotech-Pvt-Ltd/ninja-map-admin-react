import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { MapPin, Navigation, Compass, Route, Globe, Zap, Star, TrendingUp } from "lucide-react"
import { useRef, useEffect, useState } from "react"

export function EnhancedRightSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const springX = useSpring(mouseX, { stiffness: 200, damping: 30 })
  const springY = useSpring(mouseY, { stiffness: 200, damping: 30 })
  
  const parallaxX = useTransform(springX, [-300, 300], [-15, 15])
  const parallaxY = useTransform(springY, [-300, 300], [-10, 10])
  const rotateX = useTransform(springY, [-300, 300], [3, -3])
  const rotateY = useTransform(springX, [-300, 300], [-3, 3])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return
      
      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const x = e.clientX - centerX
      const y = e.clientY - centerY
      
      mouseX.set(x)
      mouseY.set(y)
      
      // For more precise cursor tracking
      setMousePosition({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height
      })
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => {
      setIsHovering(false)
      mouseX.set(0)
      mouseY.set(0)
    }

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
  }, [mouseX, mouseY])

  return (
    <div 
      ref={ref} 
      className="relative w-full h-full overflow-hidden"
      style={{ cursor: isHovering ? 'none' : 'default' }}
    >
      {/* Custom Cursor */}
      {isHovering && (
        <motion.div
          className="fixed w-8 h-8 rounded-full pointer-events-none z-50 mix-blend-difference"
          style={{
            left: mousePosition.x * 100 + '%',
            top: mousePosition.y * 100 + '%',
            x: '-50%',
            y: '-50%',
            background: 'linear-gradient(45deg, hsl(var(--brand-500)), hsl(var(--brand-600)))',
          }}
          animate={{
            scale: isHovering ? 1 : 0,
            opacity: isHovering ? 0.8 : 0,
          }}
          transition={{ duration: 0.2 }}
        />
      )}

      {/* Multi-layered Background with Depth */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50/20 via-background to-brand-100/30 dark:from-background dark:via-brand-950/10 dark:to-background" />
        
        {/* Depth layers */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-brand-400/5 to-brand-600/10"
          style={{ x: parallaxX, y: parallaxY }}
        />
        
        {/* Animated mesh gradient */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, hsl(var(--brand-500) / 0.1) 0%, transparent 50%)`
          }}
        />
        
        {/* Floating orbs for depth */}
        <motion.div 
          className="absolute top-20 right-16 w-40 h-40 bg-brand-400/8 rounded-full blur-2xl" 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 20, 0],
            y: [0, -10, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ x: useTransform(springX, [-300, 300], [-10, 10]) }}
        />
        
        <motion.div 
          className="absolute bottom-32 left-20 w-60 h-60 bg-brand-500/6 rounded-full blur-3xl" 
          animate={{ 
            scale: [1.1, 0.9, 1.1],
            opacity: [0.2, 0.5, 0.2],
            x: [0, -15, 0],
            y: [0, 15, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{ x: useTransform(springX, [-300, 300], [15, -15]) }}
        />
        
        <motion.div 
          className="absolute top-1/2 left-1/3 w-32 h-32 bg-brand-600/4 rounded-full blur-xl" 
          animate={{ 
            scale: [0.8, 1.3, 0.8],
            opacity: [0.4, 0.1, 0.4],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          style={{ y: useTransform(springY, [-300, 300], [-20, 20]) }}
        />
      </div>

      {/* Main Content Container with 3D Transform */}
      <motion.div 
        className="relative z-10 w-full h-full flex items-center justify-center"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        <div className="relative">
          {/* Enhanced Navigation Illustration */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Main world map with enhanced details */}
            <svg
              viewBox="0 0 600 450"
              className="w-[600px] h-[450px] drop-shadow-2xl"
              fill="none"
            >
              {/* Enhanced world map with better detail */}
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1.5 }}
              >
                {/* Continents with enhanced shapes */}
                <motion.path
                  d="M80 150 Q120 130 160 140 Q200 145 220 170 Q200 200 160 210 Q120 205 80 185 Z"
                  fill="url(#continentGradient1)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.6 }}
                  transition={{ duration: 2, delay: 1 }}
                />
                <motion.path
                  d="M250 120 Q300 100 350 110 Q400 115 420 140 Q400 170 350 180 Q300 175 250 155 Z"
                  fill="url(#continentGradient2)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.6 }}
                  transition={{ duration: 2, delay: 1.3 }}
                />
                <motion.path
                  d="M450 130 Q500 110 550 120 Q580 125 590 150 Q580 180 550 190 Q500 185 450 165 Z"
                  fill="url(#continentGradient3)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.6 }}
                  transition={{ duration: 2, delay: 1.6 }}
                />
                
                {/* Additional continents for completeness */}
                <motion.path
                  d="M280 200 Q320 185 340 200 Q360 240 340 280 Q320 295 280 275 Q260 240 280 200 Z"
                  fill="url(#continentGradient4)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.5 }}
                  transition={{ duration: 2, delay: 1.9 }}
                />
                <motion.path
                  d="M150 230 Q180 215 200 230 Q210 270 190 300 Q170 315 150 295 Q130 270 150 230 Z"
                  fill="url(#continentGradient5)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.5 }}
                  transition={{ duration: 2, delay: 2.2 }}
                />
                <motion.path
                  d="M480 250 Q510 235 530 250 Q535 270 520 285 Q500 290 480 275 Z"
                  fill="url(#continentGradient6)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.4 }}
                  transition={{ duration: 2, delay: 2.5 }}
                />
              </motion.g>

              {/* Enhanced connection network */}
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3, duration: 2 }}
                stroke="url(#connectionGradient)"
                strokeWidth="2"
                fill="none"
              >
                <motion.path
                  d="M150 175 Q200 150 280 160 Q350 165 450 150"
                  strokeDasharray="8 4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 3, delay: 3 }}
                />
                <motion.path
                  d="M150 175 Q180 220 280 240 Q380 250 520 270"
                  strokeDasharray="6 6"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 3, delay: 3.5 }}
                />
                <motion.path
                  d="M280 160 Q320 200 280 240 Q350 280 450 150"
                  strokeDasharray="4 8"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 3, delay: 4 }}
                />
              </motion.g>

              {/* Enhanced grid overlay */}
              <motion.g
                stroke="hsl(var(--brand-500))"
                strokeWidth="0.5"
                opacity="0.2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{ delay: 2, duration: 1 }}
              >
                {[...Array(12)].map((_, i) => (
                  <motion.line
                    key={`h-${i}`}
                    x1="50"
                    y1={80 + i * 30}
                    x2="550"
                    y2={80 + i * 30}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 2 + i * 0.1 }}
                  />
                ))}
                {[...Array(18)].map((_, i) => (
                  <motion.line
                    key={`v-${i}`}
                    x1={50 + i * 28}
                    y1="80"
                    x2={50 + i * 28}
                    y2="370"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 2.5 + i * 0.05 }}
                  />
                ))}
              </motion.g>

              {/* Gradients */}
              <defs>
                <linearGradient id="continentGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--brand-400))" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="hsl(var(--brand-600))" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="continentGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--brand-500))" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="hsl(var(--brand-700))" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="continentGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--brand-600))" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="hsl(var(--brand-500))" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="continentGradient4" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--brand-400))" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="hsl(var(--brand-700))" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="continentGradient5" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--brand-500))" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="hsl(var(--brand-600))" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="continentGradient6" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--brand-400))" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="hsl(var(--brand-500))" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--brand-400))" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="hsl(var(--brand-500))" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="hsl(var(--brand-600))" stopOpacity="0.4" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          {/* Enhanced Interactive Elements */}
          {/* Main Hub */}
          <motion.div
            className="absolute top-20 left-32"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 4, duration: 0.8, type: "spring" }}
            style={{ 
              x: useTransform(springX, [-300, 300], [-8, 8]),
              y: useTransform(springY, [-300, 300], [-5, 5])
            }}
          >
            <motion.div
              className="relative"
              animate={{ 
                y: [-4, 4, -4],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.3, rotate: 10 }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-brand-400 to-brand-700 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-white/30">
                <Globe className="w-7 h-7 text-white drop-shadow-lg" />
              </div>
              <motion.div
                className="absolute -inset-4 rounded-2xl blur-xl"
                style={{
                  background: 'hsl(var(--brand-500) / 0.2)'
                }}
                animate={{ 
                  scale: [1, 1.4, 1], 
                  opacity: [0.7, 0.3, 0.7] 
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              {/* Energy pulse */}
              <motion.div
                className="absolute -inset-2 border-2 border-brand-400/50 rounded-2xl"
                animate={{
                  scale: [1, 2, 1],
                  opacity: [0.8, 0, 0.8]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>

          {/* Navigation Points */}
          <motion.div
            className="absolute top-12 right-24"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 4.5, duration: 0.8, type: "spring" }}
            style={{ 
              x: useTransform(springX, [-300, 300], [6, -6]),
              y: useTransform(springY, [-300, 300], [3, -3])
            }}
          >
            <motion.div
              animate={{ 
                y: [-2, 6, -2],
                rotate: [0, -10, 10, 0]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.2, rotate: -15 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-xl border border-white/20">
                <Navigation className="w-5 h-5 text-white drop-shadow-md" />
              </div>
              <motion.div
                className="absolute -inset-3 rounded-xl blur-lg"
                style={{
                  background: 'hsl(var(--brand-500) / 0.15)'
                }}
                animate={{ 
                  scale: [1, 1.5, 1], 
                  opacity: [0.6, 0.2, 0.6] 
                }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute bottom-20 left-28"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 5, duration: 0.8, type: "spring" }}
            style={{ 
              x: useTransform(springX, [-300, 300], [-5, 5]),
              y: useTransform(springY, [-300, 300], [8, -8])
            }}
          >
            <motion.div
              animate={{ 
                y: [-3, 3, -3],
                rotate: [0, 15, -15, 0]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.25, rotate: 20 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-brand-600 to-brand-800 rounded-xl flex items-center justify-center shadow-2xl border border-white/40">
                <Compass className="w-6 h-6 text-white drop-shadow-lg" />
              </div>
              <motion.div
                className="absolute -inset-3 rounded-xl blur-lg"
                style={{
                  background: 'hsl(var(--brand-700) / 0.15)'
                }}
                animate={{ 
                  scale: [1, 1.6, 1], 
                  opacity: [0.5, 0.1, 0.5] 
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>

          {/* Route indicators */}
          <motion.div
            className="absolute top-32 right-16"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 5.5, duration: 0.6, type: "spring" }}
            style={{ 
              x: useTransform(springX, [-300, 300], [4, -4]),
              y: useTransform(springY, [-300, 300], [-3, 3])
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              whileHover={{ scale: 1.1 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-brand-400 to-brand-500 rounded-full flex items-center justify-center shadow-lg">
                <Route className="w-4 h-4 text-white" />
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute bottom-32 right-32"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 6, duration: 0.6, type: "spring" }}
            style={{ 
              x: useTransform(springX, [-300, 300], [-3, 3]),
              y: useTransform(springY, [-300, 300], [5, -5])
            }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.2 }}
            >
              <div className="w-7 h-7 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center shadow-md">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
            </motion.div>
          </motion.div>

          {/* Floating particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: 'hsl(var(--brand-400) / 0.6)',
                left: `${20 + (i * 60)}px`,
                top: `${100 + (i * 40)}px`,
              }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0.3, 0.8, 0.3],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: 3 + (i * 0.5),
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Enhanced overlay content */}
      <motion.div
        className="absolute bottom-16 left-8 right-8 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 6.5, duration: 1 }}
        style={{
          y: useTransform(springY, [-200, 200], [-5, 5])
        }}
      >
        <motion.h3 
          className="text-4xl font-bold text-foreground/95 mb-4 bg-gradient-to-r from-foreground to-brand-600 bg-clip-text text-transparent"
          whileHover={{ scale: 1.05 }}
        >
          Navigate Your <span className="text-brand-600">Journey</span>
        </motion.h3>
        <motion.p 
          className="text-muted-foreground/90 text-lg max-w-2xl mx-auto leading-relaxed"
          whileHover={{ scale: 1.02 }}
        >
          Discover new paths and explore endless possibilities with our intelligent navigation platform. 
          Every destination becomes an adventure waiting to unfold.
        </motion.p>
      </motion.div>

      {/* Ambient light effects */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, hsl(var(--brand-400) / ${isHovering ? 0.15 : 0.08}) 0%, transparent 70%)`,
          x: useTransform(springX, [-300, 300], [-30, 30]),
          y: useTransform(springY, [-300, 300], [-20, 20])
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  )
}
