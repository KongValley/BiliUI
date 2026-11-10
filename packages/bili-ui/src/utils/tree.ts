export type TreeKey = string | number

export interface TreeOption {
  label?: string
  value?: TreeKey
  children?: TreeOption[]
  disabled?: boolean
  [key: string]: any
}

export interface TreeFieldNames {
  label?: string
  value?: string
  children?: string
  disabled?: string
}

export interface ResolvedTreeFields {
  label: string
  value: string
  children: string
  disabled: string
}

export function resolveTreeFields(fieldNames?: TreeFieldNames): ResolvedTreeFields {
  return {
    label: fieldNames?.label ?? 'label',
    value: fieldNames?.value ?? 'value',
    children: fieldNames?.children ?? 'children',
    disabled: fieldNames?.disabled ?? 'disabled'
  }
}

export const nodeLabel = (node: TreeOption, fields: ResolvedTreeFields): string =>
  String(node[fields.label] ?? '')

export const nodeValue = (node: TreeOption, fields: ResolvedTreeFields): TreeKey | undefined =>
  node[fields.value] as TreeKey | undefined

export const nodeChildren = (
  node: TreeOption,
  fields: ResolvedTreeFields
): TreeOption[] | undefined => {
  const children = node[fields.children]
  return Array.isArray(children) ? children : undefined
}

export const isNodeDisabled = (node: TreeOption, fields: ResolvedTreeFields): boolean =>
  !!node[fields.disabled]

/** Depth-first search for a node value; returns the full path including the node. */
export function findNodePath(
  options: TreeOption[],
  predicate: (value: TreeKey | undefined, node: TreeOption) => boolean,
  fields: ResolvedTreeFields
): TreeOption[] | null {
  for (const node of options) {
    if (predicate(nodeValue(node, fields), node)) return [node]
    const children = nodeChildren(node, fields)
    if (children?.length) {
      const path = findNodePath(children, predicate, fields)
      if (path) return [node, ...path]
    }
  }
  return null
}

/** Keys of every node that has children. */
export function collectBranchKeys(
  options: TreeOption[],
  fields: ResolvedTreeFields
): TreeKey[] {
  const keys: TreeKey[] = []
  const walk = (nodes: TreeOption[]) => {
    nodes.forEach(node => {
      const children = nodeChildren(node, fields)
      if (children?.length) {
        const value = nodeValue(node, fields)
        if (value !== undefined) keys.push(value)
        walk(children)
      }
    })
  }
  walk(options)
  return keys
}

/** Keys of every node, including leaves. */
export function collectAllKeys(
  options: TreeOption[],
  fields: ResolvedTreeFields
): TreeKey[] {
  const keys: TreeKey[] = []
  const walk = (nodes: TreeOption[]) => {
    nodes.forEach(node => {
      const value = nodeValue(node, fields)
      if (value !== undefined) keys.push(value)
      const children = nodeChildren(node, fields)
      if (children?.length) walk(children)
    })
  }
  walk(options)
  return keys
}

export function collectSubtreeKeys(node: TreeOption, fields: ResolvedTreeFields): TreeKey[] {
  const keys: TreeKey[] = []
  const walk = (current: TreeOption) => {
    const value = nodeValue(current, fields)
    if (value !== undefined) keys.push(value)
    nodeChildren(current, fields)?.forEach(walk)
  }
  walk(node)
  return keys
}
