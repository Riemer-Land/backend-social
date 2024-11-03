const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { registerUser, loginUser } = require('../controllers/authController');

// Registreren
router.post(
  '/register',
  [
    check('naam', 'Naam is verplicht').not().isEmpty(),
    check('email', 'Voer een geldig e-mailadres in').isEmail(),
    check('wachtwoord', 'Wachtwoord moet minimaal 6 tekens zijn').isLength({ min: 6 }),
  ],
  registerUser
);

// Inloggen
router.post(
  '/login',
  [
    check('email', 'Voer een geldig e-mailadres in').isEmail(),
    check('wachtwoord', 'Wachtwoord is verplicht').exists(),
  ],
  loginUser
);

module.exports = router;