// src/lib/analysis/improvementSuggestions.js

/**
 * 基於面試評估結果生成改進建議
 * @param {Array} answersAnalysis - 答案分析結果
 * @param {Object} strengthsAndWeaknesses - 強項和弱項分析
 * @param {Object} context - 面試上下文（行業、職位類型等）
 * @returns {Object} - 分類的改進建議
 */
export function generateImprovementSuggestions(
  answersAnalysis,
  strengthsAndWeaknesses,
  context,
) {
  // 針對不同面向的建議
  const suggestions = {
    content: generateContentSuggestions(answersAnalysis, context),
    delivery: generateDeliverySuggestions(
      answersAnalysis,
      strengthsAndWeaknesses,
    ),
    structure: generateStructureSuggestions(answersAnalysis),
    keywords: generateKeywordSuggestions(answersAnalysis, context),
    preparation: generatePreparationSuggestions(
      answersAnalysis,
      strengthsAndWeaknesses,
      context,
    ),
  };

  // 生成需要優先改進的方面
  const priorities = prioritizeSuggestions(suggestions, strengthsAndWeaknesses);

  return {
    suggestions,
    priorities,
    topRecommendations: generateTopRecommendations(
      suggestions,
      priorities,
      context,
    ),
  };
}

/**
 * 生成內容方面的改進建議
 * @param {Array} answersAnalysis - 答案分析結果
 * @param {Object} context - 面試上下文
 * @returns {Array} - 內容建議
 */
function generateContentSuggestions(answersAnalysis, context) {
  const suggestions = [];

  // 檢查具體例子使用情況
  const exampleUsageScore = analyzeExampleUsage(answersAnalysis);
  if (exampleUsageScore < 70) {
    suggestions.push({
      area: "examples",
      title: "增加具體例子",
      suggestion: "你的回答中缺乏足夠的具體例子來支持你的觀點。",
      improvement:
        "使用STAR方法（情境-任務-行動-結果）來結構化你的例子，確保它們具體且與問題相關。",
      priority: exampleUsageScore < 50 ? "high" : "medium",
    });
  }

  // 檢查數據和量化成就的使用
  const quantificationScore = analyzeQuantification(answersAnalysis);
  if (quantificationScore < 70) {
    suggestions.push({
      area: "quantification",
      title: "量化你的成就",
      suggestion: "你的回答中缺乏具體數據和量化的成就。",
      improvement:
        "盡可能使用數字來描述你的成就，例如百分比增長、節省的時間或金錢、影響的用戶數量等。",
      priority: quantificationScore < 50 ? "high" : "medium",
    });
  }

  // 檢查行業相關性
  const industryRelevanceScore = analyzeIndustryRelevance(
    answersAnalysis,
    context,
  );
  if (industryRelevanceScore < 70) {
    const industryName = getIndustryName(context.industry);
    suggestions.push({
      area: "industry_relevance",
      title: "增強行業相關性",
      suggestion: `你的回答沒有充分展示對${industryName}行業的理解和相關經驗。`,
      improvement: `研究${industryName}行業的當前趨勢、挑戰和術語，並在回答中展示你如何將你的技能應用於這個特定行業。`,
      priority: industryRelevanceScore < 50 ? "high" : "medium",
    });
  }

  // 檢查技術深度
  if (context.industry === "tech") {
    const technicalDepthScore = analyzeTechnicalDepth(answersAnalysis);
    if (technicalDepthScore < 70) {
      suggestions.push({
        area: "technical_depth",
        title: "提高技術深度",
        suggestion:
          "你的回答缺乏足夠的技術深度，這可能讓面試官懷疑你的專業能力。",
        improvement:
          "深入解釋技術概念，展示你對底層原理的理解，而不只是表面的使用經驗。",
        priority: technicalDepthScore < 50 ? "high" : "medium",
      });
    }
  }

  // 檢查視角多樣性
  const perspectiveScore = analyzePerspectiveDiversity(answersAnalysis);
  if (perspectiveScore < 70) {
    suggestions.push({
      area: "perspective",
      title: "提供多角度思考",
      suggestion: "你的回答傾向於從單一角度考慮問題，這可能顯得視野不夠廣闊。",
      improvement:
        "從多個角度分析問題，例如技術、業務、用戶、團隊合作等不同維度，展示你的全面思考能力。",
      priority: "medium",
    });
  }

  return suggestions;
}

/**
 * 生成表達方面的改進建議
 * @param {Array} answersAnalysis - 答案分析結果
 * @param {Object} strengthsAndWeaknesses - 強項和弱項
 * @returns {Array} - 表達建議
 */
