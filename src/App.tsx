import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./App.css";
import { ProgressBar } from "./components/ProgressBar";
import { VisualCharts } from "./components/VisualCharts";
import { navItems, type View } from "./pages/routes";

type Level = "First-time voter" | "School student" | "College learner" | "Civic volunteer";
type ChatMessage = { role: "user" | "assistant"; text: string };
type QuizQuestion = { question: string; options: string[]; answer: number; explanation: string };
type UserProfile = { learningGoal: string; level: Level; profileName: string; profileRegion: string };
type SignedInUser = { email: string; name: string; picture?: string };
type ThemeMode = "dark" | "light";
type Candidate = {
  id: string;
  name: string;
  party: string;
  color: string;
  focus: string[];
  strengths: string[];
  weaknesses: string[];
  policies: Record<string, string>;
};

const candidates: Candidate[] = [
  {
    id: "asha",
    name: "Asha Rao",
    party: "People First Alliance",
    color: "#10b981",
    focus: ["education", "healthcare", "women safety"],
    strengths: ["Clear welfare agenda", "Strong local outreach", "Detailed education promises"],
    weaknesses: ["Funding plan needs more detail", "Less emphasis on digital jobs"],
    policies: {
      Economy: "Skill centers and small-business grants",
      Education: "Scholarships, teacher training, school infrastructure",
      Healthcare: "Primary health clinics and mobile medical units",
      Environment: "Waste management and clean water drives",
    },
  },
  {
    id: "kabir",
    name: "Kabir Mehta",
    party: "Development Front",
    color: "#5b4df5",
    focus: ["jobs", "infrastructure", "startups"],
    strengths: ["Strong employment narrative", "Infrastructure-first plan", "Clear startup policy"],
    weaknesses: ["Social equity section is lighter", "Environmental safeguards need clarity"],
    policies: {
      Economy: "Industrial corridors, apprenticeships, startup tax support",
      Education: "Coding labs and vocational training",
      Healthcare: "Public-private hospital upgrades",
      Environment: "Green transport with phased targets",
    },
  },
  {
    id: "nisha",
    name: "Nisha Khan",
    party: "Clean Future Party",
    color: "#f59e0b",
    focus: ["transparency", "climate", "public transport"],
    strengths: ["Strong anti-corruption pitch", "Climate-focused manifesto", "Public transport priority"],
    weaknesses: ["Rural employment plan is less specific", "May need broader coalition support"],
    policies: {
      Economy: "Green jobs and transparent procurement",
      Education: "Civic education and digital public libraries",
      Healthcare: "Pollution-linked health monitoring",
      Environment: "Air quality targets, public transport, climate resilience",
    },
  },
];

const baseQuiz: QuizQuestion[] = [
  {
    question: "What should a voter check before polling day?",
    options: ["Campaign slogans", "Name in the voter list", "Weather forecast", "Exit polls"],
    answer: 1,
    explanation: "A citizen can vote only if their name appears on the electoral roll for that polling area.",
  },
  {
    question: "What does VVPAT help a voter verify?",
    options: ["Queue length", "Candidate spending", "Recorded vote choice", "Counting date"],
    answer: 2,
    explanation: "VVPAT briefly shows a paper slip so the voter can verify the selected candidate.",
  },
  {
    question: "Why are elections sometimes held in phases?",
    options: ["To confuse voters", "To manage logistics and security", "To avoid counting", "To reduce turnout"],
    answer: 1,
    explanation: "Phases help manage polling staff, equipment, security, and access across regions.",
  },
  {
    question: "What is democracy based on?",
    options: ["Rule by one person", "Rule by citizens through elected representatives", "Rule by heredity", "Rule by military order"],
    answer: 1,
    explanation: "Democracy gives citizens a voice through voting, representation, rights, and accountability.",
  },
  {
    question: "Which house of Parliament is directly elected by the people of India?",
    options: ["Rajya Sabha", "Lok Sabha", "Vidhan Parishad", "Supreme Court"],
    answer: 1,
    explanation: "Lok Sabha members are directly elected by voters from parliamentary constituencies.",
  },
  {
    question: "What is Rajya Sabha also known as?",
    options: ["House of the People", "Council of States", "Election Commission", "State Assembly"],
    answer: 1,
    explanation: "Rajya Sabha is the Council of States and represents the states and union territories.",
  },
  {
    question: "Who conducts elections in India at the national and state level?",
    options: ["Election Commission of India", "Rajya Sabha Secretariat", "Local police only", "Political parties"],
    answer: 0,
    explanation: "The Election Commission of India supervises and conducts national and state elections.",
  },
  {
    question: "What is the main role of Parliament?",
    options: ["Make laws and hold the government accountable", "Run polling booths", "Select every voter", "Write party slogans"],
    answer: 0,
    explanation: "Parliament debates laws, passes budgets, represents citizens, and questions the government.",
  },
  {
    question: "What does universal adult franchise mean?",
    options: ["Only graduates can vote", "Every eligible adult citizen can vote", "Only taxpayers can vote", "Only officials can vote"],
    answer: 1,
    explanation: "Universal adult franchise means all eligible adult citizens have the right to vote without unfair discrimination.",
  },
  {
    question: "What should citizens do before trusting election news?",
    options: ["Forward it quickly", "Check official and credible sources", "Trust anonymous messages", "Ignore dates and context"],
    answer: 1,
    explanation: "Verifying sources, date, context, and official confirmation helps reduce misinformation.",
  },
];

const states = [
  "India",
  "Andhra Pradesh",
  "Telangana",
  "Tamil Nadu",
  "Karnataka",
  "Maharashtra",
  "Delhi",
  "Uttar Pradesh",
  "West Bengal",
  "Bihar",
  "Kerala",
  "Gujarat",
  "Rajasthan",
  "Madhya Pradesh",
  "Odisha",
  "Punjab",
  "Haryana",
  "Assam",
  "Jharkhand",
  "Chhattisgarh",
  "Goa",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Tripura",
  "Sikkim",
  "Arunachal Pradesh",
  "Manipur",
  "Jammu and Kashmir",
  "Puducherry",
  "Chandigarh",
];
const dailyPlan = ["Day 1: Voting basics", "Day 2: EVM and VVPAT", "Day 3: Voter rights", "Day 4: Fake news check", "Day 5: Candidate comparison"];

const regionDetails: Record<string, { issues: string[]; candidates: string[]; electionType: string }> = {
  India: {
    candidates: ["National candidate profiles", "State representatives", "Local constituency candidates"],
    electionType: "Lok Sabha, Vidhan Sabha, local body elections",
    issues: ["jobs", "education", "healthcare", "inflation", "public infrastructure"],
  },
  "Andhra Pradesh": {
    candidates: ["Assembly candidate A", "Assembly candidate B", "Independent candidate"],
    electionType: "Assembly, Lok Sabha, local body elections",
    issues: ["capital development", "irrigation", "youth employment", "coastal infrastructure"],
  },
  Telangana: {
    candidates: ["Urban development candidate", "Rural welfare candidate", "Independent candidate"],
    electionType: "Assembly, Lok Sabha, municipal elections",
    issues: ["urban transport", "farmer support", "IT jobs", "water supply"],
  },
  Delhi: {
    candidates: ["Municipal candidate", "Assembly candidate", "Parliament candidate"],
    electionType: "Assembly, Lok Sabha, municipal elections",
    issues: ["air quality", "public transport", "education", "health services"],
  },
  Maharashtra: {
    candidates: ["Urban infrastructure candidate", "Farmer welfare candidate", "Youth jobs candidate"],
    electionType: "Assembly, Lok Sabha, municipal elections",
    issues: ["farmer distress", "urban housing", "transport", "industry"],
  },
};

const buildTutorPrompt = (question: string, level: Level, region: string, goal: string, name: string) => `You are CivicAI, a neutral AI election tutor.
Learner name: ${name}
Learner level: ${level}
Region: ${region}
Learning goal: ${goal}
User question: ${question}

Answer clearly with:
1. Simple explanation
2. Step-by-step breakdown
3. Example
4. One follow-up question

Personalize the opening sentence. For example, if the learner is a first-time voter in India, begin with context like "Let me explain the basics for a first-time voter in India."
Stay non-partisan. Do not ask the user to support a party or candidate.`;

