import type { ReactElement } from "react";

const PATHS: Record<string, ReactElement> = {
  Glasgow: (
    <g stroke="currentColor" strokeWidth="1.6" fill="none">
      <path d="M0 90 L0 60 L20 60 L20 40 L40 40 L40 90" />
      <path d="M60 90 V30 M45 45 L75 45" />
      <path d="M90 90 Q150 20 210 90" />
      <rect x="230" y="35" width="16" height="55" />
      <circle cx="238" cy="25" r="10" />
      <path d="M260 90 V50 L280 40 V90" />
    </g>
  ),
  Edinburgh: (
    <g stroke="currentColor" strokeWidth="1.6" fill="none">
      <path d="M20 90 V55 L35 40 V25 L45 25 V40 L55 55 V90" />
      <path d="M80 90 Q95 30 115 90" />
      <path d="M140 90 V45 L155 30 L170 45 V90" />
      <path d="M190 90 V60 H230 V90" />
      <path d="M205 60 V45 M225 60 V45" />
      <path d="M255 90 V50 L270 35 L285 50 V90" />
    </g>
  ),
  Aberdeen: (
    <g stroke="currentColor" strokeWidth="1.6" fill="none">
      <path d="M10 90 V40 L25 25 L40 40 V90" />
      <path d="M70 90 V55 H110 V90" />
      <path d="M140 90 V35 L155 20 L170 35 V90" />
      <path d="M200 90 V60 L215 45 L230 60 V90" />
      <path d="M255 90 V50 H275 V90" />
    </g>
  ),
  Lanarkshire: (
    <g stroke="currentColor" strokeWidth="1.6" fill="none">
      <path d="M0 90 Q40 55 80 90" />
      <path d="M60 90 Q110 45 160 90" />
      <path d="M140 90 Q190 60 240 90" />
      <path d="M220 90 Q260 65 300 90" />
      <path d="M40 75 L40 55 M32 62 L40 55 L48 62" />
    </g>
  ),
};

export function HubSkyline({ city, className = "" }: { city: string; className?: string }) {
  const paths = PATHS[city];
  if (!paths) return null;
  return (
    <svg viewBox="0 0 300 90" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {paths}
    </svg>
  );
}