function generateDeliverySuggestions(answersAnalysis, strengthsAndWeaknesses) {
  const suggestions = [];

  // 檢查答案長度
  const answerLengthScore = analyzeAnswerLength(answersAnalysis);
  if (answerLengthScore < 60) {
    suggestions.push({
      area: "answer_length",
      title: "優化回答長度",
      suggestion:
        answerLengthScore < 40
          ? "你的回答過於簡短，無法充分展示你的能力和經驗。"
          : "你的部分回答可能過長或過短，影響了信息傳達效果。",
      improvement:
        answerLengthScore < 40
          ? "擴展你的回答，確保包含足夠細節，但避免冗長。一般而言，重要問題的回答應在2-3分鐘左右。"
          : "針對重要問題提供詳細回答，對簡單問題保持簡潔。確保你的回答完整但不冗長。",
      priority: answerLengthScore < 40 ? "high" : "medium",
    });
  }

  // 檢查語氣自信度
  const isConfidenceWeakness = strengthsAndWeaknesses.weaknesses.some(
    (w) => w.category === "confidence",
  );

  if (isConfidenceWeakness) {
    suggestions.push({
      area: "confidence",
      title: "增強自信語氣",
      suggestion: "你的回答中使用了過多不確定詞彙，可能給人缺乏自信的印象。",
      improvement:
        '避免使用"可能"、"也許"、"我覺得"等不確定詞彙。使用肯定語氣，如"我確信"、"我知道"、"我成功地"等。',
      priority: "high",
    });
  }

  // 檢查主動語態與被動語態
  const voiceScore = analyzeActiveVoice(answersAnalysis);
  if (voiceScore < 70) {
    suggestions.push({
      area: "active_voice",
      title: "使用主動語態",
      suggestion:
        "你的回答中使用了過多被動語態，這可能削弱你的成就感和責任感。",
      improvement:
        '使用主動語態描述你的成就和行動。例如，將"問題被解決了"改為"我解決了問題"。',
      priority: "medium",
    });
  }

  // 檢查清晰度
  const isClarityWeakness = strengthsAndWeaknesses.weaknesses.some(
    (w) => w.category === "clarity",
  );

  if (isClarityWeakness) {
    suggestions.push({
      area: "clarity",
      title: "提高表達清晰度",
      suggestion: "你的回答中有些表述可能不夠清晰，難以理解你的觀點。",
      improvement:
        "使用更簡潔直接的語言，一次只表達一個重點。避免長句和複雜結構，使用常見詞彙解釋專業概念。",
      priority: "high",
    });
  }

  return suggestions;
}

/**
 * 生成結構方面的改進建議
 * @param {Array} answersAnalysis - 答案分析結果
 * @returns {Array} - 結構建議
 */
function generateStructureSuggestions(answersAnalysis) {
  const suggestions = [];

  // 檢查答案結構
  const structureScores = answersAnalysis.map(
    (analysis) => analysis.scores.structure,
  );
  const avgStructureScore =
    structureScores.reduce((sum, score) => sum + score, 0) /
    structureScores.length;

  if (avgStructureScore < 70) {
    suggestions.push({
      area: "organization",
      title: "改善回答結構",
      suggestion: "你的回答結構不夠清晰，可能讓面試官難以跟上你的思路。",
      improvement:
        "使用明確的結構組織回答，如：1) 簡短介紹你的觀點，2) 提供2-3個支持論點，3) 用具體例子說明，4) 總結關鍵點。",
      priority: avgStructureScore < 50 ? "high" : "medium",
    });
  }

  // 檢查開場和結尾
  const hasProperIntroAndConclusion =
    answersAnalysis.filter((analysis) => hasIntroAndConclusion(analysis.answer))
      .length /
      answersAnalysis.length >=
    0.5;

  if (!hasProperIntroAndConclusion) {
    suggestions.push({
      area: "intro_conclusion",
      title: "添加開場和結尾",
      suggestion: "你的許多回答缺乏清晰的開場和結尾，這可能讓回答顯得不完整。",
      improvement:
        "以簡短陳述開始回答，直接回應問題核心，並在結束時總結要點或重申你的主要觀點。",
      priority: "medium",
    });
  }

  // 檢查邏輯流暢度
  const logicalFlowScore = analyzeLogicalFlow(answersAnalysis);
  if (logicalFlowScore < 70) {
    suggestions.push({
      area: "logical_flow",
      title: "增強邏輯流暢度",
      suggestion:
        "你的回答中的點與點之間缺乏明確的邏輯連接，影響了論點的說服力。",
      improvement:
        '使用過渡詞和連接詞（例如"首先"、"此外"、"因此"、"總結來說"）來建立清晰的邏輯關係，引導聽者跟隨你的思路。',
      priority: "medium",
    });
  }

  return suggestions;
}

/**
 * 生成關鍵詞使用方面的改進建議
 * @param {Array} answersAnalysis - 答案分析結果
 * @param {Object} context - 面試上下文
 * @returns {Array} - 關鍵詞建議
 */
