// src/lib/analysis/keywordAnalysis.js
import {
  getHighFrequencyKeywords,
  getRatedKeywords,
} from "../data/industryKeywords";

/**
 * 分析文本中的關鍵詞使用情況
 * @param {String} text - 要分析的文本
 * @param {Array} keywords - 關鍵詞列表
 * @param {String} industry - 行業類型 (可選)
 * @returns {Object} - 關鍵詞分析結果
 */
export function analyzeKeywords(text, keywords, industry = "") {
  // 如果沒有提供關鍵詞，則使用高頻關鍵詞
  const keywordList =
    keywords && keywords.length > 0 ? keywords : getHighFrequencyKeywords();

  // 將文本轉為小寫以進行不區分大小寫的比較
  const lowerText = text.toLowerCase();

  // 找出所有匹配的關鍵詞
  const matchedKeywords = [];
  const keywordInstances = [];

  keywordList.forEach((keyword) => {
    const lowerKeyword = keyword.toLowerCase();
    // 使用正則表達式匹配完整單詞
    const regex = new RegExp(`\\b${escapeRegExp(lowerKeyword)}\\b`, "gi");
    const matches = lowerText.match(regex);

    if (matches && matches.length > 0) {
      matchedKeywords.push(keyword);

      // 記錄每個關鍵詞的出現次數和位置
      const positions = [];
      let position;
      const reExec = new RegExp(`\\b${escapeRegExp(lowerKeyword)}\\b`, "gi");

      while ((position = reExec.exec(lowerText)) !== null) {
        positions.push(position.index);
      }

      keywordInstances.push({
        keyword,
        count: matches.length,
        positions,
        rating: getKeywordRating(keyword, industry),
      });
    }
  });

  // 計算關鍵詞密度 (關鍵詞數量 / 總詞數)
  const wordCount = text.split(/\s+/).length;
  const keywordDensity = matchedKeywords.length / Math.max(1, wordCount);

  // 計算高價值關鍵詞的比例
  const ratedKeywords = industry ? getRatedKeywords(industry) : null;
  let highValueCount = 0;

  if (ratedKeywords) {
    keywordInstances.forEach((instance) => {
      const lcKw = instance.keyword.toLowerCase();
      if (
        ratedKeywords.critical.some((k) => k.toLowerCase() === lcKw) ||
        ratedKeywords.important.some((k) => k.toLowerCase() === lcKw)
      ) {
        highValueCount += instance.count;
      }
    });
  }

  const highValueRatio =
    keywordInstances.length > 0
      ? highValueCount /
        keywordInstances.reduce((sum, instance) => sum + instance.count, 0)
      : 0;

  // 分析關鍵詞的分佈和上下文
  const contextSamples = getKeywordContextSamples(text, keywordInstances);

  // 生成關鍵詞使用建議
  const suggestions = generateKeywordSuggestions(
    matchedKeywords,
    keywordList,
    keywordDensity,
    highValueRatio,
    industry,
  );

  return {
    matchedKeywords,
    keywordInstances,
    keywordDensity,
    highValueRatio,
    contextSamples,
    suggestions,
    analysisScore: calculateKeywordScore(
      keywordDensity,
      highValueRatio,
      keywordInstances,
    ),
    missingImportantKeywords: industry
      ? getMissingImportantKeywords(matchedKeywords, industry)
      : [],
  };
}

/**
 * 獲取關鍵詞評級
 * @param {String} keyword - 關鍵詞
 * @param {String} industry - 行業
 * @returns {String} - 評級 (critical, important, relevant, or standard)
 */
function getKeywordRating(keyword, industry) {
  if (!industry) return "standard";

  const ratedKeywords = getRatedKeywords(industry);
  const lcKw = keyword.toLowerCase();

  if (ratedKeywords.critical.some((k) => k.toLowerCase() === lcKw)) {
    return "critical";
  } else if (ratedKeywords.important.some((k) => k.toLowerCase() === lcKw)) {
    return "important";
  } else if (ratedKeywords.relevant.some((k) => k.toLowerCase() === lcKw)) {
    return "relevant";
  } else {
    return "standard";
  }
}

/**
 * 獲取缺失的重要關鍵詞
 * @param {Array} matchedKeywords - 已匹配的關鍵詞
 * @param {String} industry - 行業
 * @returns {Array} - 缺失的重要關鍵詞列表
 */
function getMissingImportantKeywords(matchedKeywords, industry) {
  const ratedKeywords = getRatedKeywords(industry);
  const missingCritical = [];
  const missingImportant = [];

  // 將匹配的關鍵詞轉為小寫以進行比較
  const lcMatchedKeywords = matchedKeywords.map((kw) => kw.toLowerCase());

  // 檢查缺失的關鍵關鍵詞
  ratedKeywords.critical.forEach((keyword) => {
    if (!lcMatchedKeywords.includes(keyword.toLowerCase())) {
      missingCritical.push({ keyword, rating: "critical" });
    }
  });

  // 檢查缺失的重要關鍵詞
  ratedKeywords.important.forEach((keyword) => {
    if (!lcMatchedKeywords.includes(keyword.toLowerCase())) {
      missingImportant.push({ keyword, rating: "important" });
    }
  });

  // 返回最多5個缺失的關鍵詞，優先返回關鍵級別的
  return [...missingCritical, ...missingImportant].slice(0, 5);
}

/**
 * 獲取關鍵詞上下文樣本
 * @param {String} text - 文本
 * @param {Array} keywordInstances - 關鍵詞實例
 * @returns {Array} - 上下文樣本
 */
