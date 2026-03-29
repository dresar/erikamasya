import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

const AdminGallery = () => {
  const [gallery, setGallery] = useState<Array<{ id: number; title: string; category: string; image: string; date: string }>>([]);

  useEffect(() => {
    fetch("/api/gallery?page=1&pageSize=50")
      .then((r) => r.json())
      .then((payload) => {
        const list = Array.isArray(payload) ? payload : payload?.data;
        if (!Array.isArray(list)) return;
        setGallery(
          list.map((g: unknown) => {
            const item = g as {
              id: number;
              title?: string;
              category?: string | null;
              imageUrl?: string | null;
              image?: string | null;
              date?: string | null;
            };

            return {
              id: item.id,
              title: item.title ?? "",
              category: item.category ?? "",
              image: item.imageUrl ?? item.image ?? "https://via.placeholder.com/800x600",
              date: item.date?.slice?.(0, 10) ?? item.date ?? "",
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
          <h1 className="text-2xl font-bold text-foreground mb-1">Manajemen Galeri</h1>
          <p className="text-sm text-muted-foreground">{gallery.length} foto</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Upload Foto
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {gallery.map((item) => (
          <div key={item.id} className="glass-card overflow-hidden group relative">
            <div className="aspect-square overflow-hidden">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-3">
              <p className="text-xs font-medium text-foreground truncate">{item.title}</p>
              <p className="text-[10px] text-muted-foreground">{item.category}</p>
            </div>
            <button className="absolute top-2 right-2 h-7 w-7 rounded-lg bg-card/90 flex items-center justify-center text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminGallery;
