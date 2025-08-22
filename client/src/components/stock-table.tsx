import { useMemo } from "react";
import { TrendingUp, TrendingDown, ChevronUp, ChevronDown, Plus } from "lucide-react";
import { formatCurrency, formatNumber, formatPercentage, formatChange } from "@/lib/formatters";
import type { StockData, SortConfig } from "@shared/schema";

interface StockTableProps {
  stocks: StockData[];
  searchTerm: string;
  sortConfig: SortConfig;
  onSort: (key: keyof StockData) => void;
  onAddToWatchlist?: (stock: StockData) => void;
  showAddButton?: boolean;
}

export function StockTable({ 
  stocks, 
  searchTerm, 
  sortConfig, 
  onSort, 
  onAddToWatchlist, 
  showAddButton = false 
}: StockTableProps) {
  const filteredAndSortedStocks = useMemo(() => {
    let filtered = stocks.filter(
      stock =>
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc' 
            ? aValue - bValue
            : bValue - aValue;
        }
        
        return 0;
      });
    }

    return filtered;
  }, [stocks, searchTerm, sortConfig]);

  const getSortIcon = (key: keyof StockData) => {
    if (sortConfig.key !== key) {
      return <ChevronUp className="w-4 h-4 text-muted-foreground" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-primary" />
      : <ChevronDown className="w-4 h-4 text-primary" />;
  };

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              {[
                { key: 'symbol' as keyof StockData, label: 'Symbol' },
                { key: 'name' as keyof StockData, label: 'Company' },
                { key: 'price' as keyof StockData, label: 'Price' },
                { key: 'change' as keyof StockData, label: 'Change' },
                { key: 'changePercent' as keyof StockData, label: 'Change %' },
                { key: 'volume' as keyof StockData, label: 'Volume' }
              ].map(column => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => onSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {getSortIcon(column.key)}
                  </div>
                </th>
              ))}
              {showAddButton && <th className="px-6 py-3"></th>}
            </tr>
          </thead>
          
          <tbody className="divide-y divide-border">
            {filteredAndSortedStocks.length === 0 ? (
              <tr>
                <td colSpan={showAddButton ? 7 : 6} className="px-6 py-8 text-center text-muted-foreground">
                  {searchTerm ? 'No stocks found matching your search.' : 'No stock data available.'}
                </td>
              </tr>
            ) : (
              filteredAndSortedStocks.map((stock) => (
                <tr key={stock.symbol} className="hover:bg-accent transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-bold text-primary">{stock.symbol}</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">{stock.name}</div>
                    <div className="text-xs text-muted-foreground">{stock.sector}</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-foreground">
                      {formatCurrency(stock.price)}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${
                      stock.change >= 0 ? 'financial-success' : 'financial-danger'
                    }`}>
                      {formatChange(stock.change)}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      stock.changePercent >= 0 
                        ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-400'
                        : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-400'
                    }`}>
                      {stock.changePercent >= 0 ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {formatPercentage(stock.changePercent)}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {formatNumber(stock.volume)}
                  </td>

                  {showAddButton && onAddToWatchlist && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => onAddToWatchlist(stock)}
                        className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
