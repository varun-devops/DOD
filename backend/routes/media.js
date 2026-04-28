const express = require('express');
const MediaArticle = require('../models/MediaArticle');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/media  (PUBLIC)
router.get('/', async (req, res) => {
  try {
    const articles = await MediaArticle.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: articles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/media/all  (ADMIN)
router.get('/all', protect, async (req, res) => {
  try {
    const articles = await MediaArticle.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: articles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/media  (ADMIN)
router.post('/', protect, async (req, res) => {
  try {
    const { source, title, description, articleUrl, order } = req.body;
    if (!source || !title || !articleUrl) {
      return res.status(400).json({ success: false, message: 'Source, title and article URL are required' });
    }
    const article = await MediaArticle.create({
      source,
      title,
      description: description || '',
      articleUrl,
      order: order ? parseInt(order) : 0,
    });
    res.status(201).json({ success: true, message: 'Media article added successfully', data: article });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/media/:id  (ADMIN)
router.put('/:id', protect, async (req, res) => {
  try {
    const article = await MediaArticle.findById(req.params.id);
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });

    const { source, title, description, articleUrl, order, isActive } = req.body;
    if (source) article.source = source;
    if (title) article.title = title;
    if (description !== undefined) article.description = description;
    if (articleUrl) article.articleUrl = articleUrl;
    if (order !== undefined) article.order = parseInt(order);
    if (isActive !== undefined) article.isActive = isActive === 'true' || isActive === true;

    await article.save();
    res.json({ success: true, message: 'Article updated successfully', data: article });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/media/:id  (ADMIN)
router.delete('/:id', protect, async (req, res) => {
  try {
    const article = await MediaArticle.findById(req.params.id);
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });

    await article.deleteOne();
    res.json({ success: true, message: 'Article deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
