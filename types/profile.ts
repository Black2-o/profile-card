export interface Profile {
  id: string;
  name: string;
  bio: string;
  stats_html: string;
  cover_image_url: string;
  avatar_url: string;
  portfolio_url?: string;
  talk_links: {
    whatsapp?: string | null;
    messenger?: string | null;
    email?: string | null;
  };
  follow_links: {
    instagram?: string | null;
    tiktok?: string | null;
    youtube?: string | null;
    twitter?: string | null;
  };
  created_at?: string;
  updated_at?: string;
}
