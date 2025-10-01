import { useState } from "react"
import { motion } from "framer-motion"
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Upload, 
  Save, 
  ArrowLeft,
  Eye,
  EyeOff,
  Camera,
  MapPin,
  Globe,
  Building,
  Hash,
  Send,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { OptimizedDashboardLayout } from "@/components/optimized-dashboard-layout"
import { useToast } from "@/hooks/use-toast"
import { Link, useNavigate } from "react-router-dom"
import api from "@/lib/http"

const mockRoles = [
  { id: "admin", name: "Admin", permissions: ["read", "write", "delete", "manage_users"] },
  { id: "manager", name: "Manager", permissions: ["read", "write", "manage_team"] },
  { id: "user", name: "User", permissions: ["read"] },
]

export default function AddUser() {
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    avatar: "",
    bio: "",
    location: "",
    timezone: "America/Los_Angeles",
    department: "",
    employeeId: "",
    sendWelcomeEmail: true,
    temporaryPassword: "",
    requirePasswordChange: true
  })

  const [avatarPreview, setAvatarPreview] = useState<string>("")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isGeneratingPassword, setIsGeneratingPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setAvatarPreview(result)
        setNewUser({ ...newUser, avatar: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const generateSecurePassword = () => {
    setIsGeneratingPassword(true)
    
    // Simulate password generation
    setTimeout(() => {
      const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
      let password = ""
      for (let i = 0; i < 12; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length))
      }
      setNewUser({ ...newUser, temporaryPassword: password })
      setIsGeneratingPassword(false)
      
      toast({
        title: "Password Generated",
        description: "A secure password has been generated for the user.",
      })
    }, 1000)
  }

  const handleCreateUser = async () => {
    // Validation
    if (!newUser.firstName || !newUser.firstName || !newUser.email || !newUser.phone ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (!newUser.temporaryPassword) {
      toast({
        title: "Password Required",
        description: "Please generate a temporary password for the user.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const form = new FormData()
      // Use explicit firstName and lastName from form
      const firstName = newUser.firstName || ""
      const lastName = newUser.lastName || ""

      form.append("email", newUser.email)
      form.append("password", newUser.temporaryPassword)
      form.append("firstName", firstName)
      form.append("lastName", lastName)
      form.append("mobileNumber", newUser.phone)

      if (avatarFile) {
        form.append("profilePicture", avatarFile)
      }

      // Optional fields
      if (newUser.bio) form.append("bio", newUser.bio)
      if (newUser.department) form.append("department", newUser.department)
      if (newUser.location) form.append("location", newUser.location)
      if (newUser.employeeId) form.append("employeeId", newUser.employeeId)
      form.append("sendWelcomeEmail", String(newUser.sendWelcomeEmail))

      // Call backend endpoint (expects multipart/form-data)
      await api.post<any>("/api/users/create", { body: form })

      toast({
        title: "User Created Successfully",
        description: `${firstName} ${lastName} has been added to the system.${newUser.sendWelcomeEmail ? ' Welcome email sent.' : ''}`,
      })

      navigate("/dashboard/users")
    } catch (err: any) {
      console.error(err)
      toast({
        title: "Error",
        description: err?.message || "Failed to create user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = newUser.firstName && newUser.lastName && newUser.email && newUser.phone && newUser.temporaryPassword

  return (
    <OptimizedDashboardLayout title="Add New User">
      <div className="max-w-4xl mx-auto space-y-4 lg:space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <Link to="/dashboard/users">
              <Button variant="outline" size="sm" className="h-8">
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                Back to Users
              </Button>
            </Link>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-foreground">Add New User</h1>
              <p className="text-sm text-muted-foreground">
                Create a new user account with role-based permissions
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={isFormValid ? "default" : "secondary"} className="text-xs">
              {isFormValid ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
              {isFormValid ? "Ready to Create" : "Incomplete Form"}
            </Badge>
          </div>
        </motion.div>

        <div className="grid gap-4 lg:gap-6 grid-cols-1 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-6">
            {/* Basic Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-base lg:text-lg">Basic Information</CardTitle>
                  <CardDescription className="text-sm">
                    Enter the user's personal and contact details.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Avatar Upload */}
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16 lg:w-20 lg:h-20">
                      <AvatarImage src={avatarPreview} />
                      <AvatarFallback className="bg-brand-100 text-brand-700 text-lg lg:text-xl">
                        {(newUser.firstName || newUser.lastName) ? `${(newUser.firstName || '').charAt(0)}${(newUser.lastName || '').charAt(0)}` : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Label htmlFor="avatar-upload" className="cursor-pointer">
                        <Button variant="outline" size="sm" asChild>
                          <span>
                            <Upload className="w-3.5 h-3.5 mr-1.5" />
                            Upload Photo
                          </span>
                        </Button>
                      </Label>
                      <Input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG or GIF (max. 2MB)
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-sm">First & Last Name *</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input
                            id="firstName"
                            placeholder="First name"
                            value={newUser.firstName}
                            onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                            className="pl-10"
                          />
                        </div>
                        <div className="relative">
                          <Input
                            id="lastName"
                            placeholder="Last name"
                            value={newUser.lastName}
                            onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                            className="pl-3"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter email address"
                          value={newUser.email}
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm">Phone Number *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="phone"
                          placeholder="Enter phone number"
                          value={newUser.phone}
                          onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    </div>

                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-sm">Bio (Optional)</Label>
                    <Textarea
                      id="bio"
                      placeholder="Brief description about the user"
                      value={newUser.bio}
                      onChange={(e) => setNewUser({ ...newUser, bio: e.target.value })}
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Work Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* <Card>
                <CardHeader>
                  <CardTitle className="text-base lg:text-lg">Work Information</CardTitle>
                  <CardDescription className="text-sm">
                    Configure work-related details and location settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="department" className="text-sm">Department</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="department"
                          placeholder="e.g., Engineering, Marketing"
                          value={newUser.department}
                          onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="employeeId" className="text-sm">Employee ID</Label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="employeeId"
                          placeholder="e.g., EMP001"
                          value={newUser.employeeId}
                          onChange={(e) => setNewUser({ ...newUser, employeeId: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-sm">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="location"
                          placeholder="e.g., San Francisco, CA"
                          value={newUser.location}
                          onChange={(e) => setNewUser({ ...newUser, location: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timezone" className="text-sm">Timezone</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Select value={newUser.timezone} onValueChange={(value) => setNewUser({ ...newUser, timezone: value })}>
                          <SelectTrigger className="pl-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                            <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                            <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                            <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card> */}
            </motion.div>

            {/* Security Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-base lg:text-lg">Security Settings</CardTitle>
                  <CardDescription className="text-sm">
                    Set up initial password and security preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="temporaryPassword" className="text-sm">Temporary Password *</Label>
                    <div className="flex space-x-2">
                      <div className="relative flex-1">
                        <Input
                          id="temporaryPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="Generate or enter password"
                          value={newUser.temporaryPassword}
                          onChange={(e) => setNewUser({ ...newUser, temporaryPassword: e.target.value })}
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </Button>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={generateSecurePassword}
                        disabled={isGeneratingPassword}
                        className="shrink-0"
                      >
                        {isGeneratingPassword ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <RefreshCw className="w-3.5 h-3.5" />
                        )}
                        Generate
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      The user will be required to change this password on first login.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2 p-3 rounded-md bg-muted/40">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Require Password Change</Label>
                        <p className="text-xs text-muted-foreground">
                          The user will be required to change their temporary password on first login. This is enforced by the system and cannot be modified here.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 p-3 rounded-md bg-muted/40">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Send Welcome Email</Label>
                        <p className="text-xs text-muted-foreground">
                          A welcome email with login credentials and instructions will be sent automatically to the user's email address after creation.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            {/* Form Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Form Summary</CardTitle>
                <CardDescription className="text-sm">
                  Review your entries before creating the user.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{(newUser.firstName || newUser.lastName) ? `${newUser.firstName} ${newUser.lastName}` : "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium text-xs">{newUser.email || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Department:</span>
                    <span className="font-medium">{newUser.department || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Password:</span>
                    <span className="font-medium">{newUser.temporaryPassword ? "Set" : "Not set"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                <Button 
                  onClick={handleCreateUser} 
                  className="w-full" 
                  disabled={!isFormValid || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Creating User...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create User
                    </>
                  )}
                </Button>
                
                {newUser.sendWelcomeEmail && isFormValid && (
                  <div className="flex items-center space-x-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Send className="w-4 h-4 text-blue-600" />
                    <p className="text-xs text-blue-600">
                      Welcome email will be sent to {newUser.email}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

          </motion.div>
        </div>
      </div>
    </OptimizedDashboardLayout>
  )
}
