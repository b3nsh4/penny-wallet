const translations = {
  'en': {
    'label.type.expense': 'Expense',
    'label.type.income': 'Income',
    'label.type.transfer': 'Transfer',

    'label.walletType.cash': 'Cash',
    'label.walletType.bank': 'Bank Account',
    'label.walletType.creditCard': 'Credit Card',

    'label.cat.food': 'Food',
    'label.cat.clothing': 'Clothing',
    'label.cat.housing': 'Home',
    'label.cat.transport': 'Transport',
    'label.cat.education': 'Education',
    'label.cat.entertainment': 'Entertainment',
    'label.cat.shopping': 'Shopping',
    'label.cat.medical': 'Medical',
    'label.cat.cash_expense': 'Cash Expense',
    'label.cat.insurance': 'Insurance',
    'label.cat.fees': 'Fees',
    'label.cat.tax': 'Tax',

    'label.cat.salary': 'Salary',
    'label.cat.interest': 'Interest',
    'label.cat.side_income': 'Side Income',
    'label.cat.bonus': 'Bonus',
    'label.cat.lottery': 'Lottery',
    'label.cat.rent': 'Rent',
    'label.cat.cashback': 'Cashback',
    'label.cat.dividend': 'Dividend',
    'label.cat.investment_profit': 'Investment Profit',
    'label.cat.insurance_income': 'Insurance Claim',
    'label.cat.pension': 'Pension',

    'label.cat.account_transfer': 'Account Transfer',
    'label.cat.credit_card_payment': 'Credit Card Payment',
    'label.cat.investment_trade': 'Investment Trade',

    'label.cat.uncategorized': 'Uncategorized',
    'label.cat.other': 'Other',

    'ui.addTransaction': 'Add transaction',
    'ui.detail': 'Transactions',
    'ui.confirm': 'Confirm',
    'ui.cancel': 'Cancel',
    'ui.delete': 'Delete',
    'ui.edit': 'Edit',
    'ui.archive': 'Archive',
    'ui.save': 'Save',
    'ui.search': 'Search',
    'ui.noMatches': 'No matches',

    'dashboard.title': 'Finance overview',
    'dash.income': 'Income',
    'dash.expense': 'Expense',
    'dash.cardOwed': '{name} owed',
    'dash.cardCredit': '{name} credit',
    'dash.netAsset': 'Net assets',
    'dash.walletBalances': 'Account balances',
    'dash.assetAllocation': 'Asset allocation',
    'dash.expenseByCategory': 'Expense by category',
    'dash.incomeByCategory': 'Income by category',
    'dash.noData': 'No data this month',

    'detail.title': 'Transactions',
    'detail.filterAll': 'All',
    'detail.filterExpense': 'Expense',
    'detail.filterIncome': 'Income',
    'detail.filterTransfer': 'Transfer',
    'detail.subtotalIncome': 'Income subtotal',
    'detail.subtotalExpense': 'Expense subtotal',
    'detail.noTransactions': 'No matching transactions',
    'detail.searchPlaceholder': 'Search notes/tags...',
    'detail.filterCategory': 'Category',
    'detail.filterButton': 'Filter',
    'detail.filterTitle': 'Filter',
    'detail.filterType': 'Type',
    'detail.filterAccount': 'Account',
    'detail.filterAllAccounts': 'All accounts',
    'detail.filterDateRange': 'Date range',
    'detail.filterClearAll': 'Clear all',
    'detail.filterDone': 'Done',

    'trend.3m': '3 Months',
    'trend.6m': '6 Months',
    'trend.12m': '12 Months',
    'trend.monthlyIncomeExpense': 'Monthly income & expense',

    'date.yearMonthNumeric': '{month}/{year}',
    'date.yearMonthShort': '{monthName} {year}',
    'date.monthLabel': '{monthName}',

    'modal.addTitle': 'Add transaction',
    'modal.editTitle': 'Edit transaction',
    'modal.date': 'Date',
    'modal.wallet': 'Account',
    'modal.fromWallet': 'From account',
    'modal.toWallet': 'To account',
    'modal.category': 'Category',
    'modal.note': 'Note',
    'modal.tags': 'Tags',
    'modal.tagsPlaceholder': 'Type and press Enter',
    'modal.done': 'Done',
    'tagPicker.title': 'Select tags',
    'tagPicker.search': 'Search or type a new tag',
    'tagPicker.addTag': '+ Add tag',
    'tagPicker.addNamed': '+ Add "{name}"',
    'tagPicker.noResults': 'No tags containing "{searchTerm}"',
    'tagPicker.tagLimit': 'Tag limit reached',
    'tagPicker.tooLong': 'Too long to add (max 5 CJK / 10 ASCII chars)',
    'tagPicker.rowPlaceholder': 'Select tags',
    'modal.amount': 'Amount',
    'modal.isRefund': 'This is a refund',
    'modal.isRefund.hint': 'Stored as a negative expense (for refunds and returns)',
    'modal.repeatMonthly': 'Repeat monthly',
    'modal.repeatUntil': 'Until (optional)',
    'modal.repeatHint': 'Added again on this day every month. Edit or stop it in settings.',
    'err.repeatEndBeforeDate': 'End month cannot be before this transaction',
    'notice.recurringCreated': '✓ Recurring payment "{name}" added',

    'err.amountRequired': 'Amount is required',
    'err.amountPositive': 'Amount must be greater than 0',
    'err.amountInteger': 'Decimal amounts are not allowed. Please enter a whole number.',
    'err.walletRequired': 'Please select an account',
    'err.fromWalletRequired': 'Please select source account',
    'err.toWalletRequired': 'Please select target account',
    'err.sameWallet': 'Source and target accounts cannot be the same',
    'err.walletNameEmpty': 'Account name cannot be empty',
    'err.walletNameDuplicate': 'Account name already exists',
    'calculator.err.pendingExpression': 'Press = to finish the calculation',
    'calculator.err.negativeResult': 'Calculation result cannot be negative',
    'calculator.err.divideByZero': 'Cannot divide by 0',
    'calculator.done': 'Done',

    'settings.general': 'General',
    'settings.folderName': 'Folder name',
    'settings.folderNameDesc': 'Folder to store penny-wallet files (relative to vault root)',
    'settings.defaultWallet': 'Default account',
    'settings.defaultWalletDesc': 'Default account selected when adding a transaction',
    'settings.decimalPlaces': 'Decimal places',
    'settings.decimalPlacesDesc': 'Number of decimal places allowed for amounts',
    'settings.dp0': 'Integer (0 decimals)',
    'settings.dp2': '2 decimal places',
    'settings.activeWallets': 'Active accounts',
    'settings.archivedWallets': 'Archived accounts',
    'settings.addWallet': 'Add account',
    'settings.walletName': 'Name',
    'settings.walletType': 'Type',
    'settings.initialBalance': 'Initial balance',
    'settings.includeInNetAssetOn': 'Current: included in net assets',
    'settings.includeInNetAssetOff': 'Current: excluded from net assets',
    'settings.customCategories': 'Custom categories',
    'settings.expenseCategories': 'Expense',
    'settings.incomeCategories': 'Income',
    'settings.transferCategories': 'Transfer',
    'settings.addCategory': 'Add category',
    'settings.categoryPlaceholder': 'Enter category name',

    // Validation
    'validation.modalTitle': 'Data validation report',
    'validation.fixAll': 'Fix all',
    'validation.fix': 'Fix',
    'validation.remapTo': 'Remap to',
    'validation.frontmatterSection': 'Frontmatter cache mismatch',
    'validation.frontmatterDesc': '{month}: income should be {actualIncome} (stored: {storedIncome}), expense should be {actualExpense} (stored: {storedExpense})',
    'validation.orphanSection': 'Orphaned wallet references',
    'validation.orphanDesc': 'Wallet "{wallet}" not found in config — {count} transaction(s) affected ({months})',
    'validation.repaired': 'Fixed {count} issue(s)',
    'settings.autoValidate': 'Validate data on startup',
    'settings.autoValidateDesc': 'Scan all data when Obsidian loads to detect frontmatter mismatches and orphaned wallet references',
    'notice.validationClean': 'Validation complete — data looks good.',

    'confirm.deleteTransaction': 'Delete this transaction? This cannot be undone.',
    'confirm.archiveWallet': 'Archive this wallet? This cannot be undone. The wallet will no longer appear in transaction forms.',
    'confirm.deleteWallet': 'Delete this wallet?',
    'confirm.unarchiveWallet': 'Unarchive this wallet?',

    'onboard.welcome': 'Welcome to PennyWallet! We recommend adding your bank accounts and credit cards.',

    'settings.noActiveWallets': 'No active wallets',
    'settings.creditDebtPrefix': 'Owed ',
    'settings.creditBalanceHint': 'Enter current outstanding debt (positive). e.g. owe 3,000 → enter 3000',
    'settings.cashBankBalanceHint': 'Enter current actual balance (must be ≥ 0)',

    'notice.walletAdded': '✓ Account "{name}" added',
    'notice.walletReordered': '✓ Wallet order saved',
    'notice.transactionDeleted': '✓ Transaction deleted',
    'notice.transactionAdded': '✓ Transaction added',
    'notice.transactionUpdated': '✓ Transaction updated',
    'notice.loadFailed': 'PennyWallet failed to load. Please check plugin settings.',
    'notice.recurringPosted': '✓ Posted {count} recurring payment(s)',
    'notice.recurringNone': 'No recurring payments are due',
    'settings.recurring': 'Recurring payments',
    'settings.recurringDesc': 'Posted automatically as expenses on their day each month.',
    'settings.recurringAdd': 'Add recurring payment',
    'settings.recurringEmpty': 'No recurring payments yet.',
    'settings.recurringName': 'Name',
    'settings.recurringAmount': 'Amount',
    'settings.recurringWallet': 'Account',
    'settings.recurringCategory': 'Category',
    'settings.recurringDay': 'Day of month',
    'settings.recurringStart': 'Start month',
    'settings.recurringEnd': 'End month (optional)',
    'settings.recurringHint': 'Nothing is posted before the start month. Leave the end month empty to keep it running.',
    'settings.recurringDayLabel': 'day {day}',
    'settings.recurringUntil': 'until {end}',
    'settings.recurringEnded': 'ended',
    'confirm.deleteRecurring': 'Delete "{name}"? Entries already posted are kept.',
    'err.recurringName': 'Enter a name',
    'err.recurringAmount': 'Amount must be greater than 0',
    'err.recurringWallet': 'Choose an account',
    'err.recurringDay': 'Day must be between 1 and 31',
    'err.recurringMonths': 'End month cannot be before the start month',

    'err.cashBankNegativeBalance': 'Cash and bank balance cannot be negative',
    'err.creditNegativeBalance': 'Credit card balance cannot be negative, enter positive debt amount',
    'err.creditNegativeBalanceShort': 'Enter positive amount for credit card debt',
    'err.categoryExists': 'Category already exists',
    'err.categoryExistsInOtherList': 'This category already exists in the other list',
    'err.invalidDate': 'Invalid date',
    'err.fromMustNotBeCreditCard': 'Source account cannot be a credit card',
    'err.toMustBeCreditCard': 'Target account must be a credit card',

    'ui.unarchive': 'Unarchive',

    // Asset view
    'asset.title': 'Assets',
    'ui.asset': 'Assets',
    'ui.overview': 'Overview',
    'asset.netAssetTrend': 'Net asset trend',
  },
} as const

