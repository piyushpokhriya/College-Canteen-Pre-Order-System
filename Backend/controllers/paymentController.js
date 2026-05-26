exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const dummyOrder = {
      id: "dummy_order_" + Date.now(),
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      status: "created",
      paymentMode: "DUMMY",
    };

    res.status(200).json(dummyOrder);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Dummy payment order creation failed",
    });
  }
};