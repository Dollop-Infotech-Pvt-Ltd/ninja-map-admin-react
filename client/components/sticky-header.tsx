import { motion } from "framer-motion"
import { ArrowLeft, MapPin } from "lucide-react"
import { Link } from "react-router-dom"
import { ThemeToggle } from "./theme-toggle"

interface StickyHeaderProps {
  title?: string
  subtitle?: string
  backTo?: string
  backLabel?: string
  showLogo?: boolean
}

export function StickyHeader({ 
  title = "Navigation Platform", 
  subtitle = "Ninja Map",
  backTo,
  backLabel = "Back",
  showLogo = true 
}: StickyHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border"
    >
      <div className="responsive-padding-x flex items-center justify-between h-16">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          {backTo && (
            <Link
              to={backTo}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors group"
            >
              <motion.div
                whileHover={{ x: -2 }}
                transition={{ duration: 0.15 }}
              >
                <ArrowLeft className="w-4 h-4" />
              </motion.div>
              <span className="text-sm font-medium">{backLabel}</span>
            </Link>
          )}
          
          {showLogo && (
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center shadow-md">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <motion.div 
                  className="absolute -inset-0.5 bg-gradient-to-br from-brand-400/20 to-brand-600/20 rounded-lg blur" 
                  animate={{ opacity: [0.5, 0.7, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">{subtitle}</h1>
                <p className="text-xs text-muted-foreground">{title}</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2">
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  )
}
