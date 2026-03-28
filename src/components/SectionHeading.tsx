import { ReactNode } from "react";
import { motion } from "framer-motion";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  description?: string;
  center?: boolean;
  children?: ReactNode;
}

export function SectionHeading({ badge, title, description, center = true, children }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className={`mb-10 lg:mb-14 ${center ? "text-center" : ""}`}
    >
      {badge && (
        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3 tracking-wide uppercase">
          {badge}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground text-balance">{title}</h2>
      {description && (
        <p className="mt-3 text-muted-foreground max-w-2xl leading-relaxed text-sm sm:text-base mx-auto">
          {description}
        </p>
      )}
      {children}
    </motion.div>
  );
}
