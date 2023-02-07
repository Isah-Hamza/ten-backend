const express = require("express");
const router = express.Router();

const Account = require("../models/account");

router.get("/", (req, res) => res.send("hi, account route"));

router.get("/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const userAccount = await Account.find({ email: email });
    res.status(200).json({ data: userAccount });
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

router.post("/deposit", async (req, res) => {
  try {
    const email = req.body.email;
    const amount = req.body.amount;
    const userAccount = await Account.findOne({ email: email });
    userAccount.amountPaid = userAccount.amountPaid + amount;
    userAccount.unpaidBalance = userAccount.amount - userAccount.amountPaid;

    if (userAccount.amountPaid >= userAccount.amount) {
      userAccount.stage = userAccount.stage + 1;
      // using stage go get the amount to give the user
      if (userAccount.stage == 2) {
        userAccount.amount = 20000;
        userAccount.amountPaying = 4000;
      } else if (userAccount.stage == 3) {
        userAccount.amount = 30000;
        userAccount.amountPaying = 6000;
      } else if (userAccount.stage == 4) {
        userAccount.amount = 50000;
        userAccount.amountPaying = 10000;
      } else {
        userAccount.amount = 100000;
        userAccount.amountPaying = 0;
        userAccount.unpaidBalance = 0;
      }
      // end of the stage and amound deduction
      userAccount.amountPaid = 0;
      userAccount.unpaidBalance = userAccount.amount - userAccount.amountPaid;
    }

    const res = await Account.findOneAndUpdate({ email: email }, userAccount, {
      new: true
    });
    res.status(200).json({ data: res });
  } catch (error) {
    res.status(400).json({ error: error });
  }
  
});

module.exports = router;
