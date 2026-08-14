import React from 'react';

const PLATFORM_COLORS = {
  instagram: 'linear-gradient(135deg, #ec4899, #f97316)',
  twitter: '#0f172a',
  linkedin: '#0a66c2',
  facebook: '#1877f2',
  all: 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
};

export default function ChannelProfile({
  platform,
  channelData = {},
  onModulateSubscribers
}) {
  if (platform === 'all') {
    return (
      <div className="cm-channel-banner all-banner">
        <div className="cm-channel-left">
          <div className="cm-channel-avatar">🌐</div>
          <div>
            <div className="cm-channel-title">
              <h3>Multi-Platform Unified Control</h3>
              <span className="cm-badge">Live Sandbox</span>
            </div>
            <p className="cm-channel-bio">
              Controlling feeds across Instagram, Facebook, X (Twitter), and LinkedIn. Changes propagate in real-time to EngageIQ!
            </p>
          </div>
        </div>
      </div>
    );
  }

  const ch = channelData[platform] || {
    platform,
    name: `${platform.toUpperCase()} Channel`,
    handle: `@${platform}_creator`,
    subscribers: 25000,
    category: 'AI & Tech',
    bio: 'Professional creator profile'
  };

  const platColor = PLATFORM_COLORS[platform] || '#2563eb';

  return (
    <div className="cm-channel-banner">
      <div className="cm-channel-left">
        <div className="cm-channel-avatar" style={{ background: platColor }}>
          {platform === 'instagram' && '📸'}
          {platform === 'twitter' && '𝕏'}
          {platform === 'linkedin' && '🔗'}
          {platform === 'facebook' && '👥'}
        </div>
        <div>
          <div className="cm-channel-title">
            <h3>{ch.name || `${platform.toUpperCase()} Channel`}</h3>
            <span className="cm-handle">{ch.handle || `@${platform}_creator`}</span>
            <span className="cm-badge">{ch.category || 'General'}</span>
          </div>
          <p className="cm-channel-bio">{ch.bio || 'Managing dynamic social feeds.'}</p>
        </div>
      </div>

      <div className="cm-subscribers-box">
        <div className="cm-subs-stat">
          <span className="cm-subs-label">Subscribers / Followers</span>
          <span className="cm-subs-val">{Number(ch.subscribers || 0).toLocaleString()}</span>
        </div>
        <div className="cm-subs-boosters">
          <button
            type="button"
            className="cm-mod-btn success"
            onClick={() => onModulateSubscribers(platform, 100)}
            title="Add +100 subscribers"
          >
            +100
          </button>
          <button
            type="button"
            className="cm-mod-btn success"
            onClick={() => onModulateSubscribers(platform, 1000)}
            title="Add +1,000 subscribers"
          >
            +1,000
          </button>
          <button
            type="button"
            className="cm-mod-btn danger"
            onClick={() => onModulateSubscribers(platform, -500)}
            title="Subtract -500 subscribers"
          >
            -500
          </button>
        </div>
      </div>
    </div>
  );
}
