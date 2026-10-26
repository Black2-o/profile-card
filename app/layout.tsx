import type { Metadata, Viewport } from "next";
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

  return (
    <html lang="en">
      <head>
        {supabaseOrigin && (
          <>
            <link rel="preconnect" href={supabaseOrigin} crossOrigin="anonymous" />
            <link rel="dns-prefetch" href={supabaseOrigin} />
          </>
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
