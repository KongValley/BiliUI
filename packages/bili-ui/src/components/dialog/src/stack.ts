const stack: symbol[] = []

export const pushDialog = (token: symbol) => {
  stack.push(token)
}

export const removeDialog = (token: symbol) => {
  const index = stack.indexOf(token)
  if (index > -1) stack.splice(index, 1)
}

export const isTopDialog = (token: symbol) => stack[stack.length - 1] === token
