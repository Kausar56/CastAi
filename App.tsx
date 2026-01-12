
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
  <svg width="36" height="36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_12px_rgba(168,85,247,0.6)]">
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
    </defs>
    {/* Hexagonal Background */}
    <path d="M50 5 L89 27.5 L89 72.5 L50 95 L11 72.5 L11 27.5 Z" fill="url(#logoGradient)" />
    {/* Stylized 'C' Swoosh */}
    <path d="M75 35 C65 25, 30 25, 25 50 C20 75, 60 75, 75 60 L65 60 C55 65, 35 65, 35 50 C35 35, 60 35, 65 45 Z" fill="white" fillOpacity="0.9" />
    {/* Stars */}
    <path d="M82 25 L84 29 L88 30 L84 31 L82 35 L80 31 L76 30 L80 29 Z" fill="white" />
    <path d="M90 38 L91 40 L93 41 L91 42 L90 44 L89 42 L87 41 L89 40 Z" fill="white" opacity="0.8" />
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
