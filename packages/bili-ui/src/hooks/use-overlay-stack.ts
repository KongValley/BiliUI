/**
 * Global overlay stack shared by Dialog, Drawer and future modal layers.
 * Only the top-most overlay reacts to Escape, mirroring native modal behaviour.
 */
const stack: symbol[] = []

export const pushOverlay = (token: symbol): void => {
  stack.push(token)
}

export const removeOverlay = (token: symbol): void => {
  const index = stack.indexOf(token)
  if (index > -1) stack.splice(index, 1)
}

export const isTopOverlay = (token: symbol): boolean => stack[stack.length - 1] === token
