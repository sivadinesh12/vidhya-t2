import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SideNav from "./SideNav";
import "./PageLayout.css";

export default function PageLayout({ userName, onLogout, children }) {
  const navigate  = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("vidhya_token");
      localStorage.removeItem("vidhya_user");
      navigate("/login");
    }
  };

  return (
    <div className="page-layout">
      <SideNav
        userName={userName}
        onLogout={handleLogout}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <div className={`page-content ${collapsed ? "collapsed" : ""}`}>
        {children}
      </div>
      {/* FAB removed — VIDYA AI is now the homepage, accessed via login */}
    </div>
  );
}