import React, { useState } from 'react';
import { useCrypto } from '../../context/CryptoContext';
import { PortfolioItem } from '../../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import './Portfolio.css';

const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899', '#14b8a6'];

const formatPrice = (price: number): string => {
  if (price >= 1) return price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  return `$${price.toFixed(6)}`;
};

const Portfolio: React.FC = () => {
  const { assets } = useCrypto();
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() => {
    const saved = localStorage.getItem('crypto-portfolio');
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ coinId: '', symbol: '', name: '', amount: '', buyPrice: '' });

  const savePortfolio = (items: PortfolioItem[]) => {
    setPortfolio(items);
    localStorage.setItem('crypto-portfolio', JSON.stringify(items));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.coinId || !formData.amount || !formData.buyPrice) return;

    const newItem: PortfolioItem = {
      id: formData.coinId,
      symbol: formData.symbol,
      name: formData.name,
      amount: parseFloat(formData.amount),
      buyPrice: parseFloat(formData.buyPrice),
    };

    const existing = portfolio.find((p) => p.id === newItem.id);
    if (existing) {
      const updated = portfolio.map((p) =>
        p.id === newItem.id
          ? { ...p, amount: p.amount + newItem.amount, buyPrice: (p.buyPrice * p.amount + newItem.buyPrice * newItem.amount) / (p.amount + newItem.amount) }
          : p
      );
      savePortfolio(updated);
    } else {
      savePortfolio([...portfolio, newItem]);
    }

    setFormData({ coinId: '', symbol: '', name: '', amount: '', buyPrice: '' });
    setShowForm(false);
  };

  const handleRemove = (id: string) => {
    savePortfolio(portfolio.filter((p) => p.id !== id));
  };

  const handleCoinSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const coin = assets.find((a) => a.id === e.target.value);
    if (coin) {
      setFormData({
        ...formData,
        coinId: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        buyPrice: coin.current_price.toString(),
      });
    }
  };

  const portfolioData = portfolio.map((item) => {
    const asset = assets.find((a) => a.id === item.id);
    const currentPrice = asset?.current_price || 0;
    const value = item.amount * currentPrice;
    const cost = item.amount * item.buyPrice;
    const pnl = value - cost;
    const pnlPercent = cost > 0 ? (pnl / cost) * 100 : 0;

    return { ...item, currentPrice, value, cost, pnl, pnlPercent };
  });

  const totalValue = portfolioData.reduce((sum, p) => sum + p.value, 0);
  const totalCost = portfolioData.reduce((sum, p) => sum + p.cost, 0);
  const totalPnl = totalValue - totalCost;
  const totalPnlPercent = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;

  const pieData = portfolioData.map((p) => ({ name: p.symbol.toUpperCase(), value: p.value }));

  return (
    <div className="portfolio">
      <div className="portfolio__header">
        <h1 className="portfolio__title">Portfolio</h1>
        <button className="add-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Add Asset'}
        </button>
      </div>

      {showForm && (
        <form className="add-form" onSubmit={handleAdd}>
          <select value={formData.coinId} onChange={handleCoinSelect} required>
            <option value="">Select coin...</option>
            {assets.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.symbol.toUpperCase()})
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Amount"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            step="any"
            min="0"
            required
          />
          <input
            type="number"
            placeholder="Buy price ($)"
            value={formData.buyPrice}
            onChange={(e) => setFormData({ ...formData, buyPrice: e.target.value })}
            step="any"
            min="0"
            required
          />
          <button type="submit" className="submit-btn">Add to Portfolio</button>
        </form>
      )}

      {portfolio.length === 0 ? (
        <div className="portfolio__empty">
          <span className="portfolio__empty-icon">📊</span>
          <h3>No assets in portfolio</h3>
          <p>Add your first crypto asset to track your investments</p>
        </div>
      ) : (
        <>
          <div className="portfolio__summary">
            <div className="summary-card">
              <span className="summary-card__label">Total Value</span>
              <span className="summary-card__value">{formatPrice(totalValue)}</span>
            </div>
            <div className="summary-card">
              <span className="summary-card__label">Total Cost</span>
              <span className="summary-card__value">{formatPrice(totalCost)}</span>
            </div>
            <div className="summary-card">
              <span className="summary-card__label">Profit / Loss</span>
              <span className={`summary-card__value ${totalPnl >= 0 ? 'text-green' : 'text-red'}`}>
                {totalPnl >= 0 ? '+' : ''}{formatPrice(totalPnl)} ({totalPnlPercent >= 0 ? '+' : ''}{totalPnlPercent.toFixed(2)}%)
              </span>
            </div>
          </div>

          <div className="portfolio__content">
            <div className="portfolio__chart">
              <h3>Allocation</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={60}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatPrice(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="portfolio__table-wrapper">
              <table className="portfolio__table">
                <thead>
                  <tr>
                    <th>Asset</th>
                    <th>Amount</th>
                    <th>Buy Price</th>
                    <th>Current</th>
                    <th>Value</th>
                    <th>P/L</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioData.map((item) => (
                    <tr key={item.id}>
                      <td className="coin-cell">
                        <div className="coin-info">
                          <span className="coin-name">{item.name}</span>
                          <span className="coin-symbol">{item.symbol.toUpperCase()}</span>
                        </div>
                      </td>
                      <td>{item.amount}</td>
                      <td>{formatPrice(item.buyPrice)}</td>
                      <td>{formatPrice(item.currentPrice)}</td>
                      <td className="price-cell">{formatPrice(item.value)}</td>
                      <td className={item.pnl >= 0 ? 'text-green' : 'text-red'}>
                        {item.pnl >= 0 ? '+' : ''}{formatPrice(item.pnl)}
                        <br />
                        <small>{item.pnlPercent >= 0 ? '+' : ''}{item.pnlPercent.toFixed(2)}%</small>
                      </td>
                      <td>
                        <button className="remove-btn" onClick={() => handleRemove(item.id)} aria-label="Remove asset">
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Portfolio;
