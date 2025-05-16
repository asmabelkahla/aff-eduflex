/*const express = require('express');
const router = express.Router();
const db = require('../db');

// ➕ Ajouter une note
router.post('/grades', (req, res) => {
  const { user_id, course_id, grade } = req.body;
  db.run("INSERT INTO grades (user_id, course_id, grade) VALUES (?, ?, ?)",
    [user_id, course_id, grade],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Note enregistrée." });
    });
});

// 📊 Voir toutes les notes d’un étudiant
router.get('/grades/:user_id', (req, res) => {
  const { user_id } = req.params;
  db.all("SELECT * FROM grades WHERE user_id = ?", [user_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ grades: rows });
  });
});

module.exports = router;*/


const express = require('express');
const router = express.Router();
const db = require('../db');
const sendValidationEvent = require('../kafka/producer');

router.post('/grades', (req, res) => {
  const { user_id, course_id, grade } = req.body;

  db.run(
    "INSERT INTO grades (user_id, course_id, grade) VALUES (?, ?, ?)",
    [user_id, course_id, grade],
    async function(err) {
      if (err) return res.status(500).json({ error: err.message });

      try {
        await sendValidationEvent(user_id, course_id);
        res.json({ message: "Note enregistrée et event envoyé à Kafka" });
      } catch (error) {
        console.error("Erreur Kafka:", error);
        res.status(500).json({ error: "Erreur lors de l'envoi Kafka" });
      }
    }
  );
});

module.exports = router;
