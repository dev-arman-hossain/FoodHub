# FoodHub Backend

## Environment Setup

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

## Database Setup

Make sure PostgreSQL is running, then run:

```bash
npm run prisma:migrate
npm run seed
```

This will run all Prisma migrations and seed the initial data.

## Running the Server

```bash
npm run dev
```

Server runs on `http://localhost:5000`
