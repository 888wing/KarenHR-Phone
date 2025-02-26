import { useState } from "react";

/**
 * 聊天輸入組件
 * @param {Object} props - 組件屬性
 * @param {Function} props.onSendMessage - 發送消息的回調函數
 * @param {boolean} props.disabled - 是否禁用輸入
 */
export default function ChatInput({ onSendMessage, disabled = false }) {
  const [message, setMessage] = useState("");

  // 處理輸入變化
  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  // 處理發送消息
  const handleSendMessage = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage("");
    }
  };

  // 處理按鍵輸入 (Enter 鍵發送消息)
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="input-area">
      <input
        type="text"
        className="message-input"
        placeholder="輸入些什麼..."
        value={message}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        disabled={disabled}
      />
      <button
        className="send-button"
        onClick={handleSendMessage}
        disabled={disabled || !message.trim()}
      >
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path
            fill="currentColor"
            d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"
          ></path>
        </svg>
      </button>

      <style jsx>{`
        .send-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }

        .message-input:disabled {
          background-color: #f5f5f5;
          color: #999;
        }
      `}</style>
    </div>
  );
}
