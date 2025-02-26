import React from 'react';

const RealtimeFeedback = ({ feedback }) => {
  if (!feedback) return null;

  return (
    <div className="realtime-feedback">
      <p>{feedback}</p>

      <style jsx>{`
        .realtime-feedback {
          position: fixed;
          bottom: 80px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 10px 20px;
          border-radius: 20px;
          max-width: 90%;
          text-align: center;
          animation: fadeIn 0.3s ease-in-out;
          z-index: 1000;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, 20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        p {
          margin: 0;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default RealtimeFeedback; 