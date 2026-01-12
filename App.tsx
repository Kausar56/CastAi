
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Tab } from './types';
import Navigation from './components/Navigation';
import HomeTab from './components/HomeTab';
import AirdropTab from './components/AirdropTab';
import ProfileTab from './components/ProfileTab';
import { fetchUserInfo } from './services/neynarService';
import { NeynarUser } from './types';
import sdk from '@farcaster/frame-sdk';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.HOME);
  const [user, setUser] = useState<NeynarUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Signal ready immediately to the Farcaster host to clear the splash screen
  useLayoutEffect(() => {
    try {
      sdk.actions.ready();
    } catch (e) {
      console.warn("Farcaster SDK ready call failed", e);
    }
  }, []);

  useEffect(() => {
    const initApp = async () => {
      try {
        // Attempt to retrieve FID from context with a timeout for better resilience
        const contextPromise = sdk.context;
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 1500));
        
        let fid = 3; // Standard fallback for demo
        
        try {
          const context = await Promise.race([contextPromise, timeoutPromise]) as any;
          if (context?.user?.fid) {
            fid = context.user.fid;
          }
        } catch (e) {
          console.warn("Farcaster context unavailable, using demo FID");
        }

        const userData = await fetchUserInfo(fid);
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error("Initialization failed:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    initApp();
  }, []);

  const handleDisconnect = () => {
    setUser(null);
    setActiveTab(Tab.HOME);
  };

  const renderTab = () => {
    switch (activeTab) {
      case Tab.HOME:
        return <HomeTab />;
      case Tab.AIRDROP:
        return <AirdropTab />;
      case Tab.PROFILE:
        return <ProfileTab user={user} onDisconnect={handleDisconnect} />;
      default:
        return <HomeTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-blue-950 to-black text-white flex flex-col pb-20 overflow-y-auto">
      {/* Header */}
      <header className="p-6 flex items-center justify-between border-b border-white/10 sticky top-0 z-50 glass">
        <div className="flex flex-col">
          <h1 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            CastAI
          </h1>
          <span className="text-[10px] text-purple-400 font-bold tracking-[0.2em] uppercase opacity-60">AI Studio</span>
        </div>
        
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/20 transition-all hover:bg-white/20">
              <span className="text-xs font-bold">{user.username}</span>
              <div className="relative">
                <div className="absolute -inset-0.5 bg-purple-500 rounded-full blur-[2px] opacity-50" />
                <img src={user.pfp_url} alt="pfp" className="w-6 h-6 rounded-full border border-purple-500 relative z-10" />
              </div>
            </div>
          ) : isInitializing ? (
            <div className="flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/10 animate-pulse">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Syncing</span>
            </div>
          ) : (
            <button 
              onClick={() => fetchUserInfo(3).then(setUser)}
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-xs font-bold hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all active:scale-95"
            >
              Connect
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 py-8">
        {renderTab()}
      </main>

      {/* Navigation */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;
