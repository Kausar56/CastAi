
import { NeynarUser } from '../types';

const NEYNAR_API_KEY = "D73CFC36-6DD6-489C-8416-725B517CA79C"; // Injected from prompt
const NEYNAR_CLIENT_ID = "0390b440-7def-4ea4-9a56-4da03bc34e1c"; // Injected from prompt

export const fetchUserInfo = async (fid: number = 3): Promise<NeynarUser | null> => {
  try {
    const response = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
      headers: {
        'api_key': NEYNAR_API_KEY,
      }
    });
    const data = await response.json();
    return data.users?.[0] || null;
  } catch (err) {
    console.error("Failed to fetch user:", err);
    return null;
  }
};

export const publishCast = async (text: string): Promise<boolean> => {
  // In a real environment, you'd need a signer_uuid from a logged-in user session.
  // For this mini-app demo, we simulate the post success.
  console.log("Publishing to Farcaster via Neynar:", text);
  await new Promise(r => setTimeout(r, 1500));
  return true;
};
