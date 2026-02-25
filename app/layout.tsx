import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter, Outfit, Abhaya_Libre } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Providers } from "@/components/Providers";
import ErrorBoundary from "@/components/ErrorBoundary";
import CartDrawerWrapper from "@/components/CartDrawerWrapper";
import CartReminderProvider from "@/components/CartReminderProvider";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { SpeedInsights } from "@vercel/speed-insights/next";
import PerformanceMonitor from "@/components/PerformanceMonitor";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
  weight: ['400', '500', '600', '700'],
});

const abhayaLibre = Abhaya_Libre({
  variable: "--font-abhaya",
  subsets: ["latin"],
  display: "swap",
  weight: ['400', '500', '600', '700', '800'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://kibanalife.com"),
  title: {
    default: "KIBANA — Luxury Leather Handbags & Bags",
    template: "%s | KIBANA",
  },
  description:
    "Explore KIBANA's premium luxury handbag collection — handcrafted leather totes, slings, crossbody bags and clutches for women. Free shipping above ₹999.",
  keywords: [
    "luxury handbags India",
    "leather bags women",
    "premium tote bag",
    "sling bag India",
    "KIBANA bags",
    "handcrafted bags",
    "designer handbags",
    "women bags online",
    "buy handbags India",
  ],
  authors: [{ name: "KIBANA", url: "https://kibanalife.com" }],
  creator: "KIBANA",
  publisher: "KIBANA",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://kibanalife.com",
    siteName: "KIBANA",
    title: "KIBANA — Luxury Leather Handbags & Bags",
    description:
      "Handcrafted luxury leather handbags, totes, slings and clutches. Shop the new collection at KIBANA.",
    images: [
      {
        url: "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/KIBANA%20copy.png",
        width: 1200,
        height: 630,
        alt: "KIBANA Luxury Handbags",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KIBANA — Luxury Leather Handbags & Bags",
    description:
      "Handcrafted luxury leather handbags, totes, slings and clutches. Shop the new collection.",
    images: [
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/KIBANA%20copy.png",
    ],
  },
  alternates: {
    canonical: "https://kibanalife.com",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Site Verification */}
        <meta name="google-site-verification" content="LQ3U2aQ8AkdDAeHDzrkraDym6EhCvRT_VAKHVqkYVMo" />
        
        {/* Google Tag Manager */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-WVDS2TSN');
            `,
          }}
        />
        {/* End Google Tag Manager */}
        
        {/* Meta Pixel Code */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '865714735870485');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img 
            height="1" 
            width="1" 
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=865714735870485&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}

        {/* JSON-LD Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "KIBANA",
              url: "https://kibanalife.com",
              logo: "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/KIBANA%20copy.png",
              sameAs: [
                "https://www.instagram.com/kibanalifeofficial/",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+91-97114-14110",
                contactType: "customer service",
                areaServed: "IN",
                availableLanguage: "English",
              },
            }),
          }}
        />
        
        {/* Razorpay Checkout */}
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      </head>
      <body
        className={`${playfair.variable} ${inter.variable} ${outfit.variable} ${abhayaLibre.variable} antialiased`}
        style={{ fontFamily: 'var(--font-abhaya)' }}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-WVDS2TSN"
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <ErrorBoundary>
          <Providers>
            <AuthProvider>
              <CartProvider>
                <CartReminderProvider />
                <PerformanceMonitor />
                {children}
                <CartDrawerWrapper />
                <WhatsAppWidget />
              </CartProvider>
            </AuthProvider>
          </Providers>
        </ErrorBoundary>
        <SpeedInsights />
      </body>
    </html>
  );
}

