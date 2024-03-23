const express = require("express");
const { handleLoginAdmin } = require("../controllers/auth.controllers");

const route = express.Router();

route.post("/admin/login", handleLoginAdmin);

module.exports = route;
