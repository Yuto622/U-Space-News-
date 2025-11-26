import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = "", hoverEffect = false }) => {
  return (
    <div 
      className={`
        glass-panel rounded-2xl p-6 relative overflow-hidden transition-all duration-300
        ${hoverEffect ? 'hover:bg-white/5 hover:scale-[1.01] hover:border-cyan-500/30 group' : ''}
        ${className}
      `}
    >
      {/* Shine effect on hover */}
      {hoverEffect && (
        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent z-0 pointer-events-none" />
      )}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};

export default GlassCard;