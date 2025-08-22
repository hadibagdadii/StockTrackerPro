import { apiRequest } from "./queryClient";
import type { StockData, MarketIndex, ChartData } from "@shared/schema";

const ALPHA_VANTAGE_API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY || "demo";

export async function fetchStockQuote(symbol: string): Promise<any> {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    const data = await response.json();
    return data['Global Quote'];
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error);
    throw new Error(`Failed to fetch quote for ${symbol}`);
  }
}

export async function fetchTimeSeriesDaily(symbol: string): Promise<ChartData[]> {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    const data = await response.json();
    const timeSeries = data['Time Series (Daily)'];
    
    if (!timeSeries) {
      throw new Error('No time series data available');
    }
    
    return Object.entries(timeSeries)
      .slice(0, 30)
      .map(([date, values]: [string, any]) => ({
        date,
        price: parseFloat(values['4. close']),
        volume: parseInt(values['6. volume'])
      }))
      .reverse();
  } catch (error) {
    console.error(`Error fetching time series for ${symbol}:`, error);
    throw new Error(`Failed to fetch time series for ${symbol}`);
  }
}

export const generateMockChartData = (): ChartData[] => {
  const data = [];
  const basePrice = 150;
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const price = basePrice + (Math.random() - 0.5) * 40 + Math.sin(i / 5) * 20;
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(price * 100) / 100,
      volume: Math.floor(Math.random() * 10000000) + 1000000
    });
  }
  
  return data;
};
