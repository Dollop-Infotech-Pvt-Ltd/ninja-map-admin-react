import { useState } from "react"
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
  Activity
} from "lucide-react"
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

// Permission categories and definitions
const permissionCategories = {
  users: {
    label: "User Management",
    icon: Users,
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
    permissions: [
      { id: "analytics.view", label: "View Analytics", description: "Can access analytics dashboard" },
      { id: "analytics.export", label: "Export Reports", description: "Can export analytics data" },
      { id: "analytics.advanced", label: "Advanced Analytics", description: "Access to detailed analytics" },
    ]
  },
  navigation: {
    label: "Navigation Management",
    icon: Route,
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
    permissions: [
      { id: "system.settings", label: "System Settings", description: "Can modify system configuration" },
      { id: "system.logs", label: "View Logs", description: "Can access system logs" },
      { id: "system.backup", label: "Backup Management", description: "Can manage system backups" },
      { id: "system.maintenance", label: "Maintenance Mode", description: "Can enable maintenance mode" },
    ]
  }
}

// Mock roles data
const mockRoles = [
  {
    id: "1",
    name: "Super Admin",
    description: "Full system access with all permissions",
    userCount: 2,
    permissions: Object.values(permissionCategories).flatMap(cat => cat.permissions.map(p => p.id)),
    isSystem: true,
    createdAt: "2024-01-01"
  },
  {
    id: "2", 
    name: "Admin",
    description: "Administrative access with most permissions",
    userCount: 5,
    permissions: [
      "users.view", "users.create", "users.edit",
      "roles.view", "roles.create", "roles.edit",
      "analytics.view", "analytics.export",
      "navigation.view", "navigation.create", "navigation.edit"
    ],
    isSystem: false,
    createdAt: "2024-01-05"
  },
  {
    id: "3",
    name: "Manager", 
    description: "Team management with limited administrative access",
    userCount: 12,
    permissions: [
      "users.view", "users.edit",
      "analytics.view",
      "navigation.view", "navigation.create", "navigation.edit"
    ],
    isSystem: false,
    createdAt: "2024-01-10"
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
  const [roles, setRoles] = useState(mockRoles)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [newRole, setNewRole] = useState<Role>({
    name: "",
    description: "",
    permissions: []
  })
  const { toast } = useToast()

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateRole = () => {
    if (!newRole.name || !newRole.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const role: Role = {
      ...newRole,
      id: (roles.length + 1).toString(),
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
  }

  const handleEditRole = (role: Role) => {
    setEditingRole({ ...role })
    setShowEditDialog(true)
  }

  const handleUpdateRole = () => {
    if (!editingRole) return

    setRoles(roles.map(role => 
      role.id === editingRole.id ? editingRole : role
    ))
    setShowEditDialog(false)
    setEditingRole(null)
    
    toast({
      title: "Role Updated",
      description: `${editingRole.name} role has been successfully updated.`,
    })
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
        
        {Object.entries(permissionCategories).map(([categoryKey, category]) => {
          const CategoryIcon = category.icon
          const categoryPermissions = category.permissions
          const selectedCount = categoryPermissions.filter(p => role.permissions.includes(p.id)).length
          
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
                      const allSelected = categoryPermissions.every(p => role.permissions.includes(p.id))
                      const newPermissions = allSelected
                        ? role.permissions.filter(p => !categoryPermissions.some(cp => cp.id === p))
                        : [...new Set([...role.permissions, ...categoryPermissions.map(p => p.id)])]
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
                    <div key={permission.id} className="flex items-start space-x-3 p-3 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors">
                      <Checkbox
                        id={permission.id}
                        checked={role.permissions.includes(permission.id)}
                        onCheckedChange={() => handlePermissionToggle(permission.id, role, setRole)}
                        className="mt-0.5"
                      />
                      <div className="flex-1">
                        <Label 
                          htmlFor={permission.id} 
                          className="text-sm font-medium cursor-pointer"
                        >
                          {permission.label}
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          {permission.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )

  return (
    <OptimizedDashboardLayout title="Role Management">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-foreground">Roles & Permissions</h2>
            <p className="text-sm text-muted-foreground">
              Manage roles and their permissions for access control
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Link to="/dashboard/permissions">
              <Button variant="outline" size="sm" className="h-8">
                <Settings className="w-3.5 h-3.5 mr-1.5" />
                Advanced Permissions
              </Button>
            </Link>
            <Button onClick={() => setShowCreateDialog(true)} size="sm" className="h-8 bg-brand-600 hover:bg-brand-700">
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

        {/* Add Role Modal */}
        <AddRoleModal
          isOpen={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          onRoleCreated={(role) => {
            const newRoleWithId = {
              ...role,
              id: (roles.length + 1).toString(),
              userCount: 0,
              isSystem: false,
              createdAt: new Date().toISOString().split('T')[0],
              lastModified: new Date().toISOString().split('T')[0]
            }
            setRoles([...roles, newRoleWithId])
          }}
        />

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
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateRole} className="bg-brand-600 hover:bg-brand-700">
                <Save className="w-4 h-4 mr-2" />
                Update Role
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </OptimizedDashboardLayout>
  )
}
