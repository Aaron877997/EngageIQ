import React, { useState } from 'react'
import PageLayout, { createDashboardNav } from '../components/PageLayout'
import '../styles/AIQuery.css'

function AIQuery({ onNavigate, onBack, connectedPlatforms }) {
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!connectedPlatforms || connectedPlatforms.length === 0) {
      setError('No platform connected. Go back and connect at least one platform.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/ai-query?platforms=' + connectedPlatforms.join(','), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query })
      })
      const data = await res.json()
      setResponse(data.response)
    } catch {
      setError('Failed to get AI response. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const exampleQueries = [
    'Why did my reach drop last week?',
    'Which content type performs best?',
    'What should I post next?'
  ]

  return (
    <PageLayout
      title="AI Natural Language Query"
      subtitle="Ask questions about your social media performance"
      onBack={onBack}
      nav={createDashboardNav(onNavigate, 'ai-query')}
      layout="dashboard"
      className="ai-query-page"
    >
      <div className="query-interface">
        {error && (
          <div className="alert alert-error mb-3">
            <span>⚠️</span>
            <div>{error}</div>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything about your social media performance..."
            disabled={loading}
          />
          <button type="submit" className="btn btn-primary" disabled={loading || !query.trim()}>
            {loading ? 'Thinking...' : 'Ask AI'}
          </button>
        </form>
        <div className="example-buttons">
          {exampleQueries.map(q => (
            <button key={q} type="button" className="btn btn-secondary btn-sm" onClick={() => setQuery(q)}>
              {q}
            </button>
          ))}
        </div>
        {response ? (
          <div className="response">{response}</div>
        ) : (
          <div className="query-placeholder">
            <span>✦</span>
            <p>Ask a question above or pick an example to get AI insights about your performance.</p>
          </div>
        )}
      </div>
    </PageLayout>
  )
}

export default AIQuery
