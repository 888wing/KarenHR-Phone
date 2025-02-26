import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import TopBar from "../src/components/layout/TopBar";
import BottomNav from "../src/components/layout/BottomNav";

import { getUserEvaluationHistory } from "../src/lib/api/evaluationService";

const InterviewPerformanceChart = ({ evaluationHistory }) => {
  // 如果有提供評估歷史，使用真實數據；否則使用模擬數據
  const useRealData = evaluationHistory && evaluationHistory.length > 0;

  // 處理真實數據轉換為圖表格式
  const getPerformanceHistory = () => {
    if (useRealData) {
      return evaluationHistory.map((evaluation, index) => {
        const date = new Date(evaluation.timestamp);
        const formatDate = `${date.getMonth() + 1}/${date.getDate()}`;

        return {
          date: formatDate,
          score: evaluation.totalScore,
          clarity: evaluation.categoryScores.clarity,
          confidence: evaluation.categoryScores.confidence,
          relevance: evaluation.categoryScores.relevance,
          technical: evaluation.categoryScores.technical,
          communication: evaluation.categoryScores.communication
        };
      }).reverse(); // 確保時間順序是從早到晚
    } else {
      // 返回模擬數據
      return [
        // ... 現有模擬數據 ...
      ];
    }
  };

  // 獲取最新評估的詳細評分
  const getCurrentScores = () => {
    if (useRealData && evaluationHistory.length > 0) {
      const latest = evaluationHistory[0];
      return [
        { category: '回答清晰度', value: latest.categoryScores.clarity },
        { category: '自信程度', value: latest.categoryScores.confidence },
        { category: '內容相關性', value: latest.categoryScores.relevance },
        { category: '技術知識', value: latest.categoryScores.technical },
        { category: '溝通技巧', value: latest.categoryScores.communication }
      ];
    } else {
      // 返回模擬數據
      return [
        // ... 現有模擬數據 ...
      ];
    }
  };

  // 計算實際數據
  const performanceHistory = getPerformanceHistory();
  const currentScores = getCurrentScores();


export default function Score() {
  // ... 現有狀態 ...
  const [evaluationHistory, setEvaluationHistory] = useState([]);

  // 獲取評估歷史
  useEffect(() => {
    // 模擬API調用
    const fetchData = () => {
      setIsLoading(true);

      try {
        // 從本地存儲或API獲取評估歷史
        const history = getUserEvaluationHistory('temp-user-id', 1);

        if (history && history.length > 0) {
          const latestEvaluation = history[0];

          // 更新UI狀態
          setScore(`${latestEvaluation.totalScore}/100`);
          setRanking("10,952");  // 這裡可以從API獲取真實排名
          setComment(latestEvaluation.detailedFeedback);

          // 存儲完整評估結果用於圖表
          setEvaluationHistory(history);
        } else {
          // 如果沒有歷史記錄，使用默認數據
          setScore("96/100");
          setRanking("10,952");
          setComment("你的表現非常出色！回答清晰且深入，專業知識豐富。建議可以進一步練習結構化表達和情境案例分享，使回答更加生動。你的表現已經超過了大多數面試者，繼續保持！");
        }
      } catch (error) {
        console.error("獲取評估數據時出錯:", error);
        // 使用備用數據
        setScore("96/100");
        setRanking("10,952");
        setComment("你的表現非常出色！回答清晰且深入，專業知識豐富。建議可以進一步練習結構化表達和情境案例分享，使回答更加生動。你的表現已經超過了大多數面試者，繼續保持！");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // ... 其餘代碼保持不變 ...
}

// 動態導入圖表組件以避免服務器渲染問題
const InterviewPerformanceChart = dynamic(
  () => import("../src/components/score/InterviewPerformanceChart"),
  { ssr: false },
);

export default function Score() {
  const [score, setScore] = useState(null);
  const [ranking, setRanking] = useState(null);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 模擬從API獲取數據
  useEffect(() => {
    // 在實際應用中，這裡會是API調用
    const fetchData = () => {
      setIsLoading(true);
      // 模擬API延遲
      setTimeout(() => {
        setScore("96/100");
        setRanking("10,952");
        setComment(
          "你的表現非常出色！回答清晰且深入，專業知識豐富。建議可以進一步練習結構化表達和情境案例分享，使回答更加生動。你的表現已經超過了大多數面試者，繼續保持！",
        );
        setIsLoading(false);
      }, 500);
    };

    fetchData();
  }, []);

  const handleClose = () => {
    router.push("/");
  };

  return (
    <div className="mobile-container">
      {/* 頂部控制欄 - 使用現有的TopBar組件 */}
      <TopBar />

      {/* 得分區域 */}
      <div className="score-container">
        {isLoading ? (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>加載評估結果...</p>
          </div>
        ) : (
          <>
            <div className="score-header">
              <div className="score-display">
                <div className="big-score">{score}</div>
                {ranking && (
                  <div className="ranking">領先全球 {ranking} 位面試者</div>
                )}
              </div>
              <div className="user-avatar">
                <div className="avatar-inner">A</div>
              </div>
            </div>

            {/* 圖表區域 */}
            // pages/score.jsx 中的修改部分

            // ... 圖表區域部分 ...
            <div className="charts-section">
              <InterviewPerformanceChart evaluationHistory={evaluationHistory} />
            </div>

            {/* Karen的評論 */}
            <div className="comment-section">
              <h3>Karen的點評</h3>
              <div className="comment-box">{comment}</div>
            </div>

            {/* 操作按鈕 */}
            <div className="action-buttons">
              <button className="action-button primary">分享結果</button>
              <button className="action-button secondary" onClick={handleClose}>
                返回首頁
              </button>
            </div>
          </>
        )}
      </div>

      {/* 底部導航欄 - 使用現有的BottomNav組件 */}
      <BottomNav />

      <style jsx>{`
        /* 移動裝置容器 */
        .mobile-container {
          max-width: 420px;
          height: 100vh;
          margin: 0 auto;
          background-color: #fdf6e3;
          position: relative;
          display: flex;
          flex-direction: column;
          font-family:
            -apple-system,
            BlinkMacSystemFont,
            Segoe UI,
            Roboto,
            Oxygen,
            Ubuntu,
            Cantarell,
            sans-serif;
        }

        /* 得分區域 */
        .score-container {
          flex: 1;
          padding: 20px;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        .loading-indicator {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
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

        .score-header {
          position: relative;
          display: flex;
          align-items: center;
          margin-bottom: 30px;
        }

        .score-display {
          flex-grow: 1;
        }

        .big-score {
          font-size: 48px;
          font-weight: bold;
          margin-bottom: 8px;
          color: #e6aa63;
        }

        .ranking {
          font-size: 14px;
          color: #555;
        }

        /* 用戶頭像 */
        .user-avatar {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background-color: #f1f1f1;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .avatar-inner {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: #d8365d;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: bold;
        }

        /* 圖表區域 */
        .charts-section {
          margin-bottom: 20px;
        }

        /* 評論區域 */
        .comment-section {
          margin-top: 10px;
          margin-bottom: 20px;
        }

        .comment-section h3 {
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 10px;
        }

        .comment-box {
          background-color: #fff2b3;
          border-radius: 12px;
          padding: 15px;
          font-size: 14px;
          line-height: 1.6;
          color: #333;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        /* 操作按鈕 */
        .action-buttons {
          display: flex;
          gap: 10px;
          margin-top: 20px;
          margin-bottom: 20px;
        }

        .action-button {
          flex: 1;
          padding: 12px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .action-button.primary {
          background-color: #e6aa63;
          color: white;
        }

        .action-button.primary:hover {
          background-color: #d8a05a;
        }

        .action-button.secondary {
          background-color: #f3f3f3;
          color: #333;
        }

        .action-button.secondary:hover {
          background-color: #e5e5e5;
        }
      `}</style>
    </div>
  );
}
