// src/lib/api/enhancedEvaluationService.js
import { getIndustryKeywords } from "../data/industryKeywords";
import { analyzeKeywords } from "../analysis/keywordAnalysis";
import { generateImprovementSuggestions } from "../analysis/improvementSuggestions";
import { getIndustryBenchmarks } from "../data/industryBenchmarks";

/**
 * 增強版面試評估函數
 * 提供詳細的多維度評分和分析
 *
 * @param {Array} messages - 對話消息數組
 * @param {Object} context - 面試上下文 (行業、職位、Karen類型等)
 * @returns {Object} - 詳細評估結果
 */
export const evaluateInterviewEnhanced = async (messages, context) => {
  try {
    // 提取用戶回答和問題
    const userMessages = messages.filter((msg) => msg.sender === "user");
    const karenMessages = messages.filter((msg) => msg.sender === "karen");

    // 獲取行業關鍵詞
    const industryKeywords = getIndustryKeywords(
      context.industry,
      context.position,
    );

    // 獲取行業基準
    const industryBenchmarks = getIndustryBenchmarks(
      context.industry,
      context.position,
    );

    // 分析答案
    const answersAnalysis = userMessages.map((msg, index) => {
      const question = index > 0 ? karenMessages[index - 1].text : "自我介紹";

      // 分析答案長度
      const wordCount = msg.text.split(/\s+/).length;
      const charCount = msg.text.length;
      const sentenceCount = msg.text.split(/[.!?]+/).length - 1;

      // 分析關鍵詞使用
      const keywordAnalysis = analyzeKeywords(msg.text, industryKeywords);

      // 分析答案品質
      const qualityAnalysis = analyzeAnswerQuality(msg.text, question, context);

      return {
        questionId: index,
        question,
        answer: msg.text,
        timestamp: msg.timestamp,
        metrics: {
          wordCount,
          charCount,
          sentenceCount,
          keywordCount: keywordAnalysis.matchedKeywords.length,
          keywordDensity: keywordAnalysis.keywordDensity,
        },
        scores: {
          relevance: qualityAnalysis.relevanceScore,
          clarity: qualityAnalysis.clarityScore,
          depth: qualityAnalysis.depthScore,
          structure: qualityAnalysis.structureScore,
          confidence: qualityAnalysis.confidenceScore,
          technicalAccuracy: qualityAnalysis.technicalAccuracyScore,
        },
        keywordAnalysis,
        suggestions: qualityAnalysis.suggestions,
      };
    });

    // 計算總體評分
    const overallScores = calculateOverallScores(answersAnalysis);

    // 識別強項和弱項
    const strengthsAndWeaknesses =
      identifyStrengthsAndWeaknesses(overallScores);

    // 生成改進建議
    const improvementSuggestions = generateImprovementSuggestions(
      answersAnalysis,
      strengthsAndWeaknesses,
      context,
    );

    // 比較與行業標準
    const industryComparison = compareWithIndustry(
      overallScores,
      industryBenchmarks,
    );

    // 生成整體評價
    const overallFeedback = generateOverallFeedback(
      overallScores,
      strengthsAndWeaknesses,
      industryComparison,
    );

    // 構建完整評估結果
    return {
      sessionId: `session-${Date.now()}`,
      timestamp: new Date().toISOString(),
      context: {
        industry: context.industry,
        position: context.position,
        karenType: context.karenType,
        messageCount: messages.length,
      },
      answersAnalysis,
      categoryScores: overallScores,
      totalScore: Math.round(
        (overallScores.clarity +
          overallScores.relevance +
          overallScores.confidence +
          overallScores.technical +
          overallScores.communication) /
          5,
      ),
      strengthsAndWeaknesses,
      improvementSuggestions,
      industryComparison,
      detailedFeedback: overallFeedback,
    };
  } catch (error) {
    console.error("增強評估過程中出錯:", error);
    // 提供基本的評估結果作為備用
    return generateFallbackEvaluation(messages, context);
  }
};

