import { useEffect, useRef, useState, useMemo } from "react";
import { OptimizedDashboardLayout } from "@/components/optimized-dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, MoreHorizontal, Pencil, Search, Trash2, Newspaper, Plus, Upload, Save } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import api from "@/lib/http";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePermissions } from "@/lib/permissions";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface BlogItem {
  id?: string;
  title?: string;
  category?: string;
  imageUrl?: string;
  thumbnail?: string;
  coverImage?: string;
  createdDate?: string;
  createdAt?: string;
  status?: string;
  content?: string;
  tags?: string | string[];
  [key: string]: any;
}

export default function BlogManagement() {
  const [items, setItems] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | "all">("all");
  const [sortKey, setSortKey] = useState("createdDate");
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");
  const [imageOpen, setImageOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { toast } = useToast();

  // Create state
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newBlog, setNewBlog] = useState({ title: "", content: "", category: "", tags: "", featuredImage: null as File | null, featuredUrl: "" });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const createInputRef = useRef<HTMLInputElement | null>(null);

  // Edit state
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editBlog, setEditBlog] = useState<{ id: string | null; title: string; content: string; category: string; tags: string; featuredImage: File | null; featuredUrl: string }>({ id: null, title: "", content: "", category: "", tags: "", featuredImage: null, featuredUrl: "" });
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const editInputRef = useRef<HTMLInputElement | null>(null);
  // Delete confirmation
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Share state gated by permissions
  const { has } = usePermissions();
  const canShareBlogs = has("BLOG_POST_MANAGEMENT", "SHARE_BLOGS", "WRITE");
  const [shareOpen, setShareOpen] = useState(false);
  const [shareItem, setShareItem] = useState<BlogItem | null>(null);

  const handleCreateFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setNewBlog((s) => ({ ...s, featuredImage: f }));
    if (f) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(f);
      setNewBlog((s) => ({ ...s, featuredUrl: "" }));
    } else {
      setImagePreview(null);
    }
  };

  const handleCreateBlog = async () => {
    if (!newBlog.title || !newBlog.content) {
      toast({ title: "Missing fields", description: "Please provide title and content", variant: "destructive" });
      return;
    }
    const form = new FormData();
    form.append("title", newBlog.title);
    form.append("content", newBlog.content);
    form.append("category", newBlog.category || "");
    if (newBlog.tags) form.append("tags", newBlog.tags);
    if (newBlog.featuredImage) form.append("featuredImage", newBlog.featuredImage);
    else if (newBlog.featuredUrl) form.append("featuredUrl", newBlog.featuredUrl);

    try {
      await api.post<any>("/api/blogs/post", { body: form });
      toast({ title: "Blog created", description: "Blog post created successfully." });
      setShowCreateDialog(false);
      setNewBlog({ title: "", content: "", category: "", tags: "", featuredImage: null, featuredUrl: "" });
      setImagePreview(null);
      fetchPage(0, pageSize);
    } catch (e: any) {
      toast({ title: "Create failed", description: e?.message || "Unable to create blog", variant: "destructive" });
    }
  };

  // Edit helpers
  const startEdit = (p: BlogItem) => {
    const id = (p as any).id ?? (p as any).blogId ?? (p as any).uuid ?? null;
    const title = p.title || (p as any).name || "";
    const content = (p as any).content || (p as any).body || "";
    const cat = p.category || (p as any).tag || (p as any).type || "";
    const tags = Array.isArray(p.tags) ? p.tags.join(", ") : (p.tags as string) || "";
    const img = getCover(p);
    setEditBlog({ id, title, content, category: cat, tags, featuredImage: null, featuredUrl: "" });
    setEditImagePreview(img || null);
    setShowEditDialog(true);
  };

  const handleEditFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setEditBlog((s) => ({ ...s, featuredImage: f }));
    if (f) {
      const reader = new FileReader();
      reader.onload = (ev) => setEditImagePreview(ev.target?.result as string);
      reader.readAsDataURL(f);
      setEditBlog((s) => ({ ...s, featuredUrl: "" }));
    }
  };

  const handleUpdateBlog = async () => {
    if (!editBlog.id) {
      toast({ title: "Missing blog id", description: "Cannot update without an id", variant: "destructive" });
      return;
    }
    if (!editBlog.title || !editBlog.content) {
      toast({ title: "Missing fields", description: "Please provide title and content", variant: "destructive" });
      return;
    }

    const form = new FormData();
    form.append("title", editBlog.title);
    form.append("content", editBlog.content);
    form.append("category", editBlog.category || "");
    if (editBlog.tags) form.append("tags", editBlog.tags);
    if (editBlog.featuredImage) form.append("featuredImage", editBlog.featuredImage);
    else if (editBlog.featuredUrl) form.append("featuredUrl", editBlog.featuredUrl);

    try {
      await api.put<any>("/api/blogs/update", { query: { id: editBlog.id }, body: form });
      toast({ title: "Blog updated", description: "Changes saved successfully." });
      setShowEditDialog(false);
      setEditBlog({ id: null, title: "", content: "", category: "", tags: "", featuredImage: null, featuredUrl: "" });
      setEditImagePreview(null);
      fetchPage(pageNumber, pageSize);
    } catch (e: any) {
      toast({ title: "Update failed", description: e?.message || "Unable to update blog", variant: "destructive" });
    }
  };

  // Delete helpers
  const requestDelete = (p: BlogItem) => {
    const id = (p as any).id ?? (p as any).blogId ?? (p as any).uuid ?? null;
    if (!id) { toast({ title: "Delete failed", description: "Missing blog id", variant: "destructive" }); return; }
    setDeleteId(String(id));
    setConfirmOpen(true);
  };

  const performDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/api/blogs/delete`, { query: { id: deleteId } });
      setItems(prev => prev.filter(it => {
        const pid = (it as any).id ?? (it as any).blogId ?? (it as any).uuid;
        return String(pid) !== String(deleteId);
      }));
      setTotal(t => typeof t === 'number' ? Math.max(0, (t || 1) - 1) : t);
      toast({ title: "Deleted", description: "Blog has been deleted." });
    } catch (e: any) {
      toast({ title: "Delete failed", description: e?.message || "Unable to delete blog", variant: "destructive" });
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
      setDeleteId(null);
    }
  };

  const hasPrev = pageNumber > 0;
  const hasKnownTotal = typeof total === "number" && total >= 0;
  const totalPages = hasKnownTotal ? Math.max(1, Math.ceil((total ?? 0) / pageSize)) : null;
  const hasNext = hasKnownTotal ? pageNumber + 1 < (totalPages as number) : items.length === pageSize;

  const getCover = (p: BlogItem) => p.imageUrl || p.thumbnail || p.coverImage || p.documentimage || p.documentImageUrl || null;
  const getCreated = (p: BlogItem) => p.createdDate || p.createdAt || p.publishedAt || p.created || "";
  const getCategory = (p: BlogItem) => p.category || p.tag || p.type || "—";

  const fetchPage = async (page = pageNumber, size = pageSize) => {
    setLoading(true);
    try {
      const params: Record<string, any> = { pageSize: size, pageNumber: page, sortDirection, sortKey };
      if (category && category !== "all") params.category = category;
      if (query && query.trim()) params.search = query.trim();
      const res = await api.get<any>("/api/blogs/get-all", { query: params });
      const data = res?.data ?? res;
      const list = Array.isArray(data)
        ? data
        : Array.isArray((data as any)?.items)
        ? (data as any).items
        : Array.isArray((data as any)?.content)
        ? (data as any).content
        : Array.isArray((data as any)?.results)
        ? (data as any).results
        : [];
      const t = (data?.total ?? data?.totalItems ?? data?.totalElements ?? data?.count ?? null) as number | null;
      setTotal(typeof t === "number" ? t : null);
      setItems(list as BlogItem[]);
    } catch {
      try {
        const res2 = await api.get<any>("/api/blogs", { query: { pageSize, pageNumber } });
        const list2 = (res2?.data ?? (res2 as any)?.items ?? res2) as any[];
        setItems(Array.isArray(list2) ? (list2 as BlogItem[]) : []);
        setTotal(null);
      } catch (e: any) {
        setItems([]);
        setTotal(null);
        toast({ title: "Failed to load blogs", description: e?.message || "Please try again.", variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => fetchPage(0, pageSize), 250);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, pageSize, category, sortKey, sortDirection]);

  useEffect(() => {
    fetchPage(pageNumber, pageSize);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber]);

  const countLabel = useMemo(() => (hasKnownTotal ? total : items.length), [hasKnownTotal, total, items.length]);

  const onViewImage = (p: BlogItem) => {
    const url = getCover(p);
    if (url) { setImageUrl(url); setImageOpen(true); }
  };

  const onShare = (p: BlogItem) => {
    setShareItem(p);
    setShareOpen(true);
  };

  return (
    <OptimizedDashboardLayout title="Blog Management">
      <div className="space-y-6">
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Blogs</CardTitle>
                <CardDescription>Browse and manage blog posts</CardDescription>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
              <div className="relative w-full lg:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input value={query} onChange={(e) => { setQuery(e.target.value); setPageNumber(0); }} placeholder="Search blogs..." className="pl-9" />
              </div>
              <div className="flex gap-2">
                <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPageNumber(0); }}>
                  <SelectTrigger className="w-[110px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[5, 10, 20, 50].map((n) => (
                      <SelectItem key={n} value={String(n)}>{n} / page</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={category} onValueChange={(v) => { setCategory(v); setPageNumber(0); }}>
                  <SelectTrigger className="w-[160px]"><SelectValue placeholder="Category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="TECHNOLOGY">TECHNOLOGY</SelectItem>
                    <SelectItem value="BUSINESS">BUSINESS</SelectItem>
                    <SelectItem value="DESIGN">DESIGN</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortKey} onValueChange={(v) => { setSortKey(v); setPageNumber(0); }}>
                  <SelectTrigger className="w-[160px]"><SelectValue placeholder="Sort key" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdDate">Created Date</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortDirection} onValueChange={(v: any) => { setSortDirection(v); setPageNumber(0); }}>
                  <SelectTrigger className="w-[120px]"><SelectValue placeholder="Direction" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DESC">DESC</SelectItem>
                    <SelectItem value="ASC">ASC</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={() => setShowCreateDialog(true)} className="bg-brand-600 hover:bg-brand-700">
                  <Plus className="w-3.5 h-3.5 mr-1.5" />
                  Add Blog
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-sm text-muted-foreground mb-3">All Blogs ({countLabel})</div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead className="hidden sm:table-cell">Image</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={5}>Loading...</TableCell></TableRow>
                  ) : items.length === 0 ? (
                    <TableRow><TableCell colSpan={5}>No blogs found.</TableCell></TableRow>
                  ) : (
                    items.map((p, idx) => (
                      <TableRow key={(p as any).id ?? idx}>
                        <TableCell className="font-medium flex items-center gap-2"><Newspaper className="w-4 h-4 text-brand-600" />{p.title || p.name || "Untitled"}</TableCell>
                        <TableCell className="hidden md:table-cell"><Badge variant="secondary">{getCategory(p)}</Badge></TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {getCover(p) ? (
                            <img src={getCover(p) as string} alt={p.title || "blog"} className="w-10 h-10 object-cover rounded" />
                          ) : (
                            <div className="w-10 h-10 rounded bg-muted" />
                          )}
                        </TableCell>
                        <TableCell>{getCreated(p) || "—"}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem disabled={!getCover(p)} onClick={() => onViewImage(p)}>
                                <Eye className="w-4 h-4 mr-2" /> View Image
                              </DropdownMenuItem>
                              <DropdownMenuItem disabled={!canShareBlogs} onClick={() => onShare(p)}>
                                <Upload className="w-4 h-4 mr-2" /> Share
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => startEdit(p)}>
                                <Pencil className="w-4 h-4 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => requestDelete(p)} className="text-red-600 focus:text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Page {pageNumber + 1}{totalPages ? ` of ${totalPages}` : ""}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" disabled={!hasPrev} onClick={() => setPageNumber((p) => Math.max(0, p - 1))}>Previous</Button>
                <Button variant="outline" disabled={!hasNext} onClick={() => setPageNumber((p) => p + 1)}>Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={imageOpen} onOpenChange={setImageOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Blog Image</DialogTitle>
          </DialogHeader>
          {imageUrl ? (
            <img src={imageUrl} alt="blog" className="w-full max-h-[70vh] object-contain rounded" />
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Share Blog Dialog */}
      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Blog</DialogTitle>
          </DialogHeader>
          {shareItem ? (
            <div className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground">Title</div>
                <div className="font-medium">{shareItem.title || (shareItem as any).name || "Untitled"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Share URL</div>
                <div className="flex items-center gap-2">
                  <Input readOnly value={`${window.location.origin}/blog/${(shareItem as any).id ?? (shareItem as any).blogId ?? (shareItem as any).uuid ?? ""}`} />
                  <Button type="button" variant="outline" onClick={() => {
                    const url = `${window.location.origin}/blog/${(shareItem as any).id ?? (shareItem as any).blogId ?? (shareItem as any).uuid ?? ""}`;
                    navigator.clipboard.writeText(url);
                    toast({ title: "Link copied" });
                  }}>Copy</Button>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Create Blog Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Blog</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="blog-title">Title</Label>
              <Input id="blog-title" value={newBlog.title} onChange={(e) => setNewBlog((s) => ({ ...s, title: e.target.value }))} placeholder="Enter title" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="blog-content">Content</Label>
              <Textarea id="blog-content" rows={6} value={newBlog.content} onChange={(e) => setNewBlog((s) => ({ ...s, content: e.target.value }))} placeholder="Write your content" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="blog-category">Category</Label>
              <Input id="blog-category" value={newBlog.category} onChange={(e) => setNewBlog((s) => ({ ...s, category: e.target.value }))} placeholder="e.g., TECHNOLOGY" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="blog-tags">Tags (comma separated)</Label>
              <Input id="blog-tags" value={newBlog.tags} onChange={(e) => setNewBlog((s) => ({ ...s, tags: e.target.value }))} placeholder="e.g., SpringBoot, Java, Backend" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="featured-image">Featured Image</Label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <Button variant="outline" type="button" onClick={() => createInputRef.current?.click()}>
                    <Upload className="w-4 h-4 mr-2" />Choose File
                  </Button>
                  <input ref={createInputRef} id="featured-image" type="file" className="sr-only" accept="image/*,application/pdf" onChange={handleCreateFile} />
                  <div className="text-sm text-muted-foreground truncate max-w-[260px]">{newBlog.featuredImage?.name || "No file selected"}</div>
                </div>

                <div className="w-full">
                  <Label htmlFor="featured-url" className="sr-only">Or paste image url</Label>
                  <Input id="featured-url" placeholder="Or paste image URL" value={newBlog.featuredUrl} onChange={(e) => { setNewBlog((s) => ({ ...s, featuredUrl: e.target.value })); setImagePreview(e.target.value || null); if (e.target.value) setNewBlog((s) => ({ ...s, featuredImage: null })); }} />
                </div>
              </div>

              {imagePreview ? (
                <img src={imagePreview} alt="preview" className="rounded border max-w-[240px] max-h-[160px] object-cover mt-2" />
              ) : null}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateBlog}><Save className="w-4 h-4 mr-2" />Create</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Blog Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Blog</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-blog-title">Title</Label>
              <Input id="edit-blog-title" value={editBlog.title} onChange={(e) => setEditBlog((s) => ({ ...s, title: e.target.value }))} placeholder="Enter title" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-blog-content">Content</Label>
              <Textarea id="edit-blog-content" rows={6} value={editBlog.content} onChange={(e) => setEditBlog((s) => ({ ...s, content: e.target.value }))} placeholder="Write your content" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-blog-category">Category</Label>
              <Input id="edit-blog-category" value={editBlog.category} onChange={(e) => setEditBlog((s) => ({ ...s, category: e.target.value }))} placeholder="e.g., TECHNOLOGY" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-blog-tags">Tags (comma separated)</Label>
              <Input id="edit-blog-tags" value={editBlog.tags} onChange={(e) => setEditBlog((s) => ({ ...s, tags: e.target.value }))} placeholder="e.g., SpringBoot, Java, Backend" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-featured-image">Featured Image</Label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <Button variant="outline" type="button" onClick={() => editInputRef.current?.click()}>
                    <Upload className="w-4 h-4 mr-2" />Choose File
                  </Button>
                  <input ref={editInputRef} id="edit-featured-image" type="file" className="sr-only" accept="image/*,application/pdf" onChange={handleEditFile} />
                  <div className="text-sm text-muted-foreground truncate max-w-[260px]">{editBlog.featuredImage?.name || "No file selected"}</div>
                </div>

                <div className="w-full">
                  <Label htmlFor="edit-featured-url" className="sr-only">Or paste image url</Label>
                  <Input id="edit-featured-url" placeholder="Or paste image URL" value={editBlog.featuredUrl} onChange={(e) => { setEditBlog((s) => ({ ...s, featuredUrl: e.target.value })); setEditImagePreview(e.target.value || null); if (e.target.value) setEditBlog((s) => ({ ...s, featuredImage: null })); }} />
                </div>
              </div>

              {editImagePreview ? (
                <img src={editImagePreview} alt="preview" className="rounded border max-w-[240px] max-h-[160px] object-cover mt-2" />
              ) : null}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onClick={handleUpdateBlog}><Save className="w-4 h-4 mr-2" />Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmOpen} onOpenChange={(v) => { setConfirmOpen(v); if (!v) setDeleteId(null); }}>
        <AlertDialogContent className="sm:max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the selected blog.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={performDelete} disabled={deleting}>{deleting ? "Deleting..." : "Delete"}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </OptimizedDashboardLayout>
  );
}
