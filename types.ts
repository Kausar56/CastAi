
export enum Tab {
  HOME = 'home',
  AIRDROP = 'airdrop',
  PROFILE = 'profile'
}

export interface NeynarUser {
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
  follower_count: number;
  following_count: number;
  neynar_user_score?: number;
  profile: {
    bio: {
      text: string;
    };
  };
}

export interface GenerationResult {
  type: 'bio' | 'username' | 'post' | 'crypto';
  content: string;
}

export interface AIResponse {
  text: string;
}
