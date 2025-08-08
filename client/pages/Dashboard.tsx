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
  FileText
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ReliableDashboardLayout } from "@/components/reliable-dashboard-layout"
import { EnhancedButton } from "@/components/enhanced-button"
import { Link } from "react-router-dom"

export default function Dashboard() {
  const stats = [
    {
      title: "Active Routes",
      value: "45,231",
      change: "+20.1%",
      changeType: "positive",
      icon: Route,
      color: "from-brand-500 to-brand-600"
    },
    {
      title: "Active Users",
      value: "2,350",
      change: "+180.1%",
      changeType: "positive", 
      icon: Users,
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Navigation Points",
      value: "12,234",
      change: "+19%",
      changeType: "positive",
      icon: MapPin,
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "Reports Generated",
      value: "573",
      change: "+201",
      changeType: "positive",
      icon: FileText,
      color: "from-orange-500 to-red-600"
    },
  ]

  return (
    <ReliableDashboardLayout title="Dashboard">
      <div className="space-y-6">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Welcome back!</h2>
              <p className="text-muted-foreground">
                Here's what's happening with your navigation platform today.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search..."
                  className="w-64 pl-10 bg-card/70 backdrop-blur-md"
                />
              </div>
              <EnhancedButton size="icon" variant="outline">
                <Bell className="w-4 h-4" />
              </EnhancedButton>
              <EnhancedButton>
                <Plus className="w-4 h-4 mr-2" />
                Add New Route
              </EnhancedButton>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * index }}
              >
                <Card className="bg-card/70 backdrop-blur-md border-border hover:shadow-lg transition-all duration-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 bg-gradient-to-br ${stat.color} rounded-lg shadow-md`}>
                      <stat.icon className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className={`${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'} font-medium`}>
                        {stat.change}
                      </span>
                      {" "}from last month
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Charts Section */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="col-span-4"
            >
              <Card className="bg-card/70 backdrop-blur-md border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Navigation Analytics</CardTitle>
                  <CardDescription>
                    Route usage and performance metrics for the last 6 months
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center border-2 border-dashed border-border rounded-lg bg-muted/20">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                        <TrendingUp className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-foreground font-medium text-lg mb-2">
                        Route Analytics Chart
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Interactive charts will be displayed here
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="col-span-3"
            >
              <Card className="bg-card/70 backdrop-blur-md border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Recent Activity</CardTitle>
                  <CardDescription>
                    Latest navigation events and system updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { action: "New route optimized", time: "2 minutes ago", status: "success", icon: Route, color: "from-brand-500 to-brand-600" },
                      { action: "User navigation completed", time: "5 minutes ago", status: "info", icon: Navigation, color: "from-blue-500 to-indigo-600" },
                      { action: "Map data synchronized", time: "12 minutes ago", status: "success", icon: MapPin, color: "from-green-500 to-emerald-600" },
                      { action: "System maintenance", time: "1 hour ago", status: "warning", icon: Settings, color: "from-orange-500 to-red-600" },
                      { action: "Analytics report generated", time: "2 hours ago", status: "success", icon: FileText, color: "from-purple-500 to-pink-600" },
                    ].map((activity, index) => (
                      <motion.div 
                        key={index} 
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.15 }}
                      >
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${activity.color} shadow-md`}>
                          <activity.icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card className="bg-card/70 backdrop-blur-md border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Quick Actions</CardTitle>
                <CardDescription>
                  Common navigation management tasks and shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {[
                    { title: "Manage Users", icon: Users, color: "from-green-500 to-emerald-600" },
                    { title: "Route Analytics", icon: Route, color: "from-brand-500 to-brand-600" },
                    { title: "Map Settings", icon: MapPin, color: "from-blue-500 to-indigo-600" },
                    { title: "System Config", icon: Settings, color: "from-orange-500 to-red-600" },
                  ].map((action, index) => (
                    <motion.div
                      key={action.title}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Link to={action.title === 'Manage Users' ? '/dashboard/users' : action.title === 'Route Analytics' ? '/dashboard/analytics' : '/dashboard/settings'}>
                        <EnhancedButton
                          variant="outline"
                          className="h-20 w-full flex-col space-y-2 border-border hover:bg-accent hover:border-brand-300/50"
                        >
                          <div className={`p-2 bg-gradient-to-br ${action.color} rounded-lg shadow-md`}>
                            <action.icon className="w-6 h-6 text-white" />
                          </div>
                          <span className="text-sm font-medium">{action.title}</span>
                        </EnhancedButton>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
      </div>
    </ReliableDashboardLayout>
  )
}
