const AdminProfile = () => {
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
              <span className="text-primary font-bold text-lg">AF</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Ahmad Fauzi</h3>
              <p className="text-sm text-muted-foreground">Administrator</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Nama Lengkap</label>
                <input
                  type="text"
                  defaultValue="Ahmad Fauzi"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                <input
                  type="email"
                  defaultValue="admin@pmii-staimkendal.id"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Jabatan</label>
              <input
                type="text"
                defaultValue="Ketua Umum"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <button className="mt-6 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
            Simpan Profil
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
