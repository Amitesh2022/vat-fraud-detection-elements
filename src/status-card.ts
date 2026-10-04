import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('status-card')
export class StatusCard extends LitElement {
  @property() label = ''
  @property() value = ''
  @property() detail = ''
  render() { return html`<span>${this.label}</span><strong>${this.value}</strong><small>${this.detail}</small>` }
  static styles = css`:host{display:block;padding:22px;background:linear-gradient(145deg,#18152f,#121023);border:1px solid #332e52;border-radius:16px}span,small{display:block;color:#9691b1}strong{display:block;font-size:38px;margin:10px 0;color:#f3f1ff}`
}

declare global { interface HTMLElementTagNameMap { 'status-card': StatusCard } }
