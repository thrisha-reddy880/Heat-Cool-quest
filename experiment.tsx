import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { MATERIALS, currentState, type Material } from "@/lib/sim/materials";
import { getStudentName } from "@/lib/sim/storage";

export const Route = createFileRoute("/experiment")({
  head: () => ({
    meta: [
      { title: "Experiment — HeatQuest" },
      { name: "description", content: "Pick a material and discover what happens when you heat or cool it." },
    ],
  }),
  component: ExperimentPage,
});

type Mode = "idle" | "heating" | "cooling";

function ExperimentPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [temp, setTemp] = useState(25);
  const [mode, setMode] = useState<Mode>("idle");
  const tickRef = useRef<number | null>(null);
  const setupRef = useRef<HTMLDivElement | null>(null);

  // Read name on client; redirect home if missing
  useEffect(() => {
    const n = getStudentName();
    if (!n) {
      navigate({ to: "/" });
      return;
    }
    setName(n);
  }, [navigate]);

  const material = selectedId ? MATERIALS.find((m) => m.id === selectedId) ?? null : null;

  // Reset temp when selecting a new material
  useEffect(() => {
    if (material) {
      setTemp(material.startTemp);
      setMode("idle");
      // scroll to setup
      setTimeout(() => setupRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
    }
  }, [selectedId]); // eslint-disable-line

  // Temperature simulation loop
  useEffect(() => {
    if (!material || mode === "idle") return;
    const intervalMs = 120;
    const id = window.setInterval(() => {
      setTemp((t) => {
        const step = material.responseRate * (intervalMs / 1000) * 4;
        if (mode === "heating") {
          const next = Math.min(material.maxTemp, t + step);
          if (next >= material.maxTemp) setMode("idle");
          return Math.round(next * 10) / 10;
        } else {
          const next = Math.max(material.minTemp, t - step);
          if (next <= material.minTemp) setMode("idle");
          return Math.round(next * 10) / 10;
        }
      });
    }, intervalMs);
    tickRef.current = id;
    return () => window.clearInterval(id);
  }, [mode, material]);

  function handleReset() {
    if (!material) return;
    setMode("idle");
    setTemp(material.startTemp);
  }

  return (
    <div className="min-h-screen">
      <Header name={name} />

      <main className="mx-auto max-w-6xl px-4 pb-16">
        <section className="card-pop mt-6 p-6 sm:p-8 float-up">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Hi <span className="text-primary">{name || "Scientist"}</span>! 👋 Ready to experiment?
          </h1>
          <p className="mt-2 text-muted-foreground">
            Pick a material below. We&apos;ll heat or cool it and watch what happens. Pay attention to how fast it changes — that&apos;s a clue about its thermal properties!
          </p>
        </section>

        {/* Material picker */}
        <section className="mt-6">
          <h2 className="text-xl font-bold mb-3">1. Choose a material</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {MATERIALS.map((m) => {
              const active = m.id === selectedId;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedId(m.id)}
                  aria-pressed={active}
                  className={`group rounded-2xl border-2 p-3 bg-card text-left transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40 ${
                    active
                      ? "border-primary shadow-card -translate-y-0.5"
                      : "border-border hover:border-primary/60 hover:-translate-y-0.5"
                  }`}
                >
                  <div className="aspect-square w-full overflow-hidden rounded-xl bg-secondary/40 grid place-items-center">
                    <img
                      src={m.thumbnail}
                      alt={m.name}
                      width={512}
                      height={512}
                      loading="lazy"
                      className="h-full w-full object-contain p-2"
                    />
                  </div>
                  <div className="mt-2 font-semibold text-center">{m.name}</div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Simulator */}
        {material && (
          <section ref={setupRef} className="mt-10">
            <h2 className="text-xl font-bold mb-3">2. Heat it or cool it</h2>
            <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
              <Setup material={material} temp={temp} mode={mode} onHeat={() => setMode("heating")} onCool={() => setMode("cooling")} onReset={handleReset} />
              <Readouts material={material} temp={temp} />
            </div>

            <InfoCard material={material} />
          </section>
        )}
      </main>
    </div>
  );
}

function Header({ name }: { name: string }) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-background/80 border-b-2 border-border">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
        <Link to="/experiment" className="flex items-center gap-2 font-bold text-lg">
          <span aria-hidden>🔥❄️</span>
          <span>HeatQuest</span>
        </Link>
        <div className="flex items-center gap-3">
          {name && (
            <span className="hidden sm:inline text-sm text-muted-foreground">
              Hello, <span className="font-semibold text-foreground">{name}</span>
            </span>
          )}
          <Link
            to="/quiz"
            className="btn-pop bg-primary text-primary-foreground px-4 py-2 text-sm"
          >
            Take the Quiz →
          </Link>
        </div>
      </div>
    </header>
  );
}

