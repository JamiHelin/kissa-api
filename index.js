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
function saveCats(cats) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(cats, null, 2), "utf8");
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

// CREATE: POST lisää uusi kissa
app.post("/cats", (req, res) => {
    const { name, breed, age, color, personality, owner } = req.body;
  
    // kevyt validointi
    if (!name || !breed || typeof age !== "number" || !color || !personality || !owner) {
      return res.status(400).json({ error: "Puuttuvia tai virheellisiä kenttiä" });
    }
  
    const cats = loadCats();
    const nextId = cats.length ? Math.max(...cats.map(c => c.id)) + 1 : 1;
  
    const newCat = { id: nextId, name, breed, age, color, personality, owner };
    cats.push(newCat);
    saveCats(cats);
  
    res.status(201).json(newCat);
  });
  
  // UPDATE-toiminto
  app.put("/cats/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    const cats = loadCats();
    const idx = cats.findIndex(c => c.id === id);
  
    if (idx === -1) {
      return res.status(404).json({ error: "Kissaa ei löytynyt" });
    }
  
    const updates = req.body;
  
    // yksinkertainen validointi
    if ("age" in updates && typeof updates.age !== "number") {
      return res.status(400).json({ error: "age tulee olla numero" });
    }
  
    const allowed = ["name", "breed", "age", "color", "personality", "owner"];
    const updated = { ...cats[idx] };
    for (const key of allowed) {
      if (updates[key] !== undefined) updated[key] = updates[key];
    }
    updated.id = cats[idx].id; // id ei muutu
  
    cats[idx] = updated;
    saveCats(cats);
    res.json(updated);
  });  

  // DELETE-toiminto
  app.delete("/cats/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    const cats = loadCats();
    const idx = cats.findIndex(c => c.id === id);
  
    if (idx === -1) {
      return res.status(404).json({ error: "Kissaa ei löytynyt" });
    }
  
    cats.splice(idx, 1);          // poista taulukosta
    saveCats(cats);               // tallenna tiedostoon
    return res.status(204).send(); // No Content
  });

  // GET /cats/breed/:breed → kaikki tietyn rodun kissat
app.get("/cats/breed/:breed", (req, res) => {
    const breedParam = req.params.breed;
    const norm = (s) => s.toString().trim().toLowerCase();
  
    const cats = loadCats();
    const filtered = cats.filter(c => norm(c.breed) === norm(breedParam));
  
    return res.json(filtered);
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
  