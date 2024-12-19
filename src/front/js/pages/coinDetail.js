// src/front/js/pages/CoinDetail.jsx
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../styles/coinDetail.css";

import { 
  ChartCanvas,
  Chart,
  CandlestickSeries,
  LineSeries,
  XAxis,
  YAxis,
  discontinuousTimeScaleProvider,
  OHLCTooltip,
  MouseCoordinateY,
  MouseCoordinateX,
  withSize,
  withDeviceRatio
} from "react-financial-charts";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

const CoinDetail = ({width, ratio}) => {
  const { store, actions } = useContext(Context);
  const { id } = useParams();

  const [chartData, setChartData] = useState([]);
  const [chartInterval, setChartInterval] = useState("1m"); 
  const [chartType, setChartType] = useState("candles");

  useEffect(() => {
    actions.loadCoinDetail(id);
  }, [id, actions]);

  const coin = store.selectedCoinDetail;

  // Solo continuamos si coin existe
  let symbol = "BTCUSDT";
  if (coin && coin.symbol) {
    // Convertir el símbolo de la coin a mayúsculas + "USDT"
    symbol = coin.symbol.toUpperCase() + "USDT";
  }

  useEffect(() => {
    const fetchChartData = async () => {
      if (!symbol) return;
      const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${chartInterval}&limit=500`;
      const res = await fetch(url);
      const json = await res.json();
      const formatted = json.map(d => ({
        date: new Date(d[0]),
        open: +d[1],
        high: +d[2],
        low: +d[3],
        close: +d[4],
        volume: +d[5],
      }));
      setChartData(formatted);
    };
    fetchChartData();
  }, [symbol, chartInterval]);

  if (!coin) {
    return (
      <div className="coin-detail-container">
        <div style={{color:"#ffffff"}}>
          Cargando información de {id}...
        </div>
      </div>
    );
  }

  const price = coin.market_data?.current_price?.usd;
  const priceChange1d = coin.market_data?.price_change_percentage_24h_in_currency?.usd;
  const priceChangeClass = priceChange1d >= 0 ? "price-change positive" : "price-change negative";

  let chartContent = <p style={{color:'#dcdcdc'}}>Cargando gráfico...</p>;
  if (chartData.length > 0 && width > 0) {
    const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(d => d.date);
    const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(chartData);
    const max = xAccessor(data[data.length - 1]);
    const min = xAccessor(data[0]);
    const xExtents = [min, max];

    chartContent = (
      <ChartCanvas
        height={400}
        width={width}
        ratio={ratio} 
        margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
        data={data}
        xScale={xScale}
        xAccessor={xAccessor}
        displayXAccessor={displayXAccessor}
        xExtents={xExtents}
      >
        <Chart id={1} yExtents={d => [d.high, d.low]}>
          <XAxis 
            axisAt="bottom" 
            orient="bottom" 
            tickFormat={timeFormat("%m-%d %H:%M")} 
            stroke="#dcdcdc" 
            tickStroke="#dcdcdc"
          />
          <YAxis 
            axisAt="left" 
            orient="left"
            ticks={5}
            stroke="#dcdcdc" 
            tickStroke="#dcdcdc"
          />

          {chartType === "candles" ? (
            <CandlestickSeries />
          ) : (
            <LineSeries yAccessor={d => d.close} stroke="#b1d8b7" />
          )}

          <MouseCoordinateY
            at="left"
            orient="left"
            displayFormat={format(".2f")}
          />
          <MouseCoordinateX
            at="bottom"
            orient="bottom"
            displayFormat={timeFormat("%Y-%m-%d %H:%M")}
          />

          <OHLCTooltip origin={[-40,0]} textFill="#ffffff" />
        </Chart>
      </ChartCanvas>
    );
  }

  return (
    <div className="coin-detail-container">
      <div className="coin-detail-row">
        {/* Columna Izquierda */}
        <div className="left-panel">
          <div className="coin-header">
            <img src={coin.image?.large} alt={coin.symbol} />
            <div>
              <h1>{coin.name} ({coin.symbol.toUpperCase()})</h1>
              <p>Rank #{coin.market_cap_rank}</p>
            </div>
          </div>

          <p className="price-big">${price?.toLocaleString()}</p>
          <p className={priceChangeClass}>{priceChange1d?.toFixed(2)}% (1d)</p>

          <div className="stats-boxes">
            <div className="stats-box">
              <h4>Market Cap</h4>
              <p>${coin.market_data?.market_cap?.usd?.toLocaleString()}</p>
            </div>
            <div className="stats-box">
              <h4>Volume (24h)</h4>
              <p>${coin.market_data?.total_volume?.usd?.toLocaleString()}</p>
            </div>
            <div className="stats-box">
              <h4>FDV</h4>
              <p>${coin.market_data?.fully_diluted_valuation?.usd?.toLocaleString()}</p>
            </div>
            <div className="stats-box">
              <h4>Vol/Mcap</h4>
              <p>{(coin.market_data?.total_volume?.usd / coin.market_data?.market_cap?.usd * 100)?.toFixed(2)}%</p>
            </div>
            <div className="stats-box">
              <h4>Total supply</h4>
              <p>{coin.market_data?.total_supply?.toLocaleString()} {coin.symbol.toUpperCase()}</p>
            </div>
            <div className="stats-box">
              <h4>Max supply</h4>
              <p>{coin.market_data?.max_supply?.toLocaleString() || "N/A"}</p>
            </div>
          </div>

          <div className="info-section">
            <h5>Website & Docs</h5>
            {coin.links?.homepage?.[0] && <a href={coin.links.homepage[0]} target="_blank" rel="noopener noreferrer">Website</a>}
            {coin.links?.official_forum_url?.[0] && <a href={coin.links.official_forum_url[0]} target="_blank" rel="noopener noreferrer">Forum</a>}
            {coin.links?.blockchain_site?.[0] && <a href={coin.links.blockchain_site[0]} target="_blank" rel="noopener noreferrer">Explorer</a>}
          </div>

          <div className="info-section">
            <h5>Socials</h5>
            {coin.links?.twitter_screen_name && <p>Twitter: @{coin.links.twitter_screen_name}</p>}
          </div>

          <div className="info-section">
            <h5>Rating</h5>
            <p>{coin.community_score ? `Score: ${coin.community_score}` : "N/A"}</p>
          </div>

          <div className="info-section">
            <h5>Wallets</h5>
            <p>N/A</p>
          </div>

          <div className="converter">
            <h6>BTC to USD converter</h6>
            <input type="text" placeholder="BTC" />
            <input type="text" placeholder="USD" />
          </div>

          <div className="info-section performance">
            <h5>Price performance (24h)</h5>
            <p>Información adicional de performance...</p>
          </div>
        </div>

        {/* Columna Derecha */}
        <div className="right-panel">
          {/* Tabs */}
          <div className="tabs-bar">
            <div className="tab-right">Chart</div>
            <div className="tab-right">Markets</div>
            <div className="tab-right">News</div>
            <div className="tab-right">Yields</div>
            <div className="tab-right">Analytics</div>
            <div className="tab-right">About</div>
          </div>

          {/* Barra de intervalos y tipo de grafico */}
          <div className="chart-toolbar">
            {["1m","5m","15m","1h","1d"].map(interval => (
              <button
                key={interval}
                className={chartInterval===interval?"active":""}
                onClick={()=>setChartInterval(interval)}>
                {interval}
              </button>
            ))}
            <button className={chartType==="candles"?"active":""} onClick={()=>setChartType("candles")}>Velas</button>
            <button className={chartType==="line"?"active":""} onClick={()=>setChartType("line")}>Línea</button>
          </div>

          <div className="chart-area">
            {chartContent}
          </div>

          <div className="markets-table">
            <h5>{coin.name} Markets</h5>
            <div className="markets-header">
              <div>Exchange</div>
              <div>Pair</div>
              <div>Price</div>
              <div>+2% Depth</div>
              <div>-2% Depth</div>
            </div>
            <div className="market-row">
              <p>Binance</p>
              <p>{coin.symbol.toUpperCase()}/USDT</p>
              <p>$100,270.77</p>
              <p>$13,809,506</p>
              <p>$52,752,839</p>
            </div>
            <div className="market-row">
              <p>Binance</p>
              <p>{coin.symbol.toUpperCase()}/FUSD</p>
              <p>$100,386.21</p>
              <p>$6,368,837</p>
              <p>$9,587,880</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withSize({ style: { minHeight: 400 } })(withDeviceRatio()(CoinDetail));
