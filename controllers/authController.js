const { validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registreren
exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { naam, email, wachtwoord } = req.body;

  try {
    // Controleer of gebruiker al bestaat
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'Gebruiker bestaat al' }] });
    }

    user = new User({
      naam,
      email,
      wachtwoord,
    });

    // Hash wachtwoord
    const salt = await bcrypt.genSalt(10);
    user.wachtwoord = await bcrypt.hash(wachtwoord, salt);

    await user.save();

    // JWT token genereren
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Inloggen
exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, wachtwoord } = req.body;

  try {
    // Controleer of gebruiker bestaat
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Ongeldige inloggegevens' }] });
    }

    // Wachtwoord vergelijken
    const isMatch = await bcrypt.compare(wachtwoord, user.wachtwoord);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Ongeldige inloggegevens' }] });
    }

    // JWT token genereren
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
