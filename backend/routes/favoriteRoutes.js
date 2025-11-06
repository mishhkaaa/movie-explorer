const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// 🟢 Add to favorites
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { movieId, title, posterPath, rating } = req.body;

    if (!movieId) {
      return res.status(400).json({ error: 'movieId required' });
    }

    // 🟩 first define user, then check it
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const alreadyExists = user.favorites.some(f => f.movieId === movieId);
    if (alreadyExists) {
      return res.status(400).json({ error: 'Already added' });
    }

    user.favorites.push({ movieId, title, posterPath, rating });
    await user.save();

    res.json({ message: 'Added to favorites', favorites: user.favorites });
  } catch (err) {
    console.error('Add favorite error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// 🟢 Get all favorites
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.favorites);
  } catch (err) {
    console.error('Fetch favorites error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// 🟢 Remove a favorite
router.delete('/:movieId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.favorites = user.favorites.filter(f => f.movieId !== req.params.movieId);
    await user.save();

    res.json({ message: 'Removed', favorites: user.favorites });
  } catch (err) {
    console.error('Delete favorite error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
