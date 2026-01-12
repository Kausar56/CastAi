
import React, { useState, useEffect } from 'react';
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
  const [isFrame, setIsFrame] = useState(false);

  // Signal ready as soon as the component is mounted to clear splash screen
  useEffect(() => {
    sdk.actions.ready();
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        // We wrap this in a timeout or separate try block to avoid blocking
        const context = await sdk.context;
        if (context?.user) {
          setIsFrame(true);
          const userData = await fetchUserInfo(context.user.fid);
          if (userData) setUser(userData);
        } else {
          // Fallback for development/web view: use FID 3
          const userData = await fetchUserInfo(3);
          if (userData) setUser(userData);
        }
      } catch (error) {
        console.error("Context or User fetching failed:", error);
        // Fallback to demo user if context fails
        const userData = await fetchUserInfo(3);
        if (userData) setUser(userData);
      }
    };

    init();
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
        <h1 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
          CastAI
        </h1>
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/20 transition-all animate-[fadeIn_0.3s_ease-out]">
              <span className="text-xs font-semibold">{user.username}</span>
              <img src={user.pfp_url} alt="pfp" className="w-6 h-6 rounded-full border border-purple-500 shadow-sm" />
            </div>
          ) : (
            <div className="w-24 h-8 bg-white/5 rounded-full animate-pulse flex items-center justify-center border border-white/10">
              <span className="text-[10px] text-gray-500">Connecting...</span>
            </div>
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