function generateKeywordSuggestions(answersAnalysis, context) {
  const suggestions = [];

  // 從每個答案分析中收集關鍵詞建議
  const allKeywordSuggestions = [];
  answersAnalysis.forEach((analysis) => {
    if (analysis.keywordAnalysis && analysis.keywordAnalysis.suggestions) {
      allKeywordSuggestions.push(...analysis.keywordAnalysis.suggestions);
    }
  });

  // 對關鍵詞建議進行分類和計數
  const suggestionCounts = {};
  allKeywordSuggestions.forEach((suggestion) => {
    suggestionCounts[suggestion.type] =
      (suggestionCounts[suggestion.type] || 0) + 1;
  });

  // 找出最常見的建議類型
  const commonSuggestions = Object.entries(suggestionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([type]) => type);

  // 基於最常見的建議類型生成整體建議
  if (
    commonSuggestions.includes("missing_keywords") ||
    commonSuggestions.includes("few_keywords")
  ) {
    suggestions.push({
      area: "keyword_usage",
      title: "增加行業關鍵詞使用",
      suggestion: `你的回答中缺乏足夠的${getIndustryName(context.industry)}行業關鍵詞和專業術語。`,
      improvement: `研究並學習${getIndustryName(context.industry)}行業的核心術語和概念，適當地將它們融入你的回答中，展示你的專業知識和行業理解。`,
      priority: "high",
    });
  }

  if (commonSuggestions.includes("high_density")) {
    suggestions.push({
      area: "keyword_density",
      title: "避免關鍵詞堆砌",
      suggestion: "你的回答中關鍵詞使用過度集中，可能給人刻意堆砌術語的印象。",
      improvement:
        "保持使用專業術語，但確保它們在自然語境中出現，服務於你的論點，而不是為使用而使用。",
      priority: "medium",
    });
  }

  if (commonSuggestions.includes("missing_important_keywords")) {
    // 提取所有缺失的重要關鍵詞
    const missingImportantKeywords = new Set();
    answersAnalysis.forEach((analysis) => {
      if (
        analysis.keywordAnalysis &&
        analysis.keywordAnalysis.missingImportantKeywords
      ) {
        analysis.keywordAnalysis.missingImportantKeywords.forEach((item) => {
          missingImportantKeywords.add(item.keyword);
        });
      }
    });

    if (missingImportantKeywords.size > 0) {
      const keywordsList = Array.from(missingImportantKeywords)
        .slice(0, 5)
        .join("、");
      suggestions.push({
        area: "important_keywords",
        title: "使用核心行業術語",
        suggestion: `你的回答中缺少一些重要的行業核心術語，如：${keywordsList}。`,
        improvement:
          "熟悉並理解這些核心概念，在適當的上下文中使用它們來展示你的專業深度。",
        priority: "high",
      });
    }
  }

  return suggestions;
}

/**
 * 生成準備方面的改進建議
 * @param {Array} answersAnalysis - 答案分析結果
 * @param {Object} strengthsAndWeaknesses - 強項和弱項
 * @param {Object} context - 面試上下文
 * @returns {Array} - 準備建議
 */
function generatePreparationSuggestions(
  answersAnalysis,
  strengthsAndWeaknesses,
  context,
) {
  const suggestions = [];

  // 檢查是否有與問題不相關的回答
  const irrelevantAnswers = answersAnalysis.filter(
    (analysis) => analysis.scores.relevance < 60,
  ).length;

  if (irrelevantAnswers > 0) {
    suggestions.push({
      area: "question_understanding",
      title: "改善問題理解",
      suggestion:
        "你的部分回答與問題的相關性不高，表明你可能沒有完全理解問題的核心。",
      improvement:
        "練習主動聆聽技巧，確保完全理解問題後再回答。如果不確定，可以請面試官澄清或重述問題來確認理解無誤。",
      priority:
        irrelevantAnswers > answersAnalysis.length / 3 ? "high" : "medium",
    });
  }

  // 檢查常見問題準備
  const commonQuestionScore = analyzeCommonQuestionPreparation(answersAnalysis);
  if (commonQuestionScore < 70) {
    suggestions.push({
      area: "common_questions",
      title: "準備常見面試問題",
      suggestion: "你對一些標準面試問題的回答顯得準備不足或過於泛泛。",
      improvement: `準備並練習回答${getIndustryName(context.industry)}行業的常見面試問題，包括行為問題、情境問題和技術問題。針對每個問題準備具體例子。`,
      priority: "high",
    });
  }

  // 檢查情境適應性
  const adaptabilityScore = analyzeAdaptability(answersAnalysis);
  if (adaptabilityScore < 70) {
    suggestions.push({
      area: "adaptability",
      title: "提高情境適應性",
      suggestion: "你的回答模式相對固定，可能難以適應意外或挑戰性問題。",
      improvement:
        "練習回答各類型問題，包括壓力問題、假設性問題和反向問題。培養快速調整思路的能力。",
      priority: "medium",
    });
  }

  // 檢查公司研究
  const companyResearchScore = analyzeCompanyResearch(answersAnalysis);
  if (companyResearchScore < 60) {
    suggestions.push({
      area: "company_research",
      title: "加強公司研究",
      suggestion:
        "你的回答中很少提及公司特定信息，這可能表明你對目標公司的研究不足。",
      improvement:
        "在面試前研究公司的使命、價值觀、產品、服務、市場地位和最新發展，並在回答中自然地引用這些信息。",
      priority: "high",
    });
  }

  return suggestions;
}

