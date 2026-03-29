import { motion } from "framer-motion";
import { FileText, Download } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { useEffect, useState } from "react";

const Documents = () => {
  const [documents, setDocuments] = useState<
    Array<{ id: number; title: string; category: string; fileType: string; fileSize: string; publishedAt: string; fileUrl: string | null }>
  >([]);

  useEffect(() => {
    fetch("/api/documents?page=1&pageSize=200")
      .then((r) => r.json())
      .then((p) => {
        const list = Array.isArray(p) ? p : p?.data;
        if (!Array.isArray(list)) return;
        setDocuments(
          list.map((d: unknown) => {
            const item = d as {
              id: number;
              title?: string;
              category?: string | null;
              fileType?: string | null;
              fileSize?: string | null;
              publishedAt?: string | null;
              fileUrl?: string | null;
            };
            return {
              id: item.id,
              title: item.title ?? "",
              category: item.category ?? "",
              fileType: item.fileType ?? "",
              fileSize: item.fileSize ?? "",
              publishedAt: item.publishedAt?.slice?.(0, 10) ?? "",
              fileUrl: item.fileUrl ?? null,
            };
          })
        );
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <section className="py-16 lg:py-24 bg-surface-sunken">
        <div className="section-container">
          <SectionHeading
            badge="Dokumen"
            title="Arsip Dokumen"
            description="Kumpulan dokumen resmi PMII Komisariat STAIM Kendal yang dapat diunduh."
          />
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="section-container max-w-4xl">
          <div className="space-y-3">
            {documents.map((doc, i) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="glass-card p-4 sm:p-5 flex items-center gap-4 hover-lift"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground text-sm truncate">{doc.title}</h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span>{doc.category}</span>
                    <span>·</span>
                    <span>{doc.fileType}</span>
                    <span>·</span>
                    <span>{doc.fileSize}</span>
                    <span>·</span>
                    <span>{doc.publishedAt}</span>
                  </div>
                </div>
                <a
                  href={doc.fileUrl ?? "#"}
                  className="h-9 w-9 rounded-lg border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors flex-shrink-0"
                >
                  <Download className="h-4 w-4" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Documents;
