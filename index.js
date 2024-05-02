const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 8000;

const handleConnectionToDB = require("./src/db/config.db");
const authRoutes = require("./src/routes/auth.routes");
const sellerRoutes = require("./src/routes/seller.routes");
const adminRoutes = require("./src/routes/admin.routes");
const userRoutes = require("./src/routes/user.routes");

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
app.use("/api/auth", authRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

app.listen(PORT, () => {
  console.log(`App is running on ${PORT}`);
});
