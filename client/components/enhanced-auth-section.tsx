import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Shield, Key, Mail, Lock, Zap, Star, Users, Database, Settings, Activity } from "lucide-react"
import { useRef, useEffect, useState } from "react"

interface EnhancedAuthSectionProps {
  variant?: 'login' | 'forgot' | 'verify' | 'reset' | 'default'
}

export function EnhancedAuthSection({ variant = 'default' }: EnhancedAuthSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const springX = useSpring(mouseX, { stiffness: 150, damping: 25 })
  const springY = useSpring(mouseY, { stiffness: 150, damping: 25 })
  
  const rotateX = useTransform(springY, [-300, 300], [2, -2])
  const rotateY = useTransform(springX, [-300, 300], [-2, 2])

  // Variant-specific configurations
  const variantConfig = {
    login: {
      title: "Secure Platform Access",
      subtitle: "Your gateway to intelligent data management and analytics",
      mainIcon: Shield,
      accentColor: "from-blue-400 to-purple-600",
      particles: 6
    },
    forgot: {
      title: "Account Recovery",
      subtitle: "Secure password recovery with advanced encryption protocols",
      mainIcon: Key,
      accentColor: "from-orange-400 to-red-600",
      particles: 4
    },
    verify: {
      title: "Identity Verification",
      subtitle: "Multi-factor authentication ensuring maximum security",
      mainIcon: Mail,
      accentColor: "from-green-400 to-teal-600",
      particles: 8
    },
    reset: {
      title: "Password Reset",
      subtitle: "Create a new secure password with enterprise-grade protection",
      mainIcon: Lock,
      accentColor: "from-purple-400 to-pink-600",
      particles: 5
    },
    default: {
      title: "Enterprise Dashboard",
      subtitle: "Comprehensive platform for data analytics and user management",
      mainIcon: Database,
      accentColor: "from-brand-400 to-brand-700",
      particles: 6
    }
  }

  const config = variantConfig[variant]
  const MainIcon = config.mainIcon

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
      className="relative w-full h-full overflow-hidden transition-all duration-300"
    >
      {/* Enhanced Background with Hover Glow */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50/30 via-background to-brand-100/40 dark:from-background dark:via-brand-950/15 dark:to-background transition-all duration-500" />
        
        {/* Hover glow effect */}
        <motion.div
          className="absolute inset-0 opacity-0 transition-opacity duration-500"
          animate={{
            opacity: isHovering ? 1 : 0
          }}
          style={{
            background: `radial-gradient(circle 600px at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, hsl(var(--brand-500) / 0.15) 0%, hsl(var(--brand-600) / 0.08) 40%, transparent 70%)`
          }}
        />
        
        {/* Floating orbs */}
        <motion.div 
          className="absolute top-20 right-16 w-40 h-40 rounded-full blur-2xl opacity-60"
          style={{
            background: 'hsl(var(--brand-400) / 0.1)'
          }}
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.8, 0.4],
            x: [0, 25, 0],
            y: [0, -15, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div 
          className="absolute bottom-32 left-20 w-60 h-60 rounded-full blur-3xl opacity-40"
          style={{
            background: 'hsl(var(--brand-500) / 0.08)'
          }}
          animate={{ 
            scale: [1.1, 0.8, 1.1],
            opacity: [0.3, 0.7, 0.3],
            x: [0, -20, 0],
            y: [0, 20, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div 
          className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full blur-xl opacity-50"
          style={{
            background: 'hsl(var(--brand-600) / 0.06)'
          }}
          animate={{ 
            scale: [0.8, 1.4, 0.8],
            opacity: [0.5, 0.2, 0.5],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Main Content with 3D Transform */}
      <motion.div 
        className="relative z-10 w-full h-full flex items-center justify-center"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        <div className="relative">
          {/* Central Feature Hub */}
          <motion.div
            className="absolute top-16 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1, type: "spring" }}
          >
            <motion.div
              className="relative"
              animate={{ 
                y: [-6, 6, -6],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.2, rotate: 10 }}
            >
              <div className={`w-20 h-20 bg-gradient-to-br ${config.accentColor} rounded-3xl flex items-center justify-center shadow-2xl border-2 border-white/40 backdrop-blur-sm`}>
                <MainIcon className="w-10 h-10 text-white drop-shadow-lg" />
              </div>
              <motion.div 
                className="absolute -inset-6 rounded-3xl blur-xl"
                style={{
                  background: 'hsl(var(--brand-500) / 0.3)'
                }}
                animate={{ 
                  scale: [1, 1.5, 1], 
                  opacity: [0.8, 0.4, 0.8] 
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>

          {/* Supporting Feature Elements */}
          {[
            { Icon: Users, position: "top-20 right-24", delay: 1, title: "User Management" },
            { Icon: Settings, position: "bottom-28 left-20", delay: 1.5, title: "System Config" },
            { Icon: Activity, position: "top-44 left-16", delay: 2, title: "Analytics" },
            { Icon: Star, position: "bottom-20 right-28", delay: 2.5, title: "Premium Features" },
            { Icon: Zap, position: "top-32 right-12", delay: 3, title: "Performance" },
          ].map(({ Icon, position, delay, title }, index) => (
            <motion.div
              key={index}
              className={`absolute ${position}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay, duration: 0.8, type: "spring" }}
              whileHover={{ scale: 1.3 }}
            >
              <motion.div
                className="group relative"
                animate={{ 
                  y: [-(index + 2), (index + 2), -(index + 2)],
                  rotate: [0, index * 10, 0]
                }}
                transition={{ 
                  duration: 6 + index, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                <div className={`w-${12 + (index % 2)} h-${12 + (index % 2)} bg-gradient-to-br from-brand-400 to-brand-600 rounded-2xl flex items-center justify-center shadow-xl border border-white/30 backdrop-blur-sm`}>
                  <Icon className={`w-${5 + (index % 2)} h-${5 + (index % 2)} text-white drop-shadow-md`} />
                </div>
                <motion.div 
                  className="absolute -inset-3 rounded-2xl blur-lg"
                  style={{
                    background: 'hsl(var(--brand-500) / 0.15)'
                  }}
                  animate={{ 
                    scale: [1, 1.4, 1], 
                    opacity: [0.6, 0.2, 0.6] 
                  }}
                  transition={{ duration: 4 + index, repeat: Infinity }}
                />
                {/* Tooltip */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="bg-card/90 backdrop-blur-sm border border-border/50 rounded-lg px-2 py-1 text-xs text-foreground whitespace-nowrap shadow-lg">
                    {title}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}

          {/* Data Flow Visualization */}
          <motion.svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
            viewBox="0 0 600 400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 3.5, duration: 2 }}
          >
            {/* Connection lines representing data flow */}
            <motion.path
              d="M150 200 Q250 150 350 200 Q450 250 550 200"
              stroke="url(#dataFlowGradient)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="8 4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 4, delay: 4, repeat: Infinity, repeatType: "loop" }}
            />
            <motion.path
              d="M100 250 Q200 300 300 250 Q400 200 500 250"
              stroke="url(#dataFlowGradient)"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="6 6"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 5, delay: 4.5, repeat: Infinity, repeatType: "loop" }}
            />
            
            <defs>
              <linearGradient id="dataFlowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--brand-400))" stopOpacity="0.8" />
                <stop offset="50%" stopColor="hsl(var(--brand-500))" stopOpacity="0.6" />
                <stop offset="100%" stopColor="hsl(var(--brand-600))" stopOpacity="0.4" />
              </linearGradient>
            </defs>
          </motion.svg>

          {/* Floating Data Points */}
          {[...Array(config.particles)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                left: `${20 + (i * 80)}px`,
                top: `${100 + (i * 50)}px`,
                background: 'hsl(var(--brand-400) / 0.7)'
              }}
              animate={{
                y: [-(25 + i * 5), (25 + i * 5), -(25 + i * 5)],
                opacity: [0.4, 1, 0.4],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: 5 + (i * 0.8),
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Enhanced Content Overlay */}
      <motion.div
        className="absolute bottom-16 left-8 right-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 5, duration: 1 }}
      >
        <div className="backdrop-blur-xl bg-card/80 border border-border/50 rounded-2xl p-8 shadow-2xl">
          <motion.h3 
            className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-foreground via-brand-600 to-brand-700 bg-clip-text text-transparent"
            whileHover={{ scale: 1.02 }}
          >
            {config.title}
          </motion.h3>
          <motion.p 
            className="text-muted-foreground text-lg text-center leading-relaxed"
            whileHover={{ scale: 1.01 }}
          >
            {config.subtitle}
          </motion.p>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-brand-500"></div>
              <span>Advanced Security</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-brand-500"></div>
              <span>Real-time Analytics</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-brand-500"></div>
              <span>Role-based Access</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-brand-500"></div>
              <span>Cloud Integration</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
