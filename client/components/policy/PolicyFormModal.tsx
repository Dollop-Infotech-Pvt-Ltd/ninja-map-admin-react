import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/http";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

export type PolicyType = "PRIVACY_POLICY" | "TERMS_AND_CONDITIONS" | "FAQ" | string;

export interface PolicyFormModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defaultType?: PolicyType;
  onCreated?: (policy: any) => void;
  mode?: "create" | "edit";
  policy?: any;
  onUpdated?: (policy: any) => void;
  dialogTitleOverride?: string;
}

export default function PolicyFormModal({ open, onOpenChange, defaultType = "PRIVACY_POLICY", onCreated, mode = "create", policy, onUpdated, dialogTitleOverride }: PolicyFormModalProps) {
  const { toast } = useToast();
  const [type, setType] = useState<PolicyType>(defaultType);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (open && mode === "edit" && policy) {
      setTitle(policy.title || "");
      setDescription(policy.description || "");
      const t = policy.documentType || policy.type || defaultType;
      setType(t as PolicyType);
      setExistingImageUrl(policy.documentimage || policy.image || policy.imageUrl || policy.documentImageUrl || null);
    }
    if (open && mode === "create") {
      setTitle("");
      setDescription("");
      setType(defaultType);
      setFile(null);
      setExistingImageUrl(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, mode, policy]);

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

  const reset = () => {
    setTitle("");
    setDescription("");
    setFile(null);
  };

  const handleCreate = async () => {
    if (!title || !description || !file) {
      toast({ title: "Missing fields", description: "Please provide title, description and document.", variant: "destructive" });
      return;
    }

    const form = new FormData();
    const effectiveType = type || "PRIVACY_POLICY";
    form.append("documentType", effectiveType);
    form.append("type", effectiveType);
    form.append("title", title);
    form.append("description", description);
    form.append("image", file);
    form.append("documentimage", file);
    form.append("documentImage", file);
    form.append("file", file);

    setLoading(true);
    try {
      const res = await api.post<any>("/api/policies/create", { body: form });
      toast({ title: "Policy created", description: `${title} has been created.` });
      onCreated?.(res as any);
      reset();
      onOpenChange(false);
    } catch (e: any) {
      toast({ title: "Create failed", description: e?.message || "Unable to create policy", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    const id = policy?.id || policy?._id || policy?.policyId || policy?.uuid;
    if (!id) {
      toast({ title: "Update failed", description: "Missing policy id", variant: "destructive" });
      return;
    }
    if (!title || !description) {
      toast({ title: "Missing fields", description: "Please provide title and description.", variant: "destructive" });
      return;
    }

    const form = new FormData();
    const effectiveType = (type || policy?.type || policy?.documentType || "PRIVACY_POLICY") as string;
    form.append("id", String(id));
    form.append("documentType", effectiveType);
    form.append("type", effectiveType);
    form.append("title", title);
    form.append("description", description);
    if (file) {
      form.append("image", file);
      form.append("documentimage", file);
      form.append("documentImage", file);
      form.append("file", file);
    }

    setLoading(true);
    try {
      let res: any | null = null;
      try {
        res = await api.put<any>(`/api/policies/update`, { body: form });
      } catch {
        try {
          res = await api.put<any>(`/api/policies/${id}`, { body: form });
        } catch {
          try {
            res = await api.post<any>(`/api/policies/update/${id}`, { body: form });
          } catch {
            res = await api.post<any>(`/api/policies/update`, { body: form });
          }
        }
      }
      toast({ title: "Policy updated", description: `${title} has been updated.` });
      onUpdated?.(res as any);
      onOpenChange(false);
    } catch (e: any) {
      toast({ title: "Update failed", description: e?.message || "Unable to update policy", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (mode === "edit") return handleEdit();
    return handleCreate();
  };

  const hasFile = !!(policy?.documentimage || policy?.image || policy?.imageUrl || policy?.documentImageUrl);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{dialogTitleOverride ?? (mode === "edit" ? "Update Policy" : "Add Policy")}</DialogTitle>
          <DialogDescription>
            {mode === "edit" ? "Modify the policy details below." : "Fill the details below to create a new policy."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="space-y-2">
            <Label>Type</Label>
            <Input value={(type || "PRIVACY_POLICY").replace(/_/g, " ")} disabled readOnly />
          </div>

          <div className="space-y-2">
            <Label htmlFor="policy-title">Title</Label>
            <Input id="policy-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter title" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="policy-description">Description</Label>
            <Textarea id="policy-description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Write a clear summary" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="policy-file">Document Image {mode === "edit" && hasFile ? "(optional)" : ""}</Label>
            <div className="flex items-center gap-3">
              <Button variant="outline" type="button" onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                {mode === "edit" ? "Change File" : "Choose File"}
              </Button>
              <input
                ref={fileInputRef}
                id="policy-file"
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
