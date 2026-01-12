
import React, { useState, useEffect } from 'react';
import { NeynarUser } from '../types';

interface ProfileTabProps {
  user: NeynarUser | null;
  onDisconnect: () => void;
  refreshUser: () => Promise<void>;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ user, onDisconnect }) => {
  const [displayStats, setDisplayStats] = useState({ followers: 0, following: 0, score: 0 });

  useEffect(() => {
    if (user) {
      const targetFollowers = user.follower_count || 0;
      const targetFollowing = user.following_count || 0;
      const targetScore = user.neynar_user_score ?? user.score ?? 0;
      
      const duration = 1000;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        setDisplayStats({
          followers: Math.floor(progress * targetFollowers),
          following: Math.floor(progress * targetFollowing),
          score: Number((progress * targetScore).toFixed(2))
        });

        if (progress < 1) requestAnimationFrame(animate);
      };
      
      requestAnimationFrame(animate);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] p-8">
        <div className="glass p-8 rounded-3xl text-center space-y-4 max-w-xs border-white/5">
          <p className="text-gray-400 text-sm">Please connect to view your profile analytics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-6 animate-[fadeIn_0.5s_ease-out]">
      <div className="glass rounded-[2.5rem] p-8 text-center border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[50px]" />
        
        <div className="relative inline-block mb-6 group">
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
          <img 
            src={user.pfp_url} 
            alt="avatar" 
            className="w-28 h-28 rounded-full border-4 border-black relative z-10 transition-transform group-hover:scale-110 shadow-2xl"
          />
        </div>

        <h2 className="text-3xl font-black mb-1 tracking-tight">{user.display_name}</h2>
        <p className="text-purple-400 font-bold mb-4 italic">@{user.username}</p>

        <p className="text-gray-400 text-sm leading-relaxed mb-8 px-4">
          {user.profile.bio.text || "Farcaster creator exploring the decentralized frontier."}
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-2xl py-4 border border-white/5">
            <p className="text-2xl font-black text-white">{displayStats.followers.toLocaleString()}</p>
            <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Followers</p>
          </div>
          <div className="bg-white/5 rounded-2xl py-4 border border-white/5">
            <p className="text-2xl font-black text-white">{displayStats.following.toLocaleString()}</p>
            <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Following</p>
          </div>
        </div>
      </div>

      <div className="glass rounded-[2rem] p-6 border-blue-500/20 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-1">Neynar Score</span>
          <span className="text-4xl font-black text-blue-400">{displayStats.score}</span>
        </div>
        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        </div>
      </div>

      <button 
        onClick={onDisconnect}
        className="w-full py-4 text-red-400 font-bold bg-red-500/5 hover:bg-red-500/10 rounded-2xl border border-red-500/20 transition-all text-xs uppercase tracking-widest"
      >
        Disconnect Wallet
      </button>
    </div>
  );
};

export default ProfileTab;
