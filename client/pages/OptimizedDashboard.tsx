import { motion } from "framer-motion"
import { 
  BarChart3, 
  Users, 
  Settings, 
  Bell, 
  Search, 
  Plus,
  TrendingUp,
  Activity,
  Route,
  MapPin,
  Navigation,
  FileText,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  Eye
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OptimizedDashboardLayout } from "@/components/optimized-dashboard-layout"
import { EnhancedButton } from "@/components/enhanced-button"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Link } from "react-router-dom"

export default function OptimizedDashboard() {
  const stats = [
    {
      title: "Active Routes",
      value: "45,231",
      change: "+20.1%",
      changeType: "positive",
      icon: Route,
      color: "from-green-500 to-emerald-600",
      description: "Total navigation routes"
    },
    {
      title: "Active Users",
      value: "2,350",
      change: "+180.1%",
      changeType: "positive", 
      icon: Users,
      color: "from-green-500 to-emerald-600",
      description: "Registered users"
    },
    {
      title: "Navigation Points",
      value: "12,234",
      change: "+19%",
      changeType: "positive",
      icon: MapPin,
      color: "from-green-500 to-emerald-600",
      description: "Map coordinates"
    },
    {
      title: "Reports Generated",
      value: "573",
      change: "+201",
      changeType: "positive",
      icon: FileText,
      color: "from-green-500 to-emerald-600",
      description: "This month"
    },
  ]

  const recentActivity = [
    { 
      action: "New route optimized for downtown area", 
      time: "2 minutes ago", 
      status: "success", 
      icon: Route, 
      color: "from-green-500 to-emerald-600",
      user: "System Auto-Optimizer"
    },
    { 
      action: "User completed 50km navigation", 
      time: "5 minutes ago", 
      status: "info", 
      icon: Navigation, 
      color: "from-green-500 to-emerald-600",
      user: "John Doe"
    },
    { 
      action: "Map data synchronized from external API", 
      time: "12 minutes ago", 
      status: "success", 
      icon: MapPin, 
      color: "from-green-500 to-emerald-600",
      user: "Data Sync Service"
    },
    { 
      action: "System maintenance completed", 
      time: "1 hour ago", 
      status: "warning", 
      icon: Settings, 
      color: "from-green-500 to-emerald-600",
      user: "Admin Team"
    },
    { 
      action: "Weekly analytics report generated", 
      time: "2 hours ago", 
      status: "success", 
      icon: FileText, 
      color: "from-green-500 to-emerald-600",
      user: "Analytics Engine"
    },
  ]

  const quickActions = [
    { 
      title: "Manage Users", 
      description: "Add, edit or remove users",
      icon: Users, 
      color: "from-green-500 to-emerald-600",
      path: "/dashboard/users",
      count: "2,350 users"
    },
    { 
      title: "Route Analytics", 
      description: "View route performance data",
      icon: Route, 
      color: "from-green-500 to-emerald-600",
      path: "/dashboard/analytics",
      count: "45,231 routes"
    },
    { 
      title: "System Settings", 
      description: "Configure system parameters",
      icon: Settings, 
      color: "from-green-500 to-emerald-600",
      path: "/dashboard/settings",
      count: "12 modules"
    },
    { 
      title: "Security Center", 
      description: "Manage roles & permissions",
      icon: Shield, 
      color: "from-green-500 to-emerald-600",
      path: "/dashboard/roles",
      count: "4 roles"
    },
  ]

  const systemMetrics = [
    { label: "CPU Usage", value: 45, color: "bg-green-500", status: "good" },
    { label: "Memory", value: 72, color: "bg-yellow-500", status: "warning" },
    { label: "Storage", value: 28, color: "bg-blue-500", status: "good" },
    { label: "Network", value: 91, color: "bg-red-500", status: "critical" },
  ]

  return (
    <OptimizedDashboardLayout title="Dashboard">
      <div className="space-y-4 lg:space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        >
          <div>
            <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-foreground">Welcome back, Admin!</h2>
            <p className="text-sm text-muted-foreground">
              Here's what's happening with your navigation platform today.
            </p>
          </div>
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground w-3.5 h-3.5" />
              <Input
                placeholder="Search..."
                className="w-48 lg:w-64 h-8 pl-9 bg-card/70 backdrop-blur-md text-sm"
              />
            </div>
            <Button size="sm" variant="outline" className="h-8 text-sm">
              <Bell className="w-3.5 h-3.5 mr-1.5" />
              3
            </Button>
            <EnhancedButton size="sm" className="h-8 text-sm bg-from-green-500 to-emerald-600">
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Add Route
            </EnhancedButton>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid gap-3 lg:gap-4 grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * index }}
            >
              <Card className="bg-card/70 backdrop-blur-md border-border hover:shadow-md transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="space-y-1">
                    <CardTitle className="text-xs lg:text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <div className="text-lg lg:text-2xl font-bold text-foreground">{stat.value}</div>
                  </div>
                  <div className={`p-2 bg-gradient-to-br ${stat.color} rounded-lg shadow-sm`}>
                    <stat.icon className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      <span className={`${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'} font-medium`}>
                        {stat.change}
                      </span>
                      {" "}from last month
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid gap-4 lg:gap-6 grid-cols-1 lg:grid-cols-3">
          {/* Analytics Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="bg-card/70 backdrop-blur-md border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base lg:text-lg text-foreground">Navigation Analytics</CardTitle>
                    <CardDescription className="text-xs lg:text-sm">
                      Route usage and performance metrics for the last 6 months
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    <Eye className="w-3 h-3 mr-1" />
                    View Details
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-48 lg:h-64 flex items-center justify-center border-2 border-dashed border-border rounded-lg bg-muted/20">
                  <div className="text-center">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-lg">
                      <TrendingUp className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                    </div>
                    <p className="text-foreground font-medium text-sm lg:text-base mb-1">
                      Route Analytics Chart
                    </p>
                    <p className="text-xs lg:text-sm text-muted-foreground">
                      Interactive charts will be displayed here
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* System Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="bg-card/70 backdrop-blur-md border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base lg:text-lg text-foreground">System Health</CardTitle>
                <CardDescription className="text-xs lg:text-sm">
                  Real-time system performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {systemMetrics.map((metric, index) => (
                    <div key={metric.label} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs lg:text-sm font-medium text-foreground">{metric.label}</span>
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-muted-foreground">{metric.value}%</span>
                          {metric.status === 'good' && <CheckCircle className="w-3 h-3 text-green-500" />}
                          {metric.status === 'warning' && <Clock className="w-3 h-3 text-yellow-500" />}
                          {metric.status === 'critical' && <AlertCircle className="w-3 h-3 text-red-500" />}
                        </div>
                      </div>
                      <Progress value={metric.value} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid gap-4 lg:gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card className="bg-card/70 backdrop-blur-md border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base lg:text-lg text-foreground">Recent Activity</CardTitle>
                    <CardDescription className="text-xs lg:text-sm">
                      Latest navigation events and system updates
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recentActivity.slice(0, 4).map((activity, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-center space-x-2 p-2.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className={`p-1.5 rounded-md bg-gradient-to-br ${activity.color} shadow-sm`}>
                        <activity.icon className="w-3 h-3 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs lg:text-sm font-medium text-foreground truncate">{activity.action}</p>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                          <span className="text-xs text-muted-foreground">•</span>
                          <p className="text-xs text-muted-foreground truncate">{activity.user}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Card className="bg-card/70 backdrop-blur-md border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base lg:text-lg text-foreground">Quick Actions</CardTitle>
                <CardDescription className="text-xs lg:text-sm">
                  Common navigation management tasks and shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 grid-cols-1">
                  {quickActions.map((action, index) => (
                    <motion.div
                      key={action.title}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Link to={action.path} className="block">
                        <div className="flex items-center p-3 border border-border rounded-lg hover:bg-accent hover:border-brand-300/50 transition-all duration-200 group">
                          <div className={`p-2 bg-gradient-to-br ${action.color} rounded-lg shadow-sm mr-3`}>
                            <action.icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-foreground">{action.title}</span>
                              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
                            <Badge variant="secondary" className="text-xs mt-1.5">
                              {action.count}
                            </Badge>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </OptimizedDashboardLayout>
  )
}
