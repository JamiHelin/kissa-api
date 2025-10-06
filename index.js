const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "cats.json");

app.use(express.json());

// Apufunktiot
function loadCats() {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

// Testi-juuri
app.get("/", (req, res) => {
  res.send("Kissa-API on käynnissä 🐱");
});

// READ: kaikki kissat
app.get("/cats", (req, res) => {
  const cats = loadCats();
  res.json(cats);
});

app.listen(PORT, () => {
  console.log(`Serveri kuuntelee portissa ${PORT}`);
});

// READ: yksi kissa id:llä
app.get("/cats/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    const cats = loadCats();
    const cat = cats.find(c => c.id === id);
  
    if (!cat) {
      return res.status(404).json({ error: "Kissaa ei löytynyt" });
    }
    res.json(cat);
  });
  