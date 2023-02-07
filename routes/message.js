const express = require("express");
const router = express.Router();
const Message = require("../models/message");

router.get("/", (req, res) => res.send("welcome to messages route"));

router.post("/", async (req, res) => {
  try {
    const data = { ...req.body, location: "sent" };
    const message = new Message(data);
    const newMessage = await message.save();
    res
      .status(201)
      .json({ message: "Message sent successfully", data: newMessage });
  } catch (error) {
    res.status(400).json(error);
  }
});

router.get("/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const messages = await Message.find({ from: email });

    const totalMessages = messages.length;
    const inboxCount = (await Message.find({ from: email, location: "inbox" }))
      .length;
    const trashCount = (await Message.find({ from: email, location: "trash" }))
      .length;
    const sentCount = (await Message.find({ from: email, location: "sent" }))
      .length;

    const analytics = {
      inboxCount,
      sentCount,
      trashCount,
      totalMessages
    };

    res.status(200).json({ data: { messages, analytics } });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.patch("/:messageId", async (req, res) => {
  try {
    const messageId = req.params.messageId;
    const location = req.body.location;
    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      { location },
      { new: true }
    );
    res.status(200).json({ message: "Status changed", data: updatedMessage });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.delete("/:messageId", async (req, res) => {
  try {
    const messageId = req.params.messageId;
    await Message.findByIdAndDelete(messageId);
    res.status(200).json({ message: "Deleted successful" });
  } catch (error) {
    res.status(400).json({ message: "An error occurred", error });
  }
});

module.exports = router;