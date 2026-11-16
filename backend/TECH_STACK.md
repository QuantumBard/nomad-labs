# Flight Fare Intelligence Backend - Developer Guide

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Environment Variables](#environment-variables)
4. [Getting Started](#getting-started)
5. [Project Structure](#project-structure)
6. [API Documentation](#api-documentation)
7. [Database Schema](#database-schema)
8. [Background Jobs](#background-jobs)
9. [Deployment](#deployment)
10. [Development Guidelines](#development-guidelines)

---

## Architecture Overview

This backend powers a **Fixed-Duration Flight Fare Intelligence Platform** that helps users track flight prices and receive alerts when prices drop significantly (30% below average).

### System Flow

```
User → Frontend (Next.js) → NestJS API → Amadeus API
                     ↓
              PostgreSQL (Data)
                     ↓
              Redis (Cache + Queue)
                     ↓
              BullMQ (Background Jobs)
                     ↓
              Email Notifications
```

---

## Technology Stack

### Core Framework

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Runtime | Node.js | 20.x | JavaScript runtime |
| Framework | NestJS | 10.x | Structured, scalable API framework |
| Language | TypeScript | 5.x | Type-safe development |

### Database & Storage

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Primary DB | PostgreSQL 15+ | Relational data storage |
| Hosting | Supabase | Hosted PostgreSQL |
| ORM | Prisma 5.x | Type-safe database access |
| Cache | Upstash Redis | Serverless Redis via REST API |
| Queue | BullMQ | Background job processing |

### External Services

| Service | Provider | Purpose |
|---------|----------|---------|
| Flight API | Amadeus | Real-time flight search & pricing |
| Email | Nodemailer | Price alert notifications |

### Development Tools

| Tool | Purpose |
|------|---------|
| ESLint | Code linting |
| Prettier | Code formatting |
| Swagger | API documentation |
| Docker | Containerization |
| Jest | Unit testing |

---

## Environment Variables

Create a `.env` file in the root of the backend directory. **Never commit this file to version control!**

### Required Variables

```bash
# Application
NODE_ENV=development          # Options: development, production, test
PORT=3001                     # API server port

# Database (PostgreSQL)
# Option 1: Supabase (Recommended for Production)
# Get from Supabase Dashboard → Settings → Database → Connection string
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?schema=public"

# Option 2: Local PostgreSQL
# DATABASE_URL="postgresql://user:password@localhost:5432/flight_fare_db?schema=public"
# Format: postgresql://USER:PASSWORD@HOST:PORT/DB_NAME?schema=SCHEMA

# Redis (Upstash - Serverless Redis via REST API)
# Get these from your Upstash Console: https://console.upstash.com/redis
UPSTASH_REDIS_REST_URL=https://your-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_token_here
# Note: If not provided, caching will be disabled but the app will still work

# Amadeus Flight API (Get from https://developers.amadeus.com/)
AMADEUS_API_KEY=your_amadeus_api_key_here
AMADEUS_API_SECRET=your_amadeus_api_secret_here
# Note: If not provided, the system will use mock data for development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# JWT/Auth (if implementing authentication)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
```

### Optional Variables

```bash
# Email Configuration (for price alerts)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM="Flight Alerts <alerts@yourdomain.com>"

# Monitoring & Logging
LOG_LEVEL=info               # Options: debug, info, warn, error
SENTRY_DSN=                  # Sentry error tracking URL (optional)

# Rate Limiting
RATE_LIMIT_TTL=60000        # Time window in ms (1 minute)
RATE_LIMIT_MAX=100          # Max requests per window
```

### Getting API Keys

#### Amadeus API

1. Visit [Amadeus for Developers](https://developers.amadeus.com/)
2. Create a free account
3. Create a new application
4. Copy the **API Key** and **API Secret**
5. Add them to your `.env` file

**Note:** The free tier includes:
- 2,000 API calls/month
- Test environment access
- Flight search and price data

#### Supabase Database

For **production**, we recommend using **Supabase** (managed PostgreSQL):

1. Visit [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Go to **Settings** → **Database**
4. Copy the **Connection string** under "URI"
5. Replace `[YOUR-PASSWORD]` with your database password

**Important Security Notes:**
- **Publishable Key** (starts with `eyJ...`): Used for frontend/client-side Supabase SDK only
- **Service Role Key** (starts with `eyJ...`): Used for backend/server-side operations - keep this secret!
- **Database Password**: Found in Settings → Database, or you set it during project creation
- **Never** commit the service_role key or database password to version control

**Connection String Format:**
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?schema=public
```

Replace:
- `[PASSWORD]`: Your database password
- `[PROJECT-REF]`: Your project reference (found in Settings → API)

**Benefits:**
- Managed PostgreSQL (backups, scaling, monitoring included)
- Free tier: 500MB database, 2GB bandwidth
- Built-in authentication, storage, and real-time features
- Row Level Security (RLS) for data protection

---

#### Upstash Redis

We're using **Upstash** (serverless Redis via REST API):

1. Visit [Upstash Console](https://console.upstash.com/redis)
2. Create a new Redis database
3. Copy the **REST URL** and **REST Token**
4. Add them to your `.env` file

**Benefits:**
- No Redis server to manage
- HTTP/REST API (works from anywhere)
- Free tier: 10,000 commands/day
- Global edge network for low latency

**Alternative:** If you prefer self-hosted Redis:
- [Redis Cloud](https://redis.com/) (free tier available)
- Docker: `docker run -d -p 6379:6379 --name redis redis:7-alpine`
- AWS ElastiCache

---

## Getting Started

### Prerequisites

- Node.js 20+ installed
- PostgreSQL 15+ database (local or Supabase)
- Upstash Redis account (free tier) or local Redis
- (Optional) Amadeus API credentials

### Installation Steps

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database:**
   ```bash
   # Generate Prisma client
   npm run prisma:generate
   
   # Run migrations
   npm run prisma:migrate
   
   # (Optional) Open Prisma Studio to view data
   npm run prisma:studio
   ```

5. **Start development server:**
   ```bash
   npm run start:dev
   ```

   The API will be available at:
   - API: http://localhost:3001/api/v1
   - Docs: http://localhost:3001/api/docs
   - Health: http://localhost:3001/api/v1/health

### Using Docker (Recommended)

For a complete environment with PostgreSQL and Redis:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop all services
docker-compose down
```

This will start:
- Backend API on port 3001
- PostgreSQL on port 5432
- Redis on port 6379

---

## Project Structure

```
backend/
├── src/
│   ├── amadeus/              # Amadeus API integration
│   │   ├── amadeus.module.ts
│   │   └── amadeus.service.ts
│   │
│   ├── analytics/            # Analytics & reporting
│   │   ├── analytics.module.ts
│   │   └── analytics.service.ts
│   │
│   ├── common/               # Shared utilities
│   │   ├── filters/          # Exception filters
│   │   └── interceptors/     # Request/Response interceptors
│   │
│   ├── flight/               # Flight search module
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── flight.controller.ts
│   │   ├── flight.module.ts
│   │   └── flight.service.ts
│   │
│   ├── notifications/        # Email notifications
│   │   ├── notifications.module.ts
│   │   └── notifications.service.ts
│   │
│   ├── prisma/               # Database ORM
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   │
│   ├── queue/                # Background job queue
│   │   ├── queue.module.ts
│   │   └── queue.service.ts
│   │
│   ├── redis/                # Redis client
│   │   └── redis.module.ts
│   │
│   ├── reminders/            # Price reminder core feature
│   │   ├── dto/
│   │   ├── reminders.controller.ts
│   │   ├── reminders.module.ts
│   │   ├── reminders.processor.ts
│   │   └── reminders.service.ts
│   │
│   ├── app.controller.ts     # Main controller
│   ├── app.module.ts         # Root module
│   ├── app.service.ts        # Main service
│   └── main.ts               # Application entry point
│
├── prisma/
│   └── schema.prisma         # Database schema
│
├── .env.example              # Example environment variables
├── docker-compose.yml        # Docker services
├── Dockerfile                # Production build
├── package.json              # Dependencies
├── README.md                 # Quick start guide
├── TECH_STACK.md             # This file
├── tsconfig.json             # TypeScript config
└── nest-cli.json             # NestJS CLI config
```

---

## API Documentation

### Swagger UI

Interactive API documentation is automatically available at:
```
http://localhost:3001/api/docs
```

### Main Endpoints

#### Flight Search

```http
GET /api/v1/flights/search
```

Query Parameters:
- `origin` (string, required) - Origin airport code (e.g., JFK)
- `destination` (string, required) - Destination airport code (e.g., LHR)
- `departureDate` (string, required) - Departure date (YYYY-MM-DD)
- `returnDate` (string, optional) - Return date (YYYY-MM-DD)
- `adults` (number, optional) - Number of adult passengers (default: 1)
- `currency` (string, optional) - Currency code (default: USD)

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "flight-1",
      "source": "JFK",
      "destination": "LHR",
      "departureDate": "2026-02-15T08:00:00.000Z",
      "price": 450,
      "currency": "USD",
      "airline": "SkyWings",
      "flightNumber": "SW2847",
      "duration": "7h 30m",
      "stops": 0
    }
  ],
  "meta": {
    "count": 5,
    "averagePrice": 425,
    "minPrice": 380,
    "maxPrice": 520
  }
}
```

#### Price Analysis

```http
GET /api/v1/flights/price-analysis?origin=JFK&destination=LHR&date=2026-02-15
```

Response:
```json
{
  "success": true,
  "data": {
    "averagePrice": 425,
    "minPrice": 380,
    "maxPrice": 520,
    "trend": "down",
    "recommendedTarget": 297  // 30% below average
  }
}
```

#### Create Reminder

```http
POST /api/v1/reminders
```

Body:
```json
{
  "userId": "user-uuid-here",
  "source": "New York",
  "destination": "London",
  "sourceCode": "JFK",
  "destinationCode": "LHR",
  "startDate": "2026-02-15",
  "endDate": "2026-02-22",
  "targetPrice": 297
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "reminder-uuid",
    "userId": "user-uuid",
    "source": "New York",
    "destination": "London",
    "targetPrice": 297,
    "status": "ACTIVE",
    "createdAt": "2026-01-31T10:00:00.000Z"
  },
  "message": "Reminder created! Target price: $297"
}
```

#### Get User Reminders

```http
GET /api/v1/reminders?userId=user-uuid-here
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "reminder-uuid",
      "source": "New York",
      "destination": "London",
      "targetPrice": 297,
      "currentPrice": 450,
      "status": "ACTIVE",
      "isTriggered": false
    }
  ],
  "stats": {
    "total": 1,
    "active": 1,
    "triggered": 0
  }
}
```

---

## Database Schema

### Core Entities

#### User
- Stores user information
- Linked to reminders and searches

#### FlightReminder
- Core feature entity
- Tracks price targets and trigger status
- Related fare history for trend analysis

#### FareHistory
- Time-series price data
- Tracks price changes over time
- Used for trend analysis

#### FlightSearch
- Logs all flight searches
- Analytics for popular routes
- Helps identify trending destinations

### Enum Types

```typescript
enum UserType {
  TRAVELLER
  MANAGER
  ADMIN
  SUPPORT
}

enum ReminderStatus {
  ACTIVE
  TRIGGERED
  EXPIRED
  CANCELLED
}
```

---

## Background Jobs

### Automated Price Checking

**Schedule:** Every hour (`0 * * * *`)

**Process:**
1. Fetch all `ACTIVE` reminders
2. Search current flight prices
3. Update current price in database
4. If price ≤ target price:
   - Update status to `TRIGGERED`
   - Send notification email
   - Record in fare history

### Expiration Cleanup

**Schedule:** Daily at midnight (`0 0 * * *`)

**Process:**
1. Find reminders where `startDate` has passed
2. Update status to `EXPIRED`
3. Stop price monitoring

### Manual Trigger

You can manually trigger a reminder check via API:

```http
POST /api/v1/reminders/:id/check
```

---

## Deployment

### Docker Production Build

```bash
# Build production image
docker build -t flight-fare-backend .

# Run with environment variables
docker run -d \
  -p 3001:3001 \
  -e NODE_ENV=production \
  -e DATABASE_URL=postgresql://... \
  -e REDIS_HOST=redis \
  -e AMADEUS_API_KEY=xxx \
  flight-fare-backend
```

### Environment-Specific Configurations

#### Development
- Uses local PostgreSQL and Redis
- Mock data if Amadeus API not configured
- Detailed error messages
- Swagger UI enabled

#### Production
- Use managed database (Supabase, AWS RDS, etc.)
- Use managed Redis (Redis Cloud, Upstash)
- Amadeus API required for real data
- Swagger UI can be disabled
- Enable comprehensive logging
- Use process managers (PM2, systemd)

### Platform Deployment Options

| Platform | Ease | Cost | Best For |
|----------|------|------|----------|
| Railway | Easy | $ | Quick MVP |
| Fly.io | Easy | $ | Global edge |
| Render | Easy | $ | Simple hosting |
| AWS ECS | Medium | $$ | Scale |
| DigitalOcean | Easy | $ | Control |

---

## Development Guidelines

### Code Style

- Use TypeScript strict mode
- Follow NestJS naming conventions
- Use dependency injection
- Write comprehensive JSDoc comments
- Keep functions small and focused

### Adding New Endpoints

1. Create DTO in `src/module/dto/`
2. Add controller method with decorators
3. Implement service logic
4. Add Swagger documentation
5. Write unit tests

### Database Migrations

```bash
# After changing schema.prisma
npm run prisma:migrate

# Generate client
npm run prisma:generate

# View data
npm run prisma:studio
```

### Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

### Logging

Use the built-in NestJS logger:

```typescript
import { Logger } from '@nestjs/common';

@Injectable()
export class MyService {
  private readonly logger = new Logger(MyService.name);

  doSomething() {
    this.logger.log('Info message');
    this.logger.error('Error message', error.stack);
    this.logger.warn('Warning message');
    this.logger.debug('Debug message');
  }
}
```

---

## Troubleshooting

### Common Issues

**"Cannot connect to database"**
- Check DATABASE_URL format
- Ensure PostgreSQL is running
- Verify user has proper permissions

**"Redis connection refused"**
- Check Redis is running: `redis-cli ping`
- Verify REDIS_HOST and REDIS_PORT
- Check firewall settings

**"Amadeus API errors"**
- Verify API keys are correct
- Check rate limits (2,000/month on free tier)
- System falls back to mock data if API fails

**"Prisma generate fails"**
- Delete `node_modules/.prisma`
- Run `npm run prisma:generate` again

### Getting Help

1. Check application logs: `docker-compose logs -f app`
2. Review API response in Swagger UI
3. Check database with Prisma Studio
4. Verify all environment variables are set

---

## Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Amadeus API Docs](https://developers.amadeus.com/self-service)
- [BullMQ Documentation](https://docs.bullmq.io/)
- [Redis Commands](https://redis.io/commands)

---

## Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Make changes with tests
3. Run linting: `npm run lint`
4. Commit with clear messages
5. Push and create PR

---

## License

This project is private and proprietary to NomadLabs.

---

**Last Updated:** January 2026  
**Version:** 1.0.0  
**Maintainers:** NomadLabs Engineering Team
