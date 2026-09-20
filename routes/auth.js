const express = require('express');
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Step 1: Redirect user to GitHub for authorization
router.get('/github', (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: process.env.GITHUB_CALLBACK_URL,
    scope: 'read:user',
  });
  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
});

// Step 2: GitHub redirects back here with a code
router.get('/github/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Missing OAuth code');
  }

  try {
    // Exchange code for GitHub access token
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GITHUB_CALLBACK_URL,
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      return res.status(401).send('Failed to obtain GitHub access token');
    }

    // Fetch GitHub user profile
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: 'application/json',
      },
    });

    const githubUser = await userRes.json();

    // Issue our own application JWT
    const appJwt = jwt.sign(
      {
        user_id: String(githubUser.id),
        username: githubUser.login,
        avatar: githubUser.avatar_url,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Store JWT in Secure, HttpOnly cookie named 'token'
    res.cookie('token', appJwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Redirect to dashboard
    res.redirect('/dashboard');
  } catch (err) {
    console.error('OAuth callback error:', err);
    res.status(500).send('Authentication failed');
  }
});

// Logout: clear the token cookie
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

// Return current user info (used by React to check auth state)
router.get('/me', (req, res) => {
  const token = req.cookies && req.cookies.token;
  if (!token) return res.json({ user: null });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user: decoded });
  } catch {
    res.json({ user: null });
  }
});

module.exports = router;
