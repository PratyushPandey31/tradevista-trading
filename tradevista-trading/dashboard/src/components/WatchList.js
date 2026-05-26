import React, { useState, useEffect, useContext } from "react";
import api from "../utils/axios";
import { GeneralContext } from "./GeneralContext";

import { Tooltip, Grow } from "@mui/material";
import { DoughnutChart } from "./DoughnutChart";
import {
  BarChartOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  MoreHorizOutlined,
} from "@mui/icons-material";

const WatchList = () => {
  const [watchlistSymbols, setWatchlistSymbols] = useState(["AAPL", "MSFT", "GOOGL"]); 
  const { livePrices } = useContext(GeneralContext);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      const res = await api.get("/user/watchlist");
      if (res.data && res.data.length > 0) {
        setWatchlistSymbols(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchKeyPress = async (e) => {
    if (e.key === "Enter" && searchInput.trim() !== "") {
      try {
        await api.post("/user/watchlist", { symbol: searchInput.toUpperCase(), action: "add" });
        setSearchInput("");
        fetchWatchlist();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const stockData = watchlistSymbols.map((sym) => {
    return {
      name: sym,
      price: livePrices[sym] || 100.0,
      isDown: Math.random() > 0.5, // Mock direction since we don't store history properly here
      percent: "0.00%"
    };
  });

  const labels = stockData.map((s) => s.name);
  const data = {
    labels,
    datasets: [
      {
        label: "Price",
        data: stockData.map((s) => s.price),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="watchlist-container">
      <div className="search-container">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search eg: AAPL, MSFT (Press Enter)"
          className="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleSearchKeyPress}
        />
        <span className="counts"> {watchlistSymbols.length} / 50</span>
      </div>

      <ul className="list">
        {stockData.map((stock, index) => {
          return <WatchListItem stock={stock} key={index} onRemove={async () => {
             await api.post("/user/watchlist", { symbol: stock.name, action: "remove" });
             fetchWatchlist();
          }} />;
        })}
      </ul>
      <DoughnutChart data={data} />
    </div>
  );
};

export default WatchList;

const WatchListItem = ({ stock, onRemove }) => {
  const [showWatchlistActions, setShowWatchlistActions] = useState(false);

  const handleMouseEnter = () => setShowWatchlistActions(true);
  const handleMouseLeave = () => setShowWatchlistActions(false);

  return (
    <li onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="item">
        <p className={stock.isDown ? "down" : "up"}>{stock.name}</p>
        <div className="itemInfo">
          <span className="percent">{stock.percent}</span>
          {stock.isDown ? (
            <KeyboardArrowDown className="down" />
          ) : (
            <KeyboardArrowUp className="up" />
          )}
          <span className="price">{stock.price.toFixed(2)}</span>
        </div>
      </div>
      {showWatchlistActions && <WatchListActions uid={stock.name} onRemove={onRemove} />}
    </li>
  );
};

const WatchListActions = ({ uid, onRemove }) => {
  const { openBuyWindow } = useContext(GeneralContext);
  const handleBuyClick = () => {
    openBuyWindow(uid);
  };
  return (
    <span className="actions">
      <span>
        <Tooltip title="Buy" placement="top" arrow TransitionComponent={Grow} onClick={handleBuyClick}>
          <button className="buy">Buy</button>
        </Tooltip>

        <Tooltip title="Sell" placement="top" arrow TransitionComponent={Grow}>
          <button className="sell">Sell</button>
        </Tooltip>

        <Tooltip title="Remove" placement="top" arrow TransitionComponent={Grow} onClick={onRemove}>
          <button className="action" style={{cursor: "pointer", border: "1px solid red", color: "red", padding: "2px 5px", fontSize:"10px"}}>
            Del
          </button>
        </Tooltip>
      </span>
    </span>
  );
};
