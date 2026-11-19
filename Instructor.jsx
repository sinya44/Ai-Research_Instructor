import { useState } from 'react'

const GUIDE = {
  abstract: 'Abstract guide\n• State the problem in one sentence.\n• Describe your method briefly.\n• Report the main result.\n• Finish with what it means.\nTry writing each part in your own words, then check the length (150–250 words).',
  introduction: 'Introduction guide\n• Start with the broad topic and why it matters.\n• Narrow to the gap in current knowledge.\n• End with your research question or aim.\nAsk yourself: what does my reader need to know first?',
  literature: 'Literature Review guide\n• Group sources by theme, not by author.\n• Compare methods and results.\n• Point out where studies disagree.\n• Show how your work fills the gap.',
  feedback: 'Writing feedback tips\n• Keep one idea per paragraph.\n• Prefer short, direct sentences.\n• Define technical terms on first use.\n• Read aloud to catch unclear phrasing.',
}
const CARDS = [
  ['abstract', 'Abstract', 'Learn what a strong abstract includes.'],
  ['introduction', 'Introduction', 'Frame the problem and your research question.'],
  ['literature', 'Literature Review', 'Organize and compare existing studies.'],
  ['feedback', 'Writing feedback', 'Get tips to sharpen clarity and structure.'],
]

export default function Instructor() {
  const [sel, setSel] = useState('')
  return (
    <>
      <h2>AI Research Instructor</h2>
      <p className="sub">We help you build your research skills with guided prompts, not complete answers.</p>
      <div className="card">
        <h3>Predefined Prompts</h3>
        <div className="grid2" style={{ marginTop: 14 }}>
          {CARDS.map(([k, t, d]) => (
            <div key={k} className={'pcard' + (sel === k ? ' on' : '')} onClick={() => setSel(k)}>
              <h4>{t} ›</h4>
              <p>{d}</p>
            </div>
          ))}
        </div>
        {sel && <div className="guide">{GUIDE[sel]}</div>}
      </div>
      <div className="info">ⓘ The AI will provide guidance, examples and suggestions based on your needs. It will not generate a complete section or research paper.</div>
    </>
  )
}
