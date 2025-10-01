import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff, Lock, CheckCircle2, ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FloatingThemeToggle } from "@/components/floating-theme-toggle"
import { CleanNavigationSection } from "@/components/clean-navigation-section"
import { EnhancedButton } from "@/components/enhanced-button"
import { BrandLogo } from "@/components/brand-logo"
import { useToast } from "@/hooks/use-toast"
import { useLocation, useNavigate, Link } from "react-router-dom"
import api from "@/lib/http"
import { getCookie, deleteCookie } from "@/lib/cookies"
import type { ResetPasswordResponse } from "@shared/api"

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const email = location.state?.email || "user@example.com"

  // Password strength validation
  const hasMinLength = password.length >= 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  const passwordsMatch = password === confirmPassword && password.length > 0

  const isPasswordValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar
  const canSubmit = isPasswordValid && passwordsMatch

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!canSubmit) return
    
    setIsLoading(true)

    try {
      const token = getCookie("auth_token")
      if (!token) {
        toast({ title: "Session Expired", description: "Please verify OTP again.", variant: "destructive" })
        navigate("/forgot-password/verify", { replace: true })
        return
      }

      const res = await api.post<ResetPasswordResponse>("/api/admin/auth/reset-password", {
        headers: { Authorization: `Bearer ${token}` },
        body: { newPassword: password },
      })

      if (!res?.success) {
        throw new Error(res?.message || "Unable to reset password")
      }

      // Clear temp token after successful reset
      deleteCookie("auth_token")

      toast({
        title: "Password Reset Successful!",
        description: res?.message || "You can now log in with your new password.",
      })

      navigate("/login", {
        state: {
          message: "Password reset successful! Please login with your new password.",
          type: "success"
        }
      })
    } catch (error: any) {
      const serverMsg: string | undefined = error?.data?.message || error?.message
      toast({
        title: "Reset Failed",
        description: serverMsg || "Unable to reset password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background relative auth-page">
      {/* Floating Theme Toggle */}
      <FloatingThemeToggle />

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-40">
        <Link
          to="/forgot-password/verify"
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
                <h2 className="text-3xl font-bold text-foreground mb-2">Create New Password</h2>
                <p className="text-muted-foreground">
                  Choose a strong password for <span className="text-brand-600 font-medium">{email}</span>
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
              {/* New Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 z-10" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 bg-card/70 backdrop-blur-md border-border transition-all duration-150 focus:border-brand-500 focus:ring-brand-500"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 z-10" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 bg-card/70 backdrop-blur-md border-border transition-all duration-150 focus:border-brand-500 focus:ring-brand-500"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="space-y-3">
                <h3 className="text-foreground text-sm font-medium">Password Requirements:</h3>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <div className={`flex items-center space-x-2 ${hasMinLength ? 'text-green-500' : 'text-muted-foreground'}`}>
                    <CheckCircle2 className={`w-3 h-3 ${hasMinLength ? 'text-green-500' : 'text-muted-foreground'}`} />
                    <span>At least 8 characters</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${hasUpperCase ? 'text-green-500' : 'text-muted-foreground'}`}>
                    <CheckCircle2 className={`w-3 h-3 ${hasUpperCase ? 'text-green-500' : 'text-muted-foreground'}`} />
                    <span>One uppercase letter</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${hasLowerCase ? 'text-green-500' : 'text-muted-foreground'}`}>
                    <CheckCircle2 className={`w-3 h-3 ${hasLowerCase ? 'text-green-500' : 'text-muted-foreground'}`} />
                    <span>One lowercase letter</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${hasNumber ? 'text-green-500' : 'text-muted-foreground'}`}>
                    <CheckCircle2 className={`w-3 h-3 ${hasNumber ? 'text-green-500' : 'text-muted-foreground'}`} />
                    <span>One number</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${hasSpecialChar ? 'text-green-500' : 'text-muted-foreground'}`}>
                    <CheckCircle2 className={`w-3 h-3 ${hasSpecialChar ? 'text-green-500' : 'text-muted-foreground'}`} />
                    <span>One special character (!@#$%^&*)</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${passwordsMatch ? 'text-green-500' : 'text-muted-foreground'}`}>
                    <CheckCircle2 className={`w-3 h-3 ${passwordsMatch ? 'text-green-500' : 'text-muted-foreground'}`} />
                    <span>Passwords match</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <EnhancedButton
                type="submit"
                variant="default"
                className="w-full bg-brand-600 hover:bg-brand-700 text-white border-0"
                disabled={!canSubmit}
                loading={isLoading}
                loadingText="Updating Password..."
              >
                Reset Password
              </EnhancedButton>
            </motion.form>

            {/* Security Notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="mt-6 p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-border"
            >
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Security Notice:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Your new password will be encrypted and stored securely</li>
                    <li>• You'll be logged out from all other devices</li>
                    <li>• Use this password to login to your account</li>
                  </ul>
                </div>
              </div>
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
          <CleanNavigationSection variant="reset" />
        </motion.div>
      </div>
    </div>
  )
}
