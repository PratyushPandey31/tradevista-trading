import React, { useState, useEffect, useContext } from "react";
import api from "../utils/axios";
import { VerticalGraph } from "./VerticalGraph";
import { GeneralContext } from "./GeneralContext";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);
  const { livePrices, portfolioUpdateCount } = useContext(GeneralContext);

  useEffect(() => {
    api.get("/user/holdings")
      .then((res) => {
        setAllHoldings(res.data);
      })
      .catch((err) => console.error(err));
  }, [portfolioUpdateCount]);

  const labels = allHoldings.map((subArray) => subArray["name"]);
  const data = {
    labels,
    datasets: [
      {
        label: "Invested Value",
        data: allHoldings.map((stock) => stock.avgPrice * stock.quantity),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <>
      <h3 className="title">Holdings ({allHoldings.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>Cur. val</th>
              <th>P&L</th>
              <th>Net chg.</th>
              <th>Day chg.</th>
            </tr>
          </thead>

          <tbody>
            {allHoldings.map((stock, index) => {
              const currentPrice = livePrices[stock.symbol] || stock.avgPrice || 0;
              const currValue = currentPrice * stock.quantity;
              const investedValue = stock.avgPrice * stock.quantity;
              const pnl = currValue - investedValue;
              const isProfit = pnl >= 0;
              const profitClass = isProfit ? "profit" : "loss";
              const netPercent = investedValue ? ((pnl / investedValue) * 100).toFixed(2) : "0.00";

              return (
                <tr key={index}>
                  <td>{stock.symbol}</td>
                  <td>{stock.quantity}</td>
                  <td>{stock.avgPrice.toFixed(2)}</td>
                  <td>{currentPrice.toFixed(2)}</td>
                  <td>{currValue.toFixed(2)}</td>
                  <td className={profitClass}>
                    {isProfit ? "+" : "-"}{Math.abs(pnl).toFixed(2)}
                  </td>
                  <td className={profitClass}>{netPercent}%</td>
                  <td className={profitClass}>---</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="row">
        <div className="col">
          <h5>
            29,875.<span>55</span>{" "}
          </h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>
            31,428.<span>95</span>{" "}
          </h5>
          <p>Current value</p>
        </div>
        <div className="col">
          <h5>1,553.40 (+5.20%)</h5>
          <p>P&L</p>
        </div>
      </div>
      <VerticalGraph data={data} />
    </>
  );
};

export default Holdings;
