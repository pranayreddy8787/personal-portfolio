import fs from 'fs';
import path from 'path';
import { DBStructure, Project, Skill, Message, ProfileSettings } from '../types.ts';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

// Helper to ensure the directory exists
function ensureDirectoryExists() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const DEFAULT_SETTINGS: ProfileSettings = {
  name: "Pranay Reddy Kodari",
  title: "AI & Software Developer",
  subtitle: "B.Tech in Artificial Intelligence & Machine Learning Student",
  bio: "I am an enthusiastic B.Tech student in Artificial Intelligence and Machine Learning (AI&ML) at Anurag University, Hyderabad. Passionate about software development and intelligence integration, I apply my foundational skills in Python, C, and the MERN stack alongside logical problem-solving to build real-world physical and digital solutions. I love hardware interfacing, embedded robotic cars, and exploring prompt engineering to accelerate my craft. Outside of coding, I'm an avid comic book reader.",
  avatarUrl: "",
  email: "kodaripranayreddy@gmail.com",
  github: "https://github.com",
  linkedin: "https://www.linkedin.com/in/kodari-pranayreddy-480b1232a",
  resumeUrl: "#",
  aiPersona: "You are the AI Assistant representing Pranay Reddy Kodari, an aspiring AI Engineer & Full-Stack Developer currently pursuing his B.Tech in Artificial Intelligence & Machine Learning (AI&ML) at Anurag University, Hyderabad (CGPA: 8.15, class of 2028). Your tone is logical, confident, highly technical, and enthusiastic about building intelligence applications. Inform visitors about his background, education, technical toolkit (C, Python, MERN stack, VS Code, GitHub), certs (Simplilearn's DS&A in C, Python Development), and his core projects: the autonomous Smart Bluetooth-Controlled AI Car (Arduino Uno + speech commands) and the Smart Campus Canteen Management System. If someone asks about his hobbies, mention he enjoys reading comic books."
};

const DEFAULT_PROJECTS: Project[] = [
  {
    id: "1",
    title: "Smart Bluetooth-Controlled AI Car",
    description: "An autonomous robotic car integrating camera-based object detection, speech command processing, and IR sensor–based collision avoidance.",
    longDescription: "Designed and built an autonomous robotic car that integrates camera-based object detection, speech command processing, and IR sensor-based collision avoidance.\n\nImplemented AI inference for basic decision-making and obstacle detection using onboard hardware. Integrated physical hardware components including DC motors, motor driver module, Bluetooth module, IR sensors, and a camera module for video feed.\n\nDemonstrated strong hands-on skills in embedded systems, microcontroller firmware scripting, custom Android application controller development, AI inference integration, and low-level hardware-software interfacing.",
    tags: ["Python", "C (Arduino)", "Arduino Uno", "Bluetooth Module", "IR Sensors", "Computer Vision"],
    imageUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800&h=450",
    githubUrl: "https://github.com",
    liveUrl: "",
    featured: true,
    category: "ai"
  },
  {
    id: "2",
    title: "Smart Campus Canteen Management System",
    description: "A streamlined canteen management platform to automate order placement, real-time digital billing, and live menu displays for students and staff.",
    longDescription: "Developed a simple canteen management system to streamline ordering, billing, and menu display for students and staff, drastically improving overall campus efficiency and reducing peak-hour waiting times.\n\nImplemented core features such as interactive digital menus, order placement, and live order status tracking. Designed an intuitive, beginner-friendly UI with clean logical state management. The system was built with the help of GitHub Copilot AI, utilizing prompt engineering and structured code suggestions to maximize development velocity and optimize security loops.",
    tags: ["React", "Express", "Node.js", "MongoDB", "GitHub Copilot", "Tailwind CSS"],
    imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800&h=450",
    githubUrl: "https://github.com",
    liveUrl: "",
    featured: true,
    category: "fullstack"
  }
];

const DEFAULT_SKILLS: Skill[] = [
  { id: "1", name: "C Language", category: "Backend", level: 85 },
  { id: "2", name: "Python (Basic)", category: "Backend", level: 75 },
  { id: "3", name: "Data Structures & Algorithms", category: "Backend", level: 70 },
  { id: "4", name: "MERN Stack Full-Stack", category: "Frontend", level: 72 },
  { id: "5", name: "React", category: "Frontend", level: 75 },
  { id: "6", name: "Tailwind CSS", category: "Frontend", level: 80 },
  { id: "7", name: "Node.js & Express", category: "Backend", level: 70 },
  { id: "8", name: "MongoDB", category: "Database", level: 65 },
  { id: "9", name: "GitHub & VS Code", category: "DevOps", level: 85 },
  { id: "10", name: "Embedded Systems", category: "AI & ML", level: 78 },
  { id: "11", name: "GitHub Copilot AI", category: "AI & ML", level: 85 }
];

export function readDB(): DBStructure {
  ensureDirectoryExists();
  try {
    if (!fs.existsSync(DB_PATH)) {
      const initialDB: DBStructure = {
        projects: DEFAULT_PROJECTS,
        skills: DEFAULT_SKILLS,
        messages: [],
        settings: DEFAULT_SETTINGS
      };
      fs.writeFileSync(DB_PATH, JSON.stringify(initialDB, null, 2), 'utf-8');
      return initialDB;
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw) as DBStructure;
  } catch (error) {
    console.error("Error reading database:", error);
    return {
      projects: DEFAULT_PROJECTS,
      skills: DEFAULT_SKILLS,
      messages: [],
      settings: DEFAULT_SETTINGS
    };
  }
}

export function writeDB(data: DBStructure) {
  ensureDirectoryExists();
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error writing database:", error);
  }
}
