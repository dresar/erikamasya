import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import { MapPin, Calendar } from "lucide-react";

const Activities = () => {
  const [filter, setFilter] = useState("Semua");
  const [activities, setActivities] = useState<
    Array<{ id: number; title: string; description: string; date: string; location: string; category: string; status: string; imageUrl: string | null }>
  >([]);

  useEffect(() => {
    fetch("/api/activities?page=1&pageSize=100")
      .then((r) => r.json())
      .then((p) => {
        const list = Array.isArray(p) ? p : p?.data;
        if (!Array.isArray(list)) return;
        setActivities(
          list.map((a: unknown) => {
            const item = a as {
              id: number;
              title?: string;
              description?: string | null;
              date?: string | null;
              location?: string | null;
              category?: string | null;
              status?: string | null;
              imageUrl?: string | null;
            };
            return {
              id: item.id,
              title: item.title ?? "",
              description: item.description ?? "",
              date: item.date?.slice?.(0, 10) ?? "",
              location: item.location ?? "",
              category: item.category ?? "",
              status: item.status ?? "",
              imageUrl: item.imageUrl ?? null,
            };
          })
        );
      })
      .catch(() => {});
  }, []);

  const categories = useMemo(() => ["Semua", ...new Set(activities.map((a) => a.category).filter(Boolean))], [activities]);
  const filtered = useMemo(() => (filter === "Semua" ? activities : activities.filter((a) => a.category === filter)), [activities, filter]);

  return (
    <>
      <section className="py-16 lg:py-24 bg-surface-sunken">
        <div className="section-container">
          <SectionHeading
            badge="Kegiatan"
            title="Program & Kegiatan"
            description="Berbagai program dan kegiatan yang diselenggarakan PMII Komisariat STAIM Kendal."
          />
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="section-container">
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((activity, i) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="glass-card overflow-hidden hover-lift group"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={activity.imageUrl ?? "https://via.placeholder.com/800x450"}
                    alt={activity.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {activity.category}
                    </span>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                      activity.status === "Selesai" ? "bg-muted text-muted-foreground" :
                      activity.status === "Berlangsung" ? "bg-accent/20 text-accent-foreground" :
                      "bg-primary/10 text-primary"
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{activity.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{activity.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {activity.date}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {activity.location}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Activities;
