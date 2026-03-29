import { motion } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

const Contact = () => {
  const [settings, setSettings] = useState<{
    address: string | null;
    phone: string | null;
    contactEmail: string | null;
    officeHours: string | null;
    mapEmbedUrl: string | null;
  }>({
    address: null,
    phone: null,
    contactEmail: null,
    officeHours: null,
    mapEmbedUrl: null,
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((s) => {
        if (!s) return;
        setSettings({
          address: typeof s.address === "string" ? s.address : null,
          phone: typeof s.phone === "string" ? s.phone : null,
          contactEmail: typeof s.contactEmail === "string" ? s.contactEmail : null,
          officeHours: typeof s.officeHours === "string" ? s.officeHours : null,
          mapEmbedUrl: typeof s.mapEmbedUrl === "string" ? s.mapEmbedUrl : null,
        });
      })
      .catch(() => {});
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } finally {
      setIsSending(false);
    }
  };

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
                <form className="space-y-4" onSubmit={onSubmit}>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Nama</label>
                      <input
                        type="text"
                        placeholder="Nama lengkap"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                      <input
                        type="email"
                        placeholder="email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Subjek</label>
                    <input
                      type="text"
                      placeholder="Subjek pesan"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Pesan</label>
                    <textarea
                      rows={5}
                      placeholder="Tulis pesan Anda..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSending}
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
                { icon: MapPin, title: "Alamat", desc: settings.address },
                { icon: Phone, title: "Telepon", desc: settings.phone },
                { icon: Mail, title: "Email", desc: settings.contactEmail },
                { icon: Clock, title: "Jam Operasional", desc: settings.officeHours },
              ]
                .filter((item) => !!item.desc)
                .map((item, i) => (
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

              {settings.mapEmbedUrl && (
                <div className="glass-card overflow-hidden aspect-video">
                  <iframe src={settings.mapEmbedUrl} className="w-full h-full" loading="lazy" />
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
