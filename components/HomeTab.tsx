
import React, { useState, useRef } from 'react';
import * as gemini from '../services/geminiService';
import { publishCast } from '../services/neynarService';

const Banner = () => {
  const [imgError, setImgError] = useState(false);
  
  // Use root-relative path for more reliable local/production asset loading
  const bannerSrc = "/banner.png";
  
  return (
    <div className="relative w-full h-52 rounded-[2rem] overflow-hidden mb-8 border border-white/10 shadow-2xl group bg-[#0a0118]">
      {!imgError ? (
        <img 
          src={bannerSrc}
          alt="CastAI Studio Banner" 
          onError={() => {
            console.warn("Banner image failed to load, switching to fallback.");
            setImgError(true);
          }}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#1a0b2e] to-black">
          <h2 className="text-4xl font-black tracking-tighter mb-1 text-white uppercase italic">
            Cast<span className="text-purple-500">AI</span> Studio
          </h2>
          <p className="text-[10px] text-purple-300/50 font-bold uppercase tracking-[0.3em]">
            Premium AI Suite
          </p>
        </div>
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60" />
      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-500/10 rounded-full blur-[70px]" />
      <div className="absolute -top-10 -left-10 w-48 h-48 bg-purple-500/10 rounded-full blur-[70px]" />
      
      <div className="absolute bottom-5 left-6 z-10">
        <div className="px-4 py-1.5 bg-purple-600/20 backdrop-blur-xl border border-white/10 rounded-full">
          <span className="text-[10px] font-black uppercase tracking-widest text-white/90">v2.0 Beta</span>
        </div>
      </div>
    </div>
  );
};

const HomeTab: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{type: string, content: string} | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async (type: 'bio' | 'username' | 'post' | 'crypto') => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      let content = '';
      switch(type) {
        case 'bio': content = await gemini.generateBio(); break;
        case 'username': content = await gemini.generateUsernames(); break;
        case 'post': content = await gemini.generateSocialPost(); break;
        case 'crypto': content = await gemini.generateCryptoPost(); break;
      }
      
      if (!content) throw new Error("The AI brain is a bit sleepy. Try again!");
      
      setResult({ type, content });
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 150);
    } catch (err: any) {
      console.error("[CastAI] Error generating content:", err);
      setError(err.message || "Failed to generate. Please check your internet.");
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async () => {
    if (result) {
      const footer = "\n\nGenerated via @castai Studio";
      await publishCast(result.content + footer);
    }
  };

  return (
    <div className="px-5 py-6 space-y-4">
      <Banner />

      <div className="flex flex-col gap-3">
        <ActionButton title="Generate Profile Bio" icon="✨" onClick={() => handleGenerate('bio')} disabled={loading} />
        <ActionButton title="Generate Usernames" icon="💎" onClick={() => handleGenerate('username')} disabled={loading} />
        <ActionButton title="Generate Social Post" icon="🔥" onClick={() => handleGenerate('post')} disabled={loading} />
        <ActionButton title="Viral Crypto Post" icon="💹" onClick={() => handleGenerate('crypto')} disabled={loading} />
      </div>

      {loading && (
        <div className="glass rounded-[2rem] p-10 shimmer-bg h-40 flex flex-col items-center justify-center border-purple-500/30 animate-fadeIn">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
          <div className="text-purple-300 font-black animate-pulse text-[10px] tracking-[0.4em] uppercase">AI Thinking...</div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold text-center animate-shake">
          ⚠️ {error}
        </div>
      )}

      {result && (
        <div ref={resultRef} className="glass rounded-[2.5rem] p-6 border-purple-500/40 neon-glow animate-slideUp space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-purple-500/20 rounded-full text-purple-300 border border-purple-500/20">
              {result.type} drafted
            </span>
          </div>
          <p className="text-lg leading-relaxed text-white font-medium whitespace-pre-wrap">
            {result.content}
          </p>
          <div className="flex gap-3 pt-2">
            <button 
              onClick={() => {
                navigator.clipboard.writeText(result.content);
                alert('Copied to clipboard!');
              }}
              className="flex-1 py-4 bg-white/5 hover:bg-white/10 active:scale-95 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-white/5 transition-all"
            >
              📋 Copy
            </button>
            <button 
              onClick={handlePost}
              className="flex-[2] py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] active:scale-95 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
            >
              🚀 Share Cast
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const ActionButton = ({ title, icon, onClick, disabled }: any) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className="w-full glass p-5 rounded-[1.5rem] flex items-center gap-4 group transition-all duration-300 hover:border-purple-500/50 hover:bg-purple-500/10 active:scale-95 disabled:opacity-50"
  >
    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:bg-purple-500/20 group-hover:border-purple-500/30 transition-all">
      {icon}
    </div>
    <span className="font-black text-sm text-white group-hover:text-purple-300 transition-colors uppercase tracking-tight">{title}</span>
    <div className="ml-auto opacity-30 group-hover:opacity-100 transition-opacity">
      <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
    </div>
  </button>
);

export default HomeTab;