/**
 * 分析例子使用情況
 * @param {Array} answersAnalysis - 答案分析結果
 * @returns {Number} - 例子使用評分
 */
function analyzeExampleUsage(answersAnalysis) {
  let exampleCount = 0;
  let detailedExampleCount = 0;

  // 檢查每個答案中的例子使用
  answersAnalysis.forEach((analysis) => {
    const answer = analysis.answer.toLowerCase();

    // 簡單檢查是否包含例子相關詞彙
    if (
      /例如|for example|instance|例子|like when|案例|scenario|曾經|此外/.test(
        answer,
      )
    ) {
      exampleCount++;

      // 檢查是否是詳細例子 (包含情境描述、行動和結果)
      if (
        (answer.includes("情境") ||
          answer.includes("背景") ||
          answer.includes("context") ||
          answer.includes("situation") ||
          answer.includes("background")) &&
        (answer.includes("行動") ||
          answer.includes("做法") ||
          answer.includes("action") ||
          answer.includes("approach") ||
          answer.includes("method")) &&
        (answer.includes("結果") ||
          answer.includes("成果") ||
          answer.includes("result") ||
          answer.includes("outcome") ||
          answer.includes("impact"))
      ) {
        detailedExampleCount++;
      }
    }
  });

  // 計算例子使用率
  const exampleRate = exampleCount / answersAnalysis.length;

  // 計算詳細例子比例
  const detailRate = exampleCount > 0 ? detailedExampleCount / exampleCount : 0;

  // 計算評分
  let score = 60; // 基礎分數

  // 根據例子使用率評分
  if (exampleRate >= 0.7) score += 20;
  else if (exampleRate >= 0.5) score += 15;
  else if (exampleRate >= 0.3) score += 10;
  else if (exampleRate > 0) score += 5;
  else score -= 20;

  // 根據詳細例子比例加分
  if (detailRate >= 0.7) score += 20;
  else if (detailRate >= 0.5) score += 15;
  else if (detailRate >= 0.3) score += 10;
  else if (detailRate > 0) score += 5;

  return Math.min(100, Math.max(0, score));
}

/**
 * 分析量化成就使用情況
 * @param {Array} answersAnalysis - 答案分析結果
 * @returns {Number} - 量化成就使用評分
 */
function analyzeQuantification(answersAnalysis) {
  let quantificationCount = 0;

  // 檢查每個答案中的量化數據使用
  answersAnalysis.forEach((analysis) => {
    const answer = analysis.answer;

    // 檢查是否包含數字、百分比、具體數量等
    if (/\d+%|\d+[k,]\d+|\$\d+|\d+\.\d+|\b\d{2,}\b/.test(answer)) {
      quantificationCount++;
    }
  });

  // 計算量化數據使用率
  const quantificationRate = quantificationCount / answersAnalysis.length;

  // 計算評分
  let score = 60; // 基礎分數

  // 根據量化數據使用率評分
  if (quantificationRate >= 0.6) score += 30;
  else if (quantificationRate >= 0.4) score += 25;
  else if (quantificationRate >= 0.3) score += 20;
  else if (quantificationRate >= 0.2) score += 15;
  else if (quantificationRate > 0) score += 10;
  else score -= 10;

  return Math.min(100, Math.max(0, score));
}

/**
 * 分析行業相關性
 * @param {Array} answersAnalysis - 答案分析結果
 * @param {Object} context - 面試上下文
 * @returns {Number} - 行業相關性評分
 */
function analyzeIndustryRelevance(answersAnalysis, context) {
  // 如果沒有行業信息，返回默認分數
  if (!context || !context.industry) return 75;

  // 收集所有答案中的行業相關關鍵詞
  let industryTermCount = 0;
  let totalKeywordCount = 0;

  answersAnalysis.forEach((analysis) => {
    if (analysis.keywordAnalysis && analysis.keywordAnalysis.keywordInstances) {
      totalKeywordCount += analysis.keywordAnalysis.keywordInstances.length;

      // 計算行業相關詞彙
      analysis.keywordAnalysis.keywordInstances.forEach((instance) => {
        if (instance.rating === "critical" || instance.rating === "important") {
          industryTermCount += instance.count;
        }
      });
    }
  });

  // 計算行業相關詞彙占比
  const industryRelevanceRatio =
    totalKeywordCount > 0 ? industryTermCount / totalKeywordCount : 0;

  // 計算評分
  let score = 60; // 基礎分數

  // 根據行業相關詞彙占比評分
  if (industryRelevanceRatio >= 0.5) score += 30;
  else if (industryRelevanceRatio >= 0.4) score += 25;
  else if (industryRelevanceRatio >= 0.3) score += 20;
  else if (industryRelevanceRatio >= 0.2) score += 15;
  else if (industryRelevanceRatio > 0.1) score += 10;
  else score -= 10;

  return Math.min(100, Math.max(0, score));
}

