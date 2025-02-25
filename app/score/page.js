import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Score() {
  const router = useRouter();

  const handleClose = () => {
    router.push("/");
  };

  return (
    <>
      <Head>
        <title>面試得分 | AI Karen</title>
        <meta name="description" content="查看您的面試表現得分" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>

      <div className="mobile-container">
        {/* 頂部控制欄 */}
        <div className="top-bar">
          <div className="close-button" onClick={handleClose}>
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path
                fill="currentColor"
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
              ></path>
            </svg>
          </div>
        </div>

        {/* 得分區域 */}
        <div className="score-container">
          <h2 className="score-title">Score</h2>

          <div className="score-display">
            <div className="big-score">96/100</div>
            <div className="ranking">Leading 10,952 on world</div>
          </div>

          {/* 用戶頭像 */}
          <div className="user-avatar">
            <div className="avatar-icon"></div>
          </div>

          {/* 成績圖表 */}
          <div className="track-record-section">
            <h3>Track Record</h3>
            <div className="chart-container">
              <svg width="100%" height="200" viewBox="0 0 300 150">
                <polyline
                  points="0,140 50,100 100,120 150,60 200,30 250,60 300,120"
                  fill="none"
                  stroke="black"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>

          {/* Karen的評論 */}
          <div className="comment-section">
            <h3>Comment from karen</h3>
            <div className="comment-box">Can be improve something else</div>
          </div>
        </div>

        {/* 底部導航欄 */}
        <div className="bottom-nav">
          <div className="nav-item">
            <div className="nav-icon karen-pro">A</div>
            <span>Karen Pro</span>
          </div>
          <div className="nav-item active">
            <div className="nav-icon">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path
                  fill="currentColor"
                  d="M9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4zm2 2H5V5h14v14z"
                ></path>
              </svg>
            </div>
            <span>統計</span>
          </div>
          <div className="nav-item">
            <div className="nav-icon">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path
                  fill="currentColor"
                  d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"
                ></path>
              </svg>
            </div>
            <span>設定</span>
          </div>
        </div>
      </div>

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

        /* 頂部控制欄 */
        .top-bar {
          display: flex;
          justify-content: flex-end;
          padding: 15px;
          background-color: #fdf6e3;
        }

        .close-button {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        /* 得分區域 */
        .score-container {
          flex: 1;
          padding: 20px;
          display: flex;
          flex-direction: column;
        }

        .score-title {
          text-align: center;
          font-size: 18px;
          font-weight: 500;
          margin-bottom: 20px;
        }

        .score-display {
          text-align: center;
          margin-bottom: 20px;
        }

        .big-score {
          font-size: 40px;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .ranking {
          font-size: 14px;
          color: #555;
        }

        /* 用戶頭像 */
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

        .avatar-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: #aaa;
        }

        /* 成績圖表區域 */
        .track-record-section {
          margin-top: 20px;
          flex: 1;
        }

        .track-record-section h3 {
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 15px;
        }

        .chart-container {
          border: 1px solid #ccc;
          border-radius: 8px;
          height: 200px;
          padding: 10px;
          background-color: #fff;
        }

        /* 評論區域 */
        .comment-section {
          margin-top: 20px;
          margin-bottom: 20px;
        }

        .comment-section h3 {
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 10px;
        }

        .comment-box {
          background-color: #fff2b3;
          border-radius: 8px;
          padding: 15px;
          font-size: 14px;
          color: #333;
          min-height: 80px;
        }

        /* 底部導航欄 */
        .bottom-nav {
          display: flex;
          background-color: #e6b17a;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          padding: 10px 0;
        }

        .nav-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #333;
          font-size: 12px;
          cursor: pointer;
        }

        .nav-icon {
          margin-bottom: 4px;
        }

        .karen-pro {
          width: 24px;
          height: 24px;
          background-color: #d8365d;
          color: white;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .nav-item.active {
          color: #d8365d;
        }
      `}</style>
    </>
  );
}
