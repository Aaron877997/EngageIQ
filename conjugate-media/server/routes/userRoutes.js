/**
 * Conjugate Media Server - User Account & Verification Routes
 */

const express = require('express');
const router = express.Router();
const conjugateStore = require('../services/conjugateStore');

/**
 * Check if a user has an account on Conjugate Media
 * GET /api/users/check?email=user@example.com
 */
router.get('/check', (req, res) => {
  const userEmail = req.query.email || req.query.userEmail || req.headers['x-user-email'];

  if (!userEmail) {
    return res.status(400).json({
      success: false,
      message: 'Email query parameter or x-user-email header is required.'
    });
  }

  const cleanEmail = conjugateStore.normalizeUserKey(userEmail);
  const exists = conjugateStore.hasUserAccount(cleanEmail);

  return res.json({
    success: true,
    hasAccount: exists,
    email: cleanEmail,
    message: exists
      ? `Conjugate Media account confirmed for ${cleanEmail}`
      : `No Conjugate Media account found for ${cleanEmail}. Please register on Conjugate Media first.`
  });
});

/**
 * Register or activate a user on Conjugate Media
 * POST /api/users/register
 * Body: { email: 'user@example.com' }
 */
router.post('/register', async (req, res) => {
  const userEmail = req.body.email || req.body.userEmail || req.headers['x-user-email'];

  if (!userEmail) {
    return res.status(400).json({
      success: false,
      message: 'User email is required to register a Conjugate Media profile.'
    });
  }

  try {
    const userProfile = await conjugateStore.registerUser(userEmail, req.body);
    return res.status(201).json({
      success: true,
      message: `Account registered successfully on Conjugate Media for ${userProfile.email}`,
      user: userProfile
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Failed to register Conjugate Media user.'
    });
  }
});

module.exports = router;
