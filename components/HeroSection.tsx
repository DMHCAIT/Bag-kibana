"use client";

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Desktop Video - Hidden on mobile */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="hidden md:block absolute inset-0 w-full h-full object-cover"
        preload="auto"
      >
        <source
          src="https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/HERO%20SECTION/homepage%20hero%20section.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Mobile Video - Hidden on desktop, optimized for mobile */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="md:hidden absolute inset-0 w-full h-full object-cover object-center"
        preload="metadata"
      >
        <source
          src="https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/HERO%20SECTION/homepage%20hero%20section.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
    </section>
  );
}
