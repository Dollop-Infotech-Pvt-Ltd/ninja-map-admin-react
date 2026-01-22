import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Save,
  Camera,
  Edit3,
  Eye,
  EyeOff
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useCurrentUser, fetchLoggedInUser, updateAdminProfile, changeAdminPassword } from "@/lib/user"
import type { AdminUser } from "../../../shared/api"

interface ProfileData {
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  joinedDate: string
  bio: string
  gender: string
}

export default function ProfileSettings() {
  const { user: currentUser, save: saveUser } = useCurrentUser()
  const { toast } = useToast()
  
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    joinedDate: "",
    bio: "",
    gender: ""
  })
  
  const [originalData, setOriginalData] = useState<ProfileData>(profileData)
  const [isLoading, setSaving] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [activeTab, setActiveTab] = useState("update-profile")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [adminUserData, setAdminUserData] = useState<AdminUser | null>(null)
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null)
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null)
  const [imageKey, setImageKey] = useState<number>(Date.now()) // For cache busting

  // Helper function to get profile picture URL with cache busting
  const getProfilePictureUrl = () => {
    if (profilePicturePreview) {
      // Show preview of selected file
      return profilePicturePreview
    }
    
    if (adminUserData?.profilePicture) {
      // Add cache busting parameter to force reload of updated image
      const url = adminUserData.profilePicture
      const separator = url.includes('?') ? '&' : '?'
      return `${url}${separator}t=${imageKey}`
    }
    
    // Fallback to current user avatar
    return currentUser.avatar
  }
  const refreshUserData = async () => {
    try {
      const freshUserData = await fetchLoggedInUser()
      
      if (freshUserData) {
        setAdminUserData(freshUserData)
        
        // Format joining date
        const formattedDate = freshUserData.joiningDate 
          ? new Date(freshUserData.joiningDate).toLocaleDateString('en-GB')
          : ""
        
        const refreshedProfileData = {
          firstName: freshUserData.firstName || "",
          lastName: freshUserData.lastName || "",
          email: freshUserData.email || "",
          phone: freshUserData.mobileNumber || "",
          employeeId: freshUserData.employeeId || "",
          role: freshUserData.role || "",
          joinedDate: formattedDate,
          bio: freshUserData.bio || "",
          gender: (freshUserData as any).gender || ""
        }
        
        setProfileData(refreshedProfileData)
        setOriginalData(refreshedProfileData)
        
        // Update current user context with fresh data and cache busting
        const avatarUrl = freshUserData.profilePicture 
          ? `${freshUserData.profilePicture}${freshUserData.profilePicture.includes('?') ? '&' : '?'}t=${Date.now()}`
          : freshUserData.profilePicture

        saveUser({
          ...currentUser,
          name: freshUserData.fullName,
          email: freshUserData.email,
          role: freshUserData.role,
          avatar: avatarUrl, // Use cache-busted URL
          firstName: freshUserData.firstName,
          lastName: freshUserData.lastName,
          mobileNumber: freshUserData.mobileNumber,
          employeeId: freshUserData.employeeId,
          bio: freshUserData.bio,
          isActive: freshUserData.isActive,
          joiningDate: freshUserData.joiningDate,
          id: freshUserData.id
        })
        
        // Update image key to ensure fresh image loading
        setImageKey(Date.now())
        
        return freshUserData
      }
    } catch (error) {
      console.error("Failed to refresh user data:", error)
      throw error
    }
  }

  // Fetch logged-in user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoadingProfile(true)
        await refreshUserData()
      } catch (error) {
        console.error("Failed to load user data:", error)
        toast({
          title: "Failed to Load Profile",
          description: "Could not load your profile data. Please refresh the page.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingProfile(false)
      }
    }

    loadUserData()
  }, [])

  // Cleanup preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (profilePicturePreview) {
        URL.revokeObjectURL(profilePicturePreview)
      }
    }
  }, [profilePicturePreview])

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePasswordChange = (field: keyof typeof passwordData, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select an image file.",
          variant: "destructive",
        })
        // Clear the input
        event.target.value = ''
        return
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        })
        // Clear the input
        event.target.value = ''
        return
      }
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setProfilePictureFile(file)
      setProfilePicturePreview(previewUrl)
      
      toast({
        title: "Profile Picture Selected",
        description: `Selected: ${file.name}. Click 'Save Changes' to update.`,
      })
    }
  }

  // Cleanup preview URL when component unmounts or file changes
  const clearProfilePicture = () => {
    if (profilePicturePreview) {
      URL.revokeObjectURL(profilePicturePreview)
    }
    setProfilePictureFile(null)
    setProfilePicturePreview(null)
    // Clear file inputs
    const inputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>
    inputs.forEach(input => input.value = '')
  }

  const handleSaveChanges = async () => {
    if (!adminUserData?.id) {
      toast({
        title: "Update Failed",
        description: "User ID not found. Please refresh the page.",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)
      
      const updateData = {
        id: adminUserData.id,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        bio: profileData.bio,
        gender: profileData.gender,
        ...(profilePictureFile && { profilePicture: profilePictureFile })
      }
      
      const updatedUser = await updateAdminProfile(updateData)
      
      if (updatedUser) {
        // Small delay to ensure server has processed the image
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Refresh data from server to get the latest information
        await refreshUserData()
        
        // Update image key to force cache busting for new profile picture
        setImageKey(Date.now())
        
        // Force a complete refresh of all user contexts by triggering storage event
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event('user-profile-updated'))
        }
        
        // Clear profile picture preview after successful save
        if (profilePicturePreview) {
          URL.revokeObjectURL(profilePicturePreview)
          setProfilePicturePreview(null)
        }
        setProfilePictureFile(null) // Reset file after successful upload
        
        toast({
          title: "✅ Profile Updated",
          description: "Your profile has been updated with the latest information.",
        })
      }
    } catch (error) {
      console.error("Profile update error:", error)
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordUpdate = async () => {
    // Validation checks
    if (!passwordData.currentPassword) {
      toast({
        title: "Current Password Required",
        description: "Please enter your current password.",
        variant: "destructive",
      })
      return
    }

    if (!passwordData.newPassword) {
      toast({
        title: "New Password Required",
        description: "Please enter a new password.",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirm password do not match.",
        variant: "destructive",
      })
      return
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      toast({
        title: "Same Password",
        description: "New password must be different from current password.",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)
      
      await changeAdminPassword({
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
      
      toast({
        title: "✅ Password Updated",
        description: "Your password has been successfully updated.",
      })
    } catch (error: any) {
      console.error("Password update error:", error)
      
      // Handle specific error messages from the API
      let errorMessage = "Failed to update password. Please try again."
      
      if (error?.message) {
        errorMessage = error.message
      } else if (error?.data?.message) {
        errorMessage = error.data.message
      } else if (error?.status === 401) {
        errorMessage = "Current password is incorrect."
      } else if (error?.status === 400) {
        errorMessage = "Invalid password format. Please check your input."
      }
      
      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const hasChanges = JSON.stringify(profileData) !== JSON.stringify(originalData) || profilePictureFile !== null
  const hasPasswordData = passwordData.currentPassword && passwordData.newPassword && passwordData.confirmPassword

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const fullName = `${profileData.firstName} ${profileData.lastName}`.trim() || adminUserData?.fullName || "Administrator"

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-[--brad-800] rounded-xl p-6 text-white overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="w-20 h-20 border-4 border-white/20">
                <AvatarImage 
                  src={getProfilePictureUrl()} 
                  alt={fullName}
                  key={imageKey} // Force re-render when image changes
                />
                <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
                  {getInitials(profileData.firstName, profileData.lastName)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 flex space-x-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                  id="profile-picture-input"
                />
                <Button
                  size="icon"
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 border-2 border-white/40"
                  onClick={() => document.getElementById('profile-picture-input')?.click()}
                  type="button"
                  title="Upload new picture"
                >
                  <Camera className="w-4 h-4 text-white" />
                </Button>
                {profilePicturePreview && (
                  <Button
                    size="icon"
                    className="w-8 h-8 rounded-full bg-red-500/80 hover:bg-red-600/90 border-2 border-white/40"
                    onClick={clearProfilePicture}
                    type="button"
                    title="Remove selected picture"
                  >
                    <span className="text-white text-xs">×</span>
                  </Button>
                )}
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{fullName}</h1>
              <p className="text-white/80">{profileData.role}</p>
              <p className="text-white/60 text-sm">
                {adminUserData?.isActive ? 'Active' : 'Inactive'} • Joined {profileData.joinedDate}
              </p>
            </div>
          </div>
   
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Edit3 className="w-5 h-5" />
                <span>Profile Settings</span>
              </CardTitle>
              <CardDescription>
                Update profile information and security settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="update-profile">Update Profile</TabsTrigger>
                  <TabsTrigger value="change-password">Change Password</TabsTrigger>
                </TabsList>
                
                <TabsContent value="update-profile" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="firstName"
                          value={profileData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="pl-10"
                          placeholder="Enter your first name"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="lastName"
                          value={profileData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="pl-10"
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="pl-10"
                          placeholder="Enter your email address"
                          disabled
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="pl-10"
                          placeholder="Enter your phone number"
                          disabled  
                        />
                      </div>
                    </div>
                    
             
                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-sm font-medium">Role</Label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="role"
                          value={profileData.role}
                          onChange={(e) => handleInputChange('role', e.target.value)}
                          className="pl-10"
                          placeholder="Enter your role"
                          disabled
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gender" className="text-sm font-medium">Gender</Label>
                      <Select value={profileData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
                      <div className="relative">
                        <Input
                          id="bio"
                          value={profileData.bio}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          placeholder="Enter your bio"
                        />
                      </div>
                    </div>
                  </div>

                  
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                
                    <Button
                      onClick={handleSaveChanges}
                      disabled={!hasChanges || isLoading}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="change-password" className="space-y-6 mt-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4 border-t">
                    <Button 
                      onClick={handlePasswordUpdate}
                      disabled={!hasPasswordData || isLoading}
                      className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? "Updating..." : "Update Password"}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Account Overview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Account Overview</CardTitle>
              <CardDescription>
                Quick account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="text-sm font-medium">{profileData.email}</span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-muted-foreground">Phone</span>
                  <span className="text-sm font-medium">{profileData.phone}</span>
                </div>
                
           
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-muted-foreground">Role</span>
                  <span className="text-sm font-medium">{profileData.role}</span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className={`text-sm font-medium ${adminUserData?.isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {adminUserData?.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-muted-foreground">Joined</span>
                  <span className="text-sm font-medium">{profileData.joinedDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
