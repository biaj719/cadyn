export function CadynIcon({ size = 64, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background */}
      <rect width="64" height="64" rx="16" fill="#F5F2EC" />

      {/* Icon: Abstract circular flow with soft wave */}
      <g>
        {/* Outer circular path - represents coordination and connection */}
        <circle
          cx="32"
          cy="32"
          r="18"
          stroke="#4F7A67"
          strokeWidth="2.5"
          fill="none"
          opacity="0.3"
        />

        {/* Inner flowing wave - represents movement and rhythm */}
        <path
          d="M 18 32 Q 24 26 32 26 Q 40 26 46 32 Q 40 38 32 38 Q 24 38 18 32"
          stroke="#4F7A67"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Subtle directional indicator - small accent suggesting motion */}
        <circle
          cx="46"
          cy="32"
          r="1.5"
          fill="#4F7A67"
        />
      </g>
    </svg>
  );
}
