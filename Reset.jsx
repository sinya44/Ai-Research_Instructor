import { useState } from 'react'
import PasswordInput from '../components/PasswordInput.jsx'
import { getUsers, saveUsers, okMail } from '../utils/helpers.js'

export default function Reset({ go, prefill, setPrefill, notify, showPopup }) {
  const [email, setEmail] = useState(prefill)
  const [np, setNp] = useState('')
  const [cp, setCp] = useState('')
  const [err, setErr] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const em = email.trim().toLowerCase()
    setErr('')
    if (!em || !np || !cp) return setErr('Please fill in all fields.')
    if (!okMail(em)) return setErr('Enter a valid email address.')
    const users = getUsers()
    if (!users[em]) return showPopup('Email Not Registered', 'This email address is not registered. Please sign up to create an account.')
    if (np.length < 8) return setErr('Password must be at least 8 characters.')
    if (np !== cp) return setErr('Passwords do not match.')
    users[em].password = np
    saveUsers(users)
    setPrefill(em)
    go('login')
    notify('Password updated successfully. Please log in.')
  }

  return (
    <div className="auth">
      <h2>Reset Password</h2>
      <p className="sub">Enter your registered email and choose a new password.</p>
      <form onSubmit={submit} noValidate autoComplete="off">
        <label htmlFor="rem">Email Address</label>
        <input id="rem" name="reset-email" type="email" placeholder="Enter your registered email" autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="rnp">New Password</label>
        <PasswordInput id="rnp" name="reset-new-password" placeholder="Enter new password" value={np} onChange={(e) => setNp(e.target.value)} />
        <label htmlFor="rcp">Confirm New Password</label>
        <PasswordInput id="rcp" name="reset-confirm-password" placeholder="Enter new password again" value={cp} onChange={(e) => setCp(e.target.value)} />
        <div className="err">{err}</div>
        <button className="btn w" type="submit">Reset Password</button>
      </form>
      <p className="foot">Remembered your password? <a className="lnk" onClick={() => go('login')}>Back to Log in</a></p>
    </div>
  )
}
