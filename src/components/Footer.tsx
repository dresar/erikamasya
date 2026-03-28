import { Link } from "react-router-dom";

const footerLinks = [
  {
    title: "Navigasi",
    links: [
      { label: "Beranda", href: "/" },
      { label: "Tentang Kami", href: "/tentang-kami" },
      { label: "Kegiatan", href: "/kegiatan" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Organisasi",
    links: [
      { label: "Struktur", href: "/struktur-organisasi" },
      { label: "Anggota", href: "/anggota" },
      { label: "Dokumen", href: "/dokumen" },
      { label: "Galeri", href: "/galeri" },
    ],
  },
  {
    title: "Lainnya",
    links: [
      { label: "Kontak", href: "/kontak" },
      { label: "Admin", href: "/admin/dashboard" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="section-container py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">PM</span>
              </div>
              <div>
                <p className="font-bold text-sm text-foreground">PMII</p>
                <p className="text-[10px] text-muted-foreground">Komisariat STAIM Kendal</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Pergerakan Mahasiswa Islam Indonesia — mencetak kader bangsa yang berkarakter dan berintelektual.
            </p>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="font-semibold text-sm text-foreground mb-4">{group.title}</h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} PMII Komisariat STAIM Kendal. Hak cipta dilindungi.
          </p>
          <div className="flex items-center gap-4">
            {["Instagram", "YouTube", "WhatsApp"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
