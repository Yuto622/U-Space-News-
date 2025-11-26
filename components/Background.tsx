import React from 'react';

const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#050505]">
      {/* Deep Space Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1a1c35] via-[#050505] to-[#000000]" />
      
      {/* CSS Stars - Layer 1 (Small) */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(1px 1px at 10px 10px, white 1px, transparent 0)',
          backgroundSize: '50px 50px'
        }}
      />
      {/* CSS Stars - Layer 2 (Medium) */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(1.5px 1.5px at 100px 150px, white 1px, transparent 0)',
          backgroundSize: '300px 300px'
        }}
      />
      {/* CSS Stars - Layer 3 (Large/Bright) */}
      <div 
        className="absolute inset-0 opacity-20 animate-pulse"
        style={{
          backgroundImage: 'radial-gradient(2px 2px at 200px 200px, cyan 1px, transparent 0)',
          backgroundSize: '400px 400px',
          animationDuration: '4s'
        }}
      />

      {/* Aurora / Nebula Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[120px] mix-blend-screen animate-float" />
      <div className="absolute bottom-[0%] right-[-10%] w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[100px] mix-blend-screen" />
      
      {/* Holographic Grid */}
      <div 
        className="absolute inset-0 opacity-[0.05]" 
        style={{
          backgroundImage: 'linear-gradient(to right, #0891b2 1px, transparent 1px), linear-gradient(to bottom, #0891b2 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'linear-gradient(to bottom, transparent, black 40%, black 80%, transparent)'
        }}
      />
    </div>
  );
};

export default Background;