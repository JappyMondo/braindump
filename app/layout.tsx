import type React from "react";
import "@/styles/globals.css";
import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Braindump",
  description: "AI-powered brainstorming canvas",
  manifest: "/manifest.json",
  generator: "v0.dev",
};

export const viewport: Viewport = {
  themeColor: "background",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="description" content="AI-powered brainstorming canvas" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" href="/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" href="/android-chrome-512x512.png" />
        <link rel="icon" type="image/png" href="/apple-touch-icon.png" />
        <title>Braindump</title>
      </head>
      <body className="min-h-screen bg-background antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}

import "./globals.css";
