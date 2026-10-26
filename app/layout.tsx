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
  title: "Md Shahidullah | Full-Stack Developer",
  description:
    "Full-Stack Developer (Python, Django & React). Turning ideas into scalable, real-world products • Django • APIs • Systems • Startups • Hackathon winner.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Md Shahidullah | Full-Stack Developer",
    description:
      "Full-Stack Developer (Python, Django & React). Turning ideas into scalable, real-world products • Django • APIs • Systems • Startups • Hackathon winner.",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Md Shahidullah | Full-Stack Developer",
    description:
      "Full-Stack Developer (Python, Django & React). Turning ideas into scalable, real-world products • Django • APIs • Systems • Startups • Hackathon winner.",
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
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
