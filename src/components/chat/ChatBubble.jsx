// components/chat/ChatBubble.jsx
import React from "react";

export function ChatBubble({ message, formatTime }) {
  const isKaren = message.sender === "karen";

  return (
    <div
      className={`message-container ${isKaren ? "karen-message" : "user-message"}`}
    >
      {isKaren && (
        <div className="avatar karen-avatar">
          <div className="avatar-icon">K</div>
        </div>
      )}

      <div className="message-bubble">
        {isKaren && <div className="sender-name">Karen</div>}
        <div className="message-text">{message.text}</div>
        <div className="message-time">{formatTime(message.timestamp)}</div>
      </div>

      {!isKaren && (
        <div className="avatar user-avatar">
          <div className="avatar-icon">Y</div>
        </div>
      )}

      {!isKaren && <div className="interviewer-label">interviewer</div>}

      <style jsx>{`
        .message-container {
          display: flex;
          margin-bottom: 20px;
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
          color: white;
          font-weight: bold;
        }

        .karen-avatar {
          background-color: #d8365d;
        }

        .user-avatar {
          margin-right: 0;
          margin-left: 10px;
          background-color: #3f51b5;
        }

        .avatar-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .message-bubble {
          max-width: 70%;
          padding: 10px 15px;
          border-radius: 18px;
          position: relative;
        }

        .karen-message .message-bubble {
          background-color: #ffe8b3;
          border-top-left-radius: 0;
        }

        .user-message .message-bubble {
          background-color: #e6e6e6;
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
      `}</style>
    </div>
  );
}

// components/chat/TypingIndicator.jsx
export function TypingIndicator() {
  return (
    <div className="message-container karen-message">
      <div className="avatar karen-avatar">
        <div className="avatar-icon">K</div>
      </div>

      <div className="message-bubble typing-indicator">
        <div className="dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>

      <style jsx>{`
        .message-container {
          display: flex;
          margin-bottom: 15px;
        }

        .karen-message {
          justify-content: flex-start;
        }

        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 10px;
          background-color: #d8365d;
          color: white;
          font-weight: bold;
        }

        .message-bubble {
          padding: 15px;
          border-radius: 18px;
          background-color: #ffe8b3;
          border-top-left-radius: 0;
        }

        .typing-indicator {
          padding: 12px 15px;
          min-width: 60px;
        }

        .dots {
          display: flex;
          align-items: center;
        }

        .dot {
          width: 8px;
          height: 8px;
          background-color: #888;
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
          0%,
          60%,
          100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </div>
  );
}

// components/chat/ChatInput.jsx
export function ChatInput({
  inputMessage,
  setInputMessage,
  handleSendMessage,
  handleKeyPress,
}) {
  return (
    <div className="input-area">
      <input
        type="text"
        placeholder="輸入您的回答..."
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        className="message-input"
      />

      <button
        onClick={handleSendMessage}
        disabled={!inputMessage.trim()}
        className={`send-button ${!inputMessage.trim() ? "disabled" : ""}`}
      >
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path
            fill="currentColor"
            d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"
          ></path>
        </svg>
      </button>

      <style jsx>{`
        .input-area {
          padding: 15px;
          display: flex;
          background-color: #fef9e3;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
        }

        .message-input {
          flex: 1;
          padding: 12px 15px;
          border: 1px solid #ddd;
          border-radius: 24px;
          font-size: 14px;
          outline: none;
          background-color: white;
        }

        .send-button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #e6aa63;
          border: none;
          margin-left: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .send-button:hover {
          background-color: #d89f5c;
        }

        .send-button.disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
