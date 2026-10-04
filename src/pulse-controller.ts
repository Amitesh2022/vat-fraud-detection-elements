import type { ReactiveController, ReactiveControllerHost } from 'lit'

export class PulseController implements ReactiveController {
  tick = 0
  private timer?: ReturnType<typeof setInterval>
  private host: ReactiveControllerHost
  constructor(host: ReactiveControllerHost) { this.host = host; host.addController(this) }
  get label() { return this.tick === 0 ? 'just now' : `${this.tick}s ago` }
  hostConnected() { this.timer = setInterval(() => { this.tick += 1; this.host.requestUpdate() }, 1000) }
  hostDisconnected() { clearInterval(this.timer) }
}
