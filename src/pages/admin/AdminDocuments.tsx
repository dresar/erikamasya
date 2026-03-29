import { FileText, Download, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

const AdminDocuments = () => {
  const [documents, setDocuments] = useState<
    Array<{ id: number; title: string; category: string; fileSize: string; fileType: string; date: string; fileUrl: string }>
  >([]);

  useEffect(() => {
    fetch("/api/documents?page=1&pageSize=50")
      .then((r) => r.json())
      .then((payload) => {
        const list = Array.isArray(payload) ? payload : payload?.data;
        if (!Array.isArray(list)) return;
        setDocuments(
          list.map((d: unknown) => {
            const item = d as {
              id: number;
              title?: string;
              category?: string | null;
              fileSize?: string | null;
              fileType?: string | null;
              publishedAt?: string | null;
              date?: string | null;
              fileUrl?: string | null;
            };

            return {
              id: item.id,
              title: item.title ?? "",
              category: item.category ?? "",
              fileSize: item.fileSize ?? "",
              fileType: item.fileType ?? "",
              date: item.publishedAt?.slice?.(0, 10) ?? item.date ?? "",
              fileUrl: item.fileUrl ?? "",
            };
          })
        );
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Manajemen Dokumen</h1>
          <p className="text-sm text-muted-foreground">{documents.length} dokumen</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Upload Dokumen
        </button>
      </div>

      <div className="space-y-3">
        {documents.map((doc) => (
          <div key={doc.id} className="glass-card p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground text-sm truncate">{doc.title}</h4>
              <p className="text-xs text-muted-foreground">{doc.fileType} · {doc.fileSize} · {doc.date}</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted transition-colors">
                <Download className="h-3.5 w-3.5" />
              </button>
              <button className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDocuments;
