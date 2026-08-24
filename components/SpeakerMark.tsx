export function SpeakerMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="2">
        <path d="M200 40 L200 10 M200 40 L170 20 M200 40 L230 20" strokeLinecap="round" />
        <path d="M160 320 v-90 a40 40 0 0 1 80 0 v90" strokeLinecap="round" />
        <circle cx="200" cy="150" r="34" />
        <path d="M150 340 h100 l-10 -20 h-80 z" />
        <path d="M120 260 q80 -30 160 0" strokeDasharray="3 6" />
        <path d="M60 380 q140 -70 280 0" strokeLinecap="round" />
        <circle cx="70" cy="390" r="6" />
        <circle cx="110" cy="378" r="6" />
        <circle cx="150" cy="370" r="6" />
        <circle cx="200" cy="366" r="6" />
        <circle cx="250" cy="370" r="6" />
        <circle cx="290" cy="378" r="6" />
        <circle cx="330" cy="390" r="6" />
      </g>
    </svg>
  );
}
