import Image from "next/image";

/**
 * 得分顯示組件
 * @param {Object} props - 組件屬性
 * @param {number} props.score - 總分
 * @param {Object} props.details - 分數詳情
 * @param {string} props.comment - Karen的評語
 */
export default function ScoreDisplay({
  score = 0,
  details = {},
  comment = "",
}) {
  // 計算百分比分數
  const percentage = Math.round((score / 100) * 100);

  // 計算排名 (模擬數據)
  const ranking = 10952;

  return (
    <div className="score-container">
      <h2 className="score-title">Score</h2>

      <div className="score-display">
        <div className="big-score">{percentage}/100</div>
        <div className="ranking">
          Leading {ranking.toLocaleString()} on world
        </div>
      </div>

      {/* 用戶頭像 */}
      <div className="user-avatar">
        <Image
          src="/images/profile-pic.png"
          alt="Profile"
          width={60}
          height={60}
          style={{ borderRadius: "50%", objectFit: "cover" }}
          onError={(e) => {
            // 圖片載入錯誤時替換為默認頭像
            e.target.onerror = null;
            e.target.src =
              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="%23aaaaaa"%3E%3Cpath d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"%3E%3C/path%3E%3C/svg%3E';
          }}
        />
      </div>

      {/* 能力雷達圖 (分類得分) */}
      {details && Object.keys(details).length > 0 && (
        <div className="score-details">
          <h3>Performance Details</h3>
          <div className="detail-bars">
            {Object.entries(details).map(([key, value]) => (
              <div key={key} className="detail-bar">
                <div className="detail-label">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </div>
                <div className="bar-container">
                  <div
                    className="bar-fill"
                    style={{ width: `${(value / 25) * 100}%` }}
                  ></div>
                </div>
                <div className="detail-value">{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Karen的評論 */}
      <div className="comment-section">
        <h3>Comment from karen</h3>
        <div className="comment-box">
          {comment || "Can be improve something else"}
        </div>
      </div>

      <style jsx>{`
        .score-details {
          margin-top: 30px;
        }

        .score-details h3 {
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 15px;
        }

        .detail-bars {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .detail-bar {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .detail-label {
          width: 100px;
          font-size: 14px;
        }

        .bar-container {
          flex: 1;
          height: 8px;
          background-color: #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          background-color: rgb(var(--accent-rgb));
          border-radius: 4px;
        }

        .detail-value {
          width: 30px;
          text-align: right;
          font-size: 14px;
          font-weight: 500;
        }

        .user-avatar {
          position: absolute;
          top: 90px;
          right: 30px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: #e9e9e9;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
}
