
import React, { useState, useRef } from 'react';
import * as gemini from '../services/geminiService';
import { publishCast } from '../services/neynarService';

const Banner = () => (
  <div className="relative w-full h-52 rounded-[2.5rem] overflow-hidden mb-8 border border-white/10 shadow-2xl group">
    {/* Background Image / Banner */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#0a0118] via-[#1a0b2e] to-black" />
    <img 
      src="https://cast-ai-zeta.vercel.app/image.png" 
      alt="Banner" 
      className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay group-hover:scale-105 transition-transform duration-700"
      onError={(e) => {
        e.currentTarget.style.display = 'none';
      }}
    />
    
    {/* Animated Glows */}
    <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-[100px] animate-pulse" />
    <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] animate-pulse delay-1000" />
    
    {/* Content */}
    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
      <div className="mb-4 relative">
        <div className="absolute -inset-4 bg-white/5 rounded-full blur-xl" />
        <img 
          src="https://cast-ai-zeta.vercel.app/icon.png" 
          alt="CastAI Logo" 
          className="w-16 h-16 rounded-2xl relative z-10 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"
          onError={(e) => {
             e.currentTarget.style.display = 'none';
          }}
        />
      </div>

      <div className="mb-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60">Gemini 3 Powered</span>
      </div>
      
      <h2 className="text-4xl font-black tracking-tighter mb-1 text-white drop-shadow-lg">
        CAST<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 italic">AI</span>
      </h2>
      <p className="text-[10px] text-blue-200/50 font-bold uppercase tracking-[0.2em] max-w-[220px] leading-tight">
        The Ultimate Farcaster Creation Studio
      </p>
    </div>

    {/* Decorative Elements */}
    <div className="absolute top-4 right-4 opacity-20">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="white">
        <path d="M20 0 L22 18 L40 20 L22 22 L20 40 L18 22 L0 20 L18 18 Z" />
      </svg>
    </div>
  </div>
);

const HomeTab: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{type: string, content: string} | null>(null);
  const [posted, setPosted] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async (type: 'bio' | 'username' | 'post' | 'crypto') => {
    setLoading(true);
    setError(null);
    setResult(null);
    setPosted(false);
    
    try {
      let content = '';
      switch(type) {
        case 'bio': content = await gemini.generateBio(); break;
        case 'username': content = await gemini.generateUsernames(); break;
        case 'post': content = await gemini.generateSocialPost(); break;
        case 'crypto': content = await gemini.generateCryptoPost(); break;
      }
      
      if (!content) throw new Error("No content was generated. Please try again.");
      
      setResult({ type, content });
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } catch (err: any) {
      console.error("[AI Studio] Generation Error:", err);
      setError(err.message || "Failed to generate content. Check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.content);
      alert("Copied to clipboard!");
    }
  };

  const handlePost = async () => {
    if (result) {
      const footer = "\n\nGenerated via CastAI Studio";
      const success = await publishCast(result.content + footer);
      if (success) {
        setPosted(true);
        setTimeout(() => setPosted(false), 3000);
      }
    }
  };

  return (
    <div className="px-4 py-6 space-y-6">
      <Banner />

      <div className="grid grid-cols-1 gap-3">
        <GenerationButton 
          title="Profile Bio" 
          subtitle="Viral 160-char descriptions"
          icon="✨" 
          onClick={() => handleGenerate('bio')} 
          disabled={loading}
          color="purple"
        />
        <GenerationButton 
          title="Usernames" 
          subtitle="Modern Web3 identifiers"
          icon="💎" 
          onClick={() => handleGenerate('username')} 
          disabled={loading}
          color="blue"
        />
        <GenerationButton 
          title="Social Post" 
          subtitle="High-engagement narratives"
          icon="🔥" 
          onClick={() => handleGenerate('post')} 
          disabled={loading}
          color="fuchsia"
        />
        <GenerationButton 
          title="Crypto Trends" 
          subtitle="Market insight generator"
          icon="💹" 
          onClick={() => handleGenerate('crypto')} 
          disabled={loading}
          color="cyan"
        />
      </div>

      {loading && (
        <div className="glass rounded-[2rem] p-8 shimmer-bg h-48 flex flex-col items-center justify-center border-purple-500/30 overflow-hidden relative">
          <div className="absolute inset-0 bg-purple-500/5 animate-pulse" />
          <div className="relative z-10 text-center">
            <div className="relative w-12 h-12 mb-4 mx-auto">
              <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full" />
              <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-purple-300 font-black text-xs uppercase tracking-[0.3em]">AI Processing</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-red-400 text-xs flex items-start gap-3 animate-bounce">
          <svg className="mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <p className="font-bold">{error}</p>
        </div>
      )}

      {result && (
        <div ref={resultRef} className="glass rounded-[2rem] p-6 border-purple-500/40 neon-glow animate-[slideUp_0.4s_ease-out] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="text-6xl font-black uppercase italic tracking-tighter">{result.type}</span>
          </div>
          
          <div className="flex justify-between items-center mb-6 relative z-10">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-purple-500/20 rounded-full text-purple-300 border border-purple-500/30">
              {result.type} studio result
            </span>
            <button 
              onClick={handleCopy}
              className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-gray-400 hover:text-white border border-white/5 active:scale-90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            </button>
          </div>

          <div className="text-lg leading-relaxed mb-8 whitespace-pre-wrap font-medium text-gray-100 relative z-10 px-2">
            {result.content}
          </div>

          <button 
            onClick={handlePost}
            disabled={posted}
            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-[11px] transition-all relative z-10 ${posted ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-blue-600 hover:scale-[1.02] active:scale-95 shadow-[0_10px_30px_rgba(168,85,247,0.3)] border border-white/10'}`}
          >
            {posted ? (
              <>
                <svg className="animate-bounce" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Syncing to Warpcast...
              </>
            ) : (
              <>
                <span className="text-xl">🚀</span>
                Post to Farcaster
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

interface GenerationButtonProps {
  title: string;
  subtitle: string;
  icon: string;
  onClick: () => void;
  disabled: boolean;
  color: 'purple' | 'blue' | 'fuchsia' | 'cyan';
}

const GenerationButton: React.FC<GenerationButtonProps> = ({ title, subtitle, icon, onClick, disabled, color }) => {
  const colorClasses = {
    purple: 'hover:border-purple-500/50 hover:bg-purple-500/5 text-purple-400',
    blue: 'hover:border-blue-500/50 hover:bg-blue-500/5 text-blue-400',
    fuchsia: 'hover:border-fuchsia-500/50 hover:bg-fuchsia-500/5 text-fuchsia-400',
    cyan: 'hover:border-cyan-500/50 hover:bg-cyan-500/5 text-cyan-400',
  };

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`w-full glass p-5 rounded-3xl flex items-center justify-between group transition-all duration-300 active:scale-[0.97] disabled:opacity-50 text-left border-white/5 ${colorClasses[color]}`}
    >
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform group-hover:bg-white/10 shadow-inner">
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="font-black text-lg text-white group-hover:tracking-tight transition-all uppercase tracking-tight leading-tight">{title}</span>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest group-hover:text-gray-400 transition-colors">{subtitle}</span>
        </div>
      </div>
      <div className="w-10 h-10 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-all">
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </div>
    </button>
  );
};

export default HomeTab;
