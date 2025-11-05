import { motion } from "framer-motion"

interface BrandLogoProps {
  showText?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

export function BrandLogo({ showText = true, size = "md", className = "" }: BrandLogoProps) {
  const sizeClasses = {
    sm: {
      wrapper: "w-20 h-8",
      img: "w-full h-full object-contain",
      title: "text-lg",
      subtitle: "text-xs",
    },
    md: {
      wrapper: "w-32 h-10",
      img: "w-full h-full object-contain",
      title: "text-xl",
      subtitle: "text-sm",
    },
    lg: {
      wrapper: "w-40 h-12",
      img: "w-full h-full object-contain",
      title: "text-2xl",
      subtitle: "text-base",
    },
  }

  const currentSize = sizeClasses[size]

  return (
    <motion.div
      className={`flex items-center space-x-3 ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", damping: 20 }}
    >
      {/* Replace the SVG glyph with the full logo image located at /logo/logo2.png */}
      <div className={`relative ${currentSize.wrapper}`}>
        <img
          src="/logo/logo2.png"
          alt="NinjaMap"
          className={`${currentSize.img} block`}
        />
      </div>


    </motion.div>
  )
}
