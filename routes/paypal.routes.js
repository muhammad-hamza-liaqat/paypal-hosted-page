const express = require("express");
const { paypalCheckout } = require("../controller/paypal.controller");
const paypalRoutes = express.Router();

paypalRoutes.post("/paypal/payment", paypalCheckout);

module.exports = paypalRoutes