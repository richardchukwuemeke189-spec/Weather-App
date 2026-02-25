const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/db');
const path = require('path');
const fs = require('fs');

exports.registerUser = async (req, res) => {
  try {
    console.log('Register request body:', req.body);
    console.log('Register request file:', req.file);

    const { username, email, location, bio, password } = req.body;
    const photo = req.file;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required.' });
    }

    // Check if user already exists
    const result = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save photo filename or null
    const photoFilename = photo ? photo.filename : null;

    // Insert user into database
    const insertResult = await db.query(
      `INSERT INTO users (photo, username, email, location, bio, password)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, username, email, location, bio, photo`,
      [photoFilename, username, email, location || null, bio || null, hashedPassword]
    );

    const user = insertResult.rows[0];
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({ message: 'User registered successfully.', user, token });
  } catch (err) {
    console.error('❌ Registration error:', err);

    if (err.code === '23505') {
      return res.status(400).json({ error: 'Username or email already exists.' });
    }

    res.status(500).json({ error: 'Something went wrong during registration.' });
  }
};

// ===== login user =====
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid email or password' });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        location: user.location,
        bio: user.bio,
        photo: user.photo
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
};

// ===== delete user =====
exports.deleteAccount = async (req, res) => {
  const userId = req.user.id;

  try {
    // 1. Get user's photo filename
    const result = await db.query('SELECT photo FROM users WHERE id = $1', [userId]);
    const user = result.rows[0];

    // 2. Delete photo file if it exists
    if (user?.photo) {
      const photoPath = path.join(__dirname, '../uploads', user.photo);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }

    // 3. Delete related favorites
    await db.query('DELETE FROM favorites WHERE user_id = $1', [userId]);

    // 4. Delete user account
    await db.query('DELETE FROM users WHERE id = $1', [userId]);

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error('Delete account error:', err);
    res.status(500).json({ error: 'Failed to delete account' });
  }
};

// ===== update profile =====
exports.updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { username, email, location, bio } = req.body;
  const photo = req.file;

  try {
    // Get current photo filename
    const result = await db.query('SELECT photo FROM users WHERE id = $1', [userId]);
    const user = result.rows[0];

    let newPhoto = user?.photo;

    // If a new photo is uploaded, delete the old one and update
    if (photo) {
      if (user?.photo) {
        const oldPath = path.join(__dirname, '../uploads', user.photo);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      newPhoto = photo.filename;
    }

    // Update user info
    await db.query(
      'UPDATE users SET username = $1, email = $2, location = $3, bio = $4, photo = $5 WHERE id = $6',
      [username, email, location, bio, newPhoto, userId]
    );

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// ===== change password =====
exports.changePassword = async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Both current and new passwords are required.' });
  }

  try {
    // Get current hashed password
    const result = await db.query('SELECT password FROM users WHERE id = $1', [userId]);
    const user = result.rows[0];
    if (!user) return res.status(404).json({ error: 'User not found.' });

    // Compare current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Current password is incorrect.' });

    // Hash and update new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password = $1 WHERE id = $2', [hashedNewPassword, userId]);

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error('Password update error:', err);
    res.status(500).json({ error: 'Failed to update password.' });
  }
};
