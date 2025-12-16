"use client";

import { useEffect, useState } from "react";

interface Snowflake {
  id: number;
  left: number;
  animationDuration: number;
  size: number;
  opacity: number;
  delay: number;
}

export default function ChristmasSnowflakes() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    // Generate 40 snowflakes (more visible)
    const flakes: Snowflake[] = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100, // 0-100%
      animationDuration: 10 + Math.random() * 20, // 10-30s
      size: 10 + Math.random() * 12, // 10-22px (larger)
      opacity: 0.6 + Math.random() * 0.4, // 0.6-1.0 (more visible)
      delay: Math.random() * 10, // 0-10s delay
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute -top-10"
          style={{
            left: `${flake.left}%`,
            animation: `snowfall ${flake.animationDuration}s linear infinite`,
            animationDelay: `${flake.delay}s`,
            opacity: flake.opacity,
          }}
        >
          <svg
            width={flake.size}
            height={flake.size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white drop-shadow-lg"
          >
            <path
              d="M12 2L12 22M12 2L8 6M12 2L16 6M12 22L8 18M12 22L16 18M2 12L22 12M2 12L6 8M2 12L6 16M22 12L18 8M22 12L18 16M5.636 5.636L18.364 18.364M5.636 5.636L8.464 8.464M18.364 18.364L15.536 15.536M18.364 5.636L5.636 18.364M18.364 5.636L15.536 8.464M5.636 18.364L8.464 15.536"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      ))}

      <style jsx global>{`
        @keyframes snowfall {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
