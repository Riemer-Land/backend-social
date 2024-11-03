const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createWorkout, getWorkouts } = require('../controllers/workoutController');
const multer = require('multer');
const path = require('path');

// Multer configuratie (zelfde als bij posts)
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, 'workout-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Controleer bestandstype (zelfde functie als bij posts)

router.post('/', auth, upload.single('afbeelding'), createWorkout);

router.get('/', auth, getWorkouts);

module.exports = router;
