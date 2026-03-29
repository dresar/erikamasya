import { motion } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import { useEffect, useState } from "react";

const About = () => {
  const [organizationName, setOrganizationName] = useState<string>(""); 
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((s) => {
        if (!s) return;
        if (typeof s.organizationName === "string") setOrganizationName(s.organizationName);
        if (typeof s.description === "string") setDescription(s.description);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="py-16 lg:py-24 bg-surface-sunken">
        <div className="section-container">
          <SectionHeading
            badge="Tentang Kami"
            title={organizationName || "PMII"}
            description={description || ""}
          />
        </div>
      </section>

      {/* Sejarah */}
      <section className="py-16 lg:py-24">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-bold text-foreground mb-4">Sejarah Singkat</h3>
              <div className="prose-content text-sm sm:text-base">
                <p>
                  PMII (Pergerakan Mahasiswa Islam Indonesia) didirikan pada tanggal 17 April 1960 di Surabaya. 
                  Sebagai organisasi kemahasiswaan yang berafiliasi dengan Nahdlatul Ulama, PMII memiliki peran 
                  penting dalam sejarah pergerakan mahasiswa di Indonesia.
                </p>
                <p>
                  PMII Komisariat STAIM Kendal hadir sebagai wadah bagi mahasiswa STAIM Kendal untuk mengembangkan 
                  potensi intelektual, spiritual, dan sosial. Sejak berdirinya, komisariat ini telah melahirkan 
                  banyak kader yang berkontribusi di berbagai bidang, mulai dari pendidikan, pemerintahan, 
                  hingga dunia usaha.
                </p>
                <p>
                  Dengan semangat Ahlussunnah wal Jamaah, PMII Komisariat STAIM Kendal terus berkomitmen 
                  untuk menjadi organisasi yang progresif, inklusif, dan relevan dengan perkembangan zaman.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Visi Misi */}
      <section className="py-16 lg:py-24 bg-surface-sunken">
        <div className="section-container">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass-card p-6 sm:p-8"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary font-bold">V</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">Visi</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Terwujudnya PMII Komisariat STAIM Kendal sebagai organisasi pergerakan mahasiswa Islam 
                yang progresif, berkarakter Ahlussunnah wal Jamaah, dan mampu menjadi motor penggerak 
                perubahan positif di masyarakat.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass-card p-6 sm:p-8"
            >
              <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                <span className="text-accent-foreground font-bold">M</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">Misi</h3>
              <ul className="text-sm text-muted-foreground space-y-3 leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  Menyelenggarakan kaderisasi yang berkualitas dan berkelanjutan.
                </li>
                <li className="flex gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  Mengembangkan tradisi intelektual dan keilmuan.
                </li>
                <li className="flex gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  Memperkuat jejaring dan kemitraan strategis.
                </li>
                <li className="flex gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  Mendorong kontribusi nyata bagi masyarakat.
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Nilai */}
      <section className="py-16 lg:py-24">
        <div className="section-container">
          <SectionHeading
            badge="Nilai-Nilai"
            title="Prinsip Ahlussunnah wal Jamaah"
            description="Empat pilar nilai yang menjadi landasan gerakan dan kehidupan berorganisasi."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { title: "Tawasuth", desc: "Sikap moderat, mengambil jalan tengah yang berkeadilan." },
              { title: "Tawazun", desc: "Sikap seimbang dalam segala aspek kehidupan." },
              { title: "Tasamuh", desc: "Sikap toleran dan menghargai perbedaan." },
              { title: "I'tidal", desc: "Sikap tegak lurus, adil, dan proporsional." },
            ].map((val, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="glass-card p-6 text-center hover-lift"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold">{val.title[0]}</span>
                </div>
                <h4 className="font-semibold text-foreground mb-2">{val.title}</h4>
                <p className="text-sm text-muted-foreground">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
