require('dotenv').config();
const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verifyToken');

// Middleware pour vérifier le token JWT
router.get('/me', verifyToken, (req, res) => {
  res.json({
    message: "Accès autorisé",
    user: req.user
  });
});


// Route d'inscription
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPwd = await bcrypt.hash(password, 10);

  db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPwd], function (err) {
    if (err) return res.status(400).json({ error: "Utilisateur déjà existant ou invalide." });
    res.json({ message: "Inscription réussie", id: this.lastID });
  });
});

// Route de connexion
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
    if (err || !user) return res.status(401).json({ error: "Utilisateur non trouvé." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Mot de passe incorrect." });

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });

    res.json({ message: "Connexion réussie", token });
  });
});

module.exports = router;
