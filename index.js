const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Kissa-API on käynnissä 🐱");
});

app.listen(PORT, () => {
  console.log(`Serveri kuuntelee portissa ${PORT}`);
});
