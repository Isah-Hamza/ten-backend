require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

//routers
const authRouter = require("./routes/auth");
const reportRouter = require("./routes/report");
const supportRouter = require("./routes/support");
const userRouter = require("./routes/user");
const messageRouter = require("./routes/message");
const analyticsRouter = require("./routes/analytics");
const partnerRouter = require("./routes/partner");
const accountRouter = require("./routes/account");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use("/auth", authRouter);
app.use("/report", reportRouter);
app.use("/support", supportRouter);
app.use("/user", userRouter);
app.use("/message", messageRouter);
app.use("/analytics", analyticsRouter);
app.use("/partners", partnerRouter);
app.use("/account", accountRouter);

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Welcome to Farcry api");
});

mongoose.connect(process.env.DATABASE_URL);
mongoose.set("strictQuery", true);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Database connected"));

app.listen(port, () => console.log("server started on port", port));
