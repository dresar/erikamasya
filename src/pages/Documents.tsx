import { motion } from "framer-motion";
import { FileText, Download } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import documentsData from "@/data/documents.json";

const Documents = () => {
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
            {documentsData.map((doc, i) => (
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
                    <span>{doc.date}</span>
                  </div>
                </div>
                <button className="h-9 w-9 rounded-lg border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors flex-shrink-0">
                  <Download className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Documents;
