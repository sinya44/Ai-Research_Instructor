import { useState } from 'react'
import LimitedTextarea from '../components/LimitedTextarea.jsx'
import { SECTIONS, ABS_MAX, countWords } from '../utils/helpers.js'

const INFO = {
  abstract: ['Summarize your study in a few lines.', 'State the problem, method, key result and conclusion in 150–250 words.'],
  introduction: ['Introduce the problem and your aim.', 'Move from the broad topic to the specific gap, then end with your research question.'],
  literature: ['Compare existing studies.', 'Group sources by theme, not by author, and point out where they disagree.'],
}

export default function Workspace({ setData, notify }) {
  const [tab, setTab] = useState('abstract')
  const [notes, setNotes] = useState({ abstract: '', introduction: '', literature: '' })

  const addToFile = () => {
    let n = 0
    const next = {}
    Object.keys(SECTIONS).forEach((k) => {
      const v = notes[k].trim()
      if (v) { next[k] = v; n++ }
    })
    if (n) setData((d) => ({ ...d, ...next }))
    notify(n ? n + ' section(s) added to your document' : 'Write some notes first')
  }

  const words = countWords(notes.abstract)

  return (
    <>
      <div className="row">
        <div>
          <h2>Research Workspace</h2>
          <p className="sub">Organize your notes, AI suggestions and drafts for each section.</p>
        </div>
        <button className="btn sm" onClick={addToFile}>+ Add to file</button>
      </div>
      <div className="tabs">
        {Object.entries(SECTIONS).map(([k, t]) => (
          <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{t}</button>
        ))}
      </div>
      <div className="card wcol">
        <h3>{SECTIONS[tab]}</h3>
        <p className="mut">{INFO[tab][0]}</p>
        <label>Your notes</label>
        <LimitedTextarea
          key={tab}
          value={notes[tab]}
          onChange={(v) => setNotes({ ...notes, [tab]: v })}
          max={tab === 'abstract' ? ABS_MAX : 0}
          placeholder="Add your notes here..."
        />
        {tab === 'abstract' && (
          <small className={'wcnt' + (words >= ABS_MAX ? ' full' : '')}>{words} / {ABS_MAX} words{words >= ABS_MAX ? ' (limit reached)' : ''}</small>
        )}
        <div className="sug"><b>AI suggestions</b><p>{INFO[tab][1]}</p></div>
      </div>
    </>
  )
}
