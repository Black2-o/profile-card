import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects | Md Shahidullah",
  description:
    "Explore projects, notes, and technical writeups by Md Shahidullah.",
};

export const revalidate = 60; // Revalidate every minute

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="card projects-card">
      {/* Top Navigation */}
      <div className="projects-topbar">
        <Link
          href="/"
          className="short-back-btn"
          aria-label="Back to Profile"
          data-umami-event="click-back-to-profile"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </Link>
      </div>

      {/* Header Info */}
      <div className="projects-header-content">
        <h1>Projects</h1>
        <p className="projects-subtitle">
          Explore recent builds, applications, and technical works.
        </p>
      </div>

      {/* Notion-style Gallery Cards Grid */}
      <div className="projects-gallery-container">
        {projects.length > 0 ? (
          <div className="gallery-grid">
            {projects.map((project, idx) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className={`gallery-card stagger-${Math.min(idx + 1, 4)}`}
                aria-label={project.title}
                data-umami-event="click-project-card"
                data-umami-event-project={project.slug}
              >
                <div className="gallery-cover">
                  <Image
                    src={project.cover_image}
                    alt={project.title}
                    fill
                    priority={idx < 2}
                    sizes="(max-width: 500px) 50vw, 250px"
                    className="gallery-cover-img"
                  />
                </div>
                <div className="gallery-info">
                  <div className="gallery-title-row">
                    <span className="gallery-title">{project.title}</span>
                    {project.status === "running" && (
                      <span className="running-pill">
                        <span className="running-dot"></span>Running
                      </span>
                    )}
                  </div>
                  {project.short_desc && (
                    <p className="gallery-desc">{project.short_desc}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-projects">
            <i className="fa-solid fa-laptop-code"></i>
            <p>No projects available right now. Check back soon!</p>
          </div>
        )}
      </div>
    </main>
  );
}
