import React, { useState, useEffect } from 'react';
import { Tab } from './types';
import Navigation from './components/Navigation';
import HomeTab from './components/HomeTab';
import AirdropTab from './components/AirdropTab';
import ProfileTab from './components/ProfileTab';
import { fetchUserInfo } from './services/neynarService';
import { NeynarUser } from './types';
import { sdk } from '@farcaster/frame-sdk';

const LogoIcon = () => (
  <svg width="42" height="42" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
    <defs>
      <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
    </defs>
    {/* Hexagon Background */}
    <path d="M50 5 L89 27.5 L89 72.5 L50 95 L11 72.5 L11 27.5 Z" fill="url(#logoGrad)" />
    {/* Refined 'C' swoosh matching the user's logo exactly */}
    <path d="M78 35 C68 22, 32 25, 27 50 C23 72, 58 78, 75 62 C58 73, 28 68, 32 50 C35 30, 68 28, 78 42 Z" fill="white" />
    <path d="M78 35 L75 44 L68 40 L78 35 Z" fill="white" />
    {/* Stars */}
    <path d="M83 22 L84.5 25 L88 26 L84.5 27 L83 30 L81.5 27 L78 26 L81.5 25 Z" fill="white" />
    <path d="M91 35 L92 37 L94 38 L92 39 L91 41 L90 39 L88 38 L90 37 Z" fill="white" opacity="0.8" />
    <path d="M85 45 L85.5 46.5 L87 47 L85.5 47.5 L85 49 L84.5 47.5 L83 47 L84.5 46.5 Z" fill="white" opacity="0.6" />
  </svg>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.HOME);
  const [user, setUser] = useState<NeynarUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const refreshUser = async () => {
    if (!user && !isInitializing) return;
    const fid = user?.fid || 3;
    const userData = await fetchUserInfo(fid);
    if (userData) {
      setUser(userData);
    }
  };

  useEffect(() => {
    const initApp = async () => {
      try {
        await sdk.actions.ready();
      } catch (e) {
        console.warn("Farcaster SDK ready call failed.", e);
      }

      const isManualDisconnect = localStorage.getItem('castai_disconnected') === 'true';
      if (isManualDisconnect) {
        setIsInitializing(false);
        return;
      }

      try {
        const contextPromise = sdk.context;
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 2000));
        
        let fid = 3; 
        
        try {
          const context = await Promise.race([contextPromise, timeoutPromise]) as any;
          if (context?.user?.fid) {
            fid = context.user.fid;
          }
        } catch (e) {
          console.log("Context fallback to FID 3.");
        }

        const userData = await fetchUserInfo(fid);
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error("Initialization logic failed:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    initApp();
  }, []);

  const handleDisconnect = () => {
    localStorage.setItem('castai_disconnected', 'true');
    setUser(null);
    setActiveTab(Tab.HOME);
  };

  const handleConnect = async () => {
    localStorage.removeItem('castai_disconnected');
    setIsInitializing(true);
    try {
      let fid = 3;
      try {
        const context = await sdk.context;
        if (context?.user?.fid) fid = context.user.fid;
      } catch(e) {}
      
      const userData = await fetchUserInfo(fid);
      if (userData) setUser(userData);
    } finally {
      setIsInitializing(false);
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case Tab.HOME:
        return <HomeTab />;
      case Tab.AIRDROP:
        return <AirdropTab />;
      case Tab.PROFILE:
        return <ProfileTab user={user} onDisconnect={handleDisconnect} refreshUser={refreshUser} />;
      default:
        return <HomeTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0118] via-[#050520] to-black text-white flex flex-col pb-24 overflow-y-auto">
      <header className="p-4 flex items-center justify-between border-b border-white/5 sticky top-0 z-50 glass shadow-2xl">
        <div className="flex items-center gap-3">
          <LogoIcon />
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-400 to-blue-400">
              CastAI
            </h1>
            <span className="text-[9px] text-purple-400 font-bold tracking-[0.25em] uppercase opacity-70">Studio v2</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-2xl border border-white/10 transition-all hover:bg-white/10 group">
              <div className="flex flex-col items-end mr-1">
                <span className="text-[10px] font-bold text-white/90">{user.username}</span>
                <span className="text-[8px] text-purple-400 font-medium">FID: {user.fid}</span>
              </div>
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-[4px] opacity-0 group-hover:opacity-60 transition-opacity" />
                <img src={user.pfp_url} alt="pfp" className="w-8 h-8 rounded-full border border-purple-500 relative z-10 object-cover" />
              </div>
            </div>
          ) : isInitializing ? (
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-ping" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Syncing</span>
            </div>
          ) : (
            <button 
              onClick={handleConnect}
              className="px-5 py-2 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-[11px] font-black uppercase tracking-wider hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all active:scale-95 border border-white/10"
            >
              Connect
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 w-full max-w-md mx-auto relative">
        {renderTab()}
      </main>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;