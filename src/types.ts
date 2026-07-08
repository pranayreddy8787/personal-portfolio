export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  tags: string[];
  imageUrl: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  category: 'web' | 'mobile' | 'ai' | 'fullstack';
}

export interface Skill {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'AI & ML';
  level: number; // 0 - 100
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface ProfileSettings {
  name: string;
  title: string;
  subtitle: string;
  bio: string;
  avatarUrl: string;
  email: string;
  github: string;
  linkedin: string;
  resumeUrl: string;
  aiPersona: string;
}

export interface DBStructure {
  projects: Project[];
  skills: Skill[];
  messages: Message[];
  settings: ProfileSettings;
}
