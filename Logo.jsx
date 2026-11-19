import { asset } from '../utils/helpers.js'

export default function Logo({ onClick }) {
  return (
    <a className="logo" onClick={onClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onClick?.()}>
      <i>
        <img src={asset('brain_logo_top_row_third.png')} alt="AI Research Instructor logo" onError={(e) => (e.currentTarget.style.display = 'none')} />
      </i>
      <span>
        AI Research<br />
        <b>Instructor</b>
      </span>
    </a>
  )
}
