import { describe, it, expect } from 'vitest'
import { buildPeriods, fullDate, inPeriod, periodContaining, periodMonths } from '../../src/io/periods'

describe('fullDate', () => {
  it('combines the file month year with MM/DD', () => {
    expect(fullDate('2026-10', '10/30')).toBe('2026-10-30')
  })
})

describe('buildPeriods', () => {
  it('uses calendar months when there is no salary', () => {
    expect(buildPeriods([], ['2026-09-10'], '2026-10-31')).toEqual([
      { start: '2026-09-01', end: '2026-09-30', label: '2026-09' },
      { start: '2026-10-01', end: '2026-10-31', label: '2026-10' },
    ])
  })

  it('runs salary to salary, named after the month mostly covered', () => {
    const periods = buildPeriods(['2026-10-30', '2026-11-28'], ['2026-10-30'], '2026-12-05')
    expect(periods.slice(-2)).toEqual([
      { start: '2026-10-30', end: '2026-11-27', label: '2026-11' },
      { start: '2026-11-28', end: null, label: '2026-12' },
    ])
  })

  it('cuts the calendar fallback at the first salary', () => {
    const periods = buildPeriods(['2026-10-30'], ['2026-09-15'], '2026-10-31')
    expect(periods).toEqual([
      { start: '2026-09-01', end: '2026-09-30', label: '2026-09' },
      { start: '2026-10-01', end: '2026-10-29', label: '2026-10' },
      { start: '2026-10-30', end: null, label: '2026-11' },
    ])
  })

  it('handles a salary on the 1st without an empty calendar period', () => {
    expect(buildPeriods(['2026-10-01'], [], '2026-10-05')).toEqual([
      { start: '2026-10-01', end: null, label: '2026-10' },
    ])
  })

  it('ignores duplicate salary dates', () => {
    expect(buildPeriods(['2026-10-30', '2026-10-30'], [], '2026-10-31').slice(-1)[0].end).toBeNull()
  })

  it('crosses the year boundary', () => {
    const p = buildPeriods(['2026-12-30'], [], '2027-01-02').slice(-1)[0]
    expect(p.label).toBe('2027-01')
  })
})

describe('periodContaining / inPeriod', () => {
  const periods = buildPeriods(['2026-10-30', '2026-11-28'], ['2026-10-01'], '2026-12-05')

  it('finds the period for a date', () => {
    expect(periodContaining(periods, '2026-11-27').start).toBe('2026-10-30')
    expect(periodContaining(periods, '2026-11-28').start).toBe('2026-11-28')
  })

  it('accepts a yyyy-mm reference', () => {
    expect(periodContaining(periods, '2026-11').start).toBe('2026-10-30')
  })

  it('treats an open period as running forever', () => {
    expect(inPeriod(periods[periods.length - 1], '2030-01-01')).toBe(true)
  })

  it('falls back to the first period for dates before it', () => {
    expect(periodContaining(periods, '2020-01-01').start).toBe('2026-10-01')
  })
})

describe('periodMonths', () => {
  it('lists the calendar months a closed period spans', () => {
    expect(periodMonths({ start: '2026-10-30', end: '2026-11-27', label: '2026-11' }, '2026-11'))
      .toEqual(['2026-10', '2026-11'])
  })

  it('extends an open period to the last month with data', () => {
    expect(periodMonths({ start: '2026-10-30', end: null, label: '2026-11' }, '2027-01'))
      .toEqual(['2026-10', '2026-11', '2026-12', '2027-01'])
  })
})
