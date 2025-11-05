import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Plus, 
  Search, 

  MoreHorizontal,
  Edit,
  Trash2,
  Check,
  Slash,

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { OptimizedDashboardLayout } from "@/components/optimized-dashboard-layout"
import { useToast } from "@/hooks/use-toast"
import { Link } from "react-router-dom"
import api from "@/lib/http"
import { PaginatedResponse, BackendUser } from "@shared/api"

// Mock data - replace with actual API calls
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    role: "Admin",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    status: "Active",
    isActive: true,
    lastLogin: "2024-01-15 14:30"
  },
  {
    id: "2",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    phone: "+1 (555) 987-6543",
    role: "Manager",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c87b?w=150&h=150&fit=crop&crop=face",
    status: "Active",
    isActive: true,
    lastLogin: "2024-01-15 09:15"
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    phone: "+1 (555) 456-7890",
    role: "User",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    status: "Inactive",
    isActive: false,
    lastLogin: "2024-01-10 16:45"
  },
]


interface User {
  id?: string
  name: string
  email: string
  phone: string
  role: string
  avatar?: string
  status?: string
  isActive?: boolean
  lastLogin?: string
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [newUser, setNewUser] = useState<User>({
    name: "",
    email: "",
    phone: "",
    role: "",
    avatar: "",
    isActive: true,
    status: "Active"
  })
  const [showPassword, setShowPassword] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string>("")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const { toast } = useToast()

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  const [pageNumber, setPageNumber] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await api.get<PaginatedResponse<BackendUser>>("/api/users/get-all", {
        query: { pageSize, pageNumber },
      })
      const mapped = (data?.content || []).map((u) => {
        const name =
          u.fullName ||
          (u as any)?.full_name ||
          `${(u as any)?.firstName || ''} ${(u as any)?.lastName || ''}`.trim() ||
          (u as any)?.name ||
          '—'

        const avatar =
          u.profilePicture ||
          (u as any)?.profile_picture ||
          (u as any)?.avatar ||
          undefined

        const isActive =
          typeof u.isActive === "boolean"
            ? u.isActive
            : typeof (u as any)?.is_active === "boolean"
              ? (u as any)?.is_active
              : String((u as any)?.status ?? "").toLowerCase() === "active"

        const statusLabel = isActive ? "Active" : "Inactive"

        return {
          id: u.id,
          name,
          email: u.email,
          phone: u.mobileNumber || (u as any)?.mobile_number || (u as any)?.phone,
          role: "User",
          avatar,
          status: statusLabel,
          isActive,
          lastLogin: "—",
        }
      }) as User[]
      setUsers(mapped)
      setTotalElements(data?.totalElements || mapped.length)
      setTotalPages(data?.totalPages || 1)
    } catch (e: any) {
      toast({
        title: "Failed to load users",
        description: e?.message || "Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }



  useEffect(() => {
    fetchUsers()
  }, [pageNumber, pageSize])

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email || !newUser.phone) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const user: User = {
      ...newUser,
      id: (users.length + 1).toString(),
      status: "Active",
      isActive: true,
      lastLogin: "Never",
      avatar: avatarPreview || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=150&h=150&fit=crop&crop=face`
    }

    setUsers([...users, user])
    setNewUser({ name: "", email: "", phone: "", role: "", avatar: "", isActive: true, status: "Active" })
    setAvatarPreview("")
    setShowCreateDialog(false)
    
    toast({
      title: "User Created",
      description: `${user.name} has been successfully created.`,
    })
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setAvatarPreview(user.avatar || "")
    setShowEditDialog(true)
  }

  const handleUpdateUser = async () => {
    if (!editingUser) return
    setLoading(true)
    try {
      // Prepare payload fields: include id and split name into first/last
      const nameParts = (editingUser.name || "").trim().split(/\s+/)
      const firstName = nameParts.shift() || ""
      const lastName = nameParts.join(" ") || ""

      // Always send multipart/form-data
      const form = new FormData()
      form.append("id", editingUser.id || "")
      form.append("firstName", firstName)
      form.append("lastName", lastName)
      form.append("email", editingUser.email || "")
      form.append("mobileNumber", editingUser.phone || "")
      const isActiveValue = editingUser.isActive ?? ((editingUser.status || "").toLowerCase() === "active")
      form.append("status", isActiveValue ? "active" : "inactive")
      form.append("isActive", String(isActiveValue))

      // Attach file only if provided
      if (avatarFile) {
        form.append("profilePicture", avatarFile)
      }

      await api.put(`/api/users/update`, { body: form })

      const updatedUser: User = {
        ...editingUser,
        isActive: isActiveValue,
        status: isActiveValue ? "Active" : "Inactive",
        avatar: avatarPreview || editingUser.avatar,
      }

      setUsers(users.map(user =>
        user.id === updatedUser.id
          ? updatedUser
          : user
      ))

      toast({
        title: "User Updated",
        description: `${updatedUser.name} has been successfully updated.`,
      })

      setShowEditDialog(false)
      setEditingUser(null)
      setAvatarPreview("")
      setAvatarFile(null)
    } catch (e: any) {
      toast({
        title: "Update Failed",
        description: e?.message || "Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    const user = users.find(u => u.id === userId)
    if (!userId) return

    // Optimistic UI: remove locally first
    setUsers((prev) => prev.filter(u => u.id !== userId))

    try {
      await api.delete(`/api/users/delete?id=${userId}`)

      toast({
        title: "User Deleted",
        description: `${user?.name} has been successfully deleted.`,
      })
    } catch (e: any) {
      // Rollback on failure
      setUsers((prev) => (user ? [user, ...prev] : prev))
      toast({
        title: "Delete Failed",
        description: e?.message || "Unable to delete user. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleToggleActive = async (userId: string, makeActive: boolean) => {
    const prev = users.find(u => u.id === userId)
    if (!prev) return
    // optimistic update
    setUsers(users.map(u =>
      u.id === userId
        ? { ...u, isActive: makeActive, status: makeActive ? "Active" : "Inactive" }
        : u
    ))
    try {
      const url = `/api/users/update-status?id=${userId}&isActive=${makeActive}`
      await api.patch(url)
      toast({ title: "Status Updated", description: `${prev.name} is now ${makeActive ? "Active" : "Inactive"}.` })
    } catch (e: any) {
      // revert
      setUsers(users.map(u => u.id === userId ? prev : u))
      toast({ title: "Update Failed", description: e?.message || "Failed to update user status.", variant: "destructive" })
    }
  }

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = event.target.files?.[0]
    if (file) {
      // Keep file for multipart upload
      setAvatarFile(file)

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setAvatarPreview(result)
        if (isEdit && editingUser) {
          setEditingUser({ ...editingUser, avatar: result })
        } else {
          setNewUser({ ...newUser, avatar: result })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const LegacyUserForm = ({ user, setUser, isEdit = false }: {
  user: User;
  setUser: (user: User) => void;
  isEdit?: boolean
}) => {
  const nameRef = useRef<HTMLInputElement | null>(null)
  const lastNameRef = useRef<HTMLInputElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)
  const phoneRef = useRef<HTMLInputElement | null>(null)

  // Store last selection to restore caret position after re-render
  const selectionRef = useRef<Record<string, { start: number | null; end: number | null }>>({
    firstName: { start: null, end: null },
    lastName: { start: null, end: null },
    email: { start: null, end: null },
    phone: { start: null, end: null },
  })

  const restoreCaret = (ref: React.RefObject<HTMLInputElement> | null, field: string) => {
    const el = ref && (ref as React.RefObject<HTMLInputElement>).current
    const sel = selectionRef.current[field]
    if (el && sel && typeof el.setSelectionRange === "function" && sel.start !== null) {
      try {
        el.focus()
        el.setSelectionRange(sel.start, sel.end ?? sel.start)
      } catch {}
    }
  }

  const handleChange = (field: string, ref: React.RefObject<HTMLInputElement> | null) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement

    // Capture caret
    selectionRef.current[field] = { start: target.selectionStart, end: target.selectionEnd }
    // Update parent state
    setUser({ ...user, [field]: target.value } as unknown as User)
    // Restore caret on next frame
    requestAnimationFrame(() => restoreCaret(ref, field))
  }

  // Localized first/last name state to keep UI inputs separate while maintaining user.name
  const [firstNameLocal, setFirstNameLocal] = useState<string>("")
  const [lastNameLocal, setLastNameLocal] = useState<string>("")

  useEffect(() => {
    const parts = (user.name || "").trim().split(/\s+/)
    setFirstNameLocal(parts.shift() || "")
    setLastNameLocal(parts.join(" ") || "")
  }, [user.name])

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    selectionRef.current['firstName'] = { start: target.selectionStart, end: target.selectionEnd }
    const val = target.value
    setFirstNameLocal(val)
    setUser({ ...user, name: `${val} ${lastNameLocal}`.trim() })
    requestAnimationFrame(() => restoreCaret(nameRef, 'firstName'))
  }

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    selectionRef.current['lastName'] = { start: target.selectionStart, end: target.selectionEnd }
    const val = target.value
    setLastNameLocal(val)
    setUser({ ...user, name: `${firstNameLocal} ${val}`.trim() })
    requestAnimationFrame(() => restoreCaret(lastNameRef, 'lastName'))
  }

  return (
    <div className="space-y-6">
      {/* Avatar Upload */}
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="w-24 h-24">
          <AvatarImage src={avatarPreview || user.avatar || undefined} />
          <AvatarFallback className="bg-brand-100 text-brand-700 text-lg">
            {((user.name || 'User').split(/\s+/).filter(Boolean).map((n) => n[0]).join('').slice(0, 2)) || 'U'}
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
          <Input
            id={`avatar-${isEdit ? 'edit' : 'create'}`}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleAvatarUpload(e, isEdit)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>First & Last Name *</Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="firstName"
                placeholder="First name"
                value={firstNameLocal}
                ref={nameRef}
                onChange={handleFirstNameChange}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <Input
                id="lastName"
                placeholder="Last name"
                value={lastNameLocal}
                ref={lastNameRef}
                onChange={handleLastNameChange}
                className="pl-3"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              value={user.email}
              ref={emailRef}
              onChange={handleChange('email', emailRef)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="phone"
              placeholder="Enter phone number"
              value={user.phone}
              ref={phoneRef}
              onChange={handleChange('phone', phoneRef)}
              className="pl-10"
            />
          </div>
        </div>

      </div>

      {!isEdit && (
        <div className="space-y-2">
          <Label htmlFor="password">Temporary Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="System will generate a secure password"
              value="auto-generated"
              disabled
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            A secure password will be generated and sent to the user's email.
          </p>
        </div>
      )}
    </div>
  )
}

  return (
    <OptimizedDashboardLayout title="User Management">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-foreground">Users</h2>
            <p className="text-sm text-muted-foreground">
              Manage user accounts and permissions
            </p>
          </div>
          <Link to="/dashboard/users/add">
            <Button size="sm" className="h-8 bg-brand hover:bg-brand-700">
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Add User
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Users ({totalElements || filteredUsers.length})</CardTitle>
            <CardDescription>
              A list of all users in your organization including their details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">Loading users...</TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">No users found</TableCell>
                  </TableRow>
                ) : (
                  <AnimatePresence>
                    {filteredUsers.map((user) => {
                      const safeName = (user.name || '').trim() || 'User'
                      const initials =
                        safeName
                          .split(/\s+/)
                          .filter(Boolean)
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2) || 'U'
                      const isActive = user.isActive ?? ((user.status || '').toLowerCase() === 'active')

                      return (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.2 }}
                          className="group"
                        >
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarImage src={user.avatar || undefined} />
                                <AvatarFallback className="bg-brand-100 text-brand-700">
                                  {initials}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-foreground">{safeName}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm text-foreground">{user.email}</p>
                              <p className="text-sm text-muted-foreground">{user.phone}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={isActive ? "default" : "secondary"}>
                              {isActive ? "Active" : "Inactive"}
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
                                <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleToggleActive(user.id!, !isActive)}>
                                  {isActive ? (
                                    <Slash className="w-4 h-4 mr-2" />
                                  ) : (
                                    <Check className="w-4 h-4 mr-2" />
                                  )}
                                  {isActive ? "Deactivate" : "Activate"}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => { setUserToDelete(user); setShowDeleteDialog(true); }}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                      )
                    })}
                  </AnimatePresence>
                )}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between py-3">
              <div className="text-sm text-muted-foreground">
                Page {pageNumber + 1} of {Math.max(totalPages, 1)} • {totalElements} total
              </div>
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

        {/* Create User Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Add a new user to your organization. They will receive an email with login instructions.
              </DialogDescription>
            </DialogHeader>
            <UserForm user={newUser} setUser={setNewUser} avatarPreview={avatarPreview} onAvatarUpload={(e) => handleAvatarUpload(e, false)} />
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateUser} className="bg-brand-600 hover:bg-brand-700">
                <Save className="w-4 h-4 mr-2" />
                Create User
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user information.
              </DialogDescription>
            </DialogHeader>
            {editingUser && (
              <UserForm
                user={editingUser}
                setUser={setEditingUser}
                isEdit
                avatarPreview={avatarPreview}
                onAvatarUpload={(e) => handleAvatarUpload(e, true)}
              />
            )}
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancels
              </Button>
              <Button onClick={handleUpdateUser} className="bg-brand hover:bg-brand-700">
                <Save className="w-4 h-4 mr-2" />
                Update User
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete User</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {userToDelete?.name}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={async () => { if (userToDelete?.id) { await handleDeleteUser(userToDelete.id); } setShowDeleteDialog(false); setUserToDelete(null); }}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </OptimizedDashboardLayout>
  )
}

type UserFormProps = {
  user: User;
  setUser: (user: User) => void;
  isEdit?: boolean;
  avatarPreview?: string;
  onAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function UserForm({ user, setUser, isEdit = false, avatarPreview, onAvatarUpload }: UserFormProps) {
  const nameRef = useRef<HTMLInputElement | null>(null)
  const lastNameRef = useRef<HTMLInputElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)
  const phoneRef = useRef<HTMLInputElement | null>(null)

  const [showPassword, setShowPassword] = useState(false)

  const selectionRef = useRef<Record<string, { start: number | null; end: number | null }>>({
    firstName: { start: null, end: null },
    lastName: { start: null, end: null },
    email: { start: null, end: null },
    phone: { start: null, end: null },
  })

  const restoreCaret = (ref: React.RefObject<HTMLInputElement> | null, field: string) => {
    const el = ref && (ref as React.RefObject<HTMLInputElement>).current
    const sel = selectionRef.current[field]
    if (el && sel && typeof el.setSelectionRange === "function" && sel.start !== null) {
      try {
        el.focus()
        el.setSelectionRange(sel.start, sel.end ?? sel.start)
      } catch {}
    }
  }

  const handleChange = (field: string, ref: React.RefObject<HTMLInputElement> | null) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    selectionRef.current[field] = { start: target.selectionStart, end: target.selectionEnd }
    setUser({ ...user, [field]: target.value } as unknown as User)
    requestAnimationFrame(() => restoreCaret(ref, field))
  }

  const [firstNameLocal, setFirstNameLocal] = useState<string>("")
  const [lastNameLocal, setLastNameLocal] = useState<string>("")

  useEffect(() => {
    const parts = (user.name || "").trim().split(/\s+/)
    setFirstNameLocal(parts.shift() || "")
    setLastNameLocal(parts.join(" ") || "")
  }, [user.name])

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    selectionRef.current['firstName'] = { start: target.selectionStart, end: target.selectionEnd }
    const val = target.value
    setFirstNameLocal(val)
    setUser({ ...user, name: `${val} ${lastNameLocal}`.trim() })
    requestAnimationFrame(() => restoreCaret(nameRef, 'firstName'))
  }

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    selectionRef.current['lastName'] = { start: target.selectionStart, end: target.selectionEnd }
    const val = target.value
    setLastNameLocal(val)
    setUser({ ...user, name: `${firstNameLocal} ${val}`.trim() })
    requestAnimationFrame(() => restoreCaret(lastNameRef, 'lastName'))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="w-24 h-24">
          <AvatarImage src={avatarPreview || user.avatar || undefined} />
          <AvatarFallback className="bg-brand-100 text-brand-700 text-lg">
            {((user.name || 'User').split(/\s+/).filter(Boolean).map((n) => n[0]).join('').slice(0, 2)) || 'U'}
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
          <Input
            id={`avatar-${isEdit ? 'edit' : 'create'}`}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onAvatarUpload}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>First & Last Name *</Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="firstName"
                placeholder="First name"
                value={firstNameLocal}
                ref={nameRef}
                onChange={handleFirstNameChange}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <Input
                id="lastName"
                placeholder="Last name"
                value={lastNameLocal}
                ref={lastNameRef}
                onChange={handleLastNameChange}
                className="pl-3"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              value={user.email}
              ref={emailRef}
              onChange={handleChange('email', emailRef)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="phone"
              placeholder="Enter phone number"
              value={user.phone}
              ref={phoneRef}
              onChange={handleChange('phone', phoneRef)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {!isEdit && (
        <div className="space-y-2">
          <Label htmlFor="password">Temporary Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="System will generate a secure password"
              value="auto-generated"
              disabled
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            A secure password will be generated and sent to the user's email.
          </p>
        </div>
      )}
    </div>
  )
}
