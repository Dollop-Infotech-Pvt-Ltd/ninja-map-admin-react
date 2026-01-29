import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Search, 
  MoreHorizontal,
  Check,
  X,
  Eye,
  Calendar,
  User,
  MessageSquare,
  Filter,
  RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import api from "@/lib/http"
import { normalizeCustomerStory } from "@/lib/customer-story-utils"
import { PaginatedResponse, CustomerStory, CustomerStoriesResponse } from "@shared/api"

export default function CustomerStoriesAdmin() {
  const [stories, setStories] = useState<CustomerStory[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("PENDING")
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL")
  const [selectedStory, setSelectedStory] = useState<CustomerStory | null>(null)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [storyToApprove, setStoryToApprove] = useState<CustomerStory | null>(null)
  
  const [pageNumber, setPageNumber] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [approving, setApproving] = useState(false)
  
  const { toast } = useToast()

  const fetchCustomerStories = async () => {
    try {
      setLoading(true)
      const data = await api.get<CustomerStoriesResponse>("/api/customer-stories/admin/get-customer-stories", {
        query: { 
          status: statusFilter === "ALL" ? undefined : statusFilter,
          pageSize, 
          pageNumber 
        },
      })
      
      // Normalize the data to ensure consistency
      const normalizedStories = (data?.content || []).map(normalizeCustomerStory)
      
      setStories(normalizedStories)
      setTotalElements(data?.totalElements || 0)
      setTotalPages(data?.totalPages || 1)
    } catch (e: any) {
      toast({
        title: "Failed to load customer stories",
        description: e?.message || "Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomerStories()
  }, [pageNumber, pageSize, statusFilter])

  // Simple filtering without useMemo to avoid dependency issues
  const filteredStories = stories.filter(story => {
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch = !searchQuery || 
      (story.title || '').toLowerCase().includes(searchLower) ||
      (story.author?.name || '').toLowerCase().includes(searchLower) ||
      (story.author?.email || '').toLowerCase().includes(searchLower) ||
      (story.description || '').toLowerCase().includes(searchLower) ||
      (story.location || '').toLowerCase().includes(searchLower)
    
    const matchesCategory = categoryFilter === "ALL" || story.category === categoryFilter
    
    return matchesSearch && matchesCategory
  })

  const handleViewStory = (story: CustomerStory) => {
    setSelectedStory(story)
    setShowViewDialog(true)
  }

  const handleApproveStory = async (storyId: string) => {
    if (approving) return // Prevent multiple calls
    
    try {
      setApproving(true)
      await api.patch(`/api/customer-stories/admin/approve-reject?id=${storyId}&isApproved=true`)
      
      // Close dialogs first
      setShowApproveDialog(false)
      setStoryToApprove(null)
      setShowViewDialog(false)
      
      // Show success toast
      toast({
        title: "✅ Story Approved Successfully",
        description: "The customer story has been approved and is now visible to the public.",
      })
      
      // Refresh the data to get updated list
      await fetchCustomerStories()
      
    } catch (e: any) {
      toast({
        title: "Approval Failed",
        description: e?.message || "Failed to approve the story. Please try again.",
        variant: "destructive",
      })
    } finally {
      setApproving(false)
    }
  }

  const getStatusBadgeVariant = (status?: string) => {
    switch (status) {
      case 'APPROVED':
        return 'default'
      case 'PENDING':
        return 'secondary'
      default:
        return 'secondary'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <OptimizedDashboardLayout title="Customer Stories Admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-foreground">Customer Stories</h2>
            <p className="text-sm text-muted-foreground">
              Review and manage customer story submissions
            </p>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={fetchCustomerStories}
            disabled={loading || approving}
            className="h-8"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${(loading || approving) ? 'animate-spin' : ''}`} />
            {approving ? 'Updating...' : 'Refresh'}
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search stories, authors, locations, or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectItem value="ALL">All Status</SelectItem> */}
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Categories</SelectItem>
                    <SelectItem value="BUSINESS">Business</SelectItem>
                    <SelectItem value="TRANSPORT">Transport</SelectItem>
                    <SelectItem value="HEALTHCARE">Healthcare</SelectItem>
                    <SelectItem value="PERSONAL">Personal</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stories Table */}
        <Card className="relative">
          {approving && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Updating stories...</span>
              </div>
            </div>
          )}
          <CardHeader>
            <CardTitle>
              {statusFilter === "ALL" ? "All" : statusFilter} Stories ({totalElements || filteredStories.length})
            </CardTitle>
            <CardDescription>
              {statusFilter === 'PENDING' 
                ? "Review pending customer story submissions and approve them."
                : statusFilter === 'APPROVED'
                ? "View approved customer stories."
                : "Manage all customer story submissions."
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Author</TableHead>
                  <TableHead>Story</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      Loading customer stories...
                    </TableCell>
                  </TableRow>
                ) : filteredStories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No stories found
                    </TableCell>
                  </TableRow>
                ) : (
                  <AnimatePresence>
                    {filteredStories.map((story) => {
                      const initials = (story.author?.name || '')
                        .split(' ')
                        .map(n => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()

                      return (
                        <motion.tr
                          key={story.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.2 }}
                          className="group"
                        >
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarImage src={story.author?.profilePicture || undefined} />
                                <AvatarFallback className="bg-brand-100 text-brand-700">
                                  {initials}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-foreground">{story.author?.name || 'Unknown'}</p>
                                <p className="text-sm text-muted-foreground">{story.author?.email || ''}</p>
                                {story.author?.bio && (
                                  <p className="text-xs text-muted-foreground">{story.author.bio}</p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs">
                              <p className="font-medium text-foreground truncate">{story.title || ''}</p>
                              <p className="text-sm text-muted-foreground overflow-hidden">
                                <span className="block truncate">
                                  {(story.description || '').substring(0, 100)}...
                                </span>
                              </p>
                              {story.location && (
                                <p className="text-xs text-muted-foreground mt-1">📍 {story.location}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {story.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(story.status || 'PENDING')}>
                              {story.status || 'PENDING'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatDate(story.createdDate)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewStory(story)}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                {(story.status === 'PENDING' || !story.status) && (
                                  <DropdownMenuItem 
                                    onClick={() => {
                                      setStoryToApprove(story)
                                      setShowApproveDialog(true)
                                    }}
                                    className="text-green-600 focus:text-green-600"
                                    disabled={approving}
                                  >
                                    <Check className="w-4 h-4 mr-2" />
                                    Approve
                                  </DropdownMenuItem>
                                )}
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
            
            {/* Pagination */}
            <div className="flex items-center justify-between py-3">
              <div className="text-sm text-muted-foreground">
                Page {pageNumber + 1} of {Math.max(totalPages, 1)} • {totalElements} total
              </div>
              <div className="flex items-center gap-2">
                <Select 
                  value={String(pageSize)} 
                  onValueChange={(v) => { 
                    setPageSize(Number(v)); 
                    setPageNumber(0); 
                  }}
                >
                  <SelectTrigger className="w-[110px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 20, 50].map((n) => (
                      <SelectItem key={n} value={String(n)}>{n} / page</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPageNumber((p) => Math.max(p - 1, 0))} 
                    disabled={loading || pageNumber <= 0}
                  >
                    Previous
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPageNumber((p) => (totalPages ? Math.min(p + 1, totalPages - 1) : p + 1))} 
                    disabled={loading || (totalPages ? pageNumber >= totalPages - 1 : false)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* View Story Dialog */}
        <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Customer Story Details
              </DialogTitle>
              <DialogDescription>
                Review the complete customer story submission
              </DialogDescription>
            </DialogHeader>
            
            {selectedStory && (
              <div className="space-y-6">
                {/* Author Info */}
                <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={selectedStory.author?.profilePicture} />
                    <AvatarFallback className="bg-brand-100 text-brand-700">
                      {(selectedStory.author?.name || '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{selectedStory.author?.name || 'Unknown Author'}</h3>
                    <p className="text-sm text-muted-foreground">{selectedStory.author?.email || ''}</p>
                    {selectedStory.author?.bio && (
                      <p className="text-sm text-muted-foreground mt-1">{selectedStory.author.bio}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <Badge variant={getStatusBadgeVariant(selectedStory.status || 'PENDING')}>
                      {selectedStory.status || 'PENDING'}
                    </Badge>
                    <Badge variant="outline" className="ml-2">
                      {selectedStory.category}
                    </Badge>
                  </div>
                </div>

                {/* Story Content */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Story Title</h4>
                    <p className="text-foreground">{selectedStory.title || ''}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Story Description</h4>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-foreground whitespace-pre-wrap">{selectedStory.description || ''}</p>
                    </div>
                  </div>

                  {selectedStory.location && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Location</h4>
                      <p className="text-foreground">📍 {selectedStory.location}</p>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{selectedStory.stats?.likes || 0}</p>
                    <p className="text-sm text-muted-foreground">Likes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{selectedStory.stats?.views || 0}</p>
                    <p className="text-sm text-muted-foreground">Views</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{selectedStory.stats?.comments || 0}</p>
                    <p className="text-sm text-muted-foreground">Comments</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{selectedStory.rating || 0}</p>
                    <p className="text-sm text-muted-foreground">Rating</p>
                  </div>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Created</p>
                    <p className="text-sm text-foreground">{formatDate(selectedStory.createdDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                    <p className="text-sm text-foreground">{formatDate(selectedStory.updatedDate)}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                {(selectedStory.status === 'PENDING' || !selectedStory.status) && (
                  <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button 
                      onClick={() => {
                        setStoryToApprove(selectedStory)
                        setShowApproveDialog(true)
                      }}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={approving}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Approve Story
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Approve Confirmation Dialog */}
        <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-green-700">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                Approve Customer Story
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base">
                Are you sure you want to approve <strong>"{storyToApprove?.title}"</strong>?
                <br />
                <br />
                This action will:
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  <li>Make the story visible to the public</li>
                  <li>Move it to the approved section</li>
                  <li>Cannot be undone</li>
                </ul>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2">
              <AlertDialogCancel 
                onClick={() => {
                  setShowApproveDialog(false)
                  setStoryToApprove(null)
                }}
                disabled={approving}
                className="flex-1"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                className="bg-green-600 hover:bg-green-700 flex-1"
                onClick={() => storyToApprove && handleApproveStory(storyToApprove.id)}
                disabled={approving}
              >
                {approving ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Approving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Yes, Approve
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </OptimizedDashboardLayout>
  )
}