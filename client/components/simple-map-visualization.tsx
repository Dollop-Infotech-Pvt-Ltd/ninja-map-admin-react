import { motion } from "framer-motion"
import { MapPin, Navigation, Compass } from "lucide-react"

export function SimpleMapVisualization() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
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
      
      {/* Main content container */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <div className="relative">
          {/* World map SVG */}
          <motion.svg
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            viewBox="0 0 640 480"
            className="w-[500px] h-[375px] text-brand-600/30 dark:text-brand-400/30"
            fill="currentColor"
          >
            {/* Simple world map outline */}
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, delay: 0.5 }}
              d="M50 200 Q150 180 250 200 Q350 220 450 200 Q550 180 590 200"
              stroke="hsl(var(--brand-500))"
              strokeWidth="3"
              fill="none"
              opacity="0.6"
            />
            
            {/* Continents */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
            >
              <path d="M80 120 Q140 100 180 130 Q200 160 170 200 Q130 220 90 180 Z" className="text-brand-500/40" />
              <path d="M280 110 Q320 95 350 120 Q370 150 340 180 Q300 190 270 160 Z" className="text-brand-500/35" />
              <path d="M380 100 Q450 85 520 110 Q560 140 530 180 Q480 200 400 170 Z" className="text-brand-500/45" />
              <path d="M290 200 Q330 190 350 220 Q370 280 340 320 Q300 330 280 290 Z" className="text-brand-500/38" />
              <path d="M150 220 Q180 210 200 240 Q210 300 180 340 Q150 350 140 310 Z" className="text-brand-500/42" />
              <path d="M480 280 Q520 270 540 290 Q545 310 520 320 Q490 325 480 300 Z" className="text-brand-500/35" />
            </motion.g>
          </motion.svg>

          {/* Floating location pins */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.6 }}
            className="absolute top-16 left-20"
          >
            <motion.div
              animate={{ y: [-3, 3, -3] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="relative"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-full flex items-center justify-center shadow-2xl">
                <MapPin className="w-5 h-5 text-white" />
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
          >
            <motion.div
              animate={{ y: [-2, 4, -2] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="relative"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center shadow-xl">
                <Navigation className="w-4 h-4 text-white" />
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
          >
            <motion.div
              animate={{ y: [-1, 3, -1] }}
              transition={{ duration: 3.5, repeat: Infinity }}
              className="relative"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-brand-600 to-brand-800 rounded-full flex items-center justify-center shadow-2xl">
                <Compass className="w-5 h-5 text-white" />
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

          {/* Connection lines */}
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
              stroke="hsl(var(--brand-500))"
              strokeWidth="2"
              fill="none"
              strokeDasharray="6 6"
              opacity="0.6"
            />
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 3.3 }}
              d="M80 64 Q120 150 160 192"
              stroke="hsl(var(--brand-500))"
              strokeWidth="2"
              fill="none"
              strokeDasharray="6 6"
              opacity="0.6"
            />
          </motion.svg>
        </div>
      </div>

      {/* Overlay text */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 4, duration: 1 }}
        className="absolute bottom-12 left-8 right-8 text-center"
      >
        <h3 className="text-3xl font-bold text-foreground/90 mb-3">
          Navigate Your <span className="text-brand-600">Journey</span>
        </h3>
        <p className="text-muted-foreground/80 text-base max-w-lg mx-auto leading-relaxed">
          Discover new paths and explore endless possibilities with our intelligent navigation platform.
        </p>
      </motion.div>
    </div>
  )
}
