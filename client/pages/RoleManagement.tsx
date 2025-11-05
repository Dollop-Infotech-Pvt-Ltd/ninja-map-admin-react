import { motion, AnimatePresence } from "framer-motion"
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  Users,
  Check,
  X,
  Save,
  Eye,
  Settings,
  Database,
  FileText,
  BarChart3,
  Route,
  MapPin,
  Activity,
  Loader,
  RefreshCw
} from "lucide-react"
import { useEffect, useState } from "react"
import api from "@/lib/http"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { OptimizedDashboardLayout } from "@/components/optimized-dashboard-layout"
import { AddRoleModal } from "@/components/add-role-modal"
import { useToast } from "@/hooks/use-toast"
import { Link } from "react-router-dom"

// Icon mapping for resource categories
const resourceIconMap: Record<string, any> = {
  USER_MANAGEMENT: Users,
  ROLE_MANAGEMENT: Shield,
  ANALYTICS_REPORTS: BarChart3,
  NAVIGATION_MANAGEMENT: Route,
  SYSTEM_ADMINISTRATION: Settings,
}

interface ApiPermission {
  permissionId: string
  resource: string
  type: "READ" | "WRITE" | "DELETE" | "ADMIN"
  action: string
}

interface Permission {
  id: string
  label: string
  description: string
  level: string
  permissionId: string
}

interface PermissionCategory {
  label: string
  icon: any
  permissions: Permission[]
}

