# Casho Plus — Frontend

Web dashboard for Casho Plus office management: financial transactions, partners, clients, debts, capital overview, attendance, and notifications. Built with React, Vite, TailwindCSS, and React Query.

## Getting Started

```bash
npm install
cp .env.example .env   # set VITE_API_URL to your backend's URL
npm run dev
```

Runs on `http://localhost:5173`. The backend API must be running alongside it.

## Pages
- `/` — Public landing page (Home/About/Contact)
- `/login` — Login (phone number + password)
- `/dashboard` — Daily overview, charts, recent activity
- `/transactions` — Record and browse transactions
- `/clients/individuals`, `/clients/key-clients` — Client management
- `/partners` — Partners and per-line (phone number) balance breakdown
- `/debts` — Debts, repayment, and receipt attachments
- `/attendance` — Check-in/check-out and monthly report
- `/settings/profile` — Personal account settings
- `/capital`, `/settings/commission-rules`, `/users` — Admin only

## Project Structure
```
src/
├── api/          # API calls (Axios)
├── components/   # Shared UI + feature-specific components
├── constants/     # Enums and Arabic display labels
├── hooks/        # React Query hooks
├── pages/        # Route pages
├── routes/       # Router + route guards
├── store/        # Zustand (auth)
└── utils/        # money.js — piasters ↔ EGP conversion
```

## Important
All monetary amounts from the backend are in **piasters** (integer, no decimals). Always use `piastersToEGP` / `egpToPiasters` / `formatEGP` from `utils/money.js` instead of doing the math manually.