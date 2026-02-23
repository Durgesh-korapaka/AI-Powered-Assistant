const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /api/sessions
router.get("/", (req, res) => {

  db.all(
    `SELECT id, updated_at 
     FROM sessions
     ORDER BY updated_at DESC`,
    [],
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