# ApexTracker AI - Full-Stack Expense Tracker with Analytics

A production-ready, full-stack personal finance and expense analytics web application built for a 3rd-year Computer Science student's portfolio. Featuring JWT authentication with refresh token rotation, financial tracking (Expenses, Incomes, Budgets, Savings Goals, Custom Categories), AI-driven financial insights using Google Generative AI (`@google/genai`), PDF financial statement exports, receipt uploads, interactive Recharts visualizations, and comprehensive Swagger OpenAPI documentation.

---

## Tech Stack & Architecture

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Glassmorphism design tokens + Custom Scrollbars
- **State & Data Fetching**: React Query (`@tanstack/react-query`) + Axios API Client with automated JWT refresh interceptor
- **Visualizations**: Recharts (Area charts, Bar charts, Pie charts, Line charts)
- **UI & Micro-interactions**: Lucide React Icons + Framer Motion + React Hot Toast
- **Form Handling**: React Hook Form + Zod validation

### Backend
- **Runtime**: Node.js + Express + TypeScript
- **Database & ORM**: PostgreSQL with Prisma ORM
- **Authentication**: JWT Access Tokens + Refresh Token rotation + Bcrypt password hashing
- **Security & Logging**: Helmet, CORS, Morgan, Winston Logger, Zod Middleware Validation
- **AI Intelligence**: Google Generative AI SDK (`@google/genai` gemini-2.5-flash) with automated heuristic fallback engine
- **Document & File Handling**: PDFKit (Monthly PDF statements) + Multer (Receipt file attachments)
- **API Documentation**: Swagger UI & OpenAPI 3.0 (`/api-docs`)

---

## Getting Started & Local Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database or Docker installed

### Quick Start (Single Command Launch)

1. **Install All Dependencies**:
   ```bash
   npm run install:all
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env` in both root and `server/`:
   ```bash
   cp .env.example .env
   cp server/.env.example server/.env
   ```

3. **Prisma Setup & Database Seeding**:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed
   ```

4. **Launch Full Application**:
   ```bash
   npm run dev
   ```
   - **Frontend App**: `http://localhost:5173`
   - **Backend API**: `http://localhost:5000/api`
   - **Swagger API Docs**: `http://localhost:5000/api-docs`

---

## Pre-seeded Demo Credentials

An initial demo user and default expense categories are seeded automatically:
- **Email**: `demo@example.com`
- **Password**: `Password123!`

*(The Sign In page includes a quick "Auto-fill Demo Account" button for instant testing).*

---

## Docker Support

Run full containerized environment (PostgreSQL DB + Express API):
```bash
docker-compose up --build -d
```

---

## Project Structure

```
Expense Tracker with Analytics/
├── client/                     # Vite + React 19 Frontend
│   ├── src/
│   │   ├── components/         # Navbar, Sidebar, Modals, StatCards
│   │   ├── context/            # AuthContext & ThemeContext
│   │   ├── pages/              # Dashboard, Expenses, Income, Budgets, Savings, Categories, Analytics, AIAdvisor, Reports
│   │   ├── services/           # Axios API client with JWT interceptors
│   │   ├── types/              # Frontend TypeScript definitions
│   │   └── App.tsx             # Protected routes & router layout
├── server/                     # Node.js + Express Backend
│   ├── prisma/                 # Prisma schema & seed script
│   ├── src/
│   │   ├── config/             # Env, Logger, Prisma, Swagger
│   │   ├── controllers/        # Express controllers
│   │   ├── middleware/         # Auth, Upload, Validation, Errors
│   │   ├── routes/             # REST routes
│   │   ├── services/           # Auth, Expenses, AI, PDF Generation
│   │   ├── validators/         # Zod schemas
│   │   └── app.ts              # App entrypoint
├── docker-compose.yml
└── package.json                # Root concurrently runner
```
