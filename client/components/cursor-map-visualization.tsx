import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { MapPin, Navigation, Compass } from "lucide-react"
import { useRef, useEffect } from "react"

export function CursorMapVisualization() {
  const ref = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 })
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 })
  
  const rotateX = useTransform(springY, [-300, 300], [5, -5])
  const rotateY = useTransform(springX, [-300, 300], [-5, 5])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return
      
      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      mouseX.set(e.clientX - centerX)
      mouseY.set(e.clientY - centerY)
    }

    const handleMouseLeave = () => {
      mouseX.set(0)
      mouseY.set(0)
    }

    if (ref.current) {
      ref.current.addEventListener('mousemove', handleMouseMove)
      ref.current.addEventListener('mouseleave', handleMouseLeave)
    }

    return () => {
      if (ref.current) {
        ref.current.removeEventListener('mousemove', handleMouseMove)
        ref.current.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [mouseX, mouseY])

  return (
    <div ref={ref} className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-none">
      {/* Cursor Glow Effect */}
      <motion.div
        className="fixed w-96 h-96 rounded-full pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2"
        style={{
          background: "radial-gradient(circle, hsl(var(--brand-500) / 0.1) 0%, transparent 70%)",
          x: springX,
          y: springY,
          left: "50%",
          top: "50%",
        }}
      />
      
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50/50 via-background to-brand-100/30 dark:from-background dark:via-card/10 dark:to-background" />
      
      {/* Animated background circles */}
      <motion.div 
        className="absolute top-20 right-20 w-32 h-32 bg-brand-400/10 rounded-full blur-xl" 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-32 left-16 w-40 h-40 bg-brand-500/8 rounded-full blur-xl" 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      
      {/* Main content container with 3D effect */}
      <motion.div 
        className="relative z-10 w-full h-full flex items-center justify-center"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        <div className="relative">
          {/* Enhanced World map SVG with glow */}
          <motion.div
            className="relative"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4 }}
          >
            <motion.svg
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              viewBox="0 0 640 480"
              className="w-[500px] h-[375px] text-brand-600/30 dark:text-brand-400/30 drop-shadow-2xl"
              fill="currentColor"
            >
              {/* Enhanced world map with more detail */}
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3, delay: 0.5 }}
                d="M50 200 Q150 180 250 200 Q350 220 450 200 Q550 180 590 200"
                stroke="url(#mapGradient)"
                strokeWidth="3"
                fill="none"
                className="drop-shadow-lg"
              />
              
              {/* Multiple continents with better shapes */}
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
              >
                {/* North America */}
                <path d="M80 120 Q140 100 180 130 Q200 160 170 200 Q130 220 90 180 Z" className="text-brand-500/40 drop-shadow-md" />
                {/* Europe */}
                <path d="M280 110 Q320 95 350 120 Q370 150 340 180 Q300 190 270 160 Z" className="text-brand-500/35 drop-shadow-md" />
                {/* Asia */}
                <path d="M380 100 Q450 85 520 110 Q560 140 530 180 Q480 200 400 170 Z" className="text-brand-500/45 drop-shadow-md" />
                {/* Africa */}
                <path d="M290 200 Q330 190 350 220 Q370 280 340 320 Q300 330 280 290 Z" className="text-brand-500/38 drop-shadow-md" />
                {/* South America */}
                <path d="M150 220 Q180 210 200 240 Q210 300 180 340 Q150 350 140 310 Z" className="text-brand-500/42 drop-shadow-md" />
                {/* Australia */}
                <path d="M480 280 Q520 270 540 290 Q545 310 520 320 Q490 325 480 300 Z" className="text-brand-500/35 drop-shadow-md" />
              </motion.g>

              <defs>
                <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--brand-400))" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="hsl(var(--brand-500))" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="hsl(var(--brand-600))" stopOpacity="0.4" />
                </linearGradient>
              </defs>
            </motion.svg>
          </motion.div>

          {/* Enhanced floating location pins with 3D effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.6 }}
            className="absolute top-16 left-20"
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div
              animate={{ 
                y: [-3, 3, -3],
                rotateZ: [-2, 2, -2]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="relative"
              whileHover={{ scale: 1.2 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-full flex items-center justify-center shadow-2xl border-2 border-white/20">
                <MapPin className="w-5 h-5 text-white drop-shadow-lg" />
              </div>
              <motion.div 
                className="absolute -inset-3 bg-brand-600/30 rounded-full blur-lg"
                animate={{ 
                  scale: [1, 1.5, 1], 
                  opacity: [0.8, 0.3, 0.8] 
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.3, duration: 0.6 }}
            className="absolute top-12 right-32"
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div
              animate={{ 
                y: [-2, 4, -2],
                rotateZ: [1, -1, 1]
              }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="relative"
              whileHover={{ scale: 1.2 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center shadow-xl border border-white/20">
                <Navigation className="w-4 h-4 text-white drop-shadow-md" />
              </div>
              <motion.div 
                className="absolute -inset-2 bg-brand-500/25 rounded-full blur-md"
                animate={{ 
                  scale: [1, 1.4, 1], 
                  opacity: [0.7, 0.2, 0.7] 
                }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.6, duration: 0.6 }}
            className="absolute bottom-16 left-40"
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div
              animate={{ 
                y: [-1, 3, -1],
                rotateZ: [-1, 1, -1]
              }}
              transition={{ duration: 3.5, repeat: Infinity }}
              className="relative"
              whileHover={{ scale: 1.2 }}
            >
              <div className="w-9 h-9 bg-gradient-to-br from-brand-600 to-brand-800 rounded-full flex items-center justify-center shadow-2xl border border-white/30">
                <Compass className="w-5 h-5 text-white drop-shadow-lg" />
              </div>
              <motion.div 
                className="absolute -inset-2.5 bg-brand-700/20 rounded-full blur-lg"
                animate={{ 
                  scale: [1, 1.6, 1], 
                  opacity: [0.6, 0.1, 0.6] 
                }}
                transition={{ duration: 3.5, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>

          {/* Enhanced connection lines with glow */}
          <motion.svg
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 1.5 }}
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 500 375"
          >
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 3 }}
              d="M80 64 Q150 100 240 48"
              stroke="url(#connectionGradient)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="6 6"
              className="drop-shadow-lg"
            />
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 3.3 }}
              d="M80 64 Q120 150 160 192"
              stroke="url(#connectionGradient)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="6 6"
              className="drop-shadow-lg"
            />
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 3.6 }}
              d="M240 48 Q300 100 160 192"
              stroke="url(#connectionGradient)"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="4 8"
              className="drop-shadow-md"
            />
            <defs>
              <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--brand-400))" stopOpacity="0.8" />
                <stop offset="50%" stopColor="hsl(var(--brand-500))" stopOpacity="0.6" />
                <stop offset="100%" stopColor="hsl(var(--brand-600))" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </motion.svg>
        </div>
      </motion.div>

      {/* Enhanced overlay text */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 4, duration: 1 }}
        className="absolute bottom-12 left-8 right-8 text-center"
      >
        <h3 className="text-3xl font-bold text-foreground/90 mb-3 drop-shadow-lg">
          Navigate Your <span className="text-brand-600">Journey</span>
        </h3>
        <p className="text-muted-foreground/80 text-base max-w-lg mx-auto leading-relaxed">
          Discover new paths and explore endless possibilities with our intelligent navigation platform. 
          Every destination becomes an adventure.
        </p>
      </motion.div>
    </div>
  )
}
