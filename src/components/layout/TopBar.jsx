// src/components/layout/TopBar.jsx
import React from "react";
import { useRouter } from "next/router";

export default function TopBar({
  showBackButton = false,
  showCloseButton = false,
}) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleClose = () => {
    router.push("/");
  };

  return (
    <div className="top-bar">
      {showBackButton && (
        <div className="back-button" onClick={handleBack}>
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path
              fill="currentColor"
              d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
            ></path>
          </svg>
        </div>
      )}

      <div className="profile-pic">
        <div className="avatar-placeholder">K</div>
      </div>

      {showCloseButton ? (
        <div className="close-button" onClick={handleClose}>
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path
              fill="currentColor"
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            ></path>
          </svg>
        </div>
      ) : (
        <div className="menu-icon">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path
              fill="currentColor"
              d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"
            ></path>
          </svg>
        </div>
      )}

      <style jsx>{`
        .top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          background-color: #fef9e3;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          height: 60px;
        }

        .profile-pic {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          background-color: #e6aa63;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar-placeholder {
          color: white;
          font-weight: bold;
          font-size: 18px;
        }

        .menu-icon,
        .back-button,
        .close-button {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #333;
        }
      `}</style>
    </div>
  );
}
