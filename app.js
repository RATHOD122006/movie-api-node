// app.js
const express = require('express');
const db = require('./config/db');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');

const movieRoutes = require('./routes/routermovie');

const app = express();

// ====== Config ======
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method')); // supports ?_method=DELETE for forms

// ====== Routes ======
app.use('/', movieRoutes);

// 404
app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

// ====== Start server ======
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
