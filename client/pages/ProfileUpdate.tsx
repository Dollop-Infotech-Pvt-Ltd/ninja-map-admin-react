import { useState, useEffect } from "react"
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
  Calendar,
  Globe,
  Lock,
  Bell,
  Smartphone,
  Clock
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
import { useCurrentUser } from "@/lib/user"
import { Link } from "react-router-dom"

export default function ProfileUpdate() {
  const { user, save } = useCurrentUser()
  const [profile, setProfile] = useState(() => ({
    name: user?.name || "Yash Jain",
    email: user?.email || "yash@ninjamap.com",
    phone: user?.phone || "+1 (555) 123-4567",
    role: user?.role || "Super Admin",
    avatar: user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    bio: user?.bio || "Experienced navigation platform administrator with a passion for optimizing routes and improving user experiences.",
    location: user?.location || "San Francisco, CA",
    timezone: user?.timezone || "America/Los_Angeles",
    joinedDate: user?.joinedDate || "January 2024",
    department: user?.department || "Engineering",
    employeeId: user?.employeeId || "EMP001"
  }))

  // Keep local form in sync if external user changes
  useEffect(() => {
    setProfile(prev => ({ ...prev, ...(user || {}) }))
  }, [user])

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    loginAlerts: true
  })

  const [avatarPreview, setAvatarPreview] = useState<string>(profile.avatar)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const { toast } = useToast()

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setAvatarPreview(result)
        setProfile({ ...profile, avatar: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = () => {
    // Persist profile via the shared user hook so layouts update immediately
    try {
      save(profile)
    } catch {}

    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    })
  }

  const handleSaveSecurity = () => {
    if (security.newPassword && security.newPassword !== security.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirm password do not match.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Security Settings Updated",
      description: "Your security settings have been successfully updated.",
    })
    
    setSecurity({
      ...security,
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    })
  }

  const tabs = [
    { id: "profile", label: "Profile Information", icon: User },
    { id: "security", label: "Security & Privacy", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
  ]

  return (
    <OptimizedDashboardLayout title="Update Profile">
      <div className="max-w-4xl mx-auto space-y-4 lg:space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <Link to="/dashboard">
              <Button variant="outline" size="sm" className="h-8">
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-foreground">Update Profile</h1>
              <p className="text-sm text-muted-foreground">
                Manage your personal information and account settings
              </p>
            </div>
          </div>
        </motion.div>

        {/* Profile Overview Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-brand-50 to-blue-50 dark:from-brand-900/20 dark:to-blue-900/20 border-brand-200/50">
            <CardContent className="p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <Avatar className="w-16 h-16 lg:w-20 lg:h-20">
                    <AvatarImage src={avatarPreview} />
                    <AvatarFallback className="bg-brand-100 text-brand-700 text-lg lg:text-xl">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute -bottom-1 -right-1 w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-background shadow-md"
                    asChild
                  >
                    <Label htmlFor="avatar-upload" className="cursor-pointer">
                      <Camera className="w-3 h-3 lg:w-4 lg:h-4" />
                    </Label>
                  </Button>
                  <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg lg:text-xl font-bold text-foreground">{profile.name}</h2>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      <Shield className="w-3 h-3 mr-1" />
                      {profile.role}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <MapPin className="w-3 h-3 mr-1" />
                      {profile.location}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Calendar className="w-3 h-3 mr-1" />
                      Joined {profile.joinedDate}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="border-b border-border">
            <nav className="flex space-x-6 overflow-x-auto">
              {tabs.map((tab) => {
                const TabIcon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-3 px-1 border-b-2 text-sm font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? "border-brand-500 text-brand-600"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                    }`}
                  >
                    <TabIcon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "profile" && (
            <div className="grid gap-4 lg:gap-6 grid-cols-1 lg:grid-cols-2">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base lg:text-lg">Personal Information</CardTitle>
                  <CardDescription className="text-sm">
                    Update your personal details and contact information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="name"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="phone"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-sm">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        rows={3}
                        className="resize-none"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Work Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base lg:text-lg">Work Information</CardTitle>
                  <CardDescription className="text-sm">
                    Manage your work-related information and preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-sm">Role</Label>
                      <Select value={profile.role} onValueChange={(value) => setProfile({ ...profile, role: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Super Admin">Super Admin</SelectItem>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Manager">Manager</SelectItem>
                          <SelectItem value="User">User</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department" className="text-sm">Department</Label>
                      <Input
                        id="department"
                        value={profile.department}
                        onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="employeeId" className="text-sm">Employee ID</Label>
                      <Input
                        id="employeeId"
                        value={profile.employeeId}
                        onChange={(e) => setProfile({ ...profile, employeeId: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-sm">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="location"
                          value={profile.location}
                          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timezone" className="text-sm">Timezone</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Select value={profile.timezone} onValueChange={(value) => setProfile({ ...profile, timezone: value })}>
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
              </Card>

              {/* Save Button */}
              <div className="lg:col-span-2">
                <Button onClick={handleSaveProfile} className="w-full lg:w-auto">
                  <Save className="w-4 h-4 mr-2" />
                  Save Profile Changes
                </Button>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="grid gap-4 lg:gap-6 grid-cols-1 lg:grid-cols-2">
              {/* Password Change */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base lg:text-lg">Change Password</CardTitle>
                  <CardDescription className="text-sm">
                    Update your password to keep your account secure.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-sm">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={security.currentPassword}
                        onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-sm">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={security.newPassword}
                        onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={security.confirmPassword}
                        onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base lg:text-lg">Security Settings</CardTitle>
                  <CardDescription className="text-sm">
                    Configure your account security preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Two-Factor Authentication</Label>
                      <p className="text-xs text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch
                      checked={security.twoFactorEnabled}
                      onCheckedChange={(checked) => setSecurity({ ...security, twoFactorEnabled: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Login Alerts</Label>
                      <p className="text-xs text-muted-foreground">
                        Get notified of suspicious login attempts
                      </p>
                    </div>
                    <Switch
                      checked={security.loginAlerts}
                      onCheckedChange={(checked) => setSecurity({ ...security, loginAlerts: checked })}
                    />
                  </div>

                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <Clock className="w-3.5 h-3.5 mr-2" />
                      View Login History
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Save Button */}
              <div className="lg:col-span-2">
                <Button onClick={handleSaveSecurity} className="w-full lg:w-auto">
                  <Save className="w-4 h-4 mr-2" />
                  Save Security Settings
                </Button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base lg:text-lg">Notification Preferences</CardTitle>
                <CardDescription className="text-sm">
                  Choose how you'd like to receive notifications and updates.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Email Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Receive important updates via email
                    </p>
                  </div>
                  <Switch
                    checked={security.emailNotifications}
                    onCheckedChange={(checked) => setSecurity({ ...security, emailNotifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">SMS Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Get critical alerts via text message
                    </p>
                  </div>
                  <Switch
                    checked={security.smsNotifications}
                    onCheckedChange={(checked) => setSecurity({ ...security, smsNotifications: checked })}
                  />
                </div>

                <div className="pt-4">
                  <Button onClick={handleSaveSecurity} className="w-full lg:w-auto">
                    <Save className="w-4 h-4 mr-2" />
                    Save Notification Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </OptimizedDashboardLayout>
  )
}
