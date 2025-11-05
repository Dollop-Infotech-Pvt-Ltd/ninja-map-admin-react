import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Home, 
  Users, 
  Shield, 
  Settings, 
  Activity, 
  BarChart3, 
  FileText, 
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
import { BrandLogo } from "@/components/brand-logo"
import { ThemeToggle } from "@/components/theme-toggle"

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
  { label: "User Management", path: "/dashboard/users", icon: Users, badge: "12" },
  { label: "Role Management", path: "/dashboard/roles", icon: Shield },
  { label: "Analytics", path: "/dashboard/analytics", icon: BarChart3 },
  { label: "Routes", path: "/dashboard/routes", icon: Route },
  { label: "Navigation", path: "/dashboard/navigation", icon: Navigation },
  { label: "Map Points", path: "/dashboard/mappoints", icon: MapPin },
  { label: "Reports", path: "/dashboard/reports", icon: FileText },
  { label: "Activity Logs", path: "/dashboard/activity", icon: Activity },
  { label: "Settings", path: "/dashboard/settings", icon: Settings },
]

// Mock user data
const currentUser = {
  name: "Yash Jain",
  email: "yash@ninjamap.com",
  role: "Super Admin",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
}

export function FixedDashboardLayout({ children, title }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen bg-background">
      
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
      <aside className="fixed left-0 top-0 z-40 h-full w-72 lg:relative lg:z-auto lg:block">
        <motion.div
          initial={false}
          animate={{
            x: sidebarOpen ? 0 : "-100%"
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
          className="w-full h-full bg-card backdrop-blur-xl border-r border-border lg:translate-x-0 lg:bg-card/95"
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
        </motion.div>
      </aside>

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

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                  3
                </span>
              </Button>

              {/* User Menu */}
              <div className="relative">
                <Button 
                  variant="ghost" 
                  className="p-2 h-auto"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-medium text-sm">
                      {currentUser.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-foreground">{currentUser.name}</p>
                      <p className="text-xs text-muted-foreground">{currentUser.role}</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
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
                      className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-lg shadow-lg overflow-hidden z-50"
                    >
                      <div className="p-3 border-b border-border">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-medium">
                            {currentUser.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{currentUser.name}</p>
                            <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-1">
                        <button className="flex items-center w-full px-2 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors">
                          <User className="w-4 h-4 mr-2" />
                          Update Profile
                        </button>
                        <button className="flex items-center w-full px-2 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors">
                          <Settings className="w-4 h-4 mr-2" />
                          Account Settings
                        </button>
                        <button className="flex items-center w-full px-2 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors">
                          <Shield className="w-4 h-4 mr-2" />
                          Security
                        </button>
                        <div className="border-t border-border my-1"></div>
                        <button className="flex items-center w-full px-2 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors">
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

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Click outside to close user menu */}
      {userMenuOpen && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </div>
  )
}
