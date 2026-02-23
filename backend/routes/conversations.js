const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /api/conversations/:sessionId
router.get("/:sessionId", (req, res) => {

  const { sessionId } = req.params;

  if (!sessionId) {
    return res.status(400).json({
      error: "sessionId required"
    });
  }

  db.all(
    `SELECT role, content, created_at 
     FROM messages 
     WHERE session_id = ?
     ORDER BY created_at ASC`,
    [sessionId],
    (err, rows) => {

      if (err) {
        return res.status(500).json({
          error: "DB Error"
        });
      }

      res.json(rows);
    }
  );

});

module.exports = router;