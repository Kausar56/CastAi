
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
    <path d="M50 5 L89 27.5 L89 72.5 L50 95 L11 72.5 L11 27.5 Z" fill="url(#logoGrad)" />
    <path d="M78 35 C68 22, 32 25, 27 50 C23 72, 58 78, 75 62 C58 73, 28 68, 32 50 C35 30, 68 28, 78 42 Z" fill="white" />
    <path d="M78 35 L75 44 L68 40 L78 35 Z" fill="white" />
    <path d="M83 22 L84.5 25 L88 26 L84.5 27 L83 30 L81.5 27 L78 26 L81.5 25 Z" fill="white" />
  </svg>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.HOME);
  const [user, setUser] = useState<NeynarUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const refreshUser = async () => {
    const fid = user?.fid || 3;
    const userData = await fetchUserInfo(fid);
    if (userData) setUser(userData);
  };

  useEffect(() => {
    const initApp = async () => {
      try {
        await sdk.actions.ready();
        
        const isManualDisconnect = localStorage.getItem('castai_disconnected') === 'true';
        if (isManualDisconnect) {
          setIsInitializing(false);
          return;
        }

        // Context is a direct property in Frame v2 SDK after ready()
        const context = (sdk as any).context;
        const fid = context?.user?.fid || 3;

        const userData = await fetchUserInfo(fid);
        if (userData) setUser(userData);
      } catch (error) {
        console.error("[CastAI] Init failed:", error);
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
      const context = (sdk as any).context;
      const fid = context?.user?.fid || 3;
      const userData = await fetchUserInfo(fid);
      if (userData) setUser(userData);
    } finally {
      setIsInitializing(false);
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case Tab.HOME: return <HomeTab />;
      case Tab.AIRDROP: return <AirdropTab />;
      case Tab.PROFILE: return <ProfileTab user={user} onDisconnect={handleDisconnect} refreshUser={refreshUser} />;
      default: return <HomeTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0118] via-[#050520] to-black text-white flex flex-col pb-24 overflow-y-auto">
      <header className="p-4 flex items-center justify-between border-b border-white/5 sticky top-0 z-50 glass shadow-2xl">
        <div className="flex items-center gap-3">
          <LogoIcon />
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-400 to-blue-400 uppercase">
              CastAI
            </h1>
            <span className="text-[9px] text-purple-400 font-bold tracking-[0.25em] uppercase opacity-70">Studio v2</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-2xl border border-white/10">
              <div className="flex flex-col items-end mr-1">
                <span className="text-[10px] font-bold text-white/90">{user.username}</span>
                <span className="text-[8px] text-purple-400 font-medium">FID: {user.fid}</span>
              </div>
              <img src={user.pfp_url} alt="pfp" className="w-8 h-8 rounded-full border border-purple-500 object-cover shadow-lg" />
            </div>
          ) : (
            <button 
              onClick={handleConnect}
              disabled={isInitializing}
              className="px-5 py-2 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-[11px] font-black uppercase tracking-wider hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all active:scale-95 border border-white/10 disabled:opacity-50"
            >
              {isInitializing ? "..." : "Connect"}
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
