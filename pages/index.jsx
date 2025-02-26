import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [industry, setIndustry] = useState("tech");
  const [karenType, setKarenType] = useState("strict");
  const [language, setLanguage] = useState("zh_TW"); // 新增語言選擇
  const [isPremium, setIsPremium] = useState(false);
  const [usageData, setUsageData] = useState({ count: 0, limit: 10 });

  // 檢查用戶狀態
  useEffect(() => {
    // 從localStorage讀取用戶類型和使用情況
    try {
      const currentMonth =
        new Date().getMonth() + "-" + new Date().getFullYear();
      const storedData = JSON.parse(localStorage.getItem("karenUsage") || "{}");
      const premium = localStorage.getItem("karePremium") === "true";

      setIsPremium(premium);

      if (!storedData.month || storedData.month !== currentMonth) {
        // 新的月份，重置計數
        const newData = {
          month: currentMonth,
          count: 0,
          premium: premium,
        };
        localStorage.setItem("karenUsage", JSON.stringify(newData));
        setUsageData({ count: 0, limit: premium ? 50 : 10 });
      } else {
        setUsageData({
          count: storedData.count || 0,
          limit: premium ? 50 : 10,
        });
      }
    } catch (e) {
      console.error("Error loading user data:", e);
      setUsageData({ count: 0, limit: 10 });
    }
  }, []);

  // 處理升級到付費版
  const handleUpgrade = () => {
    // 在實際應用中，這裡應該導向支付頁面
    const confirmed = window.confirm(
      "升級到Karen AI付費版可獲得更多功能和使用次數。繼續進行升級？",
    );
    if (confirmed) {
      // 模擬付費成功
      localStorage.setItem("karePremium", "true");
      setIsPremium(true);
      alert("恭喜！您已成功升級到付費版。");
    }
  };

  // 開始面試
  const handleStartInterview = () => {
    // 檢查是否達到使用限制
    if (usageData.count >= usageData.limit) {
      alert(
        `您已達到本月免費使用限制(${usageData.limit}次)。請升級到付費版繼續使用。`,
      );
      return;
    }

    // 免費版用戶不能自選行業和Karen類型
    if (!isPremium) {
      // 免費版固定使用科技業和嚴格型Karen
      router.push({
        pathname: "/chat",
        query: {
          industry: "tech",
          karenType: "strict",
          language: language,
          premium: "false",
        },
      });
    } else {
      // 付費版可以自由選擇
      if (!industry || !karenType) {
        alert("請選擇產業和Karen類型");
        return;
      }

      router.push({
        pathname: "/chat",
        query: {
          industry,
          karenType,
          language,
          premium: "true",
        },
      });
    }
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
          <div className="title-container">
            <h1 className="app-title">Karen AI</h1>
            <p className="app-subtitle">面試訓練助手</p>
          </div>
          <div className="premium-badge" onClick={handleUpgrade}>
            {isPremium ? "PRO" : "免費版"}
          </div>
        </div>

        {/* 升級橫幅 */}
        {!isPremium && (
          <div className="upgrade-banner">
            <div className="banner-content">
              <div className="banner-text">
                <h3>升級到付費版</h3>
                <p>解鎖自定義面試、50次每月使用量、高級AI...</p>
              </div>
              <button className="upgrade-button" onClick={handleUpgrade}>
                立即升級
              </button>
            </div>
          </div>
        )}

        {/* 使用情況顯示 */}
        <div className="usage-display">
          <div className="usage-text">
            本月已使用:{" "}
            <span className="usage-highlight">
              {usageData.count}/{usageData.limit}
            </span>
          </div>
          <div className="usage-bar">
            <div
              className="usage-progress"
              style={{
                width: `${Math.min(100, (usageData.count / usageData.limit) * 100)}%`,
              }}
            ></div>
          </div>
        </div>

        {/* 主要內容 */}
        <div className="main-content">
          <div className="mic-button" onClick={handleStartInterview}>
            <div className="mic-icon">
              <svg viewBox="0 0 24 24" width="48" height="48">
                <path
                  fill="currentColor"
                  d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"
                />
                <path
                  fill="currentColor"
                  d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"
                />
              </svg>
            </div>
            <p>開始面試</p>
          </div>

          {/* 語言選擇 */}
          <div className="selection-section">
            <div className="select-box">
              <label>
                <span className="option-icon">🌐</span> 語言
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="form-select"
              >
                <option value="zh_TW">繁體中文</option>
                <option value="en">English</option>
              </select>
            </div>

            {/* 付費版顯示更多選項 */}
            {isPremium && (
              <>
                <div className="select-box">
                  <label>
                    <span className="option-icon">🏢</span> 產業 (Pro)
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="form-select"
                  >
                    <option value="tech">科技業</option>
                    <option value="finance">金融業</option>
                    <option value="healthcare">醫療保健</option>
                    <option value="education">教育業</option>
                    <option value="retail">零售業</option>
                  </select>
                </div>

                <div className="select-box">
                  <label>
                    <span className="option-icon">👩‍💼</span> Karen類型 (Pro)
                  </label>
                  <select
                    value={karenType}
                    onChange={(e) => setKarenType(e.target.value)}
                    className="form-select"
                  >
                    <option value="strict">嚴格型Karen</option>
                    <option value="detailed">細節控Karen</option>
                    <option value="impatient">急性子Karen</option>
                    <option value="skeptical">質疑型Karen</option>
                  </select>
                </div>
              </>
            )}

            {/* 免費版顯示未解鎖選項 */}
            {!isPremium && (
              <>
                <div className="select-box disabled">
                  <div className="locked-option">
                    <label>
                      <span className="option-icon">🏢</span> 產業
                    </label>
                    <div className="lock-icon">🔒</div>
                  </div>
                  <select className="form-select" disabled>
                    <option>升級解鎖更多產業選擇</option>
                  </select>
                </div>

                <div className="select-box disabled">
                  <div className="locked-option">
                    <label>
                      <span className="option-icon">👩‍💼</span> Karen類型
                    </label>
                    <div className="lock-icon">🔒</div>
                  </div>
                  <select className="form-select" disabled>
                    <option>升級解鎖更多Karen類型</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 底部導航欄 */}
        <div className="bottom-nav">
          <div className="nav-item active">
            <div className="nav-icon">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path
                  fill="currentColor"
                  d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"
                ></path>
              </svg>
            </div>
            <span>首頁</span>
          </div>
          <div className="nav-item" onClick={handleStartInterview}>
            <div className="nav-icon">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  fill="currentColor"
                  fillOpacity="0.2"
                />
                <path
                  fill="currentColor"
                  d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                />
              </svg>
            </div>
            <span>開始</span>
          </div>
          <div className="nav-item" onClick={handleUpgrade}>
            <div className={`nav-icon ${isPremium ? "premium-active" : ""}`}>
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path
                  fill="currentColor"
                  d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"
                />
              </svg>
            </div>
            <span>{isPremium ? "Pro" : "升級"}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* 移動裝置容器 */
        .mobile-container {
          max-width: 420px;
          min-height: 100vh;
          margin: 0 auto;
          background: linear-gradient(145deg, #f8f3e8, #fdf6e3);
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
          background: linear-gradient(to right, #e6b17a, #e4997e);
          border-bottom-left-radius: 15px;
          border-bottom-right-radius: 15px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .profile-pic {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          background-color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .profile-pic img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .title-container {
          text-align: center;
          color: white;
        }

        .app-title {
          margin: 0;
          font-size: 22px;
          font-weight: bold;
          letter-spacing: 1px;
        }

        .app-subtitle {
          margin: 0;
          font-size: 12px;
          opacity: 0.9;
        }

        .premium-badge {
          background-color: white;
          color: #e6b17a;
          padding: 5px 12px;
          border-radius: 15px;
          font-size: 12px;
          font-weight: bold;
          cursor: pointer;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .premium-badge:hover {
          transform: scale(1.05);
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
        }

        /* 升級橫幅 */
        .upgrade-banner {
          margin: 15px;
          background: linear-gradient(135deg, #6e8efb, #a777e3);
          border-radius: 12px;
          padding: 15px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .banner-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .banner-text {
          color: white;
        }

        .banner-text h3 {
          margin: 0 0 5px 0;
          font-size: 16px;
        }

        .banner-text p {
          margin: 0;
          font-size: 12px;
          opacity: 0.9;
        }

        .upgrade-button {
          background-color: white;
          color: #a777e3;
          border: none;
          padding: 8px 15px;
          border-radius: 20px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .upgrade-button:hover {
          transform: scale(1.05);
        }

        /* 使用情況顯示 */
        .usage-display {
          margin: 15px 15px 0;
          padding: 10px;
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        }

        .usage-text {
          font-size: 12px;
          color: #666;
          margin-bottom: 5px;
        }

        .usage-highlight {
          font-weight: bold;
          color: ${usageData.count > usageData.limit * 0.8
            ? "#d8365d"
            : "#333"};
        }

        .usage-bar {
          height: 6px;
          background-color: #f0f0f0;
          border-radius: 3px;
          overflow: hidden;
        }

        .usage-progress {
          height: 100%;
          background: linear-gradient(
            to right,
            #4caf50,
            ${usageData.count > usageData.limit * 0.8 ? "#d8365d" : "#e6b17a"}
          );
          transition: width 0.3s ease;
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
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: linear-gradient(145deg, #e6b17a, #d8a067);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-bottom: 30px;
          cursor: pointer;
          color: white;
          box-shadow: 0 8px 15px rgba(216, 160, 103, 0.3);
          transition: all 0.3s;
        }

        .mic-button:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 20px rgba(216, 160, 103, 0.4);
        }

        .mic-icon {
          margin-bottom: 5px;
        }

        .mic-button p {
          margin: 5px 0 0;
          font-size: 16px;
          font-weight: 500;
        }

        .selection-section {
          width: 100%;
          max-width: 320px;
          margin-top: 20px;
        }

        .select-box {
          margin-bottom: 20px;
          background-color: white;
          padding: 12px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .select-box.disabled {
          opacity: 0.7;
        }

        .select-box label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #333;
        }

        .locked-option {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .lock-icon {
          font-size: 14px;
        }

        .option-icon {
          margin-right: 6px;
        }

        .form-select {
          width: 100%;
          padding: 10px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          background-color: #f9f9f9;
          font-size: 14px;
          color: #333;
          outline: none;
        }

        .form-select:focus {
          border-color: #e6b17a;
          box-shadow: 0 0 0 2px rgba(230, 177, 122, 0.2);
        }

        /* 底部導航欄 */
        .bottom-nav {
          display: flex;
          background: linear-gradient(to right, #e6b17a, #e4997e);
          padding: 12px 0;
          border-top-left-radius: 15px;
          border-top-right-radius: 15px;
        }

        .nav-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
        }

        .nav-item:hover {
          transform: translateY(-2px);
        }

        .nav-icon {
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-item.active::after {
          content: "";
          position: absolute;
          bottom: -12px;
          width: 40%;
          height: 3px;
          background-color: white;
          border-radius: 3px;
        }

        .premium-active {
          color: #ffd700;
        }
      `}</style>
    </>
  );
}
