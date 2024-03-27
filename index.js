const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 8002;

const handleConnectionToDB = require("./src/db/config.db");
const adminRoutes = require("./src/routes/auth.routes");
const sellerRoutes = require("./src/routes/seller.routes");

// Middlewares
app.use(express.json());
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
app.use("/api/auth", adminRoutes);
app.use("/api/seller", sellerRoutes);

app.listen(PORT, () => {
  console.log(`App is running on ${PORT}`);
});
