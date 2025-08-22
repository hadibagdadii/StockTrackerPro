# StockTracker Pro

## Overview

StockTracker Pro is a modern, full-stack financial dashboard application for tracking stock market data, managing watchlists, and analyzing financial trends. Built with a React frontend and Express backend, it provides real-time stock tracking, portfolio management, and comprehensive analytics with a clean, responsive interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight, declarative routing
- **State Management**: TanStack Query for server state management and caching
- **UI Framework**: shadcn/ui components built on Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with CSS variables for consistent theming and dark mode support
- **Charts**: Recharts for responsive financial data visualization
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture  
- **Runtime**: Node.js with Express.js framework for RESTful API endpoints
- **Language**: TypeScript with ES modules for type safety across the stack
- **Data Storage**: In-memory storage implementation with interface for future database integration
- **API Design**: RESTful endpoints following standard HTTP methods and status codes
- **Development**: Hot reloading with automatic server restart via tsx

### Database Design
- **ORM**: Drizzle ORM configured for PostgreSQL with type-safe schema definitions
- **Schema**: Three main entities - users, stock_data, and watchlist_items with proper relationships
- **Migrations**: Drizzle Kit for database schema management and migrations
- **Connection**: Neon Database serverless PostgreSQL integration ready for production

### Authentication & Security
- **Session Management**: connect-pg-simple for PostgreSQL-backed session storage
- **User System**: Basic user authentication with username/password (extensible for OAuth)
- **Data Validation**: Zod schemas for runtime type checking and API request validation

### Development Workflow
- **Monorepo Structure**: Shared TypeScript types and schemas between frontend and backend
- **Path Aliases**: Organized imports with @ prefixes for clean code organization
- **Hot Reload**: Vite HMR for frontend and tsx for backend development
- **Error Handling**: Runtime error overlays in development environment

### Production Considerations
- **Build Process**: ESBuild for server bundling, Vite for client optimization
- **Asset Management**: Static file serving with proper caching headers
- **Environment Variables**: Configuration-driven database connections and API keys
- **Performance**: Code splitting, lazy loading, and optimized bundle sizes