function Setup({
  material, temp, mode, onHeat, onCool, onReset,
}: {
  material: Material; temp: number; mode: Mode;
  onHeat: () => void; onCool: () => void; onReset: () => void;
}) {
  const state = currentState(material, temp);
  const glowClass = mode === "heating" ? "heat-glow" : mode === "cooling" ? "cold-glow" : "";

  return (
    <div className="card-pop p-5 sm:p-6">
      <div className="text-center text-sm font-semibold text-muted-foreground mb-2">
        💡 Click <span className="text-hot">Heat</span> or <span className="text-cold">Cool</span> to see the changes.
      </div>

      {/* Beaker scene */}
      <div className="relative mx-auto aspect-[4/3] w-full max-w-md">
        {/* Beaker SVG */}
        <svg viewBox="0 0 320 260" className="absolute inset-0 h-full w-full">
          {/* Beaker glass */}
          <defs>
            <linearGradient id="glassBody" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.96 0.02 220)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="oklch(0.85 0.04 220)" stopOpacity="0.35" />
            </linearGradient>
          </defs>
          {/* Hot plate */}
          <rect x="40" y="220" width="240" height="28" rx="6" fill="oklch(0.3 0.02 260)" />
          <rect x="60" y="208" width="200" height="14" rx="4" fill="oklch(0.35 0.02 260)" />
          {/* Heating glow on plate */}
          {mode === "heating" && (
            <rect x="70" y="210" width="180" height="8" rx="3" fill="oklch(0.7 0.22 35)" opacity="0.9" />
          )}
          {mode === "cooling" && (
            <rect x="70" y="210" width="180" height="8" rx="3" fill="oklch(0.7 0.18 240)" opacity="0.9" />
          )}
          {/* Beaker outline */}
          <path
            d="M70 60 L70 200 Q70 210 80 210 L240 210 Q250 210 250 200 L250 60 L260 50 L260 45 L60 45 L60 50 Z"
            fill="url(#glassBody)"
            stroke="oklch(0.7 0.04 230)"
            strokeWidth="3"
          />
          {/* Spout */}
          <path d="M60 50 L48 58 L60 64 Z" fill="none" stroke="oklch(0.7 0.04 230)" strokeWidth="3" />
        </svg>

        {/* Material image inside beaker */}
        <div className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 w-[42%]">
          <img
            key={state.image}
            src={state.image}
            alt={state.stateName}
            width={512}
            height={512}
            className={`w-full h-auto object-contain float-up ${glowClass}`}
          />
        </div>

        {/* Mode indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm font-bold">
          {mode === "heating" && <span className="text-hot">🔥 Heating…</span>}
          {mode === "cooling" && <span className="text-cold">❄️ Cooling…</span>}
          {mode === "idle" && <span className="text-muted-foreground">Idle</span>}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={onHeat}
          disabled={mode === "heating" || temp >= material.maxTemp}
          className="btn-pop bg-hot text-hot-foreground px-4 py-3 disabled:opacity-50"
        >
          🔥 Heat
        </button>
        <button
          type="button"
          onClick={onCool}
          disabled={mode === "cooling" || temp <= material.minTemp}
          className="btn-pop bg-cold text-cold-foreground px-4 py-3 disabled:opacity-50"
        >
          ❄️ Cool
        </button>
        <button
          type="button"
          onClick={onReset}
          className="btn-pop bg-card text-foreground px-4 py-3"
        >
          ↺ Reset
        </button>
      </div>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        ⭐ Tip: Watch the temperature, the state of matter, and the particle activity dots.
      </p>
    </div>
  );
}

function tempLabel(t: number) {
  if (t <= 0) return "Freezing";
  if (t < 15) return "Very Cold";
  if (t < 30) return "Cool";
  if (t < 60) return "Warm";
  if (t < 90) return "Hot";
  return "Very Hot";
}

function Readouts({ material, temp }: { material: Material; temp: number }) {
  const state = currentState(material, temp);
  // particle activity 1..6 based on temp
  const range = material.maxTemp - material.minTemp;
  const pct = Math.max(0, Math.min(1, (temp - material.minTemp) / range));
  const activity = Math.max(1, Math.round(pct * 6));
  // thermometer fill
  const thermPct = pct * 100;

  return (
    <div className="space-y-4">
      <div className="card-pop p-4">
        <div className="text-xs uppercase tracking-wide text-muted-foreground font-bold mb-3">Temperature</div>
        <div className="flex items-center gap-4">
          {/* Thermometer */}
          <div className="relative h-44 w-8 rounded-full bg-secondary border-2 border-border overflow-hidden">
            <div
              className="absolute bottom-0 left-0 w-full transition-all duration-150"
              style={{
                height: `${thermPct}%`,
                background: temp >= 60
                  ? "linear-gradient(to top, oklch(0.7 0.22 35), oklch(0.78 0.18 60))"
                  : temp <= 5
                  ? "linear-gradient(to top, oklch(0.6 0.18 240), oklch(0.78 0.12 230))"
                  : "linear-gradient(to top, oklch(0.7 0.15 150), oklch(0.78 0.12 100))",
              }}
            />
            <div className="absolute inset-x-0 -bottom-3 mx-auto h-6 w-6 rounded-full bg-hot border-2 border-border" />
          </div>
          <div className="flex-1">
            <div className="text-4xl font-bold">{Math.round(temp)}°C</div>
            <div className="text-sm font-semibold text-muted-foreground">{tempLabel(temp)}</div>
            <div className="mt-2 text-xs text-muted-foreground">
              Range: {material.minTemp}°C to {material.maxTemp}°C
            </div>
          </div>
        </div>
      </div>

      <div className="card-pop p-4">
        <div className="text-xs uppercase tracking-wide text-muted-foreground font-bold mb-2">State of Matter</div>
        <div className="flex items-center gap-3">
          <img src={state.image} alt="" width={64} height={64} className="h-14 w-14 object-contain rounded-lg bg-secondary/40" />
          <div>
            <div className="text-lg font-bold">{state.stateName}</div>
          </div>
        </div>
      </div>

      <div className="card-pop p-4">
        <div className="text-xs uppercase tracking-wide text-muted-foreground font-bold mb-2">What&apos;s Happening?</div>
        <p className="text-sm">{state.description}</p>
      </div>

      <div className="card-pop p-4">
        <div className="text-xs uppercase tracking-wide text-muted-foreground font-bold mb-2">Particle Activity</div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold">Low</span>
          <div className="flex gap-1.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <span
                key={i}
                className={`h-3 w-3 rounded-full border ${
                  i < activity ? "bg-primary border-primary" : "bg-secondary border-border"
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-semibold">High</span>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ material }: { material: Material }) {
  return (
    <div className="card-pop mt-6 p-5 sm:p-6">
      <h3 className="text-lg font-bold mb-3">About {material.name}</h3>
      <div className="grid sm:grid-cols-3 gap-3 mb-4">
        <Stat label="Thermal Conductivity" value={`${material.thermalConductivity} W/m·K`} />
        <Stat label="Specific Heat Capacity" value={`${material.specificHeatCapacity} J/kg·K`} />
        <Stat label="Response" value={material.responseRate >= 5 ? "Very Fast" : material.responseRate >= 3 ? "Medium" : "Slow"} />
      </div>
      <p className="text-sm leading-relaxed">{material.explanation}</p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-secondary/60 border border-border p-3">
      <div className="text-xs uppercase tracking-wide text-muted-foreground font-bold">{label}</div>
      <div className="font-bold mt-1">{value}</div>
    </div>
  );
}
