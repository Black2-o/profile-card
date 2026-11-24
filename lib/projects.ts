import { supabase, isSupabaseConfigured } from "./supabase";
import { Project } from "@/data/projects";

export async function getProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("display_order", { ascending: true, nullsFirst: false });

    if (error || !data) {
      return [];
    }

    return data as Project[];
  } catch {
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!isSupabaseConfigured || !slug) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (!error && data) {
      return data as Project;
    }
  } catch {
    return null;
  }

  return null;
}
