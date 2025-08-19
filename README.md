# 🚀 Next Forge - Enterprise-Grade Next.js Monorepo

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript)
![Turborepo](https://img.shields.io/badge/Turborepo-2.5.3-EF4444?style=for-the-badge&logo=turborepo)
![pnpm](https://img.shields.io/badge/pnpm-10.11.0-F69220?style=for-the-badge&logo=pnpm)

**Production-ready monorepo template for building scalable Next.js applications with enterprise features**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/next-forge)
[![Deploy to Railway](https://railway.app/button.svg)](https://railway.app/template/new?template=https://github.com/vercel/next-forge)

</div>

## ✨ Features

### 🏗️ **Architecture & Infrastructure**
- **Monorepo Structure** - Scalable Turborepo setup with shared packages
- **TypeScript First** - End-to-end type safety across all applications
- **Modern Tooling** - Biome for linting, formatting, and code quality
- **Performance Optimized** - Turbo-powered builds with intelligent caching
- **Microservices Ready** - Separate API, web, and documentation apps

### 🎨 **Design System & UI**
- **Shadcn/ui Components** - Beautiful, accessible, and customizable components
- **Storybook Integration** - Component documentation and testing
- **Dark/Light Mode** - Seamless theme switching
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Design Tokens** - Consistent spacing, colors, and typography

### 🔐 **Authentication & Security**
- **Multi-Provider Auth** - Support for various authentication providers
- **Role-Based Access Control** - Granular permissions system
- **Security Middleware** - CSRF protection, rate limiting, and security headers
- **Session Management** - Secure session handling with encryption

### 🌐 **Internationalization**
- **Multi-Language Support** - Built-in i18n with language detection
- **RTL Support** - Right-to-left language compatibility
- **Dynamic Translations** - Runtime language switching
- **SEO Optimized** - Language-specific meta tags and URLs

### 📊 **Analytics & Monitoring**
- **Real-time Analytics** - Google Analytics, PostHog, and Vercel Analytics
- **Error Tracking** - Sentry integration for production monitoring
- **Performance Monitoring** - Core Web Vitals and custom metrics
- **Health Checks** - Automated system health monitoring

### 💰 **Payments & E-commerce**
- **Stripe Integration** - Secure payment processing
- **Webhook Handling** - Real-time payment notifications
- **Subscription Management** - Recurring billing support
- **Payment Analytics** - Revenue tracking and reporting

### 🤖 **AI & Machine Learning**
- **OpenAI Integration** - GPT-powered features and chat
- **AI Components** - Pre-built AI-powered UI components
- **Smart Recommendations** - ML-driven content suggestions
- **Natural Language Processing** - Text analysis and processing

### 📧 **Communication**
- **Email Templates** - Beautiful, responsive email designs
- **Transactional Emails** - Automated email workflows
- **Email Preview** - React Email for development
- **Email Analytics** - Delivery tracking and engagement metrics

### 🔄 **Real-time Features**
- **Live Collaboration** - Real-time document editing
- **WebSocket Support** - Instant updates and notifications
- **Presence Indicators** - User activity and status
- **Live Cursors** - Collaborative cursor tracking

### 📱 **Mobile & PWA**
- **Progressive Web App** - Offline support and app-like experience
- **Mobile Optimized** - Touch-friendly interfaces
- **Push Notifications** - Native notification support
- **App Store Ready** - PWA to native app conversion

### 🗄️ **Database & Storage**
- **Prisma ORM** - Type-safe database operations
- **Multiple Databases** - PostgreSQL, MySQL, SQLite support
- **File Storage** - Cloud storage integration (AWS S3, Cloudinary)
- **Database Migrations** - Safe schema evolution

### 🧪 **Testing & Quality**
- **End-to-End Testing** - Playwright for comprehensive testing
- **Unit Testing** - Vitest for fast unit tests
- **Component Testing** - Storybook for UI testing
- **Code Coverage** - Comprehensive test coverage reporting

### 📚 **Documentation**
- **Interactive Docs** - MDX-based documentation with live examples
- **API Reference** - Auto-generated OpenAPI documentation
- **Component Library** - Storybook for component documentation
- **Getting Started Guides** - Step-by-step tutorials

### 💹 **Cryptocurrency Analysis Dashboard**
- **Real-time TradingView Charts** - Professional-grade charts with candlestick patterns, multiple timeframes, and drawing tools
- **Technical Analysis** - Built-in indicators including SMA, EMA, RSI, MACD, and automatic support/resistance levels
- **AI Trading Assistant** - Interactive chat panel powered by OpenAI for market analysis and trading insights
- **Live Market Data** - Real-time cryptocurrency prices from Binance via CCXT
- **50+ Cryptocurrencies** - Track and analyze major cryptocurrency pairs
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🏛️ Project Structure

```
next-forge/
├── apps/                    # Applications
│   ├── web/                # Main web application (includes crypto dashboard)
│   ├── api/                # Backend API service
│   └── app/                # Mobile app (if applicable)
├── packages/               # Shared packages
│   ├── design-system/      # UI components and themes
│   ├── auth/               # Authentication logic
│   ├── database/           # Database configuration
│   ├── analytics/          # Analytics integration
│   ├── payments/           # Payment processing
│   ├── ai/                 # AI/ML features
│   ├── collaboration/      # Real-time features
│   ├── internationalization/ # i18n support
│   ├── notifications/      # Push notifications
│   ├── observability/      # Monitoring and logging
│   ├── security/           # Security middleware
│   ├── seo/                # SEO optimization
│   ├── storage/            # File storage
│   ├── webhooks/           # Webhook handling
│   ├── feature-flags/      # Feature toggles
│   ├── rate-limit/         # Rate limiting
│   └── testing/            # Testing utilities
└── scripts/                # Build and deployment scripts
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **pnpm** 10.11.0+
- **Git**

### Installation

```bash
# Clone the repository
git clone https://github.com/vercel/next-forge.git
cd next-forge

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Start development servers
pnpm dev
```

### Available Scripts

```bash
# Development
pnpm dev              # Start all development servers
pnpm dev:web          # Start web app only
pnpm dev:api          # Start API server only

# Building
pnpm build            # Build all applications
pnpm build:web        # Build web app only
pnpm build:api        # Build API only

# Testing
pnpm test             # Run all tests
pnpm test:e2e         # Run end-to-end tests
pnpm test:coverage    # Generate coverage report

# Code Quality
pnpm lint             # Lint all code
pnpm format           # Format all code
pnpm typecheck        # Type checking

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:migrate       # Run database migrations
pnpm db:studio        # Open Prisma Studio

# Utilities
pnpm clean            # Clean all build artifacts
pnpm analyze          # Analyze bundle sizes
pnpm translate        # Extract and translate strings
```

## 🌟 Key Applications

### 🌐 **Web Application** (`apps/web`)
- **Next.js 15** with App Router
- **React 19** with concurrent features
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Shadcn/ui** components
- **Internationalization** support
- **SEO optimization**
- **PWA capabilities**
- **Cryptocurrency Analysis Dashboard** at `/crypto`

### 🔌 **API Service** (`apps/api`)
- **RESTful API** endpoints
- **GraphQL** support (optional)
- **Rate limiting** and security
- **Webhook handling**
- **Health checks**
- **Cron jobs** for automation

## 💹 Cryptocurrency Analysis Dashboard

The web application includes a comprehensive cryptocurrency analysis dashboard accessible at `/crypto`.

### Features

- **Real-time TradingView Charts**: Professional-grade charts with candlestick patterns, multiple timeframes, and drawing tools
- **Technical Analysis**: Built-in indicators including SMA, EMA, RSI, MACD, and automatic support/resistance levels
- **AI Trading Assistant**: Interactive chat panel powered by OpenAI for market analysis and trading insights
- **Live Market Data**: Real-time cryptocurrency prices from Binance via CCXT
- **50+ Cryptocurrencies**: Track and analyze major cryptocurrency pairs
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Technology Stack

- **Next.js 15**: React framework with App Router
- **TradingView Widgets**: Professional trading charts
- **CCXT**: Cryptocurrency exchange library
- **Recharts**: Additional charting library
- **OpenAI API**: AI-powered analysis
- **Tailwind CSS**: Styling
- **TypeScript**: Type safety

### API Routes

- `/api/crypto/markets`: Get list of available cryptocurrency pairs
- `/api/crypto/ohlcv`: Fetch OHLCV (candlestick) data
- `/api/crypto/indicators`: Calculate technical indicators
- `/api/crypto/analyze`: AI-powered chart analysis

### Setup for Crypto Dashboard

1. **Environment Variables** (optional for AI features):
   ```env
   OPENAI_API_KEY=your_api_key_here
   ```

2. **Access the Dashboard**:
   - Navigate to `/crypto` in your web application
   - The app works with mock data if API keys are not configured

3. **Deployment**:
   - The crypto dashboard is included in the main web app
   - Deploy to Vercel with the same process as the main application
   - Add `OPENAI_API_KEY` environment variable for AI features

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/database"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Email
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-password"

# Payments
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Analytics
GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
POSTHOG_API_KEY="phc_..."

# AI
OPENAI_API_KEY="sk-..."

# Storage
AWS_ACCESS_KEY_ID="AKIA..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="us-east-1"
AWS_S3_BUCKET="your-bucket-name"
```

### Database Setup

```bash
# Install dependencies
pnpm install

# Set up database
pnpm db:generate
pnpm db:migrate
pnpm db:seed

# Open Prisma Studio
pnpm db:studio
```

## 🚀 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/next-forge)

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Railway

[![Deploy to Railway](https://railway.app/button.svg)](https://railway.app/template/new?template=https://github.com/vercel/next-forge)

1. Click the Railway button above
2. Connect your GitHub repository
3. Configure environment variables
4. Deploy with one click

### Docker

```bash
# Build the Docker image
docker build -t next-forge .

# Run the container
docker run -p 3000:3000 next-forge
```

## 📊 Performance

This template is optimized for performance:

- **⚡ Fast Builds** - Turborepo caching for 10x faster builds
- **🎯 Bundle Optimization** - Tree shaking and code splitting
- **📱 Core Web Vitals** - Optimized for Lighthouse scores
- **🔄 Incremental Static Regeneration** - Fast page updates
- **📦 Image Optimization** - Automatic image optimization
- **🚀 Edge Functions** - Serverless functions at the edge

## 🔒 Security

Built with security best practices:

- **🛡️ CSRF Protection** - Cross-site request forgery prevention
- **🚫 XSS Prevention** - Content Security Policy headers
- **🔐 Secure Headers** - Security-focused HTTP headers
- **🔄 Rate Limiting** - API abuse prevention
- **🔑 Environment Variables** - Secure secret management
- **🔍 Input Validation** - Zod schema validation

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Style

- **TypeScript** for type safety
- **Biome** for linting and formatting
- **Conventional Commits** for commit messages
- **Prettier** for code formatting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Vercel** for Next.js and deployment platform
- **Turborepo** for the monorepo tooling
- **Shadcn** for the beautiful UI components
- **Prisma** for the database toolkit
- **Tailwind CSS** for the utility-first CSS framework

## 📞 Support

- **Documentation**: [docs.next-forge.com](https://docs.next-forge.com)
- **Issues**: [GitHub Issues](https://github.com/vercel/next-forge/issues)
- **Discussions**: [GitHub Discussions](https://github.com/vercel/next-forge/discussions)
- **Discord**: [Join our community](https://discord.gg/next-forge)

---

<div align="center">

**Built with ❤️ by the Next Forge community**

[![GitHub stars](https://img.shields.io/github/stars/vercel/next-forge?style=social)](https://github.com/vercel/next-forge)
[![GitHub forks](https://img.shields.io/github/forks/vercel/next-forge?style=social)](https://github.com/vercel/next-forge)
[![GitHub issues](https://img.shields.io/github/issues/vercel/next-forge)](https://github.com/vercel/next-forge/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/vercel/next-forge)](https://github.com/vercel/next-forge/pulls)

</div>
