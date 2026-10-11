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
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
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
      if (defaultPlatform === 'youtube') {
        setPostType('video');
        setAspectRatio('16:9');
        setDurationSec(180);
      }
    }
  }, [defaultPlatform]);

  const handlePlatformChange = (newPlatform) => {
    setPlatform(newPlatform);
    if (newPlatform === 'youtube') {
      setPostType('video');
      setAspectRatio('16:9');
      if (durationSec < 60) setDurationSec(180);
    } else if (postType === 'video') {
      setAspectRatio('9:16');
      if (durationSec > 90) setDurationSec(30);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption.trim()) return;

    setIsPublishing(true);
    try {
      // Calculate display duration format (mm:ss) for videos
      const minutes = Math.floor(durationSec / 60);
      const remainingSecs = durationSec % 60;
      const formattedDuration = `${String(minutes).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;

      await onCreatePost({
        platform,
        postType,
        category,
        title: title.trim(),
        caption: caption.trim(),
        content: caption.trim(),
        mediaUrl: mediaUrl.trim(),
        videoUrl: videoUrl.trim(),
        duration: postType === 'video' ? formattedDuration : undefined,
        mediaSpecs: {
          aspectRatio,
          durationSec: Number(durationSec),
          hasSubtitles,
          hookRating: Number(hookRating),
          hasTextOverlay,
          slideCount: Number(slideCount)
        }
      });
      setTitle('');
      setCaption('');
      setMediaUrl('');
      setVideoUrl('');
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
                onChange={(e) => handlePlatformChange(e.target.value)}
              >
                <option value="instagram">📸 Instagram</option>
                <option value="twitter">𝕏 X (Twitter)</option>
                <option value="linkedin">🔗 LinkedIn</option>
                <option value="facebook">👥 Facebook</option>
                <option value="youtube">▶️ YouTube</option>
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
                  if (val === 'video') {
                    setAspectRatio(platform === 'youtube' ? '16:9' : '9:16');
                  } else if (val === 'carousel') {
                    setAspectRatio('4:5');
                  } else if (val === 'image') {
                    setAspectRatio('1:1');
                  }
                }}
              >
                <option value="video">
                  {platform === 'youtube' ? '🎬 YouTube Video (16:9)' : '🎬 Short Video / Reel (9:16)'}
                </option>
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
                <label className="cm-form-label">
                  Duration ({durationSec >= 60 ? `${Math.floor(durationSec / 60)}m ${durationSec % 60}s` : `${durationSec}s`}):
                </label>
                <input
                  type="range"
                  min="5"
                  max={platform === 'youtube' ? '600' : '90'}
                  step={platform === 'youtube' ? '5' : '1'}
                  value={durationSec}
                  onChange={(e) => setDurationSec(Number(e.target.value))}
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

          {/* Optional Title (Recommended for YouTube / Long Articles) */}
          {(platform === 'youtube' || postType === 'text') && (
            <div className="cm-form-group" style={{ marginTop: '0.75rem' }}>
              <label className="cm-form-label">Title / Headline:</label>
              <input
                type="text"
                className="cm-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter an engaging headline or video title..."
              />
            </div>
          )}

          {/* Media & Video URL Inputs */}
          {postType !== 'text' && (
            <div className="cm-creator-grid" style={{ marginTop: '0.75rem' }}>
              <div className="cm-form-group">
                <label className="cm-form-label">Thumbnail / Image URL:</label>
                <input
                  type="url"
                  className="cm-input"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="https://... (image thumbnail or banner)"
                />
              </div>
              {postType === 'video' && (
                <div className="cm-form-group">
                  <label className="cm-form-label">Video / Watch URL:</label>
                  <input
                    type="url"
                    className="cm-input"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... or direct mp4"
                  />
                </div>
              )}
            </div>
          )}

          {/* Caption Input */}
          <div className="cm-form-group" style={{ marginTop: '0.75rem' }}>
            <label className="cm-form-label">Caption / Description:</label>
            <textarea
              rows={4}
              className="cm-input"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write your engaging post caption, hooks, or video description..."
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