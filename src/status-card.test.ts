// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import './status-card'

describe('status-card', () => {
  it('renders typed properties inside its shadow root', async () => {
    const card = document.createElement('status-card')
    card.label = 'Reviews tracked'; card.value = '42'; card.detail = 'Live disclosure records'
    document.body.append(card); await card.updateComplete
    expect(card.shadowRoot?.textContent).toContain('42')
  })
})
