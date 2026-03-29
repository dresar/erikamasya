import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Users, Calendar, BookOpen } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { useEffect, useState } from "react";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6 },
};

const Index = () => {
  const [recentArticles, setRecentArticles] = useState<
    Array<{ id: number; slug: string; title: string; excerpt: string; category: string; readTime: string; thumbnailUrl: string | null }>
  >([]);
  const [recentActivities, setRecentActivities] = useState<
    Array<{ id: number; title: string; description: string; category: string; date: string; imageUrl: string | null }>
  >([]);
  const [stats, setStats] = useState<{
    anggotaAktif: number;
    totalKegiatan: number;
    totalArtikel: number;
    totalAlumni: number;
  } | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => r.json())
      .then((d) => {
        if (!d) return;
        setStats({
          anggotaAktif: Number(d.anggotaAktif ?? 0),
          totalKegiatan: Number(d.totalKegiatan ?? 0),
          totalArtikel: Number(d.totalArtikel ?? 0),
          totalAlumni: Number(d.totalAlumni ?? 0),
        });
      })
      .catch(() => {});

    fetch("/api/activities?page=1&pageSize=3")
      .then((r) => r.json())
      .then((p) => {
        const list = Array.isArray(p) ? p : p?.data;
        if (!Array.isArray(list)) return;
        setRecentActivities(
          list.map((a: unknown) => {
            const item = a as {
              id: number;
              title?: string;
              description?: string | null;
              category?: string | null;
              date?: string | null;
              imageUrl?: string | null;
            };
            return {
              id: item.id,
              title: item.title ?? "",
              description: item.description ?? "",
              category: item.category ?? "",
              date: item.date?.slice?.(0, 10) ?? "",
              imageUrl: item.imageUrl ?? null,
            };
          })
        );
      })
      .catch(() => {});

    fetch("/api/articles?page=1&pageSize=3")
      .then((r) => r.json())
      .then((p) => {
        const list = Array.isArray(p) ? p : p?.data;
        if (!Array.isArray(list)) return;
        setRecentArticles(
          list.map((a: unknown) => {
            const item = a as {
              id: number;
              slug?: string;
              title?: string;
              excerpt?: string | null;
              category?: string | null;
              readTime?: string | null;
              thumbnailUrl?: string | null;
            };
            return {
              id: item.id,
              slug: item.slug ?? "",
              title: item.title ?? "",
              excerpt: item.excerpt ?? "",
              category: item.category ?? "",
              readTime: item.readTime ?? "",
              thumbnailUrl: item.thumbnailUrl ?? null,
            };
          })
        );
      })
      .catch(() => {});
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="section-container relative py-20 sm:py-28 lg:py-36">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 tracking-wide">
              PMII Komisariat STAIM Kendal
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-[1.1] text-balance">
              Mencetak Kader Bangsa{" "}
              <span className="text-primary">Berkarakter</span> dan{" "}
              <span className="text-accent">Berintelektual</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
              Bersama PMII, kita bangun generasi muda yang berakhlak mulia, berwawasan luas, 
              dan siap berkontribusi untuk kemajuan bangsa dan negara.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/tentang-kami"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Tentang Kami
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/kontak"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border bg-card text-foreground text-sm font-semibold hover:bg-muted transition-colors"
              >
                Bergabung Sekarang
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {[
              { icon: Users, value: stats ? String(stats.anggotaAktif) : "-", label: "Anggota Aktif" },
              { icon: Calendar, value: stats ? String(stats.totalKegiatan) : "-", label: "Kegiatan" },
              { icon: BookOpen, value: stats ? String(stats.totalArtikel) : "-", label: "Artikel" },
              { icon: Users, value: stats ? String(stats.totalAlumni) : "-", label: "Alumni" },
            ].map((stat, i) => (
              <div
                key={i}
                className="glass-card p-4 sm:p-5 text-center hover-lift"
              >
                <stat.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Brief */}
      <section className="py-16 lg:py-24 bg-surface-sunken">
        <div className="section-container">
          <SectionHeading
            badge="Tentang Kami"
            title="Organisasi Pergerakan Mahasiswa Islam"
            description="PMII Komisariat STAIM Kendal adalah wadah bagi mahasiswa untuk mengembangkan potensi diri, memperdalam ilmu agama, dan berkontribusi bagi masyarakat melalui nilai-nilai Ahlussunnah wal Jamaah."
          />
          <motion.div {...fadeUp} className="grid sm:grid-cols-3 gap-6">
            {[
              { title: "Tawasuth", desc: "Mengambil jalan tengah, tidak ekstrem kanan maupun kiri dalam bersikap." },
              { title: "Tawazun", desc: "Menjaga keseimbangan dalam segala aspek kehidupan, dunia dan akhirat." },
              { title: "Tasamuh", desc: "Menghargai perbedaan dan menjunjung tinggi toleransi antar sesama." },
            ].map((v, i) => (
              <div key={i} className="glass-card p-6 hover-lift">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-primary font-bold text-sm">{i + 1}</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Kegiatan Terbaru */}
      <section className="py-16 lg:py-24">
        <div className="section-container">
          <SectionHeading
            badge="Kegiatan"
            title="Kegiatan Terbaru"
            description="Berbagai program dan kegiatan yang diselenggarakan untuk pengembangan kader."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentActivities.map((activity, i) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
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
                    <span className="text-[11px] text-muted-foreground">{activity.date}</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{activity.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{activity.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/kegiatan"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Lihat Semua Kegiatan <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="py-16 lg:py-24 bg-surface-sunken">
        <div className="section-container">
          <SectionHeading
            badge="Blog"
            title="Artikel Terbaru"
            description="Tulisan dan opini dari kader PMII seputar isu keislaman, kebangsaan, dan kemahasiswaan."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentArticles.map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Link to={`/blog/${article.slug}`} className="glass-card overflow-hidden hover-lift group block">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={article.thumbnailUrl ?? "https://via.placeholder.com/800x450"}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-accent/20 text-accent-foreground">
                        {article.category}
                      </span>
                      <span className="text-[11px] text-muted-foreground">{article.readTime}</span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Baca Semua Artikel <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24">
        <div className="section-container">
          <motion.div
            {...fadeUp}
            className="relative overflow-hidden rounded-2xl gradient-primary p-8 sm:p-12 lg:p-16 text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-accent/10 to-primary/0" />
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-foreground mb-4 text-balance">
                Bergabung Bersama Kami
              </h2>
              <p className="text-primary-foreground/80 max-w-lg mx-auto mb-8 text-sm sm:text-base">
                Jadilah bagian dari pergerakan mahasiswa Islam terbesar di Indonesia. 
                Kembangkan potensimu dan berkontribusi untuk bangsa.
              </p>
              <Link
                to="/kontak"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-colors"
              >
                Daftar Sekarang
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Index;
