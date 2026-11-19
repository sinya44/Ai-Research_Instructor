import { useRef, useState } from 'react'

const SITES = {
  'arxiv.org': 'arXiv', 'ncbi.nlm.nih.gov': 'PubMed Central', 'pmc.ncbi.nlm.nih.gov': 'PubMed Central', 'europepmc.org': 'Europe PMC',
  'core.ac.uk': 'CORE', 'mdpi.com': 'MDPI', 'frontiersin.org': 'Frontiers', 'plos.org': 'PLOS', 'journals.plos.org': 'PLOS',
  'nature.com': 'Nature', 'springer.com': 'Springer', 'link.springer.com': 'Springer', 'sciencedirect.com': 'ScienceDirect',
  'wiley.com': 'Wiley', 'onlinelibrary.wiley.com': 'Wiley', 'researchgate.net': 'ResearchGate', 'semanticscholar.org': 'Semantic Scholar',
  'zenodo.org': 'Zenodo', 'biorxiv.org': 'bioRxiv', 'medrxiv.org': 'medRxiv', 'ssrn.com': 'SSRN', 'hindawi.com': 'Hindawi',
  'ieee.org': 'IEEE', 'acm.org': 'ACM', 'dl.acm.org': 'ACM',
}
function siteName(u) {
  try {
    const h = new URL(u).hostname.replace(/^www\./, '')
    if (SITES[h]) return SITES[h]
    const k = Object.keys(SITES).find((d) => h.endsWith('.' + d))
    return k ? SITES[k] : h
  } catch {
    return 'Unknown source'
  }
}

const PROMPTS = ['Compare the findings of both papers', 'Identify possible research gaps', 'Summarize the methodology', 'List key limitations']

