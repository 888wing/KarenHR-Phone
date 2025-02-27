import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Layout from "../src/components/Layout";
import { calculateInterviewProgress } from "../src/lib/api/aiService";
import RealtimeFeedback from "../components/RealtimeFeedback";
import {
  evaluateInterview,
  saveEvaluationResult,
} from "../src/lib/api/evaluationService";
import { generateResponse } from "../src/lib/api/index";

export default function Chat() {
  const router = useRouter();
  const { industry, karenType, language, premium } = router.query;
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [progress, setProgress] = useState(0);
  const [usageCount, setUsageCount] = useState(0);
  const [monthlyLimit, setMonthlyLimit] = useState(10);
  const [usageWarning, setUsageWarning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // 添加錯誤消息狀態
  const messagesEndRef = useRef(null);

  // 初始化狀態
  useEffect(() => {
    if (premium === "true") {
      setIsPremium(true);
      setMonthlyLimit(50);
    }

    // 從localStorage讀取當月使用次數
    try {
      const currentMonth =
        new Date().getMonth() + "-" + new Date().getFullYear();
      const usageData = JSON.parse(localStorage.getItem("karenUsage") || "{}");

      // 如果是新的月份，重置計數
      if (!usageData.month || usageData.month !== currentMonth) {
        localStorage.setItem(
          "karenUsage",
          JSON.stringify({
            month: currentMonth,
            count: 0,
            premium: isPremium,
          }),
        );
        setUsageCount(0);
      } else {
        setUsageCount(usageData.count || 0);
      }
    } catch (e) {
      console.error("Error loading usage data:", e);
      setUsageCount(0);
    }
  }, [premium]);

  // 當路由準備好時，初始化聊天
  useEffect(() => {
    if (industry && karenType && messages.length === 0) {
      // 添加初始歡迎消息
      initializeChat();
    }
  }, [industry, karenType, messages.length, language, isPremium]);

  // 將使用數據保存到localStorage
  const updateUsageData = (count, premium) => {
    const currentMonth = new Date().getMonth() + "-" + new Date().getFullYear();
    localStorage.setItem(
      "karenUsage",
      JSON.stringify({
        month: currentMonth,
        count: count,
        premium: premium,
      }),
    );
    // 也保存用戶類型
    localStorage.setItem("karePremium", premium.toString());
  };

  // 設置當前問題
  useEffect(() => {
    if (messages.length > 0) {
      const lastKarenMessage = [...messages]
        .reverse()
        .find((msg) => msg.sender === "karen");

      if (lastKarenMessage) {
        setCurrentQuestion(lastKarenMessage.text);
      }
    }
  }, [messages]);

  // 初始化聊天
  const initializeChat = async () => {
    setIsLoading(true);
    setErrorMessage(""); // 清除錯誤消息
    try {
      // 使用 API 獲取初始問候語
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [],
          karenType,
          industry,
          isPremium,
          language: language || "zh_TW",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API初始化錯誤:", errorData);
        throw new Error(errorData.error || "API初始化失敗");
      }

      const data = await response.json();
      console.log("初始化回應:", data);

      const initialMessage = {
        id: 1,
        sender: "karen",
        text: data.text || getDefaultGreeting(language),
        timestamp: data.timestamp || new Date().toISOString(),
      };

      setMessages([initialMessage]);
    } catch (error) {
      console.error("初始化聊天時出錯:", error);
      const fallbackMessage = {
        id: 1,
        sender: "karen",
        text: getDefaultGreeting(language),
        timestamp: new Date().toISOString(),
      };
      setMessages([fallbackMessage]);
      setErrorMessage("連接到AI服務時發生錯誤，使用預設問候語");
    } finally {
      setIsLoading(false);
    }
  };

  // 根據語言獲取默認問候語
  const getDefaultGreeting = (lang) => {
    if (lang === "en") {
      return "Hello, I'm Karen, your interviewer today. Please introduce yourself and tell me about your background and experience.";
    }
    return "你好，我是今天負責面試的Karen。請先做個自我介紹，告訴我你的相關背景和經驗。";
  };

  // 自動滾動到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 更新進度
  useEffect(() => {
    const currentProgress = calculateInterviewProgress(messages);
    setProgress(currentProgress);
  }, [messages]);

  // 處理發送消息
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      // 添加用戶消息
      const userMessage = {
        id: Date.now(),
        sender: 'user',
        text: inputMessage,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');

      // 獲取 AI 回應
      const response = await generateResponse(
        messages.concat(userMessage),
        karenType,
        industry,
        isPremium,
        language
      );

      // 添加 Karen 的回應
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'karen',
        text: response.text,
        timestamp: response.timestamp,
      }]);

    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 升級到付費版
  const handleUpgrade = () => {
    const confirmed = window.confirm(
      "升級到Karen AI付費版可獲得更多功能和使用次數。繼續進行升級？",
    );
    if (confirmed) {
      // 模擬付費成功
      setIsPremium(true);
      setMonthlyLimit(50);
      updateUsageData(usageCount, true);
      // 重載頁面以應用變更
      router.reload();
    }
  };

  // 按 Enter 發送消息
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 格式化時間
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // 導航到評分頁面
  const handleScoreClick = () => {
    // 將當前對話傳遞給評分頁面
    router.push({
      pathname: "/score",
      query: {
        industry,
        karenType,
        language: language || "zh_TW",
        messages: JSON.stringify(messages),
      },
    });
  };

  // 返回首頁
  const handleHomeClick = () => {
    const confirmed = window.confirm(
      language === "en"
        ? "Are you sure you want to end this interview and return to the home page?"
        : "確定要結束當前面試並返回首頁嗎？",
    );
    if (confirmed) {
      router.push("/");
    }
  };

  // 獲取顯示的產業名稱
  const getIndustryName = () => {
    const industryNames = {
      tech: language === "en" ? "Tech" : "科技產業",
      finance: language === "en" ? "Finance" : "金融產業",
      healthcare: language === "en" ? "Healthcare" : "醫療保健",
      education: language === "en" ? "Education" : "教育產業",
      retail: language === "en" ? "Retail" : "零售產業",
    };
    return (
      industryNames[industry] ||
      (language === "en" ? "Unspecified" : "未指定產業")
    );
  };

  // 獲取顯示的Karen類型名稱
  const getKarenTypeName = () => {
    const karenTypes = {
      strict: language === "en" ? "Strict" : "嚴格型",
      detailed: language === "en" ? "Detail-oriented" : "細節控",
      impatient: language === "en" ? "Impatient" : "急性子",
      skeptical: language === "en" ? "Skeptical" : "質疑型",
    };
    return karenTypes[karenType] || (language === "en" ? "Standard" : "標準型");
  };

  // 重試連接
  const handleRetry = () => {
    if (messages.length === 0) {
      initializeChat();
    } else {
      // 移除最後一條錯誤消息（如果有的話）
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.sender === "karen") {
        setMessages((prev) => prev.slice(0, -1));
        handleSendMessage();
      }
    }
  };

  return (
    <Layout isPremium={isPremium}>
      <Head>
        <title>面試對話 | AI Karen</title>
        <meta name="description" content="AI Karen 面試訓練進行中" />
      </Head>

      <div className="mobile-container">
        <div className="usage-info">
          <div className="usage-count">
            {usageCount}/{monthlyLimit}
            <span className="usage-label">
              {language === "en" ? "Used this month" : "本月使用"}
            </span>
          </div>
        </div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          <div className="progress-text">
            {language === "en" ? "Interview Progress" : "面試進度"}:{" "}
            {Math.round(progress)}% ({Math.min(10, Math.floor(progress / 10))}
            /10 {language === "en" ? "questions" : "問題"})
          </div>
        </div>
        {errorMessage && (
          <div className="error-message">
            <p>{errorMessage}</p>
            <button onClick={handleRetry} className="retry-button">
              {language === "en" ? "Retry" : "重試"}
            </button>
          </div>
        )}
        {usageWarning && (
          <div className="usage-warning">
            <p>
              {language === "en"
                ? "You have reached your monthly usage limit!"
                : "您已達到本月使用限制！"}
              {!isPremium
                ? language === "en"
                  ? "Consider upgrading to Pro for more usage."
                  : "考慮升級到付費版以獲得更多使用次數。"
                : ""}
            </p>
            {!isPremium && (
              <button onClick={handleUpgrade} className="upgrade-button">
                {language === "en" ? "Upgrade Now" : "立即升級"}
              </button>
            )}
            <button
              onClick={() => setUsageWarning(false)}
              className="dismiss-button"
            >
              {language === "en" ? "Got it" : "知道了"}
            </button>
          </div>
        )}
        {!isPremium && !usageWarning && (
          <div className="upgrade-prompt">
            <p>
              {language === "en"
                ? "Upgrade to Pro for advanced AI, more industries & personas"
                : "升級到Pro版以獲得進階AI、更多產業和面試官類型"}
            </p>
            <button onClick={handleUpgrade} className="mini-upgrade-btn">
              {language === "en" ? "Upgrade" : "升級"}
            </button>
          </div>
        )}
        <div className="chat-area">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message-container ${message.sender === "karen" ? "karen-message" : "user-message"}`}
            >
              {message.sender === "karen" && (
                <div className="avatar karen-avatar">
                  <div className="avatar-icon">K</div>
                </div>
              )}
              <div className="message-bubble">
                {message.sender === "karen" && (
                  <div className="sender-name">
                    Karen
                    {isPremium ? (
                      <span className="premium-tag">ChatGPT</span>
                    ) : (
                      <span className="free-tag">Gemini</span>
                    )}
                  </div>
                )}
                <div className="message-text">{message.text}</div>
                <div className="message-time">
                  {formatTime(message.timestamp)}
                </div>
              </div>
              {message.sender === "user" && (
                <div className="avatar user-avatar">
                  <div className="avatar-icon">Me</div>
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="message-container karen-message">
              <div className="avatar karen-avatar">
                <div className="avatar-icon">K</div>
              </div>
              <div className="message-bubble typing-indicator">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <RealtimeFeedback
          userInput={inputMessage}
          question={currentQuestion}
          context={{ industry, karenType }}
        />
        <div className="input-area">
          <input
            type="text"
            placeholder={
              language === "en" ? "Type something..." : "輸入些什麼..."
            }
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="message-input"
            disabled={
              progress >= 100 || usageCount >= monthlyLimit || isLoading
            }
          />
          <button
            onClick={handleSendMessage}
            className={`send-button ${progress >= 100 || usageCount >= monthlyLimit || isLoading ? "disabled" : ""}`}
            disabled={
              progress >= 100 || usageCount >= monthlyLimit || isLoading
            }
          >
            {isLoading ? (
              <div className="spinner-small"></div>
            ) : (
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path
                  fill="currentColor"
                  d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"
                ></path>
              </svg>
            )}
          </button>
        </div>
        {progress >= 100 && (
          <div className="interview-complete-banner">
            <p>{language === "en" ? "Interview completed!" : "面試已完成！"}</p>
            <button onClick={handleScoreClick} className="score-button">
              {language === "en" ? "View Score" : "查看評分"}
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .mobile-container {
          max-width: 420px;
          height: 100vh;
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

        .usage-info {
          background-color: rgba(255, 255, 255, 0.7);
          padding: 5px 15px;
          display: flex;
          justify-content: flex-end;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .usage-count {
          font-size: 12px;
          color: ${usageCount > monthlyLimit * 0.8 ? "#d8365d" : "#666"};
          background-color: white;
          padding: 3px 8px;
          border-radius: 10px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .usage-label {
          margin-left: 4px;
          font-size: 10px;
          color: #888;
        }

        .progress-container {
          background: rgba(255, 255, 255, 0.5);
          height: 6px;
          width: 100%;
          position: relative;
        }

        .progress-bar {
          background: linear-gradient(to right, #4caf50, #e6b17a);
          height: 100%;
          transition: width 0.3s ease;
          border-radius: 0 3px 3px 0;
        }

        .progress-text {
          font-size: 11px;
          text-align: center;
          padding: 2px 0;
          color: #666;
          background-color: rgba(255, 255, 255, 0.7);
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        .error-message {
          background-color: #ffebee;
          border-left: 4px solid #d8365d;
          padding: 10px 15px;
          margin: 10px;
          border-radius: 4px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .error-message p {
          margin: 0;
          color: #d32f2f;
          font-size: 14px;
        }

        .retry-button {
          background-color: #d8365d;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          transition: background-color 0.2s;
        }

        .retry-button:hover {
          background-color: #c62828;
        }

        .usage-warning {
          position: absolute;
          top: 120px;
          left: 20px;
          right: 20px;
          background-color: #fff5f5;
          border: 1px solid #d8365d;
          border-radius: 10px;
          padding: 15px;
          z-index: 10;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          animation: slideDown 0.3s ease-out;
        }

        .upgrade-button {
          background: linear-gradient(to right, #e6b17a, #e4997e);
          border: none;
          color: white;
          padding: 8px 20px;
          border-radius: 20px;
          font-weight: bold;
          margin: 10px 5px 0;
          cursor: pointer;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          transition: all 0.3s;
        }

        .upgrade-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .dismiss-button {
          background-color: #f0f0f0;
          border: none;
          color: #666;
          padding: 8px 20px;
          border-radius: 20px;
          margin: 10px 5px 0;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .dismiss-button:hover {
          background-color: #e5e5e5;
        }

        .upgrade-prompt {
          background: linear-gradient(135deg, #6e8efb, #a777e3);
          padding: 8px 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: white;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .upgrade-prompt p {
          margin: 0;
          flex: 1;
        }

        .mini-upgrade-btn {
          background-color: white;
          border: none;
          color: #a777e3;
          padding: 4px 12px;
          border-radius: 15px;
          font-size: 11px;
          font-weight: bold;
          cursor: pointer;
          margin-left: 10px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: all 0.2s;
        }

        .mini-upgrade-btn:hover {
          transform: scale(1.05);
        }

        @keyframes slideDown {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .chat-area {
          flex: 1;
          padding: 15px;
          overflow-y: auto;
          background-color: transparent;
        }

        .message-container {
          display: flex;
          margin-bottom: 15px;
          position: relative;
          animation: fadeIn 0.3s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .karen-message {
          justify-content: flex-start;
        }

        .user-message {
          justify-content: flex-end;
        }

        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 10px;
          font-weight: bold;
          color: white;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .karen-avatar {
          background: linear-gradient(135deg, #d8365d, #e4625f);
          margin-right: 10px;
        }

        .user-avatar {
          margin-right: 0;
          margin-left: 10px;
          background: linear-gradient(135deg, #3f51b5, #5c6bc0);
        }

        .avatar-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          font-size: 14px;
        }

        .message-bubble {
          max-width: 70%;
          padding: 12px 15px;
          border-radius: 18px;
          position: relative;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
        }

        .karen-message .message-bubble {
          background-color: white;
          border-top-left-radius: 4px;
        }

        .user-message .message-bubble {
          background: linear-gradient(135deg, #e3f2fd, #bbdefb);
          border-top-right-radius: 4px;
          text-align: right;
        }

        .sender-name {
          font-size: 12px;
          font-weight: 500;
          margin-bottom: 5px;
          color: #d8365d;
          display: flex;
          align-items: center;
        }

        .premium-tag,
        .free-tag {
          font-size: 8px;
          padding: 2px 5px;
          border-radius: 4px;
          margin-left: 6px;
        }

        .premium-tag {
          background: linear-gradient(to right, #e6b17a, #e4997e);
          color: white;
        }

        .free-tag {
          background: #f0f0f0;
          color: #888;
        }

        .message-text {
          font-size: 14px;
          line-height: 1.5;
          word-break: break-word;
        }

        .message-time {
          font-size: 10px;
          color: #888;
          margin-top: 5px;
          text-align: right;
        }

        .typing-indicator {
          padding: 12px 15px;
          display: flex;
          align-items: center;
          min-width: 80px;
        }

        .dot {
          width: 8px;
          height: 8px;
          background: linear-gradient(to bottom, #d8365d, #e4625f);
          border-radius: 50%;
          margin: 0 3px;
          animation: bounce 1.5s infinite;
        }

        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes bounce {
          0%,
          60%,
          100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-5px);
          }
        }

        .input-area {
          padding: 15px;
          display: flex;
          background-color: rgba(255, 255, 255, 0.8);
          border-top: 1px solid rgba(0, 0, 0, 0.05);
        }

        .message-input {
          flex: 1;
          padding: 12px 15px;
          border: 1px solid #e0e0e0;
          border-radius: 24px;
          font-size: 14px;
          outline: none;
          background-color: white;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
          transition: all 0.3s;
        }

        .message-input:focus {
          border-color: #e6b17a;
          box-shadow: 0 0 0 2px rgba(230, 177, 122, 0.2);
        }

        .message-input:disabled {
          background-color: #f5f5f5;
          color: #999;
          cursor: not-allowed;
        }

        .send-button {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: linear-gradient(to right, #e6b17a, #e4997e);
          border: none;
          margin-left: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          box-shadow: 0 2px 5px rgba(216, 160, 103, 0.3);
          transition: all 0.3s;
        }

        .send-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(216, 160, 103, 0.4);
        }

        .send-button.disabled {
          background: linear-gradient(to right, #cccccc, #bbbbbb);
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .spinner-small {
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top: 2px solid white;
          width: 16px;
          height: 16px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .interview-complete-banner {
          position: absolute;
          bottom: 80px;
          left: 0;
          right: 0;
          background: linear-gradient(
            to right,
            rgba(230, 177, 122, 0.9),
            rgba(228, 153, 126, 0.9)
          );
          color: white;
          padding: 15px;
          text-align: center;
          box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
          animation: slideUp 0.5s ease-out;
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .score-button {
          background-color: white;
          color: #e6b17a;
          border: none;
          padding: 8px 20px;
          border-radius: 20px;
          font-weight: bold;
          margin-top: 8px;
          cursor: pointer;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          transition: all 0.3s;
        }

        .score-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </Layout>
  );
}
