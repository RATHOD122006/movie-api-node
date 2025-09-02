// routes/routermovie.js
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const controller = require('../controllers/controllmovie');

// multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'public', 'uploads'));
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + unique + ext);
  }
});

function fileFilter (req, file, cb) {
  // accept images only
  if (!file.mimetype.startsWith('image/')) {
    cb(new Error('Only image files are allowed!'), false);
  } else {
    cb(null, true);
  }
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

// Routes
router.get('/', controller.getHome);

router.get('/add', controller.showAddForm);
router.post('/add', upload.single('poster'), controller.addMovie);

router.get('/edit/:id', controller.showEditForm);
router.post('/update/:id', upload.single('poster'), controller.editMovie);

// delete confirm page
router.get('/delete/:id', controller.showDeletePage);
// actual delete (using POST for form; method-override can support DELETE via ?_method=DELETE)
router.post('/delete/:id', controller.deleteMovie);

module.exports = router;
