import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 backdrop-blur-sm",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-lg hover:shadow-xl hover:from-brand-700 hover:to-brand-800",
        destructive: "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg hover:shadow-xl hover:from-red-700 hover:to-red-800",
        outline: "border border-border bg-card/70 hover:bg-card hover:border-brand-300/50 shadow-sm hover:shadow-md",
        secondary: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 shadow-sm hover:shadow-md dark:from-gray-800 dark:to-gray-700 dark:text-gray-100",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-brand-600 underline-offset-4 hover:underline hover:text-brand-700",
        success: "bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow-lg hover:shadow-xl hover:from-green-700 hover:to-emerald-800",
        warning: "bg-gradient-to-r from-orange-600 to-red-700 text-white shadow-lg hover:shadow-xl hover:from-orange-700 hover:to-red-800",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-lg px-4",
        lg: "h-12 rounded-xl px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface EnhancedButtonProps
  extends Omit<HTMLMotionProps<"button">, "children">,
    VariantProps<typeof buttonVariants> {
  children?: React.ReactNode
  loading?: boolean
  loadingText?: string
}

const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ className, variant, size, loading, loadingText, children, disabled, ...props }, ref) => {
    const isDisabled = disabled || loading

    return (
      <motion.button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        whileHover={!isDisabled ? { scale: 1.01 } : {}}
        whileTap={!isDisabled ? { scale: 0.99 } : {}}
        transition={{ duration: 0.15 }}
        {...props}
      >
        {loading ? (
          <div className="flex items-center">
            <motion.div 
              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            {loadingText || "Loading..."}
          </div>
        ) : (
          children
        )}
      </motion.button>
    )
  }
)
EnhancedButton.displayName = "EnhancedButton"

export { EnhancedButton, buttonVariants }
