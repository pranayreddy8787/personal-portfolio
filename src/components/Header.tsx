import { ProfileSettings } from '../types.ts';
import { Github, Linkedin, Mail, FileText, ShieldAlert } from 'lucide-react';

interface HeaderProps {
  settings: ProfileSettings;
  onAdminClick: () => void;
  isAdminActive: boolean;
}

export default function Header({ settings, onAdminClick, isAdminActive }: HeaderProps) {
  return (
    <header className="relative w-full border-b border-slate-800/80 bg-slate-950/40 text-white overflow-hidden py-16 px-6 md:px-12 backdrop-blur-sm">
      {/* Dynamic background decoration */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/5 rounded-full blur-3xl -z-10" />
      
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
        {/* Avatar Image */}
        {settings.avatarUrl && settings.avatarUrl.trim() !== "" && settings.avatarUrl !== "#" && (
          <div className="relative group shrink-0">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 opacity-75 blur-md group-hover:opacity-100 transition duration-500" />
            <img
              src={settings.avatarUrl}
              alt={settings.name}
              id="profile-avatar"
              className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-slate-950 shadow-2xl shadow-indigo-500/20"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              {/* Sleek Pulse Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-[10px] font-bold tracking-widest uppercase mb-4">
                <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                Active Portfolio Portal
              </div>
              
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
                {settings.name}
              </h1>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 mt-2">
              <button
                onClick={onAdminClick}
                id="admin-toggle-button"
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isAdminActive
                    ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.15)]"
                    : "bg-white text-slate-950 border border-transparent shadow-lg shadow-white/5 hover:translate-y-[-1px] hover:shadow-white/10"
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-indigo-400" />
                {isAdminActive ? "Exit Customizer" : "Customize Live Portfolio"}
              </button>
            </div>
          </div>

          <p className="text-xl md:text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 italic mt-2">
            {settings.title}
          </p>

          <p className="text-slate-400 text-sm md:text-base leading-relaxed mt-4 max-w-3xl font-sans">
            {settings.bio}
          </p>

          {/* Socials & Links */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-6">
            <a
              href={`mailto:${settings.email}`}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/85 border border-slate-800 hover:border-indigo-500/30 text-slate-300 hover:text-white transition text-xs font-mono"
            >
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              {settings.email}
            </a>
            {settings.github && (
              <a
                href={settings.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/85 border border-slate-800 hover:border-indigo-500/30 text-slate-300 hover:text-white transition text-xs font-mono"
              >
                <Github className="w-3.5 h-3.5 text-indigo-400" />
                GitHub
              </a>
            )}
            {settings.linkedin && (
              <a
                href={settings.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/85 border border-slate-800 hover:border-indigo-500/30 text-slate-300 hover:text-white transition text-xs font-mono"
              >
                <Linkedin className="w-3.5 h-3.5 text-indigo-400" />
                LinkedIn
              </a>
            )}
            {settings.resumeUrl && settings.resumeUrl !== "#" && (
              <a
                href={settings.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 hover:border-indigo-500/30 text-indigo-300 hover:text-indigo-200 transition text-xs font-mono"
              >
                <FileText className="w-3.5 h-3.5" />
                Curriculum Vitae
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
