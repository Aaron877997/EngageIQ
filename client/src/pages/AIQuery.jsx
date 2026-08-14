import React, { useState, useEffect } from 'react';
import PageLayout, { createDashboardNav } from '../components/PageLayout';
import '../styles/AIQuery.css';

const MODES = [
  { id: 'nlp', label: 'Ask AI Assistant', icon: '🤖' },
  { id: 'text', label: 'Text Post Optimizer', icon: '✍️' },
  { id: 'image', label: 'Image & Pic Analyzer', icon: '🖼️' },
  { id: 'video', label: 'Video & Reel Predictor', icon: '🎬' },
  { id: 'trends', label: 'Trending Topics', icon: '🔥' },
];

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', icon: '📸' },
  { id: 'twitter', label: 'X (Twitter)', icon: '𝕏' },
  { id: 'linkedin', label: 'LinkedIn', icon: '🔗' },
  { id: 'facebook', label: 'Facebook', icon: '👥' },
];

function AIQuery({ onNavigate, onBack, connectedPlatforms = [] }) {
  const [activeMode, setActiveMode] = useState('nlp');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // ML Model State
  const [mlStatus, setMlStatus] = useState(null);
  const [isRetraining, setIsRetraining] = useState(false);

  // 1. NLP Query State
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState(null);

  // 2. Text Optimizer State
  const [textPlatform, setTextPlatform] = useState('instagram');
  const [draftText, setDraftText] = useState('');
  const [textPrediction, setTextPrediction] = useState(null);

  // 3. Image Analyzer State
  const [imagePlatform, setImagePlatform] = useState('instagram');
  const [aspectRatio, setAspectRatio] = useState('4:5');
  const [imageType, setImageType] = useState('carousel');
  const [slideCount, setSlideCount] = useState(5);
  const [hasTextOverlay, setHasTextOverlay] = useState(true);
  const [imageCaption, setImageCaption] = useState('');
  const [imagePrediction, setImagePrediction] = useState(null);

  // 4. Video Predictor State
  const [videoPlatform, setVideoPlatform] = useState('instagram');
  const [durationSec, setDurationSec] = useState(28);
  const [videoAspect, setVideoAspect] = useState('9:16');
  const [hasSubtitles, setHasSubtitles] = useState(true);
  const [hookRating, setHookRating] = useState(8);
  const [audioType, setAudioType] = useState('trending');
  const [videoCaption, setVideoCaption] = useState('');
  const [videoPrediction, setVideoPrediction] = useState(null);

  // 5. Trending Topics State
  const [trendsPlatform, setTrendsPlatform] = useState('instagram');
  const [trendingData, setTrendingData] = useState(null);
  const [copiedTag, setCopiedTag] = useState('');

  // Fetch ML Model Status and Trends on Mount
  useEffect(() => {
    fetchMlStatus();
  }, []);

  useEffect(() => {
    if (activeMode === 'trends' && !trendingData) {
      fetchTrendingTopics();
    }
  }, [activeMode]);

  const fetchMlStatus = async () => {
    try {
      const res = await fetch('/api/ml/status');
      const data = await res.json();
      setMlStatus(data);
    } catch (e) {
      console.warn('Could not fetch ML status', e);
    }
  };

  const fetchTrendingTopics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/trending-topics');
      const data = await res.json();
      setTrendingData(data.platforms || {});
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Retrain Model on Platform JSON Feed
  const handleRetrainModel = async () => {
    setIsRetraining(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await fetch('/api/ml/train', { method: 'POST' });
      const data = await res.json();
      if (data.model) {
        setMlStatus(data.model);
        setSuccessMsg(`🎉 Dynamic ML Model retrained on ${data.model.sample_count} posts! (R² = ${data.model.r2_score})`);
        setTimeout(() => setSuccessMsg(''), 5000);
      }
    } catch {
      setError('Failed to retrain model.');
    } finally {
      setIsRetraining(false);
    }
  };

  // Ingest Fake Platform JSON Post and Retrain
  const handleSyncNewPlatformPost = async () => {
    setIsRetraining(true);
    setError('');
    try {
      const fakePost = {
        platform: textPlatform,
        post_type: 'video',
        caption_text: 'Live case study: How AI multi-agent teams scaled our release velocity 4x! Swipe for benchmarks. What do you think? #AI #DevTools',
        media_specs: {
          aspect_ratio: '9:16',
          duration_sec: 24,
          has_subtitles: true,
          hook_rating: 9,
          audio_type: 'trending'
        },
        timestamp: new Date().toISOString(),
        day_of_week: 'Thursday',
        hour_of_day: 19,
        metrics: {
          likes: Math.round(1800 + Math.random() * 800),
          comments: Math.round(350 + Math.random() * 200),
          shares: Math.round(220 + Math.random() * 150),
          reach: 52000,
          video_views: 48000
        },
        engagement_score: 93
      };

      const res = await fetch('/api/ml/sync-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ posts: [fakePost] })
      });
      const data = await res.json();
      if (data.model) {
        setMlStatus(data.model);
        setSuccessMsg(`🚀 Ingested new JSON post from ${textPlatform.toUpperCase()} & retrained ML weights!`);
        setTimeout(() => setSuccessMsg(''), 5000);
      }
    } catch {
      setError('Failed to sync new platform post.');
    } finally {
      setIsRetraining(false);
    }
  };

  // Handle Ask AI Query
  const handleQuerySubmit = async (e, customQuery) => {
    if (e) e.preventDefault();
    const queryToUse = customQuery || query;
    if (!queryToUse.trim()) return;

    setError('');
    setLoading(true);
    try {
      const platformParam = connectedPlatforms.length ? connectedPlatforms.join(',') : 'instagram,twitter,linkedin,facebook';
      const res = await fetch(`/api/ai-query?platforms=${platformParam}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: queryToUse })
      });
      const data = await res.json();
      setAiResponse(data);
    } catch {
      setError('Failed to fetch AI answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Text Post Prediction
  const handleTextPredict = async (e) => {
    if (e) e.preventDefault();
    if (!draftText.trim()) {
      setError('Please enter your draft post text or caption.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/predict-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postType: 'text',
          platform: textPlatform,
          text: draftText,
          followers: 12500
        })
      });
      const data = await res.json();
      setTextPrediction(data);
    } catch {
      setError('Failed to predict text engagement.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Image Post Prediction
  const handleImagePredict = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/predict-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postType: 'image',
          platform: imagePlatform,
          aspectRatio,
          imageType,
          slideCount,
          hasTextOverlay,
          caption: imageCaption,
          followers: 12500
        })
      });
      const data = await res.json();
      setImagePrediction(data);
    } catch {
      setError('Failed to analyze image post.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Video Prediction
  const handleVideoPredict = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/predict-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: videoPlatform,
          durationSec,
          aspectRatio: videoAspect,
          hasSubtitles,
          hookRating,
          audioType,
          caption: videoCaption,
          followers: 12500
        })
      });
      const data = await res.json();
      setVideoPrediction(data);
    } catch {
      setError('Failed to analyze video engagement.');
    } finally {
      setLoading(false);
    }
  };

  const examplePrompts = [
    { label: '🔥 What topics are trending on LinkedIn?', q: 'What topics are trending on LinkedIn?' },
    { label: '⏰ Best time to post on Instagram?', q: 'What is the best time to post on Instagram?' },
    { label: '📊 Compare Instagram vs Twitter performance', q: 'Compare Instagram vs Twitter' },
    { label: '🎬 Reels vs Static Posts breakdown', q: 'Which content type performs best between Reels and Static?' },
    { label: '💡 What should I post next for high reach?', q: 'What should I post next?' },
    { label: '📉 Why did engagement drop recently?', q: 'Why did my reach drop last week?' },
  ];

  return (
    <PageLayout
      title="AI Intelligence Studio"
      subtitle="Self-Learning ML Model (Text, Pics, Videos), Natural Language Query, and Platform Trends"
      onBack={onBack}
      nav={createDashboardNav(onNavigate, 'ai-query')}
      layout="dashboard"
      className="ai-query-page"
    >
      <div className="studio-container">
        {/* ML Model Live Status Bar */}
        <div className="ml-status-banner">
          <div className="ml-status-left">
            <span className="ml-pulse-dot" />
            <div className="ml-status-text">
              <span className="ml-status-title">
                🧠 Dynamic ML Engine: <strong>{mlStatus ? `Active (R² = ${mlStatus.r2_score})` : 'Trained'}</strong>
              </span>
              <span className="ml-status-sub">
                Learned from {mlStatus?.sample_count || 40}+ past posts in JSON feed • Auto-calibrated with Ridge Regression
              </span>
            </div>
          </div>
          <div className="ml-status-actions">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleSyncNewPlatformPost}
              disabled={isRetraining}
              title="Simulate receiving new platform post webhook JSON"
            >
              ➕ Ingest Platform JSON Post
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleRetrainModel}
              disabled={isRetraining}
            >
              {isRetraining ? 'Retraining...' : '🔄 Retrain Model'}
            </button>
          </div>
        </div>

        {/* Studio Mode Navigation Bar */}
        <div className="studio-modes">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              className={`studio-mode-btn ${activeMode === m.id ? 'active' : ''}`}
              onClick={() => {
                setActiveMode(m.id);
                setError('');
                setSuccessMsg('');
              }}
            >
              <span className="mode-icon">{m.icon}</span>
              <span className="mode-label">{m.label}</span>
            </button>
          ))}
        </div>

        {successMsg && (
          <div className="alert alert-success">
            <span>✓</span>
            <div>{successMsg}</div>
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            <span>⚠️</span>
            <div>{error}</div>
          </div>
        )}

        {/* ── MODE 1: ASK AI ASSISTANT (NATURAL LANGUAGE QUERY) ── */}
        {activeMode === 'nlp' && (
          <div className="mode-panel">
            <div className="query-card">
              <form onSubmit={(e) => handleQuerySubmit(e)} className="query-input-form">
                <div className="input-wrapper">
                  <span className="input-icon">💬</span>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask anything (e.g., 'What is trending on LinkedIn?', 'Best time to post?', 'Why did reach drop?')..."
                    disabled={loading}
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading || !query.trim()}>
                  {loading ? 'Analyzing...' : 'Ask AI'}
                </button>
              </form>

              <div className="quick-prompts-bar">
                <span className="quick-prompts-label">Quick Insights:</span>
                <div className="quick-prompts-grid">
                  {examplePrompts.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      className="prompt-chip"
                      onClick={() => {
                        setQuery(p.q);
                        handleQuerySubmit(null, p.q);
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {aiResponse ? (
              <div className="ai-response-card">
                <div className="response-header">
                  <div className="response-title-badge">
                    <span className="ai-sparkle">✦</span>
                    <h3>{aiResponse.title || 'AI Analysis Report'}</h3>
                  </div>
                  {aiResponse.intent && (
                    <span className="badge badge-primary">{aiResponse.intent.replace('_', ' ').toUpperCase()}</span>
                  )}
                </div>

                <div className="response-content">
                  {aiResponse.response.split('\n\n').map((paragraph, idx) => {
                    if (paragraph.startsWith('### ')) {
                      return <h4 key={idx} className="resp-h4">{paragraph.replace('### ', '')}</h4>;
                    }
                    if (paragraph.startsWith('- ')) {
                      const items = paragraph.split('\n').map((li, i) => (
                        <li key={i} dangerouslySetInnerHTML={{ __html: li.replace(/^- /, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') }} />
                      ));
                      return <ul key={idx} className="resp-list">{items}</ul>;
                    }
                    return (
                      <p
                        key={idx}
                        dangerouslySetInnerHTML={{
                          __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>')
                        }}
                      />
                    );
                  })}
                </div>

                {aiResponse.meta && (
                  <div className="response-footer-stats">
                    {aiResponse.meta.overallEngagementRate && (
                      <div className="mini-stat">
                        <span className="stat-name">Avg. Engagement</span>
                        <span className="stat-val">{aiResponse.meta.overallEngagementRate}</span>
                      </div>
                    )}
                    {aiResponse.meta.totalReach && (
                      <div className="mini-stat">
                        <span className="stat-name">Total Reach</span>
                        <span className="stat-val">{Number(aiResponse.meta.totalReach).toLocaleString()}</span>
                      </div>
                    )}
                    {aiResponse.meta.bestType && (
                      <div className="mini-stat">
                        <span className="stat-name">Top Format</span>
                        <span className="stat-val">{aiResponse.meta.bestType}</span>
                      </div>
                    )}
                    {aiResponse.meta.topPlatform && (
                      <div className="mini-stat">
                        <span className="stat-name">Best Platform</span>
                        <span className="stat-val">{aiResponse.meta.topPlatform.toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="empty-assistant-placeholder">
                <div className="placeholder-art">✨</div>
                <h3>Ask Anything in Natural Language</h3>
                <p>Query cross-platform metrics, compare formats, discover trending topics, or get advice before you publish.</p>
              </div>
            )}
          </div>
        )}

        {/* ── MODE 2: TEXT POST OPTIMIZER & PRE-POST PREDICTOR ── */}
        {activeMode === 'text' && (
          <div className="mode-panel two-column-studio">
            <div className="studio-input-card">
              <div className="section-title">
                <h3>Draft Text Post / Caption</h3>
                <p>Paste or write your text draft before publishing to get AI score & recommendations.</p>
              </div>

              {/* Platform Selector */}
              <div className="platform-picker">
                <label className="picker-label">Target Platform:</label>
                <div className="platform-toggle-group">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className={`plat-btn ${textPlatform === p.id ? 'active' : ''}`}
                      onClick={() => setTextPlatform(p.id)}
                    >
                      <span>{p.icon}</span> {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Draft Input */}
              <div className="form-group">
                <textarea
                  rows={6}
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                  placeholder="Paste your post caption, hook, or text draft here..."
                  className="post-textarea"
                />
                <div className="text-meta-row">
                  <span>{draftText.length} characters</span>
                  <span>{draftText.trim() ? draftText.trim().split(/\s+/).length : 0} words</span>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={handleTextPredict}
                disabled={loading || !draftText.trim()}
              >
                {loading ? 'Analyzing with ML Model...' : '🔮 Predict Engagement with ML'}
              </button>
            </div>

            {/* Prediction Output */}
            <div className="studio-output-card">
              {textPrediction ? (
                <div className="prediction-results">
                  {/* Score Header */}
                  <div className="score-summary-box">
                    <div className="score-badge-circle">
                      <span className="score-number">{textPrediction.engagementScore}</span>
                      <span className="score-out-of">/100</span>
                    </div>
                    <div className="score-info">
                      <div className="score-tier">
                        <span className={`tier-badge ${textPrediction.tier.toLowerCase()}`}>
                          {textPrediction.tier} ENGAGEMENT TIER
                        </span>
                      </div>
                      <h4 className="score-title">
                        {textPrediction.engagementScore >= 80 ? '🚀 High Virality Potential' : textPrediction.engagementScore >= 60 ? '⚡ Good Baseline Engagement' : '⚠️ Optimization Required'}
                      </h4>
                      <p className="score-sub">Learned Model (R²: {textPrediction.mlMeta?.r2Score || 0.91}) for {textPrediction.platform.toUpperCase()}</p>
                    </div>
                  </div>

                  {/* Feature Contribution Impact */}
                  {textPrediction.mlMeta?.featureContributions && textPrediction.mlMeta.featureContributions.length > 0 && (
                    <div className="learned-impact-box">
                      <span className="impact-title">🧠 ML Feature Impact Breakdown:</span>
                      <div className="impact-tags-list">
                        {textPrediction.mlMeta.featureContributions.slice(0, 4).map((f, i) => (
                          <span key={i} className={`impact-chip ${f.effect}`}>
                            {f.contribution >= 0 ? `+${f.contribution}` : f.contribution} pts: {f.feature.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Predicted Metrics Grid */}
                  <div className="metrics-prediction-grid">
                    <div className="metric-pill">
                      <span className="m-val">{textPrediction.predictedMetrics.reach.toLocaleString()}</span>
                      <span className="m-lbl">Est. Reach</span>
                    </div>
                    <div className="metric-pill">
                      <span className="m-val">{textPrediction.predictedMetrics.likes.toLocaleString()}</span>
                      <span className="m-lbl">Est. Likes</span>
                    </div>
                    <div className="metric-pill">
                      <span className="m-val">{textPrediction.predictedMetrics.comments.toLocaleString()}</span>
                      <span className="m-lbl">Est. Comments</span>
                    </div>
                    <div className="metric-pill">
                      <span className="m-val">{textPrediction.predictedMetrics.shares.toLocaleString()}</span>
                      <span className="m-lbl">Est. Shares</span>
                    </div>
                  </div>

                  {/* Best Time to Post Box */}
                  <div className="timing-box">
                    <span className="timing-icon">⏰</span>
                    <div className="timing-details">
                      <strong>Best Time to Post:</strong>
                      <p>{textPrediction.bestTimeToPost.timeSlot} on {textPrediction.bestTimeToPost.days} (Confidence: {textPrediction.bestTimeToPost.confidence})</p>
                    </div>
                  </div>

                  {/* Actionable Improvements */}
                  <div className="improvements-section">
                    <h4>💡 Actionable Recommendations to Boost Score:</h4>
                    <div className="improvements-list">
                      {textPrediction.improvements.map((item, idx) => (
                        <div key={idx} className="improvement-item">
                          <span className="item-bullet">✦</span>
                          <div>
                            <strong>{item.title}</strong>
                            <p>{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="empty-results-placeholder">
                  <span className="ph-icon">📝</span>
                  <h4>Ready to Analyze Your Post</h4>
                  <p>Input your post caption and choose your platform to get dynamic ML-driven engagement scores and feature impact analysis.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── MODE 3: IMAGE & PIC POST ANALYZER ── */}
        {activeMode === 'image' && (
          <div className="mode-panel two-column-studio">
            <div className="studio-input-card">
              <div className="section-title">
                <h3>Image & Pic Post Setup</h3>
                <p>Configure your image draft specifications to simulate feed performance.</p>
              </div>

              {/* Platform Selector */}
              <div className="platform-picker">
                <label className="picker-label">Platform:</label>
                <div className="platform-toggle-group">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className={`plat-btn ${imagePlatform === p.id ? 'active' : ''}`}
                      onClick={() => setImagePlatform(p.id)}
                    >
                      <span>{p.icon}</span> {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect Ratio */}
              <div className="form-group">
                <label className="form-label">Aspect Ratio / Orientation:</label>
                <div className="choice-group">
                  <button
                    type="button"
                    className={`choice-btn ${aspectRatio === '4:5' ? 'active' : ''}`}
                    onClick={() => setAspectRatio('4:5')}
                  >
                    4:5 Vertical (Best for Feed)
                  </button>
                  <button
                    type="button"
                    className={`choice-btn ${aspectRatio === '1:1' ? 'active' : ''}`}
                    onClick={() => setAspectRatio('1:1')}
                  >
                    1:1 Square
                  </button>
                  <button
                    type="button"
                    className={`choice-btn ${aspectRatio === '16:9' ? 'active' : ''}`}
                    onClick={() => setAspectRatio('16:9')}
                  >
                    16:9 Landscape
                  </button>
                </div>
              </div>

              {/* Post Type (Carousel vs Single vs Infographic) */}
              <div className="form-group">
                <label className="form-label">Post Format:</label>
                <div className="choice-group">
                  <button
                    type="button"
                    className={`choice-btn ${imageType === 'carousel' ? 'active' : ''}`}
                    onClick={() => setImageType('carousel')}
                  >
                    Multi-slide Carousel
                  </button>
                  <button
                    type="button"
                    className={`choice-btn ${imageType === 'infographic' ? 'active' : ''}`}
                    onClick={() => setImageType('infographic')}
                  >
                    Infographic / Chart
                  </button>
                  <button
                    type="button"
                    className={`choice-btn ${imageType === 'single' ? 'active' : ''}`}
                    onClick={() => setImageType('single')}
                  >
                    Single Photo
                  </button>
                </div>
              </div>

              {imageType === 'carousel' && (
                <div className="form-group">
                  <label className="form-label">Number of Slides: {slideCount}</label>
                  <input
                    type="range"
                    min={2}
                    max={10}
                    value={slideCount}
                    onChange={(e) => setSlideCount(Number(e.target.value))}
                    className="slider-input"
                  />
                </div>
              )}

              {/* Text Overlay Toggle */}
              <div className="form-group checkbox-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={hasTextOverlay}
                    onChange={(e) => setHasTextOverlay(e.target.checked)}
                  />
                  <span>Includes Bold Headline / Text on First Image</span>
                </label>
              </div>

              {/* Caption */}
              <div className="form-group">
                <label className="form-label">Accompanying Caption:</label>
                <textarea
                  rows={3}
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder="Caption for this photo post..."
                  className="post-textarea"
                />
              </div>

              <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={handleImagePredict}
                disabled={loading}
              >
                {loading ? 'Analyzing Visual Specs...' : '🖼️ Predict Image Engagement with ML'}
              </button>
            </div>

            {/* Image Output */}
            <div className="studio-output-card">
              {imagePrediction ? (
                <div className="prediction-results">
                  <div className="score-summary-box">
                    <div className="score-badge-circle">
                      <span className="score-number">{imagePrediction.engagementScore}</span>
                      <span className="score-out-of">/100</span>
                    </div>
                    <div className="score-info">
                      <span className={`tier-badge ${imagePrediction.tier.toLowerCase()}`}>
                        {imagePrediction.tier} VISUAL ENGAGEMENT
                      </span>
                      <h4 className="score-title">
                        {imagePrediction.imageSpecs.imageType === 'carousel' ? '🎠 High Retention Carousel' : '📸 Visual Feed Post'}
                      </h4>
                      <p className="score-sub">{imagePrediction.imageSpecs.aspectRatio} format on {imagePrediction.platform.toUpperCase()}</p>
                    </div>
                  </div>

                  {/* Feature Contributions */}
                  {imagePrediction.mlMeta?.featureContributions && (
                    <div className="learned-impact-box">
                      <span className="impact-title">🧠 Learned Visual Weights:</span>
                      <div className="impact-tags-list">
                        {imagePrediction.mlMeta.featureContributions.slice(0, 4).map((f, i) => (
                          <span key={i} className={`impact-chip ${f.effect}`}>
                            {f.contribution >= 0 ? `+${f.contribution}` : f.contribution} pts: {f.feature.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="metrics-prediction-grid">
                    <div className="metric-pill">
                      <span className="m-val">{imagePrediction.predictedMetrics.reach.toLocaleString()}</span>
                      <span className="m-lbl">Est. Reach</span>
                    </div>
                    <div className="metric-pill">
                      <span className="m-val">{imagePrediction.predictedMetrics.likes.toLocaleString()}</span>
                      <span className="m-lbl">Est. Likes</span>
                    </div>
                    <div className="metric-pill">
                      <span className="m-val">{imagePrediction.predictedMetrics.shares.toLocaleString()}</span>
                      <span className="m-lbl">Est. Saves/Shares</span>
                    </div>
                    {imagePrediction.predictedMetrics.swipeThroughRate && (
                      <div className="metric-pill">
                        <span className="m-val">{imagePrediction.predictedMetrics.swipeThroughRate}</span>
                        <span className="m-lbl">Swipe Rate</span>
                      </div>
                    )}
                  </div>

                  <div className="timing-box">
                    <span className="timing-icon">⏰</span>
                    <div className="timing-details">
                      <strong>Best Time to Post:</strong>
                      <p>{imagePrediction.bestTimeToPost.timeSlot} on {imagePrediction.bestTimeToPost.days}</p>
                    </div>
                  </div>

                  <div className="improvements-section">
                    <h4>🎨 Visual & Caption Optimization Tips:</h4>
                    <div className="improvements-list">
                      {imagePrediction.improvements.map((item, idx) => (
                        <div key={idx} className="improvement-item">
                          <span className="item-bullet">✦</span>
                          <div>
                            <strong>{item.title}</strong>
                            <p>{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="empty-results-placeholder">
                  <span className="ph-icon">🖼️</span>
                  <h4>Visual Engagement Engine</h4>
                  <p>Choose aspect ratio and post type to test image draft performance and uncover mobile-first visual tips.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── MODE 4: VIDEO & REEL ML PREDICTOR ── */}
        {activeMode === 'video' && (
          <div className="mode-panel two-column-studio">
            <div className="studio-input-card">
              <div className="section-title">
                <h3>Video / Reel ML Predictor</h3>
                <p>Analyze video duration, framing, captions, and hook velocity before publishing.</p>
              </div>

              {/* Platform Selector */}
              <div className="platform-picker">
                <label className="picker-label">Platform:</label>
                <div className="platform-toggle-group">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className={`plat-btn ${videoPlatform === p.id ? 'active' : ''}`}
                      onClick={() => setVideoPlatform(p.id)}
                    >
                      <span>{p.icon}</span> {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Slider */}
              <div className="form-group">
                <div className="label-with-val">
                  <label className="form-label">Video Duration:</label>
                  <span className="val-chip">{durationSec} seconds</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={120}
                  step={1}
                  value={durationSec}
                  onChange={(e) => setDurationSec(Number(e.target.value))}
                  className="slider-input"
                />
                <span className="form-hint">Sweet spot for Reels & Shorts is 15–35 seconds.</span>
              </div>

              {/* Orientation */}
              <div className="form-group">
                <label className="form-label">Orientation:</label>
                <div className="choice-group">
                  <button
                    type="button"
                    className={`choice-btn ${videoAspect === '9:16' ? 'active' : ''}`}
                    onClick={() => setVideoAspect('9:16')}
                  >
                    📱 9:16 Full Vertical (Reel / Short)
                  </button>
                  <button
                    type="button"
                    className={`choice-btn ${videoAspect === '16:9' ? 'active' : ''}`}
                    onClick={() => setVideoAspect('16:9')}
                  >
                    🖥️ 16:9 Horizontal
                  </button>
                </div>
              </div>

              {/* Hook Quality Slider */}
              <div className="form-group">
                <div className="label-with-val">
                  <label className="form-label">First 3-Second Hook Strength:</label>
                  <span className="val-chip">{hookRating} / 10</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={hookRating}
                  onChange={(e) => setHookRating(Number(e.target.value))}
                  className="slider-input"
                />
                <span className="form-hint">Movement, bold statement, or on-screen text in the first 2.5s.</span>
              </div>

              {/* Subtitles & Audio */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Audio Style:</label>
                  <select value={audioType} onChange={(e) => setAudioType(e.target.value)}>
                    <option value="trending">🔥 Trending Audio / Music</option>
                    <option value="voiceover">🎙️ Clear Voiceover</option>
                    <option value="original">🎵 Original Sound</option>
                    <option value="none">🔇 No Audio</option>
                  </select>
                </div>

                <div className="form-group checkbox-cell">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={hasSubtitles}
                      onChange={(e) => setHasSubtitles(e.target.checked)}
                    />
                    <span>On-Screen Captions / Subtitles</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Video Caption Hook:</label>
                <input
                  type="text"
                  value={videoCaption}
                  onChange={(e) => setVideoCaption(e.target.value)}
                  placeholder="e.g., 'Watch how this simple trick saved us 10 hrs...'"
                />
              </div>

              <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={handleVideoPredict}
                disabled={loading}
              >
                {loading ? 'Calculating Video Retention with ML...' : '🎬 Predict Video Virality & Retention'}
              </button>
            </div>

            {/* Video Output */}
            <div className="studio-output-card">
              {videoPrediction ? (
                <div className="prediction-results">
                  <div className="score-summary-box">
                    <div className="score-badge-circle video-score">
                      <span className="score-number">{videoPrediction.engagementScore}</span>
                      <span className="score-out-of">/100</span>
                    </div>
                    <div className="score-info">
                      <span className={`tier-badge ${videoPrediction.tier.toLowerCase()}`}>
                        VIRALITY INDEX: {videoPrediction.viralityRating}
                      </span>
                      <h4 className="score-title">
                        {videoPrediction.engagementScore >= 85 ? '🌟 High Viral Retention Profile' : '📈 Strong Video Foundation'}
                      </h4>
                      <p className="score-sub">{videoPrediction.videoSpecs.durationSec}s {videoPrediction.videoSpecs.aspectRatio} on {videoPrediction.platform.toUpperCase()}</p>
                    </div>
                  </div>

                  {/* Feature Impact */}
                  {videoPrediction.mlMeta?.featureContributions && (
                    <div className="learned-impact-box">
                      <span className="impact-title">🧠 Learned Video Weights:</span>
                      <div className="impact-tags-list">
                        {videoPrediction.mlMeta.featureContributions.slice(0, 4).map((f, i) => (
                          <span key={i} className={`impact-chip ${f.effect}`}>
                            {f.contribution >= 0 ? `+${f.contribution}` : f.contribution} pts: {f.feature.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="metrics-prediction-grid">
                    <div className="metric-pill">
                      <span className="m-val">{videoPrediction.predictedMetrics.views.toLocaleString()}</span>
                      <span className="m-lbl">Est. Views</span>
                    </div>
                    <div className="metric-pill">
                      <span className="m-val">{videoPrediction.predictedMetrics.retentionRate}</span>
                      <span className="m-lbl">Completion Rate</span>
                    </div>
                    <div className="metric-pill">
                      <span className="m-val">{videoPrediction.predictedMetrics.shares.toLocaleString()}</span>
                      <span className="m-lbl">Est. Shares</span>
                    </div>
                    <div className="metric-pill">
                      <span className="m-val">{videoPrediction.predictedMetrics.watchTimeAvgSec}s</span>
                      <span className="m-lbl">Avg. Watch Time</span>
                    </div>
                  </div>

                  <div className="timing-box">
                    <span className="timing-icon">⏰</span>
                    <div className="timing-details">
                      <strong>Optimal Video Publishing Window:</strong>
                      <p>{videoPrediction.bestTimeToPost.timeSlot} on {videoPrediction.bestTimeToPost.days}</p>
                    </div>
                  </div>

                  <div className="improvements-section">
                    <h4>🎬 Video Production & Retention Optimization:</h4>
                    <div className="improvements-list">
                      {videoPrediction.improvements.map((item, idx) => (
                        <div key={idx} className="improvement-item">
                          <span className="item-bullet">✦</span>
                          <div>
                            <strong>{item.title}</strong>
                            <p>{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="empty-results-placeholder">
                  <span className="ph-icon">🎬</span>
                  <h4>Video ML Optimization Model</h4>
                  <p>Configure video duration, aspect ratio, hook quality, and subtitles to predict watch time and viral reach.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── MODE 5: PLATFORM TRENDING TOPICS ── */}
        {activeMode === 'trends' && (
          <div className="mode-panel">
            {/* Platform Selector Bar */}
            <div className="trends-header-bar">
              <div className="trends-title-group">
                <h3>🔥 Live Platform Trends & Viral Keywords</h3>
                <p>Discover high-momentum topics, benchmarks, and discoverable hashtags platform-by-platform.</p>
              </div>
              <div className="platform-toggle-group">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`plat-btn ${trendsPlatform === p.id ? 'active' : ''}`}
                    onClick={() => setTrendsPlatform(p.id)}
                  >
                    <span>{p.icon}</span> {p.label}
                  </button>
                ))}
              </div>
            </div>

            {trendingData && trendingData[trendsPlatform] ? (
              <div className="trends-content-grid">
                {/* Topic Cards */}
                <div className="topics-column">
                  <h4 className="col-heading">Trending Topics ({trendingData[trendsPlatform].name})</h4>
                  <div className="topic-cards-list">
                    {trendingData[trendsPlatform].trendingTopics.map((item, idx) => (
                      <div key={idx} className="topic-card">
                        <div className="topic-card-top">
                          <span className="topic-badge">Trending #{idx + 1}</span>
                          <span className="growth-tag">{item.growth}</span>
                        </div>
                        <h4 className="topic-name">{item.topic}</h4>
                        <div className="topic-meta">
                          <span>📊 {item.volume}</span>
                          <span>🎥 {item.recommendedFormat}</span>
                        </div>
                        <div className="topic-tags">
                          {item.hashtags.map((tag) => (
                            <span
                              key={tag}
                              className="hashtag-pill"
                              onClick={() => {
                                navigator.clipboard.writeText(tag);
                                setCopiedTag(tag);
                                setTimeout(() => setCopiedTag(''), 2000);
                              }}
                              title="Click to copy tag"
                            >
                              {tag} {copiedTag === tag ? '✓' : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Platform Summary & Best Timing Card */}
                <div className="benchmark-column">
                  <div className="benchmark-card">
                    <h4>Platform Intelligence: {trendingData[trendsPlatform].name}</h4>
                    <div className="stat-row">
                      <span>Avg. Industry Engagement:</span>
                      <strong>{trendingData[trendsPlatform].avgEngagementRate || trendingData[trendsPlatform].account_metrics?.avg_engagement_rate || '4.8%'}</strong>
                    </div>

                    <div className="divider" />

                    <h4>⏰ Peak Engagement Hours:</h4>
                    <div className="time-slots-list">
                      {trendingData[trendsPlatform].bestPostingTimes.map((slot, i) => (
                        <div key={i} className="slot-badge">
                          <strong>{slot.slot}</strong>
                          <span>Days: {slot.days} ({slot.confidence})</span>
                        </div>
                      ))}
                    </div>

                    <div className="divider" />

                    <h4>✨ Recommended Formats:</h4>
                    <ul className="format-list">
                      {trendingData[trendsPlatform].bestContentTypes.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="loading-state">
                <div className="loading-spinner lg" />
                <p>Loading real-time platform trends...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
}

export default AIQuery;
