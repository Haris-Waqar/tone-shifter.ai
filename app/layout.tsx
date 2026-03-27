import type { Metadata } from "next";
import { Syne, DM_Sans, JetBrains_Mono } from "next/font/google";
import { ToastProvider } from "@/components/ui/toast";
import DotGrid from "@/components/DotGrid";
import { APP_TITLE } from "@/lib/app";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: APP_TITLE,
  description: "Rewrite messages with precision-tuned emotional tone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans antialiased">
        <DotGrid
          dotSize={5}
          gap={28}
          baseColor="#1e1e3a"
          activeColor="#7c6dfa"
          proximity={180}
          shockRadius={280}
          shockStrength={4}
          style={{ position: "fixed", inset: 0, zIndex: 0 }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <ToastProvider>{children}</ToastProvider>
        </div>
      </body>
    </html>
  );
}
