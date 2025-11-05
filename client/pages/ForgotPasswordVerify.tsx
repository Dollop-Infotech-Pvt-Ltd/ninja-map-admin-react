import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, KeyRound, RefreshCw, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FloatingThemeToggle } from "@/components/floating-theme-toggle"
import { CleanNavigationSection } from "@/components/clean-navigation-section"
import { useToast } from "@/hooks/use-toast"
import { Link, useLocation, useNavigate } from "react-router-dom"
import api from "@/lib/http"
import { getCookie, setCookie, deleteCookie } from "@/lib/cookies"
import type { ForgotPasswordVerifyResponse } from "@shared/api"

export default function ForgotPasswordVerify() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60) // 1 minutes
  const [canResend, setCanResend] = useState(false)
  const [error, setError] = useState("")
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const email = location.state?.email || "user@example.com"

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
      setError("OTP has expired. Please request a new code.")
    }
  }, [timeLeft])

  // Clear error when user starts typing
  useEffect(() => {
    if (otp.some(digit => digit !== "")) {
      setError("")
    }
  }, [otp])

  // Auto-focus and handle input
  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pastedData = value.slice(0, 6).split("")
      const newOtp = [...otp]
      pastedData.forEach((digit, i) => {
        if (index + i < 6 && /^\d$/.test(digit)) {
          newOtp[index + i] = digit
        }
      })
      setOtp(newOtp)
      
      // Focus last filled input or next empty one
      const nextIndex = Math.min(index + pastedData.length, 5)
      inputRefs.current[nextIndex]?.focus()
      return
    }

    if (value && /^\d$/.test(value)) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)
      
      // Move to next input
      if (index < 5) {
        inputRefs.current[index + 1]?.focus()
      }
    } else if (value === "") {
      const newOtp = [...otp]
      newOtp[index] = ""
      setOtp(newOtp)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move to previous input on backspace
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const otpString = otp.join("")
    
    if (otpString.length !== 6) {
      setError("Please enter the complete 6-digit code")
      toast({
        title: "Incomplete Code",
        description: "Please enter all 6 digits of the verification code.",
        variant: "destructive",
      })
      return
    }

    if (timeLeft <= 0) {
      setError("OTP has expired. Please request a new code.")
      toast({
        title: "Code Expired",
        description: "Your verification code has expired. Please request a new one.",
        variant: "destructive",
      })
      return
    }
    
    setIsLoading(true)
    setError("")
    
    try {
      const token = getCookie("auth_token")
      if (!token) {
        setError("Session expired. Please start again.")
        toast({
          title: "Session Expired",
          description: "Please request a new code.",
          variant: "destructive",
        })
        navigate("/forgot-password", { replace: true })
        return
      }

      const res = await api.post<ForgotPasswordVerifyResponse>("/api/admin/auth/verify-otp", {
        headers: { Authorization: `Bearer ${token}` },
        body: { otp: otpString },
      })

      if (!res?.success || !res?.data?.authToken) {
        throw new Error(res?.message || "OTP verification failed")
      }

      setCookie("auth_token", res.data.authToken, { days: 1 })

      toast({
        title: "Code Verified!",
        description: res?.message || "Now create your new password.",
      })

      navigate("/forgot-password/reset", { state: { email } })
    } catch (error: any) {
      const serverMsg: string | undefined = error?.data?.message || error?.message
      setError(serverMsg || "Invalid verification code. Please try again.")
      toast({
        title: "Verification Failed",
        description: serverMsg || "The code you entered is incorrect. Please try again.",
        variant: "destructive",
      })
      // Clear OTP on error
      setOtp(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setTimeLeft(60)
      setCanResend(false)
      setOtp(["", "", "", "", "", ""])
      setError("")
      inputRefs.current[0]?.focus()
      
      toast({
        title: "Code Sent!",
        description: "A new verification code has been sent to your email.",
      })
    } catch (error) {
      toast({
        title: "Failed to Resend",
        description: "Unable to send new code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const isComplete = otp.every(digit => digit !== "")

  return (
    <div className="min-h-screen bg-background relative overflow-hidden auth-page">
      {/* Floating Theme Toggle */}
      <FloatingThemeToggle />
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/40 via-background to-red-50/60 dark:from-background dark:via-card/20 dark:to-background" />
        <motion.div 
          className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-orange-400/6 to-red-600/3 rounded-full blur-3xl" 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.4, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-32 left-20 w-80 h-80 bg-gradient-to-br from-red-500/4 to-orange-700/2 rounded-full blur-3xl" 
          animate={{ 
            scale: [1.1, 1, 1.1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6">
        <Link
          to="/forgot-password"
          className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors group"
        >
          <motion.div
            whileHover={{ x: -2 }}
            transition={{ duration: 0.15 }}
          >
            <ArrowLeft className="w-4 h-4" />
          </motion.div>
          <span className="text-sm font-medium">Back</span>
        </Link>
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Verification Form */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md"
          >
            {/* Header */}
            <div className="mb-8">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.05, duration: 0.3 }}
                className="flex items-center space-x-3 mb-6"
              >
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", damping: 20 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-lg">
                    <KeyRound className="w-7 h-7 text-white" />
                  </div>
                  <motion.div 
                    className="absolute -inset-1 bg-gradient-to-br from-brand-400/20 to-brand-600/20 rounded-xl blur" 
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Ninja Map</h1>
                  <p className="text-sm text-muted-foreground">Password Recovery</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-foreground mb-2">Check Your Email</h2>
                <p className="text-muted-foreground mb-2">
                  We've sent a verification code to
                </p>
                <p className="text-brand-600 font-medium">{email}</p>
              </motion.div>
            </div>

            {/* OTP Form */}
            <motion.form
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* OTP Inputs */}
              <div className="space-y-4">
                <div className="flex justify-center space-x-3">
                  {otp.map((digit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.03 * index + 0.2, duration: 0.3 }}
                    >
                      <Input
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        value={digit}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-14 h-14 text-center text-xl font-bold bg-card/70 backdrop-blur-md border-border transition-all duration-150 rounded-lg focus:border-brand-500 focus:ring-brand-500"
                        disabled={isLoading}
                      />
                    </motion.div>
                  ))}
                </div>
                
                {/* Timer */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  className="text-center"
                >
                  {timeLeft > 0 ? (
                    <p className="text-muted-foreground text-sm">
                      Resend code in <span className={`font-mono font-medium ${timeLeft < 60 ? 'text-red-500' : 'text-brand-600'}`}>{formatTime(timeLeft)}</span>
                    </p>
                  ) : (
                    <p className="text-red-500 text-sm font-medium">Code has expired</p>
                  )}
                </motion.div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="text-center"
                    >
                      <p className="text-sm text-red-500">
                        {error}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.3 }}
              >
                <Button
                  type="submit"
                  className={`w-full h-11 font-semibold transition-all duration-150 shadow-lg hover:shadow-xl disabled:opacity-50 ${
                    isComplete && !error && timeLeft > 0 && !isLoading
                      ? 'bg-brand-600 hover:bg-brand-700 text-white'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                  disabled={!isComplete || !!error || timeLeft <= 0 || isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <motion.div 
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2" 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      />
                      Verifying...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      Verify Code
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  )}
                </Button>
              </motion.div>
            </motion.form>

            {/* Resend Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="mt-6 text-center"
            >
              <p className="text-muted-foreground text-sm mb-3">Didn't receive the code?</p>
              <Button
                variant="ghost"
                onClick={handleResendOTP}
                disabled={!canResend || isLoading}
                className="text-brand-600 hover:text-brand-700 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Resend Code
              </Button>
            </motion.div>

            {/* Help Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.3 }}
              className="mt-6 p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-border"
            >
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Next Steps:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Enter the 6-digit code from your email</li>
                    <li>• Check your spam folder if not received</li>
                    <li>• You'll then create a new password</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Side - Rotating Globe */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:flex flex-1 relative"
        >
          <div className="relative w-full h-full">
            <CleanNavigationSection variant="verify" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
