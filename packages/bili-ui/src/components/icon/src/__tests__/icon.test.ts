import { describe, expect, it, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Icon from '../icon.vue'
import {
  addIcons,
  getIcon,
  getIconGroups,
  getIconNames,
  iconGroups,
  iconNames,
  icons,
  removeIcon
} from '../icons'

afterEach(() => {
  removeIcon('brand')
  removeIcon('heart')
  removeIcon('custom-shape')
})

describe('BiliIcon', () => {
  it('renders a built-in icon as an inline svg with paths', () => {
    const wrapper = mount(Icon, { props: { name: 'check' } })
    const svg = wrapper.find('svg')
    expect(svg.exists()).toBe(true)
    expect(svg.element.getAttribute('viewBox')).toBe('0 0 24 24')
    expect(svg.attributes('fill')).toBe('none')
    expect(svg.attributes('stroke')).toBe('currentColor')
    expect(wrapper.findAll('path')).toHaveLength(icons.check.length)
  })

  it('applies size and color', () => {
    const wrapper = mount(Icon, { props: { name: 'check', size: 20, color: 'red' } })
    const style = wrapper.find('svg').attributes('style')
    expect(style).toContain('font-size: 20px')
    expect(style).toContain('color: red')
  })

  it('adds the spin class when spin is set', () => {
    const wrapper = mount(Icon, { props: { name: 'loading', spin: true } })
    expect(wrapper.find('svg').classes()).toContain('is-spin')
  })

  it('renders inline path arrays through the icon prop', () => {
    const wrapper = mount(Icon, { props: { icon: ['M12 2 2 22h20z'] } })
    expect(wrapper.findAll('path')).toHaveLength(1)
    expect(wrapper.find('path').attributes('d')).toBe('M12 2 2 22h20z')
  })

  it('renders a filled custom icon with fill=currentColor and no stroke', () => {
    addIcons({ heart: { mode: 'fill', paths: ['M12 21s-8-4.5-8-10z'] } })
    const wrapper = mount(Icon, { props: { name: 'heart' } })
    const svg = wrapper.find('svg')
    expect(svg.classes()).toContain('is-fill')
    expect(svg.attributes('fill')).toBe('currentColor')
    expect(svg.attributes('stroke')).toBe('none')
    expect(svg.attributes('stroke-width')).toBeUndefined()
  })

  it('supports a custom viewBox and stroke width', () => {
    addIcons({
      brand: { paths: ['M0 0h48v48H0z'], viewBox: '0 0 48 48', strokeWidth: 1.5 }
    })
    const wrapper = mount(Icon, { props: { name: 'brand' } })
    const svg = wrapper.find('svg')
    expect(svg.element.getAttribute('viewBox')).toBe('0 0 48 48')
    expect(svg.attributes('stroke-width')).toBe('1.5')
  })

  it('renders non-path shapes supplied as raw content', () => {
    addIcons({ 'custom-shape': { content: '<circle cx="12" cy="12" r="9" />' } })
    const wrapper = mount(Icon, { props: { name: 'custom-shape' } })
    expect(wrapper.find('circle').exists()).toBe(true)
  })

  it('lets the mode prop override the icon definition', () => {
    const wrapper = mount(Icon, { props: { icon: ['M0 0h10v10H0z'], mode: 'fill' } })
    expect(wrapper.find('svg').attributes('fill')).toBe('currentColor')
  })

  it('renders an empty svg for an unknown name', () => {
    const wrapper = mount(Icon, { props: { name: 'does-not-exist' } })
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.findAll('path')).toHaveLength(0)
  })
})

describe('custom icon registry', () => {  it('registers and resolves custom icons', () => {
    addIcons({ brand: ['M0 0h10v10H0z'] })
    expect(getIcon('brand')?.paths).toEqual(['M0 0h10v10H0z'])
    expect(getIconNames()).toContain('brand')
  })

  it('prefers a custom icon over a built-in one with the same name', () => {
    addIcons({ check: ['M0 0L24 24'] })
    expect(getIcon('check')?.paths).toEqual(['M0 0L24 24'])
    removeIcon('check')
    expect(getIcon('check')?.paths).toEqual(icons.check)
  })

  it('removes custom icons', () => {
    addIcons({ brand: ['M0 0h10v10H0z'] })
    removeIcon('brand')
    expect(getIcon('brand')).toBeUndefined()
    expect(getIconNames()).not.toContain('brand')
  })
})

describe('built-in icon set', () => {
  it('exposes a meaningful number of icons', () => {
    expect(iconNames.length).toBeGreaterThanOrEqual(120)
  })

  it('only uses non-empty path data', () => {
    for (const [name, paths] of Object.entries(icons)) {
      expect(paths.length, `${name} has no paths`).toBeGreaterThan(0)
      for (const d of paths) {
        expect(typeof d, `${name} has a non-string path`).toBe('string')
        expect(d.trim().length, `${name} has an empty path`).toBeGreaterThan(0)
      }
    }
  })

  it('groups every icon exactly once', () => {
    const grouped = Object.values(iconGroups).flat()
    expect(new Set(grouped).size, 'an icon appears in more than one group').toBe(grouped.length)
    expect([...grouped].sort()).toEqual([...iconNames].sort())
  })

  it('exposes groups through getIconGroups', () => {
    const groups = getIconGroups()
    expect(Object.keys(groups).length).toBeGreaterThan(5)
    expect(groups['方向导航']).toContain('arrow-left')
  })
})
