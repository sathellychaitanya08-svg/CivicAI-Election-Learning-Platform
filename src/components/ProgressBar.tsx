import { motion } from "framer-motion";

export function ProgressBar({ label, value }: { label: string; value: number }) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <motion.div
      className="bar-row"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32 }}
    >
      <span>{label}</span>
      <div>
        <motion.i initial={{ width: 0 }} animate={{ width: `${safeValue}%` }} transition={{ duration: 0.75, ease: "easeOut" }} />
      </div>
      <strong>{value}%</strong>
    </motion.div>
  );
}
