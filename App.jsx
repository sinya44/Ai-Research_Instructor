import { useCallback, useRef, useState } from 'react'
import PublicHeader from './components/PublicHeader.jsx'
import Logo from './components/Logo.jsx'
import Landing from './pages/Landing.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import Reset from './pages/Reset.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Instructor from './pages/Instructor.jsx'
import Analysis from './pages/Analysis.jsx'
import Workspace from './pages/Workspace.jsx'
import FinalDoc from './pages/FinalDoc.jsx'

const APP_PAGES = ['dashboard', 'instructor', 'analysis', 'workspace', 'final']
const NAV = [
  ['dashboard', 'Dashboard'],
  ['instructor', 'AI Instructor'],
  ['analysis', 'Paper Analysis'],
  ['workspace', 'Research Workspace'],
  ['final', 'Final Document'],
]
const EMPTY = { abstract: '', introduction: '', literature: '' }

export default function App() {
  const [page, setPage] = useState('landing')
  const [user, setUser] = useState(null)
  const [prefill, setPrefill] = useState('') // email carried to the login / reset screens
  const [future, setFuture] = useState(null) // "Features" / "Pricing" nav item that was clicked
  const [data, setData] = useState(EMPTY) // sections saved to the final document
  const [toast, setToast] = useState({ msg: '', on: false })
  const [popup, setPopup] = useState(null)
  const toastTimer = useRef()
  const popTimer = useRef()
  const sticky = useRef(false)

  const notify = useCallback((msg, ms = 2200) => {
    clearTimeout(toastTimer.current)
    sticky.current = ms === 0
    setToast({ msg, on: true })
    if (ms !== 0) toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, on: false })), ms)
  }, [])

  const closePopup = useCallback(() => {
    clearTimeout(popTimer.current)
    setPopup(null)
  }, [])

  // professional popup, closes itself after 5 seconds
  const showPopup = useCallback((title, msg) => {
    clearTimeout(popTimer.current)
    setPopup({ title, msg })
    popTimer.current = setTimeout(() => setPopup(null), 5000)
  }, [])

  const go = useCallback((p) => {
    if (sticky.current) {
      setToast((t) => ({ ...t, on: false }))
      sticky.current = false
    }
    closePopup()
    setFuture(null)
    setPage(p)
    window.scrollTo(0, 0)
  }, [closePopup])

  // Features / Pricing are future work: the message stays until another tab is clicked
  const pickFuture = (name) => {
    setFuture(name)
    notify(name + ' will be available in a future release. It is outside the scope of the current version of this project.', 0)
  }

  const login = (u) => {
    setUser(u)
    go('dashboard')
  }
  const logout = () => {
    setUser(null)
    setData(EMPTY)
    go('landing')
  }

  const inApp = user && APP_PAGES.includes(page)
  const initials = user
    ? (() => {
        const p = user.name.trim().split(/\s+/).filter(Boolean)
        return p.length ? (p[0][0] + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase() : ''
      })()
    : ''

  return (
    <>
      {!inApp ? (
        <div id="pub">
          <PublicHeader page={page} future={future} go={go} pickFuture={pickFuture} />
          {page === 'landing' && <Landing go={go} />}
          {page === 'signup' && <Signup go={go} setPrefill={setPrefill} notify={notify} showPopup={showPopup} onLogin={login} />}
          {page === 'login' && <Login go={go} prefill={prefill} setPrefill={setPrefill} onLogin={login} showPopup={showPopup} />}
          {page === 'reset' && <Reset go={go} prefill={prefill} setPrefill={setPrefill} notify={notify} showPopup={showPopup} />}
        </div>
      ) : (
        <div className="shell">
          <aside className="side">
            <Logo onClick={() => go('dashboard')} />
            {NAV.map(([k, t]) => (
              <a key={k} className={page === k ? 'act' : ''} onClick={() => go(k)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && go(k)}>{t}</a>
            ))}
            <span className="gap" />
            <a className="logout" onClick={logout} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && logout()}>Log out</a>
          </aside>
          <main className="main">
            <div className="userbar">
              <span className="avatar" aria-hidden="true">{initials}</span>
              <span className="uname">{user.name}</span>
            </div>
            {page === 'dashboard' && <section className="screen on"><Dashboard data={data} go={go} /></section>}
            {page === 'instructor' && <section className="screen on"><Instructor /></section>}
            {/* kept mounted so uploaded papers and notes stay when switching tabs */}
            <section className={'screen' + (page === 'analysis' ? ' on' : '')}><Analysis notify={notify} /></section>
            <section className={'screen' + (page === 'workspace' ? ' on' : '')}><Workspace setData={setData} notify={notify} /></section>
            {page === 'final' && <section className="screen on"><FinalDoc data={data} setData={setData} notify={notify} /></section>}
          </main>
        </div>
      )}

      <div id="epop" className={popup ? 'on' : ''} role="alert">
        <span className="ei">!</span>
        <div className="et"><b>{popup?.title}</b><p>{popup?.msg}</p></div>
        <button type="button" className="ex" aria-label="Close" onClick={closePopup}>&#10005;</button>
      </div>
      <div className={'toast' + (toast.on ? ' on' : '')}>{toast.msg}</div>
    </>
  )
}
