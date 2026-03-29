import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
type GalleryItem = { id: number; title: string; category: string; imageUrl: string; date: string };

const Gallery = () => {
  const [filter, setFilter] = useState("Semua");
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  useEffect(() => {
    fetch("/api/gallery?page=1&pageSize=200")
      .then((r) => r.json())
      .then((p) => {
        const list = Array.isArray(p) ? p : p?.data;
        if (!Array.isArray(list)) return;
        setGallery(
          list.map((g: unknown) => {
            const item = g as { id: number; title?: string; category?: string | null; imageUrl?: string | null; date?: string | null };
            return {
              id: item.id,
              title: item.title ?? "",
              category: item.category ?? "",
              imageUrl: item.imageUrl ?? "https://via.placeholder.com/800x600",
              date: item.date?.slice?.(0, 10) ?? "",
            };
          })
        );
      })
      .catch(() => {});
  }, []);

  const categories = useMemo(() => ["Semua", ...new Set(gallery.map((g) => g.category).filter(Boolean))], [gallery]);
  const filtered = useMemo(() => (filter === "Semua" ? gallery : gallery.filter((g) => g.category === filter)), [gallery, filter]);

  return (
    <>
      <section className="py-16 lg:py-24 bg-surface-sunken">
        <div className="section-container">
          <SectionHeading
            badge="Galeri"
            title="Galeri Kegiatan"
            description="Dokumentasi foto dari berbagai kegiatan PMII Komisariat STAIM Kendal."
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

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group relative"
                onClick={() => setSelected(item)}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors flex items-end p-3 sm:p-4">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-sm font-medium text-primary-foreground">{item.title}</p>
                    <p className="text-xs text-primary-foreground/70">{item.date}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute -top-12 right-0 text-primary-foreground hover:text-accent transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
              <img
                src={selected.imageUrl}
                alt={selected.title}
                className="w-full rounded-xl"
              />
              <div className="mt-3">
                <p className="text-sm font-medium text-primary-foreground">{selected.title}</p>
                <p className="text-xs text-primary-foreground/70">{selected.category} · {selected.date}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Gallery;
