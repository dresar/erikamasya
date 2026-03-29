import { Plus, Edit, Trash2, Calendar, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

const AdminActivities = () => {
  const [activities, setActivities] = useState<
    Array<{ id: number; title: string; description: string; date: string; image: string; status: string; location: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/activities')
      .then(res => res.json())
      .then(payload => {
        const data = Array.isArray(payload) ? payload : payload?.data;
        if (Array.isArray(data) && data.length > 0) {
          // map to existing format
          setActivities(
            data.map((d: unknown) => {
              const item = d as {
                id: number;
                title?: string;
                description?: string | null;
                date?: string | null;
                imageUrl?: string | null;
                status?: string | null;
                location?: string | null;
              };

              return {
                id: item.id,
                title: item.title ?? "",
                description: item.description ?? "",
                date: item.date ?? "",
                image: item.imageUrl ?? "https://via.placeholder.com/150",
                status: item.status ?? "",
                location: item.location ?? "",
              };
            })
          );
        }
      })
      .catch(err => console.error("API error, fallback to static", err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Manajemen Kegiatan</h1>
          <p className="text-sm text-muted-foreground">{activities.length} kegiatan</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Tambah Kegiatan
        </button>
      </div>

      <div className="space-y-3">
        {activities.map((a) => (
          <div key={a.id} className="glass-card p-4 sm:p-5 flex items-start gap-4">
            <img src={a.image} alt={a.title} className="h-16 w-24 rounded-lg object-cover flex-shrink-0 hidden sm:block" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-foreground text-sm truncate">{a.title}</h4>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                  a.status === "Selesai" ? "bg-muted text-muted-foreground" :
                  a.status === "Berlangsung" ? "bg-accent/20 text-accent-foreground" :
                  "bg-primary/10 text-primary"
                }`}>{a.status}</span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1">{a.description}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {a.date}</span>
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {a.location}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted transition-colors">
                <Edit className="h-3.5 w-3.5" />
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

export default AdminActivities;
