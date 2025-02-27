import React from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

/**
 * 表現概覽組件
 * 顯示單次面試評估的總體表現和評分分佈
 */
const PerformanceOverview = ({ evaluation }) => {
  // 如果無評估數據，顯示空狀態
  if (!evaluation) {
    return (
      <div className="empty-evaluation">
        <p>請選擇一個面試評估以查看詳細信息</p>
      </div>
    );
  }

  // 從評估數據中提取評分
  const { totalScore, categoryScores, timestamp, context, detailedFeedback } =
    evaluation;

  // 將評分轉換為雷達圖數據格式
  const radarData = [
    { category: "回答相關性", value: categoryScores.relevance },
    { category: "表達清晰度", value: categoryScores.clarity },
    { category: "自信程度", value: categoryScores.confidence },
    { category: "技術知識", value: categoryScores.technical },
    { category: "溝通技巧", value: categoryScores.communication },
  ];

  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
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

  // 獲取評分等級
  const getScoreLevel = (score) => {
    if (score >= 90) return { level: "優秀", color: "#4CAF50" };
    if (score >= 80) return { level: "良好", color: "#8BC34A" };
    if (score >= 70) return { level: "滿意", color: "#CDDC39" };
    if (score >= 60) return { level: "一般", color: "#FFC107" };
    return { level: "需改進", color: "#FF5722" };
  };

  const scoreLevel = getScoreLevel(totalScore);

  return (
    <div className="overview-container">
      {/* 頂部信息卡 */}
      <div className="info-row">
        <div className="info-card score-card">
          <div className="score-display">
            <div className="score-value">{totalScore}</div>
            <div className="score-label">總分</div>
          </div>
          <div
            className="score-level"
            style={{ backgroundColor: scoreLevel.color }}
          >
            {scoreLevel.level}
          </div>
        </div>

        <div className="info-card details-card">
          <div className="detail-row">
            <span className="detail-label">面試時間:</span>
            <span className="detail-value">{formatDate(timestamp)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">行業:</span>
            <span className="detail-value">
              {getIndustryName(context?.industry)}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">面試官類型:</span>
            <span className="detail-value">
              {getKarenTypeName(context?.karenType)}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">問題數量:</span>
            <span className="detail-value">
              {context?.messageCount
                ? Math.floor(context.messageCount / 2)
                : "-"}
            </span>
          </div>
        </div>
      </div>

      {/* 評分雷達圖 */}
      <div className="radar-section">
        <h3>能力評分分佈</h3>
        <div className="radar-chart">
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="category" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="評分"
                dataKey="value"
                stroke="#e6aa63"
                fill="#e6aa63"
                fillOpacity={0.6}
              />
              <Tooltip
                formatter={(value) => [`${value}分`, "評分"]}
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  border: "1px solid #e6aa63",
                  padding: "10px",
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 評價反饋 */}
      <div className="feedback-section">
        <h3>面試總評</h3>
        <div className="feedback-content">
          <p>{detailedFeedback}</p>
        </div>
      </div>

      {/* 操作按鈕 */}
      <div className="action-buttons">
        <button className="action-button">查看詳細分析</button>
        <button className="action-button secondary">匯出報告</button>
      </div>

      <style jsx>{`
        .overview-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .info-row {
          display: flex;
          gap: 20px;
          margin-bottom: 10px;
        }

        .info-card {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          padding: 15px;
        }

        .score-card {
          flex: 0 0 160px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .score-display {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 10px;
        }

        .score-value {
          font-size: 42px;
          font-weight: bold;
          color: #e6aa63;
        }

        .score-label {
          font-size: 14px;
          color: #666;
        }

        .score-level {
          padding: 4px 12px;
          border-radius: 20px;
          color: white;
          font-size: 14px;
          font-weight: 500;
          text-align: center;
        }

        .details-card {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .detail-label {
          color: #666;
          font-size: 14px;
        }

        .detail-value {
          font-weight: 500;
          color: #333;
          font-size: 14px;
        }

        .radar-section {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          padding: 20px;
        }

        .radar-section h3 {
          margin: 0 0 15px 0;
          font-size: 16px;
          color: #333;
        }

        .radar-chart {
          height: 300px;
        }

        .feedback-section {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          padding: 20px;
        }

        .feedback-section h3 {
          margin: 0 0 15px 0;
          font-size: 16px;
          color: #333;
        }

        .feedback-content {
          background: #f9f9f9;
          border-radius: 6px;
          padding: 15px;
          color: #333;
          line-height: 1.6;
        }

        .feedback-content p {
          margin: 0;
        }

        .action-buttons {
          display: flex;
          gap: 12px;
          margin-top: 10px;
        }

        .action-button {
          flex: 1;
          padding: 10px 15px;
          background: linear-gradient(to right, #e6b17a, #e4997e);
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
        }

        .action-button:hover {
          box-shadow: 0 3px 8px rgba(230, 170, 99, 0.3);
          transform: translateY(-1px);
        }

        .action-button.secondary {
          background: #f3f3f3;
          color: #666;
        }

        .action-button.secondary:hover {
          background: #ebebeb;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
        }

        .empty-evaluation {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 300px;
          background: #f9f9f9;
          border-radius: 8px;
          color: #666;
          text-align: center;
          padding: 20px;
        }
      `}</style>
    </div>
  );
};

export default PerformanceOverview;
