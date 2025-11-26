import React from 'react';

const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#050505]">
      {/* Deep Space Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a1c35] via-[#050505] to-[#000000] opacity-80" />
      
      {/* Nebulas */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[100px]" />
      
      {/* Stars (Simulated with CSS grid for performance instead of thousands of divs) */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
      
      {/* Subtle Grid for "Tech" feel */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />
    </div>
  );
};

export default Background;