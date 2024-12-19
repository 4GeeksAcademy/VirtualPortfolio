// src/components/CoinRow.jsx
import React from "react";

import { Link } from "react-router-dom";

const CoinRow = ({ coin, index }) => {
  return (
    <div className="coin-row d-flex align-items-center rounded-pill bg-dark text-white p-3">
      <div className="coin-index me-3 text-muted">#{coin.market_cap_rank}</div>
      <div className="coin-logo me-3">
        <img src={coin.image} alt={coin.name} style={{ width: "24px", height: "24px" }} />
      </div>
      <div className="coin-name me-auto">
        <Link to={`/coin/${coin.id}`} className="text-white text-decoration-none">
          <h5>{coin.name}</h5>
          <p className="mb-0">{coin.symbol.toUpperCase()}</p>
        </Link>
      </div>
      <div className="coin-market-cap me-3">${coin.market_cap.toLocaleString()}</div>
      <div className="coin-actions d-flex align-items-center">
        <button className="btn btn-favorite me-2">
          <i className="fa fa-star"></i>
        </button>
        <button className="btn btn-portfolio me-2">
          <i className="fa fa-plus"></i>
        </button>
        <Link to={`/coin/${coin.id}`} className="btn btn-details btn-outline-light">
          Details
        </Link>
      </div>
    </div>
  );
};

export default CoinRow;
