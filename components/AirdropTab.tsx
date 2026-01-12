
import React from 'react';

const AirdropTab: React.FC = () => {
  return (
    <div className="h-[75vh] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white/20 rounded-full"
            style={{
              width: Math.random() * 6 + 2 + 'px',
              height: Math.random() * 6 + 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animation: `float ${Math.random() * 10 + 10}s infinite linear`,
              opacity: Math.random() * 0.5
            }}
          />
        ))}
      </div>

      {/* Pulsing Neon Ring */}
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-purple-500 rounded-full blur-[40px] opacity-20 animate-pulse" />
        <div className="w-40 h-40 border-[1px] border-purple-500/30 rounded-full flex items-center justify-center relative">
          <div className="absolute inset-[-10px] border-[1px] border-purple-500/20 rounded-full" style={{ animation: 'pulse-ring 2s infinite' }} />
          <div className="absolute inset-[-20px] border-[1px] border-blue-500/10 rounded-full" style={{ animation: 'pulse-ring 2s infinite 0.5s' }} />
          <span className="text-6xl drop-shadow-2xl">🎁</span>
        </div>
      </div>

      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black italic tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-400 to-blue-400">
          AIRDROP
        </h2>
        <p className="text-sm font-bold uppercase tracking-[0.4em] text-gray-500 animate-pulse">
          Coming Soon
        </p>
      </div>
    </div>
  );
};

export default AirdropTab;
