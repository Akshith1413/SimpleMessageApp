const express = require('express');
const router = express.Router();
const { register, login, verifyToken } = require('./auth');
const db = require('./database');

router.post('/register', register); 
router.post('/login', login);

router.get('/messages', verifyToken, (req, res) => {
  db.all(`SELECT users.username, messages.message, messages.timestamp 
          FROM messages 
          JOIN users ON messages.user_id = users.id 
          ORDER BY messages.timestamp`, [], (err, rows) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(rows);
  });
});

router.post('/messages', verifyToken, (req, res) => {
  const { message } = req.body;
  db.run(`INSERT INTO messages (user_id, message) VALUES (?, ?)`, [req.userId, message], function(err) {
    if (err) return res.status(500).send(err);
    res.status(200).send({ id: this.lastID, message, timestamp: new Date().toISOString() });
  });
});

module.exports = router;
