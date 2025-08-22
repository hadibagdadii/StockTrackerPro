import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/loading-spinner";
import { formatCurrency, formatPercentage } from "@/lib/formatters";
import { generateMockChartData } from "@/lib/stock-api";
import type { StockData } from "@shared/schema";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, BarChart, Bar } from 'recharts';

export default function Analytics() {
  const [selectedStock, setSelectedStock] = useState('AAPL');
  
  const { data: stocks = [], isLoading } = useQuery<StockData[]>({
    queryKey: ['/api/stocks'],
  });

  const selectedStockData = stocks.find(s => s.symbol === selectedStock);
  const chartData = generateMockChartData();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Analytics Dashboard</h2>
            <p className="text-muted-foreground">Advanced charts and market analysis</p>
          </div>
          
          <select
            value={selectedStock}
            onChange={(e) => setSelectedStock(e.target.value)}
            className="px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent outline-none"
          >
            {stocks.map(stock => (
              <option key={stock.symbol} value={stock.symbol}>
                {stock.symbol} - {stock.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stock Info Card */}
      {selectedStockData && (
        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <h3 className="text-2xl font-bold text-foreground">{selectedStockData.symbol}</h3>
              <p className="text-muted-foreground">{selectedStockData.name}</p>
              <p className="text-sm text-muted-foreground">{selectedStockData.sector}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Current Price</p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(selectedStockData.price)}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Change</p>
              <p className={`text-2xl font-bold ${selectedStockData.change >= 0 ? 'financial-success' : 'financial-danger'}`}>
                {formatPercentage(selectedStockData.changePercent)}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Market Cap</p>
              <p className="text-2xl font-bold text-foreground truncate">
                {selectedStockData.marketCap ? formatCurrency(selectedStockData.marketCap) : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Chart */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {selectedStock} - 30 Day Price History
          </h3>
          
          <ResponsiveContainer width="100%" height={300}>
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

        {/* Volume Chart */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Trading Volume
          </h3>
          
          <ResponsiveContainer width="100%" height={300}>
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

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Moving Averages */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Moving Averages</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">20-Day MA</span>
              <span className="font-semibold text-foreground">
                {selectedStockData ? formatCurrency(selectedStockData.price * 1.02) : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">50-Day MA</span>
              <span className="font-semibold text-foreground">
                {selectedStockData ? formatCurrency(selectedStockData.price * 0.98) : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">200-Day MA</span>
              <span className="font-semibold text-foreground">
                {selectedStockData ? formatCurrency(selectedStockData.price * 0.95) : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Technical Indicators */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Technical Indicators</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">RSI (14)</span>
              <span className="font-semibold text-foreground">64.2</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">MACD</span>
              <span className="font-semibold financial-success">+2.1</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Bollinger %B</span>
              <span className="font-semibold text-foreground">0.72</span>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Key Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">52W High</span>
              <span className="font-semibold text-foreground">
                {selectedStockData ? formatCurrency(selectedStockData.price * 1.15) : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">52W Low</span>
              <span className="font-semibold text-foreground">
                {selectedStockData ? formatCurrency(selectedStockData.price * 0.75) : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Avg Volume</span>
              <span className="font-semibold text-foreground">
                {selectedStockData ? `${(selectedStockData.volume / 1000000).toFixed(1)}M` : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
