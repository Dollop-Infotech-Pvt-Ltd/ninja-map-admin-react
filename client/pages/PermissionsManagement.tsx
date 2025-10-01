import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Shield, 
  Users, 
  Settings, 
  BarChart3, 
  Route, 
  Search,
  Filter,
  ArrowLeft,
  Save,
  RefreshCw,
  Check,
  X,
  AlertTriangle,
  Copy,
  Eye,
  EyeOff,
  Plus,
  Minus,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
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
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { OptimizedDashboardLayout } from "@/components/optimized-dashboard-layout"
import { useToast } from "@/hooks/use-toast"
import { Link } from "react-router-dom"

// Extended permission categories with more granular controls
const permissionCategories = {
  users: {
    label: "User Management",
    icon: Users,
    color: "from-green-500 to-emerald-600",
    description: "Control user account operations and data access",
    permissions: [
      { id: "users.view", label: "View Users", description: "Access user directory and profiles", level: "read", critical: false },
      { id: "users.create", label: "Create Users", description: "Add new user accounts", level: "write", critical: false },
      { id: "users.edit", label: "Edit Users", description: "Modify user information and settings", level: "write", critical: false },
      { id: "users.delete", label: "Delete Users", description: "Remove user accounts permanently", level: "delete", critical: true },
      { id: "users.export", label: "Export User Data", description: "Download user information", level: "read", critical: false },
      { id: "users.import", label: "Import Users", description: "Bulk upload user accounts", level: "write", critical: false },
    ]
  },
  roles: {
    label: "Role Management",
    icon: Shield,
    color: "from-purple-500 to-pink-600",
    description: "Manage access control and permission systems",
    permissions: [
      { id: "roles.view", label: "View Roles", description: "See role definitions and assignments", level: "read", critical: false },
      { id: "roles.create", label: "Create Roles", description: "Define new access roles", level: "write", critical: false },
      { id: "roles.edit", label: "Edit Roles", description: "Modify role permissions", level: "write", critical: true },
      { id: "roles.delete", label: "Delete Roles", description: "Remove roles from system", level: "delete", critical: true },
      { id: "roles.assign", label: "Assign Roles", description: "Grant roles to users", level: "write", critical: false },
    ]
  },
  analytics: {
    label: "Analytics & Reports",
    icon: BarChart3,
    color: "from-blue-500 to-indigo-600",
    description: "Access performance data and business intelligence",
    permissions: [
      { id: "analytics.view", label: "View Analytics", description: "Access standard analytics dashboard", level: "read", critical: false },
      { id: "analytics.advanced", label: "Advanced Analytics", description: "Access detailed metrics and trends", level: "read", critical: false },
      { id: "analytics.export", label: "Export Reports", description: "Download analytics data", level: "read", critical: false },
      { id: "analytics.create", label: "Create Reports", description: "Build custom analytics reports", level: "write", critical: false },
      { id: "analytics.realtime", label: "Real-time Data", description: "Access live system metrics", level: "read", critical: false },
    ]
  },
  navigation: {
    label: "Navigation Management",
    icon: Route,
    color: "from-brand-500 to-brand-600",
    description: "Control route planning and navigation systems",
    permissions: [
      { id: "navigation.view", label: "View Routes", description: "Access navigation and route data", level: "read", critical: false },
      { id: "navigation.create", label: "Create Routes", description: "Design new navigation paths", level: "write", critical: false },
      { id: "navigation.edit", label: "Edit Routes", description: "Modify existing routes", level: "write", critical: false },
      { id: "navigation.delete", label: "Delete Routes", description: "Remove navigation routes", level: "delete", critical: true },
      { id: "navigation.optimize", label: "Route Optimization", description: "Access route optimization tools", level: "write", critical: false },
      { id: "navigation.publish", label: "Publish Routes", description: "Make routes available to users", level: "write", critical: false },
    ]
  },
  system: {
    label: "System Administration",
    icon: Settings,
    color: "from-orange-500 to-red-600",
    description: "Control core system settings and maintenance",
    permissions: [
      { id: "system.settings", label: "System Settings", description: "Modify core system configuration", level: "admin", critical: true },
      { id: "system.logs", label: "View Logs", description: "Access system audit trails", level: "read", critical: false },
      { id: "system.backup", label: "Backup Management", description: "Control data backup operations", level: "admin", critical: true },
      { id: "system.maintenance", label: "Maintenance Mode", description: "Enable system maintenance state", level: "admin", critical: true },
      { id: "system.integrations", label: "API Integrations", description: "Manage external service connections", level: "admin", critical: true },
    ]
  }
}

