"use client";

export default function SantaHat() {
  return (
    <div className="absolute -top-4 left-0 md:-top-5 md:left-0 w-10 h-10 md:w-12 md:h-12 z-20" style={{ animation: 'bounce-slow 2s ease-in-out infinite' }}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-lg"
      >
        {/* Santa Hat */}
        <path
          d="M30 60 L50 15 L70 60 Z"
          fill="#DC2626"
          stroke="#B91C1C"
          strokeWidth="3"
        />
        {/* Hat brim */}
        <ellipse cx="50" cy="60" rx="24" ry="7" fill="#FFFFFF" />
        {/* Pom-pom */}
        <circle cx="50" cy="15" r="9" fill="#FFFFFF" />
        {/* Hat shine */}
        <path
          d="M45 25 L48 40"
          stroke="#EF4444"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>

      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0) rotate(-15deg);
          }
          50% {
            transform: translateY(-6px) rotate(-15deg);
          }
        }
      `}</style>
    </div>
  );
}
