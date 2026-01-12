
import React, { useState, useRef } from 'react';
import * as gemini from '../services/geminiService';
import { publishCast } from '../services/neynarService';

const Banner = () => (
  <div className="relative w-full h-52 rounded-[2rem] overflow-hidden mb-8 border border-white/10 shadow-2xl group">
    {/* High-quality background image from the specific Vercel URL */}
    <img 
      src="https://cast-ai-zeta.vercel.app/banner.png" 
      alt="CastAI Studio Banner" 
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
    />
    
    {/* Subtle dark overlay to ensure readability if we add text, and for depth */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
    
    {/* Decorative light effects to match the logo glow */}
    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-[60px]" />
    <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-[60px]" />
    
    {/* Optional badge */}
    <div className="absolute bottom-4 left-6 z-10">
      <div className="px-3 py-1 bg-purple-600/30 backdrop-blur-md border border-white/20 rounded-full">
        <span className="text-[10px] font-black uppercase tracking-widest text-white/90">Premium AI Suite</span>
      </div>
    </div>
  </div>
);

const HomeTab: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{type: string, content: string} | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async (type: 'bio' | 'username' | 'post' | 'crypto') => {
    setLoading(true);
    setResult(null);
    try {
      let content = '';
      switch(type) {
        case 'bio': content = await gemini.generateBio(); break;
        case 'username': content = await gemini.generateUsernames(); break;
        case 'post': content = await gemini.generateSocialPost(); break;
        case 'crypto': content = await gemini.generateCryptoPost(); break;
      }
      setResult({ type, content });
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async () => {
    if (result) {
      const footer = "\n\nGenerated via CastAI Studio";
      await publishCast(result.content + footer);
    }
  };

  return (
    <div className="px-5 py-6 space-y-4">
      <Banner />

      <div className="flex flex-col gap-3">
        <ActionButton title="Generate Profile Bio" icon="✨" onClick={() => handleGenerate('bio')} disabled={loading} />
        <ActionButton title="Generate Username" icon="💎" onClick={() => handleGenerate('username')} disabled={loading} />
        <ActionButton title="Generate Social Post" icon="🔥" onClick={() => handleGenerate('post')} disabled={loading} />
        <ActionButton title="Trending Crypto Post" icon="💹" onClick={() => handleGenerate('crypto')} disabled={loading} />
      </div>

      {loading && (
        <div className="glass rounded-3xl p-8 shimmer-bg h-40 flex items-center justify-center border-purple-500/20">
          <div className="text-purple-400 font-bold animate-pulse text-xs tracking-widest uppercase">Gemini AI Thinking...</div>
        </div>
      )}

      {result && (
        <div ref={resultRef} className="glass rounded-[2rem] p-6 border-purple-500/40 neon-glow animate-[slideUp_0.4s_ease-out] space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-purple-500/20 rounded-full text-purple-300 border border-purple-500/20">
              {result.type} result
            </span>
          </div>
          <p className="text-lg leading-relaxed text-gray-100 font-medium whitespace-pre-wrap">
            {result.content}
          </p>
          <div className="flex gap-2 pt-2">
            <button 
              onClick={() => {
                navigator.clipboard.writeText(result.content);
                alert('Copied!');
              }}
              className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-xs uppercase tracking-widest border border-white/5 transition-all"
            >
              📋 Copy
            </button>
            <button 
              onClick={handlePost}
              className="flex-[2] py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
            >
              🚀 Post to Farcaster
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
    className="w-full glass p-5 rounded-2xl flex items-center gap-4 group transition-all duration-300 hover:border-purple-500/50 hover:bg-purple-500/5 active:scale-95 disabled:opacity-50"
  >
    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <span className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors">{title}</span>
    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
      <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
    </div>
  </button>
);

export default HomeTab;
