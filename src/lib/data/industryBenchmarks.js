// src/lib/data/industryBenchmarks.js

/**
 * 獲取行業面試評分基準
 * 這些基準數據用於評估用戶表現與行業標準的對比
 *
 * @param {String} industry - 行業類型
 * @param {String} position - 職位類型 (可選)
 * @returns {Object} - 行業基準數據
 */
export function getIndustryBenchmarks(industry, position = "") {
  // 獲取行業通用基準
  const industryBaseBenchmarks = getBaseIndustryBenchmarks(industry);

  // 獲取職位特定基準
  const positionBenchmarks = position
    ? getPositionBenchmarks(industry, position)
    : {};

  // 合併並返回基準數據
  return {
    ...industryBaseBenchmarks,
    ...positionBenchmarks,
  };
}

/**
 * 獲取基本行業評分基準
 * @param {String} industry - 行業類型
 * @returns {Object} - 行業基準數據
 */
function getBaseIndustryBenchmarks(industry) {
  // 各行業的基準評分
  const benchmarksByIndustry = {
    // 科技行業基準
    tech: {
      relevance: 78, // 回答相關性
      clarity: 76, // 表達清晰度
      depth: 80, // 回答深度
      structure: 75, // 結構組織
      confidence: 77, // 自信程度
      technical: 82, // 技術知識
      communication: 75, // 溝通技巧
      // 派生評分
      content_quality: 81, // 內容質量
      delivery: 76, // 表達方式
      adaptability: 78, // 適應能力
      overall: 78, // 整體表現
      // 關鍵指標
      example_usage: 74, // 例子使用
      keyword_density: 6.2, // 關鍵詞密度 (%)
      avg_answer_length: 120, // 平均回答長度 (詞)
      technical_term_ratio: 8.5, // 技術術語比例 (%)
    },

    // 金融行業基準
    finance: {
      relevance: 80,
      clarity: 78,
      depth: 82,
      structure: 79,
      confidence: 81,
      technical: 83,
      communication: 78,
      content_quality: 82,
      delivery: 79,
      adaptability: 76,
      overall: 80,
      example_usage: 76,
      keyword_density: 7.5,
      avg_answer_length: 135,
      technical_term_ratio: 9.0,
    },

    // 醫療保健行業基準
    healthcare: {
      relevance: 81,
      clarity: 79,
      depth: 80,
      structure: 76,
      confidence: 79,
      technical: 84,
      communication: 82,
      content_quality: 81,
      delivery: 80,
      adaptability: 77,
      overall: 80,
      example_usage: 77,
      keyword_density: 8.0,
      avg_answer_length: 140,
      technical_term_ratio: 9.5,
    },

    // 教育行業基準
    education: {
      relevance: 79,
      clarity: 81,
      depth: 77,
      structure: 78,
      confidence: 76,
      technical: 75,
      communication: 84,
      content_quality: 78,
      delivery: 81,
      adaptability: 79,
      overall: 79,
      example_usage: 80,
      keyword_density: 6.5,
      avg_answer_length: 150,
      technical_term_ratio: 7.0,
    },

    // 零售行業基準
    retail: {
      relevance: 77,
      clarity: 80,
      depth: 75,
      structure: 74,
      confidence: 82,
      technical: 72,
      communication: 83,
      content_quality: 76,
      delivery: 82,
      adaptability: 81,
      overall: 78,
      example_usage: 79,
      keyword_density: 5.5,
      avg_answer_length: 110,
      technical_term_ratio: 6.0,
    },
  };

  // 返回指定行業的基準，若無匹配則返回默認基準
  return benchmarksByIndustry[industry] || getDefaultBenchmarks();
}

/**
 * 獲取職位特定評分基準
 * @param {String} industry - 行業類型
 * @param {String} position - 職位類型
 * @returns {Object} - 職位基準數據
 */
