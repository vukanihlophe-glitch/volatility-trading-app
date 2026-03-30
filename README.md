# V75 Trading Dashboard

A Next.js trading app for the Volatility 75 Index (V75) on the 15-minute timeframe.

## Features

- **Planner** — position size calculator with risk management
- **Signals** — triple-confluence strategy (Stochastic zone + CHoCH + EMA cross)
- **Chart** — candlestick chart with EMA 14/50 overlays and Stochastic oscillator
- **Journal** — trade history, win rate, P&L, profit factor
- **Monetization** — subscription tiers with card payment checkout (Stripe-ready)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your Stripe keys

# 3. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/app/
├── page.tsx                  # Main dashboard (tabs)
├── layout.tsx                # Root layout
├── globals.css               # Global styles + design tokens
├── checkout/
│   └── page.tsx              # Card payment checkout page
└── components/
    ├── PlannerTab.tsx        # Risk/position calculator
    ├── SignalsTab.tsx        # Signal confluence checker
    ├── ChartTab.tsx          # Candlestick + indicator chart
    ├── JournalTab.tsx        # Trade history table
    └── MonetizeTab.tsx       # Subscription plans + revenue
```

## Adding Real Stripe Payments

1. Create a free account at [stripe.com](https://stripe.com)
2. Copy your API keys from the Stripe dashboard
3. Paste them into `.env.local`
4. Install the Stripe package: `npm install @stripe/stripe-js @stripe/react-stripe-js`
5. Replace the checkout form in `src/app/checkout/page.tsx` with `<PaymentElement />` from Stripe React

Official docs: https://stripe.com/docs/stripe-js/react

## Deploy to Vercel (free)

```bash
npm install -g vercel
vercel
```

Vercel auto-detects Next.js. Set your environment variables in the Vercel dashboard under Project → Settings → Environment Variables.

## Tech Stack

- [Next.js 14](https://nextjs.org) — React framework (App Router)
- [TypeScript](https://typescriptlang.org) — type safety
- [Stripe](https://stripe.com) — payments (integration-ready)
- Canvas API — chart rendering (no extra library needed)
