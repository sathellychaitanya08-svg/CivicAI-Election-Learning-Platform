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
  { id: "dashboard", label: "Home", icon: "" },
  { id: "tutor", label: "AI Tutor", icon: "" },
  { id: "simulator", label: "Voting Simulator", icon: "" },
  { id: "detector", label: "Fake News", icon: "" },
  { id: "quiz", label: "Quiz", icon: "" },
];
