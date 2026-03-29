import { Plus, Edit, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const AdminBlog = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<
    Array<{
      id: number;
      slug: string;
      title: string;
      excerpt: string;
      content: string;
      thumbnail: string;
      author: string;
      date: string;
      category: string;
      readTime: string;
    }>
  >([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);

  const load = useCallback(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("pageSize", String(Math.min(50, pageSize)));
    if (debouncedSearch) params.set("q", debouncedSearch);

    fetch(`/api/articles?${params.toString()}`)
      .then((r) => r.json())
      .then((payload) => {
        const list = Array.isArray(payload) ? payload : payload?.data;
        if (!Array.isArray(payload) && typeof payload?.total === "number") setTotal(payload.total);
        if (!Array.isArray(list)) return;
        setArticles(
          list.map((a: unknown) => {
            const item = a as {
              id: number;
              slug?: string;
              title?: string;
              excerpt?: string | null;
              content?: string | null;
              thumbnailUrl?: string | null;
              thumbnail?: string | null;
              authorName?: string | null;
              author?: string | null;
              publishedAt?: string | null;
              date?: string | null;
              category?: string | null;
              readTime?: string | null;
            };

            return {
              id: item.id,
              slug: item.slug ?? "",
              title: item.title ?? "",
              excerpt: item.excerpt ?? "",
              content: item.content ?? "",
              thumbnail: item.thumbnailUrl ?? item.thumbnail ?? "",
              author: item.authorName ?? item.author ?? "",
              date: item.publishedAt?.slice?.(0, 10) ?? item.date ?? "",
              category: item.category ?? "",
              readTime: item.readTime ?? "",
            };
          })
        );
      })
      .catch(() => {});
  }, [debouncedSearch, page, pageSize]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setDebouncedSearch(search.trim());
    }, 250);
    return () => clearTimeout(t);
  }, [search]);

  const onDelete = async (id: number) => {
    const ok = window.confirm("Hapus artikel ini?");
    if (!ok) return;
    await fetch(`/api/articles/${id}`, { method: "DELETE" }).catch(() => {});
    load();
  };

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <CardTitle>Manajemen Blog</CardTitle>
            <CardDescription>{total || articles.length} artikel</CardDescription>
          </div>
          <Button onClick={() => navigate("/admin/blog/new")}>
            <Plus className="h-4 w-4" />
            Tulis Artikel
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari judul artikel..." />
            <div className="flex items-center justify-between lg:justify-end gap-3">
              <div className="text-xs text-muted-foreground">
                Halaman {page} / {Math.max(1, Math.ceil((total || articles.length) / pageSize))}
              </div>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPage(1);
                  setPageSize(Number(e.target.value));
                }}
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul</TableHead>
                <TableHead className="hidden md:table-cell">Kategori</TableHead>
                <TableHead className="hidden md:table-cell">Tanggal</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>
                    <div className="min-w-0">
                      <div className="font-medium text-foreground truncate">{a.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{a.slug}</div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{a.category}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{a.date}</TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/blog/${a.id}/edit`)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDelete(a.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= Math.max(1, Math.ceil((total || articles.length) / pageSize))}
            >
              Berikutnya
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBlog;

