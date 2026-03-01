const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { authenticateToken } = require('../middleware/authMiddleware');

// ===== Get all favorites =====
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT city_name FROM favorites WHERE user_id = $1',
      [req.user.id]
    );
    const cities = result.rows.map(row => row.city_name);
    res.json({ favorites: cities });
  } catch (err) {
    console.error('Error fetching favorites:', err);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// ===== Add a favorite =====
router.post('/', authenticateToken, async (req, res) => {
  const { city } = req.body;
  const userId = Number(req.user.id);

  if (!city) {
    return res.status(400).json({ error: 'City name is required.' });
  }

  try {
    await db.query(
      'INSERT INTO favorites (user_id, city_name) VALUES ($1, $2)',
      [userId, city]
    );
    res.status(201).json({ message: 'City added to favorites' });
  } catch (err) {
    console.error('❌ Error adding favorite:', err);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
});

// ===== Remove a favorite =====
router.delete('/:city', authenticateToken, async (req, res) => {
  const { city } = req.params;
  const userId = Number(req.user.id);

  try {
    await db.query(
      'DELETE FROM favorites WHERE user_id = $1 AND city_name = $2',
      [userId, city]
    );
    res.json({ message: 'City removed from favorites' });
  } catch (err) {
    console.error('❌ Error removing favorite:', err);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});

module.exports = router;