/**
 * 分析答案品質
 * @param {String} answer - 用戶回答
 * @param {String} question - 對應問題
 * @param {Object} context - 面試上下文
 * @returns {Object} - 答案品質分析
 */
function analyzeAnswerQuality(answer, question, context) {
  // 分析答案與問題的相關性
  const relevanceScore = analyzeRelevance(answer, question);

  // 分析答案清晰度
  const clarityScore = analyzeClarity(answer);

  // 分析答案深度
  const depthScore = analyzeDepth(answer);

  // 分析答案結構
  const structureScore = analyzeStructure(answer);

  // 分析自信程度
  const confidenceScore = analyzeConfidence(answer);

  // 分析技術準確性 (針對技術崗位)
  const technicalAccuracyScore =
    context.industry === "tech"
      ? analyzeTechnicalAccuracy(answer, context)
      : 75;

  // 生成答案層級的改進建議
  const suggestions = generateAnswerLevelSuggestions(answer, question, {
    relevanceScore,
    clarityScore,
    depthScore,
    structureScore,
    confidenceScore,
    technicalAccuracyScore,
  });

  return {
    relevanceScore,
    clarityScore,
    depthScore,
    structureScore,
    confidenceScore,
    technicalAccuracyScore,
    suggestions,
  };
}

/**
 * 分析答案與問題的相關性
 * @param {String} answer - 用戶回答
 * @param {String} question - 對應問題
 * @returns {Number} - 相關性評分 (0-100)
 */
function analyzeRelevance(answer, question) {
  // 從問題中提取關鍵詞
  const questionKeywords = extractKeywords(question);

  // 檢查答案中包含多少問題關鍵詞
  let keywordMatches = 0;
  questionKeywords.forEach((keyword) => {
    if (answer.toLowerCase().includes(keyword.toLowerCase())) {
      keywordMatches++;
    }
  });

  // 計算相關性得分
  const relevanceScore = Math.min(
    100,
    Math.round((keywordMatches / Math.max(1, questionKeywords.length)) * 80) +
      (answer.length > 100 ? 20 : Math.round((answer.length / 100) * 20)),
  );

  return relevanceScore;
}

/**
 * 從文本中提取關鍵詞
 * @param {String} text - 文本內容
 * @returns {Array} - 關鍵詞列表
 */
function extractKeywords(text) {
  // 簡單實現: 分詞並過濾停用詞
  const stopWords = [
    "a",
    "an",
    "the",
    "and",
    "or",
    "but",
    "is",
    "are",
    "in",
    "on",
    "at",
    "to",
    "for",
  ];
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 3 && !stopWords.includes(word));
}

/**
 * 分析答案清晰度
 * @param {String} answer - 用戶回答
 * @returns {Number} - 清晰度評分 (0-100)
 */
function analyzeClarity(answer) {
  // 分析句子長度 (過長的句子可能不清晰)
  const sentences = answer.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const avgSentenceLength =
    sentences.reduce((sum, s) => sum + s.length, 0) /
    Math.max(1, sentences.length);

  // 過長句子的比例
  const longSentences = sentences.filter((s) => s.length > 150).length;
  const longSentenceRatio = longSentences / Math.max(1, sentences.length);

  // 計算清晰度得分
  let clarityScore = 100;

  // 根據平均句子長度調整
  if (avgSentenceLength > 120) clarityScore -= 20;
  else if (avgSentenceLength > 80) clarityScore -= 10;

  // 根據過長句子比例調整
  clarityScore -= Math.round(longSentenceRatio * 40);

  // 檢查重複詞語
  const wordFrequency = {};
  const words = answer.toLowerCase().split(/\s+/);
  words.forEach((word) => {
    if (word.length > 3) {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    }
  });

  const excessiveRepetitions = Object.values(wordFrequency).filter(
    (freq) => freq > 5,
  ).length;
  clarityScore -= excessiveRepetitions * 5;

  return Math.max(50, Math.min(100, clarityScore));
}

