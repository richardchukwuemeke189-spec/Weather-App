const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Route imports
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const weatherRoutes = require('./routes/weather');
const favoritesRoutes = require('./routes/favorites');

// Middleware imports
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
const app = express();

// ===== CORS Configuration =====
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://lume-weather.onrender.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// ===== Middleware =====
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===== Routes =====
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/favorites', favoritesRoutes);

// ===== Error Handling =====
app.use(errorHandler);

// ===== Server Startup =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

app.get('/api/auth/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ connected: true, time: result.rows[0] });
  } catch (err) {
    console.error('DB test error:', err);
    res.status(500).json({ connected: false, error: err.message });
  }
});