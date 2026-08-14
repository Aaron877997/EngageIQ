import React, { useState } from 'react';
import { auth } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import '../styles/AuthModal.css';

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (tab === 'login') {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (onSuccess) onSuccess(userCredential.user);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (onSuccess) onSuccess(userCredential.user);
      }
      onClose();
    } catch (err) {
      console.error('Firebase Auth Error:', err);
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cm-modal-overlay" onClick={onClose}>
      <div className="cm-auth-card" onClick={(e) => e.stopPropagation()}>
        <div className="cm-auth-header">
          <h2>💫 Conjugate Media</h2>
          <p>Sign in with your <strong>EngageIQ</strong> credentials to control social data under your account.</p>
        </div>

        <div className="cm-auth-tabs">
          <button
            type="button"
            className={`cm-auth-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => { setTab('login'); setError(''); }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`cm-auth-tab ${tab === 'register' ? 'active' : ''}`}
            onClick={() => { setTab('register'); setError(''); }}
          >
            Register
          </button>
        </div>

        {error && <div className="cm-alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="cm-form-group">
            <label className="cm-form-label">Account Email:</label>
            <input
              type="email"
              className="cm-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., user@example.com"
              required
            />
          </div>

          <div className="cm-form-group">
            <label className="cm-form-label">Password:</label>
            <input
              type="password"
              className="cm-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="cm-auth-actions">
            <button
              type="button"
              className="cm-btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cm-btn-submit"
              disabled={loading}
            >
              {loading ? 'Authenticating...' : tab === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
