import React, { useState, useEffect } from 'react';
import { Project, Skill, Message, ProfileSettings } from '../types.ts';
import { 
  Settings, Mail, Briefcase, Award, Save, Trash2, Edit2, Plus, 
  MessageSquare, CheckSquare, Square, RefreshCw, X
} from 'lucide-react';

interface AdminPanelProps {
  settings: ProfileSettings;
  projects: Project[];
  skills: Skill[];
  onUpdate: () => void; // Call to parent to reload entire profile data
}

export default function AdminPanel({ settings, projects, skills, onUpdate }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'settings' | 'projects' | 'skills' | 'messages'>('settings');
  
  // Settings State
  const [profileForm, setProfileForm] = useState<ProfileSettings>({ ...settings });
  
  // Projects Management State
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [projectForm, setProjectForm] = useState<Partial<Project>>({
    title: "",
    description: "",
    longDescription: "",
    tags: [],
    imageUrl: "",
    githubUrl: "",
    liveUrl: "",
    featured: false,
    category: "web"
  });
  const [tagInput, setTagInput] = useState("");

  // Skills Management State
  const [skillForm, setSkillForm] = useState<Partial<Skill>>({
    name: "",
    category: "Frontend",
    level: 80
  });

  // Messages Inbox State
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  // Status Alerts
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });

  useEffect(() => {
    setProfileForm({ ...settings });
  }, [settings]);

  // Load Messages
  const fetchMessages = async () => {
    setMessagesLoading(true);
    try {
      const res = await fetch("/api/messages");
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setMessagesLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'messages') {
      fetchMessages();
    }
  }, [activeTab]);

  const showStatus = (type: 'success' | 'error', message: string) => {
    setSaveStatus({ type, message });
    setTimeout(() => setSaveStatus({ type: '', message: '' }), 4000);
  };

  // Save Settings
  const handleSaveSettings = async () => {
    try {
      const res = await fetch("/api/profile/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm)
      });
      if (res.ok) {
        showStatus('success', "Settings & AI Agent Persona synchronized successfully!");
        onUpdate();
      } else {
        showStatus('error', "Failed to sync settings.");
      }
    } catch (err: any) {
      showStatus('error', err.message);
    }
  };

  // Save / Update Project
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.description || !projectForm.category) {
      showStatus('error', "Title, description, and category are required.");
      return;
    }

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectForm)
      });
      if (res.ok) {
        showStatus('success', projectForm.id ? "Project updated successfully!" : "New project added!");
        setProjectForm({
          title: "",
          description: "",
          longDescription: "",
          tags: [],
          imageUrl: "",
          githubUrl: "",
          liveUrl: "",
          featured: false,
          category: "web"
        });
        setTagInput("");
        setEditingProject(null);
        onUpdate();
      } else {
        showStatus('error', "Failed to save project.");
      }
    } catch (err: any) {
      showStatus('error', err.message);
    }
  };

  const handleEditProject = (p: Project) => {
    setEditingProject(p);
    setProjectForm(p);
    setTagInput(p.tags.join(", "));
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        showStatus('success', "Project deleted from database.");
        onUpdate();
      }
    } catch (e: any) {
      showStatus('error', e.message);
    }
  };

  // Add tag helper
  const handleTagsChange = (val: string) => {
    setTagInput(val);
    const splitTags = val.split(",").map(t => t.trim()).filter(t => t.length > 0);
    setProjectForm(prev => ({ ...prev, tags: splitTags }));
  };

  // Save Skill
  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillForm.name || !skillForm.category) return;

    try {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(skillForm)
      });
      if (res.ok) {
        showStatus('success', "Skill recorded successfully!");
        setSkillForm({ name: "", category: "Frontend", level: 80 });
        onUpdate();
      }
    } catch (e: any) {
      showStatus('error', e.message);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      const res = await fetch(`/api/skills/${id}`, { method: "DELETE" });
      if (res.ok) {
        showStatus('success', "Skill deleted.");
        onUpdate();
      }
    } catch (e: any) {
      showStatus('error', e.message);
    }
  };

  // Message Inbox Handlers
  const handleToggleRead = async (id: string) => {
    try {
      const res = await fetch(`/api/messages/${id}/read`, { method: "POST" });
      if (res.ok) {
        fetchMessages();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchMessages();
        showStatus('success', "Inquiry deleted from database.");
      }
    } catch (e: any) {
      showStatus('error', e.message);
    }
  };

  return (
    <div id="admin-customizer-panel" className="w-full max-w-6xl mx-auto px-4 md:px-0 py-8">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Banner Title */}
        <div className="bg-gradient-to-r from-amber-500/20 to-indigo-500/20 px-6 py-5 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold font-sans text-zinc-100 flex items-center gap-2">
              <Settings className="w-5 h-5 text-amber-500 animate-spin-slow" />
              Live Portfolio Customizer Portal
            </h2>
            <p className="text-xs text-zinc-400 font-mono mt-1">
              Direct full-stack database control. Changes are immediately reflected across the website and AI agent responses.
            </p>
          </div>
          {saveStatus.message && (
            <div className={`px-4 py-2 rounded-lg text-xs font-medium font-mono shrink-0 ${
              saveStatus.type === 'success' 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/25'
            }`}>
              {saveStatus.message}
            </div>
          )}
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-zinc-800 bg-zinc-950 px-4 py-1 flex-wrap gap-1">
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 px-4 py-3 text-xs md:text-sm font-medium border-b-2 transition-all ${
              activeTab === 'settings'
                ? 'border-amber-500 text-amber-400 font-semibold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            Bio & AI Representative Settings
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-1.5 px-4 py-3 text-xs md:text-sm font-medium border-b-2 transition-all ${
              activeTab === 'projects'
                ? 'border-amber-500 text-amber-400 font-semibold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Manage Showcase Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`flex items-center gap-1.5 px-4 py-3 text-xs md:text-sm font-medium border-b-2 transition-all ${
              activeTab === 'skills'
                ? 'border-amber-500 text-amber-400 font-semibold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Award className="w-4 h-4" />
            Manage Skills Inventory ({skills.length})
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-1.5 px-4 py-3 text-xs md:text-sm font-medium border-b-2 transition-all ${
              activeTab === 'messages'
                ? 'border-amber-500 text-amber-400 font-semibold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Mail className="w-4 h-4" />
            Contact Messages Inbox
          </button>
        </div>

        {/* Panel Content */}
        <div className="p-6 md:p-8 bg-zinc-900 text-zinc-200">
          
          {/* TAB 1: General Settings & AI Persona */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile fields */}
                <div className="space-y-4">
                  <h3 className="text-sm font-mono text-zinc-400 uppercase tracking-wider border-b border-zinc-800 pb-1.5">
                    General Bio Details
                  </h3>
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase">Developer Name</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs md:text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase">Professional Title</label>
                    <input
                      type="text"
                      value={profileForm.title}
                      onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs md:text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase">Subtitle Header</label>
                    <input
                      type="text"
                      value={profileForm.subtitle}
                      onChange={(e) => setProfileForm({ ...profileForm, subtitle: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs md:text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase">Short Bio Details</label>
                    <textarea
                      rows={4}
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs md:text-sm resize-none"
                    />
                  </div>
                </div>

                {/* Avatar and Links */}
                <div className="space-y-4">
                  <h3 className="text-sm font-mono text-zinc-400 uppercase tracking-wider border-b border-zinc-800 pb-1.5">
                    Profile Media & Social Channels
                  </h3>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase">Profile Avatar Photo URL</label>
                    <input
                      type="text"
                      value={profileForm.avatarUrl}
                      onChange={(e) => setProfileForm({ ...profileForm, avatarUrl: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs md:text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-zinc-400 uppercase">Email Contact</label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs md:text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-zinc-400 uppercase">Resume URL</label>
                      <input
                        type="text"
                        value={profileForm.resumeUrl}
                        onChange={(e) => setProfileForm({ ...profileForm, resumeUrl: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs md:text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-zinc-400 uppercase">GitHub Profile</label>
                      <input
                        type="text"
                        value={profileForm.github}
                        onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs md:text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-zinc-400 uppercase">LinkedIn Profile</label>
                      <input
                        type="text"
                        value={profileForm.linkedin}
                        onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs md:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bot Persona Settings */}
              <div className="space-y-4 border-t border-zinc-850 pt-5">
                <h3 className="text-sm font-mono text-zinc-400 uppercase tracking-wider border-b border-zinc-800 pb-1.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-purple-500 rounded-full animate-ping" />
                  AI Representative Smart Persona System Prompt
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-4xl">
                  Configure the exact instructions and semantic boundaries that dictate how the Gemini-powered AI Representative behaves when guests ask questions on the main page. Inject technical tone directives, hidden fun facts, or preferred phrasing.
                </p>
                <div className="space-y-1.5">
                  <textarea
                    rows={4}
                    value={profileForm.aiPersona}
                    onChange={(e) => setProfileForm({ ...profileForm, aiPersona: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-indigo-500 rounded-lg px-3.5 py-2.5 text-xs md:text-sm font-mono leading-relaxed"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveSettings}
                className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs md:text-sm font-semibold rounded-lg transition shadow-md"
              >
                <Save className="w-4 h-4" />
                Synchronize Profile & AI Brain
              </button>
            </div>
          )}

          {/* TAB 2: Manage Projects */}
          {activeTab === 'projects' && (
            <div className="space-y-8">
              {/* Form */}
              <form onSubmit={handleSaveProject} className="bg-zinc-950/60 p-5 rounded-xl border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
                  <h3 className="text-sm font-mono font-semibold text-zinc-300">
                    {editingProject ? `Edit Showcase Project: "${editingProject.title}"` : "Add New Portfolio Showcase Project"}
                  </h3>
                  {editingProject && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProject(null);
                        setProjectForm({
                          title: "", description: "", longDescription: "", tags: [],
                          imageUrl: "", githubUrl: "", liveUrl: "", featured: false, category: "web"
                        });
                        setTagInput("");
                      }}
                      className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
                    >
                      <X className="w-3 h-3" /> Cancel Edit
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase">Project Title *</label>
                    <input
                      type="text"
                      required
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      placeholder="e.g., Space Sim Canvas"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs md:text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase">Showcase Category *</label>
                    <select
                      value={projectForm.category}
                      onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value as any })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs md:text-sm text-zinc-300"
                    >
                      <option value="web">Web SPA</option>
                      <option value="mobile">Mobile App</option>
                      <option value="ai">Ambient AI</option>
                      <option value="fullstack">Full Stack</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase">Display Banner Image URL</label>
                    <input
                      type="text"
                      value={projectForm.imageUrl}
                      onChange={(e) => setProjectForm({ ...projectForm, imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/photo..."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs md:text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase">GitHub Repository Link</label>
                    <input
                      type="text"
                      value={projectForm.githubUrl}
                      onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                      placeholder="https://github.com/alex/project"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs md:text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase">Live Demo Link</label>
                    <input
                      type="text"
                      value={projectForm.liveUrl}
                      onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                      placeholder="https://project.example.com"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs md:text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase">Short Summary Card Description *</label>
                  <input
                    type="text"
                    required
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    placeholder="Short summary displayed on the card..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs md:text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase">Full Detailed Architectural Overview (Specs Overlay)</label>
                  <textarea
                    rows={3}
                    value={projectForm.longDescription}
                    onChange={(e) => setProjectForm({ ...projectForm, longDescription: e.target.value })}
                    placeholder="Detailed walk-through of the system architecture, modules, algorithms, and key achievements..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs md:text-sm resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase">Tags / Stack Tools (Comma Separated)</label>
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => handleTagsChange(e.target.value)}
                      placeholder="React, Express, Gemini, TypeScript"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs md:text-sm"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-4">
                    <input
                      type="checkbox"
                      id="feat-checkbox"
                      checked={projectForm.featured || false}
                      onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                      className="w-4 h-4 rounded border-zinc-800 bg-zinc-900 text-amber-500 focus:ring-amber-500 focus:ring-0"
                    />
                    <label htmlFor="feat-checkbox" className="text-xs font-mono text-zinc-300 cursor-pointer">
                      Feature on Main Showcase Banner
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs md:text-sm font-semibold rounded-lg transition"
                >
                  <Plus className="w-4 h-4" />
                  {editingProject ? "Update Live Project Record" : "Deploy Project to Live Database"}
                </button>
              </form>

              {/* Projects List */}
              <div className="space-y-3">
                <h3 className="text-sm font-mono text-zinc-400 uppercase tracking-wider border-b border-zinc-800 pb-1.5">
                  Currently Stored Projects Database Record ({projects.length})
                </h3>

                <div className="grid grid-cols-1 gap-2.5">
                  {projects.map((p) => (
                    <div 
                      key={p.id}
                      className="flex items-center justify-between p-3.5 bg-zinc-950 border border-zinc-850 rounded-lg hover:border-zinc-750 transition"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img 
                          src={p.imageUrl} 
                          alt="" 
                          className="w-10 h-10 rounded-md object-cover border border-zinc-800 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="overflow-hidden">
                          <h4 className="text-xs md:text-sm font-bold text-zinc-100 truncate">{p.title}</h4>
                          <p className="text-[10px] font-mono text-zinc-500 uppercase mt-0.5 tracking-wider">
                            {p.category} | Tags: {p.tags.join(", ") || "None"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleEditProject(p)}
                          className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
                          title="Edit details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(p.id)}
                          className="p-1.5 rounded-md hover:bg-zinc-800 text-rose-400 hover:text-rose-300 transition"
                          title="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Manage Skills */}
          {activeTab === 'skills' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Add form */}
              <form onSubmit={handleSaveSkill} className="bg-zinc-950/60 p-5 rounded-xl border border-zinc-800 space-y-4 md:col-span-1 h-fit">
                <h3 className="text-sm font-mono font-semibold text-zinc-300 border-b border-zinc-850 pb-2">
                  Add New Technical Skill
                </h3>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase">Skill Name</label>
                  <input
                    type="text"
                    required
                    value={skillForm.name}
                    onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                    placeholder="e.g., Fastify"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase">Technical Group</label>
                  <select
                    value={skillForm.category}
                    onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value as any })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Database">Database</option>
                    <option value="DevOps">DevOps</option>
                    <option value="AI & ML">AI & ML</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase">Expertise Level</label>
                    <span className="text-xs text-zinc-400 font-mono">{skillForm.level}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={skillForm.level || 80}
                    onChange={(e) => setSkillForm({ ...skillForm, level: parseInt(e.target.value) })}
                    className="w-full accent-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Technical Skill
                </button>
              </form>

              {/* Skills List */}
              <div className="md:col-span-2 space-y-3">
                <h3 className="text-sm font-mono text-zinc-400 uppercase tracking-wider border-b border-zinc-800 pb-1.5">
                  Skill Records Inventory ({skills.length})
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[400px] overflow-y-auto pr-1">
                  {skills.map((s) => (
                    <div 
                      key={s.id}
                      className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-850 rounded-lg"
                    >
                      <div>
                        <h4 className="text-xs md:text-sm font-bold text-zinc-100">{s.name}</h4>
                        <p className="text-[10px] font-mono text-zinc-500 mt-0.5">
                          {s.category} • Level {s.level}%
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteSkill(s.id)}
                        className="p-1.5 rounded-md hover:bg-zinc-900 text-rose-400 hover:text-rose-300 transition"
                        title="Delete skill"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Contact Messages Inbox */}
          {activeTab === 'messages' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                <h3 className="text-sm font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-amber-500" />
                  Submitted Client Inquiries ({messages.length})
                </h3>
                <button
                  onClick={fetchMessages}
                  disabled={messagesLoading}
                  className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition flex items-center gap-1 text-xs font-mono"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${messagesLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>

              {messagesLoading && messages.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 text-xs font-mono">
                  Querrying local database records...
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-zinc-800 rounded-xl text-zinc-500 text-xs font-mono">
                  Inbox database currently empty. Any messages sent from the live contact form will show here instantly!
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {messages.map((m) => (
                    <div 
                      key={m.id}
                      className={`p-4 border rounded-xl transition ${
                        m.read 
                          ? 'bg-zinc-950/40 border-zinc-850/60 opacity-80' 
                          : 'bg-zinc-950 border-zinc-800 shadow-md'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2.5 border-b border-zinc-850">
                        <div>
                          <span className="text-xs font-bold text-zinc-100">{m.name}</span>
                          <span className="text-[10px] font-mono text-zinc-500 ml-1.5">({m.email})</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-mono text-zinc-500">
                            {new Date(m.createdAt).toLocaleString()}
                          </span>
                          
                          {/* Toggle read */}
                          <button
                            onClick={() => handleToggleRead(m.id)}
                            className="p-1 rounded hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition"
                            title={m.read ? "Mark as unread" : "Mark as read"}
                          >
                            {m.read ? (
                              <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />
                            ) : (
                              <Square className="w-3.5 h-3.5" />
                            )}
                          </button>
                          
                          {/* Delete msg */}
                          <button
                            onClick={() => handleDeleteMessage(m.id)}
                            className="p-1 rounded hover:bg-zinc-900 text-rose-400 hover:text-rose-300 transition"
                            title="Delete permanently"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Msg text */}
                      <div className="pt-3.5">
                        <h4 className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
                          Subject: {m.subject}
                        </h4>
                        <p className="text-xs md:text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                          {m.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
