
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateBio = async (): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: 'You are an expert Farcaster creator. Generate a short, creative Farcaster bio. Tone: crypto-native, smart, fun. Max length: 160 characters. No hashtags.',
  });
  return response.text || '';
};

export const generateUsernames = async (): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: 'Generate 5 Farcaster username ideas. Style: Web3, crypto, futuristic. Short and memorable. No numbers unless necessary.',
  });
  return response.text || '';
};

export const generateSocialPost = async (): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: 'Generate a high-engagement Farcaster post. Topic: Web3, builders, crypto culture. Max 280 characters. No emojis overload.',
  });
  return response.text || '';
};

export const generateCryptoPost = async (): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: 'Generate a trending crypto Farcaster post. Based on market sentiment, builders, innovation. No financial advice. Short and engaging.',
  });
  return response.text || '';
};
