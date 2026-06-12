import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getStudentName } from "@/lib/sim/storage";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Quiz — HeatQuest" },
      { name: "description", content: "Test your knowledge of heat, cooling, and thermal properties of materials." },
    ],
  }),
  component: QuizPage,
});

interface Question {
  q: string;
  options: string[];
  correctIndex: number;
  explain: string;
}

const QUESTIONS: Question[] = [
  {
    q: "Which material heats up the FASTEST when placed on a hot plate?",
    options: ["Wood", "Metal", "Water", "Wax"],
    correctIndex: 1,
    explain: "Metals have very high thermal conductivity, so heat moves through them quickly compared to insulators like wood, wax, or water.",
  },
  {
    q: "Water has a HIGH specific heat capacity. What does this mean?",
    options: [
      "It boils very easily",
      "It changes temperature slowly",
      "It freezes immediately",
      "It conducts electricity well",
    ],
    correctIndex: 1,
    explain: "High specific heat capacity means a lot of energy is needed to change its temperature, so water warms up and cools down slowly.",
  },
  {
    q: "At what temperature does pure water FREEZE?",
    options: ["100°C", "25°C", "0°C", "-10°C"],
    correctIndex: 2,
    explain: "Water freezes at 0°C and boils at 100°C at normal atmospheric pressure.",
  },
  {
    q: "Why does chocolate melt in your hand so easily?",
    options: [
      "Your hand is very hot",
      "Chocolate melts around body temperature (~34°C)",
      "Chocolate has high thermal conductivity",
      "Chocolate is a liquid already",
    ],
    correctIndex: 1,
    explain: "Chocolate's melting point is close to body temperature (~34°C), so the warmth of your hand is enough to melt it.",
  },
  {
    q: "Which of these is the BEST insulator (poor heat conductor)?",
    options: ["Copper", "Iron", "Wood", "Glass"],
    correctIndex: 2,
    explain: "Wood has very low thermal conductivity (~0.12 W/m·K), making it a great insulator. Metals like copper and iron are conductors.",
  },
  {
    q: "What happens to wood when it is heated to very high temperatures?",
    options: [
      "It melts into liquid wood",
      "It burns and turns into charcoal",
      "It becomes a gas instantly",
      "Nothing changes",
    ],
    correctIndex: 1,
    explain: "Unlike wax or chocolate, wood does not melt — it burns (a chemical change) and turns into charcoal and ash.",
  },
  {
    q: "When water boils into steam, this change of state is called…",
    options: ["Melting", "Freezing", "Evaporation / Vaporization", "Condensation"],
    correctIndex: 2,
    explain: "Liquid turning into gas is called evaporation (or vaporization when it's fast, like boiling). Freezing is liquid→solid; condensation is gas→liquid.",
  },
];

type Phase = "intro" | "instructions" | "quiz" | "result";

function QuizPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => QUESTIONS.map(() => null));
  const [picked, setPicked] = useState<number | null>(null);

  useEffect(() => {
    const n = getStudentName();
    if (!n) {
      navigate({ to: "/" });
      return;
    }
    setName(n);
  }, [navigate]);

  function startQuiz() {
    setIndex(0);
    setAnswers(QUESTIONS.map(() => null));
    setPicked(null);
    setPhase("quiz");
  }

  function next() {
    if (picked === null) return;
    const newAnswers = [...answers];
    newAnswers[index] = picked;
    setAnswers(newAnswers);
    if (index + 1 >= QUESTIONS.length) {
      setPhase("result");
    } else {
      setIndex(index + 1);
      setPicked(null);
    }
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 backdrop-blur bg-background/80 border-b-2 border-border">
        <div className="mx-auto max-w-3xl px-4 py-3 flex items-center justify-between">
          <Link to="/experiment" className="flex items-center gap-2 font-bold text-lg">
            <span aria-hidden>🔥❄️</span> <span>HeatQuest</span>
          </Link>
          <Link to="/experiment" className="btn-pop bg-card text-foreground px-3 py-1.5 text-sm">
            ← Experiment
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        {phase === "intro" && <Intro name={name} onContinue={() => setPhase("instructions")} />}
        {phase === "instructions" && <Instructions onStart={startQuiz} />}
        {phase === "quiz" && (
          <QuestionView
            index={index}
            total={QUESTIONS.length}
            question={QUESTIONS[index]}
            picked={picked}
            setPicked={setPicked}
            onNext={next}
          />
        )}
        {phase === "result" && <Result name={name} answers={answers} onRestart={startQuiz} />}
      </main>
    </div>
  );
}

function Intro({ name, onContinue }: { name: string; onContinue: () => void }) {
  return (
    <button
      type="button"
      onClick={onContinue}
      className="card-pop w-full p-8 text-left float-up hover:-translate-y-0.5 transition-transform"
      aria-label="Click anywhere to continue"
    >
      <div className="text-5xl mb-4 wiggle inline-block" aria-hidden>🧠</div>
      <h1 className="text-3xl font-bold">
        So <span className="text-primary">{name || "Scientist"}</span>, ready for the challenge?
      </h1>
      <p className="mt-3 text-muted-foreground leading-relaxed">
        Hope you had fun melting chocolate, boiling water and glowing some metal in the experiment lab! Now let&apos;s see how much you remember with a quick 7-question quiz. No pressure — every wrong answer comes with a friendly explanation so you actually learn.
      </p>
      <p className="mt-6 font-bold text-primary">👉 Click anywhere on this card to continue</p>
    </button>
  );
}

