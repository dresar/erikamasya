import { Users, FileText, Calendar, Eye, TrendingUp, MessageSquare } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { useEffect, useMemo, useState } from "react";

const AdminDashboard = () => {
  const [liveStats, setLiveStats] = useState({
    totalAnggota: 0,
    totalKegiatan: 0,
    totalArtikel: 0,
    pengunjungBulanIni: 0,
    pesanMasuk: 0,
    anggotaAktif: 0,
  });
  const [chartData, setChartData] = useState<Array<{ bulan: string; anggota: number; kegiatan: number }>>([]);
  const [visitData, setVisitData] = useState<Array<{ bulan: string; pengunjung: number }>>([]);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => r.json())
      .then((data) => {
        if (!data) return;
        setLiveStats(data);
      })
      .catch(() => {});

    fetch("/api/dashboard/members-activities")
      .then((r) => r.json())
      .then((rows) => {
        if (!Array.isArray(rows)) return;
        setChartData(
          rows.map((x: unknown) => {
            const item = x as { bulan?: string; anggota?: number; kegiatan?: number };
            return { bulan: item.bulan ?? "", anggota: Number(item.anggota ?? 0), kegiatan: Number(item.kegiatan ?? 0) };
          })
        );
      })
      .catch(() => {});

    fetch("/api/dashboard/visits")
      .then((r) => r.json())
      .then((rows) => {
        if (!Array.isArray(rows)) return;
        setVisitData(
          rows.map((x: unknown) => {
            const item = x as { bulan?: string; value?: number };
            return { bulan: item.bulan ?? "", pengunjung: Number(item.value ?? 0) };
          })
        );
      })
      .catch(() => {});
  }, []);

  const statCards = useMemo(
    () => [
      { label: "Total Anggota", value: liveStats.totalAnggota, icon: Users, change: "+12%" },
      { label: "Kegiatan", value: liveStats.totalKegiatan, icon: Calendar, change: "+8%" },
      { label: "Artikel", value: liveStats.totalArtikel, icon: FileText, change: "+15%" },
      { label: "Pengunjung", value: liveStats.pengunjungBulanIni, icon: Eye, change: "+24%" },
      { label: "Pesan Masuk", value: liveStats.pesanMasuk, icon: MessageSquare, change: "+3" },
      { label: "Anggota Aktif", value: liveStats.anggotaAktif, icon: TrendingUp, change: "+5%" },
    ],
    [liveStats]
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-1">Dashboard</h1>
      <p className="text-sm text-muted-foreground mb-8">Ringkasan data PMII Komisariat STAIM Kendal.</p>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <div key={i} className="glass-card p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="h-5 w-5 text-primary" />
              <span className="text-xs font-medium text-primary">{stat.change}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-5 sm:p-6">
          <h3 className="font-semibold text-foreground text-sm mb-4">Anggota & Kegiatan per Bulan</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="bulan" fontSize={12} stroke="hsl(var(--muted-foreground))" />
              <YAxis fontSize={12} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="anggota" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="kegiatan" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5 sm:p-6">
          <h3 className="font-semibold text-foreground text-sm mb-4">Tren Pengunjung Website</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={visitData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="bulan" fontSize={12} stroke="hsl(var(--muted-foreground))" />
              <YAxis fontSize={12} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Line type="monotone" dataKey="pengunjung" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
