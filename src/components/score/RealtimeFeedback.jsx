import React from "react";

const RealtimeFeedback = ({ feedback }) => {
  return (
    <div className="realtime-feedback">
      {/* 顯示即時反饋的內容 */}
      <p>{feedback}</p>
    </div>
  );
};

export default RealtimeFeedback;