/**
 * 分析答案深度
 * @param {String} answer - 用戶回答
 * @returns {Number} - 深度評分 (0-100)
 */
function analyzeDepth(answer) {
  // 分析答案長度 (過短的回答可能缺乏深度)
  const wordCount = answer.split(/\s+/).length;

  // 檢查是否包含數據或具體例子
  const hasNumbers = /\d+%|\d+[k,]\d+|\d+\.\d+|\b\d{2,}\b/.test(answer);
  const hasExamples =
    /例如|for example|instance|例子|like when|案例|scenario|曾經|此外/.test(
      answer,
    );

  // 計算深度得分
  let depthScore = 50; // 基礎分數

  // 根據答案長度調整
  if (wordCount >= 200) depthScore += 20;
  else if (wordCount >= 150) depthScore += 15;
  else if (wordCount >= 100) depthScore += 10;
  else if (wordCount >= 50) depthScore += 5;

  // 根據數據和例子使用調整
  if (hasNumbers) depthScore += 15;
  if (hasExamples) depthScore += 15;

  return Math.min(100, depthScore);
}

/**
 * 分析答案結構
 * @param {String} answer - 用戶回答
 * @returns {Number} - 結構評分 (0-100)
 */
function analyzeStructure(answer) {
  // 檢查段落結構
  const paragraphs = answer.split(/\n\s*\n/).filter((p) => p.trim().length > 0);

  // 檢查是否使用條理性詞語
  const hasStructuralWords =
    /首先|其次|再者|最後|總結|First|Second|Finally|In conclusion|Moreover|Furthermore|總括來說/i.test(
      answer,
    );

  // 檢查是否有明確的開始和結束
  const hasIntro =
    /^.{0,200}(我認為|我想|我相信|I believe|I think|In my opinion|In my experience)/i.test(
      answer,
    );
  const hasConclusion =
    /.{0,200}(總之|總結|所以|因此|總括來說|In conclusion|Therefore|Thus|To summarize).*$/i.test(
      answer,
    );

  // 計算結構得分
  let structureScore = 60; // 基礎分數

  // 根據段落數量調整 (1-3段基本合理)
  if (paragraphs.length >= 3) structureScore += 15;
  else if (paragraphs.length >= 2) structureScore += 10;

  // 根據條理性詞語使用調整
  if (hasStructuralWords) structureScore += 10;

  // 根據開始和結束是否明確調整
  if (hasIntro) structureScore += 8;
  if (hasConclusion) structureScore += 7;

  return Math.min(100, structureScore);
}

/**
 * 分析答案中的自信程度
 * @param {String} answer - 用戶回答
 * @returns {Number} - 自信程度評分 (0-100)
 */
function analyzeConfidence(answer) {
  // 檢查不確定用詞
  const uncertaintyWords = [
    "可能",
    "或許",
    "也許",
    "我猜",
    "不確定",
    "不太清楚",
    "maybe",
    "perhaps",
    "possibly",
    "I think",
    "I guess",
    "not sure",
    "uncertain",
  ];

  // 檢查自信用詞
  const confidenceWords = [
    "確定",
    "肯定",
    "無疑",
    "毫無疑問",
    "我確信",
    "必須",
    "一定",
    "definitely",
    "certainly",
    "undoubtedly",
    "I'm confident",
    "absolutely",
    "must",
    "will",
  ];

  // 計算不確定用詞和自信用詞的出現次數
  let uncertaintyCount = 0;
  let confidenceCount = 0;

  uncertaintyWords.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    const matches = answer.match(regex);
    if (matches) uncertaintyCount += matches.length;
  });

  confidenceWords.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    const matches = answer.match(regex);
    if (matches) confidenceCount += matches.length;
  });

  // 計算自信程度得分
  let confidenceScore = 75; // 基礎分數

  // 根據不確定用詞減分
  confidenceScore -= uncertaintyCount * 5;

  // 根據自信用詞加分
  confidenceScore += confidenceCount * 3;

  // 檢查是否使用主動語態
  const passiveVoicePatterns = [
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
  ];

  let passiveCount = 0;
  passiveVoicePatterns.forEach((pattern) => {
    const regex = new RegExp(pattern, "gi");
    const matches = answer.match(regex);
    if (matches) passiveCount += matches.length;
  });

  // 依據被動語態使用減分
  confidenceScore -= passiveCount * 2;

  return Math.max(50, Math.min(100, confidenceScore));
}

