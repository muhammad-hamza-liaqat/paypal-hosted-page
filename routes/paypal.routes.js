const express = require("express");
const {
  paypalCheckout,
  productPageRender,
  cancelPayment,
  webHookEvent,
  successPayment,
} = require("../controller/paypal.controller");
const paypalRoutes = express.Router();

paypalRoutes.post("/paypal/checkout-session", paypalCheckout);
paypalRoutes.get("/paypal/product", productPageRender);
paypalRoutes.get("/paypal/cancel", cancelPayment);
paypalRoutes.get("/paypal/success", successPayment);
paypalRoutes.post("/payment/webhook", webHookEvent);

module.exports = paypalRoutes;
