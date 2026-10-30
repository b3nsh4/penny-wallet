import { RecurringPayment, Transaction } from '../types'
import { stepMonth } from '../utils'

// ─── Recurring payments (pure functions) ─────────────────────────────────────

function toYearMonth(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function daysInMonth(ym: string): number {
  const [y, m] = ym.split('-').map(Number)
  return new Date(y, m, 0).getDate()
}

/** Day of the month the payment falls on in `ym`, clamped to the month's length. */
export function recurringDay(r: RecurringPayment, ym: string): number {
  return Math.min(Math.max(1, Math.floor(r.day)), daysInMonth(ym))
}

/** "MM/DD" date string for the payment in `ym`, as stored in month files. */
export function recurringDate(r: RecurringPayment, ym: string): string {
  return `${ym.slice(5)}/${String(recurringDay(r, ym)).padStart(2, '0')}`
}

/**
 * Months (yyyy-mm, ascending) in which the payment is due but not yet posted.
 * A month's payment is posted as soon as the month starts (dated on its payment
 * day), so the month already shows what will be debited. The end month is inclusive.
 */
export function dueRecurringMonths(r: RecurringPayment, today: Date): string[] {
  const current = toYearMonth(today)
  let ym = r.lastPosted && r.lastPosted >= r.startMonth ? stepMonth(r.lastPosted, 1) : r.startMonth
  const months: string[] = []
  while (ym <= current && (!r.endMonth || ym <= r.endMonth)) {
    months.push(ym)
    ym = stepMonth(ym, 1)
  }
  return months
}

export function buildRecurringTransaction(r: RecurringPayment, ym: string): Transaction {
  return {
    date: recurringDate(r, ym),
    type: 'expense',
    wallet: r.wallet,
    category: r.category,
    note: r.name,
    amount: r.amount,
  }
}

/** True if `transactions` already holds this payment's entry for `ym` (e.g. posted on another device). */
export function hasRecurringEntry(transactions: Transaction[], r: RecurringPayment, ym: string): boolean {
  const date = recurringDate(r, ym)
  return transactions.some(tx =>
    tx.type === 'expense' &&
    tx.date === date &&
    tx.wallet === r.wallet &&
    tx.category === r.category &&
    tx.note === r.name &&
    tx.amount === r.amount,
  )
}

/**
 * Recurring payment created from a newly added expense. The expense itself
 * covers its own month, so the payment is marked as already posted there.
 * `date` is "yyyy-mm-dd".
 */
export function recurringFromExpense(
  tx: Transaction, date: string, name: string, endMonth: string | undefined, id: string,
): RecurringPayment {
  const ym = date.slice(0, 7)
  return {
    id,
    name,
    amount: tx.amount,
    wallet: tx.wallet ?? '',
    category: tx.category ?? '',
    day: Number(date.slice(8, 10)),
    startMonth: ym,
    endMonth,
    lastPosted: ym,
  }
}

export function newRecurringId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}