// Mock roles data
const mockRoles = [
  {
    id: "1",
    name: "Super Admin",
    description: "Full system access with all permissions",
    userCount: 2,
    permissions: [],
    isSystem: true,
    createdAt: "2024-01-01"
  },
  {
    id: "2", 
    name: "Admin",
    description: "Administrative access with most permissions",
    userCount: 5,
    permissions: [],
    isSystem: false,
    createdAt: "2024-01-05"
  },
  {
    id: "3",
    name: "Manager", 
    description: "Team management with limited administrative access",
    userCount: 12,
    permissions: [],
    isSystem: false,
    createdAt: "2024-01-10"
  },
  {
    id: "4",
    name: "User",
    description: "Basic user access with read permissions",
    userCount: 45,
    permissions: [],
    isSystem: false,
    createdAt: "2024-01-15"
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
}

export default function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([])
  const [permissionCategories, setPermissionCategories] = useState<Record<string, PermissionCategory>>({})
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isCreatingRole, setIsCreatingRole] = useState(false)
  const [isUpdatingRole, setIsUpdatingRole] = useState(false)
  const [newRole, setNewRole] = useState<Role>({
    name: "",
    description: "",
    permissions: []
  })
  const { toast } = useToast()

  // Load permissions and roles
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setIsLoadingData(true)

        // Fetch permissions from API
        const permRes = await api.get<any>('/api/permissions/get-all?resource=all')
        const permData = (permRes as any)?.data ?? permRes
        const permissions: ApiPermission[] = Array.isArray(permData) ? permData : permData?.permissions ?? []

        // Organize permissions by resource
        const categories: Record<string, PermissionCategory> = {}
        
        permissions.forEach(perm => {
          const resource = perm.resource
          if (!categories[resource]) {
            categories[resource] = {
              label: resource.replace(/_/g, ' '),
              icon: resourceIconMap[resource] || Shield,
              permissions: []
            }
          }

          const permissionLevel = perm.type.toLowerCase()
          categories[resource].permissions.push({
            id: `${resource.toLowerCase()}.${perm.action.toLowerCase()}`,
            label: perm.action.replace(/_/g, ' '),
            description: `${permissionLevel} access to ${perm.action.toLowerCase().replace(/_/g, ' ')}`,
            level: permissionLevel,
            permissionId: perm.permissionId
          })
        })

        if (mounted) {
          setPermissionCategories(categories)
        }

        // Fetch roles
        const endpoints = ['/api/roles/get-all', '/api/roles', '/api/roles/list']
        let items: any[] = []
        for (const ep of endpoints) {
          try {
            const res: any = await api.get(ep)
            const data = res?.data ?? res
            items = Array.isArray(data) ? data : data?.data ?? []
            if (Array.isArray(items) && items.length > 0) break
          } catch (err) {
            // try next endpoint
          }
        }

        if (mounted && Array.isArray(items) && items.length > 0) {
          setRoles(items.map((r: any) => ({
            id: (r.roleId || r.id || r._id || r.role_id)?.toString?.() || undefined,
            name: r.roleName || r.name || r.role || 'Unnamed',
            description: r.description || r.desc || '',
            permissions: Array.isArray(r.permissions) ? r.permissions.map((p: any) => 
              typeof p === 'string' ? p : p.permissionId
            ) : [],
            userCount: r.userCount || r.usersCount || 0,
            isSystem: !!r.isSystem,
            createdAt: r.createdAt || r.created_at || ''
          })))
        } else if (mounted) {
          setRoles(mockRoles)
        }
      } catch (e) {
        console.error('Failed to load permissions/roles:', e)
        setRoles(mockRoles)
        toast({
          title: 'Warning',
          description: 'Using default permissions. Some data may not be up to date.',
          variant: 'destructive'
        })
      } finally {
        if (mounted) {
          setIsLoadingData(false)
        }
      }
    })()
    return () => { mounted = false }
  }, [toast])

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateRole = async () => {
    if (!newRole.name || !newRole.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsCreatingRole(true)
    try {
      // Build permission IDs array from selected permissions
      const permissionIds = newRole.permissions.map(permId => {
        // Find the permission ID from the permission details
        for (const category of Object.values(permissionCategories)) {
          const perm = category.permissions.find(p => (p.permissionId || p.id) === permId)
          if (perm) {
            return perm.permissionId
          }
        }
        return permId
      })

      // Send API request with permission IDs only
      const body = {
        roleName: newRole.name,
        description: newRole.description,
        permissionIds: permissionIds
      }

      const response = await api.post('/api/roles/create', { body })
      const data = (response as any)?.data ?? response

      const role: Role = {
        ...newRole,
        id: data?.id || data?.roleId || (roles.length + 1).toString(),
        userCount: 0,
        isSystem: false,
        createdAt: new Date().toISOString().split('T')[0]
      }

      setRoles([...roles, role])
      setNewRole({ name: "", description: "", permissions: [] })
      setShowCreateDialog(false)

      toast({
        title: "Role Created",
        description: `${role.name} role has been successfully created.`,
      })
    } catch (error: any) {
      console.error('Failed to create role:', error)
      toast({
        title: "Error Creating Role",
        description: error?.message || "Failed to create role. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreatingRole(false)
    }
  }

  const handleEditRole = (role: Role) => {
    setEditingRole({ ...role })
    setShowEditDialog(true)
  }

  const handleUpdateRole = async () => {
    if (!editingRole) return

    setIsUpdatingRole(true)
    try {
      // Build permission IDs array from selected permissions
      const permissionIds = editingRole.permissions.map(permId => {
        // Find the permission ID from the permission details
        for (const category of Object.values(permissionCategories)) {
          const perm = category.permissions.find(p => (p.permissionId || p.id) === permId)
          if (perm) {
            return perm.permissionId
          }
        }
        return permId
      })

      // Send API request with permission IDs only
      const body = {
        roleName: editingRole.name,
        description: editingRole.description,
        permissionIds: permissionIds
      }

      await api.put(`/api/roles/update?roleId=${encodeURIComponent(editingRole.id || '')}`, { body })

      setRoles(roles.map(role =>
        role.id === editingRole.id ? editingRole : role
      ))
      setShowEditDialog(false)
      setEditingRole(null)

      toast({
        title: "Role Updated",
        description: `${editingRole.name} role has been successfully updated.`,
      })
    } catch (error: any) {
      console.error('Failed to update role:', error)
      toast({
        title: "Error Updating Role",
        description: error?.message || "Failed to update role. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingRole(false)
    }
  }

  const handleDeleteRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId)
    if (role?.isSystem) {
      toast({
        title: "Cannot Delete",
        description: "System roles cannot be deleted.",
        variant: "destructive",
      })
      return
    }

    if (role?.userCount && role.userCount > 0) {
      toast({
        title: "Cannot Delete",
        description: "Cannot delete role that has assigned users.",
        variant: "destructive",
      })
      return
    }

    setRoles(roles.filter(r => r.id !== roleId))
    
    toast({
      title: "Role Deleted",
      description: `${role?.name} role has been successfully deleted.`,
    })
  }

  const handlePermissionToggle = (permissionId: string, role: Role, setRole: (role: Role) => void) => {
    const hasPermission = role.permissions.includes(permissionId)
    const newPermissions = hasPermission
      ? role.permissions.filter(p => p !== permissionId)
      : [...role.permissions, permissionId]

    setRole({ ...role, permissions: newPermissions })
  }

  const RoleForm = ({ role, setRole }: { role: Role; setRole: (role: Role) => void }) => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="roleName">Role Name *</Label>
          <Input
            id="roleName"
            placeholder="Enter role name"
            value={role.name}
            onChange={(e) => setRole({ ...role, name: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="roleDescription">Description *</Label>
          <Textarea
            id="roleDescription"
            placeholder="Describe the role and its responsibilities"
            value={role.description}
            onChange={(e) => setRole({ ...role, description: e.target.value })}
            rows={3}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Permissions</h3>
        <p className="text-sm text-muted-foreground">
          Select the permissions this role should have. Users with this role will be able to perform these actions.
        </p>
        
        {Object.keys(permissionCategories).length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">No permissions available</p>
          </div>
        ) : (
          Object.entries(permissionCategories).map(([categoryKey, category]) => {
            const CategoryIcon = category.icon
            const categoryPermissions = category.permissions
            const selectedCount = categoryPermissions.filter(p => role.permissions.includes(p.permissionId || p.id)).length
            
            return (
              <Card key={categoryKey} className="border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-brand-100 dark:bg-brand-900 rounded-lg flex items-center justify-center">
                        <CategoryIcon className="w-4 h-4 text-brand-600" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{category.label}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {selectedCount}/{categoryPermissions.length} permissions selected
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const allSelected = categoryPermissions.every(p => role.permissions.includes(p.permissionId || p.id))
                        const permissionIds = categoryPermissions.map(p => p.permissionId || p.id)
                        const newPermissions = allSelected
                          ? role.permissions.filter(p => !permissionIds.includes(p))
                          : [...new Set([...role.permissions, ...permissionIds])]
                        setRole({ ...role, permissions: newPermissions })
                      }}
                    >
                      {selectedCount === categoryPermissions.length ? "Deselect All" : "Select All"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid gap-3">
                    {categoryPermissions.map((permission) => (
                      <div key={permission.permissionId} className="flex items-start space-x-3 p-3 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors">
                        <Checkbox
                          id={permission.permissionId}
                          checked={role.permissions.includes(permission.permissionId || permission.id)}
                          onCheckedChange={() => handlePermissionToggle(permission.permissionId || permission.id, role, setRole)}
                          className="mt-0.5"
                        />
                        <div className="flex-1">
                          <Label 
                            htmlFor={permission.permissionId} 
                            className="text-sm font-medium cursor-pointer"
                          >
                            {permission.label}
                          </Label>
                          <p className="text-xs text-muted-foreground mt-1">
                            {permission.description}
                          </p>
                          <Badge variant="secondary" className="text-xs mt-2">
                            {permission.level}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )

  if (isLoadingData) {
    return (
      <OptimizedDashboardLayout title="Role Management">
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <Loader className="w-8 h-8 animate-spin text-brand-500" />
            <p className="text-muted-foreground">Loading roles and permissions...</p>
          </div>
        </div>
      </OptimizedDashboardLayout>
    )
  }

  return (
    <OptimizedDashboardLayout title="Role Management">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Secondary</Badge>
              <p className="text-xs text-muted-foreground font-medium">Define roles using available permissions</p>
            </div>
            <h2 className="text-xl lg:text-2xl font-bold text-foreground">Roles Management</h2>
            <p className="text-sm text-muted-foreground">
              Create roles and assign permissions that were defined in Permissions Management
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Link to="/dashboard/permissions">
              <Button variant="outline" size="sm" className="h-8">
                <Settings className="w-3.5 h-3.5 mr-1.5" />
                Manage Permissions
              </Button>
            </Link>
            <Button onClick={() => setShowCreateDialog(true)} size="sm" className="h-8 bg-brand hover:bg-brand-700">
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Create Role
            </Button>
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search roles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Roles Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Roles ({filteredRoles.length})</CardTitle>
            <CardDescription>
              Manage user roles and their associated permissions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filteredRoles.map((role) => (
                    <motion.tr
                      key={role.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <TableCell>
                        <div>
                          <div className="flex items-center space-x-2">
                            <Shield className="w-4 h-4 text-brand-600" />
                            <p className="font-medium text-foreground">{role.name}</p>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {role.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{role.userCount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{role.permissions.length}</span>
                          <span className="text-xs text-muted-foreground">permissions</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {role.createdAt}
                      </TableCell>
                      <TableCell>
                        <Badge variant={role.isSystem ? "default" : "secondary"}>
                          {role.isSystem ? "System" : "Custom"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditRole(role)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Role
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteRole(role.id!)}
                              disabled={role.isSystem || (role.userCount && role.userCount > 0)}
                              className="text-red-600 focus:text-red-600 disabled:text-muted-foreground"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Role
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create Role Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>
                Create a new role and assign permissions to it.
              </DialogDescription>
            </DialogHeader>
            <RoleForm role={newRole} setRole={setNewRole} />
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => {
                setShowCreateDialog(false)
                setNewRole({ name: "", description: "", permissions: [] })
              }} disabled={isCreatingRole}>
                Cancel
              </Button>
              <Button onClick={handleCreateRole} disabled={isCreatingRole} className="bg-brand-600 hover:bg-brand-700">
                {isCreatingRole ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Role
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Role Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Role</DialogTitle>
              <DialogDescription>
                Modify role permissions and settings.
              </DialogDescription>
            </DialogHeader>
            {editingRole && (
              <RoleForm role={editingRole} setRole={setEditingRole} />
            )}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowEditDialog(false)} disabled={isUpdatingRole}>
                Cancel
              </Button>
              <Button onClick={handleUpdateRole} disabled={isUpdatingRole} className="bg-brand-600 hover:bg-brand-700">
                {isUpdatingRole ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Update Role
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </OptimizedDashboardLayout>
  )
}
