# PennyWallet (Ben)

A personal finance tracker for [Obsidian](https://obsidian.md). Income, expenses, credit cards and recurring payments, stored as plain Markdown tables in the vault.

This started as a fork of [twrusstw/penny-wallet](https://github.com/twrusstw/penny-wallet) and is now its own thing. It is maintained for my own use, does not follow upstream, and works differently in several places (listed under [Changes from the original](#changes-from-the-original)). The original MIT license and copyright notice are kept in [LICENSE](LICENSE). Problems with the original plugin belong in its repository, not here.

## Installation

This version is not in the Obsidian community plugin list. Searching for PennyWallet in Obsidian installs the original, not this one.

**From a release.** Download `main.js`, `manifest.json` and `styles.css` from the [latest release](https://github.com/b3nsh4/penny-wallet/releases/latest), then follow steps 1 to 3 below.

**From source:**

```bash
git clone https://github.com/b3nsh4/penny-wallet.git
cd penny-wallet
npm ci
npm run build
```

1. Create `<vault>/.obsidian/plugins/penny-wallet-ben/`
2. Copy `main.js`, `manifest.json` and `styles.css` into it
3. Reload Obsidian and enable **PennyWallet (Ben)** in Settings → Community plugins

To update: download the new release (or pull and rebuild), copy the three files again, then toggle the plugin off and on.

The plugin id is `penny-wallet-ben`, so Obsidian never replaces it with the community version. Do not run it alongside the original PennyWallet: both read the same `.penny-wallet.json` and register the same views.

On mobile, the plugin folder has to reach the phone some other way, for example by syncing the vault with git. The same build runs on desktop and Android.

## How to log money

Every number the plugin shows comes from the rows you log, plus each account's starting balance. Getting the entries right is most of it.

**Spending from the bank.** Add an expense on the bank account.

**Spending on a credit card.** Add an expense on the card account. The card's "owed" amount goes up, the bank does not change, and the purchase counts as spending.

**Paying the card bill.** Add a transfer from the bank to the card with the category *credit card payment*. The bank goes down and the card's owed amount goes down. It is not counted as spending again, because the purchases already were. Never log the bill as an expense as well, or the spending is counted twice.

**Taking money out of a card.** A transfer from the card to the bank (for example cash you received and deposited for something paid on the card) raises what you owe on the card and adds to the bank.

**Starting balance.** Use it only for money that was already there before you started tracking: savings already in a bank account, or debt already on a card. If you are going to log that money as entries instead, leave the starting balance at 0. Entering it in both places counts it twice. It is set once and never changes after that.

**Salary and the month.** Months are calendar months. If your salary arrives at the end of a month and pays for the next one, log it dated the 1st of the next month, along with anything spent between payday and the 1st. The plugin does not do this automatically; either wait until the 1st to log, or change the date in the form.

## Recurring payments

Fixed monthly payments such as EMIs, rent or insurance can be added once and are then logged automatically.

- Add them in Settings → Recurring payments, or tick **Repeat monthly** when adding an expense. The checkbox also saves the expense you are entering as this month's payment, so for something that only starts next month, use settings.
- Each payment has an amount, account, category, day of the month, start month and an optional end month.
- On the 1st of every month, that month's payments are added, each dated on its own payment day, so the month shows what will be debited and the balance already accounts for it. The plugin checks when Obsidian starts and every hour while it is open. Missed months are filled in.
- Nothing is added before the start month or after the end month. Removing a payment stops future entries and keeps past ones.

If a laptop and a phone both open Obsidian on the 1st before syncing, each can add the same entries. Open one device first that day and let it sync, or delete any duplicates.

## Screens

**Overview.** Each account's current balance on its own (bank balance, and "owed" for each card), this month's income and expense, a 6-month income and expense chart, and pie charts of spending and income by category. Every category gets its own slice.

**Transactions.** The month's entries with filters by type, category, account, date range and text. Tap a row to edit or delete it.

**Assets.** Account balances, net assets and their trend over 3, 6 or 12 months.

**Settings.** Accounts (with starting balances), recurring payments, and categories. Any category can be renamed (tap it) or removed (×). Renaming updates past transactions and recurring payments that use it. *Credit card payment* is fixed, because card balances depend on it.

## Changes from the original

- Recurring payments, with an optional end month and a **Repeat monthly** option in the add form
- Categories, including the built-in ones, can be renamed and removed
- Transfers out of a credit card raise its debt (the original lowered it)
- The Overview shows each account separately; the month's "balance" figure is gone
- Pie charts show every category instead of grouping small ones into "Other"
- Clearer starting balance hints in the account forms
- Open add/edit forms refresh when settings change
- Rupee symbol in the mobile amount entry
- English only; the Traditional Chinese translation is removed

## Data format

```
<vault>/
├── .penny-wallet.json     config: accounts, categories, recurring payments
└── PennyWallet/
    ├── 2026-10.md
    └── 2026-11.md
```

Each month file has frontmatter with the month's totals, followed by a Markdown table:

```markdown
---
income: 75000
expense: 12450
netAsset: 0
---

## 2026-11

| Date | Type | Wallet | From | To | Category | Note | Tags | Amount | CreatedAt |
|------|------|--------|------|----|----------|------|------|--------|-----------|
| 11/01 | income | Bank | - | - | salary | - | - | 75000 | 2026-11-01T08:00:00.000Z |
| 11/03 | expense | Bank | - | - | EMI | Oven | - | 2400 | 2026-11-01T08:00:01.000Z |
| 11/04 | expense | Card | - | - | food | Groceries | - | 650 | 2026-11-04T12:30:00.000Z |
```

The files are plain text, so they work with git and Dataview, and stay readable without the plugin.

The `obsidian://penny-wallet` URI from the original still works for opening the add form with fields filled in, e.g. `obsidian://penny-wallet?type=expense&amount=280&category=food&note=Lunch`. Supported parameters: `type`, `amount`, `note`, `category`, `wallet`, `fromWallet`, `toWallet`, `date`.

## Development

```bash
npm test          # unit and integration tests (vitest)
npm run lint      # eslint and type check
npm run build     # production build to main.js
```

The UI test scripts in `scripts/` come from the original project and have not been updated for this version.

## License

[MIT](LICENSE). Original work © twrusstw.
