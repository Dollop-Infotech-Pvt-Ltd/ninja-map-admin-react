import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface PolicyItem {
  id?: string | number;
  type?: string;
  documentType?: string;
  title?: string;
  description?: string;
  documentimage?: string;
  documentImageUrl?: string;
  imageUrl?: string;
  image?: string;
}

export default function PolicyList({ items }: { items: PolicyItem[] }) {
  if (!items?.length) {
    return <div className="text-sm text-muted-foreground">No policies found.</div>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p, idx) => {
        const img = p.documentimage || p.documentImageUrl || p.imageUrl || p.image;
        const typeLabel = p.type || p.documentType;
        return (
          <Card key={p.id ?? idx} className="border border-border/60">
            {img ? (
              <img src={img} alt={p.title || "policy"} className="w-full h-32 object-cover rounded-t-md" />
            ) : null}
            <CardHeader className="py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base line-clamp-1">{p.title}</CardTitle>
                {typeLabel ? <Badge variant="secondary" className="ml-2">{typeLabel}</Badge> : null}
              </div>
              {p.description ? (
                <CardDescription className="line-clamp-2">{p.description}</CardDescription>
              ) : null}
            </CardHeader>
            <CardContent className="pt-0"></CardContent>
          </Card>
        );
      })}
    </div>
  );
}
