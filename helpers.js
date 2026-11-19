// ---- users (kept in localStorage under the same key as the old version) ----
let mem = {}
export const getUsers = () => {
  try {
    const v = localStorage.getItem('users')
    if (v) return JSON.parse(v)
  } catch {}
  return mem
}
export const saveUsers = (u) => {
  mem = u
  try {
    localStorage.setItem('users', JSON.stringify(u))
  } catch {}
}

export const okMail = (v) => /^\S+@\S+\.\S+$/.test(v)

// ---- word limit helpers ----
export const countWords = (v) => (v.match(/\S+/g) || []).length
export function capWords(txt, n) {
  if (n <= 0) return ''
  const re = /\S+/g
  let c = 0
  let m
  let end = txt.length
  while ((m = re.exec(txt))) {
    if (++c === n) {
      end = m.index + m[0].length
      break
    }
  }
  return txt.slice(0, end)
}

export const SECTIONS = {
  abstract: 'Abstract',
  introduction: 'Introduction',
  literature: 'Literature Review',
}
export const ABS_MAX = 250

export const asset = (name) => import.meta.env.BASE_URL + encodeURIComponent(name)
