import { ClockTile, ShieldTile, PointerTile } from '../components/Icons.jsx'
import { asset } from '../utils/helpers.js'

export default function Landing({ go }) {
  return (
    <>
      <div className="hero">
        <div>
          <h1>
            Turn Your Research<br />
            ideas Into<br />
            <span className="hl">Real Insights</span>
          </h1>
          <p>Learn how to write better research papers with step-by-step AI guidance, built for students and early researchers.</p>
          <button className="btn" onClick={() => go('signup')}>Get Started Free</button>
        </div>
        <div className="mock">
          <img src={asset('AI_Research_Dashboard_Mockup.png')} alt="AI Research Instructor dashboard on a laptop" onError={(e) => (e.currentTarget.style.display = 'none')} />
        </div>
      </div>
      <div className="feats">
        <div><ClockTile /><h3>Save Time</h3><p>Get structured content in minutes.</p></div>
        <div><ShieldTile /><h3>Better Quality</h3><p>Research with trusted AI support.</p></div>
        <div><PointerTile /><h3>Easy to Use</h3><p>Simple steps, real results.</p></div>
      </div>
    </>
  )
}
