import dynamic from "next/dynamic";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ShopByCategory from "@/components/ShopByCategory";
import BestsellersSection from "@/components/BestsellersSection";
import WomenMenBanner from "@/components/WomenMenBanner";
import ColorSwitchSlider from "@/components/ColorSwitchSlider";

// Lazy load below-the-fold components for faster initial load
const CollectionsInFocus = dynamic(() => import("@/components/CollectionsInFocus"), {
  loading: () => <div className="h-96 bg-gray-50 animate-pulse" />,
});

const VideoShowcase = dynamic(() => import("@/components/VideoShowcase"), {
  loading: () => <div className="h-96 bg-gray-50 animate-pulse" />,
});

const InstagramFeed = dynamic(() => import("@/components/InstagramFeed"), {
  loading: () => <div className="h-96 bg-gray-50 animate-pulse" />,
});

const Footer = dynamic(() => import("@/components/Footer"));

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <ShopByCategory />
        <BestsellersSection />
        <WomenMenBanner />
        <CollectionsInFocus />
        <ColorSwitchSlider />
        <VideoShowcase />
        <InstagramFeed />
      </main>
      <Footer />
    </div>
  );
}
