export type CodeTokenType =
  | 'plain'
  | 'keyword'
  | 'string'
  | 'comment'
  | 'number'
  | 'function'
  | 'tag'
  | 'attr'
  | 'property'
  | 'operator'
  | 'punctuation'

export interface CodeToken {
  text: string
  type: CodeTokenType
}

type Family = 'script' | 'markup' | 'style' | 'json' | 'shell' | 'text'

const FAMILY_ALIASES: Record<string, Family> = {
  js: 'script',
  mjs: 'script',
  cjs: 'script',
  javascript: 'script',
  ts: 'script',
  typescript: 'script',
  jsx: 'script',
  tsx: 'script',
  html: 'markup',
  htm: 'markup',
  vue: 'markup',
  xml: 'markup',
  svg: 'markup',
  css: 'style',
  scss: 'style',
  sass: 'style',
  less: 'style',
  json: 'json',
  json5: 'json',
  bash: 'shell',
  sh: 'shell',
  shell: 'shell',
  zsh: 'shell',
  powershell: 'shell',
  ps1: 'shell'
}

const SCRIPT_KEYWORDS = [
  'abstract',
  'any',
  'as',
  'async',
  'await',
  'bigint',
  'boolean',
  'break',
  'case',
  'catch',
  'class',
  'const',
  'continue',
  'debugger',
  'declare',
  'default',
  'delete',
  'do',
  'else',
  'enum',
  'export',
  'extends',
  'finally',
  'for',
  'from',
  'function',
  'get',
  'if',
  'implements',
  'import',
  'in',
  'instanceof',
  'interface',
  'let',
  'namespace',
  'never',
  'new',
  'number',
  'object',
  'of',
  'private',
  'protected',
  'public',
  'readonly',
  'return',
  'set',
  'static',
  'string',
  'super',
  'switch',
  'symbol',
  'throw',
  'try',
  'type',
  'typeof',
  'undefined',
  'unknown',
  'var',
  'void',
  'while',
  'with',
  'yield'
].join('|')

const SHELL_KEYWORDS = [
  'alias',
  'awk',
  'case',
  'cat',
  'cd',
  'chmod',
  'chown',
  'cp',
  'curl',
  'do',
  'done',
  'echo',
  'elif',
  'else',
  'esac',
  'exit',
  'export',
  'fi',
  'for',
  'function',
  'git',
  'grep',
  'if',
  'local',
  'ls',
  'mkdir',
  'mv',
  'node',
  'npm',
  'pnpm',
  'read',
  'return',
  'rm',
  'sed',
  'set',
  'sh',
  'source',
  'sudo',
  'then',
  'unset',
  'until',
  'while',
  'yarn'
].join('|')

/** Collects the source of each named-group alternative into one regex. */
const buildPattern = (parts: RegExp[]): RegExp =>
  new RegExp(parts.map(part => part.source).join('|'), 'g')

