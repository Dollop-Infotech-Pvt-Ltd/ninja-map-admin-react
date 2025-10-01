import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Shield, 
  Save, 
  X,
  Users,
  Settings,
  Database,
  FileText,
  BarChart3,
  Route,
  MapPin,
  Activity,
  Check,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/http"

// Permission categories and definitions
const permissionCategories = {
  users: {
    label: "User Management",
    icon: Users,
    color: "from-green-500 to-emerald-600",
    permissions: [
      { id: "users.view", label: "View Users", description: "Can view user list and profiles" },
      { id: "users.create", label: "Create Users", description: "Can add new users to the system" },
      { id: "users.edit", label: "Edit Users", description: "Can modify user information" },
      { id: "users.delete", label: "Delete Users", description: "Can remove users from the system" },
    ]
  },
  roles: {
    label: "Role Management",
    icon: Shield,
    color: "from-purple-500 to-pink-600",
    permissions: [
      { id: "roles.view", label: "View Roles", description: "Can view role list and permissions" },
      { id: "roles.create", label: "Create Roles", description: "Can create new roles" },
      { id: "roles.edit", label: "Edit Roles", description: "Can modify role permissions" },
      { id: "roles.delete", label: "Delete Roles", description: "Can remove roles" },
    ]
  },
  analytics: {
    label: "Analytics & Reports",
    icon: BarChart3,
    color: "from-blue-500 to-indigo-600",
    permissions: [
      { id: "analytics.view", label: "View Analytics", description: "Can access analytics dashboard" },
      { id: "analytics.export", label: "Export Reports", description: "Can export analytics data" },
      { id: "analytics.advanced", label: "Advanced Analytics", description: "Access to detailed analytics" },
    ]
  },
  navigation: {
    label: "Navigation Management",
    icon: Route,
    color: "from-brand-500 to-brand-600",
    permissions: [
      { id: "navigation.view", label: "View Routes", description: "Can view navigation routes" },
      { id: "navigation.create", label: "Create Routes", description: "Can create new routes" },
      { id: "navigation.edit", label: "Edit Routes", description: "Can modify existing routes" },
      { id: "navigation.delete", label: "Delete Routes", description: "Can remove routes" },
    ]
  },
  system: {
    label: "System Administration",
    icon: Settings,
    color: "from-orange-500 to-red-600",
    permissions: [
      { id: "system.settings", label: "System Settings", description: "Can modify system configuration" },
      { id: "system.logs", label: "View Logs", description: "Can access system logs" },
      { id: "system.backup", label: "Backup Management", description: "Can manage system backups" },
      { id: "system.maintenance", label: "Maintenance Mode", description: "Can enable maintenance mode" },
    ]
  }
}

interface Role {
  name: string
  description: string
  permissions: string[]
}

interface AddRoleModalProps {
  isOpen: boolean
  onClose: () => void
  onRoleCreated: (role: Role) => void
}

