export interface Profile {
  id: string;
  name: string;
  bio: string;
  stats_html: string;
  cover_image_url: string;
  avatar_url: string;
  portfolio_url?: string | null;

  // Flat Social & Contact Links
  whatsapp?: string | null;
  messenger?: string | null;
  email?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  youtube?: string | null;
  twitter?: string | null;

  // Backward-compatibility support
  talk_links?: {
    whatsapp?: string | null;
    messenger?: string | null;
    email?: string | null;
  } | null;
  follow_links?: {
    instagram?: string | null;
    tiktok?: string | null;
    youtube?: string | null;
    twitter?: string | null;
  } | null;

  created_at?: string;
  updated_at?: string;
}
