import React, { useState } from 'react';
import { useCrypto } from '../../context/CryptoContext';
import './Alerts.css';

const formatPrice = (price: number): string => {
  if (price >= 1) return price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  return `$${price.toFixed(6)}`;
};

const Alerts: React.FC = () => {
  const { assets, alerts, addAlert, removeAlert } = useCrypto();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ coinId: '', symbol: '', targetPrice: '', condition: 'above' as 'above' | 'below' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.coinId || !formData.targetPrice) return;

    const coin = assets.find((a) => a.id === formData.coinId);
    if (!coin) return;

    addAlert({
      coinId: formData.coinId,
      symbol: coin.symbol.toUpperCase(),
      targetPrice: parseFloat(formData.targetPrice),
      condition: formData.condition,
    });

    setFormData({ coinId: '', symbol: '', targetPrice: '', condition: 'above' });
    setShowForm(false);
  };

  const getCoinPrice = (coinId: string) => {
    const asset = assets.find((a) => a.id === coinId);
    return asset?.current_price || 0;
  };

  const isAlertTriggered = (alert: typeof alerts[0]) => {
    const currentPrice = getCoinPrice(alert.coinId);
    if (alert.condition === 'above') return currentPrice >= alert.targetPrice;
    return currentPrice <= alert.targetPrice;
  };

  return (
    <div className="alerts">
      <div className="alerts__header">
        <h1 className="alerts__title">Price Alerts</h1>
        <button className="add-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ New Alert'}
        </button>
      </div>

      {showForm && (
        <form className="alert-form" onSubmit={handleAdd}>
          <select value={formData.coinId} onChange={(e) => setFormData({ ...formData, coinId: e.target.value })} required>
            <option value="">Select coin...</option>
            {assets.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.symbol.toUpperCase()}) — {formatPrice(a.current_price)}
              </option>
            ))}
          </select>
          <select value={formData.condition} onChange={(e) => setFormData({ ...formData, condition: e.target.value as 'above' | 'below' })}>
            <option value="above">Price goes above</option>
            <option value="below">Price goes below</option>
          </select>
          <input
            type="number"
            placeholder="Target price ($)"
            value={formData.targetPrice}
            onChange={(e) => setFormData({ ...formData, targetPrice: e.target.value })}
            step="any"
            min="0"
            required
          />
          <button type="submit" className="submit-btn">Create Alert</button>
        </form>
      )}

      {alerts.length === 0 ? (
        <div className="alerts__empty">
          <span className="alerts__empty-icon">🔔</span>
          <h3>No alerts set</h3>
          <p>Create a price alert to get notified when a coin reaches your target price</p>
        </div>
      ) : (
        <div className="alerts__grid">
          {alerts.map((alert) => {
            const currentPrice = getCoinPrice(alert.coinId);
            const triggered = isAlertTriggered(alert);
            const progress = alert.condition === 'above'
              ? Math.min((currentPrice / alert.targetPrice) * 100, 100)
              : Math.min((alert.targetPrice / currentPrice) * 100, 100);

            return (
              <div key={alert.id} className={`alert-card ${triggered ? 'alert-card--triggered' : ''}`}>
                <div className="alert-card__header">
                  <div className="alert-card__coin">
                    <span className="alert-card__symbol">{alert.symbol}</span>
                    <span className="alert-card__condition">
                      {alert.condition === 'above' ? '↑ Above' : '↓ Below'}
                    </span>
                  </div>
                  {triggered && <span className="alert-card__badge">⚡ Triggered</span>}
                </div>
                <div className="alert-card__prices">
                  <div className="alert-card__price">
                    <span className="alert-card__label">Current</span>
                    <span className="alert-card__value">{formatPrice(currentPrice)}</span>
                  </div>
                  <div className="alert-card__price">
                    <span className="alert-card__label">Target</span>
                    <span className="alert-card__value">{formatPrice(alert.targetPrice)}</span>
                  </div>
                </div>
                <div className="alert-card__progress">
                  <div className="alert-card__progress-bar" style={{ width: `${progress}%` }} />
                </div>
                <div className="alert-card__footer">
                  <span className="alert-card__date">
                    Created {new Date(alert.createdAt).toLocaleDateString()}
                  </span>
                  <button className="remove-btn" onClick={() => removeAlert(alert.id)}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Alerts;