function getPositionBenchmarks(industry, position) {
  const normalizedPosition = position.toLowerCase();

  // 各行業中特定職位的基準調整
  const positionBenchmarks = {
    tech: {
      // 軟件工程師
      "software engineer": {
        technical: 85, // 更高的技術知識要求
        depth: 82, // 需要更深入的回答
        example_usage: 76, // 更多代碼和項目例子
        keyword_density: 7.0, // 更高的技術詞彙密度
        technical_term_ratio: 10.0, // 更高的技術術語比例
      },

      // 前端開發者
      "frontend developer": {
        technical: 83,
        depth: 80,
        clarity: 79, // 更注重表達清晰度
        example_usage: 78,
        technical_term_ratio: 9.5,
      },

      // 數據科學家
      "data scientist": {
        technical: 87, // 極高的技術知識要求
        depth: 85, // 需要非常深入的回答
        structure: 78, // 更注重邏輯結構
        example_usage: 75,
        keyword_density: 8.0,
        technical_term_ratio: 11.0,
      },

      // 產品經理
      "product manager": {
        technical: 75, // 較低的技術要求
        communication: 82, // 更高的溝通要求
        adaptability: 83, // 更高的適應性要求
        example_usage: 80, // 需要更多具體產品例子
        technical_term_ratio: 7.0,
      },
    },

    finance: {
      // 投資分析師
      "investment analyst": {
        technical: 86,
        depth: 84,
        structure: 82,
        keyword_density: 8.5,
        technical_term_ratio: 10.5,
      },

      // 財務經理
      "financial manager": {
        technical: 84,
        confidence: 83,
        communication: 81,
        keyword_density: 7.8,
      },
    },

    healthcare: {
      // 醫生
      doctor: {
        technical: 88,
        depth: 85,
        clarity: 82,
        technical_term_ratio: 12.0,
      },

      // 護士
      nurse: {
        technical: 81,
        communication: 85,
        example_usage: 81,
      },
    },
  };

  // 查找匹配的職位基準
  const industryPositions = positionBenchmarks[industry] || {};

  // 尋找最匹配的職位
  const matchedPosition = Object.keys(industryPositions).find(
    (key) =>
      normalizedPosition.includes(key) || key.includes(normalizedPosition),
  );

  return matchedPosition ? industryPositions[matchedPosition] : {};
}

/**
 * 獲取默認評分基準
 * 當沒有特定行業基準時使用
 * @returns {Object} - 默認基準數據
 */
function getDefaultBenchmarks() {
  return {
    relevance: 75, // 回答相關性
    clarity: 75, // 表達清晰度
    depth: 75, // 回答深度
    structure: 75, // 結構組織
    confidence: 75, // 自信程度
    technical: 75, // 技術知識
    communication: 75, // 溝通技巧
    content_quality: 75, // 內容質量
    delivery: 75, // 表達方式
    adaptability: 75, // 適應能力
    overall: 75, // 整體表現
    example_usage: 75, // 例子使用
    keyword_density: 6.0, // 關鍵詞密度 (%)
    avg_answer_length: 125, // 平均回答長度 (詞)
    technical_term_ratio: 7.5, // 技術術語比例 (%)
  };
}

/**
 * 獲取行業評分分佈數據
 * 用於百分位數分析和評分比較
 *
 * @param {String} industry - 行業類型
 * @param {String} metric - 評分指標
 * @returns {Object} - 分佈數據 (百分位數)
 */
