
import React, { useState, useEffect } from 'react';
import { NeynarUser } from '../types';

interface ProfileTabProps {
  user: NeynarUser | null;
  onDisconnect: () => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ user, onDisconnect }) => {
  const [sharing, setSharing] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="glass rounded-3xl p-8 animate-pulse space-y-4">
          <div className="w-24 h-24 bg-white/10 rounded-full mx-auto" />
          <div className="h-6 w-32 bg-white/10 rounded mx-auto" />
          <div className="h-4 w-48 bg-white/10 rounded mx-auto" />
        </div>
        <div className="text-center">
          <p className="text-gray-500 text-sm">Please connect your wallet to view your profile.</p>
        </div>
      </div>
    );
  }

  // Simulated score
  const neynarScore = (user.follower_count / 100).toFixed(1);

  const handleShare = async () => {
    const profileUrl = `https://warpcast.com/${user.username}`;
    const shareData = {
      title: `${user.display_name} on Farcaster`,
      text: `Check out my Farcaster profile!`,
      url: profileUrl,
    };

    setSharing(true);
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(profileUrl);
        alert("Profile link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    } finally {
      setTimeout(() => setSharing(false), 1000);
    }
  };

  const handleDisconnectClick = () => {
    setIsDisconnecting(true);
    // Add a slight delay for dramatic effect/UX
    setTimeout(() => {
      onDisconnect();
      setIsDisconnecting(false);
    }, 800);
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      {/* Profile Card */}
      <div className="glass rounded-[2rem] p-8 text-center border-white/10 relative overflow-hidden group">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-700" />
        
        <div className="relative inline-block mb-6 group/avatar">
          {/* Subtle Outer Neon Glow Ring */}
          <div className="absolute -inset-2 bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-blue-400 rounded-full blur-[10px] opacity-40 group-hover/avatar:opacity-80 transition-opacity animate-pulse" />
          {/* Sharp Inner Neon Glow Ring */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-70 animate-[spin_4s_linear_infinite]" />
          
          <img 
            src={user.pfp_url} 
            alt={user.username} 
            className="w-28 h-28 rounded-full border-[3px] border-black relative z-10 hover:scale-105 transition-transform cursor-pointer shadow-[0_0_25px_rgba(168,85,247,0.4)] group-hover/avatar:shadow-[0_0_35px_rgba(168,85,247,0.7)]"
          />
        </div>

        <h2 className="text-3xl font-black mb-1">{user.display_name}</h2>
        <p className="text-purple-400 font-bold text-lg mb-6">@{user.username}</p>

        <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
          {user.profile.bio.text || "No bio yet. Generate one in the AI Studio!"}
        </p>

        <div className="grid grid-cols-3 gap-2 mb-8">
          <StatBox label="Followers" value={user.follower_count} color="purple" />
          <StatBox label="Following" value={user.following_count} color="blue" />
          <StatBox label="FID" value={user.fid} color="gray" />
        </div>

        <button 
          onClick={handleShare}
          className="w-full py-3 px-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-white/10 transition-all flex items-center justify-center gap-2 font-bold group"
        >
          <svg className={`transition-transform ${sharing ? 'scale-125' : 'group-hover:scale-110'}`} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
          {sharing ? 'Link Ready!' : 'Share Profile'}
        </button>
      </div>

      {/* Neynar Score Card */}
      <div className="glass rounded-3xl p-6 border-blue-500/20 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Neynar Score</h3>
          <p className="text-4xl font-black text-white">{neynarScore}</p>
        </div>
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
          <svg className="text-blue-400" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button className="w-full glass py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all border-white/5">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h7"/><path d="M16 19h6"/><path d="M19 16v6"/><path d="M15 5v5"/><path d="M9 5v5"/><path d="M3 10h18"/><path d="M18 5v10"/></svg>
          Manage Session
        </button>
        <button 
          onClick={handleDisconnectClick}
          disabled={isDisconnecting}
          className={`w-full py-4 rounded-2xl font-bold transition-all border flex items-center justify-center gap-2 ${isDisconnecting ? 'bg-red-500/20 text-red-400 border-red-500/50 cursor-wait' : 'text-red-400 hover:bg-red-500/10 border-red-500/20'}`}
        >
          {isDisconnecting ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full" />
              Disconnecting...
            </>
          ) : (
            'Disconnect Wallet'
          )}
        </button>
      </div>
    </div>
  );
};

const StatBox: React.FC<{ label: string, value: number, color: 'purple' | 'blue' | 'gray' }> = ({ label, value, color }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1500; // 1.5 seconds for a premium feel
    const startValue = 0;
    const endValue = value;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function: easeOutExpo for a snappier finish
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setDisplayValue(Math.floor(easeOutExpo * (endValue - startValue) + startValue));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    const animationFrame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [value]);

  const colorMap = {
    purple: 'text-purple-400',
    blue: 'text-blue-400',
    gray: 'text-gray-400'
  };

  return (
    <div className="bg-white/5 rounded-2xl py-4 border border-white/5 transition-transform hover:scale-105">
      <p className={`text-xl font-black ${colorMap[color]}`}>
        {displayValue.toLocaleString()}
      </p>
      <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">{label}</p>
    </div>
  );
};

export default ProfileTab;
