import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import { useEffect, useMemo, useState } from "react";

const Blog = () => {
  const [articles, setArticles] = useState<
    Array<{
      id: number;
      slug: string;
      title: string;
      excerpt: string;
      category: string;
      readTime: string;
      authorName: string;
      publishedAt: string;
      thumbnailUrl: string | null;
    }>
  >([]);

  useEffect(() => {
    fetch("/api/articles?page=1&pageSize=100")
      .then((r) => r.json())
      .then((p) => {
        const list = Array.isArray(p) ? p : p?.data;
        if (!Array.isArray(list)) return;
        setArticles(
          list.map((a: unknown) => {
            const item = a as {
              id: number;
              slug?: string;
              title?: string;
              excerpt?: string | null;
              category?: string | null;
              readTime?: string | null;
              authorName?: string | null;
              publishedAt?: string | null;
              thumbnailUrl?: string | null;
            };
            return {
              id: item.id,
              slug: item.slug ?? "",
              title: item.title ?? "",
              excerpt: item.excerpt ?? "",
              category: item.category ?? "",
              readTime: item.readTime ?? "",
              authorName: item.authorName ?? "",
              publishedAt: item.publishedAt?.slice?.(0, 10) ?? "",
              thumbnailUrl: item.thumbnailUrl ?? null,
            };
          })
        );
      })
      .catch(() => {});
  }, []);

  const featured = useMemo(() => articles[0] ?? null, [articles]);
  const rest = useMemo(() => articles.slice(1), [articles]);

  return (
    <>
      <section className="py-16 lg:py-24 bg-surface-sunken">
        <div className="section-container">
          <SectionHeading
            badge="Blog"
            title="Artikel & Opini"
            description="Tulisan dari kader PMII seputar isu keislaman, kebangsaan, dan kemahasiswaan."
          />
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="section-container">
          {/* Featured */}
          {featured && (
            <Link to={`/blog/${featured.slug}`} className="block mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="glass-card overflow-hidden hover-lift group grid md:grid-cols-2 gap-0"
              >
                <div className="aspect-video md:aspect-auto overflow-hidden">
                  <img
                    src={featured.thumbnailUrl ?? "https://via.placeholder.com/800x450"}
                    alt={featured.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 sm:p-8 flex flex-col justify-center">
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-accent/20 text-accent-foreground w-fit mb-3">
                    {featured.category}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{featured.excerpt}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{featured.authorName}</span>
                    <span>·</span>
                    <span>{featured.publishedAt}</span>
                    <span>·</span>
                    <span>{featured.readTime}</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          )}

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((article, i) => (
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
                    <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{article.authorName}</span>
                      <span>·</span>
                      <span>{article.publishedAt}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Blog;
