import { useState } from 'react'
import { EyeIcon } from './Icons.jsx'

// Password box with an eye button inside it.
// Hidden  -> eye with a diagonal line. Click -> password shown, line removed.
export default function PasswordInput({ id, name, value, onChange, placeholder, autoComplete = 'new-password' }) {
  const [show, setShow] = useState(false)
  return (
    <div className="pw">
      <input id={id} name={name} type={show ? 'text' : 'password'} value={value} onChange={onChange} placeholder={placeholder} autoComplete={autoComplete} />
      <button type="button" className="eye" aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show} onClick={() => setShow((s) => !s)}>
        <EyeIcon slash={!show} />
      </button>
    </div>
  )
}
