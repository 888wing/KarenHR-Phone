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
    const apiKey = isPremium 
      ? process.env.NEXT_PUBLIC_OPENAI_API_KEY 
      : process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error('API key not found');
    }

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        messages,
        karenType,
        industry,
        isPremium,
        language
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'API request failed');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error in generateResponse:', error);
    throw new Error(
      language === 'en' 
        ? 'Unable to connect to AI service. Please check your network connection or try again later.'
        : '無法連接到AI服務，請檢查網絡連接或稍後再試'
    );
  }
};
