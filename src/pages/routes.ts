export type View =
  | "dashboard"
  | "tutor"
  | "simulator"
  | "compare"
  | "detector"
  | "manifesto"
  | "bias"
  | "quiz"
  | "analytics"
  | "settings";

export const navItems: { id: View; label: string; icon: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: "🏠" },
  { id: "tutor", label: "AI Tutor", icon: "🤖" },
  { id: "simulator", label: "Voting Simulator", icon: "🗳️" },
  { id: "compare", label: "Candidate Comparison", icon: "⚖️" },
  { id: "detector", label: "Fake News Detector", icon: "📰" },
  { id: "manifesto", label: "Manifesto Analyzer", icon: "📄" },
  { id: "bias", label: "Bias Detection", icon: "🧭" },
  { id: "quiz", label: "Quiz Lab", icon: "🧪" },
  { id: "analytics", label: "Analytics", icon: "📊" },
];