/**
 * 分析技術深度
 * @param {Array} answersAnalysis - 答案分析結果
 * @returns {Number} - 技術深度評分
 */
function analyzeTechnicalDepth(answersAnalysis) {
  let technicalDepthScore = 0;
  let technicalAnswerCount = 0;

  // 檢查每個答案的技術深度
  answersAnalysis.forEach((analysis) => {
    // 只考慮技術相關問題的回答
    if (isTechnicalQuestion(analysis.question)) {
      technicalAnswerCount++;
      technicalDepthScore += analysis.scores.technicalAccuracy || 0;
    }
  });

  // 如果沒有技術相關問題，返回默認分數
  if (technicalAnswerCount === 0) return 75;

  // 計算平均技術深度分數
  return technicalDepthScore / technicalAnswerCount;
}

/**
 * 判斷是否為技術相關問題
 * @param {String} question - 問題文本
 * @returns {Boolean} - 是否為技術問題
 */
function isTechnicalQuestion(question) {
  const technicalKeywords = [
    "技術",
    "編程",
    "代碼",
    "開發",
    "框架",
    "軟件",
    "系統",
    "數據庫",
    "算法",
    "technical",
    "programming",
    "code",
    "development",
    "framework",
    "software",
    "system",
    "database",
    "algorithm",
    "architecture",
    "design",
  ];

  const lowerQuestion = question.toLowerCase();
  return technicalKeywords.some((keyword) => lowerQuestion.includes(keyword));
}

/**
 * 分析視角多樣性
 * @param {Array} answersAnalysis - 答案分析結果
 * @returns {Number} - 視角多樣性評分
 */
function analyzePerspectiveDiversity(answersAnalysis) {
  let diversePerspectiveCount = 0;

  // 檢查每個答案的視角多樣性
  answersAnalysis.forEach((analysis) => {
    const answer = analysis.answer.toLowerCase();
    let perspectiveCount = 0;

    // 檢查不同視角
    if (
      answer.includes("技術") ||
      answer.includes("technical") ||
      answer.includes("engineer") ||
      answer.includes("科技")
    ) {
      perspectiveCount++;
    }

    if (
      answer.includes("業務") ||
      answer.includes("business") ||
      answer.includes("market") ||
      answer.includes("客戶")
    ) {
      perspectiveCount++;
    }

    if (
      answer.includes("用戶") ||
      answer.includes("user") ||
      answer.includes("customer") ||
      answer.includes("client")
    ) {
      perspectiveCount++;
    }

    if (
      answer.includes("團隊") ||
      answer.includes("team") ||
      answer.includes("collaboration") ||
      answer.includes("同事")
    ) {
      perspectiveCount++;
    }

    if (
      answer.includes("管理") ||
      answer.includes("management") ||
      answer.includes("leadership") ||
      answer.includes("領導")
    ) {
      perspectiveCount++;
    }

    // 如果涵蓋至少2個視角，則視為多元視角
    if (perspectiveCount >= 2) {
      diversePerspectiveCount++;
    }
  });

  // 計算多元視角使用率
  const diversePerspectiveRate =
    diversePerspectiveCount / answersAnalysis.length;

  // 計算評分
  let score = 60; // 基礎分數

  // 根據多元視角使用率評分
  if (diversePerspectiveRate >= 0.7) score += 30;
  else if (diversePerspectiveRate >= 0.5) score += 25;
  else if (diversePerspectiveRate >= 0.3) score += 20;
  else if (diversePerspectiveRate >= 0.2) score += 15;
  else if (diversePerspectiveRate > 0) score += 10;
  else score -= 10;

  return Math.min(100, Math.max(0, score));
}

/**
 * 分析答案長度
 * @param {Array} answersAnalysis - 答案分析結果
 * @returns {Number} - 答案長度評分
 */
