const paypal = require("paypal-rest-sdk");

// mode: "live" for live production
paypal.configure({
  mode: "sandbox",
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

const paypalCheckout = async (req, res) => {
  res.send("hello");
};

const productPageRender = async (req,res)=>{
    res.render("product.pug")
}

module.exports = {
  paypalCheckout,
  productPageRender
};
