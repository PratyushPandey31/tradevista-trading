import React, { useState, useContext } from "react";
import api from "../utils/axios";
import { GeneralContext } from "./GeneralContext"; // ✅ FIXED IMPORT
import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid }) => {
  const { closeBuyWindow } = useContext(GeneralContext); // ✅ FIXED

  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  const [orderType, setOrderType] = useState("MARKET"); // MARKET | LIMIT
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Live calculations
  const totalValue = (Number(stockQuantity) * Number(stockPrice)).toFixed(2);
  const marginRequired = (totalValue * 0.2).toFixed(2);

  const validate = () => {
    if (!stockQuantity || Number(stockQuantity) <= 0) {
      setError("Quantity must be greater than 0.");
      return false;
    }
    if (orderType === "LIMIT" && (!stockPrice || Number(stockPrice) <= 0)) {
      setError("Price must be greater than 0 for Limit orders.");
      return false;
    }
    return true;
  };

  const handleBuyClick = async () => {
    setError("");
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please sign in to place orders.");
      return;
    }
    if (!validate()) return;

    setLoading(true);
    try {
      await api.post("/trade/buy", {
        symbol: uid,
        quantity: Number(stockQuantity),
        price: orderType === "MARKET" ? 0 : Number(stockPrice),
      });

      setSuccess(true);

      setTimeout(() => {
        closeBuyWindow(); // ✅ FIXED
      }, 1200);
    } catch (err) {
      setError("Order failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = () => {
    closeBuyWindow(); // ✅ FIXED
  };

  return (
    <div className="action-window" id="buy-window" draggable="true">
      {/* Header */}
      <div className="window-header buy-header">
        <div className="header-left">
          <span className="stock-name">{uid || "STOCK"}</span>
          <span className="exchange-badge">NSE</span>
        </div>
        <span className="mode-badge buy-badge">BUY</span>
      </div>

      {/* Order Type Toggle */}
      <div className="order-type-toggle">
        {["MARKET", "LIMIT"].map((type) => (
          <button
            key={type}
            className={`toggle-btn ${orderType === type ? "active-buy" : ""}`}
            onClick={() => {
              setOrderType(type);
              setError("");
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="inputs-section">
        <div className="inputs">
          <fieldset className={error.includes("Quantity") ? "field-error" : ""}>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              min="1"
              value={stockQuantity}
              onChange={(e) => {
                setStockQuantity(e.target.value);
                setError("");
              }}
            />
          </fieldset>

          <fieldset
            className={`${orderType === "MARKET" ? "field-disabled" : ""} ${
              error.includes("Price") ? "field-error" : ""
            }`}
          >
            <legend>Price</legend>
            <input
              type={orderType === "MARKET" ? "text" : "number"}
              name="price"
              id="price"
              step="0.05"
              min="0"
              value={orderType === "MARKET" ? "Market" : stockPrice}
              disabled={orderType === "MARKET"}
              onChange={(e) => {
                setStockPrice(e.target.value);
                setError("");
              }}
            />
          </fieldset>
        </div>

        {/* Order Summary — only for LIMIT */}
        {orderType === "LIMIT" && (
          <div className="order-summary">
            <div className="summary-row">
              <span>Total Value</span>
              <span className="summary-val">₹{totalValue}</span>
            </div>
            <div className="summary-row">
              <span>Margin Required</span>
              <span className="summary-val">₹{marginRequired}</span>
            </div>
          </div>
        )}

        {error && <p className="msg error-msg">⚠ {error}</p>}
        {success && (
          <p className="msg success-msg">
            ✓ Buy order placed successfully!
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="window-footer">
        <span className="margin-hint">
          {orderType === "LIMIT"
            ? `Margin req. ₹${marginRequired}`
            : "Market order"}
        </span>
        <div className="btn-group">
          <button
            className="btn btn-buy"
            onClick={handleBuyClick}
            disabled={loading || success}
          >
            {loading ? "Placing..." : "Buy"}
          </button>
          <button className="btn btn-cancel" onClick={handleCancelClick}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;