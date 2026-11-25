import { supabase, isSupabaseConfigured } from "./supabase";
import { Profile } from "@/types/profile";

export const fallbackProfile: Profile = {
  id: "default",
  name: "John Doe",
  bio: "Full-Stack Developer",
  stats_html: "Building scalable web products • Clean Code • APIs • Modern Systems",
  cover_image_url: "",
  avatar_url: "",
  portfolio_url: null,
  whatsapp: null,
  telegram: null,
  messenger: null,
  email: null,
  twitter: null,
  youtube: null,
  github: null,
  instagram: null,
  tiktok: null,
  show_projects: true,
};

export async function getProfile(): Promise<Profile> {
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
      telegram: data.telegram ?? null,
      messenger: data.messenger ?? null,
      email: data.email ?? null,
      twitter: data.twitter ?? null,
      youtube: data.youtube ?? null,
      github: data.github ?? null,
      instagram: data.instagram ?? null,
      tiktok: data.tiktok ?? null,
      show_projects: data.show_projects !== false,
    };
  } catch {
    return fallbackProfile;
  }
}
