import type { Metadata } from "next";
import { Playfair_Display, Inter, Outfit, Abhaya_Libre } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Providers } from "@/components/Providers";
import ErrorBoundary from "@/components/ErrorBoundary";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </head>
      <body
        className={`${playfair.variable} ${inter.variable} ${outfit.variable} ${abhayaLibre.variable} antialiased`}
        style={{ fontFamily: 'var(--font-abhaya)' }}
      >
        <ErrorBoundary>
          <Providers>
            <AuthProvider>
              <CartProvider>{children}</CartProvider>
            </AuthProvider>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