const fallbackTutor = (question: string, region: string) =>
  `Here is a simple explanation for "${question}". Elections are a step-by-step democratic process where eligible citizens register, verify their names, compare candidates, vote privately, and then follow counting and results. In ${region}, users should always verify local details from official election sources because dates, constituencies, and candidate lists can vary.\n\nStep-by-step:\n1. Check eligibility and voter list.\n2. Learn the candidates and issues.\n3. Vote privately at the polling station.\n4. Follow verified result updates.\n\nFollow-up: Do you want this as a timeline or quiz?`;

const analyzeNewsFallback = (text: string) => {
  const lower = text.toLowerCase();
  const redFlags = ["forwarded", "urgent", "secret", "guaranteed", "everyone must", "breaking!!!", "share now"];
  const score = redFlags.filter((flag) => lower.includes(flag)).length;
  if (!text.trim()) return "Paste a news claim to analyze it.";
  if (score >= 2) return "Likely misleading. The claim uses urgency or viral-forwarding language. Verify it with official election sources and credible news outlets before sharing.";
  if (lower.includes("election commission") || lower.includes("official")) return "Possibly credible, but still verify the date, source link, and whether the statement is from an official channel.";
  return "Unclear. I do not see strong proof either way. Check source, date, author, official confirmation, and whether other credible outlets report the same claim.";
};

const analyzeManifestoFallback = (text: string) => {
  if (!text.trim()) return "Paste manifesto text to summarize it.";
  const promises = ["jobs", "education", "health", "women", "farmer", "climate", "transport", "tax"].filter((word) =>
    text.toLowerCase().includes(word),
  );
  return `Summary: This manifesto focuses on ${promises.length ? promises.join(", ") : "public welfare and governance"}.\n\nKey promises:\n- Improve public services\n- Address voter concerns through policy commitments\n- Communicate development priorities\n\nSentiment: Mostly positive, because manifesto language usually emphasizes promises and benefits.\n\nWatch point: Ask how each promise will be funded, measured, and delivered.`;
};

const analyzeBiasFallback = (text: string) => {
  const lower = text.toLowerCase();
  const loadedWords = ["traitor", "anti-national", "destroy", "always", "never", "enemy", "only choice"];
  const matches = loadedWords.filter((word) => lower.includes(word));
  if (!text.trim()) return "Paste a political speech, article, or campaign message to check for bias.";
  return `Bias signal: ${matches.length >= 2 ? "High" : matches.length === 1 ? "Medium" : "Low"}.

Why:
- Loaded language found: ${matches.length ? matches.join(", ") : "none obvious"}
- Check whether the message gives evidence, source links, and space for opposing viewpoints.
- Strong claims should be verified against official records and credible reporting.

Suggestion: Rewrite the message using neutral language and verifiable facts.`;
};

const candidateFitFallback = (candidate: Candidate, goal: string) =>
  `Based on your profile goal "${goal}", ${candidate.name} may fit if you care about ${candidate.focus.join(", ")}. Their strongest match is ${candidate.strengths[0].toLowerCase()}. A careful voter should also check the trade-off: ${candidate.weaknesses[0].toLowerCase()}.`;

const cleanAiText = (text: string) =>
  text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/^\s*[-*]\s+/gm, "")
    .replace(/\*/g, "")
    .trim();

const cleanQuizQuestion = (question: string) =>
  question
    .replace(/^Choose the correct answer\s*[:.-]\s*/i, "")
    .replace(/^(Easy|Medium|Hard)(\s+(level|question))?\s*[:.-]\s*/i, "")
    .trim();

function FormattedOutput({ fallback = "", text }: { fallback?: string; text: string }) {
  const content = cleanAiText(text || fallback);
  return (
    <div className="ai-output-text">
      {content.split(/\n+/).map((line, index) => {
        const labelMatch = line.match(/^([\w\s/-]{2,42}:)\s*(.*)$/);
        return (
          <p key={`${line}-${index}`}>
            {labelMatch ? (
              <>
                <strong>{labelMatch[1]}</strong> {labelMatch[2]}
              </>
            ) : (
              line
            )}
          </p>
        );
      })}
    </div>
  );
}

const parseQuizJson = (text: string) => {
  const jsonBlock = text.trim().match(/```json\s*([\s\S]*?)```/i)?.[1];
  const objectText = jsonBlock || text.trim().match(/\[[\s\S]*\]/)?.[0] || text;
  const parsed = JSON.parse(objectText) as QuizQuestion[];
  return parsed
    .filter((item) => item.question && item.options?.length === 4 && Number.isInteger(item.answer))
    .map((item) => ({ ...item, question: cleanQuizQuestion(item.question) }));
};

const tuneQuizDifficulty = (questions: QuizQuestion[], difficulty: "Easy" | "Medium" | "Hard", topic: string): QuizQuestion[] => {
  if (difficulty === "Easy") {
    return questions.map((item) => ({
      ...item,
      question: item.question,
      explanation: `${item.explanation} Easy level: this checks the basic fact.`,
    }));
  }

  if (difficulty === "Medium") {
    return questions.map((item, index) => ({
      ...item,
      question: index % 2 === 0
        ? `A voter is studying ${topic}. Which option best applies this idea in real election practice?`
        : `During a civic awareness session on ${topic}, which answer would correctly guide a first-time voter?`,
      explanation: `${item.explanation} Medium level: this connects the fact to voter decisions or parliamentary practice.`,
    }));
  }

  return questions.map((item, index) => ({
    ...item,
    question: index % 2 === 0
      ? `Which statement best explains the constitutional or democratic importance of ${topic}?`
      : `Which reasoning best connects ${topic} with accountability, representation, or law-making?`,
    explanation: `${item.explanation} Hard level: this tests both the fact and the reason it matters in India's democratic system.`,
  }));
};

