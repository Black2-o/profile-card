import Image from "next/image";
import type { Metadata } from "next";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
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
  twitter: null,
  youtube: null,
  github: null,
  instagram: null,
};

async function getProfile(): Promise<Profile> {
  if (!isSupabaseConfigured) {
    return fallbackProfile;
  }

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
      whatsapp: data.whatsapp ?? null,
      messenger: data.messenger ?? null,
      email: data.email ?? null,
      twitter: data.twitter ?? null,
      youtube: data.youtube ?? null,
      github: data.github ?? null,
      instagram: data.instagram ?? null,
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
    url: profile.portfolio_url !== "#" && profile.portfolio_url ? profile.portfolio_url : undefined,
    sameAs: [
      profile.whatsapp,
      profile.messenger,
      profile.twitter,
      profile.youtube,
      profile.github,
      profile.instagram,
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
              data-umami-event="click-portfolio"
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

        {/* Follow Me (Now First: Twitter/X -> YouTube -> GitHub -> Instagram) */}
        <div className="section stagger-3">
          <h2>Follow Me</h2>
          <div className="icons">
            {/* X (Twitter) */}
            {profile.twitter ? (
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

            {/* YouTube */}
            {profile.youtube ? (
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

            {/* GitHub */}
            {profile.github ? (
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
            ) : (
              <span
                className="icon github disabled"
                data-tooltip="Not linked"
                aria-label="GitHub (Not linked)"
                role="button"
                aria-disabled="true"
              >
                <i className="fab fa-github"></i>
              </span>
            )}

            {/* Instagram */}
            {profile.instagram ? (
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
          </div>
        </div>

        {/* Talk With Me (Now Second: WhatsApp -> Messenger -> Email) */}
        <div className="section stagger-4">
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
                data-umami-event="click-whatsapp"
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
                data-umami-event="click-messenger"
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
      </main>
    </>
  );
}
