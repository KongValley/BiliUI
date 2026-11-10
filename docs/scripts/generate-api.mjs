import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createChecker } from 'vue-component-meta'

const docsRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = path.resolve(docsRoot, '..')
const packageRoot = path.join(repoRoot, 'packages', 'bili-ui')
const componentsRoot = path.join(packageRoot, 'src', 'components')
const componentsFile = path.join(packageRoot, 'src', 'components.ts')
const outputFile = path.join(docsRoot, '.vitepress', 'data', 'api.json')

const source = fs.readFileSync(componentsFile, 'utf8')
const imported = []
for (const match of source.matchAll(/import\s*\{([^}]+)\}\s*from\s*'\.\/components\/([^']+)'/g)) {
  const names = match[1]
    .split(',')
    .map(name => name.trim())
    .filter(Boolean)
  for (const name of names) imported.push({ name, dir: match[2] })
}

const order = new Map(imported.map((entry, index) => [entry.name, index]))
const exportedNames = new Set(imported.map(entry => entry.name))

const componentFiles = []
for (const dir of fs.readdirSync(componentsRoot)) {
  const srcDir = path.join(componentsRoot, dir, 'src')
  if (!fs.existsSync(srcDir)) continue
  for (const file of fs.readdirSync(srcDir)) {
    if (file.endsWith('.vue')) componentFiles.push(path.join(srcDir, file))
  }
}

const checker = createChecker(path.join(packageRoot, 'tsconfig.json'), {
  schema: false,
  forceUseTs: true
})

const cleanType = (type, required) => {
  if (!required) return type.replace(/\s*\|\s*undefined$/, '')
  return type
}

const formatSignature = type => {
  const trimmed = type.trim()
  if (trimmed === '[]') return '()'
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return `(${trimmed.slice(1, -1)})`
  }
  return trimmed
}

const entries = []
for (const file of componentFiles) {
  const fileSource = fs.readFileSync(file, 'utf8')
  const declaredName = /defineOptions\(\{\s*name:\s*'([^']+)'/.exec(fileSource)?.[1]
  if (!declaredName || !exportedNames.has(declaredName)) continue

  let meta
  try {
    meta = checker.getComponentMeta(file)
  } catch {
    continue
  }
  const name = declaredName

  const dir = path.relative(componentsRoot, file).split(path.sep)[0]
  entries.push({
    name,
    dir,
    description: meta.description ?? '',
    props: meta.props
      .filter(prop => !prop.global)
      .map(prop => ({
        name: prop.name,
        type: cleanType(prop.type, prop.required),
        default: prop.default ?? '',
        required: prop.required,
        description: prop.description ?? ''
      })),
    events: meta.events.map(event => ({
      name: event.name,
      type: formatSignature(event.type),
      description: event.description ?? ''
    })),
    slots: meta.slots.map(slot => ({
      name: slot.name,
      type: formatSignature(slot.type),
      description: slot.description ?? ''
    })),
    exposes: meta.exposed.map(expose => ({
      name: expose.name,
      type: expose.type,
      description: expose.description ?? ''
    }))
  })
}

entries.sort((a, b) => (order.get(a.name) ?? 999) - (order.get(b.name) ?? 999))

fs.mkdirSync(path.dirname(outputFile), { recursive: true })
fs.writeFileSync(outputFile, JSON.stringify(entries, null, 2))
console.log(
  `Generated API metadata for ${entries.length} components -> ${path.relative(repoRoot, outputFile)}`
)
