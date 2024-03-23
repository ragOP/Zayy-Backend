const mongoose = require("mongoose");

async function handleConnectionToDB(mongoURI) {
  return mongoose.connect(mongoURI);
}

module.exports = handleConnectionToDB;
