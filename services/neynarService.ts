
import { NeynarUser } from '../types';

// Using the provided API keys from the environment or hardcoded fallback
const NEYNAR_API_KEY = "D73CFC36-6DD6-489C-8416-725B517CA79C";

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
 * Publishes a cast to Farcaster.
 * Note: Requires a valid signer_uuid in a production environment.
 */
export const publishCast = async (text: string): Promise<boolean> => {
  console.log("[Neynar] Request to publish cast:", text);
  // Simulation for the mini-app environment
  await new Promise(r => setTimeout(r, 1000));
  return true;
};
