const express = require("express");
const app = express();
var cors = require("cors");

const PORT = process.env.PORT || 8000;

// Middlewares
app.use(cors());

//Routes
app.get("/", (req, res) => {
  return res.send("Hello");
});

app.listen(PORT, () => {
  console.log(`App is running on ${PORT}`);
});
