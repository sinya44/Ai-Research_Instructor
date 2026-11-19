export default function Dashboard({ data, go }) {
  const n = Object.values(data).filter((v) => v.trim()).length
  const badge = n === 0 ? 'Not started' : n === 3 ? 'Complete' : 'In progress'
  return (
    <>
      <h2>Dashboard</h2>
      <div className="banner">
        <h3>Build your research step by step.</h3>
        <p>Learn how each research section works, analyze your uploaded papers with RAG-based support, and organize useful AI-assisted content in your workspace.</p>
      </div>
      <div className="grid3">
        <div className="card"><span className="tag">AI</span><h3>AI Research Instructor</h3><p>Learn Abstract, Introduction and Literature Review with guided prompts.</p><button className="btn sm" onClick={() => go('instructor')}>Start Learning</button></div>
        <div className="card"><span className="tag">PDF</span><h3>Research Paper Analysis</h3><p>Upload up to two papers and compare their findings.</p><button className="btn sm" onClick={() => go('analysis')}>Analyze Paper</button></div>
        <div className="card"><span className="tag">FILE</span><h3>Research Workspace</h3><p>Write notes, collect AI suggestions and build your document.</p><button className="btn sm" onClick={() => go('workspace')}>Open Workspace</button></div>
      </div>
      <div className="card prog">
        <div className="row"><h3>Research Progress</h3><span className="chip">{badge}</span></div>
        <div className="bar"><b style={{ width: (n / 3) * 100 + '%' }} /></div>
        <p className="mut">{n} of 3 sections saved</p>
      </div>
    </>
  )
}
