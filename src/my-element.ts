import { LitElement, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { PulseController } from './pulse-controller'
import './status-card'

type VatFraudSignal = { id: number; title: string; owner: string; status: 'Draft' | 'Review' | 'Approved'; priority: 'Low' | 'Medium' | 'High' }

@customElement('vat-fraud-detection-center')
export class VatFraudDetectionCenter extends LitElement {
  private pulse = new PulseController(this)
  @state() private requests: VatFraudSignal[] = []
  @state() private loading = true
  @state() private error = ''
  @state() private query = ''

  connectedCallback() { super.connectedCallback(); void this.load() }
  private async load() { try { const response = await fetch('/api/items'); if (!response.ok) throw new Error(); this.requests = await response.json() } catch { this.error = 'VAT fraud signal information is temporarily unavailable.' } finally { this.loading = false } }
  private async addVatFraudSignal() { const response = await fetch('/api/items', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: 'Brussels transaction-risk review', owner: 'Brussels VAT Fraud Team', status: 'Draft', priority: 'Medium' }) }); if (response.ok) this.requests = [...this.requests, await response.json()]; else this.error = 'The VAT fraud signal could not be saved.' }
  private async advance(item: VatFraudSignal) { const status = item.status === 'Draft' ? 'Review' : 'Approved'; const response = await fetch(`/api/items/${item.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...item, status }) }); if (response.ok) { const updated = await response.json(); this.requests = this.requests.map((entry) => entry.id === updated.id ? updated : entry) } else this.error = 'The VAT fraud signal could not be updated.' }

  render() {
    const approved = this.requests.filter((item) => item.status === 'Approved').length
    const urgent = this.requests.filter((item) => item.priority === 'High').length
    const visible = this.requests.filter((item) => `${item.title} ${item.owner} ${item.status}`.toLowerCase().includes(this.query.toLowerCase())).sort((a, b) => a.title.localeCompare(b.title))
    return html`
      <header><div><span class="eyebrow">Coordinate transaction reporting, anomaly signals and coordinated tax action</span><h1>VAT Fraud Detection Elements</h1><p>Reusable web components for authorities coordinating timely digital reporting and fraud response.</p></div><div class="actions"><span class="pulse"><i></i>${this.pulse.label}</span><button @click=${this.addVatFraudSignal}>Add VAT fraud signal</button></div></header>
      <section class="metrics"><status-card label="Signals tracked" value="${this.loading ? '…' : this.requests.length}" detail="Live VAT analysis service"></status-card><status-card label="Signals approved" value="${approved}" detail="Ready for investigation"></status-card><status-card label="High priority" value="${urgent}" detail="Needs attention"></status-card></section>
      <section class="panel"><div class="title"><div><span class="eyebrow">Transaction reporting, risk signals and investigations</span><h2>VAT fraud signal board</h2></div><span>Updated ${this.pulse.label}</span></div><label class="search">Find a VAT fraud signal<input aria-label="Find a VAT fraud signal" .value=${this.query} @input=${(event: Event) => { this.query = (event.target as HTMLInputElement).value }} placeholder="Search by transaction pattern, risk signal, owner or status"></label>${this.error ? html`<p role="alert">${this.error}</p>` : ''}${visible.length === 0 && !this.loading ? html`<p>No VAT fraud signals match this search.</p>` : ''}${repeat(visible, (item) => item.id, (item) => html`<article><span class="state ${item.status === 'Approved' ? '' : 'watch'}"></span><div><b>${item.title}</b><small>${item.owner}</small></div><div class="meter"><i style="width:${item.status === 'Approved' ? 100 : item.status === 'Review' ? 65 : 30}%"></i></div><strong>${item.priority}</strong><span>${item.status}</span>${item.status !== 'Approved' ? html`<button class="small" @click=${() => this.advance(item)}>Move forward</button>` : ''}</article>`)}</section>`
  }

  static styles = css`
    :host{display:block;max-width:1180px;margin:auto;padding:64px 24px;color:#f0efff}*{box-sizing:border-box}header{display:flex;justify-content:space-between;align-items:end;margin-bottom:36px}.actions{display:flex;align-items:center;gap:10px}h1{font-size:clamp(44px,7vw,76px);letter-spacing:-.055em;margin:8px 0 12px}p{color:#aaa7c5;margin:0;max-width:650px}.eyebrow{color:#b495ff;text-transform:uppercase;letter-spacing:.16em;font-size:11px;font-weight:800}.pulse{border:1px solid #3b3658;padding:10px 14px;border-radius:999px;color:#b9b5d3}.pulse i,.state{display:inline-block;width:8px;height:8px;background:#66e2bd;border-radius:50%;margin-right:8px;box-shadow:0 0 12px #66e2bd}button{border:0;background:#b495ff;color:#171126;border-radius:9px;padding:11px 14px;font-weight:800;cursor:pointer}.small{padding:7px 9px}.metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.panel{margin-top:14px;padding:24px;background:#151329;border:1px solid #312d4c;border-radius:18px}.title{display:flex;justify-content:space-between;align-items:end}.title h2{font-size:28px;margin:6px 0 18px}.title>span{font-size:12px;color:#918cae}.search{display:block;color:#aaa7c5;font-size:12px;margin-bottom:14px}.search input{display:block;width:100%;margin-top:7px;padding:11px;border:1px solid #3b3658;border-radius:8px;background:#0d0b1e;color:#fff}article{display:grid;grid-template-columns:20px 1.4fr 1fr 70px 80px auto;align-items:center;gap:14px;border-top:1px solid #302c49;padding:18px 0}article small{display:block;color:#8883a5;margin-top:4px}.state.watch{background:#ffba68;box-shadow:0 0 12px #ffba68}.meter{height:7px;background:#292541;border-radius:10px;overflow:hidden}.meter i{display:block;height:100%;background:linear-gradient(90deg,#8968e8,#66e2bd);border-radius:inherit}@media(max-width:700px){:host{padding:34px 16px}header{align-items:start;flex-direction:column;gap:20px}.actions{flex-wrap:wrap}.metrics{grid-template-columns:1fr}article{grid-template-columns:15px 1fr 60px}.meter,article>span:last-of-type{display:none}.small{grid-column:2/-1}}
  `
}
declare global { interface HTMLElementTagNameMap { 'vat-fraud-detection-center': VatFraudDetectionCenter } }
