const express = require('express');
const passport = require('passport');
const router = express.Router();

// GET /auth/google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile']
  })
);
// Get /auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/'
  }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

// logout user
router.get('/logout', (req, res) => {
  req.logout();
  req.redirect('/');
});

module.exports = router;
