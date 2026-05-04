import { CryptoAsset, ChartDataPoint } from '../types';

const BASE_URL = 'https://api.coingecko.com/api/v3';

export async function fetchMarketData(): Promise<CryptoAsset[]> {
  const res = await fetch(
    `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=24h`
  );
  if (!res.ok) throw new Error('Failed to fetch market data');
  return res.json();
}

export async function fetchCoinChart(coinId: string, days: number = 7): Promise<ChartDataPoint[]> {
  const res = await fetch(
    `${BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
  );
  if (!res.ok) throw new Error('Failed to fetch chart data');
  const data = await res.json();
  return data.prices.map(([timestamp, price]: [number, number]) => ({
    timestamp,
    price,
  }));
}

export async function searchCoins(query: string): Promise<{ id: string; symbol: string; name: string }[]> {
  const res = await fetch(`${BASE_URL}/search?query=${query}`);
  if (!res.ok) throw new Error('Failed to search coins');
  const data = await res.json();
  return data.coins.slice(0, 10);
}
