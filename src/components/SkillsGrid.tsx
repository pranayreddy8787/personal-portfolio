import { Skill } from '../types.ts';
import { Cpu, Server, Database, Cloud, Brain } from 'lucide-react';

interface SkillsGridProps {
  skills: Skill[];
}

export default function SkillsGrid({ skills }: SkillsGridProps) {
  // Group skills by category with Sleek Interface accents
  const categories: Array<{
    name: Skill['category'];
    icon: any;
    color: string;
    barGradient: string;
  }> = [
    { name: 'Frontend', icon: Cpu, color: 'text-indigo-400', barGradient: 'from-indigo-500 to-purple-500' },
    { name: 'Backend', icon: Server, color: 'text-purple-400', barGradient: 'from-purple-500 to-pink-500' },
    { name: 'Database', icon: Database, color: 'text-pink-400', barGradient: 'from-pink-500 to-violet-500' },
    { name: 'DevOps', icon: Cloud, color: 'text-violet-400', barGradient: 'from-violet-500 to-indigo-500' },
    { name: 'AI & ML', icon: Brain, color: 'text-fuchsia-400', barGradient: 'from-fuchsia-500 to-purple-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((cat) => {
        const catSkills = skills.filter(s => s.category === cat.name);
        const Icon = cat.icon;

        if (catSkills.length === 0) return null;

        return (
          <div
            key={cat.name}
            className="rounded-2xl border border-slate-800/60 bg-gradient-to-b from-slate-900/40 to-slate-950/60 p-6 hover:border-indigo-500/30 transition-all duration-300"
          >
            {/* Category Title */}
            <div className="flex items-center gap-2.5 border-b border-slate-800/50 pb-3.5 mb-4">
              <div className={`p-1.5 rounded-xl bg-slate-950 border border-slate-800 ${cat.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold tracking-widest text-white uppercase font-sans">
                {cat.name}
              </h3>
            </div>

            {/* Skills Progress List */}
            <div className="space-y-4.5">
              {catSkills.map((skill) => (
                <div key={skill.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-300 font-medium">{skill.name}</span>
                    <span className="font-mono text-slate-400">{skill.level}%</span>
                  </div>
                  
                  {/* Custom progress bar */}
                  <div className="relative w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/50">
                    <div
                      className={`absolute top-0 left-0 h-full bg-gradient-to-r ${cat.barGradient} rounded-full transition-all duration-500`}
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
