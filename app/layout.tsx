import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#3c5bff",
  width: "device-width",
  initialScale: 1,
};

const ogImage = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-assets/og-image.png`
  : "/og-image.png";

export const metadata: Metadata = {
  metadataBase: new URL("https://localhost:3000"),
  title: "Profile Card",
  description: "Developer & Creator Profile Card",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Profile Card",
    description: "Developer & Creator Profile Card",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Profile Card",
    description: "Developer & Creator Profile Card",
    images: [ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabaseOrigin = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin
    : null;

  const umamiWebsiteId =
    process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ||
    "21e40a60-e18a-457b-8515-b01e26f34d94";

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        {supabaseOrigin && (
          <>
            <link rel="preconnect" href={supabaseOrigin} crossOrigin="anonymous" />
            <link rel="dns-prefetch" href={supabaseOrigin} />
          </>
        )}
        {umamiWebsiteId && (
          <Script
            defer
            src="https://cloud.umami.is/script.js"
            data-website-id={umamiWebsiteId}
            strategy="afterInteractive"
          />
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
