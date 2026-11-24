import { Loader2 } from "lucide-react";

export default function LoadingState() {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center" role="status">
      <Loader2 className="animate-spin text-iris" size={36} aria-hidden="true" />
      <p className="font-display text-xl text-white">Reading your rhythm…</p>
      <p className="text-sm text-lav/70">Waiting for the model to respond.</p>
      <p className="mt-1 max-w-xs rounded-lg border border-iris/30 bg-iris/10 px-3 py-2 text-xs leading-relaxed text-lav/80">
        Please wait 30–40 seconds if the server is starting up from sleep. And Retry if you see a timeout error.
      </p>
    </div>
  );
}