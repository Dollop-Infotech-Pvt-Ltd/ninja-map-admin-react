import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Home, 
  Users, 
  Shield, ShieldCheck, 
  Settings, 
  Activity, 
  BarChart3, 
  FileText, Newspaper, 
  Route,
  MapPin,
  Navigation,
  Bell,
  Search,
  LogOut,
  User,
  ChevronDown,
  Menu,
  X
} from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { BrandLogo } from "@/components/brand-logo"
import { FloatingThemeToggle } from "@/components/floating-theme-toggle"
import { useCurrentUser } from "@/lib/user"

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
}

interface NavItem {
  label: string
  path: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: Home },
  { label: "User Management", path: "/dashboard/users", icon: Users },
  { label: "Admin Management", path: "/dashboard/admins", icon: ShieldCheck },
  { label: "Role Management", path: "/dashboard/roles", icon: Shield },
  { label: "Analytics", path: "/dashboard/analytics", icon: BarChart3 },
  { label: "Routes", path: "/dashboard/routes", icon: Route },
  { label: "Navigation", path: "/dashboard/navigation", icon: Navigation },
  { label: "Map Points", path: "/dashboard/mappoints", icon: MapPin },
  { label: "Blogs", path: "/dashboard/blogs", icon: Newspaper },
  { label: "Reports", path: "/dashboard/reports", icon: FileText },
  { label: "Activity Logs", path: "/dashboard/activity", icon: Activity },
  { label: "Settings", path: "/dashboard/settings", icon: Settings },
]


export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { user: currentUser } = useCurrentUser()

  return (
    <div className="min-h-screen bg-background">
      <FloatingThemeToggle />
      
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          x: sidebarOpen ? 0 : "-100%" 
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30 
        }}
        className="fixed left-0 top-0 z-50 h-full w-72 bg-card/95 backdrop-blur-xl border-r border-border lg:translate-x-0 lg:static lg:z-auto"
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <BrandLogo size="md" />
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              const IconComponent = item.icon
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-brand-500/10 text-brand-600 shadow-lg shadow-brand-500/10"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent 
                      className={`w-5 h-5 transition-colors ${
                        isActive ? "text-brand-600" : "text-muted-foreground group-hover:text-foreground"
                      }`} 
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-brand-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border">
          <div className="bg-brand-500/5 border border-brand-200/50 dark:border-brand-800/50 rounded-xl p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Pro Plan</p>
                <p className="text-xs text-muted-foreground">Advanced features</p>
              </div>
            </div>
            <Button size="sm" className="w-full bg-brand-600 hover:bg-brand-700 text-white">
              Upgrade
            </Button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Top Navigation */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              {title && (
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                  <p className="text-sm text-muted-foreground">
                    Manage your navigation platform
                  </p>
                </div>
              )}
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden md:block relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search..."
                  className="w-64 pl-10 bg-card/70 backdrop-blur-md border-border"
                />
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                  3
                </span>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-2 h-auto">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                        <AvatarFallback className="bg-brand-100 text-brand-700">
                          {currentUser.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden md:block text-left">
                        <p className="text-sm font-medium text-foreground">{currentUser.name}</p>
                        <p className="text-xs text-muted-foreground">{currentUser.role}</p>
                      </div>
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                        <AvatarFallback className="bg-brand-100 text-brand-700">
                          {currentUser.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{currentUser.name}</p>
                        <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" />
                    Update Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Shield className="w-4 h-4 mr-2" />
                    Security
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600 focus:text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
