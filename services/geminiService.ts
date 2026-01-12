
import { GoogleGenAI } from "@google/genai";

/**
 * Safely initializes the AI client using the injected API key.
 */
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API Key is missing. Check your environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Generates a short, creative Farcaster bio.
 * Rules: Crypto-native, smart, fun. Max 160 chars. NO HASHTAGS.
 */
export const generateBio = async (): Promise<string> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: 'You are an expert Farcaster creator. Generate a short, creative Farcaster bio. Tone: crypto-native, smart, fun. Max length: 160 characters. No hashtags. Do not use generic phrases. Be bold and web3-centric.',
  });
  return response.text?.trim() || '';
};

/**
 * Suggests 5 creative and unique usernames.
 * Style: Web3, crypto, futuristic. Short and memorable. No numbers unless necessary.
 */
export const generateUsernames = async (): Promise<string> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: 'Generate 5 Farcaster username ideas. Style: Web3, crypto, futuristic. Short and memorable. No numbers unless necessary. List them clearly.',
  });
  return response.text?.trim() || '';
};

/**
 * Generates a high-engagement Farcaster social post.
 * Topic: Web3, builders, crypto culture. Max 280 characters. No emoji overload.
 */
export const generateSocialPost = async (): Promise<string> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: 'Generate a high-engagement Farcaster post. Topic: Web3, builders, crypto culture. Max 280 characters. No emojis overload. Focus on community and building.',
  });
  return response.text?.trim() || '';
};

/**
 * Generates a trending crypto post.
 * Based on market sentiment, builders, innovation. No financial advice. Short and engaging.
 */
export const generateCryptoPost = async (): Promise<string> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: 'Generate a trending crypto Farcaster post. Based on market sentiment, builders, innovation. No financial advice. Short and engaging. Use technical but accessible language.',
  });
  return response.text?.trim() || '';
};
