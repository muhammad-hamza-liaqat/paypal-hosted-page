const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const paypal = require("./routes/paypal.routes");
const path = require("path");

// middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// template engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// routes
app.use("/api", paypal);

// server
app.listen(process.env.PORT, () => {
  console.log(`server is running at http://localhost:${process.env.PORT}`);
});