const buildTopicQuizFallback = (topic: string, difficulty: "Easy" | "Medium" | "Hard"): QuizQuestion[] => {
  const cleanTopic = topic.trim() || "Indian elections";
  const normalized = cleanTopic.toLowerCase();
  const isLokSabha = normalized.includes("lok") || normalized.includes("lo sabha");
  const isRajyaSabha = normalized.includes("rajya");
  const isParliament = normalized.includes("parliament") || isLokSabha || isRajyaSabha;
  const isDemocracy = normalized.includes("democracy") || normalized.includes("democratic");

  let questions: QuizQuestion[];

  if (isLokSabha) {
    questions = [
      { question: "What is Lok Sabha also known as?", options: ["Council of States", "House of the People", "State Assembly", "Election Tribunal"], answer: 1, explanation: "Lok Sabha is called the House of the People because its members are directly elected by voters." },
      { question: "How are Lok Sabha members elected?", options: ["By direct election", "By governors only", "By judges", "By nomination only"], answer: 0, explanation: "Lok Sabha members are directly elected from parliamentary constituencies." },
      { question: "What is the normal term of Lok Sabha?", options: ["2 years", "5 years", "7 years", "10 years"], answer: 1, explanation: "The normal term is five years unless it is dissolved earlier." },
      { question: "Who is the presiding officer of Lok Sabha?", options: ["Speaker", "Vice President", "Chief Justice", "Governor"], answer: 0, explanation: "The Speaker presides over Lok Sabha proceedings." },
      { question: "Which bill is introduced only in Lok Sabha?", options: ["Money Bill", "Private email bill", "State boundary note", "Court appeal"], answer: 0, explanation: "A Money Bill can be introduced only in Lok Sabha." },
      { question: "What does one Lok Sabha constituency elect?", options: ["One MP", "One MLA", "One mayor", "One judge"], answer: 0, explanation: "Each parliamentary constituency elects one Member of Parliament to Lok Sabha." },
      { question: "Who forms the Union government after Lok Sabha elections?", options: ["Party or coalition with majority support", "Any losing party", "Only Rajya Sabha members", "Election observers"], answer: 0, explanation: "The party or coalition with majority support in Lok Sabha forms the government." },
      { question: "What is a vote of no confidence related to?", options: ["Government support in Lok Sabha", "Weather forecast", "Exam results", "Polling booth design"], answer: 0, explanation: "A no-confidence motion tests whether the government still has Lok Sabha support." },
      { question: "Why is Lok Sabha important in democracy?", options: ["It represents voters directly", "It removes voter rights", "It replaces elections", "It controls all courts"], answer: 0, explanation: "Lok Sabha directly represents citizens through elected MPs." },
      { question: "Who conducts Lok Sabha elections?", options: ["Election Commission of India", "Local clubs", "Private companies", "Only candidates"], answer: 0, explanation: "The Election Commission of India conducts Lok Sabha elections." },
    ];
  } else if (isRajyaSabha) {
    questions = [
      { question: "What is Rajya Sabha also known as?", options: ["Council of States", "House of the People", "Village Council", "Election Office"], answer: 0, explanation: "Rajya Sabha is called the Council of States." },
      { question: "How are most Rajya Sabha members elected?", options: ["By elected MLAs", "By direct public vote", "By school students", "By polling officers"], answer: 0, explanation: "Most Rajya Sabha members are elected by elected members of State Legislative Assemblies." },
      { question: "Is Rajya Sabha a permanent house?", options: ["Yes", "No, it dissolves every year", "Only during elections", "Only in emergencies"], answer: 0, explanation: "Rajya Sabha is a permanent house and is not dissolved." },
      { question: "How often do one-third of Rajya Sabha members retire?", options: ["Every 2 years", "Every 5 years", "Every month", "Every 10 years"], answer: 0, explanation: "One-third of Rajya Sabha members retire every two years." },
      { question: "Who is the ex-officio Chairman of Rajya Sabha?", options: ["Vice President of India", "Prime Minister", "Speaker of Lok Sabha", "Chief Election Commissioner"], answer: 0, explanation: "The Vice President of India is the ex-officio Chairman of Rajya Sabha." },
      { question: "What does Rajya Sabha represent?", options: ["States and union territories", "Only one city", "Only political parties", "Only courts"], answer: 0, explanation: "Rajya Sabha gives representation to states and union territories." },
      { question: "Can Rajya Sabha discuss and review bills?", options: ["Yes", "No", "Only sports bills", "Only school rules"], answer: 0, explanation: "Rajya Sabha reviews, debates, and can suggest changes to legislation." },
      { question: "What is the usual term of a Rajya Sabha member?", options: ["6 years", "1 year", "3 months", "Lifetime"], answer: 0, explanation: "A Rajya Sabha member usually serves a six-year term." },
      { question: "Why is Rajya Sabha important?", options: ["It protects federal representation", "It cancels voting rights", "It replaces courts", "It controls weather"], answer: 0, explanation: "Rajya Sabha helps represent states in national law-making." },
      { question: "Which Parliament house is indirectly elected?", options: ["Rajya Sabha", "Lok Sabha", "Gram Sabha", "Polling Station"], answer: 0, explanation: "Rajya Sabha is mostly indirectly elected through elected MLAs." },
    ];
  } else if (isParliament || isDemocracy) {
    questions = [
      { question: "What are the two houses of Indian Parliament?", options: ["Lok Sabha and Rajya Sabha", "Vidhan Sabha and Court", "Cabinet and Police", "Mayor and Council"], answer: 0, explanation: "Indian Parliament has Lok Sabha and Rajya Sabha." },
      { question: "What is the main role of Parliament?", options: ["Make laws and hold government accountable", "Run private companies", "Select movie awards", "Manage schools only"], answer: 0, explanation: "Parliament makes laws, debates issues, passes budgets, and questions the government." },
      { question: "What is democracy based on?", options: ["People's participation", "Rule by one person", "No elections", "Secret government only"], answer: 0, explanation: "Democracy is based on citizen participation, representation, and accountability." },
      ...baseQuiz.slice(0, 7),
    ].slice(0, 10);
  } else {
    questions = baseQuiz.map((item, index) => index < 3 ? { ...item, question: `${cleanTopic}: ${item.question}` } : item);
  }

  return tuneQuizDifficulty(questions, difficulty, cleanTopic);
};

const getApiError = (status: number, details: string) => {
  if (status === 403) return "Gemini key is blocked or API access is not enabled.";
  if (status === 404) return "Gemini model not found.";
  if (status === 429) return "Gemini quota or rate limit reached.";
  if (details.toLowerCase().includes("api key")) return "Gemini API key looks invalid or restricted.";
  return `Gemini failed with status ${status}.`;
};

