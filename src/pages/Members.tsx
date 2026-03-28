import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import membersData from "@/data/members.json";

const angkatanOptions = ["Semua", ...new Set(membersData.map((m) => m.angkatan))];
const statusOptions = ["Semua", "Aktif", "Alumni"];

const Members = () => {
  const [search, setSearch] = useState("");
  const [angkatan, setAngkatan] = useState("Semua");
  const [status, setStatus] = useState("Semua");

  const filtered = useMemo(() => {
    return membersData.filter((m) => {
      const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
      const matchAngkatan = angkatan === "Semua" || m.angkatan === angkatan;
      const matchStatus = status === "Semua" || m.status === status;
      return matchSearch && matchAngkatan && matchStatus;
    });
  }, [search, angkatan, status]);

  return (
    <>
      <section className="py-16 lg:py-24 bg-surface-sunken">
        <div className="section-container">
          <SectionHeading
            badge="Anggota"
            title="Daftar Anggota"
            description="Anggota aktif dan alumni PMII Komisariat STAIM Kendal."
          />
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="section-container">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari anggota..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <select
              value={angkatan}
              onChange={(e) => setAngkatan(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {angkatanOptions.map((a) => (
                <option key={a} value={a}>{a === "Semua" ? "Semua Angkatan" : `Angkatan ${a}`}</option>
              ))}
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s === "Semua" ? "Semua Status" : s}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                className="glass-card p-4 text-center hover-lift"
              >
                <img
                  src={member.photo}
                  alt={member.name}
                  className="h-16 w-16 rounded-full object-cover mx-auto mb-3 ring-2 ring-border"
                  loading="lazy"
                />
                <h4 className="font-semibold text-foreground text-sm truncate">{member.name}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{member.jurusan}</p>
                <p className="text-xs text-muted-foreground">Angkatan {member.angkatan}</p>
                <span className={`mt-2 inline-block text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  member.status === "Aktif" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                }`}>
                  {member.status}
                </span>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Tidak ada anggota yang ditemukan.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Members;
