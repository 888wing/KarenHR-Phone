
import React from 'react';

export default function TopBar() {
  return (
    <div className="top-bar">
      <div className="profile-pic">
        <img src="/images/profile-pic.png" alt="Profile" />
      </div>
      <div className="menu-icon">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
        </svg>
      </div>
    </div>
  );
}
