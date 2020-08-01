export default function isArraysEqual(a: Array<unknown>, b: Array<unknown>) : boolean {
  if (a === b) return true
  if (a == null || b == null) return false
  if (a.length !== b.length) return false

  a.sort()
  b.sort()

  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false
  }
  
  return true
}