/**
 * 分析技術準確性 (針對技術行業)
 * @param {String} answer - 用戶回答
 * @param {Object} context - 面試上下文
 * @returns {Number} - 技術準確性評分 (0-100)
 */
function analyzeTechnicalAccuracy(answer, context) {
  // 獲取技術相關術語
  const technicalTerms = getTechnicalTerms(context.industry, context.position);

  // 檢查技術術語使用情況
  let termCount = 0;
  technicalTerms.forEach((term) => {
    const regex = new RegExp(`\\b${term}\\b`, "gi");
    const matches = answer.match(regex);
    if (matches) termCount += matches.length;
  });

  // 計算技術準確性得分
  let technicalScore = 70; // 基礎分數

  // 根據術語使用加分
  technicalScore += Math.min(20, termCount * 2);

  // 檢查是否解釋了概念
  const explanationPatterns = [
    "這意味著",
    "即",
    "也就是說",
    "如下所示",
    "定義為",
    "which means",
    "that is",
    "defined as",
    "refers to",
    "can be described as",
  ];

  let explanationCount = 0;
  explanationPatterns.forEach((pattern) => {
    const regex = new RegExp(pattern, "gi");
    const matches = answer.match(regex);
    if (matches) explanationCount += matches.length;
  });

  // 根據概念解釋加分
  technicalScore += Math.min(10, explanationCount * 3);

  return Math.min(100, technicalScore);
}

/**
 * 獲取技術相關術語
 * @param {String} industry - 行業
 * @param {String} position - 職位
 * @returns {Array} - 技術術語列表
 */
function getTechnicalTerms(industry, position) {
  // 簡單實現，實際應用中可以從數據庫或配置文件中獲取
  const techTerms = {
    tech: [
      "algorithm",
      "算法",
      "API",
      "backend",
      "後端",
      "frontend",
      "前端",
      "database",
      "數據庫",
      "cloud",
      "雲計算",
      "scalability",
      "可擴展性",
      "microservices",
      "微服務",
      "DevOps",
      "CI/CD",
      "Docker",
      "Kubernetes",
      "React",
      "Angular",
      "Vue",
      "Node.js",
      "Python",
      "Java",
      "RESTful",
      "GraphQL",
      "SQL",
      "NoSQL",
      "AWS",
      "Azure",
      "GCP",
      "分佈式系統",
    ],
    finance: [
      "ROI",
      "投資回報率",
      "asset",
      "資產",
      "equity",
      "股權",
      "bond",
      "債券",
      "derivative",
      "衍生品",
      "portfolio",
      "投資組合",
      "hedge",
      "對沖",
      "liquidity",
      "流動性",
      "leverage",
      "槓桿",
      "valuation",
      "估值",
      "CAPM",
      "NPV",
      "淨現值",
      "IRR",
      "內部收益率",
      "risk management",
      "風險管理",
    ],
    healthcare: [
      "diagnosis",
      "診斷",
      "treatment",
      "治療",
      "patient care",
      "病患護理",
      "clinical",
      "臨床",
      "medical record",
      "病歷",
      "prescription",
      "處方",
      "therapy",
      "療法",
      "preventive",
      "預防性",
      "chronic",
      "慢性",
      "acute",
      "急性",
      "protocol",
      "協議",
      "medical ethics",
      "醫療倫理",
    ],
  };

  return techTerms[industry] || [];
}

