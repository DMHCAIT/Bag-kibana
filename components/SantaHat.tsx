"use client";

export default function SantaHat() {
  return (
    <div className="absolute -top-3 -right-2 md:-top-4 md:-right-3 w-8 h-8 md:w-10 md:h-10 z-10" style={{ animation: 'bounce-slow 2s ease-in-out infinite' }}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Santa Hat */}
        <path
          d="M30 60 L50 15 L70 60 Z"
          fill="#DC2626"
          stroke="#B91C1C"
          strokeWidth="2"
        />
        {/* Hat brim */}
        <ellipse cx="50" cy="60" rx="22" ry="6" fill="#FFFFFF" />
        {/* Pom-pom */}
        <circle cx="50" cy="15" r="8" fill="#FFFFFF" />
        {/* Hat shine */}
        <path
          d="M45 25 L48 40"
          stroke="#EF4444"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.6"
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
