import { afterEach, describe, expect, it } from 'vitest'
import {
  defaultThemeColor,
  getThemeColor,
  resetThemeColor,
  setThemeColor,
  themeColorPresets
} from '../use-theme'

afterEach(() => {
  resetThemeColor()
})

describe('theme color', () => {
  it('exposes the brand colour as the default preset', () => {
    expect(getThemeColor()).toBe(defaultThemeColor)
    expect(themeColorPresets[0].color).toBe(defaultThemeColor)
  })

  it('writes light and dark CSS variables for a custom colour', () => {
    expect(setThemeColor('#4f7cff')).toBe(true)

    const style = document.getElementById('bili-theme-color')
    expect(style?.textContent).toContain('--bili-color-primary:#4f7cff')
    expect(style?.textContent).toContain('--bili-color-primary-hover:#')
    expect(style?.textContent).toContain('--bili-color-primary-light:#')
    expect(style?.textContent).toContain('html.dark{')
    expect(style?.textContent).toContain('--bili-chart-color-1:#4f7cff')
    expect(getThemeColor()).toBe('#4f7cff')
  })

  it('normalises shorthand hex colours', () => {
    expect(setThemeColor('#0A8')).toBe(true)
    expect(getThemeColor()).toBe('#00aa88')
    expect(document.getElementById('bili-theme-color')?.textContent).toContain(
      '--bili-color-primary:#00aa88'
    )
  })

  it('ignores invalid colours and can reset overrides', () => {
    expect(setThemeColor('brand-pink')).toBe(false)
    expect(setThemeColor('#4f7cff')).toBe(true)

    resetThemeColor()

    expect(getThemeColor()).toBe(defaultThemeColor)
    expect(document.getElementById('bili-theme-color')).toBeNull()
  })
})
