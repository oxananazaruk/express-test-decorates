const express = require("express");
const moment = require("moment");
const fs = require("fs/promises");
const cors = require("cors");
const booksRouter = require("./routes/api/books.js");

const app = express();

app.use(cors());
app.use(express.json());

app.set("json spaces", 4);

app.use(async (req, res, next) => {
  const { method, url } = req;
  const date = moment().format("DD-MM-YYYY_hh:mm:ss");
  await fs.appendFile("./public/server.log", `\n ${method} ${url} ${date}`);
  next();
});

app.use("/api/books", booksRouter);

app.use((req, res) => {
  res.status(404).json({
    message: "Not found",
  });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.listen(3000, () => console.log("Server running"));
