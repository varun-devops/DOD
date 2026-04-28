const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  youtubeUrl: { type: String, required: true, trim: true },
  badge: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Extract YouTube video ID from any YouTube URL format
videoSchema.virtual('embedUrl').get(function () {
  const url = this.youtubeUrl;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|watch\?v=|shorts\/))([a-zA-Z0-9_-]{11})/);
  const id = match ? match[1] : null;
  return id ? `https://www.youtube.com/embed/${id}` : url;
});

videoSchema.virtual('videoId').get(function () {
  const url = this.youtubeUrl;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|watch\?v=|shorts\/))([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
});

videoSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Video', videoSchema);
