export interface Day {
  date: string
  dayOfMonth: number
  dayOfWeek: number
  pnl: number
  tradeCount: number
  hasNotes: boolean
}

export interface JsonDay {
  date: string
  pnl: number
  tradeCount: number
  hasNotes: boolean
}

export interface WeekData {
  weekNumber: number
  days: Day[]
  weekPnL: number
  weekTradeCount: number
}

export interface WeekSummary {
  weekNumber: number
  weekPnL: number
  weekTradeCount: number
}

export interface CalendarData {
  month: string
  year: number
  monthlyPnL: number
  days: Day[]
  weeks: WeekSummary[]
}

export interface PnLDataEntry {
  month: string
  year: number
  days: JsonDay[]
}