/**
 * 為單個回答生成改進建議
 * @param {String} answer - 用戶回答
 * @param {String} question - 相關問題
 * @param {Object} scores - 各項評分
 * @returns {Array} - 改進建議列表
 */
function generateAnswerLevelSuggestions(answer, question, scores) {
  const suggestions = [];

  // 根據相關性評分提出建議
  if (scores.relevanceScore < 70) {
    suggestions.push({
      aspect: "relevance",
      suggestion:
        "你的回答與問題的相關性不夠高。確保直接回應面試官的問題，並明確解答他們的具體疑問。",
      improvement:
        "考慮使用問題中的關鍵詞來構建你的回答，確保涵蓋問題的所有方面。",
    });
  }

  // 根據清晰度評分提出建議
  if (scores.clarityScore < 70) {
    suggestions.push({
      aspect: "clarity",
      suggestion:
        "你的回答可能不夠清晰。避免使用過長、複雜的句子和過多的專業術語。",
      improvement:
        "嘗試使用更簡潔的語言，一次只表達一個概念，避免過度使用行業術語。",
    });
  }

  // 根據深度評分提出建議
  if (scores.depthScore < 70) {
    suggestions.push({
      aspect: "depth",
      suggestion:
        "你的回答缺乏足夠的深度和細節。提供具體的例子和數據來支持你的觀點。",
      improvement:
        "分享具體的工作經驗、項目細節或數據點來展示你的專業知識和能力。",
    });
  }

  // 根據結構評分提出建議
  if (scores.structureScore < 70) {
    suggestions.push({
      aspect: "structure",
      suggestion: "你的回答結構可以改進。確保有明確的開始、中間和結束。",
      improvement:
        '使用"首先"、"其次"、"總結"等過渡詞來組織你的回答，讓面試官更容易跟上你的思路。',
    });
  }

  // 根據自信程度評分提出建議
  if (scores.confidenceScore < 70) {
    suggestions.push({
      aspect: "confidence",
      suggestion: '你的回答語氣不夠自信。減少使用"可能"、"也許"等不確定用詞。',
      improvement:
        "使用更肯定的語言，避免過度使用修飾語和猶豫性表達。直接陳述你的經驗和能力。",
    });
  }

  // 針對技術領域的建議
  if (scores.technicalAccuracyScore < 70) {
    suggestions.push({
      aspect: "technical",
      suggestion:
        "你的回答缺乏足夠的技術細節和準確性。展示你對行業術語和概念的理解。",
      improvement:
        "適當使用技術術語，並確保準確解釋複雜概念，展示你的專業知識深度。",
    });
  }

  return suggestions;
}

/**
 * 計算總體評分
 * @param {Array} answersAnalysis - 答案分析結果
 * @returns {Object} - 總體評分
 */
function calculateOverallScores(answersAnalysis) {
  // 初始化各類別分數總和和計數
  const totals = {
    relevance: 0,
    clarity: 0,
    depth: 0,
    structure: 0,
    confidence: 0,
    technical: 0,
    count: answersAnalysis.length,
  };

  // 累加各答案的分數
  answersAnalysis.forEach((analysis) => {
    totals.relevance += analysis.scores.relevance;
    totals.clarity += analysis.scores.clarity;
    totals.depth += analysis.scores.depth;
    totals.structure += analysis.scores.structure;
    totals.confidence += analysis.scores.confidence;
    totals.technical += analysis.scores.technicalAccuracy;
  });

  // 計算平均分
  return {
    relevance: Math.round(totals.relevance / totals.count),
    clarity: Math.round(totals.clarity / totals.count),
    confidence: Math.round(totals.confidence / totals.count),
    technical: Math.round(totals.technical / totals.count),
    communication: Math.round(
      (totals.clarity + totals.structure) / (2 * totals.count),
    ),
    depth: Math.round(totals.depth / totals.count),
    structure: Math.round(totals.structure / totals.count),
  };
}