const SCRIPT_PATTERN = buildPattern([
  /(?<comment>\/\/[^\n]*|\/\*[\s\S]*?\*\/)/,
  /(?<string>"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`)/,
  /(?<number>\b(?:0[xX][\da-fA-F]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\b)/,
  new RegExp(`(?<keyword>\\b(?:${SCRIPT_KEYWORDS})\\b)`),
  /(?<function>\b[A-Za-z_$][\w$]*(?=\s*\())/,
  /(?<operator>[+\-*/%=<>!&|^~?]+)/,
  /(?<punctuation>[{}[\]();,.:]+)/,
  /(?<word>[A-Za-z_$][\w$]*)/,
  /(?<space>\s+)/,
  /(?<other>[\s\S])/
])

const MARKUP_PATTERN = buildPattern([
  /(?<comment><!--[\s\S]*?-->)/,
  /(?<tag><\/?[A-Za-z][\w:.-]*)/,
  /(?<attr>[A-Za-z_:][\w:.-]*(?=\s*=))/,
  /(?<string>"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')/,
  /(?<keyword>\{\{[\s\S]*?\}\})/,
  /(?<punctuation>[<>/=]+)/,
  /(?<word>[A-Za-z_$][\w$]*)/,
  /(?<space>\s+)/,
  /(?<other>[\s\S])/
])

const STYLE_PATTERN = buildPattern([
  /(?<comment>\/\*[\s\S]*?\*\/|\/\/[^\n]*)/,
  /(?<string>"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')/,
  /(?<number>#[\da-fA-F]{3,8}\b|\b\d+(?:\.\d+)?(?:px|rem|em|%|s|ms|vh|vw|deg)?\b)/,
  /(?<keyword>@[\w-]+|!important\b)/,
  /(?<property>[-A-Za-z]+(?=\s*:))/,
  /(?<punctuation>[{}();:,>+~*]+)/,
  /(?<operator>[=~|^$]+)/,
  /(?<word>[-A-Za-z_][\w-]*)/,
  /(?<space>\s+)/,
  /(?<other>[\s\S])/
])

const JSON_PATTERN = buildPattern([
  /(?<property>"(?:[^"\\]|\\.)*"(?=\s*:))/,
  /(?<string>"(?:[^"\\]|\\.)*")/,
  /(?<number>-?\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b)/,
  /(?<keyword>\b(?:true|false|null)\b)/,
  /(?<punctuation>[{}[\],:]+)/,
  /(?<word>[A-Za-z_$][\w$]*)/,
  /(?<space>\s+)/,
  /(?<other>[\s\S])/
])

const SHELL_PATTERN = buildPattern([
  /(?<comment>#[^\n]*)/,
  /(?<string>"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')/,
  /(?<variable>\$\{[^}]*\}|\$[\w@#?]+)/,
  new RegExp(`(?<keyword>\\b(?:${SHELL_KEYWORDS})\\b)`),
  /(?<number>\b\d+\b)/,
  /(?<operator>[=+\-*/%<>!&|]+)/,
  /(?<punctuation>[{}()[\];,])/,
  /(?<word>[A-Za-z_][\w-]*)/,
  /(?<space>\s+)/,
  /(?<other>[\s\S])/
])

const FAMILY_PATTERNS: Record<Exclude<Family, 'text'>, RegExp> = {
  script: SCRIPT_PATTERN,
  markup: MARKUP_PATTERN,
  style: STYLE_PATTERN,
  json: JSON_PATTERN,
  shell: SHELL_PATTERN
}

const resolveFamily = (language: string): Family =>
  FAMILY_ALIASES[language.trim().toLowerCase()] ?? 'text'

const normalizeType = (group: string): CodeTokenType => {
  switch (group) {
    case 'variable':
      return 'keyword'
    case 'keyword':
    case 'string':
    case 'comment':
    case 'number':
    case 'function':
    case 'tag':
    case 'attr':
    case 'property':
    case 'operator':
    case 'punctuation':
      return group
    default:
      return 'plain'
  }
}

const scan = (code: string, family: Exclude<Family, 'text'>): CodeToken[] => {
  const pattern = FAMILY_PATTERNS[family]
  pattern.lastIndex = 0
  const tokens: CodeToken[] = []
  let match: RegExpExecArray | null

  while ((match = pattern.exec(code)) !== null) {
    if (!match[0]) {
      pattern.lastIndex += 1
      continue
    }
    const groups = match.groups ?? {}
    const name = Object.keys(groups).find(key => groups[key] !== undefined) ?? 'other'
    tokens.push({ text: match[0], type: normalizeType(name) })
  }

  return tokens
}

/**
 * Splits code into per-line token arrays. Multi-line tokens (block comments,
 * template strings) are split across lines while keeping their token type.
 */
export function tokenize(code: string, language = 'text'): CodeToken[][] {
  if (!code) return [[]]

  const family = resolveFamily(language)
  if (family === 'text') {
    return code.split('\n').map(line => (line ? [{ text: line, type: 'plain' }] : []))
  }

  const lines: CodeToken[][] = [[]]
  for (const token of scan(code, family)) {
    const parts = token.text.split('\n')
    parts.forEach((part, index) => {
      if (index > 0) lines.push([])
      if (part) lines[lines.length - 1].push({ text: part, type: token.type })
    })
  }

  return lines
}

const LANGUAGE_LABELS: Record<string, string> = {
  js: 'JavaScript',
  mjs: 'JavaScript',
  cjs: 'JavaScript',
  javascript: 'JavaScript',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  jsx: 'JSX',
  tsx: 'TSX',
  html: 'HTML',
  htm: 'HTML',
  vue: 'Vue',
  xml: 'XML',
  svg: 'SVG',
  css: 'CSS',
  scss: 'SCSS',
  sass: 'Sass',
  less: 'Less',
  json: 'JSON',
  json5: 'JSON5',
  bash: 'Bash',
  sh: 'Shell',
  shell: 'Shell',
  zsh: 'Zsh',
  powershell: 'PowerShell',
  ps1: 'PowerShell',
  text: 'Text',
  md: 'Markdown',
  markdown: 'Markdown'
}

export function languageLabel(language = 'text'): string {
  const key = language.trim().toLowerCase()
  if (!key) return 'Text'
  return LANGUAGE_LABELS[key] ?? key.charAt(0).toUpperCase() + key.slice(1)
}
