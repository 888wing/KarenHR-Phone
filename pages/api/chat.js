// pages/api/chat.js
import { generateResponse } from "../../src/lib/api";

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
    return res.status(405).json({ error: "方法不允許" });
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

    // 調用 AI 回應生成函數
    const response = await generateResponse(
      messages,
      karenType,
      industry,
      !!isPremium,
      language || "zh_TW",
    );

    // 返回結果
    return res.status(200).json(response);
  } catch (error) {
    console.error("面試對話API錯誤:", error);
    return res.status(500).json({
      error: "處理請求時發生錯誤",
      message: error.message || "未知錯誤",
    });
  }
}
