import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { setStudentName, getStudentName } from "@/lib/sim/storage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HeatQuest — Heat & Cool Materials Simulator" },
      { name: "description", content: "An interactive science simulator for grades 6–9. Explore how materials heat, cool, melt, freeze and boil." },
      { property: "og:title", content: "HeatQuest — Heat & Cool Materials Simulator" },
      { property: "og:description", content: "Predict, experiment and learn about thermal properties of everyday materials." },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  const navigate = useNavigate();
  const [name, setName] = useState(getStudentName());
  const [error, setError] = useState("");

  function start(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError("Please enter at least 2 letters.");
      return;
    }
    setStudentName(trimmed);
    navigate({ to: "/experiment" });
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="card-pop w-full max-w-xl p-8 sm:p-12 float-up">
        <div className="text-center">
          <div className="inline-block wiggle text-6xl sm:text-7xl mb-3" aria-hidden>🔥❄️</div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
            Welcome to <span className="text-primary">HeatQuest</span>
          </h1>
          <p className="mt-3 text-base sm:text-lg text-muted-foreground">
            A fun science adventure where you heat, cool and discover how everyday materials change!
          </p>
        </div>

        <form onSubmit={start} className="mt-8 space-y-4">
          <label htmlFor="name" className="block text-sm font-semibold text-foreground">
            Please enter your name to begin
          </label>
          <input
            id="name"
            type="text"
            autoFocus
            value={name}
            onChange={(e) => { setName(e.target.value); setError(""); }}
            placeholder="e.g. Aarav"
            className="w-full rounded-full border-2 border-border bg-background px-5 py-3 text-lg outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring"
            maxLength={30}
            aria-describedby={error ? "name-error" : undefined}
          />
          {error && <p id="name-error" className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            className="btn-pop w-full bg-primary px-6 py-3 text-lg text-primary-foreground"
          >
            Let&apos;s Begin →
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          For students of grades 6–9. Best viewed on a laptop or tablet.
        </p>
      </div>
    </main>
  );
}
