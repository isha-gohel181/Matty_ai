import express from 'express';
import passport from '../utils/passport.utils.js';
import ErrorHandler from '../middlewares/error.middleware.js';

const router = express.Router();

// Check if Google OAuth is configured
const isGoogleConfigured = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;

// Initiate Google OAuth
router.get('/google', (req, res, next) => {
  if (!isGoogleConfigured) {
    return next(new ErrorHandler('Google OAuth is not configured', 503));
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

// Google OAuth callback
router.get('/google/callback', (req, res, next) => {
  if (!isGoogleConfigured) {
    return res.redirect('http://localhost:5173/login?error=oauth_not_configured');
  }
  passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login' })(req, res, (err) => {
    if (err) return next(err);
    // On success, continue to token generation
    (async () => {
      try {
        const user = req.user;
        
        // Generate JWT tokens for the authenticated user
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        
        // Save refresh token to user
        user.refreshToken = refreshToken;
        await user.save();
        
        // Set cookies
        const options = {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
          sameSite: "Strict"
        };
        
        res.cookie("accessToken", accessToken, options);
        res.cookie("refreshToken", refreshToken, options);
        
        // Redirect to OAuth success page
        res.redirect('http://localhost:5173/oauth-success');
      } catch (error) {
        console.error('OAuth callback error:', error);
        res.redirect('http://localhost:5173/login?error=oauth_failed');
      }
    })();
  });
});

// Logout route for OAuth (optional, since JWT logout exists)
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('http://localhost:5173/login');
  });
});

export default router;