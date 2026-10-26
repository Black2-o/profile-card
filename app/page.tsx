import Image from "next/image";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { Profile } from "@/types/profile";
import { EmailButton } from "@/components/EmailButton";

export const revalidate = 60; // Revalidate at most every 60 seconds

const fallbackProfile: Profile = {
  id: "default",
  name: "John Doe",
  bio: "Full-Stack Developer",
  stats_html: "Building scalable web products • Clean Code • APIs • Modern Systems",
  cover_image_url: "",
  avatar_url: "",
  portfolio_url: null,
  whatsapp: null,
  messenger: null,
  email: null,
  instagram: null,
  tiktok: null,
  youtube: null,
  twitter: null,
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
      // Flat columns with graceful fallback to legacy JSON if ever present
      whatsapp: data.whatsapp !== undefined ? data.whatsapp : data.talk_links?.whatsapp,
      messenger: data.messenger !== undefined ? data.messenger : data.talk_links?.messenger,
      email: data.email !== undefined ? data.email : data.talk_links?.email,
      instagram: data.instagram !== undefined ? data.instagram : data.follow_links?.instagram,
      tiktok: data.tiktok !== undefined ? data.tiktok : data.follow_links?.tiktok,
      youtube: data.youtube !== undefined ? data.youtube : data.follow_links?.youtube,
      twitter: data.twitter !== undefined ? data.twitter : data.follow_links?.twitter,
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
      profile.whatsapp,
      profile.messenger,
      profile.instagram,
      profile.tiktok,
      profile.youtube,
      profile.twitter,
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

        {/* Find My Work */}
        <div className="section stagger-2">
          <h2>Find My Work</h2>
          {profile.portfolio_url && profile.portfolio_url !== "#" ? (
            <a
              href={profile.portfolio_url}
              className="portfolio"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Portfolio"
            >
              <i className="fa-solid fa-briefcase"></i>
              Portfolio
            </a>
          ) : (
            <span
              className="portfolio disabled"
              data-tooltip="Not linked"
              aria-label="Portfolio (Not linked)"
              role="button"
              aria-disabled="true"
            >
              <i className="fa-solid fa-briefcase"></i>
              Portfolio
            </span>
          )}
        </div>

        {/* Talk With Me */}
        <div className="section stagger-3">
          <h2>Talk With Me</h2>
          <div className="icons">
            {/* WhatsApp */}
            {profile.whatsapp ? (
              <a
                className="icon whatsapp"
                href={profile.whatsapp}
                data-tooltip="WhatsApp"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
              >
                <i className="fab fa-whatsapp"></i>
              </a>
            ) : (
              <span
                className="icon whatsapp disabled"
                data-tooltip="Not linked"
                aria-label="WhatsApp (Not linked)"
                role="button"
                aria-disabled="true"
              >
                <i className="fab fa-whatsapp"></i>
              </span>
            )}

            {/* Messenger */}
            {profile.messenger ? (
              <a
                className="icon messenger"
                href={profile.messenger}
                data-tooltip="Messenger"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Messenger"
              >
                <i className="fab fa-facebook-messenger"></i>
              </a>
            ) : (
              <span
                className="icon messenger disabled"
                data-tooltip="Not linked"
                aria-label="Messenger (Not linked)"
                role="button"
                aria-disabled="true"
              >
                <i className="fab fa-facebook-messenger"></i>
              </span>
            )}

            {/* Email */}
            {profile.email ? (
              <EmailButton email={profile.email} />
            ) : (
              <span
                className="icon email disabled"
                data-tooltip="Not linked"
                aria-label="Email (Not linked)"
                role="button"
                aria-disabled="true"
              >
                <i className="fa-solid fa-envelope"></i>
              </span>
            )}
          </div>
        </div>

        {/* Follow Me */}
        <div className="section stagger-4">
          <h2>Follow Me</h2>
          <div className="icons">
            {/* Instagram */}
            {profile.instagram ? (
              <a
                className="icon instagram"
                href={profile.instagram}
                data-tooltip="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
            ) : (
              <span
                className="icon instagram disabled"
                data-tooltip="Not linked"
                aria-label="Instagram (Not linked)"
                role="button"
                aria-disabled="true"
              >
                <i className="fab fa-instagram"></i>
              </span>
            )}

            {/* TikTok */}
            {profile.tiktok ? (
              <a
                className="icon tiktok"
                href={profile.tiktok}
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

            {/* YouTube */}
            {profile.youtube ? (
              <a
                className="icon youtube"
                href={profile.youtube}
                data-tooltip="YouTube"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <i className="fab fa-youtube"></i>
              </a>
            ) : (
              <span
                className="icon youtube disabled"
                data-tooltip="Not linked"
                aria-label="YouTube (Not linked)"
                role="button"
                aria-disabled="true"
              >
                <i className="fab fa-youtube"></i>
              </span>
            )}

            {/* Twitter / X */}
            {profile.twitter ? (
              <a
                className="icon twitter"
                href={profile.twitter}
                data-tooltip="X (Twitter)"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
              >
                <i className="fab fa-x-twitter"></i>
              </a>
            ) : (
              <span
                className="icon twitter disabled"
                data-tooltip="Not linked"
                aria-label="Twitter / X (Not linked)"
                role="button"
                aria-disabled="true"
              >
                <i className="fab fa-x-twitter"></i>
              </span>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
