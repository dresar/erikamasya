import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import articles from "@/data/articles.json";

const BlogDetail = () => {
  const { slug } = useParams();
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="section-container py-32 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Artikel tidak ditemukan</h1>
        <Link to="/blog" className="text-primary text-sm font-medium hover:underline">
          ← Kembali ke Blog
        </Link>
      </div>
    );
  }

  return (
    <>
      <section className="py-16 lg:py-24">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Blog
            </Link>

            <div className="mb-6">
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-accent/20 text-accent-foreground">
                {article.category}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 leading-tight text-balance">
              {article.title}
            </h1>

            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-8">
              <span>{article.author}</span>
              <span>·</span>
              <span>{article.date}</span>
              <span>·</span>
              <span>{article.readTime}</span>
            </div>

            <div className="aspect-video rounded-xl overflow-hidden mb-10">
              <img
                src={article.thumbnail}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="prose-content text-sm sm:text-base leading-[1.8]">
              {article.content.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogDetail;
