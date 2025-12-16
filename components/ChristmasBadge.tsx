"use client";

import { useState, useEffect } from "react";

export default function ChristmasBadge() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Set sale end date to December 26, 2025 00:00:00
    const saleEndDate = new Date('2025-12-26T00:00:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = saleEndDate - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed top-20 right-4 md:top-24 md:right-8 z-40 animate-float">
      <div className="relative">
        {/* Sparkle effects */}
        <div className="absolute -top-1 -left-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full animate-ping opacity-75" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Main badge */}
        <div className="bg-gradient-to-br from-red-600 via-red-700 to-green-700 text-white px-4 py-3 rounded-full shadow-2xl border-2 border-yellow-300 hover:scale-110 transition-transform duration-300 cursor-pointer group">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold whitespace-nowrap">Merry Christmas 🎄</span>
          </div>
          
          {/* Countdown tooltip on hover */}
          <div className="absolute top-full mt-2 right-0 bg-white text-black p-3 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none min-w-[200px]">
            <div className="text-xs font-semibold text-center mb-2 text-red-600">Sale Ends In:</div>
            <div className="flex gap-2 justify-center text-xs">
              <div className="text-center">
                <div className="font-bold text-lg text-red-600">{timeLeft.days}</div>
                <div className="text-gray-600">Days</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-red-600">{timeLeft.hours}</div>
                <div className="text-gray-600">Hours</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-red-600">{timeLeft.minutes}</div>
                <div className="text-gray-600">Mins</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-red-600">{timeLeft.seconds}</div>
                <div className="text-gray-600">Secs</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
