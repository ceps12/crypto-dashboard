# Crypto Dashboard

Real-time cryptocurrency tracking dashboard with interactive charts, portfolio management, and price alerts using public API data.

## ✨ Features

- **Market Overview** — Live cryptocurrency prices, market caps, volumes, and 7-day sparklines
- **Portfolio Tracking** — Add your crypto assets, track profit/loss, visualize allocation with pie charts
- **Price Alerts** — Set alerts for when coins go above/below target prices
- **Real-time Updates** — Auto-refreshes market data every 60 seconds
- **Dark Theme** — Beautiful dark UI with smooth animations
- **Responsive Design** — Works on desktop, tablet, and mobile

## 🚀 Live Demo

https://ceps12.github.io/crypto-dashboard/

## 🛠 Tech Stack

- **React 19** with TypeScript
- **React Router** for navigation
- **Recharts** for interactive charts
- **CoinGecko API** for real-time crypto data
- **LocalStorage** for persistent portfolio and alerts

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/ceps12/crypto-dashboard.git

# Navigate to the project directory
cd crypto-dashboard

# Install dependencies
npm install

# Start the development server
npm start

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## 📁 Project Structure

```
src/
├── api/
│   └── cryptoApi.ts          # CoinGecko API calls
├── components/
│   └── Navbar/
│       ├── Navbar.tsx
│       └── Navbar.css
├── context/
│   └── CryptoContext.tsx     # Global state management
├── pages/
│   ├── MarketOverview/       # Market data table
│   ├── Portfolio/            # Portfolio tracking
│   └── Alerts/               # Price alerts
├── styles/
│   └── global.css            # Global styles & variables
├── types/
│   └── index.ts              # TypeScript interfaces
└── App.tsx                   # Main app component
```

## 🎨 Features Detail

### Market Overview
- Top 20 cryptocurrencies by market cap
- Live price updates every 60 seconds
- 24h price change indicators
- Interactive 7-day sparkline charts
- Total market cap and volume stats

### Portfolio Management
- Add multiple crypto assets
- Track buy price vs current price
- Automatic P/L calculation
- Portfolio allocation pie chart
- Persistent storage (LocalStorage)

### Price Alerts
- Set alerts for price thresholds
- Visual progress indicators
- Triggered state notifications
- Delete alerts anytime

## 🔌 API

This project uses the [CoinGecko API](https://www.coingecko.com/en/api) for cryptocurrency data.

## 📄 License

MIT © ceps12
