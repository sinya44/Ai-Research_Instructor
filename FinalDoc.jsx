import { useState } from 'react'
import LimitedTextarea from '../components/LimitedTextarea.jsx'
import { SECTIONS, ABS_MAX } from '../utils/helpers.js'
import { buildDocx } from '../utils/docx.js'

function DocSection({ k, value, onSave }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [hidden, setHidden] = useState(false)
  const label = SECTIONS[k]

  const toggleEdit = () => {
    if (!editing) {
      setDraft(value)
      setHidden(false)
      setEditing(true)
    } else {
      onSave(k, draft.trim())
      setEditing(false)
    }
  }

  return (
    <div className="dsec">
      <div className="hd">
        <h3>{label}</h3>
        <button className="btn alt sm ed" onClick={toggleEdit}>{editing ? 'Save' : 'Edit'}</button>
        <button className={'chev' + (hidden ? ' open' : '')} aria-label="Toggle section" onClick={() => setHidden(!hidden)}>⌄</button>
      </div>
      {!hidden && <div className="body">{value || 'Your ' + label.toLowerCase() + ' content and suggestions will appear here.'}</div>}
      {editing && <LimitedTextarea value={draft} onChange={setDraft} max={k === 'abstract' ? ABS_MAX : 0} />}
    </div>
  )
}

export default function FinalDoc({ data, setData, notify }) {
  const save = (k, v) => {
    setData((d) => ({ ...d, [k]: v }))
    notify(SECTIONS[k] + ' saved')
  }
  const download = () => {
    const blob = buildDocx(Object.keys(SECTIONS).map((k) => [SECTIONS[k], data[k] || '(empty)']))
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'research-document.docx'
    document.body.append(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(a.href), 1000)
    notify('Document downloaded')
  }
  return (
    <>
      <div className="row">
        <div>
          <h2>Final Document</h2>
          <p className="sub">Your research sections are ready. You can edit, review and download your document.</p>
        </div>
        <button className="btn sm" onClick={download}>⬇ Download Document</button>
      </div>
      <div>
        {Object.keys(SECTIONS).map((k) => <DocSection key={k} k={k} value={data[k]} onSave={save} />)}
      </div>
      <div className="info">
        ⓘ You can edit each section, add your own content, and include AI suggestions.<br />
        <b>The final document will include only these 3 sections: Abstract, Introduction and Literature Review.</b>
      </div>
    </>
  )
}
