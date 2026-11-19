import { useState } from 'react'
import PasswordInput from '../components/PasswordInput.jsx'
import { getUsers, okMail } from '../utils/helpers.js'

export default function Login({ go, prefill, setPrefill, onLogin, showPopup }) {
  const [email, setEmail] = useState(prefill)
  const [pw, setPw] = useState('') // never filled automatically
  const [err, setErr] = useState('')
  const users = getUsers()

  const submit = (e) => {
    e.preventDefault()
    if (!okMail(email.trim())) return setErr('Enter a valid email address.')
    if (!pw) return setErr('Enter your password.')
    const u = users[email.trim().toLowerCase()]
    if (!u || u.password !== pw) return setErr('Invalid email or password.')
    setErr('')
    onLogin(u)
  }

  // Forgot Password opens only for an accurate, registered email typed here.
  const forgot = () => {
    const v = email.trim().toLowerCase()
    if (!v) return showPopup('Email Required', 'Please enter your registered email address first, then click Forgot Password.')
    if (!okMail(v)) return showPopup('Invalid Email Address', 'Please enter a valid email address, then click Forgot Password.')
    if (!users[v]) return showPopup('Email Not Registered', 'This email address is not registered. Please sign up to create an account.')
    setPrefill(v)
    go('reset')
  }

  return (
    <div className="auth">
      <h2>Welcome Back</h2>
      <p className="sub">Log in to your account and continue your research.</p>
      <form onSubmit={submit} noValidate>
        <label htmlFor="le">Email Address</label>
        <input id="le" name="email" type="email" list="emaillist" placeholder="Enter your email" autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)} />
        <datalist id="emaillist">
          {Object.keys(users).map((m) => <option key={m} value={m} label={users[m].name} />)}
        </datalist>
        <label htmlFor="lp">Password</label>
        <PasswordInput id="lp" name="password" placeholder="Enter your password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} />
        <div className="right"><a className="lnk" onClick={forgot}>Forgot Password?</a></div>
        <div className="err">{err}</div>
        <button className="btn w" type="submit">Log In</button>
      </form>
      <p className="foot">Don't have an account? <a className="lnk" onClick={() => go('signup')}>Sign up</a></p>
    </div>
  )
}
