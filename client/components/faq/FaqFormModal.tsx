import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/http";
import { useToast } from "@/hooks/use-toast";
import { Upload, Plus, Trash2 } from "lucide-react";

interface QA { question: string; answer: string }
export interface FaqItem { id?: string; category?: string; categoryImageUrl?: string; questions?: QA[] }

interface FaqFormModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated?: (item: any) => void;
  onUpdated?: (item: any) => void;
  mode?: "create" | "edit";
  item?: FaqItem | any;
}

export default function FaqFormModal({ open, onOpenChange, onCreated, onUpdated, mode = "create", item }: FaqFormModalProps) {
  const { toast } = useToast();
  const [category, setCategory] = useState("");
  const [questions, setQuestions] = useState<QA[]>([{ question: "", answer: "" }]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (open && mode === "edit" && item) {
      setCategory(item.category || item.title || "");
      const qs = (item.questions || (item.questionList as QA[]) || []) as QA[];
      setQuestions(qs.length ? qs : [{ question: "", answer: "" }]);
      setExistingImageUrl(item.categoryImageUrl || null);
    }
    if (open && mode === "create") {
      setCategory("");
      setQuestions([{ question: "", answer: "" }]);
      setFile(null);
      setExistingImageUrl(null);
    }
  }, [open, mode, item]);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => {
      try { URL.revokeObjectURL(url); } catch {}
    };
  }, [file]);

  const handleCreate = async () => {
    if (!category || questions.some(q => !q.question || !q.answer) || !file) {
      toast({ title: "Missing fields", description: "Provide category, at least one Q&A, and image.", variant: "destructive" });
      return;
    }
    const form = new FormData();
    form.append("category", category);
    questions.forEach((qa, i) => {
      form.append(`questions[${i}].question`, qa.question);
      form.append(`questions[${i}].answer`, qa.answer);
    });
    form.append("categoryImageUrl", file);

    setLoading(true);
    try {
      const res = await api.post<any>("/api/faqs/create", { body: form });
      toast({ title: "FAQ created", description: `${category} has been created.` });
      onCreated?.(res as any);
      onOpenChange(false);
    } catch (e: any) {
      toast({ title: "Create failed", description: e?.message || "Unable to create FAQ", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    const id = item?.id || item?._id || item?.faqId || item?.uuid;
    if (!id) { toast({ title: "Update failed", description: "Missing FAQ id", variant: "destructive" }); return; }
    if (!category || questions.some(q => !q.question || !q.answer)) {
      toast({ title: "Missing fields", description: "Provide category and all Q&A fields.", variant: "destructive" });
      return;
    }
    const form = new FormData();
    form.append("id", String(id));
    form.append("category", category);
    questions.forEach((qa, i) => {
      form.append(`questions[${i}].question`, qa.question);
      form.append(`questions[${i}].answer`, qa.answer);
    });
    if (file) form.append("categoryImageUrl", file);

    setLoading(true);
    try {
      let res: any | null = null;
      try {
        res = await api.put<any>(`/api/faqs/update`, { body: form, query: { id } });
      } catch {
        try { res = await api.put<any>(`/api/faqs/update`, { body: form }); }
        catch { try { res = await api.put<any>(`/api/faqs/${id}`, { body: form }); }
        catch { try { res = await api.post<any>(`/api/faqs/update/${id}`, { body: form }); }
        catch { res = await api.post<any>(`/api/faqs/update`, { body: form }); }}}
      }
      toast({ title: "FAQ updated", description: `${category} has been updated.` });
      onUpdated?.(res as any);
      onOpenChange(false);
    } catch (e: any) {
      toast({ title: "Update failed", description: e?.message || "Unable to update FAQ", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (mode === "edit") return handleEdit();
    return handleCreate();
  };

  const updateQA = (i: number, field: keyof QA, value: string) => {
    const next = [...questions];
    next[i] = { ...next[i], [field]: value } as QA;
    setQuestions(next);
  };

  const addQA = () => setQuestions((prev) => [...prev, { question: "", answer: "" }]);
  const removeQA = (i: number) => setQuestions((prev) => prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev);

  const hasFile = !!(item?.categoryImageUrl);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[calc(100vh-4rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Update FAQ" : "Add FAQ"}</DialogTitle>
          <DialogDescription>
            {mode === "edit" ? "Modify the FAQ details below." : "Fill the details below to create a new FAQ."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="faq-category">Category</Label>
            <Input id="faq-category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g., App Usage" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Questions</Label>
              <Button type="button" variant="outline" size="sm" onClick={addQA}><Plus className="w-3.5 h-3.5 mr-1"/>Add</Button>
            </div>
            {questions.map((qa, i) => (
              <div key={i} className="grid gap-2 p-3 rounded-lg border">
                <div className="space-y-1">
                  <Label htmlFor={`q-${i}`}>Question</Label>
                  <Input id={`q-${i}`} value={qa.question} onChange={(e) => updateQA(i, "question", e.target.value)} placeholder="Enter question" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`a-${i}`}>Answer</Label>
                  <Textarea id={`a-${i}`} rows={3} value={qa.answer} onChange={(e) => updateQA(i, "answer", e.target.value)} placeholder="Enter answer" />
                </div>
                <div className="flex justify-end">
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeQA(i)} disabled={questions.length <= 1}>
                    <Trash2 className="w-4 h-4 mr-1"/>Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="faq-file">Category Image {mode === "edit" && hasFile ? "(optional)" : ""}</Label>
            <div className="flex items-center gap-3">
              <Button variant="outline" type="button" onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                {mode === "edit" ? "Change File" : "Choose File"}
              </Button>
              <input
                ref={fileInputRef}
                id="faq-file"
                type="file"
                className="sr-only"
                accept="image/*,application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              <div className="text-sm text-muted-foreground truncate max-w-[260px]">{file?.name || (hasFile ? "Current file attached" : "No file selected")}</div>
            </div>

            {/* Preview */}
            <div className="mt-2">
              {file ? (
                // If selected file is an image show inline preview, otherwise provide link to open
                (file.type && file.type.startsWith("image/")) ? (
                  previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="rounded border max-w-[200px] max-h-[120px] object-cover" />
                  ) : null
                ) : (
                  previewUrl ? (
                    <a href={previewUrl} target="_blank" rel="noreferrer" className="text-sm underline">Open file</a>
                  ) : null
                )
              ) : existingImageUrl ? (
                // If existingImageUrl looks like an image show it, otherwise provide link
                (/^data:image\//.test(existingImageUrl) || /\.(jpe?g|png|gif|webp|svg|bmp|tiff)(\?.*)?$/i.test(existingImageUrl)) ? (
                  <img src={existingImageUrl} alt="Current" className="rounded border max-w-[200px] max-h-[120px] object-cover" />
                ) : (
                  <a href={existingImageUrl} target="_blank" rel="noreferrer" className="text-sm underline">Open file</a>
                )
              ) : null}

              {file && (
                <div className="mt-2">
                  <Button variant="ghost" size="sm" onClick={() => setFile(null)}>Remove</Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading} className="min-w-[120px]">{loading ? "Saving..." : mode === "edit" ? "Update" : "Create"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
