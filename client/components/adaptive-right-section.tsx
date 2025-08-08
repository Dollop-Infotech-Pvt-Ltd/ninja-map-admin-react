import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { MapPin, Navigation, Compass, Route, Globe, Zap, Star, TrendingUp, Shield, Key, Mail, Lock } from "lucide-react"
import { useRef, useEffect, useState } from "react"

interface AdaptiveRightSectionProps {
  variant?: 'login' | 'forgot' | 'verify' | 'reset' | 'default'
  primaryColor?: string
}

export function AdaptiveRightSection({ 
  variant = 'default',
  primaryColor = 'brand'
}: AdaptiveRightSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const springX = useSpring(mouseX, { stiffness: 200, damping: 30 })
  const springY = useSpring(mouseY, { stiffness: 200, damping: 30 })
  
  const parallaxX = useTransform(springX, [-300, 300], [-15, 15])
  const parallaxY = useTransform(springY, [-300, 300], [-10, 10])
  const rotateX = useTransform(springY, [-300, 300], [2, -2])
  const rotateY = useTransform(springX, [-300, 300], [-2, 2])

  // Variant-specific configurations
  const variantConfig = {
    login: {
      title: "Welcome to Your Journey",
      subtitle: "Secure access to infinite possibilities",
      accentIcon: Shield,
      particles: 6,
      primaryGradient: "from-brand-400 to-brand-700"
    },
    forgot: {
      title: "Recovery Made Simple",
      subtitle: "Regain access to your navigation hub",
      accentIcon: Key,
      particles: 4,
      primaryGradient: "from-orange-400 to-red-600"
    },
    verify: {
      title: "Verification Portal",
      subtitle: "Confirming your secure passage",
      accentIcon: Mail,
      particles: 8,
      primaryGradient: "from-green-400 to-blue-600"
    },
    reset: {
      title: "New Beginnings",
      subtitle: "Creating your secure pathway",
      accentIcon: Lock,
      particles: 5,
      primaryGradient: "from-purple-400 to-pink-600"
    },
    default: {
      title: "Navigate Your Journey",
      subtitle: "Every destination becomes an adventure",
      accentIcon: Globe,
      particles: 6,
      primaryGradient: "from-brand-400 to-brand-700"
    }
  }

  const config = variantConfig[variant]
  const AccentIcon = config.accentIcon

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
      className="relative w-full h-full overflow-hidden enhanced-depth"
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
            background: `linear-gradient(45deg, hsl(var(--${primaryColor}-500)), hsl(var(--${primaryColor}-600)))`,
          }}
          animate={{
            scale: isHovering ? 1 : 0,
            opacity: isHovering ? 0.8 : 0,
          }}
          transition={{ duration: 0.2 }}
        />
      )}

      {/* Enhanced Multi-layered Background */}
      <div className="absolute inset-0">
        <div className={`absolute inset-0 bg-gradient-to-br from-${primaryColor}-50/20 via-background to-${primaryColor}-100/30 dark:from-background dark:via-${primaryColor}-950/10 dark:to-background`} />
        
        <motion.div 
          className={`absolute inset-0 bg-gradient-to-tr from-transparent via-${primaryColor}-400/5 to-${primaryColor}-600/10`}
          style={{ x: parallaxX, y: parallaxY }}
        />
        
        <motion.div
          className="absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, hsl(var(--${primaryColor}-500) / 0.15) 0%, transparent 60%)`
          }}
        />
        
        {/* Dynamic floating orbs based on variant */}
        <motion.div 
          className={`absolute top-20 right-16 w-40 h-40 bg-${primaryColor}-400/8 rounded-full blur-2xl`}
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.7, 0.3],
            x: [0, variant === 'verify' ? 30 : 20, 0],
            y: [0, variant === 'reset' ? -15 : -10, 0]
          }}
          transition={{ duration: variant === 'login' ? 6 : 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ x: useTransform(springX, [-300, 300], [-10, 10]) }}
        />
        
        <motion.div 
          className={`absolute bottom-32 left-20 w-60 h-60 bg-${primaryColor}-500/6 rounded-full blur-3xl`}
          animate={{ 
            scale: [1.1, 0.8, 1.1],
            opacity: [0.2, 0.6, 0.2],
            x: [0, variant === 'forgot' ? -20 : -15, 0],
            y: [0, variant === 'verify' ? 20 : 15, 0]
          }}
          transition={{ duration: variant === 'reset' ? 12 : 10, repeat: Infinity, ease: "easeInOut" }}
          style={{ x: useTransform(springX, [-300, 300], [15, -15]) }}
        />
      </div>

      {/* Main Content with 3D Transform */}
      <motion.div 
        className="relative z-10 w-full h-full flex items-center justify-center gpu-accelerated"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        <div className="relative">
          {/* Central Hub with variant-specific styling */}
          <motion.div
            className="absolute top-20 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 1, type: "spring" }}
            style={{ 
              x: useTransform(springX, [-300, 300], [-12, 12]),
              y: useTransform(springY, [-300, 300], [-8, 8])
            }}
          >
            <motion.div
              className="relative"
              animate={{ 
                y: [-6, 6, -6],
                rotate: variant === 'verify' ? [0, 10, -10, 0] : [0, 5, -5, 0]
              }}
              transition={{ 
                duration: variant === 'login' ? 8 : 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              whileHover={{ scale: 1.4, rotate: variant === 'reset' ? 15 : 10 }}
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${config.primaryGradient} rounded-3xl flex items-center justify-center shadow-2xl border-2 border-white/40`}>
                <AccentIcon className="w-8 h-8 text-white drop-shadow-lg" />
              </div>
              <motion.div 
                className={`absolute -inset-5 bg-${primaryColor}-500/25 rounded-3xl blur-xl`}
                animate={{ 
                  scale: [1, 1.5, 1], 
                  opacity: [0.8, 0.3, 0.8] 
                }}
                transition={{ duration: variant === 'verify' ? 2 : 3, repeat: Infinity }}
              />
              {/* Enhanced energy pulse */}
              <motion.div
                className={`absolute -inset-3 border-2 border-${primaryColor}-400/60 rounded-3xl`}
                animate={{
                  scale: [1, 2.5, 1],
                  opacity: [0.9, 0, 0.9]
                }}
                transition={{ 
                  duration: variant === 'forgot' ? 3 : 2.5, 
                  repeat: Infinity,
                  delay: variant === 'reset' ? 0.5 : 0
                }}
              />
            </motion.div>
          </motion.div>

          {/* Satellite Navigation Elements */}
          {[
            { Icon: Navigation, position: "top-16 right-20", delay: 2, scale: 1.2 },
            { Icon: Compass, position: "bottom-24 left-16", delay: 2.5, scale: 1.3 },
            { Icon: Route, position: "top-40 left-20", delay: 3, scale: 1.0 },
            { Icon: TrendingUp, position: "bottom-16 right-24", delay: 3.5, scale: 1.1 },
          ].map(({ Icon, position, delay, scale }, index) => (
            <motion.div
              key={index}
              className={`absolute ${position}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay, duration: 0.8, type: "spring" }}
              style={{ 
                x: useTransform(springX, [-300, 300], [
                  index % 2 === 0 ? 6 : -6, 
                  index % 2 === 0 ? -6 : 6
                ]),
                y: useTransform(springY, [-300, 300], [
                  index % 2 === 0 ? -4 : 4,
                  index % 2 === 0 ? 4 : -4
                ])
              }}
            >
              <motion.div
                animate={{ 
                  y: [-(index + 2), (index + 2), -(index + 2)],
                  rotate: variant === 'verify' 
                    ? [0, index * 20, -(index * 20), 0]
                    : [0, index * 15, 0]
                }}
                transition={{ 
                  duration: 4 + index, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                whileHover={{ scale: scale * 1.3, rotate: index * 25 }}
              >
                <div className={`w-${8 + index} h-${8 + index} bg-gradient-to-br from-${primaryColor}-${400 + index * 50} to-${primaryColor}-${600 + index * 50} rounded-xl flex items-center justify-center shadow-xl border border-white/30`}>
                  <Icon className={`w-${4 + index} h-${4 + index} text-white drop-shadow-md`} />
                </div>
                <motion.div 
                  className={`absolute -inset-${2 + index} bg-${primaryColor}-${500 + index * 50}/20 rounded-xl blur-lg`}
                  animate={{ 
                    scale: [1, 1.4 + (index * 0.2), 1], 
                    opacity: [0.7 - (index * 0.1), 0.2, 0.7 - (index * 0.1)] 
                  }}
                  transition={{ duration: 3 + index, repeat: Infinity }}
                />
              </motion.div>
            </motion.div>
          ))}

          {/* Floating particles with variant-specific count */}
          {[...Array(config.particles)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-${i % 2 === 0 ? 2 : 3} h-${i % 2 === 0 ? 2 : 3} bg-${primaryColor}-${400 + (i * 50)}/70 rounded-full`}
              style={{
                left: `${15 + (i * 70)}px`,
                top: `${80 + (i * 45)}px`,
              }}
              animate={{
                y: [-(20 + i * 5), (20 + i * 5), -(20 + i * 5)],
                opacity: [0.3, 0.9, 0.3],
                scale: [0.6, 1.4, 0.6]
              }}
              transition={{
                duration: 4 + (i * 0.8),
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Enhanced Overlay Content */}
      <motion.div
        className="absolute bottom-20 left-8 right-8 text-center glass-morphism rounded-2xl p-6"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 4, duration: 1.2 }}
        style={{
          y: useTransform(springY, [-200, 200], [-8, 8])
        }}
      >
        <motion.h3 
          className={`text-4xl font-bold text-foreground/95 mb-4 bg-gradient-to-r from-foreground via-${primaryColor}-600 to-${primaryColor}-700 bg-clip-text text-transparent`}
          whileHover={{ scale: 1.05 }}
        >
          {config.title}
        </motion.h3>
        <motion.p 
          className="text-muted-foreground/90 text-lg max-w-2xl mx-auto leading-relaxed"
          whileHover={{ scale: 1.02 }}
        >
          {config.subtitle}
        </motion.p>
      </motion.div>

      {/* Ambient lighting effect */}
      <motion.div
        className="absolute top-1/3 right-1/3 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, hsl(var(--${primaryColor}-400) / ${isHovering ? 0.2 : 0.12}) 0%, transparent 70%)`,
          x: useTransform(springX, [-300, 300], [-40, 40]),
          y: useTransform(springY, [-300, 300], [-30, 30])
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.6, 1, 0.6]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  )
}
