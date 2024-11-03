const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getUserProfile, updateUserProfile, followUser, unfollowUser } = require('../controllers/userController');

// Haal gebruikersprofiel op
router.get('/:id', auth, getUserProfile);

// Update gebruikersprofiel
router.put('/', auth, updateUserProfile);

// Volg een gebruiker
router.post('/follow/:id', auth, followUser);

// Ontvolg een gebruiker
router.post('/unfollow/:id', auth, unfollowUser);

module.exports = router;