export default function App() {
  const resizeState = useRef<{
    height: number;
    left: number;
    mode: "left" | "right" | "y" | "both";
    startX: number;
    startY: number;
    target: HTMLElement;
    width: number;
  } | null>(null);
  const [activeView, setActiveView] = useState<View>(() => {
    const hashView = window.location.hash.replace("#/", "") as View;
    return navItems.some((item) => item.id === hashView) || hashView === "settings" ? hashView : "dashboard";
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => (localStorage.getItem("civicai-theme") as ThemeMode) || "dark");
  const savedProfile = (() => {
    try {
      return JSON.parse(localStorage.getItem("userProfile") || "null") as UserProfile | null;
    } catch {
      return null;
    }
  })();
  const [profileName, setProfileName] = useState(savedProfile?.profileName || "Future Voter");
  const [profileRegion, setProfileRegion] = useState(savedProfile?.profileRegion || "India");
  const [learningGoal, setLearningGoal] = useState(savedProfile?.learningGoal || "Become election-ready");
  const [level, setLevel] = useState<Level>(savedProfile?.level || "First-time voter");
  const [profileSaved, setProfileSaved] = useState(false);
  const [signedInUser, setSignedInUser] = useState<SignedInUser | null>(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("signedInUser") || "null") as SignedInUser | null;
      if (savedUser?.email === "learner@google.com") {
        localStorage.removeItem("signedInUser");
        return null;
      }
      return savedUser;
    } catch {
      return null;
    }
  });
  const activeSignedInUser = signedInUser?.email === "learner@google.com" ? null : signedInUser;
  const [notice, setNotice] = useState("Election workspace ready.");
  const [chatInput, setChatInput] = useState("Explain Indian election system");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: "assistant", text: "Hi, I am CivicAI. Ask me about voting, parties, EVM, rights, fake news, or timelines." },
  ]);
  const [aiTyping, setAiTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [readingText, setReadingText] = useState("");
  const [readingCharIndex, setReadingCharIndex] = useState(0);
  const [votes, setVotes] = useState<Record<string, number>>({ asha: 14, kabir: 18, nisha: 11 });
  const [lastVote, setLastVote] = useState<string | null>(null);
  const [pendingVote, setPendingVote] = useState<Candidate | null>(null);
  const [votedFor, setVotedFor] = useState<string | null>(null);
  const [fitReason, setFitReason] = useState("");
  const [fitLoading, setFitLoading] = useState(false);
  const [candidateA, setCandidateA] = useState(candidates[0].id);
  const [candidateB, setCandidateB] = useState(candidates[1].id);
  const [newsText, setNewsText] = useState("Forwarded: secret EVM hack found, share now before voting closes!");
  const [newsResult, setNewsResult] = useState("");
  const [biasText, setBiasText] = useState("Only our party can save the nation. The other side will destroy everything.");
  const [biasResult, setBiasResult] = useState("");
  const [manifestoText, setManifestoText] = useState("We promise jobs, better schools, healthcare access, clean transport, and transparent governance.");
  const [manifestoResult, setManifestoResult] = useState("");
  const [quiz, setQuiz] = useState(baseQuiz);
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Easy");
  const [quizTopic, setQuizTopic] = useState("Indian elections and Parliament");
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [analyticsInsight, setAnalyticsInsight] = useState("Run AI insight to get a personalized learning recommendation.");
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [progress, setProgress] = useState<Record<number, boolean>>({ 0: true, 1: true });
  const [onboardingVisible, setOnboardingVisible] = useState(() => localStorage.getItem("civicai-onboarding-seen") !== "true");
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = themeMode;
    localStorage.setItem("civicai-theme", themeMode);
  }, [themeMode]);

  useEffect(() => {
    window.history.replaceState(null, "", `#/${activeView}`);
  }, [activeView]);

  useEffect(() => {
    const resizableElements = document.querySelectorAll<HTMLElement>(".card, .metric-card, .quiz-card, .feature-button");
    resizableElements.forEach((element) => {
      element.classList.add("resizable-js");
      if (!element.querySelector(".resize-edge-right")) {
        const right = document.createElement("span");
        right.className = "resize-edge-right";
        element.appendChild(right);
      }
      if (!element.querySelector(".resize-edge-left")) {
        const left = document.createElement("span");
        left.className = "resize-edge-left";
        element.appendChild(left);
      }
      if (!element.querySelector(".resize-edge-bottom")) {
        const bottom = document.createElement("span");
        bottom.className = "resize-edge-bottom";
        element.appendChild(bottom);
      }
      if (!element.querySelector(".resize-edge-corner")) {
        const corner = document.createElement("span");
        corner.className = "resize-edge-corner";
        element.appendChild(corner);
      }
    });
  });

  useEffect(() => {
    const onMouseDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const mode = target.classList.contains("resize-edge-corner")
        ? "both"
        : target.classList.contains("resize-edge-right")
          ? "right"
          : target.classList.contains("resize-edge-left")
            ? "left"
            : target.classList.contains("resize-edge-bottom")
              ? "y"
              : null;

      if (!mode) return;
      const box = target.closest<HTMLElement>(".resizable-js");
      if (!box) return;
      const rect = box.getBoundingClientRect();
      resizeState.current = {
        height: rect.height,
        left: box.offsetLeft,
        mode,
        startX: event.clientX,
        startY: event.clientY,
        target: box,
        width: rect.width,
      };
      event.preventDefault();
    };

    const onMouseMove = (event: MouseEvent) => {
      const state = resizeState.current;
      if (!state) return;
      if (state.mode === "right" || state.mode === "both") {
        state.target.style.width = `${Math.max(260, state.width + event.clientX - state.startX)}px`;
      }
      if (state.mode === "left") {
        const delta = event.clientX - state.startX;
        const nextWidth = Math.max(260, state.width - delta);
        const appliedDelta = state.width - nextWidth;
        state.target.style.width = `${nextWidth}px`;
        state.target.style.transform = `translateX(${appliedDelta}px)`;
      }
      if (state.mode === "y" || state.mode === "both") {
        state.target.style.height = `${Math.max(160, state.height + event.clientY - state.startY)}px`;
      }
    };

    const onMouseUp = () => {
      resizeState.current = null;
    };

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const quizScore = quiz.reduce((score, question, index) => score + (answers[index] === question.answer ? 1 : 0), 0);
  const quizCompleted = quiz.length > 0 && Object.keys(answers).length >= quiz.length;
  const badgeUnlocked = quizCompleted && quizScore >= Math.ceil(quiz.length * 0.7);
  const answeredCount = Object.keys(answers).length;
  const currentQuestion = quiz[Math.min(currentQuizIndex, Math.max(quiz.length - 1, 0))] || baseQuiz[0];
  const totalVotes = Object.values(votes).reduce((sum, value) => sum + value, 0);
  const readiness = Math.min(98, Math.round(44 + quizScore * 11 + Object.values(progress).filter(Boolean).length * 7));
  const selectedA = candidates.find((candidate) => candidate.id === candidateA) || candidates[0];
  const selectedB = candidates.find((candidate) => candidate.id === candidateB) || candidates[1];
  const bestFit = useMemo(() => {
    const goal = learningGoal.toLowerCase();
    return candidates
      .map((candidate) => ({
        candidate,
        score: candidate.focus.filter((focus) => goal.includes(focus) || goal.includes(focus.split(" ")[0])).length,
      }))
      .sort((a, b) => b.score - a.score)[0].candidate;
  }, [learningGoal]);
  const selectedRegionDetails = regionDetails[profileRegion] || regionDetails.India;
  const smartSuggestions = useMemo(() => {
    const goal = learningGoal.toLowerCase();
    if (goal.includes("education")) return ["EVM and VVPAT", "Candidate manifesto education promises", "How to verify school policy claims"];
    if (goal.includes("job") || goal.includes("employment")) return ["Manifesto jobs promises", "Candidate comparison for employment", "How to detect fake jobs claims"];
    if (goal.includes("health")) return ["Healthcare promises", "Public welfare schemes", "How to verify health misinformation"];
    return ["Electoral process basics", "Voter rights", "Fake news detection"];
  }, [learningGoal]);

  useEffect(() => {
    if (!activeSignedInUser) return;
    const quizEntry = {
      date: new Date().toISOString(),
      level,
      region: profileRegion,
      score: quizScore,
      total: quiz.length,
    };
    const previous = JSON.parse(localStorage.getItem("quizHistory") || "[]") as typeof quizEntry[];
    localStorage.setItem("quizHistory", JSON.stringify([...previous.slice(-9), quizEntry]));
  }, [level, profileRegion, quiz.length, quizScore, activeSignedInUser]);

  const askGemini = async (prompt: string, fallback: string) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const model = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash";
    if (!apiKey) return fallback;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${prompt}\n\nFormatting rules: use plain text only, do not use markdown asterisks, and make section labels short like Summary:, Steps:, Example:, or Watch point:.` }] }],
        generationConfig: { temperature: 0.35 },
      }),
    });
    if (!response.ok) throw new Error(getApiError(response.status, await response.text()));
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || fallback;
  };

  const sendChat = async (promptOverride?: string) => {
    const question = (promptOverride ?? chatInput).trim();
    if (!question) return;
    setChatHistory((current) => [...current, { role: "user", text: question }]);
    setChatInput("");
    setNotice("AI Tutor thinking...");
    setAiTyping(true);
    try {
      const answer = await askGemini(buildTutorPrompt(question, level, profileRegion, learningGoal, profileName), fallbackTutor(question, profileRegion));
      setChatHistory((current) => [...current, { role: "assistant", text: answer }]);
      setNotice("AI Tutor answered successfully.");
    } catch (error) {
      const answer = fallbackTutor(question, profileRegion);
      setChatHistory((current) => [...current, { role: "assistant", text: answer }]);
      setNotice(`${error instanceof Error ? error.message : "AI unavailable."} Showing demo answer.`);
    } finally {
      setAiTyping(false);
    }
  };

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setNotice("Voice input is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      setChatInput(event.results[0][0].transcript);
    };
    recognition.start();
  };

  const speakLastAnswer = () => {
    const lastAnswer = [...chatHistory].reverse().find((message) => message.role === "assistant");
    if (!lastAnswer || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(lastAnswer.text);
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice =
      voices.find((voice) => /female|woman|zira|susan|samantha|heera|veena/i.test(voice.name)) ||
      voices.find((voice) => /en-IN|en-US|en-GB/i.test(voice.lang));
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.pitch = 1.12;
    utterance.rate = 0.92;
    utterance.onstart = () => setIsReading(true);
    utterance.onboundary = (event) => {
      if (event.charIndex >= 0) setReadingCharIndex(event.charIndex);
    };
    utterance.onend = () => {
      setIsReading(false);
      setReadingCharIndex(0);
    };
    utterance.onerror = () => {
      setIsReading(false);
      setReadingCharIndex(0);
    };
    setReadingText(lastAnswer.text);
    setReadingCharIndex(0);
    window.speechSynthesis.speak(utterance);
  };

  const castVote = () => {
    if (!pendingVote || votedFor) return;
    setVotes((current) => ({ ...current, [pendingVote.id]: current[pendingVote.id] + 1 }));
    setLastVote(`TX-${pendingVote.id.toUpperCase()}-${String(totalVotes + 1).padStart(4, "0")}`);
    setVotedFor(pendingVote.id);
    setNotice(`Vote recorded for ${pendingVote.name}. Multiple voting is locked for this demo session.`);
    setPendingVote(null);
  };

  const explainCandidateFit = async (candidate: Candidate) => {
    const fallback = candidateFitFallback(candidate, learningGoal);
    setFitLoading(true);
    setNotice("Generating candidate fit explanation...");
    try {
      const answer = await askGemini(
        `You are a neutral election learning assistant. Explain why this candidate may or may not fit the voter profile without persuading the voter.
Voter goal: ${learningGoal}
Region: ${profileRegion}
Candidate: ${candidate.name}
Party: ${candidate.party}
Focus: ${candidate.focus.join(", ")}
Strengths: ${candidate.strengths.join(", ")}
Weaknesses: ${candidate.weaknesses.join(", ")}
Give a balanced explanation in 4 short bullets.`,
        fallback,
      );
      setFitReason(answer);
      setNotice("Candidate fit explanation generated.");
    } catch (error) {
      setFitReason(fallback);
      setNotice(`${error instanceof Error ? error.message : "AI unavailable."} Showing fit fallback.`);
    } finally {
      setFitLoading(false);
    }
  };

  const runNewsCheck = async () => {
    const fallback = analyzeNewsFallback(newsText);
    setNotice("Checking election claim...");
    try {
      const answer = await askGemini(
        `Analyze this election-related claim for misinformation. Return Likely true, Misleading, or Unclear with explanation:\n${newsText}`,
        fallback,
      );
      setNewsResult(answer);
      setNotice("Fake news detector finished.");
    } catch (error) {
      setNewsResult(fallback);
      setNotice(`${error instanceof Error ? error.message : "AI unavailable."} Showing detector fallback.`);
    }
  };

  const runManifesto = async () => {
    const fallback = analyzeManifestoFallback(manifestoText);
    setNotice("Analyzing manifesto...");
    try {
      const answer = await askGemini(
        `Analyze this election manifesto. Give summary, key promises, sentiment, and questions voters should ask:\n${manifestoText}`,
        fallback,
      );
      setManifestoResult(answer);
      setNotice("Manifesto analyzer finished.");
    } catch (error) {
      setManifestoResult(fallback);
      setNotice(`${error instanceof Error ? error.message : "AI unavailable."} Showing manifesto fallback.`);
    }
  };

  const runBiasCheck = async () => {
    const fallback = analyzeBiasFallback(biasText);
    setNotice("Checking political bias...");
    try {
      const answer = await askGemini(
        `Analyze this election speech/article for political bias. Give bias level, loaded words, missing context, and a neutral rewrite suggestion:\n${biasText}`,
        fallback,
      );
      setBiasResult(answer);
      setNotice("Bias detector finished.");
    } catch (error) {
      setBiasResult(fallback);
      setNotice(`${error instanceof Error ? error.message : "AI unavailable."} Showing bias fallback.`);
    }
  };

  const generateAnalyticsInsight = async () => {
    const fallback = `You are improving in election knowledge. Your strongest area is ${quizScore > 1 ? "quiz understanding" : "guided learning progress"}, and you should next review ${smartSuggestions[0].toLowerCase()} for ${profileRegion}.`;
    setAnalyticsLoading(true);
    setNotice("Generating AI analytics insight...");
    try {
      const answer = await askGemini(
        `You are an election learning analytics assistant. Give a concise personalized insight.
Learner: ${profileName}
Region: ${profileRegion}
Goal: ${learningGoal}
Quiz score: ${quizScore}/${quiz.length}
Progress completed: ${Object.values(progress).filter(Boolean).length}/${dailyPlan.length}
Suggest next 2 topics and one weak area. Stay educational and non-partisan.`,
        fallback,
      );
      setAnalyticsInsight(answer);
      setNotice("AI analytics insight generated.");
    } catch (error) {
      setAnalyticsInsight(fallback);
      setNotice(`${error instanceof Error ? error.message : "AI unavailable."} Showing analytics fallback.`);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const generateQuiz = async () => {
    setAnswers({});
    setCurrentQuizIndex(0);
    setGeneratingQuiz(true);
    const fallback = buildTopicQuizFallback(quizTopic, difficulty);
    try {
      const answer = await askGemini(
        `Create exactly 10 ${difficulty} election education MCQs about this quiz title/topic: "${quizTopic || "elections, democracy, Parliament, Lok Sabha, Rajya Sabha, voting rights, voter verification, and misinformation"}". Use this learner context if helpful: "${chatInput || chatHistory.filter((message) => message.role === "user").at(-1)?.text || learningGoal}".
Learner level: ${level}
Region: ${profileRegion}
Learning goal: ${learningGoal}
Difficulty meaning:
Easy = direct factual questions with simple wording.
Medium = scenario-based questions that connect facts to voter or Parliament practice.
Hard = reasoning-based questions about democratic importance, constitutional roles, and institutional impact.
The wording and cognitive level must be clearly different for Easy, Medium, and Hard. Do not reuse the same questions with only small wording changes.
Return only valid JSON array. Shape: [{"question":"...","options":["A","B","C","D"],"answer":0,"explanation":"..."}].
Do not start questions with the difficulty label. Never prefix questions with Easy:, Medium:, or Hard:.
Do not include the difficulty name before any question.
Make exactly 10 questions.`,
        JSON.stringify(fallback),
      );
      const parsed = parseQuizJson(answer);
      setQuiz(parsed.length ? parsed : fallback);
      setNotice("AI quiz generated.");
    } catch (error) {
      setQuiz(fallback);
      setNotice(`${error instanceof Error ? error.message : "AI unavailable."} Showing quiz fallback.`);
    } finally {
      setGeneratingQuiz(false);
    }
  };

  const answerQuizOption = (optionIndex: number) => {
    const isCorrect = optionIndex === currentQuestion.answer;
    setAnswers((current) => ({ ...current, [currentQuizIndex]: optionIndex }));
    if (isCorrect && currentQuizIndex < quiz.length - 1) {
      window.setTimeout(() => {
        setCurrentQuizIndex((current) => Math.min(quiz.length - 1, current + 1));
      }, 650);
    }
  };

  const chooseLearnerPath = (nextLevel: Level, nextGoal: string) => {
    setLevel(nextLevel);
    setLearningGoal(nextGoal);
    setOnboardingVisible(false);
    localStorage.setItem("civicai-onboarding-seen", "true");
    setNotice(`Learning path set for ${nextLevel}. Your dashboard is personalized.`);
  };

  const runDemoMode = () => {
    setDemoMode(true);
    setNewsText("Forwarded: secret EVM hack found, share now before voting closes!");
    setBiasText("Only our party can save the nation. The other side will destroy everything.");
    setManifestoText("We promise jobs, better schools, healthcare access, clean transport, transparent governance, and safer public spaces.");
    setChatInput("Explain the Indian voting process for a first-time voter");
    setProgress({ 0: true, 1: true, 2: true, 3: true });
    setNotice("Demo mode loaded: open AI Tutor, Voting Simulator, Fake News Detector, and Quiz Lab.");
    setActiveView("tutor");
  };

  return (
    <main className={`app-frame ${sidebarCollapsed ? "sidebar-collapsed" : ""} ${mobileMenuOpen ? "mobile-menu-open" : ""}`}>
      <aside className="sidebar">
        <div className="brand">
          <strong>CivicAI</strong>
          <span>AI Election Learning Platform</span>
        </div>
        <nav aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={activeView === item.id ? "active" : ""}
              onClick={() => {
                setActiveView(item.id);
                setMobileMenuOpen(false);
              }}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="theme-toggle" aria-label="Theme selector">
          <span>Light</span>
          <button
            type="button"
            className={themeMode}
            onClick={() => setThemeMode((current) => (current === "dark" ? "light" : "dark"))}
            aria-label="Toggle light and dark theme"
          >
            <i />
          </button>
          <span>Dark</span>
        </div>
        {activeView === "settings" && (
        <button
          className={`profile-shortcut ${activeView === "settings" ? "active" : ""}`}
          type="button"
          onClick={() => {
            setActiveView("settings");
            setMobileMenuOpen(false);
          }}
        >
          <span className="settings-symbol" aria-hidden="true">⚙️</span>
          <div>
            <strong>{activeSignedInUser ? activeSignedInUser.name : "Profile & Settings"}</strong>
            <p>{activeSignedInUser ? "Google connected" : `${profileRegion} learner`}</p>
          </div>
        </button>
        )}
      </aside>

      <section className="main-panel">
        <header className="topbar">
          <div>
            <button
              className="mobile-menu-button"
              type="button"
              onClick={() => {
                if (window.matchMedia("(max-width: 1080px)").matches) {
                  setSidebarCollapsed(false);
                  setMobileMenuOpen((current) => !current);
                } else {
                  setSidebarCollapsed((current) => !current);
                }
              }}
            >
              ☰
            </button>
            <p className="alert-label">ELECTION LEARNING WORKSPACE</p>
            <h1>{navItems.find((item) => item.id === activeView)?.label || "Profile & Settings"}</h1>
            <p>{notice}</p>
          </div>
          <div className="topbar-actions">
            <button className={demoMode ? "demo-active" : ""} type="button" onClick={runDemoMode}>
              {demoMode ? "Demo Mode On" : "Start Demo Mode"}
            </button>
            <button type="button" onClick={() => setActiveView("tutor")}>Open AI Tutor</button>
          </div>
        </header>

        <AnimatePresence mode="wait">
        {activeView === "dashboard" && (
          <motion.section className="view-stack" key="dashboard" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.28 }}>
            <article className="card command-hero">
              <div>
                <span className="badge green">CIVIC COMMAND CENTER</span>
                <h2>Election learning that reacts to every voter journey</h2>
                <p>Run the AI tutor, generate topic-based quizzes, test misinformation, and simulate voting from one focused workspace.</p>
                <div className="hero-pills">
                  <span>AI tutor</span>
                  <span>10-question quiz</span>
                  <span>Vote simulator</span>
                  <span>Misinfo check</span>
                </div>
              </div>
              <div className="hero-actions">
                <button className="primary-button" type="button" onClick={() => setActiveView("tutor")}>Launch tutor</button>
                <button className="secondary-button" type="button" onClick={() => setActiveView("quiz")}>Create quiz</button>
              </div>
            </article>
            {onboardingVisible && (
              <article className="card onboarding-card">
                <div>
                  <span className="badge purple">QUICK START</span>
                  <h2>Build your election learning path</h2>
                  <p>Pick a learner type and CivicAI will tune the tutor, quiz lab, and suggestions around your goal.</p>
                </div>
                <div className="onboarding-actions">
                  <button type="button" onClick={() => chooseLearnerPath("First-time voter", "Become election-ready")}>
                    First-time voter
                  </button>
                  <button type="button" onClick={() => chooseLearnerPath("School student", "Understand election basics")}>
                    School student
                  </button>
                  <button type="button" onClick={() => chooseLearnerPath("Civic volunteer", "Fight misinformation and explain voting")}>
                    Civic volunteer
                  </button>
                </div>
              </article>
            )}
            <article className="card journey-card">
              <div className="card-title"><h2>Election-ready journey</h2><span className="badge green">INTERACTIVE</span></div>
              <div className="journey-steps">
                {[
                  { label: "Basics", view: "tutor" as View },
                  { label: "Voting", view: "simulator" as View },
                  { label: "Rights", view: "quiz" as View },
                  { label: "Fake news", view: "detector" as View },
                  { label: "Badge", view: "quiz" as View },
                ].map((step, index) => (
                  <button key={step.label} className={progress[index] ? "complete" : ""} type="button" onClick={() => setActiveView(step.view)}>
                    <span>{index + 1}</span>
                    {step.label}
                  </button>
                ))}
              </div>
            </article>
            <div className="metrics-grid">
              <article className="metric-card">
                <div className="ring" style={{ "--score": readiness } as React.CSSProperties}>
                  <span>{readiness}%</span>
                  <small>READY</small>
                </div>
                <div className="risk-scale"><span>Weak areas</span><span>Learning</span><span>Mastered</span></div>
              </article>
              <article className="card">
                <div className="card-title"><h2>Analytics dashboard</h2><span className="badge green">LIVE</span></div>
                {["Quiz accuracy", "Topics mastered", "Fake-news awareness", "Profile completion"].map((label, index) => {
                  const value = [quizScore * 25, 64, newsResult ? 88 : 42, profileSaved ? 100 : 55][index];
                  return <ProgressBar key={label} label={label} value={value} />;
                })}
              </article>
            </div>
            <div className="feature-grid">
              <FeatureButton title="AI Election Tutor" text="Voice input, chat history, follow-up questions" onClick={() => setActiveView("tutor")} />
              <FeatureButton title="Smart Voting Simulator" text="Candidate cards, vote button, live chart, secure demo ID" onClick={() => setActiveView("simulator")} />
              <FeatureButton title="Fake News Detector" text="Paste claims and detect misleading election content" onClick={() => setActiveView("detector")} />
              <FeatureButton title="Manifesto Analyzer" text="Summarize promises, sentiment, and voter questions" onClick={() => setActiveView("manifesto")} />
            </div>
            <article className="card">
              <div className="card-title"><h2>Personalized learning path</h2><span className="badge purple">{profileRegion}</span></div>
              <div className="path-grid">
                {dailyPlan.map((item, index) => (
                  <button key={item} type="button" className={progress[index] ? "done" : ""} onClick={() => setProgress((current) => ({ ...current, [index]: !current[index] }))}>
                    <span>Day {index + 1}</span>{item.replace(`Day ${index + 1}: `, "")}
                  </button>
                ))}
              </div>
            </article>
            <article className="card">
              <div className="card-title"><h2>Smart AI suggestions</h2><span className="badge green">PERSONALIZED</span></div>
              <div className="suggestion-grid">
                {smartSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => {
                      setChatInput(`Teach me about ${suggestion} for ${profileRegion}`);
                      setActiveView("tutor");
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </article>
          </motion.section>
        )}

        {activeView === "tutor" && (
          <motion.section className="two-column tutor-layout" key="tutor" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.28 }}>
            <article className="card tutor-card">
              <div className="card-title"><h2>AI Election Tutor</h2><span className="badge green">VOICE + CHAT</span></div>
              <div className="chat-window">
                {chatHistory.map((message, index) => {
                  const isActiveReading =
                    isReading && message.role === "assistant" && message.text === readingText && index === chatHistory.length - 1;

                  return (
                    <motion.div layout key={`${message.role}-${index}`} className={`chat ${message.role} ${isActiveReading ? "reading" : ""}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24 }}>
                      {isActiveReading ? <ReadingText text={cleanAiText(message.text)} charIndex={readingCharIndex} /> : <FormattedOutput text={message.text} />}
                    </motion.div>
                  );
                })}
                {aiTyping && <TypingIndicator />}
              </div>
              <div className="chat-input-row">
                <input value={chatInput} onChange={(event) => setChatInput(event.target.value)} onKeyDown={(event) => event.key === "Enter" && sendChat()} />
                <button type="button" onClick={startVoiceInput}>{isListening ? "Listening..." : "Mic"}</button>
                <button type="button" onClick={() => sendChat()}>Send</button>
                <button type="button" onClick={speakLastAnswer}>Speak</button>
              </div>
            </article>
            <article className="card tutor-side-panel">
              <div className="card-title"><h2>Try these prompts</h2><span className="badge purple">FOLLOW-UP</span></div>
              {["Explain Indian election system", "Who are major parties?", "How does EVM work?", "What are voter rights?"].map((prompt) => (
                <button className="wide-action" key={prompt} type="button" onClick={() => sendChat(prompt)}>{prompt}</button>
              ))}
              <div className="key-points-panel">
                <strong>Answer map</strong>
                <button type="button" onClick={() => sendChat(`Give me a 5-step timeline for ${profileRegion} election readiness`)}>
                  Timeline breakdown
                </button>
                <button type="button" onClick={() => sendChat("Quiz me after explaining voter rights")}>
                  Teach then quiz
                </button>
                <button type="button" onClick={() => setActiveView("quiz")}>
                  Open Quiz Lab
                </button>
              </div>
              <div className={`reading-guide ${isReading ? "active" : ""}`}>
                <strong>{isReading ? "AI Tutor is reading now" : "Reading guide"}</strong>
                <p>Follow the answer in this order while listening:</p>
                <ol>
                  <li>Simple explanation</li>
                  <li>Step-by-step breakdown</li>
                  <li>Example</li>
                  <li>Follow-up question</li>
                </ol>
              </div>
            </article>
          </motion.section>
        )}

        {activeView === "simulator" && (
          <section className="view-stack">
            <div className="candidate-grid">
              {candidates.map((candidate) => (
                <article className="card candidate-card" key={candidate.id}>
                  <div className="candidate-avatar" style={{ background: candidate.color }}>{candidate.name.slice(0, 1)}</div>
                  <h2>{candidate.name}</h2>
                  <p>{candidate.party}</p>
                  <div className="chips">{candidate.focus.map((focus) => <span key={focus}>{focus}</span>)}</div>
                  <button className="secondary-button" type="button" onClick={() => explainCandidateFit(candidate)} disabled={fitLoading}>
                    Why choose this candidate?
                  </button>
                  <button className="primary-button" type="button" onClick={() => setPendingVote(candidate)} disabled={Boolean(votedFor)}>
                    {votedFor === candidate.id ? "Vote recorded" : votedFor ? "Voting locked" : "Vote"}
                  </button>
                </article>
              ))}
            </div>
            <div className="two-column">
              <article className="card">
                <div className="card-title"><h2>Live results chart</h2><span className="badge green">{totalVotes} votes</span></div>
                {candidates.map((candidate) => <ProgressBar key={candidate.id} label={candidate.name} value={Math.round((votes[candidate.id] / totalVotes) * 100)} />)}
              </article>
              <article className="card">
                <div className="card-title"><h2>AI profile fit</h2><span className="badge purple">GEMINI</span></div>
                <FormattedOutput text={fitReason || `Based on your goal, ${bestFit.name} may fit your profile because their focus areas include ${bestFit.focus.join(", ")}.`} />
                <p className="muted">Secure voting demo ID: {lastVote || "Cast a vote to generate a transparent transaction ID."}</p>
                <button className="secondary-button" type="button" onClick={() => explainCandidateFit(bestFit)} disabled={fitLoading}>
                  Generate AI fit for best match
                </button>
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => {
                    setChatInput(`Explain whether ${bestFit.name} fits my voter profile: ${learningGoal}`);
                    setActiveView("tutor");
                  }}
                >
                  Continue in AI Tutor
                </button>
              </article>
            </div>
            <VisualCharts
              values={candidates.map((candidate) => Math.round((votes[candidate.id] / totalVotes) * 100))}
              labels={candidates.map((candidate) => candidate.name.split(" ")[0])}
            />
            {pendingVote && (
              <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Confirm vote">
                <article className="card confirm-modal">
                  <div className="card-title"><h2>Confirm your demo vote</h2><span className="badge purple">ONE VOTE</span></div>
                  <p>You are about to cast a demo vote for <strong>{pendingVote.name}</strong>. This simulator prevents multiple votes in the same session.</p>
                  <div className="modal-actions">
                    <button className="secondary-button" type="button" onClick={() => setPendingVote(null)}>Cancel</button>
                    <button className="primary-button" type="button" onClick={castVote}>Confirm vote</button>
                  </div>
                </article>
              </div>
            )}
          </section>
        )}

        {activeView === "compare" && (
          <section className="view-stack">
            <article className="card compare-controls">
              <select value={candidateA} onChange={(event) => setCandidateA(event.target.value)}>{candidates.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
              <select value={candidateB} onChange={(event) => setCandidateB(event.target.value)}>{candidates.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
            </article>
            <div className="two-column">
              <CandidateReport candidate={selectedA} />
              <CandidateReport candidate={selectedB} />
            </div>
          </section>
        )}

        {activeView === "detector" && <TextAnalyzer title="Fake News Detector" badge="MISINFO CHECK" text={newsText} setText={setNewsText} result={newsResult} run={runNewsCheck} placeholder="Paste election news or social media claim..." />}
        {activeView === "manifesto" && <TextAnalyzer title="Manifesto Analyzer" badge="POLICY SUMMARY" text={manifestoText} setText={setManifestoText} result={manifestoResult} run={runManifesto} placeholder="Paste manifesto text..." />}
        {activeView === "bias" && <TextAnalyzer title="Bias Detector" badge="SPEECH CHECK" text={biasText} setText={setBiasText} result={biasResult} run={runBiasCheck} placeholder="Paste political speech, article, or campaign text..." />}

        {activeView === "quiz" && (
          <motion.section className="card quiz-lab-card" key="quiz" initial={{ opacity: 0, x: 28, y: 8 }} animate={{ opacity: 1, x: 0, y: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.3, ease: "easeOut" }}>
            <div className="quiz-topline">
              <span>Question {Math.min(currentQuizIndex + 1, quiz.length)} of {quiz.length}</span>
              <span>{answeredCount} answered</span>
            </div>
            <div className="quiz-progress-track" aria-hidden="true">
              <i style={{ width: `${((currentQuizIndex + 1) / Math.max(quiz.length, 1)) * 100}%` }} />
            </div>
            <div className="card-title"><h2>Quiz Lab</h2><span className="badge green">SCORE {quizScore}/{quiz.length}</span></div>
            <div className="compare-controls quiz-controls">
              <input value={quizTopic} onChange={(event) => setQuizTopic(event.target.value)} placeholder="Enter quiz title or topic" />
              <select value={difficulty} onChange={(event) => setDifficulty(event.target.value as "Easy" | "Medium" | "Hard")}><option>Easy</option><option>Medium</option><option>Hard</option></select>
              <button className="primary-button" type="button" onClick={generateQuiz} disabled={generatingQuiz}>{generatingQuiz ? "Generating..." : "Generate quiz"}</button>
            </div>
            {quizCompleted && (
              <article className={`certificate-card ${badgeUnlocked ? "unlocked" : ""}`}>
                <div>
                  <span className="badge green">{badgeUnlocked ? "BADGE UNLOCKED" : "KEEP LEARNING"}</span>
                  <h2>{badgeUnlocked ? "CivicAI Election Ready Badge" : "Almost election-ready"}</h2>
                  <p>{profileName} scored {quizScore}/{quiz.length} in {profileRegion}. {badgeUnlocked ? "You can explain key election safety basics." : "Review the explanations and try again to unlock the badge."}</p>
                </div>
                <button type="button" onClick={() => setActiveView("analytics")}>View progress</button>
              </article>
            )}
            <AnimatePresence mode="wait">
              <motion.article className="quiz-card quiz-question-card quiz-flash-card" key={`${currentQuizIndex}-${currentQuestion.question}`} initial={{ opacity: 0, x: 32, scale: 0.98 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: -24, scale: 0.98 }} transition={{ duration: 0.25 }}>
                <div className="quiz-question-heading">
                  <span>{currentQuizIndex + 1}.</span>
                  <strong>{cleanQuizQuestion(currentQuestion.question)}</strong>
                </div>
                <div className="option-grid">
                  {currentQuestion.options.map((option, optionIndex) => {
                    const selected = answers[currentQuizIndex];
                    const isSelected = selected === optionIndex;
                    const isCorrect = selected !== undefined && optionIndex === currentQuestion.answer;
                    const isIncorrect = isSelected && optionIndex !== currentQuestion.answer;
                    const className = [isSelected ? "selected" : "", isCorrect ? "correct" : "", isIncorrect ? "incorrect" : ""].filter(Boolean).join(" ");
                    return (
                      <motion.button
                        className={className}
                        key={option}
                        type="button"
                        onClick={() => answerQuizOption(optionIndex)}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.985 }}
                      >
                        <span className="radio-dot" aria-hidden="true" />
                        {option}
                      </motion.button>
                    );
                  })}
                </div>
                {answers[currentQuizIndex] !== undefined && <p className="muted">{currentQuestion.explanation}</p>}
              </motion.article>
            </AnimatePresence>
            <div className="quiz-nav-row">
              <button className="secondary-button" type="button" onClick={() => setCurrentQuizIndex((current) => Math.max(0, current - 1))} disabled={currentQuizIndex === 0}>
                Previous
              </button>
              <button className="primary-button" type="button" onClick={() => setCurrentQuizIndex((current) => Math.min(quiz.length - 1, current + 1))} disabled={currentQuizIndex >= quiz.length - 1}>
                Next
              </button>
            </div>
          </motion.section>
        )}

        {activeView === "analytics" && (
          <section className="view-stack">
            <div className="two-column">
              <article className="card"><div className="card-title"><h2>Score trends</h2><span className="badge green">TRACKING</span></div>{[55, 62, 74, readiness].map((v, i) => <ProgressBar key={i} label={`Session ${i + 1}`} value={v} />)}<VisualCharts values={[55, 62, 74, readiness]} labels={["S1", "S2", "S3", "Now"]} /></article>
              <article className="card"><div className="card-title"><h2>Region-based content</h2><span className="badge purple">{profileRegion}</span></div><select value={profileRegion} onChange={(e) => setProfileRegion(e.target.value)}>{states.map((s) => <option key={s}>{s}</option>)}</select><p className="muted region-copy">Election types: {selectedRegionDetails.electionType}</p><div className="local-grid"><article><strong>Local issues</strong>{selectedRegionDetails.issues.map((issue) => <span key={issue}>{issue}</span>)}</article><article><strong>Sample candidates</strong>{selectedRegionDetails.candidates.map((candidate) => <span key={candidate}>{candidate}</span>)}</article></div></article>
            </div>
            <article className="card"><div className="card-title"><h2>Bias detector demo</h2><span className="badge red">SPEECH CHECK</span></div><p>This module flags loaded language, one-sided claims, missing sources, and emotional manipulation in election speeches or articles.</p><ProgressBar label="Potential bias in sample claim" value={68} /><VisualCharts values={[68, 22, 10]} labels={["Bias", "Neutral", "Missing"]} /></article>
            <article className="card">
              <div className="card-title"><h2>AI learning insight</h2><span className="badge green">GEMINI</span></div>
              <FormattedOutput text={analyticsInsight} />
              <button className="primary-button insight-button" type="button" onClick={generateAnalyticsInsight} disabled={analyticsLoading}>
                {analyticsLoading ? "Generating..." : "Generate AI insight"}
              </button>
            </article>
          </section>
        )}

        {activeView === "settings" && (
          <section className="two-column">
            <article className="card profile-card">
              <div className="card-title"><h2>Learner profile</h2><span className="badge green">PERSONALIZED</span></div>
              <GoogleSignInCard
                key="google-sign-in-card-v4"
                setSignedInUser={setSignedInUser}
                setNotice={setNotice}
              />
              <label>Display name</label><input value={profileName} onChange={(event) => setProfileName(event.target.value)} />
              <label>Region</label><input value={profileRegion} onChange={(event) => setProfileRegion(event.target.value)} />
              <label>Learning goal</label><input value={learningGoal} onChange={(event) => setLearningGoal(event.target.value)} />
              <label>Learner level</label><select value={level} onChange={(event) => setLevel(event.target.value as Level)}><option>First-time voter</option><option>School student</option><option>College learner</option><option>Civic volunteer</option></select>
              <button className="primary-button" type="button" onClick={() => {
                const profile = { learningGoal, level, profileName, profileRegion };
                localStorage.setItem("userProfile", JSON.stringify(profile));
                setProfileSaved(true);
                setNotice("✅ Profile updated successfully. Your AI experience is now personalized.");
              }}>Save profile</button>
              {profileSaved && <p className="save-confirmation">✅ Profile updated successfully.</p>}
            </article>
            <article className="card"><div className="card-title"><h2>Your AI Experience</h2><span className="badge purple">PERSONALIZED</span></div><div className="experience-grid"><article><span>Region</span><strong>{profileRegion}</strong></article><article><span>Level</span><strong>{level}</strong></article><article><span>Focus</span><strong>{learningGoal}</strong></article><article><span>Saved progress</span><strong>{activeSignedInUser ? "Enabled" : "Sign in to enable"}</strong></article></div></article>
          </section>
        )}
        </AnimatePresence>
      </section>
    </main>
  );
}

