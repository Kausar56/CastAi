
import React, { useState, useRef } from 'react';
import * as gemini from '../services/geminiService';
import { publishCast } from '../services/neynarService';

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
        // Reset posted state after a delay so they can post again if needed
        setTimeout(() => setPosted(false), 3000);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">AI Studio</h2>
        <p className="text-gray-400 text-sm">Boost your Farcaster presence with AI</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <GenerationButton 
          title="Generate Profile Bio" 
          icon="✍️" 
          onClick={() => handleGenerate('bio')} 
          disabled={loading}
        />
        <GenerationButton 
          title="Generate Username" 
          icon="🆔" 
          onClick={() => handleGenerate('username')} 
          disabled={loading}
        />
        <GenerationButton 
          title="Generate Social Post" 
          icon="🌐" 
          onClick={() => handleGenerate('post')} 
          disabled={loading}
        />
        <GenerationButton 
          title="Trending Crypto Post" 
          icon="📈" 
          onClick={() => handleGenerate('crypto')} 
          disabled={loading}
        />
      </div>

      {loading && (
        <div className="glass rounded-3xl p-8 shimmer-bg h-48 flex items-center justify-center border-purple-500/30">
          <div className="text-center">
            <div className="animate-spin mb-4 mx-auto w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" />
            <p className="text-purple-300 font-medium animate-pulse">Consulting the AI Oracles...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-red-400 text-sm flex items-start gap-3 animate-[fadeIn_0.3s_ease-out]">
          <svg className="mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div ref={resultRef} className="glass rounded-3xl p-6 border-purple-500/40 neon-glow animate-[fadeIn_0.5s_ease-out]">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-black uppercase tracking-widest text-purple-400">{result.type} Result</span>
            <div className="flex gap-2">
              <button 
                onClick={handleCopy}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white"
                title="Copy content"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              </button>
            </div>
          </div>
          <div className="text-lg leading-relaxed mb-6 whitespace-pre-wrap font-medium">
            {result.content}
          </div>
          <button 
            onClick={handlePost}
            disabled={posted}
            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all ${posted ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-[1.02] active:scale-95 shadow-lg shadow-purple-500/20'}`}
          >
            {posted ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Opening Composer...
              </>
            ) : (
              <>
                🚀 Post to Farcaster
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
  icon: string;
  onClick: () => void;
  disabled: boolean;
}

const GenerationButton: React.FC<GenerationButtonProps> = ({ title, icon, onClick, disabled }) => {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className="w-full glass p-5 rounded-2xl flex items-center justify-between group hover:border-purple-500/50 transition-all active:scale-98 disabled:opacity-50 text-left"
    >
      <div className="flex items-center gap-4">
        <span className="text-2xl">{icon}</span>
        <span className="font-semibold text-gray-200 group-hover:text-white transition-colors">{title}</span>
      </div>
      <svg className="text-gray-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
    </button>
  );
};

export default HomeTab;
