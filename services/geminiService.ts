
import { GoogleGenAI } from "@google/genai";

/**
 * Safely initializes the AI client using the injected API key.
 * Checks both common environment variable locations.
 */
const getAIClient = () => {
  const apiKey = (window as any).process?.env?.API_KEY || process.env.API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API Key is missing. Check your configuration.");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Generates a short, creative Farcaster bio.
 */
export const generateBio = async (): Promise<string> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: 'You are an expert Farcaster creator. Generate a short, creative Farcaster bio. Tone: crypto-native, smart, fun. Max length: 160 characters. No hashtags. Return ONLY the bio text, no quotes or markdown.',
  });
  return response.text?.replace(/['"]/g, '').trim() || '';
};

/**
 * Suggests 5 creative and unique usernames.
 */
export const generateUsernames = async (): Promise<string> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: 'Generate 5 unique Farcaster username ideas. Style: Web3, crypto, futuristic. Short and memorable. No numbers. Return ONLY the list, one per line.',
  });
  return response.text?.trim() || '';
};

/**
 * Generates a high-engagement Farcaster social post.
 */
export const generateSocialPost = async (): Promise<string> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: 'Generate a high-engagement Farcaster post. Topic: Web3 development, builder culture, or decentralized social. Max 280 characters. Engaging and smart. Return ONLY the post content.',
  });
  return response.text?.replace(/['"]/g, '').trim() || '';
};

/**
 * Generates a trending crypto post.
 */
export const generateCryptoPost = async (): Promise<string> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: 'Generate a trending crypto Farcaster post. Focus on innovation, alpha, or ecosystem growth. No financial advice. High energy. Max 280 characters. Return ONLY the post content.',
  });
  return response.text?.replace(/['"]/g, '').trim() || '';
};
