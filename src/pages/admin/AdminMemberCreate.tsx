import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const AdminMemberCreate = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [nim, setNim] = useState("");
  const [angkatan, setAngkatan] = useState("");
  const [jurusan, setJurusan] = useState("");
  const [status, setStatus] = useState("Aktif");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [placeOfBirth, setPlaceOfBirth] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [joinedAt, setJoinedAt] = useState("");
  const [notes, setNotes] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadPhoto = async (file: File) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;
    const folder = (import.meta.env.VITE_CLOUDINARY_FOLDER as string | undefined) || "members";

    if (!cloudName || !uploadPreset) {
      setError("Cloudinary env belum di-set (VITE_CLOUDINARY_CLOUD_NAME & VITE_CLOUDINARY_UPLOAD_PRESET)");
      return;
    }

    setIsUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("upload_preset", uploadPreset);
      form.append("folder", folder);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        setError("Upload foto gagal");
        return;
      }

      const data = (await res.json()) as { secure_url?: string };
      if (!data.secure_url) {
        setError("Upload foto gagal");
        return;
      }

      setPhotoUrl(data.secure_url);
    } finally {
      setIsUploading(false);
    }
  };

  const onSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          nim,
          angkatan: angkatan || null,
          jurusan: jurusan || null,
          status,
          email: email || null,
          phone: phone || null,
          address: address || null,
          placeOfBirth: placeOfBirth || null,
          dateOfBirth: dateOfBirth || null,
          gender: gender || null,
          joinedAt: joinedAt || null,
          notes: notes || null,
          photoUrl,
          isActive: true,
        }),
      });

      if (!res.ok) {
        setError("Gagal menyimpan anggota");
        return;
      }

      const created = (await res.json()) as { id?: number };
      if (created?.id) {
        navigate(`/admin/anggota/${created.id}`);
      } else {
        navigate("/admin/anggota");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Tambah Anggota</h1>
          <p className="text-sm text-muted-foreground">Buat data anggota baru.</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/admin/anggota")}>
          Kembali
        </Button>
      </div>

      {error && <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 mb-6 text-sm text-destructive">{error}</div>}

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Foto Anggota</CardTitle>
            <CardDescription>Unggah foto ke Cloudinary atau gunakan URL foto.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              {photoUrl ? (
                <img src={photoUrl} alt="Foto anggota" className="h-16 w-16 rounded-full object-cover ring-2 ring-border" />
              ) : (
                <div className="h-16 w-16 rounded-full bg-primary/10 ring-2 ring-border flex items-center justify-center text-lg font-semibold text-primary">
                  {(name || "?").slice(0, 1).toUpperCase()}
                </div>
              )}
              <div className="flex-1 space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  disabled={isUploading}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    uploadPhoto(f);
                  }}
                />
                <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" disabled={isUploading} onClick={() => setPhotoUrl(null)}>
                    Hapus
                  </Button>
                  {isUploading && <div className="text-xs text-muted-foreground">Mengunggah...</div>}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>URL Foto (opsional)</Label>
              <Input value={photoUrl ?? ""} onChange={(e) => setPhotoUrl(e.target.value || null)} />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Data Anggota</CardTitle>
            <CardDescription>Lengkapi identitas, kontak, dan informasi tambahan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nama</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>NIM</Label>
                <Input value={nim} onChange={(e) => setNim(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Angkatan</Label>
                <Input value={angkatan} onChange={(e) => setAngkatan(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Jurusan</Label>
                <Input value={jurusan} onChange={(e) => setJurusan(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Alumni">Alumni</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Pilih</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Telepon</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Tempat Lahir</Label>
                <Input value={placeOfBirth} onChange={(e) => setPlaceOfBirth(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Tanggal Lahir</Label>
                <Input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Tanggal Bergabung</Label>
                <Input type="date" value={joinedAt} onChange={(e) => setJoinedAt(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Alamat</Label>
              <Textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={3} />
            </div>

            <div className="space-y-2">
              <Label>Catatan</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
            </div>

            <div className="flex justify-end">
              <Button disabled={isSaving || isUploading} onClick={onSave}>
                Simpan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminMemberCreate;
