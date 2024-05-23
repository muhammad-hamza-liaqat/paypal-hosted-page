const paypal = require("paypal-rest-sdk");

// mode: "live" for live production
paypal.configure({
  mode: process.env.PAYPAL_MODE,
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_SECRET_ID,
});

const productPageRender = async (req, res) => {
  res.render("product.pug");
};

const cancelPayment = async (req, res) => {
  return res.status(400).json({ message: "the payment was cancelled!" });
};

// const successPayment = async (req, res) => {
//   return res.status(201).json({message: "payment is successful!"})
// };
const successPayment = async (req, res) => {
  try {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: "USD",
            total: "100.00",
          },
        },
      ],
    };

    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      function (error, payment) {
        if (error) {
          console.error(error.response);
          throw error;
        } else {
          console.log(JSON.stringify(payment));
          return res
            .status(201)
            .json({ message: "payment success!", data: payment });
        }
      }
    );
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ error: "An error occurred while processing the payment." });
  }
};

const paypalCheckout = async (req, res) => {
  const paymentData = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      // return_url: "https://paypal-server.loca.lt/api/paypal/success",
      // cancel_url: "https://paypal-server.loca.lt/api/paypal/cancel",
      cancel_url: "http://localhost:3000/api/paypal/cancel",
      return_url: "http://localhost:3000/api/paypal/success",
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: "Test Item",
              sku: "ITEM001",
              price: "100.00",
              currency: "USD",
              quantity: 1,
            },
          ],
        },
        amount: {
          total: "100.00",
          currency: "USD",
        },
        description: "testing paypal in sandbox- nodejs enviroment",
      },
    ],
    // experience_profile_id: "XP-XXXX-XXXX-XXXX-XXXX"
  };

  try {
    paypal.payment.create(paymentData, (error, payment) => {
      if (error) {
        console.error(
          "an error occured at paypal.payment.create function",
          error.message
        );
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
    console.error(error.message);
    res.redirect("/api/paypal/cancel");
  }
};

const webHookEvent = async (req, res) => {
  const webhookEvent = req.body;

  if (
    webhookEvent.event_type === "PAYMENT.SALE.COMPLETED" ||
    webhookEvent.event_type === "PAYMENT.SALE.DENIED"
  ) {
    const saleId = webhookEvent.resource.id;

    paypal.sale.get(saleId, (error, sale) => {
      if (error) {
        console.error("Error fetching sale details:", error.response);
        return res.status(500).json({ error: "Failed to fetch sale details" });
      }

      console.log("Sale details:", sale);

      return res.status(200).json({ message: "webHook exceuted!", sale: sale });
    });
  } else {
    console.log("Received webhook:", webhookEvent);
    res.status(200).end();
  }
};

module.exports = {
  paypalCheckout,
  productPageRender,
  cancelPayment,
  successPayment,
  webHookEvent,
};
