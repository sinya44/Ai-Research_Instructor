import { countWords, capWords } from '../utils/helpers.js'

// Textarea with an optional word limit (typing and pasting are both capped).
export default function LimitedTextarea({ value, onChange, max, ...rest }) {
  const handleChange = (e) => {
    const v = e.target.value
    if (max && countWords(v) > max && countWords(v) >= countWords(value)) return
    onChange(v)
  }
  const handlePaste = (e) => {
    if (!max) return
    e.preventDefault()
    const el = e.target
    const before = value.slice(0, el.selectionStart)
    const after = value.slice(el.selectionEnd)
    const ins = capWords(e.clipboardData.getData('text'), max - countWords(before) - countWords(after))
    onChange(before + ins + after)
  }
  return <textarea {...rest} value={value} onChange={handleChange} onPaste={handlePaste} />
}
