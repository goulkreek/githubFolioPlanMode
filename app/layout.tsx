import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TokenDialog } from "@/components/ui/TokenDialog";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GitFolio — Animated dev portfolio generator",
  description:
    "Turn any GitHub username into an immersive animated portfolio with 3D particles, language orbs and contribution timelines.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-foreground">
        <TokenDialog />
        <div className="fixed bottom-4 left-4 z-50 glass rounded-full px-3 py-1.5 text-[11px] font-mono text-muted/80 pointer-events-none select-none">
          <span className="text-cyan">✦</span> généré avec{" "}
          <span className="text-violet">plan mode</span>
        </div>
        {children}
      </body>
    </html>
  );
}
