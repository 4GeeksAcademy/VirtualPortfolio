// src/components/Home.jsx
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../styles/home.css";

export const Home = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [displayCount, setDisplayCount] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const coinsPerPage = displayCount;

  useEffect(() => {
    if (store.allCriptoCoins.length === 0 || store.coinsDetails.length === 0) {
      actions.loadAllCoinsAndDetails();
    }
  }, [store.allCriptoCoins.length, store.coinsDetails.length, actions]);

  const sortedCoins = [...store.coinsDetails].sort((a, b) => a.market_cap_rank - b.market_cap_rank);
  const indexOfLastCoin = currentPage * coinsPerPage;
  const indexOfFirstCoin = indexOfLastCoin - coinsPerPage;
  const currentCoins = sortedCoins.slice(indexOfFirstCoin, indexOfLastCoin);

  const handleLoadMore = () => {
    setCurrentPage(currentPage + 1);
  };

  // Mock de estadisticas globales (reemplazar con datos reales)
  const globalMarketCap = "$3.49T";
  const globalChange = "-5.60%";

  // Mock trending coins 
  const trendingCoins = [
    {id:"bitcoin", symbol:"BTC", price:"$100,296.46", image:"https://assets.coingecko.com/coins/images/1/small/bitcoin.png"},
    {id:"ethereum", symbol:"ETH", price:"$3,639.96", image:"https://assets.coingecko.com/coins/images/279/small/ethereum.png"},
    {id:"tether", symbol:"USDT", price:"$1.00", image:"https://assets.coingecko.com/coins/images/325/small/Tether-logo.png"}
  ];

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Today's Cryptocurrency Prices by Market Cap</h1>
        <p>The global crypto market cap is {globalMarketCap}, a {globalChange} decrease over the last day.</p>
      </div>

      <div className="stats-bar">
        <div className="stats-box">
          <h4>Market Cap</h4>
          <p>{globalMarketCap} {globalChange}</p>
        </div>
        <div className="stats-box">
          <h4>CMC100</h4>
          <p>$215.32 -5.99%</p>
        </div>
        <div className="stats-box">
          <h4>Dominance</h4>
          <p>BTC:56.97%, ETH:12.54%</p>
        </div>
        <div className="stats-box">
          <h4>Fear & Greed</h4>
          <p>80 Extreme Greed</p>
        </div>
        <div className="trending-box">
          <h4>Trending Coins</h4>
          <div className="trending-coins-list">
            {trendingCoins.map((tc, index) => (
              <div className="trending-coin" key={index}>
                <span>{index+1}</span>
                <img src={tc.image} alt={tc.symbol} />
                <span>{tc.symbol.toUpperCase()} {tc.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="tabs-container">
        <div className="tab active">All Crypto</div>
        <div className="tab">NFTs</div>
        <div className="tab">Categories</div>
        <div className="tab">Token unlocks</div>
        <div className="tab">Memes</div>
        <div className="tab">SOL</div>
        <div className="tab">DOT</div>
        <div className="tab">AI</div>
        <div className="tab">DeFi</div>
      </div>

      <div className="filters-container">
        <div className="filter">Top</div>
        <div className="filter">Trending</div>
        <div className="filter">New</div>
        <div className="filter">Gainers</div>
        <div className="filter">Most Visited</div>
        <div className="col-auto" style={{marginLeft:"auto"}}>
          <select className="form-select" value={displayCount} onChange={(e) => setDisplayCount(Number(e.target.value))}>
            <option value="50">Mostrar 50</option>
            <option value="100">Mostrar 100</option>
            <option value="200">Mostrar 200</option>
            <option value="300">Mostrar 300</option>
            <option value="1000">Mostrar 1000</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <div>#</div>
          <div>Name</div>
          <div>Price</div>
          <div>24h</div>
          <div>7d</div>
          <div>Market Cap</div>
        </div>
        {currentCoins.map((coin, index) => (
          <div 
            className="table-row" 
            key={coin.id} 
            onClick={() => navigate(`/coin/${coin.id}`)}
          >
            <div>{index+1 + (currentPage-1)*coinsPerPage}</div>
            <div className="coin-name">
              <img src={coin.image} alt={coin.symbol} />
              <span>{coin.name} ({coin.symbol.toUpperCase()})</span>
            </div>
            <div>${coin.current_price?.toLocaleString()}</div>
            <div style={{color: coin.price_change_percentage_24h >=0 ? "#b1d8b7" : "#ff8f8f"}}>
              {coin.price_change_percentage_24h?.toFixed(2)}%
            </div>
            <div style={{color: coin.price_change_percentage_7d_in_currency >=0 ? "#b1d8b7" : "#ff8f8f"}}>
              {coin.price_change_percentage_7d_in_currency?.toFixed(2)}%
            </div>
            <div>${coin.market_cap?.toLocaleString()}</div>
          </div>
        ))}
      </div>

      {indexOfLastCoin < sortedCoins.length && (
        <button className="load-more-btn" onClick={handleLoadMore}>Ver más</button>
      )}
    </div>
  );
};

export default Home;
