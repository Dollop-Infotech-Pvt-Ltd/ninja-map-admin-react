import { useEffect, useMemo, useState } from "react";
import { OptimizedDashboardLayout } from "@/components/optimized-dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import api from "@/lib/http";
import { useToast } from "@/hooks/use-toast";
import { Search, Trash2, MoreHorizontal, AlertTriangle, Mail, User, MessageSquare, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface QueryItem {
  id: string;
  fullName: string;
  emailAddress: string;
  inquiryType: string;
  subject: string;
  message: string;
  [key: string]: any;
}

export default function Queries() {
  const [items, setItems] = useState<QueryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<QueryItem | null>(null);
  const [open, setOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<string | null>(null);
  const [deletingQuery, setDeletingQuery] = useState<QueryItem | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const fetchPage = async (page = pageNumber, size = pageSize) => {
    setLoading(true);
    try {
      const params: Record<string, any> = { pageSize: size, pageNumber: page };
      if (query && query.trim()) params.search = query.trim();
      const res = await api.get<any>("/api/contact-us/get-all", { query: params });
      const data = res?.data ?? res;
      const list = Array.isArray(data)
        ? data
        : Array.isArray((data as any)?.content)
        ? (data as any).content
        : Array.isArray((data as any)?.items)
        ? (data as any).items
        : (data?.content as any[]) || [];
      const t = (data?.totalElements ?? data?.total ?? data?.totalItems ?? data?.count ?? null) as number | null;
      setTotal(typeof t === "number" ? t : null);
      setItems(Array.isArray(list) ? list : []);
    } catch (e: any) {
      toast({ title: "Failed to load queries", description: e?.message || "Please try again.", variant: "destructive" });
      setItems([]);
      setTotal(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => fetchPage(0, pageSize), 200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, pageSize]);

  useEffect(() => {
    fetchPage(pageNumber, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber]);

  const hasPrev = pageNumber > 0;
  const hasKnownTotal = typeof total === "number" && total >= 0;
  const totalPages = hasKnownTotal ? Math.max(1, Math.ceil((total ?? 0) / pageSize)) : null;
  const hasNext = hasKnownTotal ? pageNumber + 1 < (totalPages as number) : items.length === pageSize;

  const countLabel = useMemo(() => (hasKnownTotal ? total : items.length), [hasKnownTotal, total, items.length]);

  const handleDelete = (query: QueryItem) => {
    if (!query?.id) return;
    setDeletingQuery(query);
    setToDeleteId(query.id);
    setConfirmOpen(true);
  };

  const performDelete = async () => {
    const id = toDeleteId;
    if (!id) return;
    
    setIsDeleting(true);
    try {
      await api.delete(`/api/contact-us/delete?id=${encodeURIComponent(id)}`);
      setItems((prev) => prev.filter((it) => it.id !== id));
      setTotal((t) => (typeof t === 'number' ? Math.max(0, (t || 1) - 1) : t));
      
      setConfirmOpen(false);
      setDeletingQuery(null);
      setToDeleteId(null);
      
      toast({ 
        title: 'Query Deleted', 
        description: 'The query has been successfully deleted.' 
      });
      
      if (selected?.id === id) { 
        setOpen(false); 
        setSelected(null); 
      }
    } catch (e: any) {
      toast({ 
        title: 'Delete Failed', 
        description: e?.message || 'Unable to delete query', 
        variant: 'destructive' 
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <OptimizedDashboardLayout title="Queries">
      <div className="space-y-6">
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Queries</CardTitle>
                <CardDescription>Incoming contact inquiries</CardDescription>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
              <div className="relative w-full lg:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input value={query} onChange={(e) => { setQuery(e.target.value); setPageNumber(0); }} placeholder="Search by name, email or subject..." className="pl-9" />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-sm text-muted-foreground mb-3">All Queries ({countLabel})</div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="hidden sm:table-cell">Subject</TableHead>
                    <TableHead className="hidden lg:table-cell">Message</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={6}>Loading...</TableCell></TableRow>
                  ) : items.length === 0 ? (
                    <TableRow><TableCell colSpan={6}>No queries found.</TableCell></TableRow>
                  ) : (
                    items.map((q, idx) => (
                      <TableRow key={q.id || idx}>
                        <TableCell className="font-medium">{q.fullName}</TableCell>
                        <TableCell className="hidden md:table-cell">{q.emailAddress}</TableCell>
                        <TableCell>{q.inquiryType}</TableCell>
                        <TableCell className="hidden sm:table-cell">{q.subject}</TableCell>
                        <TableCell className="hidden lg:table-cell truncate max-w-[300px]">{q.message}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" aria-label="actions">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => { setSelected(q); setOpen(true); }}>
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(q)} className="text-red-600 focus:text-red-600">
                                  <Trash2 className="w-3.5 h-3.5 mr-2 inline" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">Page {pageNumber + 1}{totalPages ? ` of ${totalPages}` : ""}</div>
              <div className="flex gap-2">
                <Button variant="outline" disabled={!hasPrev} onClick={() => setPageNumber((p) => Math.max(0, p - 1))}>Previous</Button>
                <Button variant="outline" disabled={!hasNext} onClick={() => setPageNumber((p) => p + 1)}>Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setSelected(null); }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Query details</DialogTitle>
          </DialogHeader>
          {selected ? (
            <div className="space-y-3">
              <div><strong>Name:</strong> {selected.fullName}</div>
              <div><strong>Email:</strong> {selected.emailAddress}</div>
              <div><strong>Type:</strong> {selected.inquiryType}</div>
              <div><strong>Subject:</strong> {selected.subject}</div>
              <div><strong>Message:</strong><p className="whitespace-pre-wrap mt-2">{selected.message}</p></div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={confirmOpen} onOpenChange={(v) => { 
        if (!isDeleting) {
          setConfirmOpen(v); 
          if (!v) {
            setToDeleteId(null);
            setDeletingQuery(null);
          }
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Delete Query
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this query? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {deletingQuery && (
            <div className="space-y-4 py-4">
              <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <div className="flex items-start gap-2">
                  <User className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{deletingQuery.fullName}</p>
                    <p className="text-xs text-muted-foreground">{deletingQuery.emailAddress}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Subject</p>
                    <p className="text-sm font-medium text-foreground">{deletingQuery.subject}</p>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Badge variant="secondary" className="text-xs">
                    {deletingQuery.inquiryType}
                  </Badge>
                </div>
                
                <div className="text-xs text-muted-foreground pt-2 font-mono bg-background/50 p-2 rounded">
                  ID: {deletingQuery.id}
                </div>
              </div>
              
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 p-3 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-200">
                  <strong>Warning:</strong> This query will be permanently deleted from the system.
                </p>
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => {
                setConfirmOpen(false);
                setDeletingQuery(null);
                setToDeleteId(null);
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={performDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Query
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </OptimizedDashboardLayout>
  );
}
