import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProjectBySlug, getProjects } from "@/lib/projects";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} | Md Shahidullah`,
    description: project.short_desc || project.overview,
  };
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({
    slug: p.slug,
  }));
}

export const revalidate = 60;

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="card project-detail-card">
      {/* Top Navigation */}
      <div className="projects-topbar">
        <Link href="/projects" className="short-back-btn" aria-label="Back to Projects">
          <i className="fa-solid fa-arrow-left"></i>
        </Link>
      </div>

      {/* Project Cover Banner */}
      <div className="project-detail-cover">
        <Image
          src={project.cover_image}
          alt={project.title}
          fill
          priority
          sizes="(max-width: 540px) 100vw, 540px"
          className="project-detail-cover-img"
        />
        <div className="cover-overlay" />
      </div>

      {/* Main Content Body */}
      <div className="project-detail-body">
        <div className="project-detail-header">
          <h1>{project.title}</h1>
          {project.status === "running" && (
            <span className="running-pill">
              <span className="running-dot"></span>Running
            </span>
          )}
        </div>

        {project.short_desc && (
          <p className="project-detail-short">{project.short_desc}</p>
        )}

        {/* Overview */}
        <div className="project-detail-section">
          <h2>Overview</h2>
          <p className="project-detail-text">
            {project.overview || project.short_desc}
          </p>
        </div>

        {/* Why I Built It (The Problem) */}
        {project.problem && (
          <div className="project-detail-section">
            <h2>Why I Built It (The Problem)</h2>
            <p className="project-detail-text">{project.problem}</p>
          </div>
        )}

        {/* The Solution & Features */}
        {project.solution && (
          <div className="project-detail-section">
            <h2>The Solution & Features</h2>
            <div className="project-solution-list">
              {project.solution.split("\n").map((line, i) => {
                const trimmed = line.trim();
                if (!trimmed) return null;
                const clean = trimmed.startsWith("•")
                  ? trimmed.slice(1).trim()
                  : trimmed;
                return (
                  <div key={i} className="solution-bullet">
                    <span className="bullet-dot">•</span>
                    <span className="bullet-text">{clean}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tech Highlights */}
        {project.tech_highlights && project.tech_highlights.length > 0 && (
          <div className="project-detail-section">
            <h2>Tech Highlights</h2>
            <div className="project-tags">
              {project.tech_highlights.map((tech) => (
                <span key={tech} className="project-tag">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Project Links (Only shown if demo_url is added) */}
        {project.demo_url && (
          <div className="project-detail-section">
            <h2>Project Links</h2>
            <div className="project-actions">
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="project-action-btn primary"
                aria-label={`Visit ${project.title}`}
                data-umami-event={`project-demo-${project.slug}`}
              >
                <i className="fa-solid fa-arrow-up-right-from-square"></i>
                <span>Live Preview</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