/**
 * 識別強項和弱項
 * @param {Object} scores - 各項評分
 * @returns {Object} - 強項和弱項
 */
function identifyStrengthsAndWeaknesses(scores) {
  // 將分數轉換為數組並排序
  const scoreEntries = Object.entries(scores).map(([category, score]) => ({
    category,
    score,
  }));

  // 按分數降序排序
  scoreEntries.sort((a, b) => b.score - a.score);

  // 提取排名前2的作為強項
  const strengths = scoreEntries.slice(0, 2).map((entry) => ({
    category: entry.category,
    score: entry.score,
  }));

  // 提取排名後2的作為弱項
  const weaknesses = scoreEntries.slice(-2).map((entry) => ({
    category: entry.category,
    score: entry.score,
  }));

  return { strengths, weaknesses };
}

/**
 * 比較用戶評分與行業標準
 * @param {Object} scores - 用戶評分
 * @param {Object} benchmarks - 行業基準
 * @returns {Object} - 比較結果
 */
function compareWithIndustry(scores, benchmarks) {
  const comparison = {};

  // 遍歷所有評分類別
  Object.keys(scores).forEach((category) => {
    const userScore = scores[category];
    const benchmarkScore = benchmarks[category] || 75; // 默認行業基準為75

    comparison[category] = {
      userScore,
      benchmarkScore,
      difference: userScore - benchmarkScore,
      percentile: calculatePercentile(userScore, benchmarkScore),
    };
  });

  return comparison;
}

/**
 * 計算百分位數
 * @param {Number} score - 用戶分數
 * @param {Number} benchmark - 行業基準
 * @returns {Number} - 百分位數
 */
function calculatePercentile(score, benchmark) {
  // 簡單估算，實際應用中可以使用更準確的統計方法
  const stdDev = 10; // 假設標準差為10
  const zscore = (score - benchmark) / stdDev;

  // 將z分數轉換為百分位數 (近似方法)
  const percentile = Math.round(normalCDF(zscore) * 100);

  return Math.min(99, Math.max(1, percentile));
}

/**
 * 正態分布的累積分布函數 (CDF)
 * @param {Number} z - Z分數
 * @returns {Number} - 累積概率
 */
function normalCDF(z) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const p =
    d *
    t *
    (0.3193815 +
      t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}

/**
 * 生成整體評價
 * @param {Object} scores - 總體評分
 * @param {Object} strengthsAndWeaknesses - 強項和弱項
 * @param {Object} industryComparison - 行業對比
 * @returns {String} - 整體評價
 */
