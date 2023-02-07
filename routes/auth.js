const express = require("express");
const router = express.Router();
const { hashPassword, comparePassword } = require("../utilities/functions");
const User = require("../models/user");
const Account = require("../models/account");

router.get("/", (req, res) => res.send("Hi auth"));

router.post("/login", async (req, res) => {
  const users = await User.find();
  const data = {
    email: req.body.email,
    password: req.body.password
  };

  const userEmail = users.findIndex((user) => user.email === data.email);
  if (userEmail < 0)
    return res.status(400).json({ message: "Incorrect email" });
  const user = users[userEmail];
  if (await comparePassword(req.body.password, user.password)) {
    return res.status(200).json({ user, message: "login successful" });
  } else {
    return res.status(400).json({ message: "Incorrect password" });
  }
});

router.post("/register", async (req, res) => {
  const data = {};
  data.password = await hashPassword(req.body.password);
  data.name = req.body.name;
  data.email = req.body.email;
  data.phone = req.body.phone;
  data.location = req.body.location;

  const users = await User.find();
  const usedEmail = users.findIndex((user) => user.email === data.email);
  if (usedEmail >= 0) {
    return res
      .status(400)
      .json({ message: "Email already exist. Choose another one" });
  }
  try {
    const account = {};
    account.stage = 2;
    account.amountPaying = 4000;
    account.amount = 20000;
    account.amountPaid = 0;
    account.unpaidBalance = account.amount - account.amountPaid;
    account.userEmail = data.email;

    const userAccount = new Account(account);
    const newAccount = await userAccount.save();
    const user = new User(data);
    const newUser = await user.save();
    res
      .status(201)
      .json({ user: newUser, message: "User created successfully" });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

module.exports = router;