function GoogleSignInCard({
  setNotice,
  setSignedInUser,
}: {
  setNotice: (notice: string) => void;
  setSignedInUser: (user: SignedInUser | null) => void;
}) {
  const [chooserOpen, setChooserOpen] = useState(false);
  const [accountEmail, setAccountEmail] = useState("");
  const [accountName, setAccountName] = useState("");

  const signInWithGoogle = () => {
    setChooserOpen(true);
    setNotice("Choose an account to continue with Google.");
  };

  const connectSelectedAccount = () => {
    const fallbackEmail = "learner@civicai.local";
    const email = accountEmail.trim() || fallbackEmail;
    const name = accountName.trim() || email.split("@")[0] || "Google Learner";
    const user = { email, name };
    localStorage.setItem("signedInUser", JSON.stringify(user));
    setSignedInUser(user);
    setChooserOpen(false);
    setNotice("Google account selected. Profile, quiz scores, and progress will be saved locally.");
  };

  return (
    <>
      <section className="google-card">
        <div>
          <strong>Google Sign-In</strong>
          <p>Use your Google account to save profile, quiz scores, progress, and personalization.</p>
        </div>
        <button className="custom-google-button" type="button" onClick={signInWithGoogle}>
          <img
            alt=""
            aria-hidden="true"
            className="google-logo"
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          />
          Sign in with Google
        </button>
      </section>
      {chooserOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Choose Google account">
          <article className="card confirm-modal google-chooser">
            <div className="google-chooser-title">
              <img alt="" aria-hidden="true" className="google-logo" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" />
              <div>
                <h2>Choose an account</h2>
                <p>to continue to CivicAI</p>
              </div>
            </div>
            <label>Email</label>
            <input value={accountEmail} onChange={(event) => setAccountEmail(event.target.value)} placeholder="yourname@gmail.com" />
            <label>Name</label>
            <input value={accountName} onChange={(event) => setAccountName(event.target.value)} placeholder="Your name" />
            <div className="modal-actions">
              <button className="secondary-button" type="button" onClick={() => setChooserOpen(false)}>Cancel</button>
              <button className="primary-button" type="button" onClick={connectSelectedAccount}>Continue</button>
            </div>
          </article>
        </div>
      )}
    </>
  );
}

