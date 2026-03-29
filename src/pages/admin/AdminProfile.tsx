import { useEffect, useState } from "react";

const AdminProfile = () => {
  const stored = localStorage.getItem("auth_user");
  const parsed = stored ? (JSON.parse(stored) as { id?: number } | null) : null;
  const userId = Number(parsed?.id ?? 0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [initials, setInitials] = useState("");

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/profile/${userId}`)
      .then((r) => r.json())
      .then((p) => {
        if (!p) return;
        if (typeof p.name === "string") setName(p.name);
        if (typeof p.email === "string") setEmail(p.email);
        if (typeof p.position === "string") setPosition(p.position);
        if (typeof p.avatarInitials === "string") setInitials(p.avatarInitials);
      })
      .catch(() => {});
  }, [userId]);

  const onSave = async () => {
    await fetch(`/api/profile/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, position, avatarInitials: initials }),
    }).catch(() => {});
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-1">Profil Admin</h1>
        <p className="text-sm text-muted-foreground">Kelola informasi profil admin.</p>
      </div>

      <div className="max-w-2xl">
        <div className="glass-card p-5 sm:p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold text-lg">{initials}</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{name}</h3>
              <p className="text-sm text-muted-foreground">Administrator</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Nama Lengkap</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Jabatan</label>
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <button onClick={onSave} className="mt-6 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
            Simpan Profil
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
