import { useEffect, useState } from "react";

const AdminSettings = () => {
  const [organizationName, setOrganizationName] = useState("");
  const [description, setDescription] = useState("");
  const [primaryColor, setPrimaryColor] = useState("");
  const [accentColor, setAccentColor] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [officeHours, setOfficeHours] = useState("");
  const [mapEmbedUrl, setMapEmbedUrl] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((s) => {
        if (!s) return;
        if (typeof s.organizationName === "string") setOrganizationName(s.organizationName);
        if (typeof s.description === "string") setDescription(s.description);
        if (typeof s.primaryColor === "string") setPrimaryColor(s.primaryColor);
        if (typeof s.accentColor === "string") setAccentColor(s.accentColor);
        if (typeof s.address === "string") setAddress(s.address);
        if (typeof s.phone === "string") setPhone(s.phone);
        if (typeof s.contactEmail === "string") setContactEmail(s.contactEmail);
        if (typeof s.officeHours === "string") setOfficeHours(s.officeHours);
        if (typeof s.mapEmbedUrl === "string") setMapEmbedUrl(s.mapEmbedUrl);
      })
      .catch(() => {});
  }, []);

  const onSave = async () => {
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ organizationName, description, primaryColor, accentColor, address, phone, contactEmail, officeHours, mapEmbedUrl }),
    }).catch(() => {});
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-1">Pengaturan Website</h1>
        <p className="text-sm text-muted-foreground">Kelola tampilan dan pengaturan umum website.</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="glass-card p-5 sm:p-6">
          <h3 className="font-semibold text-foreground text-sm mb-4">Informasi Umum</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Nama Organisasi</label>
              <input
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Deskripsi</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>
          </div>
        </div>

        <div className="glass-card p-5 sm:p-6">
          <h3 className="font-semibold text-foreground text-sm mb-4">Logo</h3>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-xl bg-muted flex items-center justify-center">
              <span className="text-muted-foreground text-xs">Logo</span>
            </div>
            <button className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">
              Ganti Logo
            </button>
          </div>
        </div>

        <div className="glass-card p-5 sm:p-6">
          <h3 className="font-semibold text-foreground text-sm mb-4">Warna Tema</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Warna Utama</label>
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-primary" />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Warna Aksen</label>
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-accent" />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-5 sm:p-6">
          <h3 className="font-semibold text-foreground text-sm mb-4">Kontak</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Alamat</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Telepon</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Jam Operasional</label>
              <input
                type="text"
                value={officeHours}
                onChange={(e) => setOfficeHours(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Map Embed URL</label>
              <input
                type="text"
                value={mapEmbedUrl}
                onChange={(e) => setMapEmbedUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        <button onClick={onSave} className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
          Simpan Pengaturan
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
