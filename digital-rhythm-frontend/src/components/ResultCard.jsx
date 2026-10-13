import { RotateCcw, Orbit } from "lucide-react";
import ScoreGauge from "./ScoreGauge.jsx";
import LoadingState from "./LoadingState.jsx";
import ErrorMessage from "./ErrorMessage.jsx";

function readRange() {
  const min = Number(import.meta.env.VITE_SCORE_MIN ?? 3.6);
  const max = Number(import.meta.env.VITE_SCORE_MAX ?? 9.4);
  return Number.isFinite(min) && Number.isFinite(max) && max > min ? { min, max } : { min: 3.6, max: 9.4 };
}
const { min, max } = readRange();

export default function ResultCard({ status, score, error, onRetry, onReset }) {
  const outside = status === "success" && (score < min ? "below" : score > max ? "above" : null);

  return (
    <section
      aria-live="polite"
      className="rounded-[20px] border border-edge bg-gradient-to-b from-panel to-[#0D1230] p-6 shadow-xl shadow-black/30 sm:p-8"
    >
      {status === "idle" && (
        <div className="flex flex-col items-center py-14 text-center">
          <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-edge bg-field text-iris">
            <Orbit size={30} aria-hidden="true" />
          </span>
          <h2 className="font-display text-2xl text-white">Your score awaits</h2>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-lav/70">
            Complete the form and select Predict score to see your result here.
          </p>
        </div>
      )}

      {status === "loading" && <LoadingState />}
      {status === "error" && <ErrorMessage error={error} onRetry={onRetry} />}

      {status === "success" && (
        <div className="text-center">
          <h2 className="font-display text-2xl text-white">Predicted mental health score</h2>
          <div className="mt-6">
            <ScoreGauge score={score} min={min} max={max} />
          </div>
          <p className="mt-1 text-xs text-lav/60">Gauge range: {min} to {max} (configurable)</p>
          {outside && (
            <p className="mx-auto mt-3 max-w-xs rounded-lg border border-iris/40 bg-iris/10 px-3 py-2 text-xs text-lav">
              This score is {outside} the configured range, so the marker is held at the {outside === "below" ? "left" : "right"} end.
              The number shown is the model's actual output.
            </p>
          )}
          <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-lav/75">
            This is a statistical estimate based on patterns in survey data. It is not a diagnosis or medical advice.
            If you're worried about your wellbeing, consider talking with a trusted person or a health professional.
          </p>
          <button
            type="button"
            onClick={onReset}
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-edge bg-field px-5 py-2.5 text-sm font-medium text-white transition hover:border-iris"
          >
            <RotateCcw size={16} aria-hidden="true" /> Predict Again
          </button>
        </div>
      )}
    </section>
  );
}
