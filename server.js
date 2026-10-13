const express = require('express')
const fs = require('fs')
const app = express()
const PORT = 3000

app.use(express.json())
app.use(express.static(__dirname))

const pets = require("./data.json");

function savePet() {
    fs.writeFileSync(__dirname + "/data.json", JSON.stringify(pets, null, 4));
}

app.get("/api/pet", (req, res) => {
    res.json(pets); 
});

app.get("/api/pet/:id", (req, res) => {
    const id = Number(req.params.id);
    const foundPet = pets.find(p => p.id === id);

    if (!foundPet) {
        return res.status(404).json({
            message: "Pet not found"
        });
    }
    res.json(foundPet);
});

let nextID = pets.length > 0 ? pets[pets.length - 1].id + 1 : 1;

app.post('/api/pet', (req, res) => {
  const { name, species, breed, age } = req.body;

  if (!name || !species || !breed || !age) {
    return res.status(400).json({ 
        message: "name, species, breed, adn age are required" 
    });
  }

  const newPet = {
    id: nextID++,
    name: name,
    species: species,
    breed: breed,
    age: Number(age),
    adopted: false 
  };

  pets.push(newPet);
  savePet();
  
  res.status(201).json(newPet);
});

app.delete("/api/pet/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = pets.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Pet not found"
        });
    }

    if (pets[index].adopted === true) {
        return res.status(400).json({
            message: "Cannot delete pet adopted"
        });
    }

    pets.splice(index, 1);
    savePet();

    res.json({
        message: "Pet deleted"
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
});
