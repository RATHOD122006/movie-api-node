// models/moviemodule.js
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  director: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  poster: { type: Object, required: true }, // store filename or path like /uploads/filename.jpg
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Movie', movieSchema);
