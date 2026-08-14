import React, { useState } from 'react';

const CATEGORIES = [
  'AI & Tech',
  'Marketing & Growth',
  'Business & Leadership',
  'Creator Economy',
  'Product Launch',
  'Education',
  'General'
];

export default function PostCreator({
  defaultPlatform = 'instagram',
  onCreatePost
}) {
  const [platform, setPlatform] = useState(defaultPlatform === 'all' ? 'instagram' : defaultPlatform);
  const [postType, setPostType] = useState('video');
  const [category, setCategory] = useState('AI & Tech');
  const [caption, setCaption] = useState('');
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [durationSec, setDurationSec] = useState(25);
  const [hasSubtitles, setHasSubtitles] = useState(true);
  const [hookRating, setHookRating] = useState(9);
  const [hasTextOverlay, setHasTextOverlay] = useState(true);
  const [slideCount, setSlideCount] = useState(5);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Sync platform if changed in navbar
  React.useEffect(() => {
    if (defaultPlatform !== 'all') {
      setPlatform(defaultPlatform);
    }
  }, [defaultPlatform]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption.trim()) return;

    setIsPublishing(true);
    try {
      await onCreatePost({
        platform,
        postType,
        category,
        caption,
        mediaSpecs: {
          aspectRatio,
          durationSec: Number(durationSec),
          hasSubtitles,
          hookRating: Number(hookRating),
          hasTextOverlay,
          slideCount: Number(slideCount)
        }
      });
      setCaption('');
      setIsExpanded(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="cm-creator-card">
      <div className="cm-creator-top" onClick={() => setIsExpanded(!isExpanded)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span style={{ fontSize: '1.4rem' }}>✍️</span>
          <div>
            <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '1rem', fontWeight: 700 }}>
              Create & Publish New Social Post
            </h4>
            <p style={{ margin: '0.2rem 0 0 0', color: '#94a3b8', fontSize: '0.8rem' }}>
              Publish with full media specs & category to modulate performance
            </p>
          </div>
        </div>
        <button
          type="button"
          className="cm-creator-toggle-btn"
        >
          {isExpanded ? 'Collapse ▲' : 'Open Post Studio ▼'}
        </button>
      </div>

      {isExpanded && (
        <form onSubmit={handleSubmit} className="cm-creator-form">
          <div className="cm-creator-grid">
            {/* Target Platform */}
            <div className="cm-form-group">
              <label className="cm-form-label">Platform:</label>
              <select
                className="cm-input"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
              >
                <option value="instagram">📸 Instagram</option>
                <option value="twitter">𝕏 X (Twitter)</option>
                <option value="linkedin">🔗 LinkedIn</option>
                <option value="facebook">👥 Facebook</option>
              </select>
            </div>

            {/* Post Format */}
            <div className="cm-form-group">
              <label className="cm-form-label">Post Format:</label>
              <select
                className="cm-input"
                value={postType}
                onChange={(e) => {
                  const val = e.target.value;
                  setPostType(val);
                  if (val === 'video') setAspectRatio('9:16');
                  else if (val === 'carousel') setAspectRatio('4:5');
                  else if (val === 'image') setAspectRatio('1:1');
                }}
              >
                <option value="video">🎬 Short Video / Reel (9:16)</option>
                <option value="carousel">📑 Multi-Slide Carousel (4:5)</option>
                <option value="image">🖼️ Static Image Post (1:1)</option>
                <option value="text">💬 Text Thread / Article</option>
              </select>
            </div>

            {/* Category */}
            <div className="cm-form-group">
              <label className="cm-form-label">Category:</label>
              <select
                className="cm-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Media Details */}
            {postType === 'video' && (
              <div className="cm-form-group">
                <label className="cm-form-label">Duration ({durationSec}s):</label>
                <input
                  type="range"
                  min="5"
                  max="90"
                  value={durationSec}
                  onChange={(e) => setDurationSec(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
            )}

            {postType === 'carousel' && (
              <div className="cm-form-group">
                <label className="cm-form-label">Slide Count ({slideCount} slides):</label>
                <input
                  type="range"
                  min="2"
                  max="10"
                  value={slideCount}
                  onChange={(e) => setSlideCount(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
            )}
          </div>

          {/* Caption Input */}
          <div className="cm-form-group" style={{ marginTop: '0.75rem' }}>
            <label className="cm-form-label">Caption / Post Content:</label>
            <textarea
              rows={4}
              className="cm-input"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write your engaging post caption, hooks, or thought leadership content..."
              required
            />
          </div>

          <div className="cm-creator-actions">
            <button
              type="submit"
              className="cm-btn-submit"
              disabled={isPublishing || !caption.trim()}
            >
              {isPublishing ? 'Publishing to Feed...' : `🚀 Publish to ${platform.toUpperCase()}`}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
