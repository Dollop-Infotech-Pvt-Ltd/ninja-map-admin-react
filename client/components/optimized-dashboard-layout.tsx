import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Home, 
  Users, 
  Shield, ShieldCheck, 
  Settings, 
  Activity, 
  BarChart3, 
  FileText, Newspaper, MessageSquare, 
  Route,
  MapPin,
  Navigation,
  Bell,
  Search,
  LogOut,
  User,
  ChevronDown,
  Menu,
  X,
  AlertTriangle,
  HelpCircle,
  Lock,
  Clipboard,
  UserCircle
} from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { BrandLogo } from "@/components/brand-logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useCurrentUser } from "@/lib/user"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { deleteAuthCookies } from "@/lib/cookies"

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
}

interface NavItem {
  label: string
  path: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  subItems?: NavItem[]
}

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: Home },
  { label: "User Management", path: "/dashboard/users", icon: Users, badge: "12" },
  { label: "Admin Management", path: "/dashboard/admins", icon: ShieldCheck },
  { label: "Role Management", path: "/dashboard/roles", icon: Shield },
  { label: "Analytics", path: "/dashboard/analytics", icon: BarChart3 },
  { label: "Routes", path: "/dashboard/routes", icon: Route },
  { label: "Navigation", path: "/dashboard/navigation", icon: Navigation },
  { label: "Map Points", path: "/dashboard/mappoints", icon: MapPin },
  { label: "Blogs", path: "/dashboard/blogs", icon: Newspaper },
  { label: "Queries", path: "/dashboard/queries", icon: MessageSquare },
  { label: "Reports", path: "/dashboard/reports", icon: FileText },
  { label: "Activity Logs", path: "/dashboard/activity", icon: Activity },
  {
    label: "Settings",
    path: "/dashboard/settings",
    icon: Settings,
    subItems: [
      { label: "Profile", path: "/dashboard/settings/profile", icon: UserCircle },
      { label: "FAQ", path: "/dashboard/settings/faq", icon: HelpCircle },
      { label: "Privacy Policy", path: "/dashboard/settings/privacy", icon: Lock },
      { label: "Terms & Conditions", path: "/dashboard/settings/tnc", icon: Clipboard }
    ]
  }
]


