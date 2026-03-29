import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/(^-|-$)/g, "");
}

const AdminBlogEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const articleId = Number(id);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [readTime, setReadTime] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [publishedAt, setPublishedAt] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"draft" | "published">("draft");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const computedSlug = useMemo(() => (slug.trim() ? slugify(slug) : slugify(title)), [slug, title]);

  useEffect(() => {
    if (!Number.isFinite(articleId)) return;
    setIsLoading(true);
    fetch(`/api/articles/id/${articleId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((a) => {
        if (!a) {
          setError("Artikel tidak ditemukan");
          return;
        }
        setTitle(String(a.title ?? ""));
        setSlug(String(a.slug ?? ""));
        setExcerpt(String(a.excerpt ?? ""));
        setContent(String(a.content ?? ""));
        setCategory(String(a.category ?? ""));
        setReadTime(String(a.readTime ?? ""));
        setAuthorName(String(a.authorName ?? ""));
        setPublishedAt(String(a.publishedAt?.slice?.(0, 10) ?? ""));
        setThumbnailUrl(a.thumbnailUrl ?? null);
        setStatus((a.status ?? "draft") as "draft" | "published");
      })
      .catch(() => setError("Gagal memuat artikel"))
      .finally(() => setIsLoading(false));
  }, [articleId]);

  const onSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/articles/${articleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: computedSlug,
          title,
          excerpt: excerpt || null,
          content: content || null,
          authorName: authorName || null,
          authorId: null,
          status,
          category: category || null,
          readTime: readTime || null,
          thumbnailUrl,
          publishedAt: publishedAt || null,
        }),
      });

      if (!res.ok) {
        setError("Gagal menyimpan perubahan");
        return;
      }

      navigate("/admin/blog");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Edit Artikel</h1>
          <p className="text-sm text-muted-foreground">Perbarui konten artikel.</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/admin/blog")}>
          Kembali
        </Button>
      </div>

      {error && <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 mb-6 text-sm text-destructive">{error}</div>}

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Publikasi</CardTitle>
            <CardDescription>Atur metadata artikel.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "draft" | "published")}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Tanggal Publish</Label>
              <Input type="date" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Kategori</Label>
              <Input value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Estimasi Baca</Label>
              <Input value={readTime} onChange={(e) => setReadTime(e.target.value)} placeholder="contoh: 5 menit" />
            </div>
            <div className="space-y-2">
              <Label>Author</Label>
              <Input value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Thumbnail URL</Label>
              <Input value={thumbnailUrl ?? ""} onChange={(e) => setThumbnailUrl(e.target.value || null)} />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Konten</CardTitle>
            <CardDescription>Judul, slug, ringkasan, dan isi artikel.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Judul</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder={computedSlug} />
              <div className="text-xs text-muted-foreground">Preview: {computedSlug || "-"}</div>
            </div>
            <div className="space-y-2">
              <Label>Ringkasan</Label>
              <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Isi</Label>
              <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={14} />
            </div>

            <div className="flex justify-end">
              <Button disabled={isLoading || isSaving} onClick={onSave}>
                Simpan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminBlogEdit;

