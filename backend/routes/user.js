const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');
const db = require('../models/db');
const upload = require('../utils/upload');

// ===== registration =====
router.post('/register', upload.single('photo'), authController.registerUser);

// ===== get current user =====
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Decoded user ID from token:', userId);

    const result = await db.query(
      'SELECT username, email, location, bio, photo FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] }); // <-- wrap in { user: ... }
  } catch (err) {
    console.error('Error fetching user from database:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});


// ===== account deletion =====
router.delete('/delete', authenticateToken, authController.deleteAccount);

// ===== update info =====
router.put('/update', authenticateToken, upload.single('photo'), authController.updateProfile);

// ===== change password =====
router.put('/password', authenticateToken, authController.changePassword);

module.exports = router;