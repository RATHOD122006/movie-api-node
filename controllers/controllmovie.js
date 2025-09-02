// controllers/controllmovie.js
const Movie = require('../models/moviemodule');
const fs = require('fs');
const path = require('path');

// show home/list
exports.getHome = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.render('home', { movies });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// show add form
exports.showAddForm = (req, res) => {
  res.render('add');
};

// create movie (with multer file available as req.file)
exports.addMovie = async (req, res) => {
  try {
    const { title, director, year, genre } = req.body;
    const posterPath = req.file ? `/uploads/${req.file.filename}` : '';

    const movie = new Movie({
      title,
      director,
      year: year ? Number(year) : undefined,
      genre,
      poster: posterPath
    });

    await movie.save();
    
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving movie');
  }
};

// show edit form
exports.showEditForm = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send('Movie not found');
    res.render('edit', { movie });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// update movie (optionally replace poster)
exports.editMovie = async (req, res) => {
  try {
    const { title, director, year, genre } = req.body;
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send('Movie not found');

    // If a new file uploaded, delete old file
    if (req.file) {
      if (movie.poster) {
        const oldPath = path.join(__dirname, '..', 'public', movie.poster);
        try {
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        } catch (e) {
          console.warn('Failed to delete old poster:', e.message);
        }
      }
      movie.poster = `/uploads/${req.file.filename}`;
    }

    movie.title = title;
    movie.director = director;
    movie.year = year ? Number(year) : undefined;
    movie.genre = genre;

    await movie.save();
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating movie');
  }
};

// show delete confirm page
exports.showDeletePage = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send('Movie not found');
    res.render('delete', { movie });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// delete movie
exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (movie && movie.poster) {
      const posterPath = path.join(__dirname, '..', 'public', movie.poster);
      try {
        if (fs.existsSync(posterPath)) fs.unlinkSync(posterPath);
      } catch (e) {
        console.warn('Failed to delete poster file:', e.message);
      }
    }
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting movie');
  }
};
