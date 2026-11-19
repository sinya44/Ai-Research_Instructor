import { useRef, useState } from 'react'
import PasswordInput from '../components/PasswordInput.jsx'
import { getUsers, saveUsers, okMail } from '../utils/helpers.js'

function GoogleChooser({ onClose, onLogin }) {
  const users = getUsers()
  const keys = Object.keys(users)
  const [sel, setSel] = useState('')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const u = users[sel]
    if (!u || u.password !== pw) return setErr('Wrong password. Please try again.')
    onLogin(u)
  }

  return (
    <div className="gm" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="mbox" role="dialog" aria-modal="true">
        <div className="mhead">
          <h3>{sel ? 'Enter your password' : 'Choose an account'}</h3>
          <button type="button" onClick={onClose} aria-label="Close">&#10005;</button>
        </div>
        {!sel ? (
          keys.length ? (
            keys.map((m) => (
              <button key={m} type="button" className="gacc" onClick={() => setSel(m)}>
                <b>{users[m].name}</b>
                <span>{m}</span>
              </button>
            ))
          ) : (
            <p className="msg">No accounts found on this device. Please sign up first.</p>
          )
        ) : (
          <form onSubmit={submit} noValidate>
            <p className="msg">{sel}</p>
            <label htmlFor="gmp">Password</label>
            <input id="gmp" type="password" autoFocus value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Enter your password" autoComplete="off" />
            <div className="err">{err}</div>
            <button className="btn w" type="submit">Continue</button>
            <button className="btn alt w" type="button" style={{ marginTop: 8 }} onClick={() => { setSel(''); setPw(''); setErr('') }}>
              Choose another account
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default function Signup({ go, setPrefill, notify, showPopup, onLogin }) {
  const [f, setF] = useState({ name: '', email: '', pw: '', cf: '' })
  const [err, setErr] = useState('')
  const [gOpen, setGOpen] = useState(false)
  const emailRef = useRef(null)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const names = [...new Set(Object.values(getUsers()).map((u) => u.name))]

  const submit = (e) => {
    e.preventDefault()
    const email = f.email.trim().toLowerCase()
    if (!f.name.trim()) return setErr('Enter your full name.')
    if (!okMail(email)) return setErr('Enter a valid email address.')

    // the part before "@" must contain letters AND numbers
    const local = email.split('@')[0]
    const hasL = /\p{L}/u.test(local)
    const hasN = /\d/.test(local)
    if (!hasL || !hasN) {
      setErr('')
      showPopup(
        'Invalid Email Address',
        hasL
          ? 'Your email address must include at least one number along with letters (for example: ali123@gmail.com).'
          : 'Your email address cannot consist of numbers only. Please include letters along with numbers (for example: ali123@gmail.com).'
      )
      emailRef.current?.focus()
      return
    }
    if (f.pw.length < 8) return setErr('Password must be at least 8 characters.')
    if (f.pw !== f.cf) return setErr('Passwords do not match.')
    const users = getUsers()
    if (users[email]) return setErr('This email is already registered. Please log in.')
    users[email] = { name: f.name.trim(), password: f.pw }
    saveUsers(users)
    setPrefill(email)
    go('login')
    notify('Account created. Please log in.')
  }

  return (
    <div className="auth">
      <h2>Create your Account</h2>
      <p className="sub">Join AI Research Instructor and start your research journey today.</p>
      <form onSubmit={submit} noValidate autoComplete="on">
        <label htmlFor="sn">Full Name</label>
        <input id="sn" name="fullname" type="text" list="namelist" placeholder="Enter your full name" autoComplete="off" value={f.name} onChange={set('name')} />
        <datalist id="namelist">{names.map((n) => <option key={n} value={n} />)}</datalist>
        <label htmlFor="se">Email Address</label>
        <input id="se" ref={emailRef} name="email" type="email" placeholder="Enter your email" autoComplete="email" value={f.email} onChange={set('email')} />
        <label htmlFor="sp">Password</label>
        <PasswordInput id="sp" name="new-password" placeholder="Create a password" value={f.pw} onChange={set('pw')} />
        <label htmlFor="sc">Confirm Password</label>
        <PasswordInput id="sc" name="confirm-password" placeholder="Confirm your password" value={f.cf} onChange={set('cf')} />
        <div className="err">{err}</div>
        <button className="btn w" type="submit">Sign Up</button>
      </form>
      <button type="button" className="btn alt w gbtn" onClick={() => setGOpen(true)}>G&nbsp; Continue with Google</button>
      <p className="foot">Already have an account? <a className="lnk" onClick={() => go('login')}>Log in</a></p>
      {gOpen && <GoogleChooser onClose={() => setGOpen(false)} onLogin={(u) => { setGOpen(false); onLogin(u) }} />}
    </div>
  )
}
