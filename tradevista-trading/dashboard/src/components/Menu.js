import React, { useState } from "react";
import { Link } from "react-router-dom";
const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isProfileDropDownOpen, setIsProfileDropDownOpen] = useState(false);

  const handleMenuClick = (index) => {
    setSelectedMenu(index);
  };

  const handleProfileClick = () => {
    setIsProfileDropDownOpen(!isProfileDropDownOpen);
  };

  const userStr = localStorage.getItem("user");
  let user = null;
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      console.error(e);
    }
  }

  const displayName = user?.name || "Zerodha User";
  const displayUsername = user?.username || "zerodha_user";

  const getInitials = (name) => {
    if (!name) return "ZU";
    const parts = name.trim().split(/\s+/);
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(displayName);

  const menuClass = "menu";
  const activeMenuClass = "menu selected";

  return (
    <div className="menu-container">
      <img src="logo.png" style={{ width: "50px" }} alt="logo"></img>
      <div className="menus">
        <ul>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/"
              onClick={() => handleMenuClick(0)}
            >
              <p className={selectedMenu === 0 ? activeMenuClass : menuClass}>
                Dashboard
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/orders"
              onClick={() => handleMenuClick(1)}
            >
              <p className={selectedMenu === 1 ? activeMenuClass : menuClass}>
                Orders
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/holdings"
              onClick={() => handleMenuClick(2)}
            >
              <p className={selectedMenu === 2 ? activeMenuClass : menuClass}>
                Holdings
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/positions"
              onClick={() => handleMenuClick(3)}
            >
              <p className={selectedMenu === 3 ? activeMenuClass : menuClass}>
                Positions
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/funds"
              onClick={() => handleMenuClick(4)}
            >
              <p className={selectedMenu === 4 ? activeMenuClass : menuClass}>
                Funds
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/apps"
              onClick={() => handleMenuClick(5)}
            >
              <p className={selectedMenu === 5 ? activeMenuClass : menuClass}>
                Apps
              </p>
            </Link>
          </li>
        </ul>
        <hr />
        {user ? (
          <div className="profile" onClick={handleProfileClick} style={{ position: "relative" }}>
            <div className="avatar">{initials}</div>
            <div className="profile-name" style={{ fontSize: "0.8rem", fontWeight: 400, color: "rgb(70, 70, 70)" }}>{displayName}</div>

            {isProfileDropDownOpen && (
              <div className="profile-dropdown" style={{
                position: "absolute",
                top: "40px",
                right: "0",
                background: "#fff",
                boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
                borderRadius: "4px",
                padding: "10px",
                minWidth: "150px",
                zIndex: 100,
                border: "1px solid #eee",
                display: "flex",
                flexDirection: "column",
                gap: "8px"
              }} onClick={(e) => e.stopPropagation()}>
                <div style={{ fontSize: "0.75rem", color: "#888", borderBottom: "1px solid #eee", paddingBottom: "6px" }}>
                  @{displayUsername}
                </div>
                <button 
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    window.location.href = "/login";
                  }}
                  style={{
                    background: "#ff5722",
                    color: "#fff",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "3px",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                    width: "100%",
                    textAlign: "center"
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" style={{ textDecoration: "none" }}>
            <button style={{
              background: "#387ed1",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.8rem",
              fontWeight: "600",
              marginTop: "10px",
              boxShadow: "0 2px 4px rgba(56,126,209,0.2)",
              transition: "all 0.2s"
            }}>
              Sign In
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Menu;