function analyzeAnswerLength(answersAnalysis) {
  // 計算每個回答的詞數
  const wordCounts = answersAnalysis.map(
    (analysis) => analysis.metrics.wordCount,
  );

  // 計算長度適當的回答數量
  let appropriateLengthCount = 0;
  wordCounts.forEach((count) => {
    if (count >= 50 && count <= 200) {
      appropriateLengthCount++;
    }
  });

  // 計算長度適當率
  const appropriateLengthRate = appropriateLengthCount / wordCounts.length;

  // 計算評分
  let score = 60; // 基礎分數

  // 根據長度適當率評分
  if (appropriateLengthRate >= 0.8) score += 30;
  else if (appropriateLengthRate >= 0.7) score += 25;
  else if (appropriateLengthRate >= 0.6) score += 20;
  else if (appropriateLengthRate >= 0.5) score += 15;
  else if (appropriateLengthRate >= 0.4) score += 10;
  else score -= 10;

  // 檢查是否有極端長度的回答
  const hasExtremelyShort = wordCounts.some((count) => count < 20);
  const hasExtremelyLong = wordCounts.some((count) => count > 300);

  if (hasExtremelyShort) score -= 15;
  if (hasExtremelyLong) score -= 10;

  return Math.min(100, Math.max(0, score));
}

/**
 * 分析主動語態使用
 * @param {Array} answersAnalysis - 答案分析結果
 * @returns {Number} - 主動語態評分
 */
function analyzeActiveVoice(answersAnalysis) {
  let passiveVoiceCount = 0;
  let sentenceCount = 0;

  // 檢查每個答案中的被動語態使用
  answersAnalysis.forEach((analysis) => {
    const answer = analysis.answer.toLowerCase();
    sentenceCount += analysis.metrics.sentenceCount || 1;

    // 簡單檢測被動語態
    const passivePatterns = [
      "被",
      "由",
      "was made",
      "were created",
      "is done",
      "are performed",
      "has been",
      "have been",
      "was given",
      "were provided",
      "is being",
      "are being",
      "was handled",
      "were managed",
    ];

    passivePatterns.forEach((pattern) => {
      const regex = new RegExp(pattern, "gi");
      const matches = answer.match(regex);
      if (matches) {
        passiveVoiceCount += matches.length;
      }
    });
  });

  // 計算被動語態使用率
  const passiveVoiceRate = passiveVoiceCount / Math.max(1, sentenceCount);

  // 計算評分
  let score = 80; // 基礎分數

  // 根據被動語態使用率評分
  if (passiveVoiceRate > 0.3) score -= 30;
  else if (passiveVoiceRate > 0.2) score -= 20;
  else if (passiveVoiceRate > 0.15) score -= 15;
  else if (passiveVoiceRate > 0.1) score -= 10;
  else if (passiveVoiceRate > 0.05) score -= 5;

  return Math.min(100, Math.max(0, score));
}

/**
 * 檢查回答是否有開場和結尾
 * @param {String} answer - 回答文本
 * @returns {Boolean} - 是否有開場和結尾
 */
function hasIntroAndConclusion(answer) {
  const sentences = answer.split(/[.!?]+/).filter((s) => s.trim().length > 0);

  // 如果句子太少，無法判斷結構
  if (sentences.length < 3) return true;

  // 檢查第一句是否為開場
  const firstSentence = sentences[0].toLowerCase();
  const hasIntro =
    firstSentence.includes("我認為") ||
    firstSentence.includes("我相信") ||
    firstSentence.includes("就我的經驗") ||
    firstSentence.includes("i believe") ||
    firstSentence.includes("in my opinion") ||
    firstSentence.includes("from my experience");

  // 檢查最後一句是否為結尾
  const lastSentence = sentences[sentences.length - 1].toLowerCase();
  const hasConclusion =
    lastSentence.includes("總之") ||
    lastSentence.includes("因此") ||
    lastSentence.includes("總結") ||
    lastSentence.includes("in conclusion") ||
    lastSentence.includes("therefore") ||
    lastSentence.includes("to summarize");

  return hasIntro || hasConclusion;
}

/**
 * 分析邏輯流暢度
 * @param {Array} answersAnalysis - 答案分析結果
 * @returns {Number} - 邏輯流暢度評分
 */
function analyzeLogicalFlow(answersAnalysis) {
  let logicalFlowScore = 0;

  // 檢查每個答案的邏輯流暢度
  answersAnalysis.forEach((analysis) => {
    const answer = analysis.answer.toLowerCase();
    let score = 60; // 基礎分數

    // 檢查邏輯連接詞的使用
    const logicalConnectors = [
      "首先",
      "其次",
      "再者",
      "此外",
      "因此",
      "所以",
      "然而",
      "不過",
      "總之",
      "first",
      "second",
      "furthermore",
      "moreover",
      "therefore",
      "thus",
      "however",
      "nevertheless",
      "in conclusion",
      "to summarize",
    ];

    let connectorCount = 0;
    logicalConnectors.forEach((connector) => {
      if (answer.includes(connector)) {
        connectorCount++;
      }
    });

    // 根據連接詞數量調整分數
    if (connectorCount >= 3) score += 25;
    else if (connectorCount === 2) score += 20;
    else if (connectorCount === 1) score += 15;
    else score -= 10;

    // 檢查是否存在明顯的邏輯矛盾
    const contradictions = [
      ["優點", "沒有優點"],
      ["喜歡", "不喜歡"],
      ["好處", "沒有好處"],
      ["優勢", "劣勢"],
      ["advantage", "disadvantage"],
      ["like", "dislike"],
      ["positive", "negative"],
    ];

    let hasContradiction = false;
    contradictions.forEach(([term1, term2]) => {
      if (answer.includes(term1) && answer.includes(term2)) {
        // 檢查是否有轉折詞
        const hasTurnWords =
          answer.includes("但是") ||
          answer.includes("然而") ||
          answer.includes("but") ||
          answer.includes("however");

        if (!hasTurnWords) {
          hasContradiction = true;
        }
      }
    });

    if (hasContradiction) score -= 20;

    logicalFlowScore += Math.min(100, Math.max(0, score));
  });

  // 計算平均邏輯流暢度分數
  return logicalFlowScore / answersAnalysis.length;
}

