const express = require("express");

const mongoose = require("mongoose");

const app = express();
const { PORT = 3001 } = process.env;
const cors = require("cors");
const { errors } = require("celebrate");

app.use(
  cors({
    origin: [
      "https://weather-wear.ignorelist.com",
      "https://www.weather-wear.ignorelist.com",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

require("dotenv").config();

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

const mainRouter = require("./routes/index");

const errorHandler = require("./middlewares/error-handler");

const { requestLogger } = require("./middlewares/logger");

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());

app.use(requestLogger);

app.use("/", mainRouter);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
