// src/components/Layout.jsx
import React from "react";
import TopBar from "./layout/TopBar";
import BottomNav from "./layout/BottomNav";

export default function Layout({
  children,
  showTopBar = true,
  showBottomNav = true,
  isPremium = false
}) {
  return (
    <div className="mobile-container">
      {showTopBar && <TopBar />}
      <main className="main-content">{children}</main>
      {showBottomNav && <BottomNav isPremium={isPremium} />}
    </div>
  );
}