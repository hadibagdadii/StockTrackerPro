import { PieChart, TrendingUp, BarChart3, Star, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="pt-20 pb-16 text-center">
          <div className="flex justify-center items-center mb-8">
            <PieChart className="w-16 h-16 text-primary mr-4" />
            <h1 className="text-5xl font-bold text-foreground">StockTracker Pro</h1>
          </div>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Professional stock market tracking application with real-time data, 
            personalized watchlists, and comprehensive analytics. Track your investments 
            and make informed decisions with our powerful dashboard.
          </p>
          
          <Button 
            onClick={handleLogin}
            size="lg"
            className="text-lg px-8 py-6 rounded-xl"
          >
            Sign In to Get Started
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-16">
          <div className="bg-card rounded-xl p-8 shadow-sm border border-border text-center">
            <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-4">Real-Time Data</h3>
            <p className="text-muted-foreground">
              Get live stock prices, market indices, and performance metrics 
              updated in real-time to stay ahead of market movements.
            </p>
          </div>

          <div className="bg-card rounded-xl p-8 shadow-sm border border-border text-center">
            <Star className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-4">Personal Watchlist</h3>
            <p className="text-muted-foreground">
              Create and manage your personalized stock watchlist. Track your 
              favorite stocks and get instant notifications on price changes.
            </p>
          </div>

          <div className="bg-card rounded-xl p-8 shadow-sm border border-border text-center">
            <BarChart3 className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-4">Advanced Analytics</h3>
            <p className="text-muted-foreground">
              Comprehensive charts, technical indicators, and market analysis 
              tools to help you make informed investment decisions.
            </p>
          </div>

          <div className="bg-card rounded-xl p-8 shadow-sm border border-border text-center">
            <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-4">Secure & Private</h3>
            <p className="text-muted-foreground">
              Your data is protected with enterprise-grade security. 
              All watchlists and settings are securely tied to your account.
            </p>
          </div>

          <div className="bg-card rounded-xl p-8 shadow-sm border border-border text-center">
            <Users className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-4">Multi-Device Access</h3>
            <p className="text-muted-foreground">
              Access your dashboard from any device. Your watchlists and 
              preferences sync automatically across all your devices.
            </p>
          </div>

          <div className="bg-card rounded-xl p-8 shadow-sm border border-border text-center">
            <PieChart className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-4">Portfolio Insights</h3>
            <p className="text-muted-foreground">
              Get detailed insights into your portfolio performance with 
              comprehensive metrics and visual representations.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Start Tracking?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of investors who trust StockTracker Pro for their market analysis.
          </p>
          <Button 
            onClick={handleLogin}
            size="lg"
            className="text-lg px-8 py-6 rounded-xl"
          >
            Sign In Now
          </Button>
        </div>
      </div>
    </div>
  );
}