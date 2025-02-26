// src/components/Layout.jsx
import React from "react";
import TopBar from "./layout/TopBar";
import BottomNav from "./layout/BottomNav";

export default function Layout({
  children,
  showTopBar = true,
  showBottomNav = true,
}) {
  return (
    <div className="mobile-container">
      {showTopBar && <TopBar />}
      <main className="main-content">{children}</main>
      {showBottomNav && <BottomNav />}

      <style jsx>{`
        .mobile-container {
          max-width: 420px;
          min-height: 100vh;
          margin: 0 auto;
          background-color: #fef9e3;
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

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
}
