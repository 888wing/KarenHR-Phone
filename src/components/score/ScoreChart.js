import { useEffect, useState } from "react";

/**
 * 得分圖表組件
 * @param {Object} props - 組件屬性
 * @param {Array} props.history - 歷史得分數據
 */
export default function ScoreChart({ history = [] }) {
  const [points, setPoints] = useState("");

  // 如果沒有歷史數據，創建模擬數據
  useEffect(() => {
    if (!history || history.length === 0) {
      // 創建模擬數據點
      const mockData = generateMockData();
      generateChartPoints(mockData);
    } else {
      // 使用實際數據
      generateChartPoints(history);
    }
  }, [history]);

  // 生成模擬數據
  const generateMockData = () => {
    return [65, 72, 68, 80, 85, 75, 90, 96];
  };

  // 將數據轉換為 SVG 點
  const generateChartPoints = (data) => {
    if (!data || data.length === 0) return "";

    // 計算座標
    const width = 300;
    const height = 150;
    const padding = 10;
    const availableWidth = width - padding * 2;
    const availableHeight = height - padding * 2;

    // 找出最小和最大值
    const minVal = Math.min(...data);
    const maxVal = Math.max(...data);
    const range = maxVal - minVal || 1;

    // 生成點
    const pointsArray = data.map((val, index) => {
      const x = padding + (index / (data.length - 1)) * availableWidth;
      const normalizedVal = (val - minVal) / range;
      const y = height - (padding + normalizedVal * availableHeight);
      return `${x},${y}`;
    });

    setPoints(pointsArray.join(" "));
  };

  return (
    <div className="track-record-section">
      <h3>Track Record</h3>
      <div className="chart-container">
        <svg width="100%" height="200" viewBox="0 0 300 150">
          {points && (
            <polyline
              points={points}
              fill="none"
              stroke="black"
              strokeWidth="2"
            />
          )}
          {/* 可以添加更多圖表元素，如座標軸等 */}
        </svg>
      </div>

      <style jsx>{`
        .chart-container {
          position: relative;
          width: 100%;
          border: 1px solid #ccc;
          border-radius: 8px;
          height: 200px;
          padding: 10px;
          background-color: #fff;
        }
      `}</style>
    </div>
  );
}
