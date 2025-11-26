import React from 'react';
import { Rocket, Globe, Star, Rss, Disc } from 'lucide-react';
import { NewsCategory } from '../types';

interface NavigationProps {
  activeCategory: NewsCategory;
  onCategoryChange: (category: NewsCategory) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeCategory, onCategoryChange }) => {
  
  const navItems = [
    { id: NewsCategory.GENERAL, label: 'HEADLINES', sub: '総合', icon: <Rss size={14} /> },
    { id: NewsCategory.ROCKETS, label: 'ROCKETS', sub: 'ロケット', icon: <Rocket size={14} /> },
    { id: NewsCategory.ISS, label: 'STATION', sub: 'ISS', icon: <Globe size={14} /> },
    { id: NewsCategory.ASTRONOMY, label: 'DEEP SPACE', sub: '深宇宙', icon: <Star size={14} /> },
    { id: NewsCategory.MARS, label: 'MARS', sub: '火星', icon: <Disc size={14} /> },
  ];

  return (
    <nav className="w-full sticky top-0 z-50 backdrop-blur-xl border-b border-white/10 bg-[#050505]/80 supports-[backdrop-filter]:bg-[#050505]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => onCategoryChange(NewsCategory.GENERAL)}>
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative w-full h-full rounded-full border border-cyan-500/50 bg-black/50 flex items-center justify-center neon-glow">
                <span className="font-display font-bold text-cyan-400 text-xl">U</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-2xl tracking-[0.2em] text-white leading-none">
                U-SPACE
              </span>
              <span className="text-[10px] text-cyan-500/70 font-mono tracking-widest uppercase">
                Future Intelligence Network
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onCategoryChange(item.id)}
                className={`
                  group relative px-5 py-2 rounded-lg flex flex-col items-center justify-center transition-all duration-300 border border-transparent
                  ${activeCategory === item.id 
                    ? 'bg-white/5 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                    : 'hover:bg-white/5 hover:border-white/10'}
                `}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`${activeCategory === item.id ? 'text-cyan-400' : 'text-gray-400 group-hover:text-cyan-300'}`}>
                    {item.icon}
                  </span>
                  <span className={`font-display font-bold text-sm tracking-wider ${activeCategory === item.id ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                    {item.label}
                  </span>
                </div>
                <span className={`text-[10px] font-light tracking-widest ${activeCategory === item.id ? 'text-cyan-500' : 'text-gray-600 group-hover:text-cyan-500/70'}`}>
                  {item.sub}
                </span>
                
                {/* Active Indicator Line */}
                {activeCategory === item.id && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-cyan-500 shadow-[0_0_8px_cyan]"></div>
                )}
              </button>
            ))}
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden">
            <div className="w-10 h-10 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center">
              <div className="flex flex-col gap-1.5">
                <div className="w-5 h-0.5 bg-cyan-400 shadow-[0_0_5px_cyan]"></div>
                <div className="w-5 h-0.5 bg-white/80"></div>
                <div className="w-3 h-0.5 bg-white/50 ml-auto"></div>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Mobile Nav Scroller */}
      <div className="md:hidden overflow-x-auto pb-4 px-4 flex gap-3 scrollbar-hide border-b border-white/5 bg-black/20">
         {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onCategoryChange(item.id)}
              className={`
                flex-shrink-0 px-4 py-2 rounded-lg border flex flex-col items-center min-w-[100px]
                ${activeCategory === item.id 
                  ? 'border-cyan-500/40 bg-cyan-950/30' 
                  : 'border-white/10 bg-white/5'}
              `}
            >
              <div className={`flex items-center gap-2 ${activeCategory === item.id ? 'text-cyan-400' : 'text-gray-400'}`}>
                 {item.icon}
                 <span className="font-display font-bold text-xs">{item.label}</span>
              </div>
              <span className="text-[10px] text-gray-500 mt-1">{item.sub}</span>
            </button>
          ))}
      </div>
    </nav>
  );
};

export default Navigation;