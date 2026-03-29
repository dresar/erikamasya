import { motion } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import { useEffect, useMemo, useState } from "react";

const Structure = () => {
  const [period, setPeriod] = useState<string>("");
  const [members, setMembers] = useState<Array<{ id: number; name: string; position: string; department: string; photoUrl: string | null }>>(
    []
  );

  useEffect(() => {
    fetch("/api/structure/organization")
      .then((r) => r.json())
      .then((d) => {
        if (!d) return;
        setPeriod(typeof d.period === "string" ? d.period : "");
        const list = Array.isArray(d.members) ? d.members : [];
        setMembers(
          list.map((m: unknown) => {
            const item = m as { id: number; name?: string; position?: string; department?: string | null; photoUrl?: string | null };
            return {
              id: item.id,
              name: item.name ?? "",
              position: item.position ?? "",
              department: item.department ?? "",
              photoUrl: item.photoUrl ?? null,
            };
          })
        );
      })
      .catch(() => {});
  }, []);

  const departments = useMemo(() => [...new Set(members.map((m) => m.department).filter(Boolean))], [members]);

  return (
    <>
      <section className="py-16 lg:py-24 bg-surface-sunken">
        <div className="section-container">
          <SectionHeading
            badge="Organisasi"
            title="Struktur Kepengurusan"
            description={`Periode ${period} — Susunan pengurus PMII Komisariat STAIM Kendal.`}
          />
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="section-container">
          {departments.map((dept) => (
            <div key={dept} className="mb-12 last:mb-0">
              <h3 className="text-lg font-semibold text-foreground mb-6">{dept}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {members
                  .filter((m) => m.department === dept)
                  .map((member, i) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      className="glass-card p-4 sm:p-5 text-center hover-lift"
                    >
                      <img
                        src={member.photoUrl ?? "https://via.placeholder.com/300"}
                        alt={member.name}
                        className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover mx-auto mb-3 ring-2 ring-border"
                        loading="lazy"
                      />
                      <h4 className="font-semibold text-foreground text-sm">{member.name}</h4>
                      <p className="text-xs text-primary mt-1">{member.position}</p>
                    </motion.div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Structure;
