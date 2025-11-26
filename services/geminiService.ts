import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { NewsCategory, GroundingSource } from "../types";

// Initialize Gemini Client
// The API key must be obtained exclusively from the environment variable process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Fetches latest news for a specific category using Gemini 2.5 Flash and Google Search Grounding.
 */
export const fetchSpaceNews = async (category: NewsCategory): Promise<{ text: string; sources: GroundingSource[] }> => {
  const model = "gemini-2.5-flash";
  
  // Construct a prompt that asks for a news summary
  let topicQuery = "";
  switch (category) {
    case NewsCategory.ROCKETS:
      topicQuery = "SpaceX Starship, H3 Rocket, Falcon 9, 最新のロケット打ち上げスケジュールと結果";
      break;
    case NewsCategory.ASTRONOMY:
      topicQuery = "ジェイムズ・ウェッブ宇宙望遠鏡, ブラックホール, ダークマター, 最新の天文学的発見";
      break;
    case NewsCategory.ISS:
      topicQuery = "国際宇宙ステーション, 日本人宇宙飛行士, アルテミス計画, 有人宇宙開発";
      break;
    case NewsCategory.MARS:
      topicQuery = "火星探査車 パーサヴィアランス, マーズ・サンプル・リターン, 火星移住計画";
      break;
    default:
      topicQuery = "宇宙ビジネス, 民間宇宙開発, スペースデブリ問題, 天文ショー";
  }

  const prompt = `
    Mission: Provide a futuristic intelligence report on the following space topic for the "U-Space" network users (Japanese audience).
    Topic: ${topicQuery}
    
    Role: You are "COMET", the onboard AI of the U-Space orbital station.
    
    Directives:
    1. Search for the **latest real-world news** (last 24-48 hours preferred).
    2. Select the top 3 most impactful stories.
    3. Output Format:
       - **Headline**: Catchy, crisp Japanese headline (e.g., "【Starship】軌道投入試験、成功へ").
       - **Body**: Concise summary of the event (2-3 sentences). Focus on facts and future implications.
    4. Tone: Professional, slightly sci-fi/futuristic, but highly readable (Polite Japanese / Desu-Masu).
    5. Ending: Add a brief "AI Analysis" or "Stardate Log" comment at the end.
    
    Output structured as a clean Markdown article.
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

    const text = response.text || "通信妨害を検知。ニュースを取得できませんでした。";
    const sources = extractSources(response);

    return { text, sources };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("衛星リンクダウン。再接続を試みてください。");
  }
};

/**
 * Handles chat interactions for specific space questions using Search Grounding.
 */
export const sendChatMessage = async (message: string): Promise<{ text: string; sources: GroundingSource[] }> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "あなたはU-SpaceステーションのAIアシスタント「COMET」です。ユーザー（クルー）の質問に対し、Google検索で最新情報を確認しながら回答してください。口調は知的で冷静、少し未来的な表現（「了解」「データ照合中」など）を交えつつ、親切な日本語で話してください。",
      },
    });

    return {
      text: response.text || "データ解析不能。申し訳ありません。",
      sources: extractSources(response),
    };
  } catch (error) {
    console.error("Chat Error:", error);
    return { text: "システムエラー発生。", sources: [] };
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
          title: chunk.web.title || "Unknown Signal",
          uri: chunk.web.uri,
        });
      }
    });
  }
  
  // Remove duplicates based on URI
  return sources.filter((v, i, a) => a.findIndex(t => (t.uri === v.uri)) === i);
};