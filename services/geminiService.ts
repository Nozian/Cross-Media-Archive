
import { GoogleGenAI, type GenerateContentResponse, Type } from "@google/genai";
import { type SummarizedContent } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const summarySchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A concise, compelling title for the content of the URL."
    },
    summary: {
      type: Type.STRING,
      description: "A single-paragraph summary of the URL's content."
    }
  },
  required: ["title", "summary"]
};


export const summarizeUrlContent = async (url: string): Promise<SummarizedContent | null> => {
  try {
    const prompt = `Analyze the content of the following URL and provide a concise title and a one-paragraph summary. URL: ${url}`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: summarySchema,
        temperature: 0.2
      }
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);
    
    if (parsedJson && typeof parsedJson.title === 'string' && typeof parsedJson.summary === 'string') {
        return parsedJson as SummarizedContent;
    }
    
    console.warn("Gemini response was not in the expected format:", jsonText);
    return null;

  } catch (error) {
    console.error('Error summarizing URL content with Gemini:', error);
    // Fallback or error handling
    return {
        title: "Content Summary Unavailable",
        summary: `Could not fetch a summary for this URL. You can visit it directly here: ${url}`
    };
  }
};
