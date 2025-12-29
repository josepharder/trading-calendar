# Trading Calendar

A web-based calendar application designed to help traders track and visualize their daily trading performance with an intuitive interface.

![Trading Calendar](src/assets/calendar.png)

## Overview

Trading Calendar is a Vue-based application that displays trading metrics in a monthly calendar view. It helps traders monitor their performance through visual representations of daily P&L (Profit & Loss), trade counts, and weekly/monthly summaries.

## Features

### Calendar Display

- Interactive monthly calendar view with easy month navigation
- 7-column grid layout (Monday-Sunday) plus a "Total" column for weekly summaries
- Current date navigation and month selection
- Displays adjacent month days for complete week presentation

### Trading Metrics Visualization

- **Daily Metrics**: P&L values and trade counts for each trading day
- **Weekly Summaries**: Aggregated P&L and trade counts per week
- **Monthly Totals**: Overall monthly P&L displayed at the top
- **Color-Coded Values**:
  - 🟢 Green (#4ade80) for positive P&L
  - 🔴 Red (#f87171) for negative P&L
  - ⚪ White for neutral/zero values
- **Note Indicators**: 📋 emoji displayed when notes exist for a day

### Smart Data Handling

- Loads trading data from JSON format (`pnl_report.json`)
- Graceful fallback to empty calendar when no data exists
- Zero values displayed for months/days without trading activity

### Performance Optimization

- Intelligent caching system for computed values (dates, formats, calendar data)
- Memoization of currency formatting and P&L calculations
- Category-based cache key management for efficient data retrieval

## Tech Stack

### Core Framework

- **Vue 3.5.13** - Progressive JavaScript framework
- **Vue Router 4.5.0** - Client-side routing
- **Pinia 2.3.0** - State management
- **TypeScript ~5.6.3** - Type-safe development

### Build Tools

- **Vite 6.0.5** - Next-generation build tool with lightning-fast HMR
- **Less 4.2.1** - CSS preprocessor for enhanced styling
- **vue-tsc** - TypeScript type checking for Vue components

## Project Structure

```
trading-calendar/
├── src/
│   ├── assets/              # Static assets
│   │   ├── app.less         # Main stylesheet
│   │   └── calendar.png     # Calendar screenshot
│   ├── components/          # Vue components
│   │   ├── BaseTemplate.vue    # Root template
│   │   ├── TradingCalendar.vue # Main calendar component
│   │   ├── DayCell.vue        # Individual day cell
│   │   └── WeekSummary.vue    # Weekly totals component
│   ├── data/
│   │   └── pnl_report.json  # Trading data (YYYY-MM format)
│   ├── router/
│   │   └── index.ts         # Router configuration
│   ├── services/
│   │   ├── calendarService.ts  # Data fetching & calendar generation
│   │   ├── date.ts            # Date utility functions
│   │   ├── cache/
│   │   │   └── computedCache.ts # Caching system
│   │   ├── enums/
│   │   │   └── cache.ts       # Cache key enumerations
│   │   ├── interfaces/
│   │   │   └── calendar.ts    # TypeScript interfaces
│   │   └── utils/
│   │       └── formatters.ts  # Value formatters
│   ├── styles/              # Component styles
│   │   └── components/
│   │       ├── TradingCalendar.less
│   │       ├── DayCell.less
│   │       └── WeekSummary.less
│   ├── views/
│   │   └── CalendarPage.vue # Main page layout
│   ├── App.vue              # Root component
│   └── main.ts              # Application entry point
├── package.json
├── vite.config.ts          # Vite configuration
└── tsconfig.json           # TypeScript configuration
```

## Data Format

The application expects trading data in `pnl_report.json` with the following structure:

```json
{
  "2025-06": {
    "month": "June",
    "year": 2025,
    "days": [
      {
        "date": "2025-06-01",
        "pnl": 250.5,
        "tradeCount": 3,
        "hasNotes": false
      }
    ]
  }
}
```

### Data Fields

- **date**: ISO format date string (YYYY-MM-DD)
- **pnl**: Profit/Loss value (positive or negative number)
- **tradeCount**: Number of trades executed that day
- **hasNotes**: Boolean indicating if notes exist for the day

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm or yarn package manager

### Installation

```bash
npm install
```

### Development

Start the development server with hot-reload:

```bash
npm run serve
```

Access the application at `http://localhost:5173`

### Type Checking

Run TypeScript type validation:

```bash
npm run type-check
```

### Production Build

Build for production with type checking:

```bash
npm run build
```

Build without type checking:

```bash
npm run build-only
```

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```
