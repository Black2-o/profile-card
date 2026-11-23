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
  twitter?: string | null;
  youtube?: string | null;
  github?: string | null;
  instagram?: string | null;

  created_at?: string;
  updated_at?: string;
}
