# Flight Fare Intelligence Platform - Backend

A NestJS-based backend API for the Fixed-Duration Flight Fare Intelligence Platform. This service provides flight search, price tracking, and notification capabilities.

## Features

- 🔍 **Flight Search**: Search flights using Amadeus API
- 💰 **Price Tracking**: Track flight prices and set target prices
- 🔔 **Smart Alerts**: Automated price drop notifications
- 📊 **Analytics**: Track searches, price trends, and API usage
- ⚡ **Background Jobs**: BullMQ with Redis for async processing
- 🔐 **Security**: Helmet, CORS, rate limiting, and input validation
- 📚 **API Docs**: Swagger/OpenAPI documentation

## Prerequisites

- Node.js 20+
- PostgreSQL 16+
- Redis 7+
- Amadeus API credentials

## Installation

### 1. Clone and install dependencies

```bash
cd backend
npm install
```

### 2. Setup environment variables

```bash
cp .env.example .env
# Edit .env with your credentials
```

### 3. Setup database

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio
npm run prisma:studio
```

### 4. Start development server

```bash
npm run start:dev
```

The API will be available at `http://localhost:3001`
- API Base: `http://localhost:3001/api/v1`
- Swagger Docs: `http://localhost:3001/api/docs`

## Docker Setup (Recommended)

Run the entire stack with Docker Compose:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down

# Stop and remove volumes (WARNING: deletes data)
docker-compose down -v
```

## Project Structure

```
src/
├── analytics/         # Analytics tracking service
├── amadeus/           # Amadeus API integration
├── common/            # Filters, interceptors, utils
│   ├── filters/
│   └── interceptors/
├── flight/            # Flight search module
├── notifications/     # Email/push notification service
├── prisma/            # Database client
├── queue/             # BullMQ job queue
├── redis/             # Redis client
├── reminders/         # Price reminder module
├── app.module.ts      # Root module
└── main.ts            # Application entry point
```

## API Endpoints

### Health Check
- `GET /api/v1/health` - Health status

### Flights
- `GET /api/v1/flights/search` - Search flights
- `GET /api/v1/flights/analysis` - Get price analysis

### Reminders
- `GET /api/v1/reminders` - Get user reminders
- `POST /api/v1/reminders` - Create reminder
- `DELETE /api/v1/reminders/:id` - Delete reminder

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment | development |
| `DATABASE_URL` | PostgreSQL connection | - |
| `REDIS_HOST` | Redis host | localhost |
| `REDIS_PORT` | Redis port | 6379 |
| `AMADEUS_CLIENT_ID` | Amadeus API key | - |
| `AMADEUS_CLIENT_SECRET` | Amadeus API secret | - |
| `FRONTEND_URL` | CORS origin | http://localhost:3000 |
| `JWT_SECRET` | JWT signing key | - |

## Available Scripts

```bash
# Development
npm run start:dev       # Start with hot reload
npm run start:debug     # Start with debugger

# Build
npm run build           # Build for production
npm run start:prod      # Start production build

# Testing
npm run test            # Run unit tests
npm run test:e2e        # Run end-to-end tests
npm run test:cov        # Run tests with coverage

# Linting
npm run lint            # Run ESLint with auto-fix

# Database
npm run prisma:generate # Generate Prisma client
npm run prisma:migrate  # Run database migrations
npm run prisma:studio   # Open Prisma Studio
npm run prisma:seed     # Seed database
```

## Architecture

### Modules

- **FlightModule**: Flight search and price analysis
- **RemindersModule**: Price reminders and scheduled checks
- **NotificationsModule**: Email/notification delivery
- **QueueModule**: Background job processing (BullMQ)
- **AnalyticsModule**: Usage tracking and reporting
- **PrismaModule**: Database ORM
- **RedisModule**: Caching and queue storage

### Scheduled Tasks

The application uses `@nestjs/schedule` for:

- **Hourly**: Check all active reminders for price drops
- **Daily**: Expire old reminders past their start date

### Queue Jobs

BullMQ handles:

- **price-checks**: Individual reminder price checks
- **notifications**: Email/push notifications
- **analytics**: Event tracking

## Testing

```bash
# Unit tests
npm run test

# E2E tests (requires running database)
npm run test:e2e

# Coverage report
npm run test:cov
```

## License

MIT License - See [LICENSE](../LICENSE) for details

## Support

For issues and feature requests, please use the [GitHub Issues](https://github.com/nomadlabs/flight-fare-intelligence/issues).
