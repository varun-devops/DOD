const express = require('express');
const Video = require('../models/Video');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/videos  (PUBLIC)
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: videos });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/videos/all  (ADMIN)
router.get('/all', protect, async (req, res) => {
  try {
    const videos = await Video.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: videos });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/videos  (ADMIN)
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, youtubeUrl, badge, order } = req.body;
    if (!title || !youtubeUrl) {
      return res.status(400).json({ success: false, message: 'Title and YouTube URL are required' });
    }
    const video = await Video.create({
      title,
      description: description || '',
      youtubeUrl,
      badge: badge || '',
      order: order ? parseInt(order) : 0,
    });
    res.status(201).json({ success: true, message: 'Video added successfully', data: video });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/videos/:id  (ADMIN)
router.put('/:id', protect, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });

    const { title, description, youtubeUrl, badge, order, isActive } = req.body;
    if (title) video.title = title;
    if (description !== undefined) video.description = description;
    if (youtubeUrl) video.youtubeUrl = youtubeUrl;
    if (badge !== undefined) video.badge = badge;
    if (order !== undefined) video.order = parseInt(order);
    if (isActive !== undefined) video.isActive = isActive === 'true' || isActive === true;

    await video.save();
    res.json({ success: true, message: 'Video updated successfully', data: video });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/videos/:id  (ADMIN)
router.delete('/:id', protect, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });

    await video.deleteOne();
    res.json({ success: true, message: 'Video deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
