/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Project, Skill, ProfileSettings } from './types.ts';
import Header from './components/Header.tsx';
import ProjectCard from './components/ProjectCard.tsx';
import ProjectModal from './components/ProjectModal.tsx';
import SkillsGrid from './components/SkillsGrid.tsx';
import AiBot from './components/AiBot.tsx';
import ContactForm from './components/ContactForm.tsx';
import AdminPanel from './components/AdminPanel.tsx';
import { Sparkles, Terminal, Code2, Bot, Layers, Mail, Heart, GraduationCap, Award } from 'lucide-react';

export default function App() {
  const [profileData, setProfileData] = useState<{
    settings: ProfileSettings | null;
    projects: Project[];
    skills: Skill[];
  }>({
    settings: null,
    projects: [],
    skills: []
  });

  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<'all' | 'web' | 'mobile' | 'ai' | 'fullstack'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAdminActive, setIsAdminActive] = useState(false);

  // Load Profile from Backend APIs
  const loadProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setProfileData(data);
      }
    } catch (e) {
      console.error("Error fetching live profile details", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading || !profileData.settings) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-100 gap-4 p-6">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          <Sparkles className="w-5 h-5 text-indigo-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <p className="font-mono text-xs text-zinc-500 tracking-wider uppercase animate-pulse">
          Retrieving live database records...
        </p>
      </div>
    );
  }

  const { settings, projects, skills } = profileData;

  // Filter projects dynamically
  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <div className="relative min-h-screen bg-[#020617] text-slate-200 selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-[20%] right-[-100px] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[140px]"></div>
        <div className="absolute top-[40%] left-[-200px] w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[160px]"></div>
        <div className="absolute inset-0 carbon-fibre-overlay"></div>
      </div>
      
      {/* 1. Header Hero Display */}
      <Header 
        settings={settings} 
        isAdminActive={isAdminActive}
        onAdminClick={() => setIsAdminActive(!isAdminActive)}
      />

      <main className="max-w-6xl mx-auto py-12 px-6 md:px-12 space-y-24">
        
        {/* 2. Admin Live Customizer Panel (if activated) */}
        {isAdminActive && (
          <section id="customizer-section" className="animate-fade-in border-b border-slate-800/60 pb-16">
            <AdminPanel 
              settings={settings}
              projects={projects}
              skills={skills}
              onUpdate={loadProfile}
            />
          </section>
        )}

        {/* 3. Projects Showcase Grid */}
        <section id="projects-showcase" className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/60 pb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
                <Code2 className="w-6 h-6 text-indigo-400" />
                Featured Engineering Showcase
              </h2>
              <p className="text-sm text-slate-400 font-sans mt-1">
                A highly selected list of production architectures, AI platforms, and scientific systems.
              </p>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {(['all', 'web', 'mobile', 'ai', 'fullstack'] as const).map((cat) => {
                const labels: Record<string, string> = {
                  all: "All Repos",
                  web: "Web SPAs",
                  mobile: "Mobile Native",
                  ai: "Generative AI",
                  fullstack: "Full Stack"
                };
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                      activeCategory === cat
                        ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/40 shadow-lg shadow-indigo-500/5"
                        : "bg-slate-900/60 text-slate-400 border-slate-800/80 hover:border-indigo-500/30 hover:text-slate-200"
                    }`}
                  >
                    {labels[cat]}
                  </button>
                );
              })}
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-slate-800/80 rounded-2xl bg-slate-900/20">
              <Layers className="w-8 h-8 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 font-mono text-xs">No projects found in this showcase category.</p>
              <button 
                onClick={() => setIsAdminActive(true)}
                className="text-indigo-400 hover:text-indigo-300 text-xs font-bold mt-2 font-mono underline cursor-pointer"
              >
                Add a project using Customizer
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {filteredProjects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onViewDetails={setSelectedProject}
                />
              ))}
            </div>
          )}
        </section>

        {/* 4. Academic Foundation Section */}
        <section id="academic-foundation" className="space-y-8">
          <div className="border-b border-slate-800/60 pb-6">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <GraduationCap className="w-6 h-6 text-indigo-400" />
              Academic Foundation
            </h2>
            <p className="text-sm text-slate-400 font-sans mt-1">
              Cultivating foundational logic, embedded interfaces, and artificial intelligence models.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Anurag University */}
            <div className="rounded-2xl border border-slate-800/60 bg-gradient-to-b from-slate-900/40 to-slate-950/60 p-6 space-y-4 hover:border-indigo-500/30 transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full">
                  Undergrad • B.Tech
                </span>
                <span className="text-xs font-mono text-slate-500">2024 - 2028</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-sans leading-snug">
                  Anurag University (ANUG)
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Hyderabad, Telangana
                </p>
              </div>
              <div className="space-y-2 pt-2 border-t border-slate-800/50">
                <p className="text-xs text-slate-300 font-sans">
                  <strong className="text-indigo-400">Major:</strong> Artificial Intelligence & Machine Learning (AI&ML)
                </p>
                <p className="text-xs text-slate-300 font-mono bg-slate-950/80 px-2 py-1 rounded border border-slate-800/80 inline-block">
                  CGPA: 8.15 / 10
                </p>
              </div>
            </div>

            {/* Narayana Junior College */}
            <div className="rounded-2xl border border-slate-800/60 bg-gradient-to-b from-slate-900/40 to-slate-950/60 p-6 space-y-4 hover:border-purple-500/30 transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-full">
                  Intermediate (XII)
                </span>
                <span className="text-xs font-mono text-slate-500">2021 - 2024</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-sans leading-snug">
                  Narayana Junior College
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Kuntloor, Telangana
                </p>
              </div>
              <div className="space-y-2 pt-2 border-t border-slate-800/50">
                <p className="text-xs text-slate-300 font-sans">
                  <strong className="text-purple-400">Focus:</strong> MPC (Mathematics, Physics, Chemistry)
                </p>
                <p className="text-xs text-slate-300 font-mono bg-slate-950/80 px-2 py-1 rounded border border-slate-800/80 inline-block">
                  CGPA: 9.7 / 10
                </p>
              </div>
            </div>

            {/* Vikas High School */}
            <div className="rounded-2xl border border-slate-800/60 bg-gradient-to-b from-slate-900/40 to-slate-950/60 p-6 space-y-4 hover:border-pink-500/30 transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-pink-400 uppercase tracking-wider bg-pink-500/10 border border-pink-500/20 px-2.5 py-1 rounded-full">
                  Secondary School (X)
                </span>
                <span className="text-xs font-mono text-slate-500">2019 - 2020</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-sans leading-snug">
                  Vikas High School
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Siddipet, Telangana
                </p>
              </div>
              <div className="space-y-2 pt-2 border-t border-slate-800/50">
                <p className="text-xs text-slate-300 font-sans">
                  <strong className="text-pink-400">Board:</strong> Secondary School Certificate (SSC)
                </p>
                <p className="text-xs text-slate-300 font-mono bg-slate-950/80 px-2 py-1 rounded border border-slate-800/80 inline-block">
                  CGPA: 10.0 / 10
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* 5. Skills Inventory Section */}
        <section id="skills-inventory" className="space-y-8">
          <div className="border-b border-slate-800/60 pb-6">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <Terminal className="w-6 h-6 text-indigo-400" />
              Technical Competence Index
            </h2>
            <p className="text-sm text-slate-400 font-sans mt-1">
              Building foundational capability in python, embedded control, and logical workflows.
            </p>
          </div>

          <SkillsGrid skills={skills} />
        </section>

        {/* 6. Credentials & Certifications */}
        <section id="certificates" className="space-y-8">
          <div className="border-b border-slate-800/60 pb-6">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <Award className="w-6 h-6 text-indigo-400" />
              Credentials & Certifications
            </h2>
            <p className="text-sm text-slate-400 font-sans mt-1">
              Validated industry skillsets through intensive professional coursework.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cert 1 */}
            <div className="flex items-start gap-4 p-5 rounded-2xl border border-slate-800/60 bg-gradient-to-r from-slate-900/40 to-slate-950/60 hover:border-indigo-500/30 transition-all duration-300">
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-bold tracking-widest text-indigo-400 uppercase">Simplilearn</span>
                <h3 className="text-sm font-bold text-white font-sans leading-snug">
                  Basics of Data Structures and Algorithms with C
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Comprehensive grounding in computational arrays, memory pointer referencing, logic sorting paradigms, and tree configurations.
                </p>
              </div>
            </div>

            {/* Cert 2 */}
            <div className="flex items-start gap-4 p-5 rounded-2xl border border-slate-800/60 bg-gradient-to-r from-slate-900/40 to-slate-950/60 hover:border-purple-500/30 transition-all duration-300">
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-bold tracking-widest text-purple-400 uppercase">Simplilearn</span>
                <h3 className="text-sm font-bold text-white font-sans leading-snug">
                  Python Development Course
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Detailed mastery covering functional scripts, file structures, logical operators, variable matrices, and structured problem-solving.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Contact Inquiries & Footer Section */}
        <section id="contact-portal" className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-12 border-t border-slate-800/60">
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs uppercase tracking-wider">
              <Mail className="w-4 h-4" />
              Inquiry Desk
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Let's create something brilliant together.
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed font-sans">
              If you are looking for an enthusiastic AI developer, have an interesting project, or want to discuss physical-digital hardware integrations, leave a direct database submission.
            </p>
            <div className="pt-5 border-t border-slate-800/60 text-slate-500 text-xs font-mono space-y-2">
              <p className="flex items-center gap-1.5"><span className="text-slate-600">Email:</span> <span className="text-slate-300">{settings.email}</span></p>
              <p className="flex items-center gap-1.5"><span className="text-slate-600">Database:</span> <span className="text-slate-300">Client-Only Sandbox Secure SQL</span></p>
              <p className="flex items-center gap-1.5"><span className="text-slate-600">Location:</span> <span className="text-slate-300">Hyderabad, Telangana, IN</span></p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </section>
      </main>

      {/* 8. High-Fidelity Theme Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950/60 py-12 mt-20 px-6 md:px-12 backdrop-blur-md relative overflow-hidden">
        {/* Background Subtle Blob */}
        <div className="absolute bottom-[-100px] left-[20%] w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-6xl mx-auto space-y-10">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-8 border-b border-slate-900">
            <div className="flex flex-wrap gap-12">
              <div>
                <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-3">Local Status</p>
                <div className="flex items-center gap-2">
                  <span className="text-slate-300 font-mono text-xs uppercase">Hyderabad, IN</span>
                  <span className="text-slate-700 font-mono text-xs">/</span>
                  <span className="text-indigo-400 font-mono text-xs">Active Mode</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-3">Primary Focus</p>
                <p className="text-xs text-slate-300 font-medium font-sans">Artificial Intelligence & Software Engineering</p>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end">
              <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-3">Current Engagement</p>
              <div>
                <span className="text-xs text-slate-400 font-sans">B.Tech Student &</span>
                <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 underline decoration-indigo-500/20 underline-offset-4 ml-1">Aspiring AI Developer</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
            <p>© {new Date().getFullYear()} {settings.name}. All architecture rights reserved.</p>
            <div className="flex items-center gap-1.5 text-slate-600">
              <span>Engineered with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20 animate-pulse" />
              <span>& TypeScript Full Stack</span>
            </div>
          </div>

        </div>
      </footer>

      {/* 9. Specs Detail Modal */}
      <ProjectModal 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />

      {/* 10. Floating Gemini AI Representative Agent */}
      <AiBot ownerName={settings.name} />

    </div>
  );
}
