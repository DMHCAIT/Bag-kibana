"use client";

export default function ChristmasSnowflakes() {
  return (
    <>
      <div className="snow">
        <span>❄</span>
        <span>❄</span>
        <span>❄</span>
        <span>❄</span>
        <span>❄</span>
        <span>❄</span>
        <span>❄</span>
        <span>❄</span>
        <span>❄</span>
        <span>❄</span>
        <span>❄</span>
        <span>❄</span>
        <span>❄</span>
        <span>❄</span>
        <span>❄</span>
        <span>❄</span>
        <span>❄</span>
        <span>❄</span>
        <span>❄</span>
        <span>❄</span>
      </div>

      <style jsx global>{`
        .snow {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
          z-index: 9999;
        }

        .snow span {
          position: absolute;
          top: -10px;
          color: #fff;
          font-size: 1em;
          animation: fall linear infinite;
          opacity: 0.8;
        }

        /* Random positions */
        .snow span:nth-child(1) { left: 5%; animation-duration: 10s; }
        .snow span:nth-child(2) { left: 10%; animation-duration: 12s; }
        .snow span:nth-child(3) { left: 15%; animation-duration: 9s; }
        .snow span:nth-child(4) { left: 20%; animation-duration: 11s; }
        .snow span:nth-child(5) { left: 25%; animation-duration: 13s; }
        .snow span:nth-child(6) { left: 30%; animation-duration: 10s; }
        .snow span:nth-child(7) { left: 35%; animation-duration: 12s; }
        .snow span:nth-child(8) { left: 40%; animation-duration: 9s; }
        .snow span:nth-child(9) { left: 45%; animation-duration: 11s; }
        .snow span:nth-child(10) { left: 50%; animation-duration: 13s; }
        .snow span:nth-child(11) { left: 55%; animation-duration: 10s; }
        .snow span:nth-child(12) { left: 60%; animation-duration: 12s; }
        .snow span:nth-child(13) { left: 65%; animation-duration: 9s; }
        .snow span:nth-child(14) { left: 70%; animation-duration: 11s; }
        .snow span:nth-child(15) { left: 75%; animation-duration: 13s; }
        .snow span:nth-child(16) { left: 80%; animation-duration: 10s; }
        .snow span:nth-child(17) { left: 85%; animation-duration: 12s; }
        .snow span:nth-child(18) { left: 90%; animation-duration: 9s; }
        .snow span:nth-child(19) { left: 95%; animation-duration: 11s; }
        .snow span:nth-child(20) { left: 3%; animation-duration: 14s; }

        @keyframes fall {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(100vh);
          }
        }
      `}</style>
    </>
  );
}
