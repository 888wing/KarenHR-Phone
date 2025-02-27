import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Layout from "../src/components/Layout";
import PerformanceOverview from "../src/components/dashboard/PerformanceOverview";
import HistoricalPerformance from "../src/components/dashboard/HistoricalPerformance";
import StrengthWeaknessAnalysis from "../src/components/dashboard/StrengthWeaknessAnalysis";
import IndustryComparison from "../src/components/dashboard/IndustryComparison";
import ImprovementSuggestions from "../src/components/dashboard/ImprovementSuggestions";
import InterviewList from "../src/components/dashboard/InterviewList";
import { getUserEvaluationHistory } from "../src/lib/api/enhancedEvaluationService";

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [evaluationHistory, setEvaluationHistory] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [currentEvaluation, setCurrentEvaluation] = useState(null);
  const [userId, setUserId] = useState("temp-user-id"); // 臨時用戶ID，後續接入認證系統后更新

  // 加載評估歷史
  useEffect(() => {
    const loadEvaluationHistory = async () => {
      setIsLoading(true);
      try {
        // 獲取最近10次評估歷史
        const history = await getUserEvaluationHistory(userId, 10);

        if (history && history.length > 0) {
          setEvaluationHistory(history);

          // 如果沒有當前選中的評估，默認選擇最新的
          if (!activeSessionId) {
            setActiveSessionId(history[0].sessionId);
            setCurrentEvaluation(history[0]);
          }
        } else {
          // 沒有歷史記錄
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
  }, [userId]);

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

  // 處理選擇評估
  const handleSelectEvaluation = (sessionId) => {
    setActiveSessionId(sessionId);
  };

  // 處理新面試
  const handleNewInterview = () => {
    router.push("/");
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
        return <PerformanceOverview evaluation={currentEvaluation} />;
      case "history":
        return <HistoricalPerformance evaluationHistory={evaluationHistory} />;
      case "strengths":
        return <StrengthWeaknessAnalysis evaluation={currentEvaluation} />;
      case "comparison":
        return <IndustryComparison evaluation={currentEvaluation} />;
      case "suggestions":
        return <ImprovementSuggestions evaluation={currentEvaluation} />;
      default:
        return <PerformanceOverview evaluation={currentEvaluation} />;
    }
  };

  return (
    <>
      <Head>
        <title>面試表現儀表板 | AI Karen</title>
        <meta
          name="description"
          content="查看你的面試表現數據、進步趨勢和個性化改進建議"
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
            <div className="sidebar">
              <InterviewList
                interviews={evaluationHistory}
                activeSessionId={activeSessionId}
                onSelectInterview={handleSelectEvaluation}
              />
            </div>

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
            flex: 1;
            min-height: 0;
          }

          .sidebar {
            width: 25%;
            min-width: 250px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            padding: 15px;
            margin-right: 20px;
            overflow-y: auto;
          }

          .main-panel {
            flex: 1;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }

          .tabs {
            display: flex;
            background-color: #f8f8f8;
            border-bottom: 1px solid #eaeaea;
            padding: 0 15px;
          }

          .tab {
            padding: 12px 15px;
            background: none;
            border: none;
            font-size: 14px;
            font-weight: 500;
            color: #666;
            cursor: pointer;
            transition: all 0.2s;
            position: relative;
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
