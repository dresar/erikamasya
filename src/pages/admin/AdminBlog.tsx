import { Plus, Edit, Trash2 } from "lucide-react";
import articles from "@/data/articles.json";

const AdminBlog = () => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Manajemen Blog</h1>
          <p className="text-sm text-muted-foreground">{articles.length} artikel</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Tulis Artikel
        </button>
      </div>

      <div className="space-y-3">
        {articles.map((article) => (
          <div key={article.id} className="glass-card p-4 sm:p-5 flex items-start gap-4">
            <img
              src={article.thumbnail}
              alt={article.title}
              className="h-16 w-24 rounded-lg object-cover flex-shrink-0 hidden sm:block"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground text-sm truncate">{article.title}</h4>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{article.excerpt}</p>
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <span>{article.author}</span>
                <span>·</span>
                <span>{article.date}</span>
                <span>·</span>
                <span className="px-1.5 py-0.5 rounded bg-muted">{article.category}</span>
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

export default AdminBlog;