/**
 * 分析常見問題準備情況
 * @param {Array} answersAnalysis - 答案分析結果
 * @returns {Number} - 常見問題準備評分
 */
function analyzeCommonQuestionPreparation(answersAnalysis) {
  let commonQuestionScore = 0;
  let commonQuestionCount = 0;

  // 常見面試問題關鍵詞
  const commonQuestionPatterns = [
    "自我介紹",
    "優點",
    "缺點",
    "為什麼選擇",
    "五年規劃",
    "最大成就",
    "失敗經驗",
    "團隊合作",
    "壓力處理",
    "職業目標",
    "introduce yourself",
    "strength",
    "weakness",
    "why choose",
    "five-year plan",
    "achievement",
    "failure",
    "teamwork",
    "pressure",
    "career goal",
  ];

  // 檢查每個問題是否為常見問題，並評估回答準備度
  answersAnalysis.forEach((analysis) => {
    const question = analysis.question.toLowerCase();

    // 檢查是否為常見問題
    const isCommonQuestion = commonQuestionPatterns.some((pattern) =>
      question.includes(pattern),
    );

    if (isCommonQuestion) {
      commonQuestionCount++;

      // 評估回答質量
      const answerQuality =
        (analysis.scores.relevance +
          analysis.scores.depth +
          analysis.scores.structure) /
        3;

      commonQuestionScore += answerQuality;
    }
  });

  // 如果沒有常見問題，返回默認分數
  if (commonQuestionCount === 0) return 75;

  // 計算平均常見問題準備評分
  return commonQuestionScore / commonQuestionCount;
}

/**
 * 分析適應性
 * @param {Array} answersAnalysis - 答案分析結果
 * @returns {Number} - 適應性評分
 */
function analyzeAdaptability(answersAnalysis) {
  // 檢查是否有明顯的回答模式
  const wordCounts = answersAnalysis.map(
    (analysis) => analysis.metrics.wordCount,
  );
  const avgWordCount =
    wordCounts.reduce((sum, count) => sum + count, 0) / wordCounts.length;

  // 計算標準差，評估回答長度的變化性
  const variance =
    wordCounts.reduce(
      (sum, count) => sum + Math.pow(count - avgWordCount, 2),
      0,
    ) / wordCounts.length;
  const stdDev = Math.sqrt(variance);
  const variationCoefficient = stdDev / avgWordCount;

  // 檢查結構多樣性
  const structureScores = answersAnalysis.map(
    (analysis) => analysis.scores.structure,
  );
  const avgStructureScore =
    structureScores.reduce((sum, score) => sum + score, 0) /
    structureScores.length;

  // 計算結構評分標準差
  const structureVariance =
    structureScores.reduce(
      (sum, score) => sum + Math.pow(score - avgStructureScore, 2),
      0,
    ) / structureScores.length;
  const structureStdDev = Math.sqrt(structureVariance);

  // 綜合評分
  let score = 70; // 基礎分數

  // 根據回答長度變化性評分
  if (variationCoefficient > 0.4)
    score += 15; // 高變化性，適應不同問題
  else if (variationCoefficient > 0.25) score += 10;
  else if (variationCoefficient < 0.15) score -= 15; // 低變化性，固定模式

  // 根據結構多樣性評分
  if (structureStdDev > 15)
    score += 15; // 高結構變化，適應不同問題類型
  else if (structureStdDev > 10) score += 10;
  else if (structureStdDev < 5) score -= 10; // 低結構變化，固定結構

  return Math.min(100, Math.max(0, score));
}

/**
 * 分析公司研究
 * @param {Array} answersAnalysis - 答案分析結果
 * @returns {Number} - 公司研究評分
 */
