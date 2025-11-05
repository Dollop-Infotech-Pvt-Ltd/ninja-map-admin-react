import { motion } from "framer-motion"
import { MapPin, Navigation } from "lucide-react"

interface BrandLogoProps {
  showText?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

export function BrandLogo({ showText = true, size = "md", className = "" }: BrandLogoProps) {
  const sizeClasses = {
    sm: {
      logo: "w-8 h-8",
      icon: "w-4 h-4",
      title: "text-lg",
      subtitle: "text-xs"
    },
    md: {
      logo: "w-10 h-10",
      icon: "w-5 h-5",
      title: "text-xl",
      subtitle: "text-sm"
    },
    lg: {
      logo: "w-12 h-12",
      icon: "w-6 h-6",
      title: "text-2xl",
      subtitle: "text-base"
    }
  }

  const currentSize = sizeClasses[size]

  return (
    <motion.div 
      className={`flex items-center space-x-3 ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", damping: 20 }}
    >
      <div className="relative">
        <motion.div 
          className={`${currentSize.logo} bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-lg`}
          whileHover={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <MapPin className={`${currentSize.icon} text-white`} />
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Navigation className="w-2 h-2 text-white" />
            </motion.div>
          </div>
        </motion.div>
        <motion.div 
          className="absolute -inset-1 bg-gradient-to-br from-brand-400/20 to-brand-600/20 rounded-xl blur" 
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
      {showText && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className={`${currentSize.title} font-bold text-foreground leading-tight`}>
            Ninja<span className="text-brand-600">Map</span>
          </h1>
          <p className={`${currentSize.subtitle} text-muted-foreground leading-tight`}>
            Navigation Platform
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
