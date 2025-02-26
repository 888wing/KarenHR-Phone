import { getGeminiResponse } from "../../lib/api/gemini";
import { getChatGPTResponse } from "../../lib/api/chatgpt";

/**
 * API 處理函數，獲取AI面試官的回應
 *
 * @param {Object} req - HTTP 請求對象
 * @param {Object} res - HTTP 響應對象
 */
export default async function handler(req, res) {
  // 只允許POST請求
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages, karenType, industry, isPremium } = req.body;

    // 參數驗證
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Invalid messages data" });
    }

    if (!karenType) {
      return res.status(400).json({ error: "Karen type is required" });
    }

    if (!industry) {
      return res.status(400).json({ error: "Industry is required" });
    }

    let response;

    // 根據用戶類型選擇不同的 AI 服務
    if (isPremium) {
      // 使用 ChatGPT API (付費用戶)
      response = await getChatGPTResponse(messages, karenType, industry);
    } else {
      // 使用 Gemini API (免費用戶)
      response = await getGeminiResponse(messages, karenType, industry);
    }

    // 計算回答質量評分
    const score = calculateResponseScore(messages[messages.length - 1].text);

    return res.status(200).json({
      message: response,
      score: score,
    });
  } catch (error) {
    console.error("Interview API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * 基於回答內容計算得分
 * @param {String} response - 用戶回答
 * @returns {Object} - 得分細節
 */
function calculateResponseScore(response) {
  let score = {
    total: 0,
    details: {
      length: 0,
      specificity: 0,
      relevance: 0,
      structure: 0,
    },
  };

  // 回答長度得分 (簡單的字數計算)
  const wordCount = response.split(/\s+/).length;
  if (wordCount > 100) {
    score.details.length = 25;
  } else if (wordCount > 50) {
    score.details.length = 20;
  } else if (wordCount > 30) {
    score.details.length = 15;
  } else if (wordCount > 10) {
    score.details.length = 10;
  } else {
    score.details.length = 5;
  }

  // 具體性得分 (檢查是否包含數字、百分比或特定詞彙)
  const hasNumbers = /\d+/.test(response);
  const hasSpecificTerms =
    /具體|例如|例子|specifically|for example|instance/i.test(response);

  if (hasNumbers && hasSpecificTerms) {
    score.details.specificity = 25;
  } else if (hasNumbers || hasSpecificTerms) {
    score.details.specificity = 15;
  } else {
    score.details.specificity = 10;
  }

  // 相關性和結構得分 (簡化版)
  score.details.relevance = 20; // 假設相關性已經在AI回應中考慮
  score.details.structure = wordCount > 30 ? 20 : 15; // 簡單地基於長度評估結構

  // 計算總分
  score.total = Object.values(score.details).reduce((sum, val) => sum + val, 0);

  return score;
}
