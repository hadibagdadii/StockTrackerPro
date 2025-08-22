import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStockDataSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Stock data routes
  app.get("/api/stocks", async (req, res) => {
    try {
      const stocks = await storage.getAllStocks();
      res.json(stocks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stocks" });
    }
  });

  app.get("/api/stocks/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const stock = await storage.getStockBySymbol(symbol.toUpperCase());
      
      if (!stock) {
        return res.status(404).json({ message: "Stock not found" });
      }
      
      res.json(stock);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stock" });
    }
  });

  app.post("/api/stocks/refresh", async (req, res) => {
    try {
      // In a real implementation, this would fetch from Alpha Vantage API
      // For now, we'll simulate price updates
      const stocks = await storage.getAllStocks();
      const updatedStocks = stocks.map(stock => ({
        symbol: stock.symbol,
        name: stock.name,
        price: stock.price + (Math.random() - 0.5) * 10,
        change: (Math.random() - 0.5) * 5,
        changePercent: (Math.random() - 0.5) * 3,
        volume: Math.floor(Math.random() * 50000000) + 10000000,
        marketCap: stock.marketCap,
        sector: stock.sector,
      }));
      
      await storage.updateStockPrices(updatedStocks);
      const refreshedStocks = await storage.getAllStocks();
      
      res.json(refreshedStocks);
    } catch (error) {
      res.status(500).json({ message: "Failed to refresh stock data" });
    }
  });

  // Watchlist routes (requires user authentication in real app)
  app.get("/api/watchlist", async (req, res) => {
    try {
      // For demo purposes, using a default user ID
      const userId = "default-user";
      const watchlist = await storage.getWatchlistByUserId(userId);
      res.json(watchlist);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch watchlist" });
    }
  });

  app.post("/api/watchlist", async (req, res) => {
    try {
      const { symbol, name, sector } = req.body;
      
      if (!symbol || !name) {
        return res.status(400).json({ message: "Symbol and name are required" });
      }
      
      // Check if stock is already in watchlist
      const existingWatchlist = await storage.getWatchlistByUserId("default-user");
      const alreadyExists = existingWatchlist.some(item => item.symbol === symbol.toUpperCase());
      
      if (alreadyExists) {
        return res.status(409).json({ message: "Stock is already in your watchlist" });
      }
      
      const watchlistItem = await storage.addToWatchlist({
        userId: "default-user",
        symbol: symbol.toUpperCase(),
        name,
        sector,
      });
      
      res.json(watchlistItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to add to watchlist" });
    }
  });

  app.delete("/api/watchlist/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      await storage.removeFromWatchlist("default-user", symbol.toUpperCase());
      res.json({ message: "Removed from watchlist" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove from watchlist" });
    }
  });

  // Market indices endpoint (mock data)
  app.get("/api/market-indices", async (req, res) => {
    try {
      const indices = [
        { name: "S&P 500", value: 4185.47, change: 12.38, changePercent: 0.30 },
        { name: "NASDAQ", value: 12843.81, change: -24.67, changePercent: -0.19 },
        { name: "Dow Jones", value: 33976.61, change: 156.82, changePercent: 0.46 },
        { name: "VIX", value: 18.45, change: 0.73, changePercent: 4.12 },
      ];
      res.json(indices);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch market indices" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
