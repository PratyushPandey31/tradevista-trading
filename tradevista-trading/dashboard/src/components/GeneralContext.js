import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import BuyActionWindow from "./BuyActionWindow";

const socket = io("https://pratyush-tradevista-backend.vercel.app");

export const GeneralContext = React.createContext({
  openBuyWindow: (uid) => {},
  closeBuyWindow: () => {},
  livePrices: {},
  portfolioUpdateCount: 0,
});

export const GeneralContextProvider = (props) => {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [selectedStockUID, setSelectedStockUID] = useState("");
  const [livePrices, setLivePrices] = useState({});
  const [portfolioUpdateCount, setPortfolioUpdateCount] = useState(0);

  useEffect(() => {
    socket.on("priceUpdate", (data) => {
      setLivePrices(data);
    });

    socket.on("portfolioUpdate", () => {
      setPortfolioUpdateCount((prev) => prev + 1);
    });

    return () => {
      socket.off("priceUpdate");
      socket.off("portfolioUpdate");
    };
  }, []);

  const handleOpenBuyWindow = (uid) => {
    setIsBuyWindowOpen(true);
    setSelectedStockUID(uid);
  };

  const handleCloseBuyWindow = () => {
    setIsBuyWindowOpen(false);
    setSelectedStockUID("");
  };

  return (
    <GeneralContext.Provider
      value={{
        openBuyWindow: handleOpenBuyWindow,
        closeBuyWindow: handleCloseBuyWindow,
        livePrices,
        portfolioUpdateCount
      }}
    >
      {props.children}
      {isBuyWindowOpen && <BuyActionWindow uid={selectedStockUID} />}
    </GeneralContext.Provider>
  );
};

export default GeneralContextProvider;