function FeatureButton({ title, text, onClick }: { title: string; text: string; onClick: () => void }) {
  return (
    <motion.button className="feature-button" type="button" onClick={onClick} whileHover={{ y: -5, scale: 1.01 }} whileTap={{ scale: 0.98 }}>
      <strong>{title}</strong>
      <span>{text}</span>
    </motion.button>
  );
}

function CandidateReport({ candidate }: { candidate: Candidate }) {
  return <motion.article className="card candidate-report" whileHover={{ y: -4 }}><div className="card-title"><h2>{candidate.name}</h2><span className="badge purple">{candidate.party}</span></div><strong>Strengths</strong><ul>{candidate.strengths.map((item) => <li key={item}>{item}</li>)}</ul><strong>Weaknesses</strong><ul>{candidate.weaknesses.map((item) => <li key={item}>{item}</li>)}</ul><strong>Policies</strong>{Object.entries(candidate.policies).map(([key, value]) => <p key={key}><b>{key}:</b> {value}</p>)}</motion.article>;
}

function TextAnalyzer({ title, badge, text, setText, result, run, placeholder }: { title: string; badge: string; text: string; setText: (text: string) => void; result: string; run: () => void; placeholder: string }) {
  const isBias = title.toLowerCase().includes("bias");
  const isFake = title.toLowerCase().includes("fake");
  const values = isBias ? [64, 24, 12] : isFake ? [58, 28, 14] : [72, 18, 10];
  const labels = isBias ? ["Biased", "Neutral", "Missing"] : isFake ? ["Misleading", "Unclear", "Credible"] : ["Positive", "Neutral", "Risk"];

  return <motion.section className="view-stack analyzer-stack" key={title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.28 }}><article className="card analyzer-card"><div className="card-title"><h2>{title}</h2><span className="badge red">{badge}</span></div><textarea value={text} onChange={(event) => setText(event.target.value)} placeholder={placeholder} /><button className="primary-button" type="button" onClick={run}>Analyze</button></article><article className="card prompt-card"><div className="card-title"><h2>AI Output</h2><span className="badge green">RESULT</span></div><FormattedOutput text={result} fallback="Run analysis to see output here." /></article>{result && <VisualCharts values={values} labels={labels} />}</motion.section>;
}

