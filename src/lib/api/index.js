// src/lib/api/index.js

import { getChatGPTResponse } from "./openai";
import { getGeminiResponse } from "./gemini";
import { generateKarenResponse } from "./aiService";

/**
 * 根據用戶類型生成面試官回應
 * @param {Array} messages - 對話歷史
 * @param {String} karenType - Karen類型
 * @param {String} industry - 產業
 * @param {Boolean} isPremium - 是否為付費用戶
 * @param {String} language - 語言 (zh_TW/en)
 * @returns {Promise<Object>} - AI 回應
 */
export const generateResponse = async (
  messages,
  karenType,
  industry,
  isPremium,
  language,
) => {
  try {
    console.log("generateResponse 參數:", {
      messageCount: messages.length,
      karenType,
      industry,
      isPremium,
      language,
    });

    if (isPremium) {
      // 付費版使用 ChatGPT
      console.log("使用 ChatGPT API");
      return await getChatGPTResponse(messages, karenType, industry, language);
    } else {
      // 免費版使用 Gemini API
      console.log("使用 Gemini API");
      try {
        return await getGeminiResponse(messages, karenType, industry, language);
      } catch (geminiError) {
        console.error("Gemini API 調用失敗，使用本地回應:", geminiError);
        return generateKarenResponse(messages, karenType, language);
      }
    }
  } catch (error) {
    console.error("生成回應時出錯:", error);
    // 如果 API 調用失敗，使用本地生成的回應作為備用
    return generateKarenResponse(messages, karenType, language);
  }
};
