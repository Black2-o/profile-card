import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Profile } from "@/types/profile";
import { getProfile } from "@/lib/profile";
import { EmailButton } from "@/components/EmailButton";

export const revalidate = 60; // Revalidate at most every 60 seconds

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
    url: profile.portfolio_url && profile.portfolio_url !== "#" ? profile.portfolio_url : undefined,
    sameAs: [
      profile.whatsapp,
      profile.telegram,
      profile.messenger,
      profile.twitter,
      profile.youtube,
      profile.github,
      profile.instagram,
      profile.tiktok,
    ].filter(
      (url): url is string =>
        typeof url === "string" && url.trim() !== "" && url !== "#" && !url.startsWith("mailto:")
    ),
  };

  const hasPortfolio = Boolean(profile.portfolio_url && profile.portfolio_url !== "#");
  const showProjects = profile.show_projects !== false;
  const hasWorkSection = hasPortfolio || showProjects;
  const hasFollowLinks = Boolean(
    profile.twitter || profile.youtube || profile.github || profile.instagram || profile.tiktok
  );
  const hasTalkLinks = Boolean(
    profile.whatsapp || profile.telegram || profile.messenger || profile.email
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="card">
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
                {profile.name
                  ? profile.name
                      .split(" ")
                      .filter(Boolean)
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()
                  : "JD"}
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

        {/* Find My Work (Controlled by portfolio_url & show_projects toggle) */}
        {hasWorkSection && (
          <div className="section stagger-2">
            <h2>Find My Work</h2>
            <div className="work-buttons">
              {hasPortfolio && (
                <a
                  href={profile.portfolio_url!}
                  className="portfolio"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Portfolio"
                  data-umami-event="click-portfolio"
                >
                  <i className="fa-solid fa-briefcase"></i>
                  Portfolio
                </a>
              )}

              {showProjects && (
                <Link
                  href="/projects"
                  className="portfolio"
                  aria-label="Projects"
                  data-umami-event="click-projects"
                >
                  <i className="fa-solid fa-laptop-code"></i>
                  Projects
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Follow Me (Twitter/X -> YouTube -> GitHub -> Instagram -> TikTok - Only rendered if link exists) */}
        {hasFollowLinks && (
          <div className="section stagger-3">
            <h2>Follow Me</h2>
            <div className="icons">
              {/* X (Twitter) */}
              {profile.twitter && (
                <a
                  className="icon twitter"
                  href={profile.twitter}
                  data-tooltip="X (Twitter)"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter / X"
                  data-umami-event="click-twitter"
                >
                  <i className="fab fa-x-twitter"></i>
                </a>
              )}

              {/* YouTube */}
              {profile.youtube && (
                <a
                  className="icon youtube"
                  href={profile.youtube}
                  data-tooltip="YouTube"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  data-umami-event="click-youtube"
                >
                  <i className="fab fa-youtube"></i>
                </a>
              )}

              {/* GitHub */}
              {profile.github && (
                <a
                  className="icon github"
                  href={profile.github}
                  data-tooltip="GitHub"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  data-umami-event="click-github"
                >
                  <i className="fab fa-github"></i>
                </a>
              )}

              {/* Instagram */}
              {profile.instagram && (
                <a
                  className="icon instagram"
                  href={profile.instagram}
                  data-tooltip="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  data-umami-event="click-instagram"
                >
                  <i className="fab fa-instagram"></i>
                </a>
              )}

              {/* TikTok */}
              {profile.tiktok && (
                <a
                  className="icon tiktok"
                  href={profile.tiktok}
                  data-tooltip="TikTok"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  data-umami-event="click-tiktok"
                >
                  <i className="fab fa-tiktok"></i>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Talk With Me (WhatsApp -> Telegram -> Messenger -> Email - Only rendered if link exists) */}
        {hasTalkLinks && (
          <div className="section stagger-4">
            <h2>Talk With Me</h2>
            <div className="icons">
              {/* WhatsApp */}
              {profile.whatsapp && (
                <a
                  className="icon whatsapp"
                  href={profile.whatsapp}
                  data-tooltip="WhatsApp"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  data-umami-event="click-whatsapp"
                >
                  <i className="fab fa-whatsapp"></i>
                </a>
              )}

              {/* Telegram */}
              {profile.telegram && (
                <a
                  className="icon telegram"
                  href={profile.telegram}
                  data-tooltip="Telegram"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram"
                  data-umami-event="click-telegram"
                >
                  <i className="fab fa-telegram"></i>
                </a>
              )}

              {/* Messenger */}
              {profile.messenger && (
                <a
                  className="icon messenger"
                  href={profile.messenger}
                  data-tooltip="Messenger"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook Messenger"
                  data-umami-event="click-messenger"
                >
                  <i className="fab fa-facebook-messenger"></i>
                </a>
              )}

              {/* Email */}
              {profile.email && (
                <EmailButton email={profile.email} />
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
