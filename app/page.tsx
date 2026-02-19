import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import NewCollectionCarousel from "@/components/NewCollectionCarousel";
import BestsellersSection from "@/components/BestsellersSection";
import SplitBannerSection from "@/components/SplitBannerSection";
import CollectionsInFocus from "@/components/CollectionsInFocus";
import VideoShowcase from "@/components/VideoShowcase";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <NewCollectionCarousel />
        <BestsellersSection />
        <SplitBannerSection />
        <CollectionsInFocus />
        <VideoShowcase />
      </main>
      <Footer />
    </div>
  );
}
