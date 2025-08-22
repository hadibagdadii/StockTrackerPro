import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { StockTable } from "@/components/stock-table";
import { LoadingSpinner } from "@/components/loading-spinner";
import { formatCurrency } from "@/lib/formatters";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import type { StockData, SortConfig, MarketIndex } from "@shared/schema";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { generateMockChartData } from "@/lib/stock-api";

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedPerformance, setSelectedPerformance] = useState('');
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: stocks = [], isLoading: stocksLoading } = useQuery<StockData[]>({
    queryKey: ['/api/stocks'],
  });

  const { data: marketIndices = [], isLoading: indicesLoading } = useQuery<MarketIndex[]>({
    queryKey: ['/api/market-indices'],
  });

  const refreshMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('/api/stocks/refresh', { method: 'POST' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stocks'] });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to refresh stock data",
        variant: "destructive",
      });
    },
  });

  const addToWatchlistMutation = useMutation({
    mutationFn: async (stock: StockData) => {
      return await apiRequest('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: stock.symbol,
          name: stock.name,
          sector: stock.sector,
        }),
      });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/watchlist'] });
      toast({
        title: "Added to Watchlist",
        description: `${variables.symbol} has been added to your watchlist.`,
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const requestSort = (key: keyof StockData) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredStocks = stocks.filter(stock => {
    const matchesSearch = !searchTerm || 
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSector = !selectedSector || stock.sector === selectedSector;
    
    const matchesPerformance = !selectedPerformance || 
      (selectedPerformance === 'gainers' && stock.change > 0) ||
      (selectedPerformance === 'losers' && stock.change < 0);
    
    return matchesSearch && matchesSector && matchesPerformance;
  });

  const sectors = Array.from(new Set(stocks.map(stock => stock.sector).filter(Boolean)));
  const chartData = generateMockChartData();

  if (stocksLoading || indicesLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Market Overview Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Market Overview</h2>
            <p className="text-muted-foreground mt-1">Real-time market data and analysis</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <button 
              onClick={() => refreshMutation.mutate()}
              disabled={refreshMutation.isPending}
              className="flex items-center px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`mr-2 w-4 h-4 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <div className="text-sm text-muted-foreground">
              Last updated: <span>{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Market Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {marketIndices.map((index) => (
            <div key={index.name} className="bg-card rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">{index.name}</h3>
                {index.change >= 0 ? (
                  <TrendingUp className="financial-success" />
                ) : (
                  <TrendingDown className="financial-danger" />
                )}
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">{index.value.toLocaleString()}</p>
                  <p className={`text-sm ${index.change >= 0 ? 'financial-success' : 'financial-danger'}`}>
                    {index.change >= 0 ? '+' : ''}{index.change} ({index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%)
                  </p>
                </div>
                <div className={`w-16 h-8 rounded ${index.change >= 0 ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search stocks by symbol or company name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
              />
            </div>
          </div>

          <div className="lg:w-48">
            <select 
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
            >
              <option value="">All Sectors</option>
              {sectors.map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
          </div>

          <div className="lg:w-40">
            <select 
              value={selectedPerformance}
              onChange={(e) => setSelectedPerformance(e.target.value)}
              className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
            >
              <option value="">All</option>
              <option value="gainers">Gainers</option>
              <option value="losers">Losers</option>
            </select>
          </div>
        </div>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Stocks</p>
              <p className="text-2xl font-bold text-foreground">{stocks.length}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
        </div>
        
        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Gainers</p>
              <p className="text-2xl font-bold financial-success">
                {stocks.filter(s => s.change > 0).length}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 financial-success" />
          </div>
        </div>
        
        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Losers</p>
              <p className="text-2xl font-bold financial-danger">
                {stocks.filter(s => s.change < 0).length}
              </p>
            </div>
            <TrendingDown className="w-8 h-8 financial-danger" />
          </div>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Stock Performance</h3>
          <p className="text-sm text-muted-foreground mt-1">Real-time stock prices and performance metrics</p>
        </div>
        
        <StockTable 
          stocks={filteredStocks}
          searchTerm=""
          sortConfig={sortConfig}
          onSort={requestSort}
          onAddToWatchlist={(stock) => addToWatchlistMutation.mutate(stock)}
          showAddButton
        />
      </div>

      {/* Interactive Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Price Chart */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Price Chart</h3>
            <div className="flex items-center space-x-2">
              <select className="text-sm border border-input rounded-md px-3 py-1 bg-background text-foreground">
                <option value="AAPL">AAPL</option>
                <option value="GOOGL">GOOGL</option>
                <option value="MSFT">MSFT</option>
              </select>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => `$${value.toFixed(0)}`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                  formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Price']}
                  labelFormatter={(label) => new Date(label).toLocaleDateString()}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))" 
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Volume Chart */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Volume Analysis</h3>
            <div className="text-sm text-muted-foreground">Last 30 days</div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                  formatter={(value) => [`${(Number(value) / 1000000).toFixed(1)}M`, 'Volume']}
                  labelFormatter={(label) => new Date(label).toLocaleDateString()}
                />
                <Bar 
                  dataKey="volume" 
                  fill="hsl(var(--chart-2))"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
