import type { Metadata } from "next";
import { headers } from "next/headers";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Siddhesh Raje — Front-End Developer",
  description:
    "Portfolio of Siddhesh Raje, a front-end developer building across blockchain and artificial intelligence.",
};

const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var theme = stored === "dark" || (!stored && prefersDark) ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {}
})();
`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased"
      style={
        {
          "--font-space-grotesk": "'Space Grotesk', sans-serif",
          "--font-plex-sans": "'IBM Plex Sans', sans-serif",
          "--font-plex-mono": "'IBM Plex Mono', monospace",
        } as React.CSSProperties
      }
    >
      <head>
        <meta
          name="format-detection"
          content="telephone=no, date=no, email=no, address=no"
        />
        <script
          id="theme-initializer"
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-full">
        {children}
      </body>
    </html>
  );
}
