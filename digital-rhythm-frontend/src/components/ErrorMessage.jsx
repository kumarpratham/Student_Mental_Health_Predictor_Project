import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ErrorMessage({ error, onRetry }) {
  return (
    <div className="rise py-6" role="alert">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-red-400/30 bg-red-400/10 text-red-300">
        <AlertTriangle size={22} aria-hidden="true" />
      </div>
      <h3 className="font-display text-xl text-white">We couldn't get a prediction</h3>
      <p className="mt-2 text-sm leading-relaxed text-lav/80">{error.message}</p>
      {error.details?.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm text-red-200/90">
          {error.details.map((d, i) => (
            <li key={i}>
              <span className="font-medium">{d.field}:</span> {d.message}
            </li>
          ))}
        </ul>
      )}
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-xl border border-edge bg-field px-4 py-2.5 text-sm font-medium text-white transition hover:border-iris"
      >
        <RotateCcw size={16} aria-hidden="true" /> Retry
      </button>
    </div>
  );
}
