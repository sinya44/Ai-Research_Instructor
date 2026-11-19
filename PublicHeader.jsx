import Logo from './Logo.jsx'
import { ArrowLeft } from './Icons.jsx'

export default function PublicHeader({ page, future, go, pickFuture }) {
  const cur = page === 'login' || page === 'reset' ? 'login' : 'signup'
  return (
    <header className="top">
      <div className="brand">
        {page === 'signup' && (
          <button type="button" className="backbtn" onClick={() => go('landing')} aria-label="Back to home" title="Back to home">
            <ArrowLeft />
          </button>
        )}
        <Logo onClick={() => go('landing')} />
      </div>
      <nav>
        <button type="button" className={'navlink' + (page === 'landing' && !future ? ' act' : '')} onClick={() => go('landing')}>Home</button>
        <button type="button" className={'navlink' + (future === 'Features' ? ' act' : '')} onClick={() => pickFuture('Features')}>Features</button>
        <button type="button" className={'navlink' + (future === 'Pricing' ? ' act' : '')} onClick={() => pickFuture('Pricing')}>Pricing</button>
      </nav>
      <div className="acts">
        <button type="button" className={'btn sm' + (cur === 'login' ? '' : ' alt')} onClick={() => go('login')}>Log in</button>
        <button type="button" className={'btn sm' + (cur === 'signup' ? '' : ' alt')} onClick={() => go('signup')}>Sign Up</button>
      </div>
    </header>
  )
}
