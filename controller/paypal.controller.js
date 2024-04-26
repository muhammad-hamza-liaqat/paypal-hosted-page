const paypal = require("paypal-rest-sdk");

// mode: "live" for live production
paypal.configure({
  mode: "sandbox",
  client_id: process.env.paypal_client_id,
  client_secret: process.env.paypal_secret_key,
});

const paypalCheckout = async (req, res) => {
  // Prepare the payment object
  const paymentData = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "http://localhost:3000/success", 
      cancel_url: "http://localhost:3000/cancel",
    },
    transactions: [
      {
        amount: {
          total: "10.00", 
          currency: "USD",
        },
        description: "Description of the transaction",
      },
    ],
  };

  paypal.payment.create(paymentData, (error, payment) => {
    if (error) {
      console.error(error);
      return res.status(500).send("Failed to create payment.");
    } else {
      // Redirect to PayPal for approval
      for (let link of payment.links) {
        if (link.rel === "approval_url") {
          return res.redirect(link.href);
        }
      }
      return res.status(500).send("No approval_url found in response.");
    }
  });
};

const productPageRender = async (req, res) => {
  res.render("product.pug");
};

module.exports = {
  paypalCheckout,
  productPageRender,
};
