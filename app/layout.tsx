import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StadiumFlow AI — FIFA World Cup 2026 Smart Stadium",
  description:
    "AI-powered stadium navigation, real-time crowd management, multilingual assistance, and live operations for FIFA World Cup 2026. Powered by Google Gemini.",
  keywords: [
    "FIFA World Cup 2026",
    "stadium AI",
    "crowd management",
    "Gemini AI",
    "smart stadium",
    "fan experience",
    "navigation",
    "queue management",
    "Google Cloud",
  ],
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192.svg",
    apple: "/icon-192.svg",
  },
  openGraph: {
    title: "StadiumFlow AI — FIFA World Cup 2026",
    description: "AI-powered smart stadium experience platform",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0A0A0A",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </head>
      <body className="min-h-screen safe-area">
        {/* Skip to main content - accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-neon-green focus:text-pitch-black focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-bold"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
