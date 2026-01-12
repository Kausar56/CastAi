
import React, { useState, useEffect } from 'react';
import { Tab } from './types';
import Navigation from './components/Navigation';
import HomeTab from './components/HomeTab';
import AirdropTab from './components/AirdropTab';
import ProfileTab from './components/ProfileTab';
import { fetchUserInfo } from './services/neynarService';
import { NeynarUser } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.HOME);
  const [user, setUser] = useState<NeynarUser | null>(null);

  useEffect(() => {
    // Initial fetch - assuming FID 3 for demo or fetching from frame context if available
    fetchUserInfo(3).then(userData => {
      if (userData) setUser(userData);
    });
  }, []);

  const handleDisconnect = () => {
    // Simulate session termination
    setUser(null);
    // Optionally redirect to Home tab
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
            <button 
              onClick={() => fetchUserInfo(3).then(setUser)}
              className="px-4 py-1.5 rounded-full bg-purple-600 text-xs font-bold hover:bg-purple-500 transition-colors"
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
