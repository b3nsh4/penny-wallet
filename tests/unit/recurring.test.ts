import { describe, it, expect } from 'vitest'
import {
  recurringDate,
  dueRecurringMonths,
  buildRecurringTransaction,
  hasRecurringEntry,
  recurringFromExpense,
} from '../../src/io/recurring'
import type { RecurringPayment } from '../../src/types'

const emi: RecurringPayment = {
  id: 'r1',
  name: 'Bike EMI',
  amount: 5000,
  wallet: 'bank',
  category: 'emi',
  day: 5,
  startMonth: '2026-10',
}

// Month is 0-based in the Date constructor
const on = (y: number, m: number, d: number) => new Date(y, m - 1, d)

describe('recurringDate', () => {
  it('formats as MM/DD', () => {
    expect(recurringDate(emi, '2026-10')).toBe('10/05')
  })

  it('clamps day 31 to the last day of shorter months', () => {
    const r = { ...emi, day: 31 }
    expect(recurringDate(r, '2026-02')).toBe('02/28')
    expect(recurringDate(r, '2028-02')).toBe('02/29')
    expect(recurringDate(r, '2026-04')).toBe('04/30')
  })
})

describe('dueRecurringMonths', () => {
  it('is not due before the payment day', () => {
    expect(dueRecurringMonths(emi, on(2026, 10, 4))).toEqual([])
  })

  it('is due on the payment day', () => {
    expect(dueRecurringMonths(emi, on(2026, 10, 5))).toEqual(['2026-10'])
  })

  it('skips months already posted', () => {
    expect(dueRecurringMonths({ ...emi, lastPosted: '2026-10' }, on(2026, 10, 30))).toEqual([])
  })

  it('catches up on missed months', () => {
    const r = { ...emi, lastPosted: '2026-10' }
    expect(dueRecurringMonths(r, on(2027, 1, 10))).toEqual(['2026-11', '2026-12', '2027-01'])
  })

  it('does not include the current month before its day while catching up', () => {
    const r = { ...emi, lastPosted: '2026-10' }
    expect(dueRecurringMonths(r, on(2027, 1, 2))).toEqual(['2026-11', '2026-12'])
  })

  it('stops after the end month', () => {
    const r = { ...emi, endMonth: '2026-11' }
    expect(dueRecurringMonths(r, on(2027, 2, 20))).toEqual(['2026-10', '2026-11'])
  })

  it('posts nothing once the end month has been posted', () => {
    const r = { ...emi, endMonth: '2026-11', lastPosted: '2026-11' }
    expect(dueRecurringMonths(r, on(2027, 2, 20))).toEqual([])
  })

  it('does not start before the start month', () => {
    expect(dueRecurringMonths({ ...emi, startMonth: '2026-12' }, on(2026, 11, 20))).toEqual([])
  })

  it('ignores a lastPosted older than a moved-forward start month', () => {
    const r = { ...emi, startMonth: '2026-12', lastPosted: '2026-09' }
    expect(dueRecurringMonths(r, on(2026, 12, 6))).toEqual(['2026-12'])
  })
})

describe('buildRecurringTransaction / hasRecurringEntry', () => {
  it('builds an expense on the payment date with the name as note', () => {
    expect(buildRecurringTransaction(emi, '2026-11')).toEqual({
      date: '11/05', type: 'expense', wallet: 'bank', category: 'emi', note: 'Bike EMI', amount: 5000,
    })
  })

  it('detects an entry already in the month', () => {
    const txs = [{ ...buildRecurringTransaction(emi, '2026-11'), createdAt: '2026-11-05T00:00:00Z' }]
    expect(hasRecurringEntry(txs, emi, '2026-11')).toBe(true)
  })

  it('does not match a different amount or day', () => {
    const tx = buildRecurringTransaction(emi, '2026-11')
    expect(hasRecurringEntry([{ ...tx, amount: 4000 }], emi, '2026-11')).toBe(false)
    expect(hasRecurringEntry([{ ...tx, date: '11/06' }], emi, '2026-11')).toBe(false)
  })
})

describe('recurringFromExpense', () => {
  const tx = { date: '10/07', type: 'expense' as const, wallet: 'bank', category: 'emi', note: 'Phone EMI', amount: 1200 }

  it('takes amount, account, category and day from the expense', () => {
    expect(recurringFromExpense(tx, '2026-10-07', 'Phone EMI', '2027-03', 'x')).toEqual({
      id: 'x', name: 'Phone EMI', amount: 1200, wallet: 'bank', category: 'emi',
      day: 7, startMonth: '2026-10', endMonth: '2027-03', lastPosted: '2026-10',
    })
  })

  it('treats the expense month as already posted', () => {
    const r = recurringFromExpense(tx, '2026-10-07', 'Phone EMI', undefined, 'x')
    expect(dueRecurringMonths(r, on(2026, 10, 30))).toEqual([])
    expect(dueRecurringMonths(r, on(2026, 11, 7))).toEqual(['2026-11'])
  })
})
