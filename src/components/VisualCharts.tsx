import type { CSSProperties } from "react";

export function VisualCharts({ values, labels }: { values: number[]; labels: string[] }) {
  const first = Math.max(0, Math.min(100, values[0] || 0));

  return (
    <article className="card visual-card">
      <div className="card-title">
        <h2>Visual analysis</h2>
        <span className="badge purple">CHARTS</span>
      </div>
      <div className="visual-grid">
        <div className="pie-chart" style={{ "--slice": first } as CSSProperties}>
          <span>{first}%</span>
        </div>
        <div className="mini-bars">
          {values.map((value, index) => (
            <div className="mini-bar" key={labels[index]}>
              <span>{labels[index]}</span>
              <i style={{ height: `${Math.max(8, Math.min(100, value))}%` }} />
              <strong>{value}%</strong>
            </div>
          ))}
        </div>
        <div className="histogram">
          {values
            .concat(values.map((value) => Math.max(12, 100 - value)))
            .slice(0, 6)
            .map((value, index) => (
              <i key={`${value}-${index}`} style={{ height: `${Math.max(10, Math.min(100, value))}%` }} />
            ))}
        </div>
      </div>
    </article>
  );
}
