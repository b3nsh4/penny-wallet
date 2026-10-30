import { App, Modal } from 'obsidian'
import { t } from '../i18n'

// ─── Single text field prompt ─────────────────────────────────────────────────

export class TextPromptModal extends Modal {
  private title: string
  private value: string
  private onSubmit: (value: string) => void | Promise<void>

  constructor(app: App, title: string, initial: string, onSubmit: (value: string) => void | Promise<void>) {
    super(app)
    this.title = title
    this.value = initial
    this.onSubmit = onSubmit
  }

  onOpen() {
    const { contentEl } = this
    contentEl.addClass('pw-modal')
    contentEl.createEl('h2', { text: this.title })

    const input = contentEl.createEl('input', { type: 'text', cls: 'pw-field-input' })
    input.value = this.value
    input.setAttribute('enterkeyhint', 'done')
    input.addEventListener('input', () => { this.value = input.value })

    const submit = () => {
      this.close()
      void this.onSubmit(this.value.trim())
    }
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit() })

    const row = contentEl.createDiv('pw-btn-row')
    row.createEl('button', { text: t('ui.save'), cls: 'mod-cta' }).addEventListener('click', submit)
    row.createEl('button', { text: t('ui.cancel') }).addEventListener('click', () => this.close())

    window.setTimeout(() => { input.focus(); input.select() }, 50)
  }

  onClose() { this.contentEl.empty() }
}