export function AddRoleModal({ isOpen, onClose, onRoleCreated }: AddRoleModalProps) {
  const [newRole, setNewRole] = useState<Role>({
    name: "",
    description: "",
    permissions: []
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handlePermissionToggle = (permissionId: string) => {
    const hasPermission = newRole.permissions.includes(permissionId)
    const newPermissions = hasPermission
      ? newRole.permissions.filter(p => p !== permissionId)
      : [...newRole.permissions, permissionId]
    
    setNewRole({ ...newRole, permissions: newPermissions })
  }

  const handleSelectAllCategory = (categoryKey: string) => {
    const category = permissionCategories[categoryKey as keyof typeof permissionCategories]
    const categoryPermissions = category.permissions.map(p => p.id)
    const allSelected = categoryPermissions.every(p => newRole.permissions.includes(p))
    
    const newPermissions = allSelected
      ? newRole.permissions.filter(p => !categoryPermissions.includes(p))
      : [...new Set([...newRole.permissions, ...categoryPermissions])]
    
    setNewRole({ ...newRole, permissions: newPermissions })
  }

  const handleCreateRole = async () => {
    if (!newRole.name || !newRole.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (newRole.permissions.length === 0) {
      toast({
        title: "No Permissions Selected",
        description: "Please select at least one permission for this role.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Build permissions payload mapping grouped permissions to capability flags
      const permissionsMap = newRole.permissions.reduce((acc: Record<string, any>, p) => {
        const [group, action] = p.split('.')
        if (!group) return acc
        const key = `${group.toUpperCase()}_MANAGEMENT`
        if (!acc[key]) acc[key] = { permissionTitle: key, canCreate: false, canRead: false, canUpdate: false, canDelete: false }
        if (action === 'create') acc[key].canCreate = true
        if (action === 'view' || action === 'read') acc[key].canRead = true
        if (action === 'edit' || action === 'update') acc[key].canUpdate = true
        if (action === 'delete') acc[key].canDelete = true
        return acc
      }, {})

      const permissionsPayload = Object.values(permissionsMap)

      const body = {
        roleName: newRole.name,
        description: newRole.description,
        permissions: permissionsPayload,
        rawPermissions: newRole.permissions,
      }

      const res = await api.post<any>("/api/roles/create", { body })
      const responseData = res?.data ?? res

      // Try to derive created role from response, fallback to local data
      const created = (responseData && (responseData.role || responseData.data)) || responseData || null
      const createdRole = created
        ? {
            id: created.id || created._id || created.roleId || created.role_id,
            name: created.name || created.roleName || newRole.name,
            description: created.description || newRole.description,
            permissions: created.permissions || created.rawPermissions || newRole.permissions,
            userCount: created.userCount || 0,
            isSystem: !!created.isSystem,
            createdAt: created.createdAt || created.created_at || new Date().toISOString().split('T')[0],
          }
        : {
            id: undefined,
            name: newRole.name,
            description: newRole.description,
            permissions: newRole.permissions,
            userCount: 0,
            isSystem: false,
            createdAt: new Date().toISOString().split('T')[0],
          }

      onRoleCreated({ name: createdRole.name, description: createdRole.description, permissions: createdRole.permissions, id: createdRole.id } as Role)

      toast({
        title: "Role Created",
        description: `${createdRole.name} role has been successfully created with ${createdRole.permissions.length} permissions.`,
      })

      // Reset form
      setNewRole({ name: "", description: "", permissions: [] })
      onClose()
    } catch (error: any) {
      console.error(error)
      toast({
        title: "Error",
        description: error?.message || "Failed to create role. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalPermissions = Object.values(permissionCategories).reduce((total, category) => total + category.permissions.length, 0)
  const selectedPermissions = newRole.permissions.length
  const isFormValid = newRole.name && newRole.description && selectedPermissions > 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg lg:text-xl">Create New Role</DialogTitle>
              <DialogDescription className="text-sm">
                Define a new role with specific permissions for your organization.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 min-h-0 space-y-4">
          {/* Basic Information */}
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="roleName" className="text-sm">Role Name *</Label>
              <Input
                id="roleName"
                placeholder="e.g., Content Manager"
                value={newRole.name}
                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                className="h-9"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm">Permissions Selected</Label>
              <div className="flex items-center space-x-2 h-9 px-3 bg-muted rounded-md">
                <Badge variant={selectedPermissions > 0 ? "default" : "secondary"} className="text-xs">
                  {selectedPermissions > 0 ? (
                    <Check className="w-3 h-3 mr-1" />
                  ) : (
                    <AlertCircle className="w-3 h-3 mr-1" />
                  )}
                  {selectedPermissions}/{totalPermissions} permissions
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="roleDescription" className="text-sm">Description *</Label>
            <Textarea
              id="roleDescription"
              placeholder="Describe the role and its responsibilities..."
              value={newRole.description}
              onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
              rows={2}
              className="resize-none"
            />
          </div>

          {/* Permissions Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-foreground">Permissions</h3>
              <Badge variant="outline" className="text-xs">
                {selectedPermissions} selected
              </Badge>
            </div>
            
            <ScrollArea className="h-96 pr-4">
              <div className="space-y-3">
                {Object.entries(permissionCategories).map(([categoryKey, category]) => {
                  const CategoryIcon = category.icon
                  const categoryPermissions = category.permissions
                  const selectedCount = categoryPermissions.filter(p => newRole.permissions.includes(p.id)).length
                  const allSelected = selectedCount === categoryPermissions.length
                  
                  return (
                    <motion.div
                      key={categoryKey}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="border border-border/50 shadow-sm">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center shadow-sm`}>
                                <CategoryIcon className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <CardTitle className="text-sm font-medium">{category.label}</CardTitle>
                                <p className="text-xs text-muted-foreground">
                                  {selectedCount}/{categoryPermissions.length} permissions
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSelectAllCategory(categoryKey)}
                              className="h-7 text-xs"
                            >
                              {allSelected ? "Deselect All" : "Select All"}
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="grid gap-2">
                            {categoryPermissions.map((permission) => (
                              <div key={permission.id} className="flex items-start space-x-3 p-2 rounded-md border border-border/30 hover:bg-accent/50 transition-colors">
                                <Checkbox
                                  id={permission.id}
                                  checked={newRole.permissions.includes(permission.id)}
                                  onCheckedChange={() => handlePermissionToggle(permission.id)}
                                  className="mt-0.5 shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <Label 
                                    htmlFor={permission.id} 
                                    className="text-xs font-medium cursor-pointer"
                                  >
                                    {permission.label}
                                  </Label>
                                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                                    {permission.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-border shrink-0">
          <div className="text-xs text-muted-foreground">
            {isFormValid ? (
              <span className="text-green-600 flex items-center">
                <Check className="w-3 h-3 mr-1" />
                Ready to create role
              </span>
            ) : (
              <span className="flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                Please complete all required fields
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateRole} 
              disabled={!isFormValid || isSubmitting}
              className="min-w-[100px]"
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Role
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
