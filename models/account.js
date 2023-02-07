const mongoose = require("mongoose");

const accountSchemaa = mongoose.Schema(
  {
    userEmail: String,
    amount: Number,
    amountPaying: Number,
    amountPaid: Number,
    unpaidBalance: Number,
    stage: Number,
    paymentPeriod: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model("Account", accountSchemaa);
