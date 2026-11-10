import type { Metadata, Viewport } from "next";
import "./global.css";

export const metadata: Metadata = {
  title: "Done — Personal Productivity & Time Tracker",
  description: "Chat-driven study and productivity tracker with the Orbit AI agent.",
  manifest: "/manifest.webmanifest",
  applicationName: "Done",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Done" },
};

export const viewport: Viewport = {
  themeColor: "#05080a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning style={{ fontFamily: "'Space Grotesk', system-ui, -apple-system, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}