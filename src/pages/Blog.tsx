import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import articles from "@/data/articles.json";

const Blog = () => {
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
          <Link to={`/blog/${articles[0].slug}`} className="block mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass-card overflow-hidden hover-lift group grid md:grid-cols-2 gap-0"
            >
              <div className="aspect-video md:aspect-auto overflow-hidden">
                <img
                  src={articles[0].thumbnail}
                  alt={articles[0].title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6 sm:p-8 flex flex-col justify-center">
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-accent/20 text-accent-foreground w-fit mb-3">
                  {articles[0].category}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {articles[0].title}
                </h2>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{articles[0].excerpt}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{articles[0].author}</span>
                  <span>·</span>
                  <span>{articles[0].date}</span>
                  <span>·</span>
                  <span>{articles[0].readTime}</span>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.slice(1).map((article, i) => (
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
                      src={article.thumbnail}
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
                      <span>{article.author}</span>
                      <span>·</span>
                      <span>{article.date}</span>
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
