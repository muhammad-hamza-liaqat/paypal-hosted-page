const express = require("express");
const {
  paypalCheckout,
  productPageRender,
} = require("../controller/paypal.controller");
const paypalRoutes = express.Router();

paypalRoutes.post("/paypal/checkout-session", paypalCheckout);
paypalRoutes.get("/paypal/product", productPageRender);


module.exports = paypalRoutes;