// Mock roles data with detailed permissions
const mockRoles = [
  {
    id: "1",
    name: "Super Admin",
    description: "Full system access with all permissions",
    userCount: 2,
    permissions: Object.values(permissionCategories).flatMap(cat => cat.permissions.map(p => p.id)),
    isSystem: true,
    createdAt: "2024-01-01",
    lastModified: "2024-01-15"
  },
  {
    id: "2", 
    name: "Admin",
    description: "Administrative access with most permissions",
    userCount: 5,
    permissions: [
      "users.view", "users.create", "users.edit", "users.export",
      "roles.view", "roles.create", "roles.edit", "roles.assign",
      "analytics.view", "analytics.export", "analytics.create",
      "navigation.view", "navigation.create", "navigation.edit", "navigation.publish",
      "system.logs"
    ],
    isSystem: false,
    createdAt: "2024-01-05",
    lastModified: "2024-01-12"
  },
  {
    id: "3",
    name: "Manager", 
    description: "Team management with limited administrative access",
    userCount: 12,
    permissions: [
      "users.view", "users.edit", "users.export",
      "analytics.view", "analytics.export",
      "navigation.view", "navigation.create", "navigation.edit",
      "roles.view"
    ],
    isSystem: false,
    createdAt: "2024-01-10",
    lastModified: "2024-01-11"
  },
  {
    id: "4",
    name: "User",
    description: "Basic user access with read permissions",
    userCount: 45,
    permissions: [
      "users.view",
      "analytics.view",
      "navigation.view"
    ],
    isSystem: false,
    createdAt: "2024-01-15",
    lastModified: "2024-01-15"
  }
]

interface Role {
  id?: string
  name: string
  description: string
  userCount?: number
  permissions: string[]
  isSystem?: boolean
  createdAt?: string
  lastModified?: string
}

