const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 8000;

const handleConnectionToDB = require("./src/db/config.db");

// Middlewares
app.use(cors());

//Database Connection
handleConnectionToDB(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected To Database!");
  })
  .catch((err) => {
    console.error(`Something went wrong`, err);
  });

//Routes
app.get("/", (req, res) => {
  return res.send("Hello");
});

app.listen(PORT, () => {
  console.log(`App is running on ${PORT}`);
});
