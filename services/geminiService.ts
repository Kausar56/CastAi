
import { GoogleGenAI } from "@google/genai";

// Initialize AI helper to safely access the injected API key
// Always use process.env.API_KEY as the apiKey value.
const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY as string });
};

// Fix for generateBio: Completing the truncated function
/**
 * Generates a short and engaging Farcaster profile bio.
 */
export const generateBio = async (): Promise<string> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: 'You are an expert Farcaster creator. Generate a short, witty, and engaging bio for a Farcaster profile. It should be professional yet social, under 160 characters.',
  });
  return response.text || '';
};

// Fix for HomeTab.tsx: Adding missing generateUsernames function
/**
 * Suggests creative and unique usernames for a Farcaster user.
 */
export const generateUsernames = async (): Promise<string> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: 'Suggest 5 creative and unique usernames for a Farcaster user based on decentralized tech and social themes.',
  });
  return response.text || '';
};

// Fix for HomeTab.tsx: Adding missing generateSocialPost function
/**
 * Generates a short, punchy social media post (cast) for Farcaster.
 */
export const generateSocialPost = async (): Promise<string> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: 'Write a short, punchy cast for Farcaster about the future of decentralized social media.',
  });
  return response.text || '';
};

// Fix for HomeTab.tsx: Adding missing generateCryptoPost function
/**
 * Generates a trending-style crypto post suitable for Farcaster.
 */
export const generateCryptoPost = async (): Promise<string> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: 'Write a trending-style crypto post about current market sentiment or an interesting DeFi concept.',
  });
  return response.text || '';
};
