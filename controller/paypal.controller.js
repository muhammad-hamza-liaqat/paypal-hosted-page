const paypal = require("paypal-rest-sdk");

// mode: "live" for live production
paypal.configure({
  mode: "sandbox",
  client_id: process.env.paypal_client_id,
  client_secret: process.env.paypal_secret_key,
});

// const paypalCheckout = async (req, res) => {
//   const paymentData = {
//     intent: "sale",
//     payer: {
//       payment_method: "paypal",
//     },
//     redirect_urls: {
//       return_url: "http://localhost:3000/success",
//       cancel_url: "http://localhost:3000/cancel",
//     },
//     transactions: [
//       {
//         amount: {
//           total: "10.00",
//           currency: "USD",
//         },
//         description: "Description of the transaction",
//       },
//     ],
//   };

//   paypal.payment.create(paymentData, (error, payment) => {
//     if (error) {
//       console.error(error);
//       return res.status(500).send("Failed to create payment.");
//     } else {
//       // Redirect to PayPal for approval
//       for (let link of payment.links) {
//         if (link.rel === "approval_url") {
//           return res.redirect(link.href);
//         }
//       }
//       return res.status(500).send("No approval_url found in response.");
//     }
//   });
// };

const productPageRender = async (req, res) => {
  res.render("product.pug");
};

const paypalCheckout = async (req, res) => {
  const paymentData = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "http://localhost:3000/api/paypal/success",
      cancel_url: "http://localhost:3000/api/paypal/cancel",
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: "Test Item",
              sku: "ITEM001",
              price: "10.00",
              currency: "USD",
              quantity: 1,
            },
          ],
        },
        amount: {
          total: "10.00",
          currency: "USD",
        },
        description: "Test Description",
      },
    ],
  };

  try {
    paypal.payment.create(paymentData, (error, payment) => {
      if (error) {
        console.error(error);
        res.redirect("/api/paypal/cancel");
      } else {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === "approval_url") {
            res.redirect(payment.links[i].href);
            return;
          }
        }
        res.redirect("/api/paypal/cancel");
      }
    });
  } catch (error) {
    console.error(error);
    res.redirect("/api/paypal/cancel");
  }
};

const cancelPayment = async (req, res) => {
  return res.status(400).json({ message: "the payment was cancelled!" });
};

const successPayment = async (req,res)=>{
    return res.status(200).json({message: "payment is made successfully!"})
}

module.exports = {
  paypalCheckout,
  productPageRender,
  cancelPayment, 
  successPayment
};
