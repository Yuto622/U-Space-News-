import React from 'react';
import { Rocket, Globe, Star, Rss, Disc } from 'lucide-react';
import { NewsCategory } from '../types';

interface NavigationProps {
  activeCategory: NewsCategory;
  onCategoryChange: (category: NewsCategory) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeCategory, onCategoryChange }) => {
  
  const navItems = [
    { id: NewsCategory.GENERAL, label: 'HEADLINES', icon: <Rss size={16} /> },
    { id: NewsCategory.ROCKETS, label: 'ROCKETS', icon: <Rocket size={16} /> },
    { id: NewsCategory.ISS, label: 'STATION', icon: <Globe size={16} /> },
    { id: NewsCategory.ASTRONOMY, label: 'DEEP SPACE', icon: <Star size={16} /> },
    { id: NewsCategory.MARS, label: 'MARS', icon: <Disc size={16} /> },
  ];

  return (
    <nav className="w-full sticky top-0 z-50 backdrop-blur-xl border-b border-white/5 bg-[#050505]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => onCategoryChange(NewsCategory.GENERAL)}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center neon-glow group-hover:scale-110 transition-transform">
              <span className="font-display font-bold text-white text-xl">U</span>
            </div>
            <span className="font-display font-bold text-2xl tracking-wider text-white">
              U-SPACE
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onCategoryChange(item.id)}
                className={`
                  relative px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition-all duration-300
                  ${activeCategory === item.id 
                    ? 'text-cyan-400 bg-white/10 shadow-[0_0_10px_rgba(34,211,238,0.2)] border border-white/10' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'}
                `}
              >
                {item.icon}
                <span className="font-display tracking-widest">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Mobile Menu Button (Simplified for this demo) */}
          <div className="md:hidden">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <div className="w-4 h-4 grid grid-cols-2 gap-1">
                <div className="bg-cyan-400 rounded-sm"></div>
                <div className="bg-white rounded-sm"></div>
                <div className="bg-white rounded-sm"></div>
                <div className="bg-cyan-400 rounded-sm"></div>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Mobile Nav Scroller */}
      <div className="md:hidden overflow-x-auto pb-2 px-4 flex gap-3 scrollbar-hide">
         {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onCategoryChange(item.id)}
              className={`
                whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold border flex items-center gap-2
                ${activeCategory === item.id 
                  ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400' 
                  : 'border-white/10 bg-white/5 text-gray-400'}
              `}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
      </div>
    </nav>
  );
};

export default Navigation;