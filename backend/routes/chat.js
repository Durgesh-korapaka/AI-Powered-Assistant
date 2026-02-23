const express = require("express");
const router = express.Router();
const db = require("../db");
const askLLM = require("../llm");

router.post("/", async (req, res) => {

  const { sessionId, message } = req.body;

  if (!sessionId || !message) {
    return res.status(400).json({
      error: "sessionId and message required"
    });
  }

  // STEP 1 → Create session if not exists + update updated_at
  db.run(
    `INSERT OR IGNORE INTO sessions(id) VALUES(?)`,
    [sessionId],
    function () {

      db.run(
        `UPDATE sessions 
         SET updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [sessionId]
      );

      // STEP 2 → Insert user message
      db.run(
        `INSERT INTO messages(session_id, role, content)
         VALUES(?,?,?)`,
        [sessionId, "user", message],
        function () {

          // STEP 3 → Fetch last 20 messages
          db.all(
            `
            SELECT role, content 
            FROM messages 
            WHERE session_id = ?
            ORDER BY created_at DESC
            LIMIT 20
            `,
            [sessionId],
            async (err, rows) => {

              if (err) {
                return res.status(500).json({
                  error: "DB error"
                });
              }

              const reversed = rows.reverse();

              let pairs = [];
              let temp = [];

              for (let msg of reversed) {

                temp.push(`${msg.role}:${msg.content}`);

                if (msg.role === "assistant") {
                  pairs.push(temp.join("\n"));
                  temp = [];
                }

              }

              const last5Pairs = pairs.slice(-5).join("\n");

              try {

                const ai = await askLLM(message, last5Pairs);

                // STEP 4 → Insert assistant reply
                db.run(
                  `INSERT INTO messages(session_id, role, content)
                   VALUES(?,?,?)`,
                  [sessionId, "assistant", ai.reply]
                );

                res.json({
                  reply: ai.reply,
                  tokensUsed: ai.tokensUsed
                });

              } catch (err) {

  console.log("LLM ERROR:", err.response?.data || err.message);

  res.status(500).json({
    error: "LLM Failure"
  });
}

            }
          );

        }
      );

    }
  );

});

module.exports = router;