export default function PermissionsManagement() {
  const [roles, setRoles] = useState(mockRoles)
  const [selectedRole, setSelectedRole] = useState<Role | null>(roles[0])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [levelFilter, setLevelFilter] = useState("all")
  const [showCriticalOnly, setShowCriticalOnly] = useState(false)
  const [isCompactView, setIsCompactView] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const handlePermissionToggle = (permissionId: string) => {
    if (!selectedRole || selectedRole.isSystem) return
    
    const hasPermission = selectedRole.permissions.includes(permissionId)
    const newPermissions = hasPermission
      ? selectedRole.permissions.filter(p => p !== permissionId)
      : [...selectedRole.permissions, permissionId]
    
    setSelectedRole({ ...selectedRole, permissions: newPermissions })
    setHasUnsavedChanges(true)
  }

  const handleBulkPermissionToggle = (categoryKey: string, action: 'all' | 'none' | 'read' | 'write') => {
    if (!selectedRole || selectedRole.isSystem) return

    const category = permissionCategories[categoryKey as keyof typeof permissionCategories]
    const categoryPermissions = category.permissions
    
    let permissionsToToggle: string[] = []
    
    switch (action) {
      case 'all':
        permissionsToToggle = categoryPermissions.map(p => p.id)
        break
      case 'none':
        permissionsToToggle = []
        break
      case 'read':
        permissionsToToggle = categoryPermissions.filter(p => p.level === 'read').map(p => p.id)
        break
      case 'write':
        permissionsToToggle = categoryPermissions.filter(p => ['read', 'write'].includes(p.level)).map(p => p.id)
        break
    }
    
    const otherPermissions = selectedRole.permissions.filter(p => !categoryPermissions.some(cp => cp.id === p))
    const newPermissions = [...otherPermissions, ...permissionsToToggle]
    
    setSelectedRole({ ...selectedRole, permissions: newPermissions })
    setHasUnsavedChanges(true)
  }

  const handleSaveChanges = async () => {
    if (!selectedRole) return
    
    setIsSaving(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setRoles(roles.map(role => 
        role.id === selectedRole.id 
          ? { ...selectedRole, lastModified: new Date().toISOString().split('T')[0] }
          : role
      ))
      
      setHasUnsavedChanges(false)
      
      toast({
        title: "Permissions Updated",
        description: `${selectedRole.name} role permissions have been successfully updated.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save permissions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const filteredCategories = Object.entries(permissionCategories).filter(([key, category]) => {
    if (categoryFilter !== "all" && key !== categoryFilter) return false
    
    const matchesSearch = category.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         category.permissions.some(p => 
                           p.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           p.description.toLowerCase().includes(searchQuery.toLowerCase())
                         )
    
    return matchesSearch
  })

  const getPermissionLevelColor = (level: string) => {
    switch (level) {
      case 'read': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
      case 'write': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
      case 'delete': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
      case 'admin': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getTotalPermissions = () => {
    return Object.values(permissionCategories).reduce((total, category) => total + category.permissions.length, 0)
  }

  const getSelectedPermissions = () => {
    return selectedRole?.permissions.length || 0
  }

  const getCategoryStats = (categoryKey: string) => {
    const category = permissionCategories[categoryKey as keyof typeof permissionCategories]
    const selected = category.permissions.filter(p => selectedRole?.permissions.includes(p.id)).length
    const total = category.permissions.length
    const percentage = total > 0 ? (selected / total) * 100 : 0
    
    return { selected, total, percentage }
  }

  return (
    <OptimizedDashboardLayout title="Permissions Management">
      <div className="max-w-7xl mx-auto space-y-4 lg:space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
        >
          <div className="flex items-center space-x-3">
            <Link to="/dashboard/roles">
              <Button variant="outline" size="sm" className="h-8">
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                Back to Roles
              </Button>
            </Link>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-foreground">Advanced Permissions Management</h1>
              <p className="text-sm text-muted-foreground">
                Configure detailed access controls and permission matrices
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {hasUnsavedChanges && (
              <Badge variant="outline" className="text-orange-600 border-orange-300">
                <Clock className="w-3 h-3 mr-1" />
                Unsaved Changes
              </Badge>
            )}
            <Button 
              onClick={handleSaveChanges} 
              disabled={!hasUnsavedChanges || isSaving}
              className="h-8"
            >
              {isSaving ? (
                <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5 mr-1.5" />
              )}
              Save Changes
            </Button>
          </div>
        </motion.div>

        <div className="grid gap-4 lg:gap-6 grid-cols-1 lg:grid-cols-4">
          {/* Role Selector Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="sticky top-20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Select Role</CardTitle>
                <CardDescription className="text-sm">
                  Choose a role to manage its permissions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {roles.map((role) => (
                  <motion.div
                    key={role.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <button
                      onClick={() => setSelectedRole(role)}
                      className={`w-full p-3 text-left rounded-lg border transition-all ${
                        selectedRole?.id === role.id
                          ? "border-brand-300 bg-brand-50 dark:bg-brand-900/20"
                          : "border-border hover:border-brand-200 hover:bg-accent"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{role.name}</span>
                        {role.isSystem && (
                          <Badge variant="secondary" className="text-xs">
                            System
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{role.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{role.userCount} users</span>
                        <span className="text-muted-foreground">{role.permissions.length} permissions</span>
                      </div>
                    </button>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Permissions Panel */}
          <div className="lg:col-span-3 space-y-4 lg:space-y-6">
            {/* Role Overview */}
            {selectedRole && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-900/20 dark:to-purple-900/20 border-brand-200/50">
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                          <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-foreground">{selectedRole.name}</h2>
                          <p className="text-sm text-muted-foreground">{selectedRole.description}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <Badge variant="outline" className="text-xs">
                              <Users className="w-3 h-3 mr-1" />
                              {selectedRole.userCount} users
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <Shield className="w-3 h-3 mr-1" />
                              {getSelectedPermissions()}/{getTotalPermissions()} permissions
                            </Badge>
                            {selectedRole.isSystem && (
                              <Badge variant="secondary" className="text-xs">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                System Role
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="w-full lg:w-32">
                        <div className="text-xs text-muted-foreground mb-1">Permission Coverage</div>
                        <Progress value={(getSelectedPermissions() / getTotalPermissions()) * 100} className="h-2" />
                        <div className="text-xs text-muted-foreground mt-1 text-right">
                          {Math.round((getSelectedPermissions() / getTotalPermissions()) * 100)}%
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="grid gap-4 grid-cols-1 lg:grid-cols-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search permissions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-9"
                      />
                    </div>
                    
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {Object.entries(permissionCategories).map(([key, category]) => (
                          <SelectItem key={key} value={key}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={levelFilter} onValueChange={setLevelFilter}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Filter by level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="read">Read Only</SelectItem>
                        <SelectItem value="write">Read & Write</SelectItem>
                        <SelectItem value="delete">Delete Access</SelectItem>
                        <SelectItem value="admin">Admin Access</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="compact-view"
                        checked={isCompactView}
                        onCheckedChange={setIsCompactView}
                      />
                      <Label htmlFor="compact-view" className="text-sm">Compact</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Permissions Grid */}
            <div className="space-y-4">
              <AnimatePresence>
                {filteredCategories.map(([categoryKey, category], index) => {
                  const CategoryIcon = category.icon
                  const stats = getCategoryStats(categoryKey)
                  const filteredPermissions = category.permissions.filter(permission => {
                    if (levelFilter !== "all" && permission.level !== levelFilter) return false
                    if (showCriticalOnly && !permission.critical) return false
                    
                    const matchesSearch = !searchQuery || 
                      permission.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      permission.description.toLowerCase().includes(searchQuery.toLowerCase())
                    
                    return matchesSearch
                  })

                  if (filteredPermissions.length === 0) return null

                  return (
                    <motion.div
                      key={categoryKey}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="border border-border/50">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center shadow-sm`}>
                                <CategoryIcon className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <CardTitle className="text-base">{category.label}</CardTitle>
                                <CardDescription className="text-sm">
                                  {category.description} • {stats.selected}/{stats.total} permissions
                                </CardDescription>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Progress value={stats.percentage} className="w-16 h-2" />
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="sm" className="h-7" disabled={selectedRole?.isSystem}>
                                    Quick Actions
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleBulkPermissionToggle(categoryKey, 'all')}>
                                    <Check className="w-4 h-4 mr-2" />
                                    Select All
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleBulkPermissionToggle(categoryKey, 'none')}>
                                    <X className="w-4 h-4 mr-2" />
                                    Deselect All
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleBulkPermissionToggle(categoryKey, 'read')}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    Read Only
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleBulkPermissionToggle(categoryKey, 'write')}>
                                    <EyeOff className="w-4 h-4 mr-2" />
                                    Read & Write
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className={`grid gap-3 ${isCompactView ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
                            {filteredPermissions.map((permission) => (
                              <motion.div 
                                key={permission.id} 
                                className={`flex items-start space-x-3 p-3 rounded-lg border border-border/50 transition-all duration-200 ${
                                  selectedRole?.permissions.includes(permission.id) 
                                    ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' 
                                    : 'hover:bg-accent/50'
                                } ${selectedRole?.isSystem ? 'opacity-60' : ''}`}
                                whileHover={{ scale: selectedRole?.isSystem ? 1 : 1.01 }}
                              >
                                <Checkbox
                                  id={permission.id}
                                  checked={selectedRole?.permissions.includes(permission.id) || false}
                                  onCheckedChange={() => handlePermissionToggle(permission.id)}
                                  disabled={selectedRole?.isSystem}
                                  className="mt-0.5 shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <Label 
                                      htmlFor={permission.id} 
                                      className={`text-sm font-medium ${selectedRole?.isSystem ? 'cursor-default' : 'cursor-pointer'}`}
                                    >
                                      {permission.label}
                                    </Label>
                                    <div className="flex items-center space-x-1">
                                      <Badge 
                                        variant="secondary" 
                                        className={`text-xs ${getPermissionLevelColor(permission.level)}`}
                                      >
                                        {permission.level}
                                      </Badge>
                                      {permission.critical && (
                                        <Badge variant="destructive" className="text-xs">
                                          <AlertTriangle className="w-2.5 h-2.5 mr-1" />
                                          Critical
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  <p className="text-xs text-muted-foreground leading-relaxed">
                                    {permission.description}
                                  </p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            {selectedRole?.isSystem && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    System Role Protection
                  </p>
                </div>
                <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                  This is a system-protected role. Permissions cannot be modified to ensure system stability and security.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </OptimizedDashboardLayout>
  )
}
