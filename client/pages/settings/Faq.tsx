import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Eye, Pencil, Trash, MoreHorizontal, List } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/http";
import FaqFormModal from "@/components/faq/FaqFormModal";

export interface FaqItem {
  id?: string;
  category?: string;
  categoryImageUrl?: string;
  questions?: { question: string; answer: string }[];
  title?: string;
  description?: string;
}

export default function FAQ() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<FaqItem[]>([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState("");
  const [total, setTotal] = useState<number | null>(null);

  const [imageOpen, setImageOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<FaqItem | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { toast } = useToast();

  const hasPrev = pageNumber > 0;
  const hasKnownTotal = typeof total === "number" && total >= 0;
  const totalPages = hasKnownTotal ? Math.max(1, Math.ceil((total ?? 0) / pageSize)) : null;
  const hasNext = hasKnownTotal ? pageNumber + 1 < (totalPages as number) : items.length === pageSize;

  const fetchPage = async (page = pageNumber, size = pageSize, q = query) => {
    setLoading(true);
    try {
      const params: Record<string, any> = { pageSize: size, pageNumber: page };
      if (q && q.trim()) params.search = q.trim();
      const res = await api.get<any>("/api/faqs/get-all", { query: params });
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
      setItems(list as FaqItem[]);
    } catch {
      try {
        const res2 = await api.get<any>("/api/faqs", { query: {} });
        const list2 = (res2?.data ?? (res2 as any)?.items ?? res2) as any[];
        setItems(Array.isArray(list2) ? (list2 as FaqItem[]) : []);
        setTotal(null);
      } catch {
        setItems([]);
        setTotal(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => fetchPage(0, pageSize, query), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, pageSize]);

  useEffect(() => {
    fetchPage(pageNumber, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber]);

  const countLabel = useMemo(() => (hasKnownTotal ? total : items.length), [hasKnownTotal, total, items.length]);

  const getImg = (p: any) => p?.categoryImageUrl || p?.image || p?.imageUrl || p?.documentimage || p?.documentImageUrl || null;

  const onViewImage = (p: any) => {
    const url = getImg(p);
    if (url) {
      setImageUrl(url);
      setImageOpen(true);
    }
  };

  const onEdit = async (p: FaqItem) => {
    const id: any = (p as any).id || (p as any)._id || (p as any).faqId || (p as any).uuid;
    if (id) {
      try {
        const full = await api.get<any>("/api/faqs/get", { query: { id } });
        const data = (full as any)?.data ?? full;
        setSelected((data as any) || p);
      } catch {
        setSelected(p);
      }
    } else {
      setSelected(p);
    }
    setEditOpen(true);
  };

  const onDelete = (p: FaqItem) => {
    setSelected(p);
    setConfirmOpen(true);
  };

  const actuallyDelete = async () => {
    if (!selected) return;
    const id: any = (selected as any).id || (selected as any)._id || (selected as any).faqId || (selected as any).uuid;
    if (!id) { toast({ title: "Delete failed", description: "Missing faq id", variant: "destructive" }); return; }
    setDeleting(true);
    try {
      try {
        await api.delete(`/api/faqs/delete`, { query: { id } });
      } catch {
        await api.delete(`/api/faqs/delete/${id}`);
      }
      toast({ title: "FAQ deleted" });
      setConfirmOpen(false);
      setSelected(null);
      fetchPage(pageNumber, pageSize, query);
    } catch (e: any) {
      toast({ title: "Delete failed", description: e?.message || "Unable to delete faq", variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  };

  const questionsCount = (p: FaqItem) => Array.isArray(p?.questions) ? p.questions!.length : (p as any)?.questionList?.length || 0;
  const shortDesc = (p: FaqItem) => {
    const q = (p.questions && p.questions[0]) || (p as any)?.questionList?.[0];
    return q ? (q.question || q.q || "").slice(0, 120) : "—";
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>FAQs</CardTitle>
            <CardDescription>Manage Frequently Asked Questions.</CardDescription>
          </div>
          <Button onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add FAQ
          </Button>
        </div>
        <div className="flex gap-2 items-center">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPageNumber(0); }}
              placeholder="Search FAQs..."
              className="pl-9"
            />
          </div>
          <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPageNumber(0); }}>
            <SelectTrigger className="w-[110px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((n) => (
                <SelectItem key={n} value={String(n)}>{n} / page</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="text-sm text-muted-foreground mb-3">All FAQs ({countLabel})</div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="hidden md:table-cell">Sample Question</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead className="hidden sm:table-cell">Image</TableHead>
                <TableHead className="w-12 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5}>Loading...</TableCell></TableRow>
              ) : items.length === 0 ? (
                <TableRow><TableCell colSpan={5}>No FAQs found.</TableCell></TableRow>
              ) : (
                items.map((p, idx) => (
                  <TableRow key={(p as any).id ?? idx}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <List className="w-4 h-4 text-brand-600" />
                      {p.category || (p as any).title || "—"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground max-w-[420px] truncate">{shortDesc(p)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{questionsCount(p)} Qs</Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {getImg(p) ? (
                        <img
                          src={getImg(p) as string}
                          alt={(p as any).category || "faq"}
                          className="w-10 h-10 object-cover rounded"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-muted" />
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem disabled={!getImg(p)} onClick={() => onViewImage(p)}>
                            <Eye className="w-4 h-4 mr-2" /> View Image
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(p)}>
                            <Pencil className="w-4 h-4 mr-2" /> Update
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => onDelete(p)}>
                            <Trash className="w-4 h-4 mr-2" /> Delete
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

      <FaqFormModal
        open={open}
        onOpenChange={(v) => { setOpen(v); if (!v) fetchPage(pageNumber, pageSize, query); }}
        onCreated={() => fetchPage(pageNumber, pageSize, query)}
      />

      <FaqFormModal
        open={editOpen}
        onOpenChange={(v) => { setEditOpen(v); if (!v) { setSelected(null); fetchPage(pageNumber, pageSize, query); } }}
        mode="edit"
        item={selected as any}
        onUpdated={() => fetchPage(pageNumber, pageSize, query)}
      />

      <Dialog open={imageOpen} onOpenChange={setImageOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>FAQ Image</DialogTitle>
          </DialogHeader>
          {imageUrl ? (
            <img src={imageUrl} alt="faq" className="w-full max-h-[70vh] object-contain rounded" />
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete FAQ?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the selected faq.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={actuallyDelete} disabled={deleting}>{deleting ? "Deleting..." : "Delete"}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
