export interface Profile {
  id: string;
  name: string;
  bio: string;
  stats_html: string;
  cover_image_url: string;
  avatar_url: string;
  portfolio_url?: string | null;
  show_projects?: boolean | null;

  // Direct Contact Links
  whatsapp?: string | null;
  telegram?: string | null;
  messenger?: string | null;
  email?: string | null;

  // Social & Community Links
  twitter?: string | null;
  youtube?: string | null;
  github?: string | null;
  instagram?: string | null;
  tiktok?: string | null;

  created_at?: string;
  updated_at?: string;
}