type TranslationKey = keyof typeof translations['en']

export function t(key: TranslationKey): string {
  return (translations['en'] as Record<string, string>)[key] ?? key
}

/** t() with variable substitution. e.g. tn('notice.walletAdded', { name: 'Cash' }) */
export function tn(key: TranslationKey, vars: Record<string, string>): string {
  let str = t(key)
  for (const [k, v] of Object.entries(vars)) {
    str = str.replace(`{${k}}`, v)
  }
  return str
}

function parseYearMonth(yearMonth: string): { year: string; month: string; monthPadded: string; date: Date } | null {
  const match = yearMonth.match(/^(\d{4})-(\d{2})$/)
  if (!match) return null

  const [, year, monthPadded] = match
  const monthNumber = Number(monthPadded)
  if (monthNumber < 1 || monthNumber > 12) return null

  return {
    year,
    month: String(monthNumber),
    monthPadded,
    date: new Date(Number(year), monthNumber - 1, 1),
  }
}

function getShortMonthName(date: Date): string {
  return new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date)
}

export function formatYearMonth(yearMonth: string, style: 'numeric' | 'short' = 'numeric'): string {
  const parsed = parseYearMonth(yearMonth)
  if (!parsed) return yearMonth

  const vars = {
    year: parsed.year,
    month: parsed.month,
    monthPadded: parsed.monthPadded,
    monthName: getShortMonthName(parsed.date),
  }

  return style === 'short'
    ? tn('date.yearMonthShort', vars)
    : tn('date.yearMonthNumeric', vars)
}

export function formatMonthLabel(yearMonth: string): string {
  const parsed = parseYearMonth(yearMonth)
  if (!parsed) return yearMonth

  return tn('date.monthLabel', {
    year: parsed.year,
    month: parsed.month,
    monthPadded: parsed.monthPadded,
    monthName: getShortMonthName(parsed.date),
  })
}

/** Translate a category value from markdown (key or raw string) to display label */
export function translateCategory(value: string): string {
  if (!value || value === '-') return t('label.cat.uncategorized')
  const key = `label.cat.${value}` as TranslationKey
  const dict = translations['en'] as Record<string, string>
  return dict[key] ?? value  // custom categories return as-is
}
