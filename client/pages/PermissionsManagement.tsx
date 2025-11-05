import React, { useState, useEffect } from "react"
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
  Clock,
  Loader
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
import api from "@/lib/http"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { usePermissions } from "@/lib/permissions"

// Icon mapping for resource categories
const resourceIconMap: Record<string, any> = {
  USER_MANAGEMENT: Users,
  ROLE_MANAGEMENT: Shield,
  ANALYTICS_REPORTS: BarChart3,
  NAVIGATION_MANAGEMENT: Route,
  SYSTEM_ADMINISTRATION: Settings,
}

const resourceColorMap: Record<string, string> = {
  USER_MANAGEMENT: "from-green-500 to-emerald-600",
  ROLE_MANAGEMENT: "from-purple-500 to-pink-600",
  ANALYTICS_REPORTS: "from-blue-500 to-indigo-600",
  NAVIGATION_MANAGEMENT: "from-brand-500 to-brand-600",
  SYSTEM_ADMINISTRATION: "from-orange-500 to-red-600",
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
  critical: boolean
  raw?: ApiPermission
  permissionId?: string
}

interface PermissionCategory {
  label: string
  icon: any
  color: string
  description: string
  permissions: Permission[]
}

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
  const [permissionCategories, setPermissionCategories] = useState<Record<string, PermissionCategory>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [levelFilter, setLevelFilter] = useState("all")
  const [showCriticalOnly, setShowCriticalOnly] = useState(false)
  const [isCompactView, setIsCompactView] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const { addPermissions } = usePermissions()

  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newPerm, setNewPerm] = useState({ resource: "", action: "", type: "READ" as "READ" | "WRITE" | "DELETE" | "ADMIN" | string })

  // Permission edit/update state
  const [editingPermission, setEditingPermission] = useState<any | null>(null)
  const [editingOpen, setEditingOpen] = useState(false)
  const [editingFields, setEditingFields] = useState({ permissionId: "", resource: "", action: "", type: "READ" })
  const [updating, setUpdating] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Fetch permissions from server
  const fetchPermissions = async () => {
    try {
      setIsLoading(true)

      // Fetch permissions
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
            color: resourceColorMap[resource] || 'from-gray-500 to-gray-600',
            description: `Manage ${resource.toLowerCase().replace(/_/g, ' ')} operations`,
            permissions: []
          }
        }

        const permissionLevel = perm.type.toLowerCase()
        categories[resource].permissions.push({
          id: `${resource.toLowerCase()}.${perm.action.toLowerCase()}`,
          label: perm.action.replace(/_/g, ' '),
          description: `${permissionLevel} access to ${perm.action.toLowerCase().replace(/_/g, ' ')}`,
          level: permissionLevel,
          critical: ['DELETE', 'ADMIN'].includes(perm.type),
          raw: perm,
          permissionId: perm.permissionId
        })
      })

      setPermissionCategories(categories)
    } catch (error) {
      console.error('Failed to load permissions:', error)
      toast({
        title: 'Failed to load data',
        description: 'Could not fetch permissions from server',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Load permissions on component mount
  useEffect(() => {
    let mounted = true
    ;(async () => {
      if (mounted) {
        await fetchPermissions()
      }
    })()
    return () => { mounted = false }
  }, [toast])


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
    return Object.values(permissionCategories).reduce((total: number, category: any) => total + (Array.isArray(category.permissions) ? category.permissions.length : 0), 0)
  }

  const handleDeletePermission = async (permissionId: string) => {
    setDeletingId(permissionId)
    try {
      await api.delete(`/api/permissions/delete?permissionId=${encodeURIComponent(permissionId)}`)

      // Remove from local state
      const updatedCategories = { ...permissionCategories }
      Object.keys(updatedCategories).forEach(key => {
        updatedCategories[key] = {
          ...updatedCategories[key],
          permissions: updatedCategories[key].permissions.filter(p => p.permissionId !== permissionId)
        }
      })
      setPermissionCategories(updatedCategories)

      toast({
        title: "Permission Deleted",
        description: "Permission has been successfully deleted.",
      })
    } catch (error: any) {
      console.error('Failed to delete permission:', error)
      toast({
        title: "Delete Failed",
        description: error?.message || "Failed to delete permission",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  const getCategoryStats = (categoryKey: string) => {
    const category = permissionCategories[categoryKey]
    const perms = category?.permissions || []
    const total = perms.length

    return { total }
  }

  if (isLoading) {
    return (
      <OptimizedDashboardLayout title="Permissions Management">
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <Loader className="w-8 h-8 animate-spin text-brand-500" />
            <p className="text-muted-foreground">Loading permissions and roles...</p>
          </div>
        </div>
      </OptimizedDashboardLayout>
    )
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
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <Badge variant="default" className="bg-brand-600">Primary</Badge>
              <p className="text-xs text-muted-foreground font-medium">Start here: Define all system permissions</p>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-foreground">Permissions Management</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Create, update, and delete permissions. Then assign them to roles for granular access control.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Link to="/dashboard/roles">
              <Button variant="outline" size="sm" className="h-8">
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                Manage Roles
              </Button>
            </Link>
            <Button variant="outline" className="h-8" onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Create Permission
            </Button>
          </div>
        </motion.div>

        <div className="grid gap-4 lg:gap-6 grid-cols-1">
          {/* Main Permissions Panel */}
          <div className="space-y-4 lg:space-y-6">
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
                                  {category.description} • {stats.total} permissions
                                </CardDescription>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className={`grid gap-3 ${isCompactView ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
                            {filteredPermissions.map((permission) => (
                              <motion.div
                                key={permission.permissionId || permission.id}
                                className="flex items-start justify-between p-3 rounded-lg border border-border/50 hover:bg-accent/50 transition-all duration-200"
                                whileHover={{ scale: 1.01 }}
                              >
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <p className="text-sm font-medium">
                                      {permission.label}
                                    </p>
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
                                  <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                                    {permission.description}
                                  </p>
                                  <div className="flex items-center space-x-1 mt-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 text-xs"
                                      onClick={() => {
                                        const res = permission?.raw?.resource || ''
                                        const act = permission?.raw?.action || ''
                                        const typ = permission?.raw?.type || 'READ'
                                        setEditingFields({ permissionId: permission.permissionId || permission.id, resource: res, action: act, type: typ })
                                        setEditingOpen(true)
                                      }}
                                      title="Edit permission metadata"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                      disabled={deletingId === permission.permissionId}
                                      onClick={() => handleDeletePermission(permission.permissionId || permission.id)}
                                      title="Delete permission"
                                    >
                                      {deletingId === permission.permissionId ? (
                                        <Loader className="w-3.5 h-3.5 animate-spin" />
                                      ) : (
                                        <X className="w-3.5 h-3.5" />
                                      )}
                                    </Button>
                                  </div>
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

          </div>
        </div>
      </div>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Permission</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="perm-resource">Resource</Label>
              <Input id="perm-resource" placeholder="e.g., BLOG_POST_MANAGEMENT" value={newPerm.resource} onChange={(e) => setNewPerm((s) => ({ ...s, resource: e.target.value.toUpperCase() }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="perm-action">Action</Label>
              <Input id="perm-action" placeholder="e.g., SHARE_BLOGS" value={newPerm.action} onChange={(e) => setNewPerm((s) => ({ ...s, action: e.target.value.toUpperCase() }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="perm-type">Type</Label>
              <Select value={newPerm.type} onValueChange={(v) => setNewPerm((s) => ({ ...s, type: v }))}>
                <SelectTrigger id="perm-type"><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="READ">READ</SelectItem>
                  <SelectItem value="WRITE">WRITE</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                  <SelectItem value="EDIT">EDIT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
            <Button disabled={creating || !newPerm.resource || !newPerm.action || !newPerm.type} onClick={async () => {
              setCreating(true)
              try {
                const body = { resource: newPerm.resource, action: newPerm.action, type: newPerm.type }
                await api.post("/api/permissions/create", { body })
                addPermissions(body)
                toast({ title: "Permission created", description: `${newPerm.resource}:${newPerm.action}:${newPerm.type}` })
                setShowCreateDialog(false)
                setNewPerm({ resource: "", action: "", type: "READ" })

                // Refetch permissions after successful creation
                await fetchPermissions()
              } catch (e: any) {
                toast({ title: "Create failed", description: e?.message || "Unable to create permission", variant: "destructive" })
              } finally {
                setCreating(false)
              }
            }}>Create</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Permission Dialog */}
      <Dialog open={editingOpen} onOpenChange={setEditingOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Permission</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-permission-id">Permission ID</Label>
              <Input id="edit-permission-id" value={editingFields.permissionId} onChange={(e) => setEditingFields((s) => ({ ...s, permissionId: e.target.value }))} placeholder="UUID permission id" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-perm-resource">Resource</Label>
              <Input id="edit-perm-resource" placeholder="e.g., ADMIN_MANAGEMENT" value={editingFields.resource} onChange={(e) => setEditingFields((s) => ({ ...s, resource: e.target.value.toUpperCase() }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-perm-action">Action</Label>
              <Input id="edit-perm-action" placeholder="e.g., EDIT_ADMINS" value={editingFields.action} onChange={(e) => setEditingFields((s) => ({ ...s, action: e.target.value.toUpperCase() }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-perm-type">Type</Label>
              <Select value={editingFields.type} onValueChange={(v) => setEditingFields((s) => ({ ...s, type: v }))}>
                <SelectTrigger id="edit-perm-type"><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="READ">READ</SelectItem>
                  <SelectItem value="WRITE">WRITE</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setEditingOpen(false)}>Cancel</Button>
            <Button disabled={updating || !editingFields.permissionId || !editingFields.resource || !editingFields.action || !editingFields.type} onClick={async () => {
              setUpdating(true)
              try {
                const body = { resource: editingFields.resource, action: editingFields.action, type: editingFields.type }
                await api.put(`/api/permissions/update?permissionId=${encodeURIComponent(editingFields.permissionId)}`, { body })

                addPermissions({ resource: editingFields.resource, action: editingFields.action, type: editingFields.type })

                toast({ title: 'Permission updated', description: `${editingFields.resource}:${editingFields.action}` })
                setEditingOpen(false)

                // Refetch permissions after successful update
                await fetchPermissions()
              } catch (e: any) {
                toast({ title: 'Update failed', description: e?.message || 'Failed to update permission', variant: 'destructive' })
              } finally {
                setUpdating(false)
              }
            }}>Update</Button>
          </div>
        </DialogContent>
      </Dialog>
    </OptimizedDashboardLayout>
  )
}
