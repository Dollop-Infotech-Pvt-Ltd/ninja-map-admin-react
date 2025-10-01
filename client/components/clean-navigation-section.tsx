import { motion } from "framer-motion"
import { useRef, useEffect, useState } from "react"

interface CleanNavigationSectionProps {
  variant?: 'login' | 'forgot' | 'verify' | 'reset' | 'default'
}

export function CleanNavigationSection({ variant = 'default' }: CleanNavigationSectionProps) {
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
      className="relative w-full h-full overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-l border-border/50"
    >
      {/* Enhanced Background with clear division */}
      <div className="absolute inset-0">
        {/* Base distinct background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/80 to-purple-50/60 dark:from-slate-900 dark:via-slate-800/90 dark:to-slate-900" />
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.015]" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
             }} 
        />
        
        {/* Hover glow effect */}
        <motion.div
          className="absolute inset-0 opacity-0 transition-opacity duration-700"
          animate={{ opacity: isHovering ? 1 : 0 }}
          style={{
            background: `radial-gradient(circle 600px at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, hsl(var(--brand-500) / 0.08) 0%, transparent 60%)`
          }}
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-12">
        
        {/* Static Navigation Illustration */}
        <motion.div
          className="relative mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Character Avatar with Map */}
          <div className="relative w-64 h-80">
            <svg viewBox="0 0 256 320" className="w-full h-full">
              {/* Character silhouette */}
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                {/* Head */}
                <circle cx="128" cy="70" r="28" fill="hsl(var(--brand-400))" />
                <circle cx="128" cy="70" r="24" fill="hsl(var(--brand-500))" />
                
                {/* Body */}
                <ellipse cx="128" cy="150" rx="35" ry="65" fill="hsl(var(--brand-500))" />
                
                {/* Arms holding map */}
                <ellipse cx="100" cy="140" rx="12" ry="30" fill="hsl(var(--brand-500))" transform="rotate(-20 100 140)" />
                <ellipse cx="156" cy="140" rx="12" ry="30" fill="hsl(var(--brand-500))" transform="rotate(20 156 140)" />
                
                {/* Legs */}
                <ellipse cx="115" cy="220" rx="10" ry="35" fill="hsl(var(--brand-600))" />
                <ellipse cx="141" cy="220" rx="10" ry="35" fill="hsl(var(--brand-600))" />
                
                {/* Feet */}
                <ellipse cx="110" cy="260" rx="15" ry="8" fill="hsl(var(--brand-700))" />
                <ellipse cx="146" cy="260" rx="15" ry="8" fill="hsl(var(--brand-700))" />
              </motion.g>
              
              {/* Map in hands */}
              <motion.g
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <rect x="90" y="120" width="76" height="50" rx="4" fill="white" stroke="hsl(var(--brand-600))" strokeWidth="2"/>
                
                {/* Map details */}
                <path d="M95 130 Q115 125 135 130 Q155 135 161 145 Q150 155 128 150 Q105 155 95 145 Z" fill="hsl(var(--brand-200))" />
                <path d="M95 145 Q115 140 135 145 Q155 150 161 160 Q150 170 128 165 Q105 170 95 160 Z" fill="hsl(var(--brand-100))" />
                
                {/* Route lines */}
                <path d="M100 135 L140 140 M105 150 L145 155 M110 160 L150 162" stroke="hsl(var(--brand-600))" strokeWidth="1.5" />
                
                {/* Location markers */}
                <circle cx="108" cy="142" r="2" fill="hsl(var(--brand-600))" />
                <circle cx="135" cy="152" r="2" fill="hsl(var(--brand-600))" />
                <circle cx="148" cy="158" r="2" fill="hsl(var(--brand-600))" />
              </motion.g>
              
              {/* Backpack */}
              <motion.rect
                x="140" y="90" width="25" height="35" rx="8"
                fill="hsl(var(--brand-600))"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              />
            </svg>
          </div>
          
          {/* Navigation badge */}
          <motion.div
            className="absolute -top-2 -right-2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <div className="bg-white dark:bg-card rounded-full p-3 shadow-lg border border-border/50">
              <svg className="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </motion.div>
          
          {/* Compass indicator */}
          <motion.div
            className="absolute -bottom-2 -left-2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <div className="bg-white dark:bg-card rounded-full p-2 shadow-lg border border-border/50">
              <svg className="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
                <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88 16.24,7.76"/>
              </svg>
            </div>
          </motion.div>
        </motion.div>

        {/* Content Text */}
        <motion.div
          className="text-center max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <h3 className="text-2xl font-bold text-foreground/90 mb-3">
            Navigate with Confidence
          </h3>
          <p className="text-muted-foreground/80 text-base leading-relaxed">
            Your intelligent navigation companion for seamless journeys and precise routing.
          </p>
        </motion.div>

        {/* Feature indicators */}
        <motion.div
          className="flex items-center space-x-6 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>Real-time Navigation</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span>Smart Routing</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
