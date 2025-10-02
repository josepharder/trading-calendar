export const formatCurrency = (amount: number): string => {
  const formatted = Math.abs(amount).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
  return amount < 0 ? `-${formatted}` : formatted
}

export const getPnLClass = (pnl: number): string => {
  if (pnl > 0) return 'positive'
  if (pnl < 0) return 'negative'
  return 'neutral'
}

export const getMonthName = (monthIndex: number): string => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  return months[monthIndex] || 'Unknown'
}
