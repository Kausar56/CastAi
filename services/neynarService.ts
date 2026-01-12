
import { NeynarUser } from '../types';
import { sdk } from '@farcaster/frame-sdk';

// Using keys from injected process.env or provided fallback
const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY || "D73CFC36-6DD6-489C-8416-725B517CA79C";

/**
 * Fetches the latest user information from Neynar.
 * Uses the bulk endpoint for efficiency but returns a single user.
 */
export const fetchUserInfo = async (fid: number = 3): Promise<NeynarUser | null> => {
  try {
    const response = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'api_key': NEYNAR_API_KEY,
      }
    });
    
    if (!response.ok) {
      throw new Error(`Neynar API error: ${response.status}`);
    }

    const data = await response.json();
    const user = data.users?.[0] || null;
    
    if (user) {
      console.log(`[Neynar] Successfully fetched data for FID ${fid}:`, {
        username: user.username,
        score: user.neynar_user_score ?? user.score ?? user.neynar_score
      });
    }
    
    return user;
  } catch (err) {
    console.error("[Neynar] Failed to fetch user information:", err);
    return null;
  }
};

/**
 * Opens the native Farcaster composer via the SDK.
 * This is the correct way to "post" from a Frame v2 Mini App.
 */
export const publishCast = async (text: string): Promise<boolean> => {
  try {
    const composerUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`;
    // Using sdk.actions.openUrl which is supported in most Farcaster clients for Mini Apps
    await sdk.actions.openUrl(composerUrl);
    console.log("[CastAI] Triggered composer with text:", text);
    return true;
  } catch (err) {
    console.error("[CastAI] Failed to trigger composer:", err);
    return false;
  }
};
