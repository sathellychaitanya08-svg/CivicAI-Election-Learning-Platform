import type { CSSProperties } from "react";
import { motion } from "framer-motion";

export function VisualCharts({ values, labels }: { values: number[]; labels: string[] }) {
  const first = Math.max(0, Math.min(100, values[0] || 0));

  return (
    <motion.article
      className="card visual-card"
      initial={{ opacity: 0, scale: 0.98, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
    >
      <div className="card-title">
        <h2>Visual analysis</h2>
        <span className="badge purple">CHARTS</span>
      </div>
      <div className="visual-grid">
        <motion.div className="pie-chart" style={{ "--slice": first } as CSSProperties} initial={{ rotate: -8 }} animate={{ rotate: 0 }} transition={{ duration: 0.5 }}>
          <span>{first}%</span>
        </motion.div>
        <div className="mini-bars">
          {values.map((value, index) => (
            <div className="mini-bar" key={labels[index]}>
              <span>{labels[index]}</span>
              <motion.i initial={{ height: 8 }} animate={{ height: `${Math.max(8, Math.min(100, value))}%` }} transition={{ duration: 0.65, delay: index * 0.06 }} />
              <strong>{value}%</strong>
            </div>
          ))}
        </div>
        <div className="histogram">
          {values
            .concat(values.map((value) => Math.max(12, 100 - value)))
            .slice(0, 6)
            .map((value, index) => (
              <motion.i key={`${value}-${index}`} initial={{ height: 10 }} animate={{ height: `${Math.max(10, Math.min(100, value))}%` }} transition={{ duration: 0.55, delay: index * 0.05 }} />
            ))}
        </div>
      </div>
    </motion.article>
  );
}