function analyzeCompanyResearch(answersAnalysis) {
  let companyMentionCount = 0;

  // 檢查每個答案中是否提及公司
  answersAnalysis.forEach((analysis) => {
    const answer = analysis.answer.toLowerCase();

    // 檢查是否包含公司相關詞彙
    const companyPatterns = [
      "貴公司",
      "您公司",
      "這家公司",
      "公司文化",
      "公司使命",
      "公司價值觀",
      "your company",
      "this company",
      "company culture",
      "company mission",
      "company values",
      "organization",
    ];

    const hasCompanyReference = companyPatterns.some((pattern) =>
      answer.includes(pattern),
    );

    if (hasCompanyReference) {
      companyMentionCount++;
    }
  });

  // 計算公司提及率
  const companyMentionRate = companyMentionCount / answersAnalysis.length;

  // 計算評分
  let score = 50; // 基礎分數

  // 根據公司提及率評分
  if (companyMentionRate >= 0.4) score += 40;
  else if (companyMentionRate >= 0.3) score += 30;
  else if (companyMentionRate >= 0.2) score += 20;
  else if (companyMentionRate >= 0.1) score += 10;
  else score -= 10;

  return Math.min(100, Math.max(0, score));
}

/**
 * 優先排序改進建議
 * @param {Object} suggestions - 改進建議
 * @param {Object} strengthsAndWeaknesses - 強項和弱項
 * @returns {Array} - 優先建議類別
 */
function prioritizeSuggestions(suggestions, strengthsAndWeaknesses) {
  // 收集所有建議並按優先級排序
  const allSuggestions = [];

  // 整理各類別建議
  Object.entries(suggestions).forEach(([category, categorySuggestions]) => {
    categorySuggestions.forEach((suggestion) => {
      allSuggestions.push({
        category,
        area: suggestion.area,
        title: suggestion.title,
        priority: suggestion.priority || "medium",
      });
    });
  });

  // 將弱項納入考慮
  const weaknessCategories = strengthsAndWeaknesses.weaknesses.map(
    (w) => w.category,
  );

  // 調整優先級
  allSuggestions.forEach((suggestion) => {
    const isWeakness = weaknessCategories.includes(suggestion.area);
    if (isWeakness && suggestion.priority !== "high") {
      suggestion.priority = "high";
    }
  });

  // 按優先級排序
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  allSuggestions.sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
  );

  // 取前3個優先類別
  const topPriorities = allSuggestions
    .slice(0, 3)
    .map((suggestion) => ({
      category: suggestion.category,
      area: suggestion.area,
    }));

  return topPriorities;
}

/**
 * 生成頂級改進建議
 * @param {Object} suggestions - 改進建議
 * @param {Array} priorities - 優先建議
 * @param {Object} context - 面試上下文
 * @returns {Array} - 頂級改進建議
 */
function generateTopRecommendations(suggestions, priorities, context) {
  const topRecommendations = [];

  // 為每個優先級生成建議
  priorities.forEach((priority) => {
    const categorySuggestions = suggestions[priority.category];

    // 找到對應的具體建議
    const specificSuggestion = categorySuggestions.find(
      (s) => s.area === priority.area,
    );

    if (specificSuggestion) {
      topRecommendations.push({
        title: specificSuggestion.title,
        suggestion: specificSuggestion.suggestion,
        improvement: specificSuggestion.improvement,
        category: priority.category,
        area: priority.area,
      });
    }
  });

  // 如果建議不足3個，添加一般性建議
  if (topRecommendations.length < 3) {
    const generalSuggestions = [
      {
        title: "準備STAR例子",
        suggestion:
          "提前準備5-7個具體的STAR（情境-任務-行動-結果）例子，涵蓋你的主要成就和經驗。",
        improvement:
          "為不同類型的行為問題準備好例子，確保它們具體、相關且能突顯你的技能。",
        category: "preparation",
        area: "examples",
      },
      {
        title: "研究目標公司",
        suggestion:
          "深入研究目標公司的使命、價值觀、產品、服務、市場地位和最新發展。",
        improvement:
          "在回答中自然引用公司信息，展示你對公司的理解和熱情，以及你如何能為公司帶來價值。",
        category: "preparation",
        area: "company_research",
      },
      {
        title: "增強專業詞彙",
        suggestion: `擴展你在${getIndustryName(context.industry)}行業的專業詞彙庫，掌握核心概念和最新趨勢。`,
        improvement:
          "適當使用專業術語，展示你的知識深度，但確保你完全理解這些術語的含義。",
        category: "keywords",
        area: "keyword_usage",
      },
    ];

    // 添加不與現有建議重複的一般性建議
    generalSuggestions.forEach((suggestion) => {
      if (
        topRecommendations.length < 3 &&
        !topRecommendations.some((r) => r.area === suggestion.area)
      ) {
        topRecommendations.push(suggestion);
      }
    });
  }

  return topRecommendations;
}

/**
 * 獲取行業名稱顯示文本
 * @param {String} industry - 行業代碼
 * @returns {String} - 行業顯示名稱
 */
function getIndustryName(industry) {
  const industryNames = {
    tech: "科技",
    finance: "金融",
    healthcare: "醫療保健",
    education: "教育",
    retail: "零售",
  };

  return industryNames[industry] || "該";
}
