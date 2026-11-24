export interface Project {
  id: string;
  slug: string;
  title: string;
  short_desc: string;
  overview: string;
  problem: string;
  solution: string;
  tech_highlights: string[];
  cover_image: string;
  demo_url?: string | null;
  github_url?: string | null;
  status?: string | null;
  display_order?: number;
  created_at?: string;
}

// All project data now comes dynamically from Supabase
export const fallbackProjects: Project[] = [];