function getKeywordContextSamples(text, keywordInstances) {
  const samples = [];

  keywordInstances.forEach((instance) => {
    // 只取第一個位置作為樣本
    if (instance.positions.length > 0) {
      const position = instance.positions[0];
      const start = Math.max(0, position - 50);
      const end = Math.min(
        text.length,
        position + instance.keyword.length + 50,
      );

      // 提取上下文
      let context = text.substring(start, end);

      // 添加省略號表示截斷
      if (start > 0) context = "..." + context;
      if (end < text.length) context = context + "...";

      // 標記關鍵詞
      const keywordRegex = new RegExp(
        `\\b${escapeRegExp(instance.keyword)}\\b`,
        "gi",
      );
      const highlightedContext = context.replace(
        keywordRegex,
        (match) => `[${match}]`,
      );

      samples.push({
        keyword: instance.keyword,
        context: highlightedContext,
        rating: instance.rating,
      });
    }
  });

  // 按關鍵詞重要性排序，最多返回3個樣本
  return samples
    .sort((a, b) => {
      const ratingOrder = {
        critical: 0,
        important: 1,
        relevant: 2,
        standard: 3,
      };
      return ratingOrder[a.rating] - ratingOrder[b.rating];
    })
    .slice(0, 3);
}

/**
 * 生成關鍵詞使用建議
 * @param {Array} matchedKeywords - 已匹配的關鍵詞
 * @param {Array} allKeywords - 所有可能的關鍵詞
 * @param {Number} keywordDensity - 關鍵詞密度
 * @param {Number} highValueRatio - 高價值關鍵詞比例
 * @param {String} industry - 行業
 * @returns {Array} - 建議列表
 */
function generateKeywordSuggestions(
  matchedKeywords,
  allKeywords,
  keywordDensity,
  highValueRatio,
  industry,
) {
  const suggestions = [];

  // 檢查關鍵詞數量
  if (matchedKeywords.length === 0) {
    suggestions.push({
      type: "missing_keywords",
      suggestion:
        "你的回答中沒有包含任何行業關鍵詞。面試官可能會認為你缺乏相關專業知識。",
      improvement:
        "嘗試適當地使用行業術語和關鍵詞，展示你的專業背景和知識深度。",
    });
  } else if (matchedKeywords.length < 3 && allKeywords.length > 10) {
    suggestions.push({
      type: "few_keywords",
      suggestion:
        "你的回答中使用的行業關鍵詞較少。適當增加相關專業術語可以提升回答的專業性。",
      improvement:
        "在描述你的經驗和技能時，有意識地使用更多相關的行業專業術語。",
    });
  }

  // 檢查關鍵詞密度
  if (keywordDensity > 0.2) {
    suggestions.push({
      type: "high_density",
      suggestion: "你的回答中關鍵詞密度過高，可能會給人堆砌關鍵詞的印象。",
      improvement:
        "保持專業術語的使用，但確保它們是在自然語境中出現，而不是刻意堆疊。",
    });
  }

  // 檢查高價值關鍵詞
  if (industry && highValueRatio < 0.3 && matchedKeywords.length > 0) {
    suggestions.push({
      type: "low_value_keywords",
      suggestion:
        "你使用的關鍵詞中，高價值詞彙比例較低。在此行業中，某些關鍵概念更受重視。",
      improvement: "優先使用與你的領域核心相關的專業詞彙，而不僅僅是常見術語。",
    });
  }

  // 添加缺失的重要關鍵詞建議
  if (industry) {
    const missingKeywords = getMissingImportantKeywords(
      matchedKeywords,
      industry,
    );

    if (missingKeywords.length > 0) {
      const keywordsList = missingKeywords
        .map((item) => item.keyword)
        .join("、");

      suggestions.push({
        type: "missing_important_keywords",
        suggestion: `你的回答中缺少一些重要的行業關鍵詞，如：${keywordsList}。`,
        improvement:
          "考慮在適當的情況下使用這些關鍵詞，展示你對行業核心概念的理解。",
      });
    }
  }

  return suggestions;
}

/**
 * 計算關鍵詞使用評分
 * @param {Number} density - 關鍵詞密度
 * @param {Number} highValueRatio - 高價值關鍵詞比例
 * @param {Array} instances - 關鍵詞實例
 * @returns {Number} - 關鍵詞使用評分 (0-100)
 */
function calculateKeywordScore(density, highValueRatio, instances) {
  // 基礎分數
  let score = 60;

  // 根據關鍵詞數量調整
  const keywordCount = instances.length;
  if (keywordCount === 0) {
    score -= 30;
  } else if (keywordCount < 3) {
    score -= 15;
  } else if (keywordCount >= 3 && keywordCount < 6) {
    score += 10;
  } else if (keywordCount >= 6 && keywordCount < 10) {
    score += 15;
  } else {
    score += 20;
  }

  // 根據關鍵詞密度調整
  if (density > 0.25) {
    score -= 20; // 密度過高
  } else if (density > 0.15) {
    score -= 10; // 略高
  } else if (density > 0.05 && density <= 0.15) {
    score += 15; // 適中
  } else {
    score -= 5; // 密度過低
  }

  // 根據高價值關鍵詞比例調整
  if (highValueRatio > 0.6) {
    score += 20;
  } else if (highValueRatio > 0.4) {
    score += 15;
  } else if (highValueRatio > 0.2) {
    score += 5;
  }

  // 確保分數在0-100範圍內
  return Math.max(0, Math.min(100, score));
}

/**
 * 轉義正則表達式特殊字符
 * @param {String} string - 要轉義的字符串
 * @returns {String} - 轉義後的字符串
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
