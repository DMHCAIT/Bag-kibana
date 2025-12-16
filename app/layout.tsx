import type { Metadata } from "next";
import { Playfair_Display, Inter, Outfit, Abhaya_Libre } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Providers } from "@/components/Providers";
import ErrorBoundary from "@/components/ErrorBoundary";
import ChristmasSnowflakes from "@/components/ChristmasSnowflakes";
import ChristmasBadge from "@/components/ChristmasBadge";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleOAuthProvider } from "@react-oauth/google";

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

export const metadata: Metadata = {
  title: "KIBANA - Luxury Handbags",
  description: "Premium luxury handbag collection for women and men",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
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
        <ChristmasSnowflakes />
        <ChristmasBadge />
        <ErrorBoundary>
          <Providers>
            {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && 
             !process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID.includes('YOUR_GOOGLE_CLIENT_ID') ? (
              <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
                <AuthProvider>
                  <CartProvider>{children}</CartProvider>
                </AuthProvider>
              </GoogleOAuthProvider>
            ) : (
              <AuthProvider>
                <CartProvider>{children}</CartProvider>
              </AuthProvider>
            )}
          </Providers>
        </ErrorBoundary>
        <SpeedInsights />
      </body>
    </html>
  );
}

