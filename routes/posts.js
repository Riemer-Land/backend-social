const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createPost, getFeed, getPostById, updatePost, deletePost, likePost, commentOnPost } = require('../controllers/postController');
const multer = require('multer');
const path = require('path');

// Multer configuratie
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, 'post-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 }, // Max 2MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Controleer bestandstype
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif|mp4|mov/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Afbeeldingen en video’s alleen!');
  }
}

// Maak een nieuwe post
router.post('/', auth, upload.single('media'), createPost);

// Haal feed op
router.get('/feed', auth, getFeed);

// Haal post op via ID
router.get('/:id', auth, getPostById);

// Update post
router.put('/:id', auth, upload.single('media'), updatePost);

// Verwijder post
router.delete('/:id', auth, deletePost);

// Like een post
router.post('/like/:id', auth, likePost);

// Reageer op een post
router.post('/comment/:id', auth, commentOnPost);

// Haal posts op van specifieke gebruiker
//router.get('/user/:id', auth, getPostsByUser);


module.exports = router;