export default function Analysis({ notify }) {
  const [topic, setTopic] = useState('')
  const [links, setLinks] = useState([])
  const [found, setFound] = useState(null) // {status, items}
  const [papers, setPapers] = useState([])
  const [sel, setSel] = useState([])
  const [result, setResult] = useState('')
  const [over, setOver] = useState(false)
  const fileRef = useRef(null)

  function downloadPaper(url, name) {
    notify('Downloading...')
    fetch(url)
      .then((r) => { if (!r.ok) throw 0; return r.blob() })
      .then((b) => {
        if (!/pdf/i.test(b.type)) throw 0
        const x = document.createElement('a')
        x.href = URL.createObjectURL(b)
        x.download = name.replace(/[^\w\- ]+/g, '').slice(0, 80).trim() + '.pdf'
        x.click()
        URL.revokeObjectURL(x.href)
        notify('Paper downloaded')
      })
      .catch(() => {
        window.open(url, '_blank', 'noopener')
        notify('Opened in a new tab. Use Save/Download there.')
      })
  }

  async function findPapers(t) {
    setFound({ status: 'loading', items: [] })
    const from = new Date().getFullYear() - 5 + '-01-01'
    const api = 'https://api.openalex.org/works?search=' + encodeURIComponent(t) + '&filter=is_oa:true,type:article,from_publication_date:' + from + '&per-page=25&select=title,publication_year,authorships,best_oa_location,primary_location,open_access'
    try {
      const r = await fetch(api)
      if (!r.ok) throw 0
      const items = ((await r.json()).results || [])
        .map((w) => ({
          title: w.title,
          year: w.publication_year,
          authors: (w.authorships || []).slice(0, 3).map((a) => a.author && a.author.display_name).filter(Boolean).join(', '),
          pdf: (w.best_oa_location && w.best_oa_location.pdf_url) || (w.primary_location && w.primary_location.pdf_url) || '',
          page: (w.open_access && w.open_access.oa_url) || '',
        }))
        .filter((p) => p.title && (p.pdf || p.page))
      const top = [...items.filter((p) => p.pdf), ...items.filter((p) => !p.pdf)].slice(0, 5)
      setFound({ status: top.length ? 'ok' : 'empty', items: top })
    } catch {
      setFound({ status: 'err', items: [] })
    }
  }

  const find = () => {
    const t = topic.trim()
    if (!t) return notify('Enter a research topic first')
    const q = encodeURIComponent(t)
    setLinks([
      ['Google Scholar', 'https://scholar.google.com/scholar?q=' + q],
      ['Semantic Scholar', 'https://www.semanticscholar.org/search?q=' + q],
      ['arXiv', 'https://arxiv.org/search/?searchtype=all&query=' + q],
    ])
    findPapers(t)
  }

  const addFiles = (list) => {
    const next = [...papers]
    ;[...list].forEach((f) => {
      if (!/\.pdf$/i.test(f.name)) return notify('Only PDF files are allowed')
      if (next.length >= 2) return notify('Maximum 2 papers')
      next.push(f.name)
    })
    setPapers(next)
  }

  const start = () => {
    if (!papers.length) return notify('Upload at least one PDF first')
    if (!sel.length) return notify('Select an analysis prompt')
    setResult(
      'Analysis of: ' + papers.join(' and ') + '\n' +
      sel.map((s) => '• ' + s + ' — compare the aims, methods and results of each paper, then note what they leave unanswered.').join('\n') +
      '\nThis is a guided outline. Read the full text to confirm each point.'
    )
  }

  return (
    <>
      <h2>Research Paper Analysis</h2>
      <p className="sub">Enter your topic, find resources, upload papers and run an analysis.</p>

      <div className="card step">
        <h3><em>1</em> Enter Your Research Topic</h3>
        <div className="inl">
          <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Effects of sleep on teenage memory" onKeyDown={(e) => e.key === 'Enter' && find()} />
          <button className="btn sm" onClick={find}>Find Research Resources</button>
        </div>
      </div>

      <div className="card step">
        <h3><em>2</em> Research Resources</h3>
        <p className="mut">Search your topic on these trusted sources.</p>
        <div className="chips">
          {links.map(([n, u]) => <a key={n} className="chip" target="_blank" rel="noopener noreferrer" href={u}>{n}</a>)}
        </div>
        {found && (
          <div className="found">
            {found.status === 'loading' && <p className="msg">Searching recent papers...</p>}
            {found.status === 'empty' && <p className="msg">No open-access papers found. Try a broader topic or use the sources above.</p>}
            {found.status === 'err' && <p className="msg">Could not load papers right now. Check your internet connection and try again.</p>}
            {found.status === 'ok' && (
              <>
                <p className="msg"><b>Recent papers on your topic</b> (click a title to download)</p>
                {found.items.map((p, i) => (
                  <div className="pp" key={i}>
                    <div>
                      <a className="t" href={p.pdf || p.page} target="_blank" rel="noopener noreferrer" onClick={(e) => { if (p.pdf) { e.preventDefault(); downloadPaper(p.pdf, p.title) } }}>{p.title}</a>
                      <small>{p.year}{p.authors ? ' - ' + p.authors : ''}{p.pdf ? ' - PDF' : ' - opens paper page'}</small>
                    </div>
                    <span className="src" title={'Source: ' + siteName(p.pdf || p.page)}>{siteName(p.pdf || p.page)}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      <div className="card step">
        <h3><em>3</em> Upload Research Papers (Max 2 PDFs)</h3>
        <div className="split2">
          <div
            className={'drop' + (over ? ' over' : '')}
            onDragEnter={(e) => { e.preventDefault(); setOver(true) }}
            onDragOver={(e) => { e.preventDefault(); setOver(true) }}
            onDragLeave={(e) => { e.preventDefault(); setOver(false) }}
            onDrop={(e) => { e.preventDefault(); setOver(false); addFiles(e.dataTransfer.files) }}
          >
            <div className="big">☁</div>
            <p>Drag and drop your PDF here or <a className="lnk" onClick={() => fileRef.current.click()}>browse a file</a></p>
            <input ref={fileRef} type="file" accept=".pdf" multiple hidden onChange={(e) => { addFiles(e.target.files); e.target.value = '' }} />
          </div>
          <div>
            <h4>Uploaded Papers</h4>
            <ul className="files">
              {papers.map((n, i) => (
                <li key={n + i}>
                  <span>{n}</span>
                  <button aria-label={'Remove ' + n} onClick={() => setPapers(papers.filter((_, j) => j !== i))}>✕</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="card step">
        <h3><em>4</em> Analysis Prompts</h3>
        <div className="chips">
          {PROMPTS.map((p) => (
            <button key={p} className={'chip' + (sel.includes(p) ? ' on' : '')} onClick={() => setSel(sel.includes(p) ? sel.filter((x) => x !== p) : [...sel, p])}>{p}</button>
          ))}
        </div>
        <div className="right"><button className="btn sm" onClick={start}>Start Analysis →</button></div>
        {result && <div className="guide">{result}</div>}
      </div>
    </>
  )
}
