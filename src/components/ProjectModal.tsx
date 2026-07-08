import { Project } from '../types.ts';
import { X, ExternalLink, Github, Monitor, Tag } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Box */}
      <div 
        id="project-details-modal"
        className="relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-950 text-slate-100 overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col"
      >
        {/* Header Bar with close */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/60">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">
              {project.category} Core Architecture
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Container (Scrollable) */}
        <div className="overflow-y-auto flex-1">
          {/* Banner image */}
          <div className="relative aspect-video w-full bg-slate-950">
            <img
              src={project.imageUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c"}
              alt={project.title}
              className="object-cover w-full h-full"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
          </div>

          <div className="p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {project.title}
            </h2>

            {/* Links and Actions */}
            <div className="flex flex-wrap items-center gap-3 mt-4">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl shadow-lg shadow-indigo-500/25 transition-all"
                >
                  <Monitor className="w-4 h-4" />
                  Live Platform
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-slate-900/80 hover:bg-slate-800/85 border border-slate-800 hover:border-indigo-500/30 text-slate-300 hover:text-white rounded-xl transition-all"
                >
                  <Github className="w-4 h-4 text-indigo-400" />
                  Source Repository
                </a>
              )}
            </div>

            {/* Specifications Details */}
            <div className="mt-8 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800/60 pb-2">
                Detailed Functional Overview
              </h3>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap font-sans">
                {project.longDescription || project.description}
              </p>
            </div>

            {/* Technologies Grid */}
            <div className="mt-8 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800/60 pb-2 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-indigo-400" />
                Technical Stack Inventory
              </h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {project.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-mono bg-slate-950 hover:bg-slate-900 border border-slate-800/80 px-3 py-1.5 rounded-lg text-indigo-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
