import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [industry, setIndustry] = useState("");
  const [karenType, setKarenType] = useState("");

  const handleStartInterview = () => {
    if (!industry || !karenType) {
      alert("請選擇產業和Karen類型");
      return;
    }

    router.push({
      pathname: "/chat",
      query: { industry, karenType },
    });
  };

  return (
    <>
      <Head>
        <title>AI Karen | 面試訓練助手</title>
        <meta name="description" content="透過AI Karen提升您的面試技巧" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>

      <div className="mobile-container">
        {/* 頂部導航欄 */}
        <div className="top-bar">
          <div className="profile-pic">
            <img src="/profile-pic.png" alt="Profile" />
          </div>
          <div className="menu-icon">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path
                fill="currentColor"
                d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"
              ></path>
            </svg>
          </div>
        </div>

        {/* 主要內容 */}
        <div className="main-content">
          <div className="mic-button" onClick={handleStartInterview}>
            <svg viewBox="0 0 24 24" width="64" height="64">
              <path
                fill="currentColor"
                d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z"
              ></path>
              <path
                fill="currentColor"
                d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"
              ></path>
            </svg>
            <p>點擊開始面試</p>
          </div>

          <div className="selection-section">
            <div className="select-box">
              <label>
                <span className="star-icon">★</span> 產業
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="form-select"
              >
                <option value="">選擇產業</option>
                <option value="tech">科技業</option>
                <option value="finance">金融業</option>
                <option value="healthcare">醫療保健</option>
                <option value="education">教育業</option>
                <option value="retail">零售業</option>
              </select>
            </div>

            <div className="select-box">
              <label>
                <span className="star-icon">★</span> Karen類型
              </label>
              <select
                value={karenType}
                onChange={(e) => setKarenType(e.target.value)}
                className="form-select"
              >
                <option value="">選擇Karen類型</option>
                <option value="strict">嚴格型Karen</option>
                <option value="detailed">細節控Karen</option>
                <option value="impatient">急性子Karen</option>
                <option value="skeptical">質疑型Karen</option>
              </select>
            </div>
          </div>
        </div>

        {/* 底部導航欄 */}
        <div className="bottom-nav">
          <div className="nav-item active">
            <div className="nav-icon karen-pro">A</div>
            <span>Karen Pro</span>
          </div>
          <div className="nav-item">
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
          min-height: 100vh;
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

        /* 頂部導航欄 */
        .top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          background-color: #fdf6e3;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        .profile-pic {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          background-color: #ddd;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .profile-pic img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .menu-icon {
          color: #333;
          cursor: pointer;
        }

        /* 主要內容 */
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .mic-button {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background-color: #e6b17a;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-bottom: 30px;
          cursor: pointer;
          color: #000;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.3s;
        }

        .mic-button:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }

        .mic-button p {
          margin-top: 8px;
          font-size: 14px;
        }

        .selection-section {
          width: 100%;
          max-width: 300px;
        }

        .select-box {
          margin-bottom: 20px;
        }

        .select-box label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 500;
        }

        .star-icon {
          color: #333;
          margin-right: 6px;
        }

        .form-select {
          width: 100%;
          padding: 10px;
          border: 1px solid #d1d1d1;
          border-radius: 4px;
          background-color: #fff;
          font-size: 16px;
          color: #333;
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
