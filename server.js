const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/trails", async (req, res) => {
  try {
    const trails = await prisma.trail.findMany();
    res.json(trails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching trails" });
  }
});

// POST a new trail
app.post("/trails", async (req, res) => {
  try {
    const { name, distanceMiles, difficulty, region } = req.body;

    if (!name || !distanceMiles || !difficulty || !region) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newTrail = await prisma.trail.create({
      data: {
        name,
        distanceMiles: parseFloat(distanceMiles),
        difficulty,
        region,
      },
    });

    res.status(201).json(newTrail);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error creating trail" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
