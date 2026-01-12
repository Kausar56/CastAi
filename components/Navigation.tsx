
import React from 'react';
import { Tab } from '../types';

interface NavigationProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-white/10 px-6 py-4 flex justify-between items-center z-50">
      <button
        onClick={() => setActiveTab(Tab.HOME)}
        className={`flex flex-col items-center gap-1 transition-all ${activeTab === Tab.HOME ? 'text-purple-400 scale-110' : 'text-gray-500 hover:text-gray-300'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <span className="text-[10px] font-bold">Home</span>
      </button>

      <button
        onClick={() => setActiveTab(Tab.AIRDROP)}
        className={`flex flex-col items-center gap-1 transition-all ${activeTab === Tab.AIRDROP ? 'text-purple-400 scale-110' : 'text-gray-500 hover:text-gray-300'}`}
      >
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="7.5 4.21 12 6.81 16.5 4.21"/><polyline points="7.5 19.79 7.5 14.6 3 12"/><polyline points="21 12 16.5 14.6 16.5 19.79"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full animate-ping" />
        </div>
        <span className="text-[10px] font-bold">Airdrop</span>
      </button>

      <button
        onClick={() => setActiveTab(Tab.PROFILE)}
        className={`flex flex-col items-center gap-1 transition-all ${activeTab === Tab.PROFILE ? 'text-purple-400 scale-110' : 'text-gray-500 hover:text-gray-300'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span className="text-[10px] font-bold">Profile</span>
      </button>
    </nav>
  );
};

export default Navigation;