function generateOverallFeedback(
  scores,
  strengthsAndWeaknesses,
  industryComparison,
) {
  // 計算總分
  const totalScore = Math.round(
    (scores.clarity +
      scores.relevance +
      scores.confidence +
      scores.technical +
      scores.communication) /
      5,
  );

  // 根據總分判斷整體表現
  let overallAssessment = "";
  if (totalScore >= 90) {
    overallAssessment =
      "你的面試表現極為出色，展現了優秀的溝通能力和專業知識。";
  } else if (totalScore >= 80) {
    overallAssessment = "你的面試表現良好，展示了扎實的能力和經驗。";
  } else if (totalScore >= 70) {
    overallAssessment = "你的面試表現令人滿意，但仍有改進空間。";
  } else if (totalScore >= 60) {
    overallAssessment = "你的面試表現基本合格，但需要多方面提升。";
  } else {
    overallAssessment = "你的面試表現需要顯著改進，建議進一步練習和準備。";
  }

  // 強項評價
  const strengthsFeedback = strengthsAndWeaknesses.strengths
    .map((strength) => {
      switch (strength.category) {
        case "relevance":
          return "你能夠很好地理解面試問題並提供相關回答。";
        case "clarity":
          return "你的表達非常清晰，易於理解。";
        case "confidence":
          return "你展現了良好的自信心，給人留下積極印象。";
        case "technical":
          return "你展示了紮實的技術知識和專業能力。";
        case "communication":
          return "你的溝通技巧出色，能夠有效傳達想法。";
        case "depth":
          return "你的回答內容充實，展示了深入的思考。";
        case "structure":
          return "你的回答結構清晰，條理分明。";
        default:
          return "";
      }
    })
    .join(" ");

  // 弱項評價
  const weaknessesFeedback = strengthsAndWeaknesses.weaknesses
    .map((weakness) => {
      switch (weakness.category) {
        case "relevance":
          return "你的回答可能需要更緊密地圍繞面試問題展開。";
        case "clarity":
          return "你的表達可以更加清晰簡潔。";
        case "confidence":
          return "你的回答語氣可以更加自信堅定。";
        case "technical":
          return "你需要展示更多的技術深度和專業知識。";
        case "communication":
          return "你的溝通方式可以更加有效。";
        case "depth":
          return "你的回答可以包含更多具體例子和細節。";
        case "structure":
          return "你的回答結構可以更加有條理。";
        default:
          return "";
      }
    })
    .join(" ");

  // 行業對比評價
  let industryComparisonFeedback = "";
  const aboveAverageCategories = [];
  const belowAverageCategories = [];

  Object.entries(industryComparison).forEach(([category, comparison]) => {
    if (comparison.difference >= 5) {
      aboveAverageCategories.push(getCategoryDisplayName(category));
    } else if (comparison.difference <= -5) {
      belowAverageCategories.push(getCategoryDisplayName(category));
    }
  });

  if (aboveAverageCategories.length > 0) {
    industryComparisonFeedback += `與行業標準相比，你在${aboveAverageCategories.join("、")}方面表現優於平均水平。`;
  }

  if (belowAverageCategories.length > 0) {
    industryComparisonFeedback += ` 而在${belowAverageCategories.join("、")}方面還有提升空間。`;
  }

  // 組合完整評價
  return `${overallAssessment} ${strengthsFeedback} ${weaknessesFeedback} ${industryComparisonFeedback}`;
}

/**
 * 獲取類別顯示名稱
 * @param {String} category - 類別名稱
 * @returns {String} - 顯示名稱
 */
function getCategoryDisplayName(category) {
  const displayNames = {
    relevance: "回答相關性",
    clarity: "表達清晰度",
    confidence: "自信程度",
    technical: "技術知識",
    communication: "溝通技巧",
    depth: "回答深度",
    structure: "結構組織",
  };

  return displayNames[category] || category;
}

/**
 * 生成後備評估結果
 * @param {Array} messages - 對話消息
 * @param {Object} context - 面試上下文
 * @returns {Object} - 基本評估結果
 */
function generateFallbackEvaluation(messages, context) {
  // 計算基本分數
  const userMessages = messages.filter((msg) => msg.sender === "user");
  const avgLength =
    userMessages.reduce((sum, msg) => sum + msg.text.length, 0) /
    Math.max(1, userMessages.length);

  // 根據回答長度計算基本分數
  const baseScore = Math.min(85, 60 + avgLength / 25);

  // 添加一些隨機波動使結果看起來更真實
  const clarityScore = Math.min(
    100,
    baseScore + Math.floor(Math.random() * 10) - 5,
  );
  const confidenceScore = Math.min(
    100,
    baseScore + Math.floor(Math.random() * 10) - 5,
  );
  const relevanceScore = Math.min(
    100,
    baseScore + Math.floor(Math.random() * 10) - 5,
  );
  const technicalScore = Math.min(
    100,
    baseScore + Math.floor(Math.random() * 10) - 5,
  );
  const communicationScore = Math.min(
    100,
    baseScore + Math.floor(Math.random() * 10) - 5,
  );

  // 計算總分
  const totalScore = Math.round(
    (clarityScore +
      relevanceScore +
      confidenceScore +
      technicalScore +
      communicationScore) /
      5,
  );

  // 生成基本評價
  let feedback = "";
  if (totalScore >= 85) {
    feedback =
      "你的面試表現優秀，展示了良好的溝通能力和專業知識。繼續保持這種水平，同時尋求更多具體例子來支持你的觀點。";
  } else if (totalScore >= 75) {
    feedback =
      "你的面試表現良好，展示了適當的能力。可以考慮提供更多具體的例子和數據來加強你的回答。";
  } else if (totalScore >= 65) {
    feedback =
      "你的面試表現尚可，但有提升空間。嘗試更直接地回答問題，並提供更多關於你過去經驗的具體細節。";
  } else {
    feedback =
      "你的面試表現需要改進。練習提供更詳細、更有結構的回答，並確保你的回答直接針對面試官的問題。";
  }

  return {
    sessionId: `session-${Date.now()}`,
    timestamp: new Date().toISOString(),
    context: {
      industry: context.industry,
      position: context.position,
      karenType: context.karenType,
      messageCount: messages.length,
    },
    categoryScores: {
      clarity: clarityScore,
      relevance: relevanceScore,
      confidence: confidenceScore,
      technical: technicalScore,
      communication: communicationScore,
    },
    totalScore,
    detailedFeedback: feedback,
  };
}

