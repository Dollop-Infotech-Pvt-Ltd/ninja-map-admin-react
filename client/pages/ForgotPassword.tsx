import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FloatingThemeToggle } from "@/components/floating-theme-toggle"
import { CleanNavigationSection } from "@/components/clean-navigation-section"
import { EnhancedButton } from "@/components/enhanced-button"
import { BrandLogo } from "@/components/brand-logo"
import { useToast } from "@/hooks/use-toast"
import { Link, useNavigate } from "react-router-dom"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { toast } = useToast()

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) {
      return "Email address is required"
    }
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address"
    }
    return undefined
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const emailError = validateEmail(email)
    if (emailError) {
      setError(emailError)
      toast({
        title: "Validation Error",
        description: emailError,
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setError("")
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      toast({
        title: "Code Sent!",
        description: "Check your email for the verification code.",
      })
      
      navigate("/forgot-password/verify", { state: { email } })
    } catch (error) {
      setError("Failed to send verification code. Please try again.")
      toast({
        title: "Failed to Send",
        description: "Unable to send verification code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = !error && email && validateEmail(email) === undefined

  return (
    <div className="min-h-screen bg-background relative auth-page">
      {/* Floating Theme Toggle */}
      <FloatingThemeToggle />

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-40">
        <Link
          to="/login"
          className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors group"
        >
          <motion.div
            whileHover={{ x: -2 }}
            transition={{ duration: 0.15 }}
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
          </motion.div>
          <span className="text-sm font-medium">Back to Login</span>
        </Link>
      </div>

      {/* Main Container */}
      <div className="flex min-h-screen">
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center responsive-padding">
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md"
          >
            {/* Header */}
            <div className="mb-8">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.3 }}
                className="mb-6"
              >
                <BrandLogo size="md" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-foreground mb-2">Forgot Password?</h2>
                <p className="text-muted-foreground">
                  No worries! Enter your email address and we'll send you a verification code to reset your password.
                </p>
              </motion.div>
            </div>

            {/* Form */}
            <motion.form
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 z-10" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setError("")
                    }}
                    className="pl-10 h-11 bg-card/70 backdrop-blur-md border-border transition-all duration-150 focus:border-brand-500 focus:ring-brand-500"
                    required
                    disabled={isLoading}
                  />
                </div>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -3 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500"
                  >
                    {error}
                  </motion.p>
                )}
              </div>

              {/* Submit Button */}
              <EnhancedButton
                type="submit"
                variant="default"
                className="w-full bg-brand-600 hover:bg-brand-700 text-white border-0"
                disabled={!isFormValid}
                loading={isLoading}
                loadingText="Sending Code..."
              >
                <span>Send Verification Code</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </EnhancedButton>
            </motion.form>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="mt-6 p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-border"
            >
              <h3 className="text-foreground font-medium mb-2">What happens next?</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-brand-500 rounded-full" />
                  <span>We'll send a 6-digit code to your email</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-brand-500 rounded-full" />
                  <span>Enter the code to verify your identity</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-brand-500 rounded-full" />
                  <span>Create a new secure password</span>
                </div>
              </div>
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.3 }}
              className="mt-6 text-center"
            >
              <p className="text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link to="/login" className="text-brand-600 hover:text-brand-700 transition-colors font-medium">
                  Back to Login
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Side - 3D Globe */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:flex flex-1 h-screen"
        >
          <CleanNavigationSection variant="forgot" />
        </motion.div>
      </div>
    </div>
  )
}