export function getScoreDistribution(industry, metric) {
  // 不同行業各指標的分佈情況
  const distributions = {
    tech: {
      relevance: { p10: 60, p25: 68, p50: 78, p75: 85, p90: 92 },
      clarity: { p10: 58, p25: 65, p50: 76, p75: 84, p90: 90 },
      depth: { p10: 62, p25: 70, p50: 80, p75: 87, p90: 94 },
      technical: { p10: 64, p25: 72, p50: 82, p75: 88, p90: 95 },
      overall: { p10: 62, p25: 69, p50: 78, p75: 85, p90: 92 },
    },

    finance: {
      relevance: { p10: 62, p25: 70, p50: 80, p75: 87, p90: 94 },
      clarity: { p10: 60, p25: 68, p50: 78, p75: 85, p90: 92 },
      depth: { p10: 65, p25: 73, p50: 82, p75: 89, p90: 95 },
      technical: { p10: 66, p25: 74, p50: 83, p75: 90, p90: 96 },
      overall: { p10: 64, p25: 71, p50: 80, p75: 88, p90: 94 },
    },

    healthcare: {
      relevance: { p10: 64, p25: 72, p50: 81, p75: 88, p90: 94 },
      clarity: { p10: 62, p25: 70, p50: 79, p75: 86, p90: 93 },
      depth: { p10: 63, p25: 71, p50: 80, p75: 87, p90: 93 },
      technical: { p10: 68, p25: 75, p50: 84, p75: 91, p90: 97 },
      overall: { p10: 65, p25: 72, p50: 80, p75: 87, p90: 94 },
    },

    education: {
      relevance: { p10: 61, p25: 69, p50: 79, p75: 86, p90: 93 },
      clarity: { p10: 64, p25: 72, p50: 81, p75: 88, p90: 94 },
      depth: { p10: 60, p25: 68, p50: 77, p75: 84, p90: 91 },
      technical: { p10: 58, p25: 66, p50: 75, p75: 83, p90: 90 },
      overall: { p10: 62, p25: 70, p50: 79, p75: 86, p90: 93 },
    },

    retail: {
      relevance: { p10: 58, p25: 66, p50: 77, p75: 84, p90: 91 },
      clarity: { p10: 62, p25: 70, p50: 80, p75: 87, p90: 93 },
      depth: { p10: 56, p25: 65, p50: 75, p75: 83, p90: 90 },
      technical: { p10: 54, p25: 62, p50: 72, p75: 80, p90: 88 },
      overall: { p10: 60, p25: 68, p50: 78, p75: 85, p90: 92 },
    },
  };

  // 獲取指定行業和指標的分佈，若無匹配則返回默認分佈
  return (
    distributions[industry]?.[metric] || {
      p10: 60,
      p25: 68,
      p50: 75,
      p75: 84,
      p90: 92,
    }
  );
}

/**
 * 計算評分的百分位數
 * @param {Number} score - 評分
 * @param {String} industry - 行業
 * @param {String} metric - 評分指標
 * @returns {Number} - 百分位數 (0-100)
 */
export function calculatePercentile(score, industry, metric) {
  const distribution = getScoreDistribution(industry, metric);

  // 根據分數與百分位閾值的關係確定大致百分位數
  if (score < distribution.p10) {
    // 線性插值 0-10 百分位
    return Math.max(1, Math.floor((score / distribution.p10) * 10));
  } else if (score < distribution.p25) {
    // 線性插值 10-25 百分位
    return (
      10 +
      Math.floor(
        ((score - distribution.p10) / (distribution.p25 - distribution.p10)) *
          15,
      )
    );
  } else if (score < distribution.p50) {
    // 線性插值 25-50 百分位
    return (
      25 +
      Math.floor(
        ((score - distribution.p25) / (distribution.p50 - distribution.p25)) *
          25,
      )
    );
  } else if (score < distribution.p75) {
    // 線性插值 50-75 百分位
    return (
      50 +
      Math.floor(
        ((score - distribution.p50) / (distribution.p75 - distribution.p50)) *
          25,
      )
    );
  } else if (score < distribution.p90) {
    // 線性插值 75-90 百分位
    return (
      75 +
      Math.floor(
        ((score - distribution.p75) / (distribution.p90 - distribution.p75)) *
          15,
      )
    );
  } else {
    // 線性插值 90-100 百分位
    return (
      90 +
      Math.min(
        9,
        Math.floor(
          ((score - distribution.p90) / (100 - distribution.p90)) * 10,
        ),
      )
    );
  }
}

