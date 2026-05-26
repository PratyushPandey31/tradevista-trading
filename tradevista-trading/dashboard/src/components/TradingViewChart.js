import React, { useEffect, useRef } from "react";

let tvScriptLoadingPromise;

const TradingViewChart = ({ symbol = "NASDAQ:AAPL" }) => {
  const onLoadScriptRef = useRef();

  useEffect(() => {
    onLoadScriptRef.current = createWidget;

    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement("script");
        script.id = "tradingview-widget-loading-script";
        script.src = "https://s3.tradingview.com/tv.js";
        script.type = "text/javascript";
        script.onload = resolve;

        document.head.appendChild(script);
      });
    }

    tvScriptLoadingPromise.then(() => onLoadScriptRef.current && onLoadScriptRef.current());

    return () => {
      onLoadScriptRef.current = null;
    };

    function createWidget() {
      if (document.getElementById("tradingview_chart_container") && "TradingView" in window) {
        new window.TradingView.widget({
          autosize: true,
          symbol: symbol,
          interval: "D",
          timezone: "Etc/UTC",
          theme: "light",
          style: "1",
          locale: "in",
          enable_publishing: false,
          backgroundColor: "#ffffff",
          gridColor: "#f1f3f6",
          hide_top_toolbar: true,
          hide_legend: true,
          save_image: false,
          container_id: "tradingview_chart_container",
        });
      }
    }
  }, [symbol]);

  return (
    <div className="tradingview-widget-container" style={{ height: "400px", width: "100%", marginTop: "20px" }}>
      <div id="tradingview_chart_container" style={{ height: "100%", width: "100%" }} />
    </div>
  );
};

export default TradingViewChart;
