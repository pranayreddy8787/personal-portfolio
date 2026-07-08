import React from 'react';
import { Project } from '../types.ts';
import { ExternalLink, Github, ZoomIn } from 'lucide-react';

interface ProjectCardProps {
  key?: string | number;
  project: Project;
  onViewDetails: (project: Project) => void;
}

export default function ProjectCard({ project, onViewDetails }: ProjectCardProps) {
  // Category colors mapped beautifully to Sleek Interface accents
  const categoryLabels: Record<string, { text: string; bg: string; border: string }> = {
    web: { text: "Web SPA", bg: "bg-indigo-500/10 text-indigo-400", border: "border-indigo-500/20" },
    mobile: { text: "Mobile App", bg: "bg-purple-500/10 text-purple-400", border: "border-purple-500/20" },
    ai: { text: "Ambient AI", bg: "bg-pink-500/10 text-pink-400", border: "border-pink-500/20" },
    fullstack: { text: "Full Stack", bg: "bg-violet-500/10 text-violet-400", border: "border-violet-500/20" }
  };

  const cat = categoryLabels[project.category] || { text: project.category, bg: "bg-slate-500/10 text-slate-400", border: "border-slate-500/20" };

  return (
    <div
      id={`project-card-${project.id}`}
      className="group flex flex-col h-full rounded-2xl border border-slate-800/60 bg-gradient-to-b from-slate-900/60 to-slate-950/80 hover:border-indigo-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/5 overflow-hidden"
    >
      {/* Project Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
        <img
          src={project.imageUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c"}
          alt={project.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
        
        {/* Category Badge */}
        <span className={`absolute top-3 left-3 text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border ${cat.bg} ${cat.border}`}>
          {cat.text}
        </span>

        {/* Featured Badge */}
        {project.featured && (
          <span className="absolute top-3 right-3 text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/30">
            ★ Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
          {project.title}
        </h3>
        
        <p className="text-slate-400 text-xs md:text-sm mt-3 line-clamp-3 leading-relaxed flex-1 font-sans">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {project.tags.slice(0, 4).map((tag, idx) => (
            <span
              key={idx}
              className="text-[9px] font-mono bg-slate-950 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-800/80"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 4 && (
            <span className="text-[9px] font-mono text-slate-500 px-1 py-1">
              +{project.tags.length - 4} more
            </span>
          )}
        </div>

        {/* Interactive Bar */}
        <div className="flex items-center justify-between border-t border-slate-800/60 mt-6 pt-4">
          <button
            onClick={() => onViewDetails(project)}
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
            Specs & Details
          </button>

          <div className="flex items-center gap-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
                title="View Codebase"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
                title="View Production Release"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
