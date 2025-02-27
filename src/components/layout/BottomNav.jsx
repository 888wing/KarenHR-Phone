// src/components/layout/BottomNav.jsx
import React from "react";
import { useRouter } from "next/router";

export default function BottomNav() {
  const router = useRouter();
  const path = router.pathname;

  // 修改 navItems 數組，添加 Dashboard 選項
  const navItems = [
    {
      name: "Karen Pro",
      icon: <div className="karen-pro-icon">A</div>,
      path: "/",
      isActive: path === "/",
    },
    {
      name: "Chart",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path
            fill="currentColor"
            d="M9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4zm2 2H5V5h14v14z"
          ></path>
        </svg>
      ),
      path: "/score",
      isActive: path === "/score",
    },
    // 新增 Dashboard 選項
    {
      name: "Dashboard",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path
            fill="currentColor"
            d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"
          ></path>
        </svg>
      ),
      path: "/dashboard",
      isActive: path === "/dashboard",
    },
    {
      name: "Setting",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path
            fill="currentColor"
            d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"
          ></path>
        </svg>
      ),
      path: "/settings",
      isActive: path === "/settings",
    },
  ];

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <div className="bottom-nav">
      {navItems.map((item, index) => (
        <div
          key={index}
          className={`nav-item ${item.isActive ? "active" : ""}`}
          onClick={() => handleNavigation(item.path)}
        >
          <div className="nav-icon">{item.icon}</div>
          <span>{item.name}</span>
        </div>
      ))}

      <style jsx>{`
        .bottom-nav {
          display: flex;
          background-color: #e6aa63;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          padding: 10px 0;
          height: 70px;
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
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .karen-pro-icon {
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
    </div>
  );
}
