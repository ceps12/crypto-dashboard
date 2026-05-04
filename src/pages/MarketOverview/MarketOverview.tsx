import React from 'react';
import { useCrypto } from '../../context/CryptoContext';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import './MarketOverview.css';

const formatPrice = (price: number): string => {
  if (price >= 1) return price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  return `$${price.toFixed(6)}`;
};

const formatMarketCap = (cap: number): string => {
  if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
  if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
  if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
  return `$${cap.toLocaleString()}`;
};

const MarketOverview: React.FC = () => {
  const { assets, loading, error, refreshData } = useCrypto();

  if (loading) {
    return (
      <div className="market-loading">
        <div className="spinner" />
        <p>Loading market data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="market-error">
        <p>⚠️ {error}</p>
        <button onClick={refreshData} className="retry-btn">Retry</button>
      </div>
    );
  }

  const totalMarketCap = assets.reduce((sum, a) => sum + a.market_cap, 0);
  const totalVolume = assets.reduce((sum, a) => sum + a.total_volume, 0);
  const avgChange = assets.reduce((sum, a) => sum + a.price_change_percentage_24h, 0) / assets.length;

  return (
    <div className="market">
      <div className="market__header">
        <h1 className="market__title">Market Overview</h1>
        <button onClick={refreshData} className="refresh-btn" aria-label="Refresh data">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          Refresh
        </button>
      </div>

      <div className="market__stats">
        <div className="stat-card">
          <span className="stat-card__label">Total Market Cap</span>
          <span className="stat-card__value">{formatMarketCap(totalMarketCap)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__label">24h Volume</span>
          <span className="stat-card__value">{formatMarketCap(totalVolume)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__label">Avg 24h Change</span>
          <span className={`stat-card__value ${avgChange >= 0 ? 'text-green' : 'text-red'}`}>
            {avgChange >= 0 ? '+' : ''}{avgChange.toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="market__table-wrapper">
        <table className="market__table">
          <thead>
            <tr>
              <th>#</th>
              <th>Coin</th>
              <th>Price</th>
              <th>24h %</th>
              <th>Market Cap</th>
              <th>Volume (24h)</th>
              <th>Last 7 Days</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => {
              const sparkData = asset.sparkline_in_7d?.price.map((p, i) => ({ p, i })) || [];
              const isPositive = asset.price_change_percentage_24h >= 0;
              const lineColor = isPositive ? '#10b981' : '#ef4444';

              return (
                <tr key={asset.id}>
                  <td className="rank">{asset.market_cap_rank}</td>
                  <td className="coin-cell">
                    <img src={asset.image} alt={asset.name} className="coin-img" />
                    <div className="coin-info">
                      <span className="coin-name">{asset.name}</span>
                      <span className="coin-symbol">{asset.symbol.toUpperCase()}</span>
                    </div>
                  </td>
                  <td className="price-cell">{formatPrice(asset.current_price)}</td>
                  <td className={isPositive ? 'text-green' : 'text-red'}>
                    {isPositive ? '▲' : '▼'} {Math.abs(asset.price_change_percentage_24h).toFixed(2)}%
                  </td>
                  <td>{formatMarketCap(asset.market_cap)}</td>
                  <td>{formatMarketCap(asset.total_volume)}</td>
                  <td className="sparkline-cell">
                    <ResponsiveContainer width={120} height={40}>
                      <LineChart data={sparkData}>
                        <Line type="monotone" dataKey="p" stroke={lineColor} dot={false} strokeWidth={1.5} />
                        <Tooltip
                          contentStyle={{ display: 'none' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarketOverview;
