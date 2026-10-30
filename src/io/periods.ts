import { stepMonth } from '../utils'

// ─── Pay periods (pure functions) ────────────────────────────────────────────
//
// A period runs from one salary to the day before the next, so money is viewed
// salary to salary instead of by calendar month. Before the first salary entry,
// and when there is none at all, periods fall back to calendar months.

export interface Period {
  start: string        // yyyy-mm-dd, inclusive
  end: string | null   // yyyy-mm-dd, inclusive; null = still running
  label: string        // yyyy-mm the period is named after
}

/** yyyy-mm-dd for a "MM/DD" row stored in month file `ym`. */
export function fullDate(ym: string, mmdd: string): string {
  return `${ym.slice(0, 4)}-${mmdd.replace('/', '-')}`
}

export function toDateString(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function addDays(date: string, days: number): string {
  const [y, m, d] = date.split('-').map(Number)
  return toDateString(new Date(y, m - 1, d + days))
}

function lastDayOfMonth(ym: string): string {
  const [y, m] = ym.split('-').map(Number)
  return `${ym}-${String(new Date(y, m, 0).getDate()).padStart(2, '0')}`
}

/** A salary period is named after the month it mostly covers. */
function salaryLabel(start: string): string {
  return addDays(start, 15).slice(0, 7)
}

/**
 * Build the list of periods (ascending).
 * `salaryDates` and `dataDates` are yyyy-mm-dd; `today` is yyyy-mm-dd.
 */
export function buildPeriods(salaryDates: string[], dataDates: string[], today: string): Period[] {
  const salaries = [...new Set(salaryDates)].sort()
  const all = [...dataDates, today].sort()
  const firstYm = all[0].slice(0, 7)
  const lastYm = all[all.length - 1].slice(0, 7)

  const periods: Period[] = []
  const calendarUntil = salaries[0] ?? null
  for (let ym = firstYm; ym <= lastYm; ym = stepMonth(ym, 1)) {
    const start = `${ym}-01`
    if (calendarUntil && start >= calendarUntil) break
    const monthEnd = lastDayOfMonth(ym)
    const end = calendarUntil && monthEnd >= calendarUntil ? addDays(calendarUntil, -1) : monthEnd
    periods.push({ start, end, label: ym })
  }

  salaries.forEach((start, i) => {
    const next = salaries[i + 1]
    periods.push({ start, end: next ? addDays(next, -1) : null, label: salaryLabel(start) })
  })
  return periods
}

export function inPeriod(p: Period, date: string): boolean {
  return date >= p.start && (p.end === null || date <= p.end)
}

/**
 * The period containing `ref` (yyyy-mm-dd, or yyyy-mm meaning that month's 1st).
 * Falls back to the nearest period when `ref` is outside all of them.
 */
export function periodContaining(periods: Period[], ref: string): Period {
  const date = ref.length === 7 ? `${ref}-01` : ref
  const found = periods.find(p => inPeriod(p, date))
  if (found) return found
  return date < periods[0].start ? periods[0] : periods[periods.length - 1]
}

/** Calendar months (yyyy-mm) a period touches, given the last month with data. */
export function periodMonths(p: Period, lastYm: string): string[] {
  const endYm = p.end ? p.end.slice(0, 7) : (lastYm > p.start.slice(0, 7) ? lastYm : p.start.slice(0, 7))
  const months: string[] = []
  for (let ym = p.start.slice(0, 7); ym <= endYm; ym = stepMonth(ym, 1)) months.push(ym)
  return months
}
