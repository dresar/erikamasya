import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import {
  LayoutDashboard, Users, FileText, Calendar, Image, Building2,
  FolderOpen, MessageSquare, Settings, User, ChevronLeft, Menu,
} from "lucide-react";

const adminLinks = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Anggota", href: "/admin/anggota", icon: Users },
  { label: "Blog", href: "/admin/blog", icon: FileText },
  { label: "Kegiatan", href: "/admin/kegiatan", icon: Calendar },
  { label: "Galeri", href: "/admin/galeri", icon: Image },
  { label: "Struktur", href: "/admin/struktur", icon: Building2 },
  { label: "Dokumen", href: "/admin/dokumen", icon: FolderOpen },
  { label: "Pesan", href: "/admin/pesan", icon: MessageSquare },
  { label: "Pengaturan", href: "/admin/pengaturan", icon: Settings },
  { label: "Profil", href: "/admin/profil", icon: User },
];

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) navigate("/login");
  }, [navigate]);

  return (
    <div className="min-h-screen flex bg-surface-sunken">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 bg-card border-r border-border flex flex-col transition-all duration-300 ${
          collapsed ? "w-16" : "w-60"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {!collapsed && (
            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">PM</span>
              </div>
              <span className="font-bold text-sm text-foreground">Admin</span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted text-muted-foreground"
          >
            <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <link.icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={() => {
              localStorage.removeItem("auth_token");
              localStorage.removeItem("auth_user");
              navigate("/login");
            }}
            className="w-full mb-2 flex items-center justify-center px-3 py-2 rounded-lg text-sm border border-border text-foreground hover:bg-muted transition-colors"
          >
            Logout
          </button>
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            {!collapsed && <span>Kembali ke Situs</span>}
          </Link>
        </div>
      </aside>

      {/* Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-foreground/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? "lg:ml-16" : "lg:ml-60"}`}>
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden h-9 w-9 flex items-center justify-center rounded-lg border border-border text-foreground"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div className="hidden lg:block" />
          <ThemeToggle />
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
