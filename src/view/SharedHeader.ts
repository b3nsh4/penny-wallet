import { Events, ItemView, Platform } from 'obsidian'
import { WalletFile } from '../io/WalletFile'
import { TransactionModal } from '../modal/TransactionModal'
import { MobileTransactionModal } from '../modal/MobileTransactionModal'
import { t, formatYearMonth } from '../i18n'
import { Period } from '../io/periods'
import { DASHBOARD_VIEW_TYPE } from './DashboardView'
import { ASSET_VIEW_TYPE } from './AssetView'
import { DETAIL_VIEW_TYPE } from './DetailView'

export type ActiveView = 'dashboard' | 'asset' | 'detail'

export type SharedHeaderOptions = {
  view: ItemView
  walletFile: WalletFile
  activeView: ActiveView
  /** Current pay period with its neighbours; null hides the period switcher */
  period: { current: Period; prev: Period | null; next: Period | null } | null
  onPeriodChange?: (period: Period) => void
}

function formatDay(date: string): string {
  const [y, m, d] = date.split('-').map(Number)
  return new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short' }).format(new Date(y, m - 1, d))
}

/** e.g. "Oct 30 – Nov 27", or "Oct 30 onwards" for a period still running */
export function formatPeriodRange(p: Period): string {
  return p.end ? `${formatDay(p.start)} – ${formatDay(p.end)}` : `${formatDay(p.start)} ${t('period.onwards')}`
}

export function renderSharedHeader(container: HTMLElement, opts: SharedHeaderOptions): void {
  const root = container.createDiv('pw-shared-header')

  const monthCell = root.createDiv('pw-shared-header-month')
  if (opts.period !== null) {
    const { current, prev, next } = opts.period

    const prevBtn = monthCell.createEl('button', { text: '‹', cls: 'pw-nav-btn' })
    const labelEl = monthCell.createDiv('pw-month-label')
    labelEl.createDiv({ text: formatYearMonth(current.label, 'short') })
    labelEl.createDiv({ text: formatPeriodRange(current), cls: 'pw-period-range' })
    const nextBtn = monthCell.createEl('button', { text: '›', cls: 'pw-nav-btn' })
    prevBtn.disabled = prev === null
    nextBtn.disabled = next === null

    prevBtn.addEventListener('click', () => {
      if (prev) opts.onPeriodChange?.(prev)
    })
    nextBtn.addEventListener('click', () => {
      if (next) opts.onPeriodChange?.(next)
    })
  } else {
    monthCell.addClass('is-empty')
  }

  const tabsCell = root.createDiv('pw-shared-header-tabs')
  const tabs: { id: ActiveView; label: string; targetType: string; state?: Record<string, unknown> }[] = [
    { id: 'dashboard', label: t('ui.overview'), targetType: DASHBOARD_VIEW_TYPE },
    { id: 'asset',     label: t('ui.asset'),    targetType: ASSET_VIEW_TYPE },
    { id: 'detail',    label: t('ui.detail'),   targetType: DETAIL_VIEW_TYPE,
      state: opts.period ? { yearMonth: opts.period.current.start } : undefined },
  ]
  for (const tab of tabs) {
    const isActive = opts.activeView === tab.id
    const btn = tabsCell.createEl('button', {
      text: tab.label,
      cls: 'pw-shared-header-tab' + (isActive ? ' is-active' : ''),
    })
    if (!isActive) {
      btn.addEventListener('click', () => {
        void openOrRevealView(opts.view, tab.targetType, tab.state)
      })
    }
  }

  const actionsCell = root.createDiv('pw-shared-header-actions')
  const addBtn = actionsCell.createEl('button', {
    text: '+ ' + t('ui.addTransaction'),
    cls: 'pw-action-btn pw-shared-header-add',
  })
  addBtn.addEventListener('click', () => {
    addBtn.disabled = true
    const ModalClass = Platform.isMobile ? MobileTransactionModal : TransactionModal
    new ModalClass(opts.view.app, opts.walletFile, {}, null, null,
      () => (opts.view.app.workspace as Events).trigger('penny-wallet:refresh'),
      () => { addBtn.disabled = false },
    ).open()
  })
}

async function openOrRevealView(view: ItemView, type: string, state?: Record<string, unknown>) {
  const existing = view.app.workspace.getLeavesOfType(type)
  const leaf = existing[0] ?? view.app.workspace.getLeaf('tab')
  await leaf.setViewState({ type, active: true, state })
  void view.app.workspace.revealLeaf(leaf)
}
