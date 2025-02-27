// pages/api/chat.js
import { Configuration, OpenAIApi } from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * 面試對話 API 端點
 * 處理前端發送的面試對話請求，並返回 AI 回應
 *
 * @param {Object} req - HTTP 請求對象
 * @param {Object} res - HTTP 響應對象
 */
export default async function handler(req, res) {
  // 僅接受 POST 請求
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // 從請求體中提取參數
    const { messages, karenType, industry, isPremium, language } = req.body;

    // 驗證必要參數
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "對話歷史必須為數組" });
    }

    if (!karenType) {
      return res.status(400).json({ error: "必須指定 Karen 類型" });
    }

    if (!industry) {
      return res.status(400).json({ error: "必須指定行業類型" });
    }

    console.log("API調用參數:", {
      messagesCount: messages.length,
      karenType,
      industry,
      isPremium: !!isPremium,
      language: language || "zh_TW",
    });

    if (isPremium) {
      // 使用 OpenAI API
      const configuration = new Configuration({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);

      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        })),
        temperature: 0.7,
      });

      return res.status(200).json({
        text: completion.data.choices[0].message.content,
        timestamp: new Date().toISOString()
      });

    } else {
      // 使用 Gemini API
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro"});

      const result = await model.generateContent(messages[messages.length - 1].text);
      const response = await result.response;
      
      return res.status(200).json({
        text: response.text(),
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('Error in chat API:', error);
    return res.status(500).json({
      message: language === 'en' 
        ? 'Unable to connect to AI service. Please check your network connection or try again later.'
        : '無法連接到AI服務，請檢查網絡連接或稍後再試'
    });
  }
}
