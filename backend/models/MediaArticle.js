const mongoose = require('mongoose');

const mediaArticleSchema = new mongoose.Schema({
  source: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  articleUrl: { type: String, required: true, trim: true },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('MediaArticle', mediaArticleSchema);
