import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import CodeBlock from '../code-block.vue'
import { languageLabel, tokenize } from '../highlight'

const code = `const name = 'bili'
const count = 1`

describe('code block highlighting', () => {
  it('tokenizes keywords, strings and comments', () => {
    const lines = tokenize("const name = 'bili' // hi", 'ts')
    const types = lines[0].map(token => token.type)
    expect(types).toContain('keyword')
    expect(types).toContain('string')
    expect(types).toContain('comment')
  })

  it('keeps multi-line comments on their own lines', () => {
    const lines = tokenize('/* a\nb */\nconst x = 1', 'js')
    expect(lines).toHaveLength(3)
    expect(lines[0][0]).toEqual({ text: '/* a', type: 'comment' })
    expect(lines[1][0]).toEqual({ text: 'b */', type: 'comment' })
    expect(lines[2].some(token => token.type === 'keyword')).toBe(true)
  })

  it('highlights markup tags, attributes and interpolation', () => {
    const lines = tokenize('<div class="box">{{ msg }}</div>', 'vue')
    const types = lines[0].map(token => token.type)
    expect(types).toContain('tag')
    expect(types).toContain('attr')
    expect(types).toContain('string')
    expect(types).toContain('keyword')
  })

  it('falls back to plain text for unknown languages', () => {
    expect(tokenize('hello world', 'brainfuck')).toEqual([
      [{ text: 'hello world', type: 'plain' }]
    ])
  })

  it('labels known and unknown languages', () => {
    expect(languageLabel('ts')).toBe('TypeScript')
    expect(languageLabel('vue')).toBe('Vue')
    expect(languageLabel('python')).toBe('Python')
    expect(languageLabel('')).toBe('Text')
  })
})

describe('BiliCodeBlock', () => {
  afterEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: undefined
    })
  })

  it('renders highlighted lines, line numbers and the header', () => {
    const wrapper = mount(CodeBlock, {
      props: { code, language: 'ts', showLineNumbers: true, title: 'demo.ts' }
    })

    expect(wrapper.findAll('.bili-code-block__line')).toHaveLength(2)
    expect(wrapper.findAll('.bili-code-block__line-number').map(node => node.text())).toEqual([
      '1',
      '2'
    ])
    expect(wrapper.findAll('.bili-code-block__token--keyword').length).toBeGreaterThan(0)
    expect(wrapper.find('.bili-code-block__title').text()).toBe('demo.ts')
    expect(wrapper.find('.bili-code-block__language').text()).toBe('TypeScript')
  })

  it('renders plain text when highlight is disabled', () => {
    const wrapper = mount(CodeBlock, { props: { code, highlight: false } })

    expect(wrapper.find('[class*="token--keyword"]').exists()).toBe(false)
    expect(wrapper.find('.bili-code-block__code').text()).toContain("const name = 'bili'")
  })

  it('copies the code and emits copy', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText }
    })

    const wrapper = mount(CodeBlock, { props: { code } })
    await wrapper.find('.bili-code-block__copy').trigger('click')
    await flushPromises()

    expect(writeText).toHaveBeenCalledWith(code)
    expect(wrapper.emitted('copy')?.[0]).toEqual([code])
    expect(wrapper.find('.bili-code-block__copy').classes()).toContain('is-copied')

    wrapper.unmount()
  })

  it('falls back to execCommand when the clipboard is denied', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'))
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText }
    })
    const execCommand = vi.fn().mockReturnValue(true)
    document.execCommand = execCommand as unknown as typeof document.execCommand

    const wrapper = mount(CodeBlock, { props: { code } })
    await wrapper.find('.bili-code-block__copy').trigger('click')
    await flushPromises()

    expect(execCommand).toHaveBeenCalledWith('copy')
    expect(wrapper.emitted('copy')?.[0]).toEqual([code])

    wrapper.unmount()
    delete (document as unknown as Record<string, unknown>).execCommand
  })

  it('applies maxHeight and can hide the header', () => {
    const wrapper = mount(CodeBlock, {
      props: { code, maxHeight: 120, showHeader: false }
    })

    expect(wrapper.find('.bili-code-block__pre').attributes('style')).toContain(
      'max-height: 120px'
    )
    expect(wrapper.find('.bili-code-block__header').exists()).toBe(false)
  })
})
