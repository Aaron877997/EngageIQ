import React, { useState } from 'react';

const PLATFORM_ICONS = {
  instagram: '📸',
  twitter: '𝕏',
  linkedin: '🔗',
  facebook: '👥'
};

const PLATFORM_TAGS = {
  instagram: { label: 'Instagram Reel/Post', class: 'ig' },
  twitter: { label: 'X (Twitter)', class: 'tw' },
  linkedin: { label: 'LinkedIn Article/Update', class: 'li' },
  facebook: { label: 'Facebook Post', class: 'fb' }
};

export default function PostCard({
  post,
  onModulateMetrics,
  onAddComment,
  onDeletePost
}) {
  const [commentText, setCommentText] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const metrics = post.metrics || {};
  const platKey = (post.platform || 'instagram').toLowerCase().replace('x', 'twitter');
  const platInfo = PLATFORM_TAGS[platKey] || { label: post.platform, class: '' };

  const handleSendComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsCommenting(true);
    try {
      await onAddComment(post.id, {
        user: 'community_member',
        comment: commentText
      });
      setCommentText('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsCommenting(false);
    }
  };

  const commentsList = post.commentsList || [];

  return (
    <div className={`cm-post-card ${platInfo.class}`}>
      {/* Post Header */}
      <div className="cm-post-header">
        <div className="cm-post-user-info">
          <div className="cm-post-avatar">
            {PLATFORM_ICONS[platKey] || '📱'}
          </div>
          <div>
            <div className="cm-post-author-row">
              <span className="cm-post-author">
                {platKey === 'twitter' ? '@creator_ai' : platKey === 'instagram' ? 'engage_creator' : 'EngageIQ Creator'}
              </span>
              <span className="cm-post-platform-tag">{platInfo.label}</span>
            </div>
            <span className="cm-post-date">
              {new Date(post.createdAt || Date.now()).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>

        <div className="cm-post-top-right">
          <span className="cm-category-badge">{post.category || 'General'}</span>
          <button
            type="button"
            className="cm-delete-btn"
            onClick={() => onDeletePost(post.id)}
            title="Delete this simulated post"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Post Format & Media Specs */}
      <div className="cm-post-specs-row">
        <span className="cm-spec-pill">
          {post.postType === 'video' ? '🎬 Short Video' : post.postType === 'carousel' ? '📑 Carousel' : post.postType === 'image' ? '🖼️ Image' : '💬 Text'}
        </span>
        {post.mediaSpecs?.durationSec > 0 && (
          <span className="cm-spec-pill">⏱️ {post.mediaSpecs.durationSec}s</span>
        )}
        {post.mediaSpecs?.aspectRatio && (
          <span className="cm-spec-pill">📐 {post.mediaSpecs.aspectRatio}</span>
        )}
        <span className="cm-score-pill">
          ⚡ Score: <strong>{metrics.engagementScore || 75}</strong>/100
        </span>
      </div>

      {/* Caption Content */}
      <div className="cm-post-body">
        <p className="cm-post-caption">{post.caption || post.text || ''}</p>
      </div>

      {/* Metrics & Modulators Bar */}
      <div className="cm-metrics-modulator-grid">
        {/* Likes */}
        <div className="cm-metric-mod-box">
          <div className="cm-metric-info">
            <span className="cm-metric-name">❤️ Likes</span>
            <span className="cm-metric-number">{(metrics.likes || 0).toLocaleString()}</span>
          </div>
          <div className="cm-mod-btn-group">
            <button
              type="button"
              className="cm-mod-btn success"
              onClick={() => onModulateMetrics(post.id, { likesDelta: 50 })}
              title="Add 50 likes"
            >
              +50
            </button>
            <button
              type="button"
              className="cm-mod-btn success"
              onClick={() => onModulateMetrics(post.id, { likesDelta: 200 })}
              title="Add 200 likes"
            >
              +200
            </button>
            <button
              type="button"
              className="cm-mod-btn danger"
              onClick={() => onModulateMetrics(post.id, { likesDelta: -50 })}
              title="Subtract 50 likes"
            >
              -50
            </button>
          </div>
        </div>

        {/* Comments */}
        <div className="cm-metric-mod-box">
          <div className="cm-metric-info">
            <span className="cm-metric-name">💬 Comments</span>
            <span className="cm-metric-number">{(metrics.comments || 0).toLocaleString()}</span>
          </div>
          <div className="cm-mod-btn-group">
            <button
              type="button"
              className="cm-mod-btn success"
              onClick={() => onModulateMetrics(post.id, { commentsDelta: 10 })}
              title="Add 10 comments"
            >
              +10
            </button>
            <button
              type="button"
              className="cm-mod-btn success"
              onClick={() => onModulateMetrics(post.id, { commentsDelta: 50 })}
              title="Add 50 comments"
            >
              +50
            </button>
            <button
              type="button"
              className="cm-mod-btn danger"
              onClick={() => onModulateMetrics(post.id, { commentsDelta: -10 })}
              title="Subtract 10 comments"
            >
              -10
            </button>
          </div>
        </div>

        {/* Shares */}
        <div className="cm-metric-mod-box">
          <div className="cm-metric-info">
            <span className="cm-metric-name">🔁 Shares</span>
            <span className="cm-metric-number">{(metrics.shares || 0).toLocaleString()}</span>
          </div>
          <div className="cm-mod-btn-group">
            <button
              type="button"
              className="cm-mod-btn success"
              onClick={() => onModulateMetrics(post.id, { sharesDelta: 15 })}
              title="Add 15 shares"
            >
              +15
            </button>
            <button
              type="button"
              className="cm-mod-btn success"
              onClick={() => onModulateMetrics(post.id, { sharesDelta: 50 })}
              title="Add 50 shares"
            >
              +50
            </button>
            <button
              type="button"
              className="cm-mod-btn danger"
              onClick={() => onModulateMetrics(post.id, { sharesDelta: -10 })}
              title="Subtract 10 shares"
            >
              -10
            </button>
          </div>
        </div>

        {/* Dislikes / Negative Signal */}
        <div className="cm-metric-mod-box">
          <div className="cm-metric-info">
            <span className="cm-metric-name">👎 Dislikes</span>
            <span className="cm-metric-number">{(metrics.dislikes || 0).toLocaleString()}</span>
          </div>
          <div className="cm-mod-btn-group">
            <button
              type="button"
              className="cm-mod-btn warning"
              onClick={() => onModulateMetrics(post.id, { dislikesDelta: 5 })}
              title="Add 5 dislikes"
            >
              +5
            </button>
            <button
              type="button"
              className="cm-mod-btn warning"
              onClick={() => onModulateMetrics(post.id, { dislikesDelta: 20 })}
              title="Add 20 dislikes"
            >
              +20
            </button>
            <button
              type="button"
              className="cm-mod-btn danger"
              onClick={() => onModulateMetrics(post.id, { dislikesDelta: -5 })}
              title="Subtract 5 dislikes"
            >
              -5
            </button>
          </div>
        </div>
      </div>

      {/* Reach & Views Indicator */}
      <div className="cm-reach-row">
        <span>👁️ Reach: <strong>{(metrics.reach || 1000).toLocaleString()}</strong></span>
        {metrics.videoViews > 0 && (
          <span>▶️ Video Views: <strong>{metrics.videoViews.toLocaleString()}</strong></span>
        )}
        <button
          type="button"
          className="cm-toggle-comments-btn"
          onClick={() => setShowComments(!showComments)}
        >
          {showComments ? `Hide Comments (${commentsList.length}) ▲` : `Show Comments (${commentsList.length}) ▼`}
        </button>
      </div>

      {/* Interactive Comments Drawer */}
      {showComments && (
        <div className="cm-comments-drawer">
          <form onSubmit={handleSendComment} className="cm-comment-form">
            <input
              type="text"
              className="cm-comment-input"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a community comment (sentiment is analyzed automatically)..."
              disabled={isCommenting}
            />
            <button
              type="submit"
              className="cm-comment-submit-btn"
              disabled={isCommenting || !commentText.trim()}
            >
              {isCommenting ? '...' : 'Post'}
            </button>
          </form>

          <div className="cm-comments-list">
            {commentsList.length === 0 ? (
              <p className="cm-no-comments">No comments yet. Write one above!</p>
            ) : (
              commentsList.map((c) => (
                <div key={c.id || Math.random()} className="cm-comment-item">
                  <div className="cm-comment-header">
                    <span className="cm-comment-user">@{c.user || 'user'}</span>
                    <span className={`cm-sentiment-tag ${c.sentiment || 'neutral'}`}>
                      {c.sentiment === 'positive' ? '😊 Positive' : c.sentiment === 'negative' ? '⚠️ Negative' : '😐 Neutral'}
                    </span>
                  </div>
                  <p className="cm-comment-text">{c.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