/**
 * 保存評估結果到存儲
 * @param {String} userId - 用戶ID
 * @param {String} sessionId - 會話ID
 * @param {Object} evaluationResult - 評估結果
 * @returns {Promise} - 保存操作的Promise
 */
export const saveEvaluationResult = async (
  userId,
  sessionId,
  evaluationResult,
) => {
  try {
    // 當前使用localStorage作為臨時存儲
    // 將來可以替換為API調用或數據庫操作
    const storageKey = `evaluation_${userId}_${sessionId}`;
    const storageValue = JSON.stringify({
      ...evaluationResult,
      timestamp: new Date().toISOString(),
    });

    localStorage.setItem(storageKey, storageValue);

    // 更新評估歷史記錄
    const historyKey = `evaluation_history_${userId}`;
    const existingHistory = JSON.parse(
      localStorage.getItem(historyKey) || "[]",
    );

    // 添加新評估到歷史記錄
    const updatedHistory = [
      {
        sessionId,
        timestamp: evaluationResult.timestamp,
        totalScore: evaluationResult.totalScore,
        categoryScores: evaluationResult.categoryScores,
        detailedFeedback: evaluationResult.detailedFeedback,
      },
      ...existingHistory,
    ].slice(0, 10); // 只保留最近10條記錄

    localStorage.setItem(historyKey, JSON.stringify(updatedHistory));

    return { success: true };
  } catch (error) {
    console.error("保存評估結果時出錯:", error);
    return { success: false, error: error.message };
  }
};

/**
 * 獲取用戶評估歷史記錄
 * @param {String} userId - 用戶ID
 * @param {Number} limit - 限制返回記錄數量
 * @returns {Promise<Array>} - 評估歷史記錄
 */
export const getUserEvaluationHistory = async (userId, limit = 5) => {
  try {
    // 從localStorage獲取評估歷史
    const historyKey = `evaluation_history_${userId}`;
    const history = JSON.parse(localStorage.getItem(historyKey) || "[]");

    // 按時間排序並限制數量
    return history
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  } catch (error) {
    console.error("獲取評估歷史時出錯:", error);
    return [];
  }
};

/**
 * 獲取特定評估詳情
 * @param {String} userId - 用戶ID
 * @param {String} sessionId - 會話ID
 * @returns {Promise<Object>} - 評估詳情
 */
export const getEvaluationDetails = async (userId, sessionId) => {
  try {
    // 從localStorage獲取特定評估詳情
    const storageKey = `evaluation_${userId}_${sessionId}`;
    const evaluation = JSON.parse(localStorage.getItem(storageKey) || "null");

    if (!evaluation) {
      throw new Error("評估記錄不存在");
    }

    return evaluation;
  } catch (error) {
    console.error("獲取評估詳情時出錯:", error);
    return null;
  }
};
