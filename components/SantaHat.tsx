"use client";

export default function SantaHat() {
  return (
    <div className="absolute -top-2 -right-1 md:-top-3 md:-right-2 w-6 h-6 md:w-8 md:h-8 animate-bounce-slow">
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

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0) rotate(-15deg);
          }
          50% {
            transform: translateY(-4px) rotate(-15deg);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
