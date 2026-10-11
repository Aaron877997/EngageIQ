import React from 'react';

const PLATFORM_COLORS = {
  instagram: 'linear-gradient(135deg, #ec4899, #f97316)',
  twitter: '#0f172a',
  linkedin: '#0a66c2',
  facebook: '#1877f2',
  youtube: '#FF0000',
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
              Controlling feeds across Instagram, Facebook, X (Twitter), LinkedIn and YouTube. Changes propagate in real-time to EngageIQ!
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
  const avatarImg = ch.avatar || ch.profilePicUrl || ch.image;
  const subscriberCount = Number(ch.followers || ch.subscribers || 0);
  const displayHandle = ch.handle || (ch.username ? `@${ch.username}` : `@${platform}_creator`);

  return (
    <div className="cm-channel-banner">
      <div className="cm-channel-left">
        <div 
          className="cm-channel-avatar" 
          style={{ 
            background: avatarImg ? 'transparent' : platColor,
            overflow: 'hidden'
          }}
        >
          {avatarImg ? (
            <img
              src={avatarImg}
              alt={ch.name || platform}
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }}
            />
          ) : (
            <>
              {platform === 'instagram' && '📸'}
              {platform === 'twitter' && '𝕏'}
              {platform === 'linkedin' && '🔗'}
              {platform === 'facebook' && '👥'}
              {platform === 'youtube' && '▶️'}
            </>
          )}
        </div>
        <div>
          <div className="cm-channel-title">
            <h3>{ch.name || `${platform.toUpperCase()} Channel`}</h3>
            <span className="cm-handle">{displayHandle}</span>
            <span className="cm-badge">{ch.category || (platform === 'youtube' ? 'Video Creator' : 'General')}</span>
          </div>
          <p className="cm-channel-bio">{ch.bio || 'Managing dynamic social feeds.'}</p>
        </div>
      </div>

      <div className="cm-subscribers-box">
        <div className="cm-subs-stat">
          <span className="cm-subs-label">
            {platform === 'youtube' ? 'Subscribers' : 'Followers'}
          </span>
          <span className="cm-subs-val">{subscriberCount.toLocaleString()}</span>
        </div>
        <div className="cm-subs-boosters">
          <button
            type="button"
            className="cm-mod-btn success"
            onClick={() => onModulateSubscribers(platform, 100)}
            title="Add +100"
          >
            +100
          </button>
          <button
            type="button"
            className="cm-mod-btn success"
            onClick={() => onModulateSubscribers(platform, 1000)}
            title="Add +1,000"
          >
            +1,000
          </button>
          <button
            type="button"
            className="cm-mod-btn danger"
            onClick={() => onModulateSubscribers(platform, -500)}
            title="Subtract -500"
          >
            -500
          </button>
        </div>
      </div>
    </div>
  );
}