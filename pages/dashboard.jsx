import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Layout from "../src/components/Layout";
import { useAppContext } from "../src/contexts/AppContext";
import InterviewPerformanceChart from "../src/components/score/InterviewPerformanceChart";

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [evaluationHistory, setEvaluationHistory] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [currentEvaluation, setCurrentEvaluation] = useState(null);
  const { user } = useAppContext();

  // 模擬加載評估歷史
  useEffect(() => {
    const loadEvaluationHistory = async () => {
      setIsLoading(true);
      try {
        // 模擬API調用延遲
        await new Promise((resolve) => setTimeout(resolve, 800));

        // 模擬數據
        const mockHistory = generateMockEvaluationHistory();

        if (mockHistory && mockHistory.length > 0) {
          setEvaluationHistory(mockHistory);

          // 設置默認選中最新的評估
          if (!activeSessionId) {
            setActiveSessionId(mockHistory[0].sessionId);
            setCurrentEvaluation(mockHistory[0]);
          }
        } else {
          setEvaluationHistory([]);
        }
      } catch (error) {
        console.error("獲取評估歷史時出錯:", error);
        setEvaluationHistory([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvaluationHistory();
  }, []);

  // 當選擇不同的會話ID時，更新當前評估
  useEffect(() => {
    if (activeSessionId && evaluationHistory.length > 0) {
      const selectedEvaluation = evaluationHistory.find(
        (evaluation) => evaluation.sessionId === activeSessionId,
      );

      if (selectedEvaluation) {
        setCurrentEvaluation(selectedEvaluation);
      }
    }
  }, [activeSessionId, evaluationHistory]);

  // 生成模擬評估歷史數據
  const generateMockEvaluationHistory = () => {
    const history = [];
    const now = new Date();

    for (let i = 0; i < 5; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() - i * 7); // 每週一次面試

      // 模擬漸進式提高的分數
      const baseScore = 70;
      const improvement = Math.min(25, i * 5);
      const randomVariation = Math.floor(Math.random() * 6) - 3;
      const totalScore = Math.min(
        100,
        baseScore + improvement + randomVariation,
      );

      history.push({
        sessionId: `session-${Date.now()}-${i}`,
        timestamp: date.toISOString(),
        context: {
          industry: ["tech", "finance", "healthcare", "education", "retail"][
            i % 5
          ],
          karenType: ["strict", "detailed", "impatient", "skeptical"][i % 4],
          messageCount: 10 + i * 2,
        },
        totalScore: totalScore,
        categoryScores: {
          relevance: totalScore + Math.floor(Math.random() * 10) - 5,
          clarity: totalScore + Math.floor(Math.random() * 10) - 5,
          confidence: totalScore + Math.floor(Math.random() * 10) - 5,
          technical: totalScore + Math.floor(Math.random() * 10) - 5,
          communication: totalScore + Math.floor(Math.random() * 10) - 5,
        },
        detailedFeedback: `這是第${i + 1}次模擬面試的詳細反饋。你在${["溝通能力", "技術知識", "自信表現", "回答結構"][i % 4]}方面表現優秀，但在${["具體例子", "技術深度", "回答簡潔度"][i % 3]}方面還有提升空間。`,
      });
    }

    return history;
  };

  // 處理選擇評估
  const handleSelectEvaluation = (sessionId) => {
    setActiveSessionId(sessionId);
  };

  // 處理新面試
  const handleNewInterview = () => {
    router.push("/");
  };

  // 獲取行業顯示名稱
  const getIndustryName = (industry) => {
    const industries = {
      tech: "科技產業",
      finance: "金融產業",
      healthcare: "醫療保健",
      education: "教育產業",
      retail: "零售產業",
    };
    return industries[industry] || "未指定行業";
  };

  // 獲取面試官類型顯示名稱
  const getKarenTypeName = (karenType) => {
    const types = {
      strict: "嚴格型",
      detailed: "細節型",
      impatient: "急躁型",
      skeptical: "質疑型",
    };
    return types[karenType] || "標準型";
  };

  // 渲染面試列表
  const renderInterviewList = () => {
    if (evaluationHistory.length === 0) {
      return (
        <div className="empty-list">
          <p>尚無面試記錄</p>
        </div>
      );
    }

    return (
      <div className="interview-list">
        <h2>面試記錄</h2>
        {evaluationHistory.map((evaluation, index) => (
          <div
            key={evaluation.sessionId}
            className={`interview-item ${activeSessionId === evaluation.sessionId ? "active" : ""}`}
            onClick={() => handleSelectEvaluation(evaluation.sessionId)}
          >
            <div className="interview-item-header">
              <span className="date">
                {new Date(evaluation.timestamp).toLocaleDateString("zh-TW")}
              </span>
              <span className="score">{evaluation.totalScore}分</span>
            </div>
            <div className="interview-item-details">
              <span>{getIndustryName(evaluation.context?.industry)}</span>
              <span>{getKarenTypeName(evaluation.context?.karenType)}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // 渲染活動標籤內容
  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>正在加載評估數據...</p>
        </div>
      );
    }

    if (evaluationHistory.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>還沒有面試記錄</h3>
          <p>完成你的第一次模擬面試，獲取詳細評估和改進建議。</p>
          <button className="start-button" onClick={handleNewInterview}>
            開始模擬面試
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "history":
        return renderHistory();
      case "strengths":
        return renderStrengthsAndWeaknesses();
      case "comparison":
        return renderIndustryComparison();
      case "suggestions":
        return renderImprovementSuggestions();
      default:
        return renderOverview();
    }
  };

  // 渲染概覽頁面
  const renderOverview = () => {
    if (!currentEvaluation) return <div>請選擇一次面試記錄查看詳情</div>;

    const performanceData = getPerformanceHistory();
    const currentScores = getCurrentScores();

    return (
      <div className="overview-container">
        <div className="overview-header">
          <div className="score-display">
            <div className="score-value">{currentEvaluation.totalScore}</div>
            <div className="score-label">總分</div>
          </div>
          <div className="overview-details">
            <div className="detail-item">
              <span className="detail-label">面試時間:</span>
              <span className="detail-value">
                {new Date(currentEvaluation.timestamp).toLocaleString("zh-TW")}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">行業:</span>
              <span className="detail-value">
                {getIndustryName(currentEvaluation.context?.industry)}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">面試官類型:</span>
              <span className="detail-value">
                {getKarenTypeName(currentEvaluation.context?.karenType)}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">問題數量:</span>
              <span className="detail-value">
                {Math.floor((currentEvaluation.context?.messageCount || 0) / 2)}
              </span>
            </div>
          </div>
        </div>

        <div className="charts-section">
          <InterviewPerformanceChart
            evaluationHistory={evaluationHistory}
            performanceHistory={performanceData}
            currentScores={currentScores}
          />
        </div>

        <div className="feedback-section">
          <h3>面試總評</h3>
          <div className="feedback-content">
            <p>{currentEvaluation.detailedFeedback}</p>
          </div>
        </div>
      </div>
    );
  };

  // 獲取表現歷史數據
  const getPerformanceHistory = () => {
    return evaluationHistory
      .map((evaluation) => {
        const date = new Date(evaluation.timestamp);
        return {
          date: `${date.getMonth() + 1}/${date.getDate()}`,
          score: evaluation.totalScore,
          clarity: evaluation.categoryScores.clarity,
          confidence: evaluation.categoryScores.confidence,
          relevance: evaluation.categoryScores.relevance,
          technical: evaluation.categoryScores.technical,
          communication: evaluation.categoryScores.communication,
        };
      })
      .reverse(); // 確保時間順序是從早到晚
  };

  // 獲取當前評分數據
  const getCurrentScores = () => {
    if (!currentEvaluation) return [];

    return [
      {
        category: "回答相關性",
        value: currentEvaluation.categoryScores.relevance,
      },
      {
        category: "表達清晰度",
        value: currentEvaluation.categoryScores.clarity,
      },
      {
        category: "自信程度",
        value: currentEvaluation.categoryScores.confidence,
      },
      {
        category: "技術知識",
        value: currentEvaluation.categoryScores.technical,
      },
      {
        category: "溝通技巧",
        value: currentEvaluation.categoryScores.communication,
      },
    ];
  };

  // 渲染歷史頁面
  const renderHistory = () => {
    return (
      <div className="history-container">
        <h3>面試歷史趨勢</h3>
        <div className="history-chart">
          <InterviewPerformanceChart
            evaluationHistory={evaluationHistory}
            performanceHistory={getPerformanceHistory()}
            currentScores={[]}
          />
        </div>
      </div>
    );
  };

  // 渲染強弱項分析
  const renderStrengthsAndWeaknesses = () => {
    if (!currentEvaluation) return <div>請選擇一次面試記錄查看詳情</div>;

    // 從分數中找出強項和弱項
    const scores = currentEvaluation.categoryScores;
    const scoreEntries = Object.entries(scores).map(([category, score]) => ({
      category,
      score,
    }));

    // 按分數排序
    scoreEntries.sort((a, b) => b.score - a.score);

    // 取前2個作為強項，後2個作為弱項
    const strengths = scoreEntries.slice(0, 2);
    const weaknesses = scoreEntries.slice(-2);

    // 獲取類別顯示名稱
    const getCategoryName = (category) => {
      const categoryNames = {
        relevance: "回答相關性",
        clarity: "表達清晰度",
        confidence: "自信程度",
        technical: "技術知識",
        communication: "溝通技巧",
      };
      return categoryNames[category] || category;
    };

    return (
      <div className="strengths-weaknesses-container">
        <div className="strengths-section">
          <h3>你的優勢</h3>
          {strengths.map((strength, index) => (
            <div key={index} className="strength-item">
              <div className="strength-header">
                <span className="strength-name">
                  {getCategoryName(strength.category)}
                </span>
                <span className="strength-score">{strength.score}分</span>
              </div>
              <div className="strength-bar">
                <div
                  className="strength-progress"
                  style={{ width: `${strength.score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="weaknesses-section">
          <h3>需要改進的領域</h3>
          {weaknesses.map((weakness, index) => (
            <div key={index} className="weakness-item">
              <div className="weakness-header">
                <span className="weakness-name">
                  {getCategoryName(weakness.category)}
                </span>
                <span className="weakness-score">{weakness.score}分</span>
              </div>
              <div className="weakness-bar">
                <div
                  className="weakness-progress"
                  style={{ width: `${weakness.score}%` }}
                ></div>
              </div>
              <div className="improvement-suggestions">
                <h4>改進建議:</h4>
                <ul>
                  <li>
                    為{getCategoryName(weakness.category)}準備更具體的例子
                  </li>
                  <li>練習{getCategoryName(weakness.category)}相關的技巧</li>
                  <li>參考行業標準提升此領域能力</li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 渲染行業對比
  const renderIndustryComparison = () => {
    if (!currentEvaluation) return <div>請選擇一次面試記錄查看詳情</div>;

    // 模擬行業基準數據
    const industryBenchmarks = {
      tech: {
        relevance: 78,
        clarity: 76,
        confidence: 77,
        technical: 82,
        communication: 75,
      },
      finance: {
        relevance: 80,
        clarity: 78,
        confidence: 81,
        technical: 79,
        communication: 77,
      },
      healthcare: {
        relevance: 79,
        clarity: 80,
        confidence: 76,
        technical: 77,
        communication: 81,
      },
      education: {
        relevance: 77,
        clarity: 82,
        confidence: 75,
        technical: 73,
        communication: 84,
      },
      retail: {
        relevance: 76,
        clarity: 80,
        confidence: 79,
        technical: 70,
        communication: 83,
      },
    };

    const industry = currentEvaluation.context?.industry || "tech";
    const benchmarks = industryBenchmarks[industry] || industryBenchmarks.tech;

    // 計算你的分數與行業基準的差異
    const comparisonData = Object.entries(currentEvaluation.categoryScores).map(
      ([category, score]) => {
        const benchmark = benchmarks[category] || 75;
        const difference = score - benchmark;

        return {
          category,
          yourScore: score,
          industryBenchmark: benchmark,
          difference,
          better: difference >= 0,
        };
      },
    );

    // 獲取類別顯示名稱
    const getCategoryName = (category) => {
      const categoryNames = {
        relevance: "回答相關性",
        clarity: "表達清晰度",
        confidence: "自信程度",
        technical: "技術知識",
        communication: "溝通技巧",
      };
      return categoryNames[category] || category;
    };

    return (
      <div className="industry-comparison-container">
        <h3>{getIndustryName(industry)}行業標準對比</h3>

        <div className="comparison-items">
          {comparisonData.map((item, index) => (
            <div key={index} className="comparison-item">
              <div className="comparison-header">
                <span className="comparison-category">
                  {getCategoryName(item.category)}
                </span>
                <div className="comparison-scores">
                  <span className="your-score">你的分數: {item.yourScore}</span>
                  <span className="industry-score">
                    行業基準: {item.industryBenchmark}
                  </span>
                </div>
              </div>

              <div className="comparison-bars">
                <div className="benchmark-bar">
                  <div
                    className="benchmark-progress"
                    style={{ width: `${item.industryBenchmark}%` }}
                  ></div>
                </div>
                <div className="your-bar">
                  <div
                    className={`your-progress ${item.better ? "better" : "worse"}`}
                    style={{ width: `${item.yourScore}%` }}
                  ></div>
                </div>
              </div>

              <div className="comparison-difference">
                <span className={item.better ? "better-text" : "worse-text"}>
                  {item.better ? "高於" : "低於"}行業標準{" "}
                  {Math.abs(item.difference)} 分
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 渲染改進建議
  const renderImprovementSuggestions = () => {
    if (!currentEvaluation) return <div>請選擇一次面試記錄查看詳情</div>;

    // 模擬改進建議數據
    const suggestions = [
      {
        area: "回答結構",
        suggestions: [
          "使用STAR方法(情境-任務-行動-結果)來組織回答",
          "確保每個回答有清晰的開頭、中間和結尾",
          "在回答結束時總結關鍵點",
        ],
      },
      {
        area: "具體例子",
        suggestions: [
          "準備3-5個與職位相關的具體工作例子",
          "使用數據和指標來量化你的成就",
          "運用簡短但相關的故事來說明你的能力",
        ],
      },
      {
        area: "技術知識",
        suggestions: [
          "加深對行業關鍵技術的理解",
          "使用更多專業術語展示你的專業知識",
          "關注最新行業趨勢並融入回答中",
        ],
      },
    ];

    return (
      <div className="improvement-suggestions-container">
        <h3>改進建議</h3>

        <div className="suggestions-list">
          {suggestions.map((area, index) => (
            <div key={index} className="suggestion-area">
              <h4>{area.area}</h4>
              <ul>
                {area.suggestions.map((suggestion, i) => (
                  <li key={i}>{suggestion}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="practice-suggestions">
          <h3>練習建議</h3>
          <ul>
            <li>每週至少進行一次Karen AI模擬面試，針對不同類型的面試官</li>
            <li>錄制自己的回答並回聽，注意語速、語調和清晰度</li>
            <li>找朋友進行模擬面試，獲取即時反饋</li>
            <li>參加行業相關活動，提高專業知識和語言表達能力</li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>面試表現儀表板 | AI Karen</title>
        <meta
          name="description"
          content="查看你的面試表現數據、進步趨勢和個性化改進建議"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>

      <Layout>
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h1>面試表現儀表板</h1>
            <button
              className="new-interview-button"
              onClick={handleNewInterview}
            >
              新面試
            </button>
          </div>

          <div className="dashboard-content">
            {/* 左側面板 - 面試列表 */}
            <div className="sidebar">{renderInterviewList()}</div>

            {/* 右側面板 - 主要內容 */}
            <div className="main-panel">
              {/* 標籤導航 */}
              <div className="tabs">
                <button
                  className={`tab ${activeTab === "overview" ? "active" : ""}`}
                  onClick={() => setActiveTab("overview")}
                >
                  概覽
                </button>
                <button
                  className={`tab ${activeTab === "history" ? "active" : ""}`}
                  onClick={() => setActiveTab("history")}
                >
                  歷史表現
                </button>
                <button
                  className={`tab ${activeTab === "strengths" ? "active" : ""}`}
                  onClick={() => setActiveTab("strengths")}
                >
                  強弱分析
                </button>
                <button
                  className={`tab ${activeTab === "comparison" ? "active" : ""}`}
                  onClick={() => setActiveTab("comparison")}
                >
                  行業對比
                </button>
                <button
                  className={`tab ${activeTab === "suggestions" ? "active" : ""}`}
                  onClick={() => setActiveTab("suggestions")}
                >
                  改進建議
                </button>
              </div>

              {/* 標籤內容 */}
              <div className="tab-content">{renderTabContent()}</div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .dashboard-container {
            padding: 20px;
            height: 100%;
            display: flex;
            flex-direction: column;
          }

          .dashboard-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }

          .dashboard-header h1 {
            font-size: 24px;
            color: #333;
            margin: 0;
          }

          .new-interview-button {
            background: linear-gradient(to right, #e6b17a, #e4997e);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            transition: all 0.3s;
          }

          .new-interview-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          }

          .dashboard-content {
            display: flex;
            flex-direction: column; /* 在移動設備上垂直堆疊 */
            flex: 1;
            min-height: 0;
          }

          @media (min-width: 768px) {
            .dashboard-content {
              flex-direction: row; /* 在桌面設備上水平排列 */
            }
          }

          .sidebar {
            width: 100%; /* 在移動設備上佔據全寬 */
            min-width: auto;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            padding: 15px;
            margin-bottom: 20px;
            margin-right: 0;
            max-height: 200px; /* 限制在移動設備上的高度 */
            overflow-y: auto;
          }

          @media (min-width: 768px) {
            .sidebar {
              width: 25%;
              min-width: 250px;
              margin-right: 20px;
              margin-bottom: 0;
              max-height: none;
            }
          }

          .main-panel {
            flex: 1;
            width: 100%; /* 確保在移動設備上佔據全寬 */
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }

          .tabs {
            display: flex;
            flex-wrap: wrap; /* 允許在移動設備上換行 */
            background-color: #f8f8f8;
            border-bottom: 1px solid #eaeaea;
            padding: 0 15px;
          }

          .tab {
            flex: 1 0 auto; /* 允許項目調整大小 */
            padding: 10px 12px; /* 縮小填充以適應移動設備 */
            background: none;
            border: none;
            font-size: 13px; /* 縮小字體 */
            font-weight: 500;
            color: #666;
            cursor: pointer;
            transition: all 0.2s;
            position: relative;
            white-space: nowrap; /* 防止文本換行 */
          }

          @media (min-width: 768px) {
            .tab {
              padding: 12px 15px;
              font-size: 14px;
            }
          }

          .tab:hover {
            color: #e6b17a;
          }

          .tab.active {
            color: #e6b17a;
          }

          .tab.active::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 15%;
            width: 70%;
            height: 3px;
            background-color: #e6b17a;
            border-radius: 3px 3px 0 0;
          }

          .tab-content {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
          }

          /* 適應移動設備的面試列表 */
          .interview-list h2 {
            font-size: 16px;
            margin-bottom: 12px;
          }

          @media (min-width: 768px) {
            .interview-list h2 {
              font-size: 18px;
              margin-bottom: 15px;
            }
          }

          .interview-item {
            padding: 10px;
            margin-bottom: 8px;
          }

          @media (min-width: 768px) {
            .interview-item {
              padding: 12px;
              margin-bottom: 10px;
            }
          }

          /* 適應移動設備的圖表區域 */
          .charts-section {
            overflow-x: auto;
          }

          /* 修復移動設備上圖表溢出問題 */
          .overview-container,
          .history-container,
          .strengths-weaknesses-container,
          .industry-comparison-container,
          .improvement-suggestions-container {
            max-width: 100%;
            overflow-x: hidden;
          }

          @media (max-width: 480px) {
            .overview-header {
              flex-direction: column;
              align-items: flex-start;
            }

            .score-display {
              margin-bottom: 15px;
            }
          }

          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: #666;
          }

          .spinner {
            border: 4px solid rgba(0, 0, 0, 0.1);
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border-left-color: #e6aa63;
            animation: spin 1s linear infinite;
            margin-bottom: 15px;
          }

          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }

          .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: #666;
            text-align: center;
            padding: 20px;
          }

          .empty-icon {
            font-size: 48px;
            margin-bottom: 15px;
          }

          .empty-state h3 {
            margin: 0 0 10px 0;
            font-size: 18px;
            color: #333;
          }

          .empty-state p {
            margin: 0 0 20px 0;
            font-size: 14px;
            max-width: 400px;
          }

          .start-button {
            background: linear-gradient(to right, #e6b17a, #e4997e);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 20px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            transition: all 0.3s;
          }

          .start-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          }
        `}</style>
      </Layout>
    </>
  );
}
