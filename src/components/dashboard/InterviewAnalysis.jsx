import React, { useState, useEffect } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const InterviewAnalysis = ({ interviewId }) => {
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchAnalysis = async () => {
      setIsLoading(true);

      try {
        // In a real implementation, this would fetch data from an API
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Mock data
        const mockAnalysis = {
          id: interviewId || "mock-interview-id",
          timestamp: new Date().toISOString(),
          duration: "25分鐘",
          questionCount: 8,
          overallScore: 84,
          industry: "科技",
          karenType: "細節型",
          categoryScores: {
            relevance: 82, // 回答相關性
            clarity: 85, // 表達清晰度
            confidence: 78, // 自信程度
            technical: 88, // 技術知識
            communication: 83, // 溝通技巧
            structure: 80, // 結構組織
            example: 75, // 舉例能力
          },
          strengths: [
            {
              category: "技術知識",
              score: 88,
              detail: "展示了深厚的領域專業知識",
            },
            { category: "表達清晰度", score: 85, detail: "條理清晰，邏輯性強" },
            { category: "溝通技巧", score: 83, detail: "良好的表達和溝通能力" },
          ],
          weaknesses: [
            {
              category: "舉例能力",
              score: 75,
              detail: "缺乏足夠具體的實例支持論點",
            },
            {
              category: "自信程度",
              score: 78,
              detail: "在某些問題上表現出不確定性",
            },
          ],
          questionAnalysis: [
            {
              question: "請介紹一下你自己和你的背景經驗",
              scoreBreakdown: {
                relevance: 85,
                clarity: 88,
                confidence: 82,
                structure: 84,
              },
              feedback:
                "良好的自我介紹，清晰地展示了相關經驗，但可以更加突出與職位相關的成就。",
              keywords: ["經驗", "背景", "技能", "項目"],
            },
            {
              question: "描述一個你解決過的技術挑戰",
              scoreBreakdown: {
                relevance: 86,
                clarity: 83,
                technical: 90,
                example: 78,
              },
              feedback:
                "技術描述非常專業，但例子可以更加具體，包含更多細節和結果數據。",
              keywords: ["問題解決", "技術", "挑戰", "解決方案"],
            },
            // More questions would be here
          ],
          improvementSuggestions: [
            {
              category: "舉例能力",
              suggestions: [
                "準備3-5個結構化的STAR模式例子",
                "在例子中加入具體的數據和指標",
                "確保例子與面試職位高度相關",
              ],
            },
            {
              category: "自信表達",
              suggestions: [
                "減少使用「可能」「也許」等不確定詞語",
                "練習使用肯定的語氣表達觀點",
                "準備更充分的專業知識以增強自信",
              ],
            },
          ],
          keywordAnalysis: {
            totalKeywords: 24,
            industryKeywords: 14,
            technicalKeywords: 10,
            keywordDensity: "8.5%",
            mostUsedKeywords: [
              "系統設計",
              "用戶體驗",
              "架構",
              "效能優化",
              "團隊協作",
            ],
          },
        };

        setAnalysis(mockAnalysis);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching interview analysis:", error);
        setIsLoading(false);
      }
    };

    fetchAnalysis();
  }, [interviewId]);

  if (isLoading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-sm w-full">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
          <div className="h-40 bg-gray-200 rounded mb-6"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
        <div className="text-center text-gray-500 mt-4">加載分析報告中...</div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-sm w-full">
        <div className="text-center p-6">
          <div className="text-3xl text-gray-400 mb-2">📋</div>
          <h3 className="text-lg font-medium text-gray-600">未找到面試分析</h3>
          <p className="text-gray-500 mt-2">無法獲取此面試的分析數據。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm w-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">面試表現分析</h2>
            <p className="text-gray-600 text-sm">
              {new Date(analysis.timestamp).toLocaleDateString("zh-TW")} |{" "}
              {analysis.industry}產業 | {analysis.karenType}面試官
            </p>
          </div>
          <div className="bg-amber-100 text-amber-800 font-bold rounded-full h-16 w-16 flex items-center justify-center text-xl">
            {analysis.overallScore}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 px-4">
        <nav className="flex -mb-px">
          <button
            className={`py-3 px-4 text-sm font-medium border-b-2 ${
              activeTab === "overview"
                ? "border-amber-500 text-amber-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            總覽
          </button>
          <button
            className={`py-3 px-4 text-sm font-medium border-b-2 ${
              activeTab === "questions"
                ? "border-amber-500 text-amber-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("questions")}
          >
            問題分析
          </button>
          <button
            className={`py-3 px-4 text-sm font-medium border-b-2 ${
              activeTab === "keywords"
                ? "border-amber-500 text-amber-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("keywords")}
          >
            關鍵詞分析
          </button>
          <button
            className={`py-3 px-4 text-sm font-medium border-b-2 ${
              activeTab === "improvements"
                ? "border-amber-500 text-amber-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("improvements")}
          >
            改進建議
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Interview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">總時長</p>
                <p className="text-lg font-bold text-gray-800">
                  {analysis.duration}
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">問題數量</p>
                <p className="text-lg font-bold text-gray-800">
                  {analysis.questionCount}題
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">行業基準</p>
                <p className="text-lg font-bold text-amber-600">高於7%</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">整體評級</p>
                <p className="text-lg font-bold text-green-600">良好</p>
              </div>
            </div>

            {/* Skill Radar */}
            <div>
              <h3 className="text-base font-medium text-gray-800 mb-3">
                能力評分分佈
              </h3>
              <div
                className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                style={{ height: "300px" }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius="70%" data={prepareRadarData()}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis domain={[0, 100]} />
                    <Radar
                      name="分數"
                      dataKey="A"
                      stroke="#d8365d"
                      fill="#d8365d"
                      fillOpacity={0.6}
                    />
                    <Tooltip
                      formatter={(value) => [`${value}分`, ""]}
                      contentStyle={{
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        border: "none",
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Strengths and Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-base font-medium text-gray-800 mb-3">
                  優勢
                </h3>
                <div className="space-y-3">
                  {analysis.strengths.map((strength, index) => (
                    <div
                      key={index}
                      className="bg-green-50 border border-green-100 rounded-lg p-3"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-gray-800">
                          {strength.category}
                        </span>
                        <span className="text-green-600 font-bold">
                          {strength.score}分
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{strength.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-base font-medium text-gray-800 mb-3">
                  需要改進
                </h3>
                <div className="space-y-3">
                  {analysis.weaknesses.map((weakness, index) => (
                    <div
                      key={index}
                      className="bg-red-50 border border-red-100 rounded-lg p-3"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-gray-800">
                          {weakness.category}
                        </span>
                        <span className="text-red-600 font-bold">
                          {weakness.score}分
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{weakness.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Questions Tab */}
        {activeTab === "questions" && (
          <div className="space-y-6">
            <h3 className="text-base font-medium text-gray-800 mb-3">
              問題分析
            </h3>

            <div className="space-y-6">
              {analysis.questionAnalysis.map((qa, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex items-start">
                    <div className="bg-amber-100 text-amber-800 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mr-3">
                      Q{index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 mb-2">
                        {qa.question}
                      </h4>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                        {Object.entries(qa.scoreBreakdown).map(
                          ([key, value], i) => (
                            <div
                              key={i}
                              className="bg-white rounded border border-gray-200 p-2"
                            >
                              <p className="text-xs text-gray-500 mb-1">
                                {getScoreLabel(key)}
                              </p>
                              <div className="flex justify-between items-center">
                                <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                                  <div
                                    className={`rounded-full h-2 ${getScoreColor(value)}`}
                                    style={{ width: `${value}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs font-bold">
                                  {value}
                                </span>
                              </div>
                            </div>
                          ),
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mb-2">
                        {qa.feedback}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {qa.keywords.map((keyword, i) => (
                          <span
                            key={i}
                            className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs text-gray-700"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Keywords Tab */}
        {activeTab === "keywords" && (
          <div className="space-y-6">
            <h3 className="text-base font-medium text-gray-800 mb-3">
              關鍵詞分析
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  關鍵詞統計
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">總關鍵詞數</p>
                    <p className="text-lg font-bold text-gray-800">
                      {analysis.keywordAnalysis.totalKeywords}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">行業專業詞彙</p>
                    <p className="text-lg font-bold text-gray-800">
                      {analysis.keywordAnalysis.industryKeywords}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">技術詞彙</p>
                    <p className="text-lg font-bold text-gray-800">
                      {analysis.keywordAnalysis.technicalKeywords}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">關鍵詞密度</p>
                    <p className="text-lg font-bold text-gray-800">
                      {analysis.keywordAnalysis.keywordDensity}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  常用關鍵詞
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywordAnalysis.mostUsedKeywords.map(
                    (keyword, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg border border-gray-200 px-3 py-2 text-sm"
                        style={{
                          fontSize: `${Math.max(0.8, 1 + (5 - index) * 0.1)}rem`,
                          opacity: Math.max(0.6, 1 - index * 0.1),
                        }}
                      >
                        {keyword}
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                關鍵詞建議
              </h4>

              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                  <h5 className="font-medium text-amber-800 mb-2">
                    可以增加的關鍵詞
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "雲架構",
                      "微服務",
                      "敏捷開發",
                      "DevOps",
                      "容器化",
                      "持續集成",
                    ].map((term, i) => (
                      <span
                        key={i}
                        className="inline-block bg-white border border-amber-200 rounded-full px-2 py-1 text-xs text-amber-700"
                      >
                        {term}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                  <h5 className="font-medium text-blue-800 mb-2">
                    行業熱門詞彙
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "數據驅動",
                      "人工智能",
                      "使用者體驗",
                      "全棧開發",
                      "高可用性",
                    ].map((term, i) => (
                      <span
                        key={i}
                        className="inline-block bg-white border border-blue-200 rounded-full px-2 py-1 text-xs text-blue-700"
                      >
                        {term}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Improvements Tab */}
        {activeTab === "improvements" && (
          <div className="space-y-6">
            <h3 className="text-base font-medium text-gray-800 mb-3">
              改進建議
            </h3>

            <div className="space-y-4">
              {analysis.improvementSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg border border-gray-200 p-4"
                >
                  <h4 className="font-medium text-gray-800 mb-3">
                    {suggestion.category}
                  </h4>

                  <ul className="space-y-2">
                    {suggestion.suggestions.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <div className="text-amber-500 mr-2">•</div>
                        <span className="text-sm text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                <h4 className="font-medium text-blue-800 mb-3">練習建議</h4>

                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="text-blue-500 mr-2">•</div>
                    <span className="text-sm text-gray-700">
                      繼續使用Karen AI練習面試，特別關注「
                      {analysis.weaknesses[0]?.category || "舉例能力"}」方面
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="text-blue-500 mr-2">•</div>
                    <span className="text-sm text-gray-700">
                      嘗試使用不同類型的面試官，尤其是「質疑型」面試官以加強應對壓力的能力
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="text-blue-500 mr-2">•</div>
                    <span className="text-sm text-gray-700">
                      錄製自己的回答並回聽，特別注意觀察語速、停頓和語調
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 flex justify-between items-center">
        <button className="text-gray-600 hover:text-gray-800 text-sm">
          返回面試記錄
        </button>

        <div className="flex gap-2">
          <button className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-50">
            導出報告
          </button>
          <button className="bg-gradient-to-r from-amber-500 to-orange-400 text-white px-3 py-1.5 rounded text-sm hover:shadow-md transition-shadow">
            開始新面試
          </button>
        </div>
      </div>
    </div>
  );

  // Helper function to prepare radar chart data
  function prepareRadarData() {
    return [
      { subject: "相關性", A: analysis.categoryScores.relevance },
      { subject: "清晰度", A: analysis.categoryScores.clarity },
      { subject: "自信度", A: analysis.categoryScores.confidence },
      { subject: "技術性", A: analysis.categoryScores.technical },
      { subject: "溝通力", A: analysis.categoryScores.communication },
      { subject: "結構性", A: analysis.categoryScores.structure },
      { subject: "舉例力", A: analysis.categoryScores.example },
    ];
  }

  // Helper function to get score label
  function getScoreLabel(key) {
    const labels = {
      relevance: "相關性",
      clarity: "清晰度",
      confidence: "自信度",
      technical: "技術性",
      communication: "溝通力",
      structure: "結構性",
      example: "舉例力",
    };

    return labels[key] || key;
  }

  // Helper function to get score color
  function getScoreColor(value) {
    if (value >= 85) return "bg-green-600";
    if (value >= 75) return "bg-amber-500";
    if (value >= 65) return "bg-orange-500";
    return "bg-red-500";
  }
};

export default InterviewAnalysis;
