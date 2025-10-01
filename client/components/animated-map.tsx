import { motion } from "framer-motion"
import { MapPin, Navigation, Route, Satellite } from "lucide-react"

export function AnimatedMap() {
  const mapPoints = [
    { x: "20%", y: "30%", delay: 0 },
    { x: "60%", y: "20%", delay: 0.5 },
    { x: "40%", y: "60%", delay: 1 },
    { x: "75%", y: "70%", delay: 1.5 },
    { x: "15%", y: "80%", delay: 2 },
  ]

  const routes = [
    { from: { x: "20%", y: "30%" }, to: { x: "60%", y: "20%" } },
    { from: { x: "60%", y: "20%" }, to: { x: "40%", y: "60%" } },
    { from: { x: "40%", y: "60%" }, to: { x: "75%", y: "70%" } },
  ]

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-brand-300"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Animated Routes */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--brand-600))" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(var(--brand-400))" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        
        {routes.map((route, index) => (
          <motion.line
            key={index}
            x1={route.from.x}
            y1={route.from.y}
            x2={route.to.x}
            y2={route.to.y}
            stroke="url(#routeGradient)"
            strokeWidth="3"
            strokeDasharray="8 4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 2,
              delay: index * 0.5,
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: 1,
            }}
          />
        ))}
      </svg>

      {/* Map Points */}
      {mapPoints.map((point, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{ left: point.x, top: point.y }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.6,
            delay: point.delay,
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
          {/* Ping Effect */}
          <div className="absolute inset-0 -m-2">
            <motion.div
              className="w-4 h-4 bg-brand-500/30 rounded-full"
              animate={{ scale: [1, 2, 1], opacity: [0.7, 0, 0.7] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: point.delay + 1,
              }}
            />
          </div>
          
          {/* Main Point */}
          <motion.div
            className="w-3 h-3 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full shadow-lg relative z-10"
            animate={{ y: [0, -4, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: point.delay + 0.5,
            }}
          />
        </motion.div>
      ))}

      {/* Navigation Icons */}
      <motion.div
        className="absolute top-8 right-8"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2.5, duration: 0.8 }}
      >
        <motion.div
          className="p-3 bg-brand-500/20 backdrop-blur-sm rounded-xl border border-brand-300/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Satellite className="w-6 h-6 text-brand-600" />
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 3, duration: 0.8 }}
      >
        <motion.div
          className="p-3 bg-brand-500/20 backdrop-blur-sm rounded-xl border border-brand-300/30"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Navigation className="w-6 h-6 text-brand-600" />
        </motion.div>
      </motion.div>

      {/* Floating Route Icon */}
      <motion.div
        className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 3.5, duration: 0.6 }}
      >
        <motion.div
          className="p-4 bg-gradient-to-br from-brand-500/30 to-brand-600/20 backdrop-blur-sm rounded-2xl border border-brand-400/40"
          animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Route className="w-8 h-8 text-brand-600" />
        </motion.div>
      </motion.div>

      {/* Central Map Pin */}
      <motion.div
        className="absolute top-1/2 right-1/3 transform translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 4, duration: 0.6, type: "spring" }}
      >
        <motion.div
          className="relative"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="p-4 bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl shadow-2xl border border-brand-500/50">
            <MapPin className="w-10 h-10 text-white" />
          </div>
          
          {/* Shadow */}
          <motion.div
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-brand-900/20 rounded-full blur-sm"
            animate={{ scale: [1, 0.8, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-50/50 via-transparent to-brand-100/30 pointer-events-none" />
    </div>
  )
}