function TypingIndicator() {
  return (
    <motion.div className="chat assistant typing-indicator" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <span />
      <span />
      <span />
      AI is thinking
    </motion.div>
  );
}

function ReadingText({ text, charIndex }: { text: string; charIndex: number }) {
  const pieces = text.match(/\S+\s*|\s+/g) || [text];
  const ranges = pieces.map((piece, index) => {
    const start = pieces.slice(0, index).join("").length;
    return { end: start + piece.length, start };
  });
  const activeIndex = ranges.findIndex((range) => charIndex >= range.start && charIndex <= range.end);

  return (
    <>
      {pieces.map((piece, index) => (
        <span key={`${piece}-${index}`} className={index === Math.max(activeIndex, 0) && piece.trim() ? "spoken-word" : ""}>
          {piece}
        </span>
      ))}
    </>
  );
}

declare global {
  interface Window {
    google?: {
      accounts?: {
        oauth2?: {
          initTokenClient: (config: {
            callback: (response: { access_token?: string }) => void;
            client_id: string;
            scope: string;
          }) => {
          requestAccessToken: (options?: { prompt?: string }) => void;
          };
        };
      };
    };
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }

  interface SpeechRecognition {
    lang: string;
    interimResults: boolean;
    onstart: (() => void) | null;
    onend: (() => void) | null;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    start: () => void;
  }
}
