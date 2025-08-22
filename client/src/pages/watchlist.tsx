import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, X, TrendingUp, TrendingDown, Wallet, Star } from "lucide-react";
import { LoadingSpinner } from "@/components/loading-spinner";
import { formatCurrency, formatPercentage, formatChange } from "@/lib/formatters";
import type { StockData, WatchlistItem, SortConfig } from "@shared/schema";

export default function Watchlist() {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
  const queryClient = useQueryClient();

  const { data: watchlistItems = [], isLoading: watchlistLoading } = useQuery<WatchlistItem[]>({
    queryKey: ['/api/watchlist'],
  });

  const { data: allStocks = [], isLoading: stocksLoading } = useQuery<StockData[]>({
    queryKey: ['/api/stocks'],
  });

  const removeFromWatchlistMutation = useMutation({
    mutationFn: (symbol: string) => 
      fetch(`/api/watchlist/${symbol}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/watchlist'] });
    },
  });

  const requestSort = (key: keyof StockData) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Get stock data for watchlist items
  const watchlistWithStockData = watchlistItems.map(item => {
    const stockData = allStocks.find(stock => stock.symbol === item.symbol);
    return { ...item, stockData };
  }).filter(item => item.stockData);

  const totalValue = watchlistWithStockData.reduce((sum, item) => sum + (item.stockData?.price || 0), 0);
  const totalChange = watchlistWithStockData.reduce((sum, item) => sum + (item.stockData?.change || 0), 0);
  const bestPerformer = Math.max(...watchlistWithStockData.map(item => item.stockData?.changePercent || 0));
  const worstPerformer = Math.min(...watchlistWithStockData.map(item => item.stockData?.changePercent || 0));

  if (watchlistLoading || stocksLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Watchlist</h2>
          <p className="text-muted-foreground mt-1">Track your favorite stocks and performance</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="flex items-center px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors">
            <Plus className="mr-2 w-4 h-4" />
            Add Stock
          </button>
        </div>
      </div>

      {/* Watchlist Performance Summary */}
      {watchlistWithStockData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Portfolio Value</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(totalValue)}
                </p>
              </div>
              <Wallet className="w-8 h-8 text-primary" />
            </div>
          </div>
          
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Day's Change</p>
                <p className={`text-2xl font-bold ${totalChange >= 0 ? 'financial-success' : 'financial-danger'}`}>
                  {formatChange(totalChange)}
                </p>
              </div>
              {totalChange >= 0 ? (
                <TrendingUp className="w-8 h-8 financial-success" />
              ) : (
                <TrendingDown className="w-8 h-8 financial-danger" />
              )}
            </div>
          </div>
          
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Stocks Tracked</p>
                <p className="text-2xl font-bold text-foreground">{watchlistWithStockData.length}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      {watchlistWithStockData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-card rounded-lg shadow-sm border border-border p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Best Performer</p>
              <p className="text-2xl font-bold financial-success">
                {formatPercentage(bestPerformer)}
              </p>
            </div>
          </div>
          
          <div className="bg-card rounded-lg shadow-sm border border-border p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Worst Performer</p>
              <p className="text-2xl font-bold financial-danger">
                {formatPercentage(worstPerformer)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Watchlist Table */}
      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            Your Stocks ({watchlistWithStockData.length})
          </h3>
        </div>
        
        {watchlistWithStockData.length === 0 ? (
          <div className="p-8 text-center">
            <Star className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No stocks in watchlist</h3>
            <p className="text-muted-foreground">Add stocks to your watchlist to track their performance</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Change</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Change %</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Performance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {watchlistWithStockData.map((item) => (
                  <tr key={item.id} className="hover:bg-accent transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="font-semibold text-foreground">{item.symbol}</div>
                          <div className="text-sm text-muted-foreground">{item.stockData?.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-foreground">
                        {formatCurrency(item.stockData?.price || 0)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${
                        (item.stockData?.change || 0) >= 0 ? 'financial-success' : 'financial-danger'
                      }`}>
                        {formatChange(item.stockData?.change || 0)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        (item.stockData?.changePercent || 0) >= 0 
                          ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-400'
                          : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-400'
                      }`}>
                        {(item.stockData?.changePercent || 0) >= 0 ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {formatPercentage(item.stockData?.changePercent || 0)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`w-20 h-8 rounded flex items-center justify-center ${
                        (item.stockData?.changePercent || 0) >= 0 
                          ? 'bg-green-100 dark:bg-green-900/20' 
                          : 'bg-red-100 dark:bg-red-900/20'
                      }`}>
                        {(item.stockData?.changePercent || 0) >= 0 ? (
                          <TrendingUp className="text-green-600 dark:text-green-400 text-sm" />
                        ) : (
                          <TrendingDown className="text-red-600 dark:text-red-400 text-sm" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => removeFromWatchlistMutation.mutate(item.symbol)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        disabled={removeFromWatchlistMutation.isPending}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
