
import React from 'react';

const AirdropTab: React.FC = () => {
  return (
    <div className="h-[70vh] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 flex items-center justify-center -z-10">
        <div className="w-64 h-64 bg-purple-600/20 rounded-full blur-[100px] animate-pulse" />
      </div>

      {/* Floating Particles Simulation */}
      <div className="absolute inset-0 pointer-events-none opacity-50">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 4 + 'px',
              height: Math.random() * 4 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animation: `float ${Math.random() * 5 + 5}s infinite linear`,
              opacity: Math.random()
            }}
          />
        ))}
      </div>

      <div className="relative group">
        <div className="absolute inset-0 bg-purple-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity animate-ping" />
        <div className="w-48 h-48 border-4 border-purple-500/30 rounded-full flex items-center justify-center relative">
          <div className="absolute inset-2 border-2 border-dashed border-blue-500/40 rounded-full animate-[spin_20s_linear_infinite]" />
          <div className="absolute inset-4 border-4 border-purple-500/60 rounded-full animate-[spin_10s_linear_infinite_reverse]" />
          <span className="text-6xl animate-bounce">🎁</span>
        </div>
      </div>

      <div className="mt-12 text-center space-y-4">
        <h2 className="text-4xl font-black italic tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
          AIRDROP
        </h2>
        <div className="px-6 py-2 glass rounded-full border-white/20 inline-block">
          <p className="text-xl font-medium tracking-widest uppercase opacity-80">
            Coming Soon
          </p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-100px) rotate(180deg); }
          100% { transform: translateY(0px) rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AirdropTab;
