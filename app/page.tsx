import Image from "next/image";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { Profile } from "@/types/profile";
import { EmailButton } from "@/components/EmailButton";

export const revalidate = 60; // Revalidate at most every 60 seconds

const fallbackProfile: Profile = {
  id: "default",
  name: "Md Shahidullah",
  bio: "Full-Stack Developer (Python, Django & React)",
  stats_html:
    'Turning ideas into scalable, real-world products • Django • APIs • Systems • Startups • 🏆 Hackathon winner • <b>DM “CODE”</b>',
  cover_image_url: "",
  avatar_url: "",
  portfolio_url: "#",
  talk_links: {
    whatsapp: "#",
    messenger: "#",
    email: "mailto:contact@example.com",
  },
  follow_links: {
    instagram: "#",
    tiktok: null, // Unclickable & disabled
    youtube: "#",
    twitter: "#",
  },
};

async function getProfile(): Promise<Profile> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return fallbackProfile;
    }

    return {
      ...fallbackProfile,
      ...data,
      talk_links: data.talk_links || fallbackProfile.talk_links,
      follow_links: data.follow_links || fallbackProfile.follow_links,
    };
  } catch {
    return fallbackProfile;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const ogImage = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-assets/og-image.png`
    : "/og-image.png";

  return {
    metadataBase: new URL("https://localhost:3000"),
    title: `${profile.name} | Profile Card`,
    description: profile.bio,
    openGraph: {
      title: `${profile.name} | Profile Card`,
      description: profile.bio,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: profile.name,
      description: profile.bio,
      images: [ogImage],
    },
  };
}

export default async function Page() {
  const profile = await getProfile();

  // Structured Data (JSON-LD) for Search Engines & AI Answer Engines (AEO)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.bio,
    image: profile.avatar_url,
    url: profile.portfolio_url !== "#" ? profile.portfolio_url : undefined,
    sameAs: [
      profile.talk_links?.whatsapp,
      profile.follow_links?.instagram,
      profile.follow_links?.youtube,
      profile.follow_links?.twitter,
    ].filter(
      (url): url is string =>
        typeof url === "string" && url !== "#" && !url.startsWith("mailto:")
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="card">
        {/* Cover Image */}
        <div className="cover">
          {profile.cover_image_url && (
            <Image
              src={profile.cover_image_url}
              alt={`${profile.name} cover`}
              fill
              priority
              sizes="(max-width: 480px) 100vw, 460px"
              className="cover-img"
            />
          )}
          <div className="cover-overlay" />
        </div>

        {/* Profile */}
        <div className="profile stagger-1">
          <div className="profile-img-wrapper">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.name}
                width={88}
                height={88}
                priority
                className="profile-img"
              />
            ) : (
              <div
                className="profile-img"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--theme)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "28px",
                }}
              >
                MS
              </div>
            )}
          </div>

          <h1>{profile.name}</h1>
          <p className="bio">{profile.bio}</p>

          <p
            className="stats"
            dangerouslySetInnerHTML={{ __html: profile.stats_html }}
          />
        </div>

        {/* Find My Work */}
        <div className="section stagger-2">
          <h2>Find My Work</h2>
          <a
            href={profile.portfolio_url || "#"}
            className="portfolio"
            target={profile.portfolio_url !== "#" ? "_blank" : undefined}
            rel="noopener noreferrer"
          >
            <i className="fa-solid fa-briefcase"></i>
            Portfolio
          </a>
        </div>

        {/* Talk With Me */}
        <div className="section stagger-3">
          <h2>Talk With Me</h2>
          <div className="icons">
            {profile.talk_links?.whatsapp && (
              <a
                className="icon whatsapp"
                href={profile.talk_links.whatsapp}
                data-tooltip="WhatsApp"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
              >
                <i className="fab fa-whatsapp"></i>
              </a>
            )}

            {profile.talk_links?.messenger && (
              <a
                className="icon messenger"
                href={profile.talk_links.messenger}
                data-tooltip="Messenger"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Messenger"
              >
                <i className="fab fa-facebook-messenger"></i>
              </a>
            )}

            {profile.talk_links?.email && (
              <EmailButton email={profile.talk_links.email} />
            )}
          </div>
        </div>

        {/* Follow Me */}
        <div className="section stagger-4">
          <h2>Follow Me</h2>
          <div className="icons">
            {profile.follow_links?.instagram && (
              <a
                className="icon instagram"
                href={profile.follow_links.instagram}
                data-tooltip="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
            )}

            {/* TikTok: When null or empty, renders disabled with soft gray tone & custom tooltip */}
            {profile.follow_links?.tiktok ? (
              <a
                className="icon tiktok"
                href={profile.follow_links.tiktok}
                data-tooltip="TikTok"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
              >
                <i className="fab fa-tiktok"></i>
              </a>
            ) : (
              <span
                className="icon tiktok disabled"
                data-tooltip="Not linked"
                aria-label="TikTok (Not linked)"
                role="button"
                aria-disabled="true"
              >
                <i className="fab fa-tiktok"></i>
              </span>
            )}

            {profile.follow_links?.youtube && (
              <a
                className="icon youtube"
                href={profile.follow_links.youtube}
                data-tooltip="YouTube"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <i className="fab fa-youtube"></i>
              </a>
            )}

            {profile.follow_links?.twitter && (
              <a
                className="icon twitter"
                href={profile.follow_links.twitter}
                data-tooltip="X (Twitter)"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
              >
                <i className="fab fa-x-twitter"></i>
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
