# Auth Service

Authentication and Onboarding Microservice for TaskFlow.

## Features

- User Registration (Email/Password)
- User Login with JWT
- OAuth Support (Google, GitHub, Apple)
- Onboarding Flow
- Shared Database with Main Application

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Generate Prisma Client (uses main schema):
```bash
npx prisma generate --schema=../prisma/schema.prisma
```

4. Run in development:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/providers` - Get available OAuth providers
- `GET /api/auth/callback/:provider` - OAuth callback

### Onboarding

- `POST /api/onboarding` - Complete user onboarding

### Health Check

- `GET /health` - Service health status

## Environment Variables

See `.env.example` for required environment variables.

## Database

This service uses the same PostgreSQL database as the main application. The Prisma schema is shared from the parent directory.
