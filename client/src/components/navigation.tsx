import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "./theme-provider";
import {
  Home,
  Star,
  BarChart3,
  Settings,
  Sun,
  Moon,
  Menu,
  PieChart,
} from "lucide-react";

const navItems = [
  { id: "/", label: "Dashboard", icon: Home },
  { id: "/watchlist", label: "Watchlist", icon: Star },
  { id: "/analytics", label: "Analytics", icon: BarChart3 },
  { id: "/settings", label: "Settings", icon: Settings },
];

export function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  return (
    <nav className="bg-white dark:bg-card border-b border-gray-200 dark:border-border sticky top-0 z-50 backdrop-blur-sm bg-white/95 dark:bg-card/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <PieChart className="w-8 h-8 text-primary mr-3" />
            <h1 className="text-xl font-bold text-foreground">StockTracker Pro</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.id;
              return (
                <Link key={item.id} href={item.id}>
                  <button
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </button>
                </Link>
              );
            })}
          </div>

          {/* Theme Toggle & Mobile Menu */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.id;
              return (
                <Link key={item.id} href={item.id}>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center w-full px-3 py-2 rounded-md text-sm font-medium transition-colors mb-1 ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </button>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
