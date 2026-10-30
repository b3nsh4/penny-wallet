import { App, Modal, Notice } from 'obsidian'
import { PennyWalletConfig, RecurringPayment } from '../types'
import { getCategoryOptions } from './transactionState'
import { newRecurringId } from '../io/recurring'
import { currentYearMonth } from '../utils'
import { t } from '../i18n'

export class RecurringEditModal extends Modal {
  private config: PennyWalletConfig
  private onSave: (item: RecurringPayment) => void | Promise<void>
  private item: RecurringPayment

  constructor(
    app: App,
    config: PennyWalletConfig,
    existing: RecurringPayment | null,
    onSave: (item: RecurringPayment) => void | Promise<void>,
  ) {
    super(app)
    this.config = config
    this.onSave = onSave
    const activeWallets = config.wallets.filter(w => w.status === 'active')
    this.item = existing ? { ...existing } : {
      id: newRecurringId(),
      name: '',
      amount: 0,
      wallet: activeWallets.some(w => w.name === config.defaultWallet)
        ? config.defaultWallet
        : activeWallets[0]?.name ?? '',
      category: getCategoryOptions(config, 'expense')[0]?.key ?? '',
      day: 1,
      startMonth: currentYearMonth(),
    }
  }

  onOpen() {
    const { contentEl, containerEl } = this
    containerEl.addClass('pw-wallet-edit-modal-container')
    contentEl.addClass('pw-modal')
    contentEl.createEl('h2', { text: t('settings.recurring') })

    const formEl = contentEl.createDiv('pw-wallet-edit-form')

    const field = (label: string) => {
      const row = formEl.createDiv('pw-wallet-edit-field')
      row.createEl('label', { text: label, cls: 'pw-wallet-edit-label' })
      return row
    }

    const nameInput = field(t('settings.recurringName')).createEl('input', { type: 'text', cls: 'pw-field-input' })
    nameInput.value = this.item.name
    nameInput.addEventListener('input', () => { this.item.name = nameInput.value.trim() })

    const amountInput = field(t('settings.recurringAmount')).createEl('input', { type: 'number', cls: 'pw-field-input' })
    amountInput.value = this.item.amount ? String(this.item.amount) : ''
    amountInput.setAttribute('min', '0')
    amountInput.setAttribute('inputmode', 'decimal')
    amountInput.addEventListener('input', () => { this.item.amount = parseFloat(amountInput.value) || 0 })

    const walletSelect = field(t('settings.recurringWallet')).createEl('select', { cls: 'pw-field-input' })
    const walletNames = this.config.wallets.filter(w => w.status === 'active').map(w => w.name)
    if (this.item.wallet && !walletNames.includes(this.item.wallet)) walletNames.push(this.item.wallet)
    for (const name of walletNames) walletSelect.createEl('option', { value: name, text: name })
    walletSelect.value = this.item.wallet
    walletSelect.addEventListener('change', () => { this.item.wallet = walletSelect.value })

    const catSelect = field(t('settings.recurringCategory')).createEl('select', { cls: 'pw-field-input' })
    const categories = getCategoryOptions(this.config, 'expense')
    if (this.item.category && !categories.some(c => c.key === this.item.category)) {
      categories.push({ key: this.item.category, label: this.item.category })
    }
    for (const c of categories) catSelect.createEl('option', { value: c.key, text: c.label })
    catSelect.value = this.item.category
    catSelect.addEventListener('change', () => { this.item.category = catSelect.value })

    const dayInput = field(t('settings.recurringDay')).createEl('input', { type: 'number', cls: 'pw-field-input' })
    dayInput.value = String(this.item.day)
    dayInput.setAttribute('min', '1')
    dayInput.setAttribute('max', '31')
    dayInput.setAttribute('inputmode', 'numeric')
    dayInput.addEventListener('input', () => { this.item.day = parseInt(dayInput.value, 10) || 0 })

    const startInput = field(t('settings.recurringStart')).createEl('input', { type: 'month', cls: 'pw-field-input' })
    startInput.value = this.item.startMonth
    startInput.addEventListener('change', () => { this.item.startMonth = startInput.value })

    const endInput = field(t('settings.recurringEnd')).createEl('input', { type: 'month', cls: 'pw-field-input' })
    endInput.value = this.item.endMonth ?? ''
    endInput.addEventListener('change', () => { this.item.endMonth = endInput.value || undefined })

    formEl.createEl('p', { text: t('settings.recurringHint'), cls: 'pw-balance-hint pw-wallet-edit-hint' })

    const btnRow = contentEl.createDiv('pw-btn-row')
    const saveBtn = btnRow.createEl('button', { text: t('ui.save'), cls: 'mod-cta' })
    saveBtn.addEventListener('click', () => {
      const r = this.item
      if (!r.name) { new Notice(t('err.recurringName')); return }
      if (!(r.amount > 0)) { new Notice(t('err.recurringAmount')); return }
      if (!r.wallet) { new Notice(t('err.recurringWallet')); return }
      if (!(r.day >= 1 && r.day <= 31)) { new Notice(t('err.recurringDay')); return }
      if (!/^\d{4}-\d{2}$/.test(r.startMonth)) r.startMonth = currentYearMonth()
      if (r.endMonth && r.endMonth < r.startMonth) { new Notice(t('err.recurringMonths')); return }
      void this.onSave({ ...r })
      this.close()
    })
    const cancelBtn = btnRow.createEl('button', { text: t('ui.cancel') })
    cancelBtn.addEventListener('click', () => this.close())
  }

  onClose() {
    this.containerEl.removeClass('pw-wallet-edit-modal-container')
    this.contentEl.empty()
  }
}
