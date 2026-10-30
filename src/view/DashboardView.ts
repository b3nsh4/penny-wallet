import { Events, ItemView, WorkspaceLeaf } from 'obsidian'
import { WalletFile } from '../io/WalletFile'
import { t, tn, formatMonthLabel, formatYearMonth } from '../i18n'
import { createMetric, renderCard } from './components'
import { Transaction, TransactionType } from '../types'
import { DETAIL_VIEW_TYPE } from './DetailView'
import { formatPeriodRange, renderSharedHeader } from './SharedHeader'
import { Chart } from 'chart.js'
import { MonthData, drawIncExpChart, drawPie } from './charts'
import { periodContaining, toDateString } from '../io/periods'

export const DASHBOARD_VIEW_TYPE = 'penny-wallet-dashboard'

export class DashboardView extends ItemView {
  private walletFile: WalletFile
  private periodRef: string   // any yyyy-mm-dd inside the period shown
  private charts: Chart[] = []

  private clearCharts() {
    this.charts.forEach(c => c.destroy())
    this.charts = []
  }

  constructor(leaf: WorkspaceLeaf, walletFile: WalletFile) {
    super(leaf)
    this.walletFile = walletFile
    this.periodRef = toDateString(new Date())
  }

  getViewType() { return DASHBOARD_VIEW_TYPE }
  getDisplayText() { return t('dashboard.title') }
  getIcon() { return 'wallet' }

  async onOpen() {
    this.registerEvent(
      (this.app.workspace as Events).on('penny-wallet:refresh', () => { void this.render() })
    )
    this.registerEvent(
      (this.app.workspace as Events).on('css-change', () => { void this.render() })
    )
    await this.render()
  }

  onClose(): Promise<void> {
    this.clearCharts()
    this.contentEl.empty()
    return Promise.resolve()
  }

  async render() {
    const { contentEl } = this
    this.clearCharts()
    contentEl.empty()
    contentEl.addClass('pw-dashboard')

    const periods = await this.walletFile.getPeriods()
    const period = periodContaining(periods, this.periodRef)
    const idx = periods.indexOf(period)
    const recent = periods.slice(Math.max(0, idx - 5), idx + 1)

    const [recentEntries, walletBalances] = await Promise.all([
      Promise.all(recent.map(p => this.walletFile.readPeriod(p))),
      this.walletFile.calculateAllWalletBalances(),
    ])
    const transactions: Transaction[] = recentEntries[recentEntries.length - 1].map(e => e.tx)

    renderSharedHeader(contentEl, {
      view: this,
      walletFile: this.walletFile,
      activeView: 'dashboard',
      period: { current: period, prev: periods[idx - 1] ?? null, next: periods[idx + 1] ?? null },
      onPeriodChange: (p) => { this.periodRef = p.start; void this.render() },
    })

    const dp = this.walletFile.getConfig().decimalPlaces ?? 0

    // ── Account balances (current, each account on its own) ─────────────────
    const accountsEl = contentEl.createDiv('pw-metrics pw-account-metrics')
    for (const { wallet, balance } of walletBalances) {
      if (wallet.status === 'archived') continue
      if (wallet.type === 'creditCard') {
        const label = balance >= 0 ? tn('dash.cardOwed', { name: wallet.name }) : tn('dash.cardCredit', { name: wallet.name })
        createMetric(accountsEl, label, balance, 'neutral', { dp })
      } else {
        createMetric(accountsEl, wallet.name, balance, balance < 0 ? 'negative' : 'neutral', { dp, hero: true })
      }
    }

    // ── Monthly metrics ──────────────────────────────────────────────────────
    let monthIncome = 0, monthExpense = 0
    for (const tx of transactions) {
      if (tx.type === 'income') monthIncome += tx.amount
      if (tx.type === 'expense') monthExpense += tx.amount
    }

    const metricsEl = contentEl.createDiv('pw-metrics pw-month-metrics')
    createMetric(metricsEl, t('dash.income'),  monthIncome,  'income',  { dp })
    createMetric(metricsEl, t('dash.expense'), monthExpense, 'expense', { dp })

    // ── 6-period bar chart ───────────────────────────────────────────────────
    const data: MonthData[] = recent.map((p, i) => {
      let income = 0, expense = 0
      for (const { tx } of recentEntries[i]) {
        if (tx.type === 'income') income += tx.amount
        if (tx.type === 'expense') expense += tx.amount
      }
      return {
        monthLabel: formatMonthLabel(p.label),
        tooltipLabel: `${formatYearMonth(p.label, 'short')} (${formatPeriodRange(p)})`,
        income,
        expense,
        net: null,
      }
    })

    // ── 2-column grid: bar chart left, pie charts right ─────────────────────
    const grid2 = contentEl.createDiv('pw-grid-2')

    const incExpCard = renderCard(grid2, {
      title: t('trend.monthlyIncomeExpense'),
      className: 'pw-inc-exp-card',
    })
    const incExpChartWrap = incExpCard.createDiv('pw-chart-wrap')
    this.charts.push(drawIncExpChart(incExpChartWrap, data, dp))

    // ── Category pies ────────────────────────────────────────────────────────
    const gridRight = grid2.createDiv('pw-grid-right')

    const expenseMap = this.walletFile.groupByCategory(transactions, 'expense')
    const incomeMap  = this.walletFile.groupByCategory(transactions, 'income')

    const expCard = renderCard(gridRight, { title: t('dash.expenseByCategory') })
    if (expenseMap.size > 0) this.charts.push(drawPie(expCard, expenseMap, dp, (cat) => { void this.openDetailWithFilter('expense', cat) }, 200))
    else expCard.createEl('p', { text: t('dash.noData'), cls: 'pw-no-data' })

    const incCard = renderCard(gridRight, { title: t('dash.incomeByCategory') })
    if (incomeMap.size > 0) this.charts.push(drawPie(incCard, incomeMap, dp, (cat) => { void this.openDetailWithFilter('income', cat) }, 200))
    else incCard.createEl('p', { text: t('dash.noData'), cls: 'pw-no-data' })
  }

  private async openDetailWithFilter(type: TransactionType, category: string) {
    await this.openOrRevealView(DETAIL_VIEW_TYPE, {
      state: { yearMonth: this.periodRef, filterType: type, filterCategory: category, resetFilters: true },
    })
  }

  private async openOrRevealView(type: string, options?: { state?: Record<string, unknown> }) {
    const existing = this.app.workspace.getLeavesOfType(type)
    const leaf = existing[0] ?? this.app.workspace.getLeaf('tab')

    await leaf.setViewState({
      type,
      active: true,
      state: options?.state,
    })

    void this.app.workspace.revealLeaf(leaf)
  }
}