export function OptimizedDashboardLayout({ children, title }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { user: currentUser } = useCurrentUser()

  // Automatically open submenu if current path is a sub-item
  useEffect(() => {
    const activeItem = navItems.find(item => 
      item.path === location.pathname || 
      (item.subItems && item.subItems.some(subItem => subItem.path === location.pathname))
    )
    
    if (activeItem?.subItems) {
      setOpenSubmenu(activeItem.path)
    } else {
      setOpenSubmenu(null)
    }
  }, [location.pathname])

  const handleLogout = () => {
    setLogoutDialogOpen(false)
    setUserMenuOpen(false)

    try {
      // Clear auth-related data
      deleteAuthCookies()
      sessionStorage.clear()
      // Remove common auth keys from localStorage without wiping user prefs
      const authKeys = ["auth_token", "authToken", "token", "refresh_token", "access_token", "id_token"]
      authKeys.forEach((k) => localStorage.removeItem(k))
    } catch {}

    navigate("/login", { replace: true, state: { type: "success", message: "Logged out successfully." } })
  }

  const toggleSubmenu = (path: string) => {
    setOpenSubmenu(openSubmenu === path ? null : path)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Full Height Layout Container */}
      <div className="flex h-screen">
        {/* Sidebar - Full Height */}
        <div className="relative">
          {/* Mobile sidebar overlay */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}
          </AnimatePresence>

          {/* Sidebar */}
          <div className={`fixed left-0 top-0 z-50 h-screen w-72 bg-card border-r border-border transition-transform duration-300 lg:relative lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 lg:p-6 border-b border-border">
              <BrandLogo size="sm" />
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-8 w-8"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Sidebar Navigation - Scrollable */}
            <div className="flex flex-col h-[calc(100vh-80px)] lg:h-[calc(100vh-100px)]">
              <nav className="flex-1 overflow-y-auto p-3 lg:p-4">
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.path || 
                                    (item.subItems && item.subItems.some(subItem => location.pathname === subItem.path))
                    const IconComponent = item.icon
                    const hasSubItems = item.subItems && item.subItems.length > 0
                    const isSubmenuOpen = openSubmenu === item.path
                    
                    return (
                      <div key={item.path}>
                        {hasSubItems ? (
                          <button
                            onClick={() => toggleSubmenu(item.path)}
                            className={`group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 w-full ${
                              isActive
                                ? "bg-brand-500/10 text-brand-600 shadow-sm"
                                : "text-muted-foreground hover:bg-accent hover:text-foreground"
                            }`}
                          >
                            <div className="flex items-center space-x-2.5">
                              <IconComponent 
                                className={`w-4 h-4 transition-colors ${
                                  isActive ? "text-brand-600" : "text-muted-foreground group-hover:text-foreground"
                                }`} 
                              />
                              <span className="text-sm">{item.label}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              {item.badge && (
                                <span className="bg-brand-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                  {item.badge}
                                </span>
                              )}
                              <ChevronDown 
                                className={`w-4 h-4 transition-transform duration-200 ${
                                  isSubmenuOpen ? 'rotate-180' : ''
                                }`} 
                              />
                            </div>
                          </button>
                        ) : (
                          <Link
                            to={item.path}
                            className={`group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                              isActive
                                ? "bg-brand-500/10 text-brand-600 shadow-sm"
                                : "text-muted-foreground hover:bg-accent hover:text-foreground"
                            }`}
                            onClick={() => setSidebarOpen(false)}
                          >
                            <div className="flex items-center space-x-2.5">
                              <IconComponent 
                                className={`w-4 h-4 transition-colors ${
                                  isActive ? "text-brand-600" : "text-muted-foreground group-hover:text-foreground"
                                }`} 
                              />
                              <span className="text-sm">{item.label}</span>
                            </div>
                            {item.badge && (
                              <span className="bg-brand-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        )}
                        
                        {/* Submenu */}
                        {hasSubItems && (
                          <AnimatePresence>
                            {isSubmenuOpen && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="ml-4 mt-1 space-y-1 overflow-hidden"
                              >
                                {item.subItems!.map((subItem) => {
                                  const isSubActive = location.pathname === subItem.path
                                  const SubIconComponent = subItem.icon
                                  
                                  return (
                                    <Link
                                      key={subItem.path}
                                      to={subItem.path}
                                      className={`group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                                        isSubActive
                                          ? "bg-brand-500/10 text-brand-600 shadow-sm"
                                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                      }`}
                                      onClick={() => setSidebarOpen(false)}
                                    >
                                      <SubIconComponent 
                                        className={`w-4 h-4 mr-2.5 transition-colors ${
                                          isSubActive ? "text-brand-600" : "text-muted-foreground group-hover:text-foreground"
                                        }`} 
                                      />
                                      <span className="text-sm">{subItem.label}</span>
                                    </Link>
                                  )
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        )}
                      </div>
                    )
                  })}
                </div>
              </nav>

              {/* Sidebar Footer */}
              {/* <div className="p-3 lg:p-4 border-t border-border bg-card">
                <div className="bg-brand-500/5 border border-brand-200/50 dark:border-brand-800/50 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-brand-500 to-brand-600 rounded-md flex items-center justify-center">
                      <Shield className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">Pro Plan</p>
                      <p className="text-xs text-muted-foreground">Advanced features</p>
                    </div>
                  </div>
                  <Button size="sm" className="w-full h-7 text-xs bg-brand-600 hover:bg-brand-700 text-white">
                    Upgrade
                  </Button>
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Navigation */}
          <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border">
            <div className="flex items-center justify-between px-4 lg:px-6 py-3">
              {/* Left side */}
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden h-8 w-8"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="w-4 h-4" />
                </Button>
                
                {title && (
                  <div>
                    <h1 className="text-lg lg:text-xl font-bold text-foreground">{title}</h1>
                    <p className="text-xs lg:text-sm text-muted-foreground">
                      Manage your navigation platform
                    </p>
                  </div>
                )}
              </div>

              {/* Right side */}
              <div className="flex items-center space-x-2 lg:space-x-3">
                {/* Search */}
                <div className="hidden md:block relative">
                  <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground w-3.5 h-3.5" />
                  <Input
                    placeholder="Search..."
                    className="w-48 lg:w-64 h-8 pl-9 bg-card/70 backdrop-blur-md border-border text-sm"
                  />
                </div>

                {/* Theme Toggle */}
                <ThemeToggle />
                
                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative h-8 w-8">
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                    3
                  </span>
                </Button>

                {/* User Menu */}
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    className="p-1.5 h-auto"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-7 h-7">
                        <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                        <AvatarFallback className="bg-brand-100 text-brand-700 text-xs">
                          {currentUser.name?.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden lg:block text-left">
                        <p className="text-xs font-medium text-foreground">{currentUser.name}</p>
                        <p className="text-xs text-muted-foreground">{currentUser.role}</p>
                      </div>
                      <ChevronDown className="w-3 h-3 text-muted-foreground" />
                    </div>
                  </Button>
                  
                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-52 bg-popover border border-border rounded-lg shadow-lg overflow-hidden z-50"
                      >
                        <div className="p-3 border-b border-border">
                          <div className="flex items-center space-x-2">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                              <AvatarFallback className="bg-brand-100 text-brand-700 text-xs">
                                {currentUser.name?.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium text-foreground">{currentUser.name}</p>
                              <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-1">
                          <Link 
                            to="/dashboard/settings/profile"
                            className="flex items-center w-full px-2 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <User className="w-4 h-4 mr-2" />
                            View Profile
                          </Link>
                          <button className="flex items-center w-full px-2 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors">
                            <Settings className="w-4 h-4 mr-2" />
                            Account Settings
                          </button>
                          <button className="flex items-center w-full px-2 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors">
                            <Shield className="w-4 h-4 mr-2" />
                            Security
                          </button>
                          <div className="border-t border-border my-1"></div>
                          <button 
                            onClick={() => {
                              setUserMenuOpen(false)
                              setLogoutDialogOpen(true)
                            }}
                            className="flex items-center w-full px-2 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content - Scrollable */}
          <main className="flex-1 overflow-auto p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>

      {/* Click outside to close user menu */}
      {userMenuOpen && (
        <div 
          className="fixed inset-0 z-20" 
          onClick={() => setUserMenuOpen(false)}
        />
      )}

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <DialogTitle>Confirm Logout</DialogTitle>
                <DialogDescription>
                  Are you sure you want to logout? You will need to sign in again to access your account.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setLogoutDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
