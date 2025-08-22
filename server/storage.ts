import { type User, type InsertUser, type StockData, type InsertStockData, type WatchlistItem, type InsertWatchlistItem } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Stock data methods
  getAllStocks(): Promise<StockData[]>;
  getStockBySymbol(symbol: string): Promise<StockData | undefined>;
  createOrUpdateStock(stock: InsertStockData): Promise<StockData>;
  updateStockPrices(stocks: InsertStockData[]): Promise<void>;
  
  // Watchlist methods
  getWatchlistByUserId(userId: string): Promise<WatchlistItem[]>;
  addToWatchlist(item: InsertWatchlistItem): Promise<WatchlistItem>;
  removeFromWatchlist(userId: string, symbol: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private stocks: Map<string, StockData>;
  private watchlists: Map<string, WatchlistItem>;

  constructor() {
    this.users = new Map();
    this.stocks = new Map();
    this.watchlists = new Map();
    
    // Initialize with some default stock data
    this.initializeDefaultStocks();
  }

  private async initializeDefaultStocks() {
    const defaultStocks: InsertStockData[] = [
      { symbol: 'AAPL', name: 'Apple Inc.', price: 189.84, change: 2.47, changePercent: 1.32, volume: 45200000, marketCap: 2980000000000, sector: 'Technology' },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 139.23, change: -1.87, changePercent: -1.32, volume: 28700000, marketCap: 1750000000000, sector: 'Technology' },
      { symbol: 'MSFT', name: 'Microsoft Corp.', price: 374.51, change: 5.23, changePercent: 1.42, volume: 32100000, marketCap: 2780000000000, sector: 'Technology' },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 142.18, change: 0.95, changePercent: 0.67, volume: 41800000, marketCap: 1480000000000, sector: 'Consumer Discretionary' },
      { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.87, change: -7.23, changePercent: -2.82, volume: 52600000, marketCap: 791000000000, sector: 'Consumer Discretionary' },
      { symbol: 'META', name: 'Meta Platforms Inc.', price: 318.75, change: 4.12, changePercent: 1.31, volume: 19500000, marketCap: 810000000000, sector: 'Technology' },
      { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.28, change: 12.54, changePercent: 1.45, volume: 35600000, marketCap: 2160000000000, sector: 'Technology' },
      { symbol: 'NFLX', name: 'Netflix Inc.', price: 421.32, change: -3.87, changePercent: -0.91, volume: 8200000, marketCap: 187000000000, sector: 'Communication Services' },
      { symbol: 'AMD', name: 'Advanced Micro Devices', price: 137.45, change: 2.18, changePercent: 1.61, volume: 42300000, marketCap: 222000000000, sector: 'Technology' },
      { symbol: 'UBER', name: 'Uber Technologies', price: 56.23, change: -1.42, changePercent: -2.46, volume: 18700000, marketCap: 115000000000, sector: 'Technology' },
    ];

    for (const stock of defaultStocks) {
      await this.createOrUpdateStock(stock);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllStocks(): Promise<StockData[]> {
    return Array.from(this.stocks.values()).sort((a, b) => a.symbol.localeCompare(b.symbol));
  }

  async getStockBySymbol(symbol: string): Promise<StockData | undefined> {
    return this.stocks.get(symbol);
  }

  async createOrUpdateStock(stock: InsertStockData): Promise<StockData> {
    const id = randomUUID();
    const stockData: StockData = { 
      ...stock, 
      id, 
      lastUpdated: new Date(),
      marketCap: stock.marketCap ?? null,
      sector: stock.sector ?? null
    };
    this.stocks.set(stock.symbol, stockData);
    return stockData;
  }

  async updateStockPrices(stocks: InsertStockData[]): Promise<void> {
    for (const stock of stocks) {
      await this.createOrUpdateStock(stock);
    }
  }

  async getWatchlistByUserId(userId: string): Promise<WatchlistItem[]> {
    return Array.from(this.watchlists.values()).filter(item => item.userId === userId);
  }

  async addToWatchlist(item: InsertWatchlistItem): Promise<WatchlistItem> {
    const id = randomUUID();
    const watchlistItem: WatchlistItem = {
      ...item,
      id,
      addedAt: new Date(),
      sector: item.sector ?? null
    };
    this.watchlists.set(id, watchlistItem);
    return watchlistItem;
  }

  async removeFromWatchlist(userId: string, symbol: string): Promise<void> {
    for (const [id, item] of Array.from(this.watchlists.entries())) {
      if (item.userId === userId && item.symbol === symbol) {
        this.watchlists.delete(id);
        break;
      }
    }
  }
}

export const storage = new MemStorage();
