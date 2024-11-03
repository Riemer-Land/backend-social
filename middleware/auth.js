const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Haal token uit header
  const token = req.header('x-auth-token');

  // Controleer of er geen token is
  if (!token) {
    return res.status(401).json({ msg: 'Geen token, autorisatie geweigerd' });
  }

  // Verifieer token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is niet geldig' });
  }
};
