// middleware/verifyToken.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  // Format attendu : Authorization: Bearer <token>
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(403).json({ error: 'Accès refusé. Aucun token fourni.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token invalide.' });

    req.user = user; // utilisateur extrait du token
    next(); // continuer
  });
}

module.exports = verifyToken;
