import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";

type Member = {
  id: number;
  memberCode: string;
  name: string;
  nim: string;
  angkatan: string | null;
  jurusan: string | null;
  status: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  placeOfBirth: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  joinedAt: string | null;
  notes: string | null;
  photoUrl: string | null;
  isActive: boolean | null;
};

const AdminMemberDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const memberId = Number(id);

  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!Number.isFinite(memberId)) return;
    setIsLoading(true);
    fetch(`/api/members/${memberId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((m) => {
        if (!m) {
          setMember(null);
          return;
        }
        setMember({
          id: Number(m.id),
          memberCode: String(m.memberCode ?? ""),
          name: String(m.name ?? ""),
          nim: String(m.nim ?? ""),
          angkatan: m.angkatan ?? null,
          jurusan: m.jurusan ?? null,
          status: m.status ?? null,
          email: m.email ?? null,
          phone: m.phone ?? null,
          address: m.address ?? null,
          placeOfBirth: m.placeOfBirth ?? null,
          dateOfBirth: m.dateOfBirth?.slice?.(0, 10) ?? null,
          gender: m.gender ?? null,
          joinedAt: m.joinedAt?.slice?.(0, 10) ?? null,
          notes: m.notes ?? null,
          photoUrl: m.photoUrl ?? null,
          isActive: m.isActive ?? null,
        });
      })
      .catch(() => setMember(null))
      .finally(() => setIsLoading(false));
  }, [memberId]);

  const onDelete = async () => {
    if (!member) return;
    const ok = window.confirm("Hapus anggota ini?");
    if (!ok) return;
    await fetch(`/api/members/${member.id}`, { method: "DELETE" }).catch(() => {});
    navigate("/admin/anggota");
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Detail Anggota</h1>
          <p className="text-sm text-muted-foreground">{member?.memberCode ?? ""}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/admin/anggota")}
            className="px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            Kembali
          </button>
          {member && (
            <>
              <button
                onClick={() => navigate(`/admin/anggota/${member.id}/edit`)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                <Edit className="h-4 w-4" /> Edit
              </button>
              <button
                onClick={onDelete}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-destructive/30 text-destructive text-sm font-semibold hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="h-4 w-4" /> Hapus
              </button>
            </>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="glass-card p-6 text-sm text-muted-foreground">Memuat...</div>
      ) : !member ? (
        <div className="glass-card p-6 text-sm text-muted-foreground">Anggota tidak ditemukan.</div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="glass-card p-6 lg:col-span-1">
            <div className="flex items-center gap-4">
              {member.photoUrl ? (
                <img
                  src={member.photoUrl}
                  alt={member.name}
                  className="h-16 w-16 rounded-full object-cover ring-2 ring-border"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-primary/10 ring-2 ring-border flex items-center justify-center text-lg font-semibold text-primary">
                  {(member.name || "?").slice(0, 1).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <div className="font-semibold text-foreground">{member.name}</div>
                <div className="text-sm text-muted-foreground truncate">{member.nim}</div>
                <div className="mt-1">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">{member.status ?? ""}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 lg:col-span-2">
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Angkatan</div>
                <div className="text-foreground">{member.angkatan ?? "-"}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Jurusan</div>
                <div className="text-foreground">{member.jurusan ?? "-"}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Email</div>
                <div className="text-foreground">{member.email ?? "-"}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Telepon</div>
                <div className="text-foreground">{member.phone ?? "-"}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Tempat Lahir</div>
                <div className="text-foreground">{member.placeOfBirth ?? "-"}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Tanggal Lahir</div>
                <div className="text-foreground">{member.dateOfBirth ?? "-"}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Gender</div>
                <div className="text-foreground">{member.gender ?? "-"}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Bergabung</div>
                <div className="text-foreground">{member.joinedAt ?? "-"}</div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-xs text-muted-foreground mb-1">Alamat</div>
                <div className="text-foreground whitespace-pre-wrap">{member.address ?? "-"}</div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-xs text-muted-foreground mb-1">Catatan</div>
                <div className="text-foreground whitespace-pre-wrap">{member.notes ?? "-"}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMemberDetail;
