import Image from "next/image";

/**
 * 打字指示器組件，顯示當 Karen 正在輸入時的狀態
 */
export default function TypingIndicator() {
  return (
    <div className="message-container karen-message">
      <div className="avatar karen-avatar">
        <Image
          src="/images/karen-avatar.png"
          alt="Karen"
          width={36}
          height={36}
          style={{ borderRadius: "50%", objectFit: "cover" }}
          onError={(e) => {
            // 圖片載入錯誤時替換為默認頭像
            e.target.onerror = null;
            e.target.src =
              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="%23999999"%3E%3Cpath d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"%3E%3C/path%3E%3C/svg%3E';
          }}
        />
      </div>
      <div className="message-bubble typing-indicator">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
  );
}
