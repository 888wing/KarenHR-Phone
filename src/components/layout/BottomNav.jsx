// src/components/layout/BottomNav.jsx
import React from "react";
import { useRouter } from "next/router";

export default function BottomNav({ isPremium = false }) {
  const router = useRouter();
  const path = router.pathname;

  // 定义所有可能的导航项
  const allNavItems = {
    home: {
      name: "首頁",
      enName: "Home",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path
            fill="currentColor"
            d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"
          ></path>
        </svg>
      ),
      path: "/",
    },
    chat: {
      name: "對話",
      enName: "Chat",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path
            fill="currentColor"
            d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"
          ></path>
        </svg>
      ),
      path: "/chat",
    },
    score: {
      name: "評分",
      enName: "Score",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path
            fill="currentColor"
            d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"
          ></path>
        </svg>
      ),
      path: "/score",
    },
    dashboard: {
      name: "儀表板",
      enName: "Dashboard",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path
            fill="currentColor"
            d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"
          ></path>
        </svg>
      ),
      path: "/dashboard",
    },
    start: {
      name: "開始",
      enName: "Start",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24">
          <circle
            cx="12"
            cy="12"
            r="10"
            fill="currentColor"
            fillOpacity="0.2"
          />
          <path
            fill="currentColor"
            d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
          />
        </svg>
      ),
      path: "/chat",
    },
    upgrade: {
      name: "升級",
      enName: "Pro",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path
            fill="currentColor"
            d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"
          />
        </svg>
      ),
      path: "/", // 升级功能通常是通过模态窗口或导航到设置页面
      action: true, // 标记这是一个需要特殊处理的动作项
    },
    settings: {
      name: "設置",
      enName: "Settings",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path
            fill="currentColor"
            d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"
          ></path>
        </svg>
      ),
      path: "/settings",
    },
  };

  // 根据当前页面确定需要显示的导航项
  const getNavItems = () => {
    // 首页导航
    if (path === "/") {
      return ["home", "start", isPremium ? "dashboard" : "upgrade"];
    }
    
    // 聊天页导航
    if (path === "/chat") {
      return ["home", "chat", "score"];
    }
    
    // 评分页导航
    if (path === "/score") {
      return ["home", "chat", "score", "dashboard"];
    }
    
    // 仪表板页导航
    if (path === "/dashboard") {
      return ["home", "score", "dashboard", "settings"];
    }
    
    // 设置页导航
    if (path === "/settings") {
      return ["home", "dashboard", "settings"];
    }
    
    // 默认导航项
    return ["home", "chat", "score", "dashboard"];
  };

  // 从所有导航项中筛选出当前页面需要的导航项
  const currentNavItems = getNavItems().map(key => ({
    ...allNavItems[key],
    isActive: allNavItems[key].path === path,
    key
  }));

  // 处理导航项点击
  const handleNavigation = (item) => {
    // 如果是升级按钮,我们需要处理特殊逻辑
    if (item.key === "upgrade") {
      // 这里可以调用升级函数或弹出升级对话框
      const confirmed = window.confirm(
        "升級到Karen AI付費版可獲得更多功能和使用次數。繼續進行升級？"
      );
      if (confirmed) {
        // 模拟升级成功
        localStorage.setItem("karePremium", "true");
        alert("恭喜！您已成功升級到付費版。");
        router.reload(); // 刷新页面应用变更
      }
      return;
    }
    
    // 普通导航
    router.push(item.path);
  };

  // 获取当前语言
  const language = router.query.language || "zh_TW";
  const isEnglish = language === "en";

  return (
    <div className="bottom-nav">
      {currentNavItems.map((item) => (
        <div
          key={item.key}
          className={`nav-item ${item.isActive ? "active" : ""}`}
          onClick={() => handleNavigation(item)}
        >
          <div className={`nav-icon ${item.key === "upgrade" && isPremium ? "premium-active" : ""}`}>
            {item.icon}
          </div>
          <span>{isEnglish ? item.enName : item.name}</span>
        </div>
      ))}

      <style jsx>{`
        .bottom-nav {
          display: flex;
          background: linear-gradient(to right, #e6b17a, #e4997e);
          padding: 12px 0;
          height: 70px;
          border-top-left-radius: 15px;
          border-top-right-radius: 15px;
        }

        .nav-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
        }

        .nav-item:hover {
          transform: translateY(-2px);
        }

        .nav-icon {
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-item.active {
          color: white;
          font-weight: bold;
        }

        .nav-item.active::after {
          content: "";
          position: absolute;
          bottom: -12px;
          width: 40%;
          height: 3px;
          background-color: white;
          border-radius: 3px;
        }

        .premium-active {
          color: #ffd700;
        }
      `}</style>
    </div>
  );
}