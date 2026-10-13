import { useEffect, useState } from "react";

const fmt = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/\.?0+$/, ""));

/**
 * Semicircular gauge. The score itself is never altered or clamped; only the
 * drawn position is pinned to the arc ends when the score is outside [min, max].
 */
export default function ScoreGauge({ score, min, max }) {
  const raw = (score - min) / (max - min);
  const frac = Math.min(1, Math.max(0, raw));
  const [shown, setShown] = useState(0);

  useEffect(() => {
    setShown(0);
    let id2;
    const id1 = requestAnimationFrame(() => {
      id2 = requestAnimationFrame(() => setShown(frac));
    });
    return () => {
      cancelAnimationFrame(id1);
      cancelAnimationFrame(id2);
    };
  }, [frac, score]);

  const arc = "M 20 100 A 80 80 0 0 1 180 100";
  const ease = "1.1s cubic-bezier(0.22, 1, 0.36, 1)";

  return (
    <svg viewBox="0 0 200 128" className="mx-auto w-full max-w-xs" role="img"
      aria-label={`Score ${fmt(score)} on a scale from ${fmt(min)} to ${fmt(max)}`}>
      <defs>
        <linearGradient id="gaugeFill" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6D5CFF" />
          <stop offset="100%" stopColor="#D6D1FF" />
        </linearGradient>
      </defs>
      <path d={arc} pathLength="100" fill="none" stroke="#262E63" strokeWidth="14" />
      <path d={arc} pathLength="100" fill="none" stroke="url(#gaugeFill)" strokeWidth="14"
        strokeDasharray={`${shown * 100} 100`} style={{ transition: `stroke-dasharray ${ease}` }} />
      <g style={{ transform: `rotate(${shown * 180}deg)`, transformOrigin: "100px 100px", transition: `transform ${ease}` }}>
        <circle cx="20" cy="100" r="9" fill="#090D22" stroke="#C4BEFF" strokeWidth="3" />
      </g>
      <text x="100" y="96" textAnchor="middle" fill="#fff" fontSize="34" fontFamily="Fraunces, Georgia, serif">
        {fmt(score)}
      </text>
      <text x="20" y="121" textAnchor="middle" fill="#9A96D6" fontSize="10">{fmt(min)}</text>
      <text x="180" y="121" textAnchor="middle" fill="#9A96D6" fontSize="10">{fmt(max)}</text>
    </svg>
  );
}
