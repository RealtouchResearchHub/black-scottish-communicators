export function ThistleMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M32 78V46" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M32 46c-4-6-14-8-14-20 0-8 6-14 14-14s14 6 14 14c0 12-10 14-14 20Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M22 24c-3-2-6-6-6-11M42 24c3-2 6-6 6-11M18 30c-4-1-8-4-9-9M46 30c4-1 8-4 9-9"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M20 52c-6 2-11 8-11 14M44 52c6 2 11 8 11 14"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
