import { motion, AnimatePresence } from "framer-motion"
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Shield, 
  Mail, 
  Phone, 
  User,
  Upload,
  X,
  Save,
  Eye,
  EyeOff
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { OptimizedDashboardLayout } from "@/components/optimized-dashboard-layout"
import { useToast } from "@/hooks/use-toast"
import { Link } from "react-router-dom"
import api from "@/lib/http"
import { PaginatedResponse, BackendUser } from "@shared/api"
import { useEffect, useRef, useState } from "react"

interface RoleItem { roleId: string; roleName: string; description?: string }

const mockRoles = [
  { id: "admin", name: "Admin", permissions: ["read", "write", "delete", "manage_users"] },
  { id: "manager", name: "Manager", permissions: ["read", "write", "manage_team"] },
  { id: "user", name: "User", permissions: ["read"] },
]

interface Admin {
  id?: string
  name: string
  email: string
  phone: string
  role: string
  avatar?: string
  status?: string
  lastLogin?: string
  employeeId?: string
}

export default function AdminManagement() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [newAdmin, setNewAdmin] = useState<Admin>({
    name: "",
    email: "",
    phone: "",
    role: "",
    avatar: "",
    employeeId: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [tempPassword, setTempPassword] = useState<string>("")
  const [avatarPreview, setAvatarPreview] = useState<string>("")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [editAvatarFile, setEditAvatarFile] = useState<File | null>(null)
  const { toast } = useToast()

  const [pageNumber, setPageNumber] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [roles, setRoles] = useState<RoleItem[]>([])
  const [rolesLoading, setRolesLoading] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchAdmins = async () => {
    try {
      setLoading(true)
      const data = await api.get<PaginatedResponse<BackendUser>>("/api/admins/get-all", {
        query: { pageSize, pageNumber },
      })
      const items = (data as any)?.content || (data as any)?.data || []
      const mapped = (items || []).map((u: any) => ({
        id: u.id,
        name: u.fullName || u.full_name || `${u.firstName || ''} ${u.lastName || ''}`.trim(),
        email: u.email,
        phone: u.mobileNumber || u.mobile_number || u.phone,
        role: u.roleName || u.role_name || u.role || (Array.isArray(u.roles) && (u.roles[0]?.roleName || u.roles[0]?.name)) || '—',
        avatar: u.avatar || undefined,
        status: u.status || 'active',
        lastLogin: u.lastLogin || u.last_login || '—',
      })) as Admin[]
      setAdmins(mapped)
      setTotalElements((data as any)?.totalElements ?? (data as any)?.totalElements ?? mapped.length)
      setTotalPages((data as any)?.totalPages ?? 1)
    } catch (e: any) {
      toast({
        title: "Failed to load admins",
        description: e?.message || "Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchRoles = async () => {
    try {
      setRolesLoading(true)
      const res: any = await api.get<any>("/api/roles/get-all")
      const list = Array.isArray(res) ? res : (res?.data || res?.content || [])
      const cleaned = (list || []).filter((r: any) => r && (r.roleId || r.id) && (r.roleName || r.name)).map((r: any) => ({
        roleId: r.roleId || r.id,
        roleName: r.roleName || r.name,
        description: r.description,
      })) as RoleItem[]
      setRoles(cleaned)
    } catch (e: any) {
      // Silent fail; role select will be empty
    } finally {
      setRolesLoading(false)
    }
  }

  useEffect(() => {
    fetchAdmins()
  }, [pageNumber, pageSize])

  useEffect(() => {
    fetchRoles()
  }, [])

  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         admin.email.toLowerCase().includes(searchQuery.toLowerCase())
    const selectedRoleName = roles.find(r => r.roleId === roleFilter)?.roleName || roleFilter
    const matchesRole = roleFilter === "all" || (admin.role || "").toLowerCase() === (selectedRoleName || "").toLowerCase()
    return matchesSearch && matchesRole
  })

  const generatePassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
    let password = ""
    for (let i = 0; i < 10; i++) password += charset.charAt(Math.floor(Math.random() * charset.length))
    return password
  }

  const handleCreateAdmin = async () => {
    if (!newAdmin.name || !newAdmin.email || !newAdmin.phone || !newAdmin.role) {
      toast({ title: "Validation Error", description: "Please fill in all required fields.", variant: "destructive" })
      return
    }

    setLoading(true)

    // Split name into first and last
    const parts = newAdmin.name.trim().split(/\s+/)
    const firstName = parts.shift() || ''
    const lastName = parts.join(' ') || ''

    // Resolve roleId if possible
    let roleId = newAdmin.role
    const uuidLike = typeof roleId === 'string' && roleId.includes('-')
    if (!uuidLike) {
      const found = mockRoles.find(r => r.name.toLowerCase() === (newAdmin.role || '').toLowerCase())
      if (found) roleId = found.id
    }

    // Ensure password - backend requires password field
    const password = tempPassword || generatePassword()

    try {
      // Build multipart form data
      const form = new FormData()
      form.append('email', newAdmin.email)
      form.append('password', password)
      form.append('firstName', firstName)
      form.append('lastName', lastName)
      form.append('mobileNumber', newAdmin.phone)
      if (roleId) form.append('roleId', typeof roleId === 'string' ? roleId : String(roleId))
      if (avatarFile) form.append('profilePicture', avatarFile)
      form.append('employeeId', (newAdmin as any).employeeId || '')

      const res: any = await api.post('/api/admins/create', { body: form })
      const data = res?.data ?? res
      const created = data?.data || data || null

      const createdAdmin: Admin = {
        id: created?.id || created?.userId || (admins.length + 1).toString(),
        name: created?.fullName || `${firstName} ${lastName}`.trim(),
        email: created?.email || newAdmin.email,
        phone: created?.mobileNumber || newAdmin.phone,
        role: (roles.find(r => r.roleId === roleId)?.roleName) || created?.roleName || newAdmin.role,
        avatar: created?.profilePicture || created?.avatar || avatarPreview || undefined,
        status: created?.status || 'active',
        lastLogin: created?.lastLogin || 'Never'
      }

      setAdmins(prev => [...prev, createdAdmin])
      setNewAdmin({ name: '', email: '', phone: '', role: '', avatar: '', employeeId: '' })
      setAvatarPreview('')
      setAvatarFile(null)
      setTempPassword('')
      setShowCreateDialog(false)

      toast({ title: 'Admin Created', description: `${createdAdmin.name} has been successfully created.` })
    } catch (e: any) {
      console.error('Create admin failed', e)
      toast({ title: 'Create Failed', description: e?.message || 'Failed to create admin. Please try again.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleEditAdmin = (admin: Admin) => {
    setEditingAdmin(admin)
    setAvatarPreview(admin.avatar || "")
    setShowEditDialog(true)
  }

  const handleUpdateAdmin = async () => {
    if (!editingAdmin) return
    setLoading(true)
    try {
      // Backend expects multipart form with id, firstName, lastName, mobileNumber, email, profilePicture
      const parts = (editingAdmin.name || '').trim().split(/\s+/)
      const firstName = parts.shift() || ''
      const lastName = parts.join(' ') || ''

      const form = new FormData()
      form.append('id', editingAdmin.id || '')
      form.append('firstName', firstName)
      form.append('lastName', lastName)
      form.append('mobileNumber', editingAdmin.phone)
      form.append('email', editingAdmin.email)
      if (editAvatarFile) form.append('profilePicture', editAvatarFile)

      const res: any = await api.put(`/api/admins/update`, { body: form })
      const data = res?.data ?? res

      // Map response to local admin
      const updated = data?.data || data || {}

      const updatedAdmin: Admin = {
        id: editingAdmin.id,
        name: updated.fullName || `${firstName} ${lastName}`.trim(),
        email: updated.email || editingAdmin.email,
        phone: updated.mobileNumber || editingAdmin.phone,
        role: editingAdmin.role,
        avatar: updated.profilePicture || updated.avatar || avatarPreview || editingAdmin.avatar,
        status: updated.status || editingAdmin.status || 'active',
        lastLogin: updated.lastLogin || editingAdmin.lastLogin || '—'
      }

      setAdmins(admins.map(admin => admin.id === editingAdmin.id ? updatedAdmin : admin))

      toast({ title: "Admin Updated", description: `${updatedAdmin.name} has been successfully updated.` })
      setShowEditDialog(false)
      setEditingAdmin(null)
      setAvatarPreview("")
      setEditAvatarFile(null)
    } catch (e: any) {
      console.error('Update admin failed', e)
      toast({ title: "Update Failed", description: e?.message || "Please try again.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAdmin = async (adminId: string) => {
    const target = admins.find(u => u.id === adminId)
    const prev = admins.slice()
    // optimistic removal
    setAdmins(admins.filter(u => u.id !== adminId))
    try {
      await api.delete(`/api/admins/delete`, { query: { id: adminId } })
      toast({ title: "Admin Deleted", description: `${target?.name || 'Admin'} has been successfully deleted.` })
    } catch (e: any) {
      // rollback on failure
      setAdmins(prev)
      toast({ title: "Delete Failed", description: e?.message || "Unable to delete admin.", variant: "destructive" })
    }
  }

  const handleToggleActive = async (adminId: string, makeActive: boolean) => {
    const prev = admins.find(a => a.id === adminId)
    if (!prev) return
    // optimistic update
    setAdmins(admins.map(a => a.id === adminId ? { ...a, status: makeActive ? 'active' : 'inactive' } : a))
    try {
      // backend expects PATCH /api/admins/update-isActive-status/{id}?isActive=true
      const url = `/api/admins/update-isActive-status?id=${adminId}&isActive=${makeActive}`
      await api.patch(url)
      toast({ title: 'Status Updated', description: `${prev.name} is now ${makeActive ? 'active' : 'inactive'}.` })
    } catch (e: any) {
      // revert
      setAdmins(admins.map(a => a.id === adminId ? prev : a))
      toast({ title: 'Update Failed', description: e?.message || 'Failed to update admin status.', variant: 'destructive' })
    }
  }

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setAvatarPreview(result)
        if (isEdit && editingAdmin) {
          setEditingAdmin({ ...editingAdmin, avatar: result })
          setEditAvatarFile(file)
        } else {
          setNewAdmin({ ...newAdmin, avatar: result })
          setAvatarFile(file)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const AdminFormInline = ({ admin, setAdmin, isEdit = false }: {
    admin: Admin;
    setAdmin: (admin: Admin) => void;
    isEdit?: boolean
  }) => {
    const nameRef = useRef<HTMLInputElement | null>(null)
    const emailRef = useRef<HTMLInputElement | null>(null)
    const phoneRef = useRef<HTMLInputElement | null>(null)
    const firstNameRef = useRef<HTMLInputElement | null>(null)
    const lastNameRef = useRef<HTMLInputElement | null>(null)

    const selectionRef = useRef<Record<string, { start: number | null; end: number | null }>>({
      name: { start: null, end: null },
      email: { start: null, end: null },
      phone: { start: null, end: null },
      firstName: { start: null, end: null },
      lastName: { start: null, end: null },
    })

    const restoreCaret = (ref: React.RefObject<HTMLInputElement> | null, field: string) => {
      const el = ref && (ref as React.RefObject<HTMLInputElement>).current
      const sel = selectionRef.current[field]
      if (el && sel && typeof el.setSelectionRange === "function" && sel.start !== null) {
        try { el.focus(); el.setSelectionRange(sel.start, sel.end ?? sel.start) } catch {}
      }
    }

    const handleChange = (field: string, ref: React.RefObject<HTMLInputElement> | null) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const target = e.target as HTMLInputElement
      selectionRef.current[field] = { start: target.selectionStart, end: target.selectionEnd }
      setAdmin({ ...admin, [field]: target.value } as unknown as Admin)
      requestAnimationFrame(() => restoreCaret(ref, field))
    }

    const [firstNameLocal, setFirstNameLocal] = useState<string>("")
    const [lastNameLocal, setLastNameLocal] = useState<string>("")

    useEffect(() => {
      const parts = (admin.name || "").trim().split(/\s+/)
      setFirstNameLocal(parts.shift() || "")
      setLastNameLocal(parts.join(" ") || "")
    }, [admin.name])

    const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const target = e.target as HTMLInputElement
      selectionRef.current['firstName'] = { start: target.selectionStart, end: target.selectionEnd }
      const val = target.value
      setFirstNameLocal(val)
      setAdmin({ ...admin, name: `${val} ${lastNameLocal}`.trim() })
      requestAnimationFrame(() => restoreCaret(firstNameRef, 'firstName'))
    }

    const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const target = e.target as HTMLInputElement
      selectionRef.current['lastName'] = { start: target.selectionStart, end: target.selectionEnd }
      const val = target.value
      setLastNameLocal(val)
      setAdmin({ ...admin, name: `${firstNameLocal} ${val}`.trim() })
      requestAnimationFrame(() => restoreCaret(lastNameRef, 'lastName'))
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={avatarPreview || admin.avatar} />
            <AvatarFallback className="bg-brand-100 text-brand-700 text-lg">
              {admin.name ? admin.name.split(' ').map(n => n[0]).join('') : 'A'}
            </AvatarFallback>
          </Avatar>
          <div>
            <Label htmlFor={`avatar-${isEdit ? 'edit' : 'create'}`} className="cursor-pointer">
              <Button variant="outline" size="sm" asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photo
                </span>
              </Button>
            </Label>
            <Input id={`avatar-${isEdit ? 'edit' : 'create'}`} type="file" accept="image/*" className="hidden" onChange={(e) => handleAvatarUpload(e, isEdit)} />
          </div>
        </div>

        {isEdit ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input id="firstName" placeholder="First name" value={firstNameLocal} ref={firstNameRef} onChange={handleFirstNameChange} className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <div className="relative">
                <Input id="lastName" placeholder="Last name" value={lastNameLocal} ref={lastNameRef} onChange={handleLastNameChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input id="email" type="email" placeholder="Enter email address" value={admin.email} ref={emailRef} onChange={handleChange('email', emailRef)} className="pl-10" />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input id="firstName" placeholder="First name" value={firstNameLocal} ref={firstNameRef} onChange={handleFirstNameChange} className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <div className="relative">
                <Input id="lastName" placeholder="Last name" value={lastNameLocal} ref={lastNameRef} onChange={handleLastNameChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input id="email" type="email" placeholder="Enter email address" value={admin.email} ref={emailRef} onChange={handleChange('email', emailRef)} className="pl-10" />
              </div>
            </div>
          </div>
        )}

        {isEdit ? (
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input id="phone" placeholder="Enter phone number" value={admin.phone} ref={phoneRef} onChange={handleChange('phone', phoneRef)} className="pl-10" />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input id="phone" placeholder="Enter phone number" value={admin.phone} ref={phoneRef} onChange={handleChange('phone', phoneRef)} className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select value={admin.role} onValueChange={(value) => setAdmin({ ...admin, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder={rolesLoading ? "Loading roles..." : "Select a role"} />
                </SelectTrigger>
                <SelectContent>
                  {roles.length > 0 ? (
                    roles.map((r) => (
                      <SelectItem key={r.roleId} value={r.roleId}>
                        <div className="flex items-center space-x-2">
                          <Shield className="w-4 h-4" />
                          <span>{r.roleName}</span>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-roles" disabled>No roles found</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input id="employeeId" placeholder="Enter employee id" value={(admin as any).employeeId || ''} onChange={(e) => setAdmin({ ...admin, employeeId: e.target.value })} />
            </div>
          </div>
        )}

        {!isEdit && (
          <div className="space-y-2">
            <Label htmlFor="password">Temporary Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="System will generate a secure password"
                value={tempPassword || "auto-generated"}
                readOnly
                className="pr-24"
              />

              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                <Button type="button" size="sm" variant="outline" onClick={() => {
                  const p = generatePassword()
                  setTempPassword(p)
                  setShowPassword(true)
                }}>
                  Generate
                </Button>
                <Button type="button" variant="ghost" size="icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">A secure password will be generated and sent to the admin's email unless you generate a custom one here.</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <OptimizedDashboardLayout title="Admin Management">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-foreground">Admins</h2>
            <p className="text-sm text-muted-foreground">Manage admin accounts and permissions</p>
          </div>
          <Button size="sm" className="h-8 bg-brand-600 hover:bg-brand-700" onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Add Admin
            </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input placeholder="Search admins..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {roles.length > 0 ? (
                    roles.map((r) => (
                      <SelectItem key={r.roleId} value={r.roleId}>{r.roleName}</SelectItem>
                    ))
                  ) : (
                    mockRoles.map((role) => (
                      <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Admins ({totalElements || filteredAdmins.length})</CardTitle>
            <CardDescription>A list of all admins including their details and roles.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Admin</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">Loading admins...</TableCell>
                  </TableRow>
                ) : filteredAdmins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">No admins found</TableCell>
                  </TableRow>
                ) : (
                  <AnimatePresence>
                    {filteredAdmins.map((admin) => (
                      <motion.tr key={admin.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }} className="group">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={admin.avatar} />
                              <AvatarFallback className="bg-brand-100 text-brand-700">{admin.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-foreground">{admin.name}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm text-foreground">{admin.email}</p>
                            <p className="text-sm text-muted-foreground">{admin.phone}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={admin.role === 'Admin' ? 'default' : 'secondary'} className={admin.role === 'Admin' ? 'bg-brand-100 text-brand-700' : ''}>{admin.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={admin.status === 'active' ? 'default' : 'secondary'}>{admin.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditAdmin(admin)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Admin
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleActive(admin.id!, admin.status !== 'active')}>
                                {admin.status === 'active' ? (
                                  <EyeOff className="w-4 h-4 mr-2" />
                                ) : (
                                  <Eye className="w-4 h-4 mr-2" />
                                )}
                                {admin.status === 'active' ? 'Deactivate' : 'Activate'}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { setDeleteTargetId(admin.id!); setConfirmOpen(true); }} className="text-red-600 focus:text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Admin
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between py-3">
              <div className="text-sm text-muted-foreground">Page {pageNumber + 1} of {Math.max(totalPages, 1)} • {totalElements} total</div>
              <div className="flex items-center gap-2">
                <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPageNumber(0); }}>
                  <SelectTrigger className="w-[110px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[5, 10, 20, 50].map((n) => (
                      <SelectItem key={n} value={String(n)}>{n} / page</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setPageNumber((p) => Math.max(p - 1, 0))} disabled={loading || pageNumber <= 0}>Previous</Button>
                  <Button variant="outline" size="sm" onClick={() => setPageNumber((p) => (totalPages ? Math.min(p + 1, totalPages - 1) : p + 1))} disabled={loading || (totalPages ? pageNumber >= totalPages - 1 : false)}>Next</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Admin</DialogTitle>
              <DialogDescription>Add a new admin. They will receive an email with login instructions.</DialogDescription>
            </DialogHeader>
            <AdminForm
              admin={newAdmin}
              setAdmin={setNewAdmin}
              avatarPreview={avatarPreview}
              onAvatarUpload={(e) => handleAvatarUpload(e, false)}
              roles={roles}
              rolesLoading={rolesLoading}
              tempPassword={tempPassword}
              setTempPassword={setTempPassword}
              generatePassword={generatePassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
              <Button onClick={handleCreateAdmin} className="bg-brand-600 hover:bg-brand-700"><Save className="w-4 h-4 mr-2" />Create Admin</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Admin</DialogTitle>
              <DialogDescription>Update admin information and role assignments.</DialogDescription>
            </DialogHeader>
            {editingAdmin && (
              <AdminForm
                admin={editingAdmin}
                setAdmin={setEditingAdmin}
                isEdit
                avatarPreview={avatarPreview}
                onAvatarUpload={(e) => handleAvatarUpload(e, true)}
                roles={roles}
                rolesLoading={rolesLoading}
                tempPassword={tempPassword}
                setTempPassword={setTempPassword}
                generatePassword={generatePassword}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />
            )}
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
              <Button onClick={handleUpdateAdmin} className="bg-brand-600 hover:bg-brand-700"><Save className="w-4 h-4 mr-2" />Update Admin</Button>
            </div>
          </DialogContent>
        </Dialog>

        <AlertDialog open={confirmOpen} onOpenChange={(v) => { if (!deleting) setConfirmOpen(v); }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Admin?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the selected admin.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={deleting}
                onClick={async () => {
                  if (!deleteTargetId) return
                  try {
                    setDeleting(true)
                    await handleDeleteAdmin(deleteTargetId)
                    setConfirmOpen(false)
                    setDeleteTargetId(null)
                  } finally {
                    setDeleting(false)
                  }
                }}
              >{deleting ? 'Deleting...' : 'Delete'}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </OptimizedDashboardLayout>
  )
}

type AdminFormProps = {
  admin: Admin;
  setAdmin: (admin: Admin) => void;
  isEdit?: boolean;
  avatarPreview?: string;
  onAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  roles: RoleItem[];
  rolesLoading: boolean;
  tempPassword: string;
  setTempPassword: (val: string) => void;
  generatePassword: () => string;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
}

function AdminForm({
  admin,
  setAdmin,
  isEdit = false,
  avatarPreview,
  onAvatarUpload,
  roles,
  rolesLoading,
  tempPassword,
  setTempPassword,
  generatePassword,
  showPassword,
  setShowPassword,
}: AdminFormProps) {
  const emailRef = useRef<HTMLInputElement | null>(null)
  const phoneRef = useRef<HTMLInputElement | null>(null)
  const firstNameRef = useRef<HTMLInputElement | null>(null)
  const lastNameRef = useRef<HTMLInputElement | null>(null)

  const selectionRef = useRef<Record<string, { start: number | null; end: number | null }>>({
    email: { start: null, end: null },
    phone: { start: null, end: null },
    firstName: { start: null, end: null },
    lastName: { start: null, end: null },
  })

  const restoreCaret = (ref: React.RefObject<HTMLInputElement> | null, field: string) => {
    const el = ref && (ref as React.RefObject<HTMLInputElement>).current
    const sel = selectionRef.current[field]
    if (el && sel && typeof el.setSelectionRange === "function" && sel.start !== null) {
      try { el.focus(); el.setSelectionRange(sel.start, sel.end ?? sel.start) } catch {}
    }
  }

  const handleChange = (field: string, ref: React.RefObject<HTMLInputElement> | null) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    selectionRef.current[field] = { start: target.selectionStart, end: target.selectionEnd }
    setAdmin({ ...admin, [field]: target.value } as unknown as Admin)
    requestAnimationFrame(() => restoreCaret(ref, field))
  }

  const [firstNameLocal, setFirstNameLocal] = useState<string>("")
  const [lastNameLocal, setLastNameLocal] = useState<string>("")

  useEffect(() => {
    const parts = (admin.name || "").trim().split(/\s+/)
    setFirstNameLocal(parts.shift() || "")
    setLastNameLocal(parts.join(" ") || "")
  }, [admin.name])

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    selectionRef.current['firstName'] = { start: target.selectionStart, end: target.selectionEnd }
    const val = target.value
    setFirstNameLocal(val)
    setAdmin({ ...admin, name: `${val} ${lastNameLocal}`.trim() })
    requestAnimationFrame(() => restoreCaret(firstNameRef, 'firstName'))
  }

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    selectionRef.current['lastName'] = { start: target.selectionStart, end: target.selectionEnd }
    const val = target.value
    setLastNameLocal(val)
    setAdmin({ ...admin, name: `${firstNameLocal} ${val}`.trim() })
    requestAnimationFrame(() => restoreCaret(lastNameRef, 'lastName'))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="w-24 h-24">
          <AvatarImage src={avatarPreview || admin.avatar} />
          <AvatarFallback className="bg-brand-100 text-brand-700 text-lg">
            {admin.name ? admin.name.split(' ').map(n => n[0]).join('') : 'A'}
          </AvatarFallback>
        </Avatar>
        <div>
          <Label htmlFor={`avatar-${isEdit ? 'edit' : 'create'}`} className="cursor-pointer">
            <Button variant="outline" size="sm" asChild>
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Upload Photo
              </span>
            </Button>
          </Label>
          <Input id={`avatar-${isEdit ? 'edit' : 'create'}`} type="file" accept="image/*" className="hidden" onChange={onAvatarUpload} />
        </div>
      </div>

      {isEdit ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input id="firstName" placeholder="First name" value={firstNameLocal} ref={firstNameRef} onChange={handleFirstNameChange} className="pl-10" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <div className="relative">
              <Input id="lastName" placeholder="Last name" value={lastNameLocal} ref={lastNameRef} onChange={handleLastNameChange} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input id="email" type="email" placeholder="Enter email address" value={admin.email} ref={emailRef} onChange={handleChange('email', emailRef)} className="pl-10" />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input id="firstName" placeholder="First name" value={firstNameLocal} ref={firstNameRef} onChange={handleFirstNameChange} className="pl-10" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <div className="relative">
              <Input id="lastName" placeholder="Last name" value={lastNameLocal} ref={lastNameRef} onChange={handleLastNameChange} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input id="email" type="email" placeholder="Enter email address" value={admin.email} ref={emailRef} onChange={handleChange('email', emailRef)} className="pl-10" />
            </div>
          </div>
        </div>
      )}

      {isEdit ? (
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input id="phone" placeholder="Enter phone number" value={admin.phone} ref={phoneRef} onChange={handleChange('phone', phoneRef)} className="pl-10" />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input id="phone" placeholder="Enter phone number" value={admin.phone} ref={phoneRef} onChange={handleChange('phone', phoneRef)} className="pl-10" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select value={admin.role} onValueChange={(value) => setAdmin({ ...admin, role: value })}>
              <SelectTrigger>
                <SelectValue placeholder={rolesLoading ? "Loading roles..." : "Select a role"} />
              </SelectTrigger>
              <SelectContent>
                {roles.length > 0 ? (
                  roles.map((r) => (
                    <SelectItem key={r.roleId} value={r.roleId}>
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4" />
                        <span>{r.roleName}</span>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-roles" disabled>No roles found</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="employeeId">Employee ID</Label>
            <Input id="employeeId" placeholder="Enter employee id" value={(admin as any).employeeId || ''} onChange={(e) => setAdmin({ ...admin, employeeId: e.target.value })} />
          </div>
        </div>
      )}

      {!isEdit && (
        <div className="space-y-2">
          <Label htmlFor="password">Temporary Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="System will generate a secure password"
              value={tempPassword || "auto-generated"}
              readOnly
              className="pr-24"
            />

            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              <Button type="button" size="sm" variant="outline" onClick={() => {
                const p = generatePassword()
                setTempPassword(p)
                setShowPassword(true)
              }}>
                Generate
              </Button>
              <Button type="button" variant="ghost" size="icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">A secure password will be generated and sent to the admin's email unless you generate a custom one here.</p>
        </div>
      )}
    </div>
  )
}
