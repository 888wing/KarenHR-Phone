import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Chat() {
  const router = useRouter();
  const { industry, karenType } = router.query;
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const karenPersonalities = {
    strict: {
      name: "Karen",
      tone: "嚴格且直接，不喜歡模糊的回答",
      questions: [
        "你為什麼想加入我們公司？請具體說明。",
        "描述一下你過去工作中最具挑戰性的項目，你是如何解決的？",
        "你認為你的技能和經驗如何符合這個職位的要求？請舉例說明。",
        "你如何處理工作中的衝突和壓力？給我一個具體的例子。",
        "如果我們現在聘用你，你能為團隊帶來什麼？"
      ]
    },
    detailed: {
      name: "Karen",
      tone: "非常注重細節，會不斷追問細節",
      questions: [
        "請詳細說明你在上一份工作中的日常職責，包括你使用的工具和流程。",
        "你提到你有相關經驗，請具體描述一下你做了什麼，使用了哪些技術，花了多長時間？",
        "關於你提到的項目，能否詳細說明你的具體貢獻，以及你如何測量你的成功？",
        "你說你擅長解決問題，請給我一個具體的例子，包括問題的背景，你的解決步驟和最終結果。",
        "對於這個職位所需的技能X，你有多少年經驗？你最後一次使用是什麼時候？用在什麼項目上？"
      ]
    },
    impatient: {
      name: "Karen",
      tone: "急躁且缺乏耐心，喜歡簡短直接的回答",
      questions: [
        "簡單說明為什麼我們應該聘用你而不是其他候選人？",
        "你能快速總結一下你的主要技能嗎？不要說太多。",
        "你的職業目標是什麼？請簡短回答。",
        "你能在多短時間內開始工作？",
        "有什麼問題想問我嗎？請保持簡短。"
      ]
    },
    skeptical: {
      name: "Karen",
      tone: "質疑一切，總是懷疑你的能力和經驗",
      questions: [
        "你的履歷中說你擅長X，但我不太確信。你能證明這一點嗎？",
        "你說你在前公司取得了很大成就，有任何具體數據可以支持這一說法嗎？",
        "這個項目聽起來不是很複雜，你為什麼認為這展示了你的能力？",
        "你聲稱你有很強的團隊協作能力，但你提到的例子似乎都是個人成就。這是為什麼？",
        "你的技術能力似乎沒有我們需要的那麼深入，你認為你真的適合這個職位嗎？"
      ]
    }
  };

  const selectedKaren = karenPersonalities[karenType] || karenPersonalities.strict;

  useEffect(() => {
    if (industry && karenType && messages.length === 0) {
      // 模擬Karen發送第一條問候消息
      const initialMessage = {
        id: 1,
        sender: "karen",
        text: "你好，我是今天負責面試的Karen。請問你準備好開始面試了嗎？",
        timestamp: new Date().toISOString()
      };

      setMessages([initialMessage]);
    }
  }, [industry, karenType, messages.length]);

  useEffect(() => {
    // 自動滾動到最新消息
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // 添加用戶消息
    const userMessage = {
      id: messages.length + 1,
      sender: "user",
      text: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // 模擬Karen的回應
    setTimeout(() => {
      generateKarenResponse(inputMessage);
      setIsLoading(false);
    }, 1500);
  };

  const generateKarenResponse = (userInput) => {
    // 根據用戶輸入和Karen性格生成回應
    const userInputLower = userInput.toLowerCase();
    let response = "";

    // 如果是面試初期
    if (messages.length <= 2) {
      response = selectedKaren.questions[0];
    } else {
      // 根據當前對話階段選擇問題
      const questionIndex = Math.min(Math.floor((messages.length - 1) / 2), selectedKaren.questions.length - 1);

      // 檢查用戶回答是否太簡短
      if (userInput.length < 20) {
        response = karenResponseToShortAnswer();
      } 
      // 檢查用戶是否只是簡單肯定
      else if (userInputLower.includes('yes') || userInputLower.includes('ok') || userInputLower.includes('sure') || 
               userInputLower.includes('好的') || userInputLower.includes('可以') || userInputLower.includes('是的')) {
        response = "這種簡單的回答在面試中是不夠的。請更詳細地回答我的問題。";
      }
      // 正常情況：提出下一個問題
      else {
        response = getFeedbackBasedOnPersonality() + selectedKaren.questions[questionIndex];
      }
    }

    const karenMessage = {
      id: messages.length + 2,
      sender: "karen",
      text: response,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, karenMessage]);
  };

  const karenResponseToShortAnswer = () => {
    // 根據Karen的性格，對簡短回答的不同反應
    switch(karenType) {
      case 'strict':
        return "你的回答太簡短了。我需要更具體的資訊。請詳細回答這個問題：";
      case 'detailed':
        return "這完全沒有提供我需要的細節。請更詳細地說明，包括具體的例子和數據：";
      case 'impatient':
        return "雖然我喜歡簡短的回答，但這太簡單了。請再多提供一些資訊：";
      case 'skeptical':
        return "這種簡短的回答讓我更加懷疑你的能力。請提供更多證據支持你的觀點：";
      default:
        return "請提供更詳細的回答：";
    }
  };

  const getFeedbackBasedOnPersonality = () => {
    // 根據Karen的性格生成對前一個回答的反饋
    const feedbacks = {
      strict: [
        "我明白了，但你的回答缺乏具體性。",
        "我需要更直接的回答。",
        "這不是我想聽的回答方式。",
        "請注意回答的準確性和相關性。"
      ],
      detailed: [
        "你提供的資訊不夠詳細。",
        "我需要更多具體的例子和數據。",
        "請再深入一點，告訴我更多細節。",
        "你的回答缺少關鍵的細節。"
      ],
      impatient: [
        "好的，我們繼續。",
        "我們時間有限，讓我們繼續下一個問題。",
        "簡單明了，但還不夠。",
        "我希望接下來的回答能更有針對性。"
      ],
      skeptical: [
        "這聽起來不太可信。",
        "我仍然不太確信你的能力。",
        "這個例子並不能充分證明你的專業水平。",
        "我需要更有說服力的證據。"
      ]
    };

    const personalityFeedbacks = feedbacks[karenType] || feedbacks.strict;
    return personalityFeedbacks[Math.floor(Math.random() * personalityFeedbacks.length)] + " ";
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleScoreClick = () => {
    router.push('/score');
  };

  return (
    <>
      <Head>
        <title>面試對話 | AI Karen</title>
        <meta name="description" content="正在與AI Karen進行面試模擬" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      <div className="mobile-container">
        {/* 頂部導航欄 */}
        <div className="top-bar">
          <div className="profile-pic">
            <img src="/profile-pic.png" alt="Profile" />
          </div>
          <div className="menu-icon">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
            </svg>
          </div>
        </div>

        {/* 聊天區域 */}
        <div className="chat-area">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`message-container ${message.sender === "karen" ? "karen-message" : "user-message"}`}
            >
              {message.sender === "karen" && (
                <div className="avatar karen-avatar">
                  <div className="avatar-icon"></div>
                </div>
              )}
              <div className="message-bubble">
                {message.sender === "karen" && <div className="sender-name">Karen</div>}
                <div className="message-text">{message.text}</div>
                <div className="message-time">{formatTime(message.timestamp)}</div>
              </div>
              {message.sender === "user" && (
                <div className="avatar user-avatar">
                  <div className="avatar-icon"></div>
                </div>
              )}
              {message.sender === "user" && (
                <div className="interviewer-label">interviewer</div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="message-container karen-message">
              <div className="avatar karen-avatar">
                <div className="avatar-icon"></div>
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

        {/* 輸入區域 */}
        <div className="input-area">
          <input
            type="text"
            placeholder="輸入些什麼..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="message-input"
          />
          <button onClick={handleSendMessage} className="send-button">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
            </svg>
          </button>
        </div>

        {/* 底部導航欄 */}
        <div className="bottom-nav">
          <div className="nav-item active">
            <div className="nav-icon karen-pro">A</div>
            <span>Karen Pro</span>
          </div>
          <div className="nav-item" onClick={handleScoreClick}>
            <div className="nav-icon">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4zm2 2H5V5h14v14z"></path>
              </svg>
            </div>
            <span>統計</span>
          </div>
          <div className="nav-item">
            <div className="nav-icon">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"></path>
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
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        /* 頂部導航欄 */
        .top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          background-color: #fdf6e3;
          border-bottom: 1px solid rgba(0,0,0,0.05);
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

        /* 聊天區域 */
        .chat-area {
          flex: 1;
          padding: 15px;
          overflow-y: auto;
          background-color: #fdf6e3;
        }

        .message-container {
          display: flex;
          margin-bottom: 15px;
          position: relative;
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
          background-color: #e0e0e0;
        }

        .karen-avatar {
          background-color: #e0e0e0;
        }

        .user-avatar {
          margin-right: 0;
          margin-left: 10px;
          background-color: #3f51b5;
          color: white;
        }

        .avatar-icon {
          width: 20px;
          height: 20px;
          border-radius: 50%;
        }

        .message-bubble {
          max-width: 70%;
          padding: 10px 15px;
          border-radius: 18px;
          position: relative;
        }

        .karen-message .message-bubble {
          background-color: #ffeeb3;
          border-top-left-radius: 0;
        }

        .user-message .message-bubble {
          background-color: #ffeeb3;
          border-top-right-radius: 0;
          text-align: right;
        }

        .sender-name {
          font-size: 12px;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .message-text {
          font-size: 14px;
          line-height: 1.4;
          word-break: break-word;
        }

        .message-time {
          font-size: 10px;
          color: #777;
          margin-top: 4px;
          text-align: right;
        }

        .interviewer-label {
          position: absolute;
          bottom: -15px;
          right: 46px;
          font-size: 10px;
          color: #777;
        }

        /* 打字指示器 */
        .typing-indicator {
          padding: 12px 15px;
          display: flex;
          align-items: center;
        }

        .dot {
          width: 8px;
          height: 8px;
          background-color: #777;
          border-radius: 50%;
          margin: 0 2px;
          animation: bounce 1.5s infinite;
        }

        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes bounce {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-5px);
          }
        }

        /* 輸入區域 */
        .input-area {
          padding: 15px;
          display: flex;
          background-color: #fdf6e3;
          border-top: 1px solid rgba(0,0,0,0.05);
        }

        .message-input {
          flex: 1;
          padding: 10px 15px;
          border: 1px solid #ddd;
          border-radius: 20px;
          font-size: 14px;
          outline: none;
          background-color: white;
        }

        .send-button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #e6b17a;
          border: none;
          margin-left: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
        }

        /* 底部導航欄 */
        .bottom-nav {
          display: flex;
          background-color: #e6b17a;
          border-top: 1px solid rgba(0,0,0,0.1);
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