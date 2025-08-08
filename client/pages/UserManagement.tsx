import { useState } from "react"
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
import { OptimizedDashboardLayout } from "@/components/optimized-dashboard-layout"
import { useToast } from "@/hooks/use-toast"
import { Link } from "react-router-dom"

// Mock data - replace with actual API calls
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    role: "Admin",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    status: "active",
    lastLogin: "2024-01-15 14:30"
  },
  {
    id: "2",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    phone: "+1 (555) 987-6543",
    role: "Manager",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c87b?w=150&h=150&fit=crop&crop=face",
    status: "active",
    lastLogin: "2024-01-15 09:15"
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    phone: "+1 (555) 456-7890",
    role: "User",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    status: "inactive",
    lastLogin: "2024-01-10 16:45"
  },
]

const mockRoles = [
  { id: "admin", name: "Admin", permissions: ["read", "write", "delete", "manage_users"] },
  { id: "manager", name: "Manager", permissions: ["read", "write", "manage_team"] },
  { id: "user", name: "User", permissions: ["read"] },
]

interface User {
  id?: string
  name: string
  email: string
  phone: string
  role: string
  avatar?: string
  status?: string
  lastLogin?: string
}

export default function UserManagement() {
  const [users, setUsers] = useState(mockUsers)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [newUser, setNewUser] = useState<User>({
    name: "",
    email: "",
    phone: "",
    role: "",
    avatar: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string>("")
  const { toast } = useToast()

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter.toLowerCase()
    return matchesSearch && matchesRole
  })

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email || !newUser.phone || !newUser.role) {
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
      status: "active",
      lastLogin: "Never",
      avatar: avatarPreview || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=150&h=150&fit=crop&crop=face`
    }

    setUsers([...users, user])
    setNewUser({ name: "", email: "", phone: "", role: "", avatar: "" })
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

  const handleUpdateUser = () => {
    if (!editingUser) return

    setUsers(users.map(user => 
      user.id === editingUser.id 
        ? { ...editingUser, avatar: avatarPreview || editingUser.avatar }
        : user
    ))
    setShowEditDialog(false)
    setEditingUser(null)
    setAvatarPreview("")
    
    toast({
      title: "User Updated",
      description: `${editingUser.name} has been successfully updated.`,
    })
  }

  const handleDeleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId)
    setUsers(users.filter(u => u.id !== userId))
    
    toast({
      title: "User Deleted",
      description: `${user?.name} has been successfully deleted.`,
    })
  }

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = event.target.files?.[0]
    if (file) {
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

  const UserForm = ({ user, setUser, isEdit = false }: { 
    user: User; 
    setUser: (user: User) => void; 
    isEdit?: boolean 
  }) => (
    <div className="space-y-6">
      {/* Avatar Upload */}
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="w-24 h-24">
          <AvatarImage src={avatarPreview || user.avatar} />
          <AvatarFallback className="bg-brand-100 text-brand-700 text-lg">
            {user.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="name"
              placeholder="Enter full name"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="pl-10"
            />
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
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="phone"
              placeholder="Enter phone number"
              value={user.phone}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role *</Label>
          <Select value={user.role} onValueChange={(value) => setUser({ ...user, role: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {mockRoles.map((role) => (
                <SelectItem key={role.id} value={role.name}>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>{role.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            <Button size="sm" className="h-8 bg-brand-600 hover:bg-brand-700">
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
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {mockRoles.map((role) => (
                    <SelectItem key={role.id} value={role.name}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Users ({filteredUsers.length})</CardTitle>
            <CardDescription>
              A list of all users in your organization including their details and roles.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filteredUsers.map((user) => (
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
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="bg-brand-100 text-brand-700">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{user.name}</p>
                            <p className="text-sm text-muted-foreground">ID: {user.id}</p>
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
                        <Badge 
                          variant={user.role === 'Admin' ? 'default' : 'secondary'}
                          className={user.role === 'Admin' ? 'bg-brand-100 text-brand-700' : ''}
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.lastLogin}
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
                            <DropdownMenuItem 
                              onClick={() => handleDeleteUser(user.id!)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete User
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

        {/* Create User Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Add a new user to your organization. They will receive an email with login instructions.
              </DialogDescription>
            </DialogHeader>
            <UserForm user={newUser} setUser={setNewUser} />
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
                Update user information and role assignments.
              </DialogDescription>
            </DialogHeader>
            {editingUser && (
              <UserForm 
                user={editingUser} 
                setUser={setEditingUser} 
                isEdit 
              />
            )}
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateUser} className="bg-brand-600 hover:bg-brand-700">
                <Save className="w-4 h-4 mr-2" />
                Update User
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </OptimizedDashboardLayout>
  )
}
