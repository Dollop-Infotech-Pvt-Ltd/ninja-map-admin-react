import { motion } from "framer-motion"
import { MapPin, Navigation, Compass } from "lucide-react"

export function MapVisualization() {
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
            className="w-96 h-72 text-brand-600/20 dark:text-brand-400/20"
            fill="currentColor"
          >
            {/* Simple world map silhouette */}
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
              d="M158 206c15-8 35-8 50 0s35 8 50 0 35-8 50 0 35 8 50 0 35-8 50 0 35 8 50 0 35-8 50 0 35 8 50 0"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="text-brand-500/40"
            />
            {/* Continents */}
            <motion.path 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              d="M50 150 L180 140 L200 180 L150 220 L80 200 Z" 
              className="text-brand-500/30"
            />
            <motion.path 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              d="M220 120 L350 110 L380 160 L340 200 L250 190 Z" 
              className="text-brand-500/30"
            />
            <motion.path 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.8 }}
              d="M400 140 L520 130 L540 170 L500 210 L420 200 Z" 
              className="text-brand-500/30"
            />
          </motion.svg>

          {/* Floating location pins */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.6 }}
            className="absolute top-16 left-20"
          >
            <motion.div
              animate={{ y: [-2, 2, -2] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative"
            >
              <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center shadow-lg">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <motion.div 
                className="absolute -inset-2 bg-brand-600/20 rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.6 }}
            className="absolute top-8 right-24"
          >
            <motion.div
              animate={{ y: [-2, 2, -2] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="relative"
            >
              <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center shadow-md">
                <Navigation className="w-3 h-3 text-white" />
              </div>
              <motion.div 
                className="absolute -inset-1 bg-brand-500/20 rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0, 0.7] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4, duration: 0.6 }}
            className="absolute bottom-12 left-32"
          >
            <motion.div
              animate={{ y: [-2, 2, -2] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="relative"
            >
              <div className="w-7 h-7 bg-brand-700 rounded-full flex items-center justify-center shadow-lg">
                <Compass className="w-4 h-4 text-white" />
              </div>
              <motion.div 
                className="absolute -inset-1.5 bg-brand-700/20 rounded-full"
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>

          {/* Connection lines */}
          <motion.svg
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.6, duration: 1 }}
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 384 288"
          >
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 2.6 }}
              d="M80 64 Q150 100 240 32"
              stroke="url(#gradient)"
              strokeWidth="1"
              fill="none"
              strokeDasharray="4 4"
            />
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 2.8 }}
              d="M80 64 Q120 150 128 192"
              stroke="url(#gradient)"
              strokeWidth="1"
              fill="none"
              strokeDasharray="4 4"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--brand-500))" stopOpacity="0.6" />
                <stop offset="100%" stopColor="hsl(var(--brand-600))" stopOpacity="0.2" />
              </linearGradient>
            </defs>
          </motion.svg>
        </div>
      </div>

      {/* Overlay text */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3, duration: 0.8 }}
        className="absolute bottom-12 left-8 right-8 text-center"
      >
        <h3 className="text-2xl font-bold text-foreground/80 mb-2">Navigate Your Journey</h3>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
          Discover new paths and explore endless possibilities with our intelligent navigation platform.
        </p>
      </motion.div>
    </div>
  )
}
