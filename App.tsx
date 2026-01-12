
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
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">
    <rect width="32" height="32" rx="8" fill="url(#paint0_linear)" />
    <path d="M22 11C22 11 19.5 11 18 13.5C16.5 16 16.5 21 16.5 21" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M10 21C10 21 12.5 21 14 18.5C15.5 16 15.5 11 15.5 11" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="16" cy="16" r="3" fill="white" className="animate-pulse" />
    <defs>
      <linearGradient id="paint0_linear" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#A855F7" />
        <stop offset="1" stopColor="#3B82F6" />
      </linearGradient>
    </defs>
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
