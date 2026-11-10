const created = new Set<string>()
const pending = new Set<string>()

const cloneRules = (namespace: string): string => {
  if (typeof document === 'undefined') return ''
  const parts: string[] = []

  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList
    try {
      rules = sheet.cssRules
    } catch {
      // Cross-origin stylesheets cannot be inspected; custom namespaces need
      // the library CSS to be served from the same origin.
      continue
    }

    for (const rule of Array.from(rules)) {
      const text = rule.cssText
      if (!text.includes('bili-')) continue
      parts.push(text.replace(/\bbili-/g, `${namespace}-`))
    }
  }

  return parts.join('\n')
}

const createStyle = (namespace: string): boolean => {
  const css = cloneRules(namespace)
  if (!css) return false
  if (document.querySelector(`style[data-bili-namespace="${namespace}"]`)) return true

  const style = document.createElement('style')
  style.setAttribute('data-bili-namespace', namespace)
  style.textContent = css
  document.head.appendChild(style)
  return true
}

/**
 * Runtime namespaces need a copy of the compiled stylesheet with the prefix
 * replaced. Styles are usually present before mount; retry briefly for lazily
 * injected CSS (HMR, async style chunks).
 */
export function ensureNamespaceStyle(namespace: string): void {
  if (
    typeof document === 'undefined' ||
    !namespace ||
    namespace === 'bili' ||
    created.has(namespace)
  ) {
    return
  }

  if (createStyle(namespace)) {
    created.add(namespace)
    return
  }
  if (pending.has(namespace)) return

  pending.add(namespace)
  let attempts = 0
  const retry = () => {
    if (created.has(namespace)) {
      pending.delete(namespace)
      return
    }
    if (createStyle(namespace)) {
      created.add(namespace)
      pending.delete(namespace)
      return
    }
    attempts += 1
    if (attempts < 20) setTimeout(retry, 50)
    else pending.delete(namespace)
  }
  setTimeout(retry, 0)
}
