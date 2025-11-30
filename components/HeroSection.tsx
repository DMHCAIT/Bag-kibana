"use client";

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen">
      {/* Desktop Video - Hidden on mobile */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="hidden md:block absolute inset-0 w-full h-full object-cover"
      >
        <source src="https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/HERO%20SECTION/homepage%20hero%20section.mp4" type="video/mp4" />
      </video>

      {/* Mobile Video - Hidden on desktop */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="md:hidden absolute inset-0 w-full h-full object-cover"
      >
        <source src="https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/HERO%20SECTION/Kiabana%20reel-%20mobile%20version%202%20(1).mp4" type="video/mp4" />
      </video>
    </section>
  );
}
