import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { NewsCategory, GroundingSource } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize Gemini Client
// Note: In a real production app, we would handle missing keys more gracefully or via a proxy.
const ai = new GoogleGenAI({ apiKey });

/**
 * Fetches latest news for a specific category using Gemini 2.5 Flash and Google Search Grounding.
 */
export const fetchSpaceNews = async (category: NewsCategory): Promise<{ text: string; sources: GroundingSource[] }> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const model = "gemini-2.5-flash";
  
  // Construct a prompt that asks for a news summary
  let topicQuery = "";
  switch (category) {
    case NewsCategory.ROCKETS:
      topicQuery = "SpaceX, NASA, ロケット打ち上げ";
      break;
    case NewsCategory.ASTRONOMY:
      topicQuery = "最新の天文学的発見, ブラックホール, 銀河";
      break;
    case NewsCategory.ISS:
      topicQuery = "国際宇宙ステーション, 宇宙飛行士";
      break;
    case NewsCategory.MARS:
      topicQuery = "火星探査, マーズローバー, テラフォーミング";
      break;
    default:
      topicQuery = "宇宙開発, 宇宙ビジネス, 天文ニュース";
  }

  const prompt = `
    あなたは「U-Space」という未来的なニュースアプリの専属AIジャーナリストです。
    以下のトピックに関する**最新かつ最も重要**なニュースを検索し、日本語で要約記事を作成してください。
    
    トピック: ${topicQuery}
    
    要件:
    1. 読者がワクワクするような、少し未来的で洗練された文体にしてください。
    2. 3つの主要なニュースピックアップし、それぞれに見出しをつけてください。
    3. 各ニュースの要点は簡潔にまとめてください。
    4. 最後に「編集後記」として、あなたの短い感想を一言添えてください。
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.7,
      },
    });

    const text = response.text || "ニュースを取得できませんでした。";
    const sources = extractSources(response);

    return { text, sources };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("ニュースの取得に失敗しました。しばらく経ってから再度お試しください。");
  }
};

/**
 * Handles chat interactions for specific space questions using Search Grounding.
 */
export const sendChatMessage = async (message: string): Promise<{ text: string; sources: GroundingSource[] }> => {
  if (!apiKey) return { text: "API Key not configured.", sources: [] };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "あなたはU-SpaceのナビゲーターAIです。宇宙に関する質問に対して、最新情報を検索しながら、知的かつフレンドリーに答えてください。専門用語はわかりやすく解説してください。",
      },
    });

    return {
      text: response.text || "申し訳ありません。回答を生成できませんでした。",
      sources: extractSources(response),
    };
  } catch (error) {
    console.error("Chat Error:", error);
    return { text: "エラーが発生しました。", sources: [] };
  }
};

/**
 * Helper to extract grounding sources from the response.
 */
const extractSources = (response: GenerateContentResponse): GroundingSource[] => {
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  const sources: GroundingSource[] = [];

  if (chunks) {
    chunks.forEach((chunk) => {
      if (chunk.web) {
        sources.push({
          title: chunk.web.title || "Web Source",
          uri: chunk.web.uri,
        });
      }
    });
  }
  
  // Remove duplicates based on URI
  return sources.filter((v, i, a) => a.findIndex(t => (t.uri === v.uri)) === i);
};
