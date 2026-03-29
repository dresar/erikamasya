import { useCallback, useEffect, useState } from "react";
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const AdminMembers = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<
    Array<{
      id: number;
      memberCode: string;
      name: string;
      nim: string;
      angkatan: string;
      jurusan: string;
      status: string;
      photoUrl: string | null;
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
    params.set("pageSize", String(pageSize));
    if (debouncedSearch) params.set("q", debouncedSearch);

    fetch(`/api/members?${params.toString()}`)
      .then((r) => r.json())
      .then((payload) => {
        const list = payload?.data;
        setTotal(Number(payload?.total ?? 0));
        if (!Array.isArray(list)) return;
        setMembers(
          list.map((m: unknown) => {
            const item = m as {
              id: number;
              memberCode?: string;
              name?: string;
              nim?: string;
              angkatan?: string | null;
              jurusan?: string | null;
              status?: string | null;
              photoUrl?: string | null;
            };

            return {
              id: item.id,
              memberCode: item.memberCode ?? "",
              name: item.name ?? "",
              nim: item.nim ?? "",
              angkatan: item.angkatan ?? "",
              jurusan: item.jurusan ?? "",
              status: item.status ?? "",
              photoUrl: item.photoUrl ?? null,
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
    const ok = window.confirm("Hapus anggota ini?");
    if (!ok) return;
    await fetch(`/api/members/${id}`, { method: "DELETE" }).catch(() => {});
    load();
  };

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <CardTitle>Manajemen Anggota</CardTitle>
            <CardDescription>{total} anggota terdaftar</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => navigate("/admin/anggota/new")}>
              <Plus className="h-4 w-4" />
              Tambah Anggota
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari anggota..."
                className="pl-9"
              />
            </div>
            <div className="flex items-center justify-between lg:justify-end gap-3">
              <div className="text-xs text-muted-foreground">
                Halaman {page} / {Math.max(1, Math.ceil(total / pageSize))}
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
                <option value={100}>100</option>
                <option value={200}>200</option>
              </select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Profil</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead className="hidden sm:table-cell">NIM</TableHead>
                <TableHead className="hidden md:table-cell">Angkatan</TableHead>
                <TableHead className="hidden md:table-cell">Jurusan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {m.photoUrl ? (
                        <img src={m.photoUrl} alt={m.name} className="h-9 w-9 rounded-full object-cover ring-2 ring-border" />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-primary/10 ring-2 ring-border flex items-center justify-center text-xs font-semibold text-primary">
                          {(m.name || "?").slice(0, 1).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="text-xs text-muted-foreground truncate">{m.memberCode}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">{m.nim}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{m.angkatan}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{m.jurusan}</TableCell>
                  <TableCell>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        m.status === "Aktif" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {m.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/anggota/${m.id}`)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/anggota/${m.id}/edit`)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDelete(m.id)}>
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
              disabled={page >= Math.max(1, Math.ceil(total / pageSize))}
            >
              Berikutnya
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMembers;
