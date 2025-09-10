import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PromptLab",
  description: "Learn, build, and evaluate AI prompting workflows",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="border-b">
          <div className="mx-auto max-w-5xl px-6 py-3 grid grid-cols-3 items-center">
            <div className="justify-self-start">
              <Link href="/" className="font-semibold">promptLab</Link>
            </div>
            <nav className="justify-self-center flex items-center gap-4">
              <Link href="/prompt">
                <Button variant="ghost" size="sm">Evaluator</Button>
              </Link>
              <Link href="/builder">
                <Button variant="ghost" size="sm">Prompt Builder</Button>
              </Link>
            </nav>
            <div className="justify-self-end" />
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-6 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
