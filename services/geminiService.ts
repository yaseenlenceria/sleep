import { GoogleGenAI } from "@google/genai";
import { AmPm } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getSleepAdvice = async (
  wakeTime: string, 
  bedTime: string, 
  mode: 'wake' | 'sleep'
): Promise<string> => {
  if (!apiKey) {
    return "Please configure your API Key to receive personalized sleep advice.";
  }

  try {
    const prompt = mode === 'wake' 
      ? `I want to wake up at ${wakeTime}. I calculated that I should go to sleep around ${bedTime}. Give me one specific, science-backed short tip (max 2 sentences) to help me fall asleep by that time.`
      : `I am going to sleep now (${bedTime}) and plan to wake up at ${wakeTime}. Give me one short, encouraging tip (max 2 sentences) for waking up refreshed.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a sleep hygiene expert. You are concise, helpful, and soothing.",
        maxOutputTokens: 100,
      }
    });

    return response.text || "Sleep well and stay consistent with your schedule.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Remember, consistency is key to a good night's sleep.";
  }
};