import { useRef, useState, useEffect } from "react";
import PredictionForm from "./components/PredictionForm.jsx";
import ResultCard from "./components/ResultCard.jsx";
import { predictMentalHealth, describeError } from "./services/predictionService.js";

export default function App() {
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [score, setScore] = useState(null);
  const [error, setError] = useState(null);
  const lastPayload = useRef(null);
  const inFlight = useRef(false);
  const resultRef = useRef(null);

  async function run(payload) {
    if (inFlight.current) return; // prevent duplicate submissions
    inFlight.current = true;
    lastPayload.current = payload;
    setStatus("loading");
    setError(null);
    try {
      const data = await predictMentalHealth(payload);
      const value = data?.predicted_mental_health_score;
      if (typeof value !== "number" || !Number.isFinite(value)) {
        throw new Error("The service returned a response without a valid prediction.");
      }
      setScore(value);
      setStatus("success");
    } catch (err) {
      setScore(null);
      setError(describeError(err));
      setStatus("error");
    } finally {
      inFlight.current = false;
    }
  }

  const retry = () => lastPayload.current && run(lastPayload.current);
  const reset = () => { setStatus("idle"); setScore(null); setError(null); };

  // On narrow screens the results panel sits below the form; bring it into view.
  useEffect(() => {
    if (status !== "idle" && window.innerWidth < 1024) {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [status]);

  return (
    <div className="min-h-screen pb-16">
      <header className="mx-auto max-w-6xl px-5 pb-10 pt-12">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-iris">✦ Student Wellbeing Lab</p>
        <h1 className="mt-5 max-w-3xl font-display text-4xl leading-[1.1] text-[#F4F2FF] sm:text-6xl">
          How’s your digital <span className="italic text-iris">rhythm</span> treating you?
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-lav/70">
          Explore how your daily habits and digital lifestyle relate to your predicted mental health score.
        </p>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-5 lg:grid-cols-[58fr_42fr] lg:items-start">
        <PredictionForm onSubmit={run} loading={status === "loading"} />
        <div ref={resultRef} className="scroll-mt-4 lg:sticky lg:top-6">
          <ResultCard status={status} score={score} error={error} onRetry={retry} onReset={reset} />
        </div>
      </main>
    </div>
  );
}