/**
 * 獲取行業趨勢數據
 * 提供行業面試趨勢和熱門關鍵詞
 *
 * @param {String} industry - 行業類型
 * @returns {Object} - 行業趨勢數據
 */
export function getIndustryTrends(industry) {
  const trends = {
    tech: {
      hot_keywords: [
        "AI",
        "人工智能",
        "machine learning",
        "cloud native",
        "雲原生",
        "microservices",
        "微服務",
        "DevOps",
        "敏捷開發",
        "agile",
        "blockchain",
        "區塊鏈",
        "cybersecurity",
        "網絡安全",
      ],
      focus_areas: [
        "系統設計能力",
        "問題解決能力",
        "團隊協作",
        "持續學習",
        "代碼質量",
        "數據結構和算法",
        "安全意識",
      ],
      interview_trends: [
        "更注重實際項目經驗",
        "強調系統設計能力",
        "關注解決問題的過程而非結果",
        "技術深度與廣度的平衡",
        "遠程協作能力評估",
      ],
    },

    finance: {
      hot_keywords: [
        "fintech",
        "金融科技",
        "blockchain",
        "cryptocurrency",
        "加密貨幣",
        "risk management",
        "風險管理",
        "compliance",
        "合規",
        "ESG",
        "sustainable finance",
        "可持續金融",
        "digital banking",
        "數字銀行",
      ],
      focus_areas: [
        "風險評估",
        "數據分析",
        "監管合規",
        "金融建模",
        "商業敏銳度",
        "道德標準",
        "客戶關係管理",
      ],
      interview_trends: [
        "強調合規意識",
        "注重金融科技知識",
        "關注風險管理能力",
        "考察壓力情境應對",
        "評估數據分析能力",
      ],
    },

    healthcare: {
      hot_keywords: [
        "telemedicine",
        "遠程醫療",
        "AI in healthcare",
        "健康AI",
        "electronic health records",
        "電子健康記錄",
        "patient-centered care",
        "以患者為中心的護理",
        "precision medicine",
        "精準醫療",
      ],
      focus_areas: [
        "患者護理質量",
        "醫療倫理",
        "團隊合作",
        "溝通能力",
        "適應變化能力",
        "醫療技術掌握",
        "同理心",
      ],
      interview_trends: [
        "重視醫患溝通能力",
        "關注醫療倫理案例",
        "評估團隊協作經驗",
        "考察危機處理能力",
        "注重技術與人性關懷的平衡",
      ],
    },

    education: {
      hot_keywords: [
        "online learning",
        "在線學習",
        "educational technology",
        "教育科技",
        "personalized learning",
        "個性化學習",
        "student engagement",
        "學生參與",
        "STEM education",
        "STEM教育",
        "inclusive education",
        "融合教育",
      ],
      focus_areas: [
        "教學方法創新",
        "學生評估",
        "課程設計",
        "技術整合",
        "課堂管理",
        "多元文化意識",
        "專業發展",
      ],
      interview_trends: [
        "注重教學理念表達",
        "評估課堂管理策略",
        "關注教育科技應用",
        "考察因材施教能力",
        "強調持續學習態度",
      ],
    },

    retail: {
      hot_keywords: [
        "omnichannel",
        "全渠道",
        "e-commerce",
        "電子商務",
        "customer experience",
        "客戶體驗",
        "supply chain",
        "供應鏈",
        "data-driven",
        "數據驅動",
        "personalization",
        "個性化",
      ],
      focus_areas: [
        "客戶服務",
        "銷售技巧",
        "庫存管理",
        "市場趨勢分析",
        "團隊領導",
        "問題解決",
        "適應變化",
      ],
      interview_trends: [
        "重視客戶服務經驗",
        "關注數據分析能力",
        "評估危機管理能力",
        "考察銷售技巧",
        "注重全渠道零售知識",
      ],
    },
  };

  return (
    trends[industry] || {
      hot_keywords: [],
      focus_areas: [],
      interview_trends: [],
    }
  );
}
