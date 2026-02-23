const docs = require("./docs.json");

function askLLM(question, history) {

  const lowerQ = question.toLowerCase();

  for (let doc of docs) {

    if (lowerQ.includes(doc.title.toLowerCase())) {

      return Promise.resolve({
        reply: doc.content,
        tokensUsed: 5
      });

    }

  }

  return Promise.resolve({
    reply: "Sorry, I don’t have information about that.",
    tokensUsed: 3
  });

}

module.exports = askLLM;