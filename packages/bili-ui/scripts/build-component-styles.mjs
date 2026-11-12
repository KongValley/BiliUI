import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import * as sass from 'sass'

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const componentsDir = path.join(packageRoot, 'src', 'components')
const outputDir = path.join(packageRoot, 'dist', 'components')

const componentNames = fs
  .readdirSync(componentsDir, { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name)
  .filter(name => fs.existsSync(path.join(componentsDir, name, 'style', 'index.scss')))
  .sort()

const dependencyCache = new Map()

function componentDependencies(name) {
  if (dependencyCache.has(name)) return dependencyCache.get(name)

  const srcDir = path.join(componentsDir, name, 'src')
  const dependencies = new Set()
  if (fs.existsSync(srcDir)) {
    for (const file of fs.readdirSync(srcDir)) {
      if (!file.endsWith('.vue')) continue
      const source = fs.readFileSync(path.join(srcDir, file), 'utf8')
      for (const match of source.matchAll(/from\s+['"]\.\.\/\.\.\/([^/'"]+)\/src\//g)) {
        const dependency = match[1]
        if (dependency !== name && componentNames.includes(dependency)) {
          dependencies.add(dependency)
        }
      }
    }
  }

  const result = [...dependencies]
  dependencyCache.set(name, result)
  return result
}

function collectStyles(name, stack = new Set(), output = []) {
  if (stack.has(name)) return output
  stack.add(name)
  for (const dependency of componentDependencies(name)) {
    collectStyles(dependency, stack, output)
  }
  if (!output.includes(name)) output.push(name)
  return output
}

function buildEntry(name) {
  const styles = collectStyles(name)
  const uses = [
    '@use "src/styles/var.scss";',
    '@use "src/styles/theme/dark.scss";',
    '@use "src/styles/base.scss";',
    ...styles.map(
      style =>
        `@use "src/components/${style}/style/index.scss" as comp_${style.replace(/-/g, '_')};`
    )
  ]

  const result = sass.compileString(uses.join('\n'), {
    url: pathToFileURL(path.join(packageRoot, '__component-style-entry.scss')),
    style: 'compressed',
    quietDeps: true,
    logger: sass.Logger.silent
  })

  const target = path.join(outputDir, name, 'style.css')
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, result.css)
  return styles
}

// Remove previously generated style entries without touching the declaration
// files that vite-plugin-dts emits into the same component directories.
if (fs.existsSync(outputDir)) {
  for (const name of componentNames) {
    fs.rmSync(path.join(outputDir, name, 'style.css'), { force: true })
  }
  for (const entry of fs.readdirSync(outputDir, { withFileTypes: true })) {
    if (entry.isDirectory() && !componentNames.includes(entry.name)) {
      fs.rmSync(path.join(outputDir, entry.name), { recursive: true, force: true })
    }
  }
}

const summary = []
for (const name of componentNames) {
  const styles = buildEntry(name)
  summary.push(`${name} (${styles.length} style${styles.length > 1 ? 's' : ''})`)
}

console.log(`Built ${componentNames.length} component style entries -> dist/components`)
console.log(summary.join(', '))
