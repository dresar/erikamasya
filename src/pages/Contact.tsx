import { motion } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Contact = () => {
  return (
    <>
      <section className="py-16 lg:py-24 bg-surface-sunken">
        <div className="section-container">
          <SectionHeading
            badge="Kontak"
            title="Hubungi Kami"
            description="Jangan ragu untuk menghubungi kami. Kami siap membantu Anda."
          />
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="section-container">
          <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-3"
            >
              <div className="glass-card p-6 sm:p-8">
                <h3 className="text-lg font-semibold text-foreground mb-6">Kirim Pesan</h3>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Nama</label>
                      <input
                        type="text"
                        placeholder="Nama lengkap"
                        className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                      <input
                        type="email"
                        placeholder="email@example.com"
                        className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Subjek</label>
                    <input
                      type="text"
                      placeholder="Subjek pesan"
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Pesan</label>
                    <textarea
                      rows={5}
                      placeholder="Tulis pesan Anda..."
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Kirim Pesan
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2 space-y-4"
            >
              {[
                { icon: MapPin, title: "Alamat", desc: "Jl. Raya Kendal No. 123, Kendal, Jawa Tengah 51311" },
                { icon: Phone, title: "Telepon", desc: "+62 812-3456-7890" },
                { icon: Mail, title: "Email", desc: "pmii.staimkendal@gmail.com" },
                { icon: Clock, title: "Jam Operasional", desc: "Senin - Jumat, 08.00 - 16.00 WIB" },
              ].map((item, i) => (
                <div key={i} className="glass-card p-5 flex gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground text-sm">{item.title}</h4>
                    <p className="text-sm text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}

              {/* Map Dummy */}
              <div className="glass-card overflow-hidden aspect-video">
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">Peta Lokasi</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
