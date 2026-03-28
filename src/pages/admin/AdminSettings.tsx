const AdminSettings = () => {
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
                defaultValue="PMII Komisariat STAIM Kendal"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Deskripsi</label>
              <textarea
                rows={3}
                defaultValue="Organisasi pergerakan mahasiswa Islam yang berkomitmen mencetak kader-kader bangsa."
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
                  defaultValue="#1975D3"
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
                  defaultValue="#F5C542"
                  className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>
        </div>

        <button className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
          Simpan Pengaturan
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