function Instructions({ onStart }: { onStart: () => void }) {
  return (
    <div className="card-pop p-8 float-up">
      <h2 className="text-2xl font-bold mb-3">📋 Quiz Instructions</h2>
      <ul className="space-y-2 text-sm sm:text-base list-disc pl-5">
        <li>You will see <strong>7 questions</strong>, one at a time.</li>
        <li>For each question, choose <strong>one answer</strong> from the options.</li>
        <li>Click <strong>Next</strong> to move forward — you can&apos;t go back, so think before you click!</li>
        <li>You won&apos;t see if you&apos;re right or wrong during the quiz.</li>
        <li>At the end you&apos;ll see your <strong>scorecard</strong> with explanations for every question.</li>
        <li>Refreshing this page will restart only the quiz (not the whole app).</li>
      </ul>
      <button onClick={onStart} className="btn-pop bg-primary text-primary-foreground px-6 py-3 mt-6 w-full sm:w-auto">
        🚀 Click to Start the Quiz
      </button>
    </div>
  );
}

function QuestionView({
  index, total, question, picked, setPicked, onNext,
}: {
  index: number; total: number; question: Question;
  picked: number | null; setPicked: (i: number) => void; onNext: () => void;
}) {
  const progress = ((index) / total) * 100;
  return (
    <div className="card-pop p-6 sm:p-8 float-up" key={index}>
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-2">
          <span>Question {index + 1} of {total}</span>
          <span>{Math.round(progress)}% done</span>
        </div>
        <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
          <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold mb-5">{question.q}</h2>

      <div role="radiogroup" aria-label={question.q} className="space-y-2">
        {question.options.map((opt, i) => {
          const active = picked === i;
          return (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setPicked(i)}
              className={`w-full text-left rounded-xl border-2 p-4 transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40 ${
                active
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <span className="font-bold mr-2 text-primary">{String.fromCharCode(65 + i)}.</span>
              {opt}
            </button>
          );
        })}
      </div>

      <button
        onClick={onNext}
        disabled={picked === null}
        className="btn-pop bg-primary text-primary-foreground px-6 py-3 mt-6 w-full sm:w-auto disabled:opacity-50"
      >
        {index + 1 === total ? "Finish & See Score →" : "Next →"}
      </button>
    </div>
  );
}

function Result({ name, answers, onRestart }: { name: string; answers: (number | null)[]; onRestart: () => void }) {
  const correctCount = answers.reduce<number>((acc, a, i) => acc + (a === QUESTIONS[i].correctIndex ? 1 : 0), 0);
  const total = QUESTIONS.length;
  const pct = Math.round((correctCount / total) * 100);

  const tier =
    pct === 100 ? { emoji: "🏆", label: "Perfect Score!", color: "text-success" } :
    pct >= 70  ? { emoji: "🌟", label: "Great Work!",     color: "text-success" } :
    pct >= 40  ? { emoji: "💪", label: "Good Try!",       color: "text-warning" } :
                  { emoji: "📘", label: "Keep Learning!",  color: "text-primary" };

  return (
    <div className="space-y-4">
      <div className="card-pop p-8 text-center float-up">
        <div className="text-6xl mb-2">{tier.emoji}</div>
        <h2 className={`text-3xl font-bold ${tier.color}`}>{tier.label}</h2>
        <p className="mt-2 text-muted-foreground">Well done, {name}!</p>
        <div className="mt-5 text-5xl font-bold">
          {correctCount} <span className="text-2xl text-muted-foreground">/ {total}</span>
        </div>
        <div className="text-sm font-semibold text-muted-foreground mt-1">{pct}% correct</div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={onRestart} className="btn-pop bg-primary text-primary-foreground px-5 py-2.5">
            🔁 Retake Quiz
          </button>
          <Link to="/experiment" className="btn-pop bg-card text-foreground px-5 py-2.5">
            ← Back to Experiment
          </Link>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-xl font-bold px-1">📋 Your Scorecard</h3>
        {QUESTIONS.map((q, i) => {
          const picked = answers[i];
          const isCorrect = picked === q.correctIndex;
          return (
            <div key={i} className={`card-pop p-5 border-l-8 ${isCorrect ? "border-l-success" : "border-l-destructive"}`}>
              <div className="flex items-start gap-2">
                <span className="text-2xl" aria-hidden>{isCorrect ? "✅" : "❌"}</span>
                <div className="flex-1">
                  <div className="font-bold">Q{i + 1}. {q.q}</div>
                  <div className="mt-2 text-sm">
                    <div>
                      <span className="font-semibold text-muted-foreground">Your answer: </span>
                      <span className={isCorrect ? "text-success font-semibold" : "text-destructive font-semibold"}>
                        {picked !== null ? q.options[picked] : "—"}
                      </span>
                    </div>
                    {!isCorrect && (
                      <div className="mt-1">
                        <span className="font-semibold text-muted-foreground">Correct answer: </span>
                        <span className="text-success font-semibold">{q.options[q.correctIndex]}</span>
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-sm bg-secondary/60 rounded-lg p-3 border border-border">
                    💡 {q.explain}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
